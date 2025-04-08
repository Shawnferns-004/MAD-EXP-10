import { useState, useEffect, useRef } from "react";
import socket from "../utils/socket";
import Message from "./Message";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Send, Users } from "lucide-react";
import { useApi } from "../context/ApiContext";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const { API_URL } = useApi();

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        if (!username) {
          const userRes = await axios.get(`${API_URL}/auth/${user.email}`);
          const uniqUser = `${userRes.data.name}_${Math.floor(Math.random() * 10000)}`;
          setUsername(localStorage.getItem("username"));
        }

        const messagesRes = await axios.get(`${API_URL}/chat/history`);
        setMessages(messagesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndMessages();
    socket.on("message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off("message");
  }, [username]);

  // Keep the chat always scrolled to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = { username, message };
      socket.emit("message", msgData);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Chat Room
            </h1>
            <span className="text-sm text-gray-500">Welcome, {username}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <Message
              key={index}
              username={msg.username}
              message={msg.message}
              isMine={msg.username === username}
            />
          ))}
          {/* Always scroll to this div */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 md:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
              <textarea
                className="w-full px-4 py-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 resize-none max-h-32 text-base"
                placeholder="Type your message..."
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button
              className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={sendMessage}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
