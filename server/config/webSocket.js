import WebSocket, { WebSocketServer } from "ws";
import Report from "../models/Report.js";

const clients = new Set();

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    clients.add(ws);

    ws.on("close", () => {
      clients.delete(ws);
      console.log("WebSocket connection closed");
    });
  });
};

// Send only the new or updated report to clients
export const sendReportUpdate = async (reportId, isNew = false) => {
  try {
    const report = await Report.findById(reportId);
    if (!report) return;

    const data = JSON.stringify({
      type: isNew ? "new" : "update",
      report,
    });

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  } catch (error) {
    console.error("Error sending report update:", error);
  }
};
