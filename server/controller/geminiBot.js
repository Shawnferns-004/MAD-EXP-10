import chatmodel from "../config/aiBot.js";

const chat = async (req, res) => {
    try {
        const { message } = req.body;

        // Generate response from Gemini AI

        if (!message || message.trim() === "") {
            return res.json({ reply: "Hi sir, how may I help you?" });
        }

        
        const result = await chatmodel.generateContent(message);
        
        // Extract response properly
        const response = await result.response.text(); // Await the text extraction

        res.json({ reply: response });
    } catch (error) {
        console.error("Chatbot error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default chat;
