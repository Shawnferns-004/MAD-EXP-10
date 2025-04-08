import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:3000/api/chat", { message: input });
      setIsTyping(false);
      const botReply = { sender: "bot", text: res.data.reply };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setIsTyping(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 30,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex flex-col items-end z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-effect rounded-3xl shadow-2xl w-[90vw] sm:w-[400px] h-[70vh] sm:h-[600px] flex flex-col overflow-hidden border border-white/20"
          >
            <div className="dark-glass-effect px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                <h3 className="text-lg font-medium">Assist</h3>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-white/60">
              {messages.length === 0 && (
                <div className="text-center text-gray-600 mt-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black/80 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-medium text-gray-900">Hello, I'm Assist</p>
                  <p className="text-sm mt-2">How may I help you today?</p>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "dark-glass-effect text-white rounded-br-none"
                        : "glass-effect text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-1 px-4 py-3 glass-effect text-gray-900 rounded-2xl rounded-bl-none w-20 ml-2"
                >
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-gray-600 rounded-full"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-600 rounded-full"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-600 rounded-full"
                  />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="glass-effect px-6 py-4 border-t border-white/20">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-2xl bg-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent placeholder-gray-500 text-gray-900"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="dark-glass-effect text-white p-3 rounded-2xl hover:bg-black/80 transition-colors"
                  onClick={sendMessage}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="dark-glass-effect p-4 rounded-full shadow-lg text-white hover:bg-black/80 transition-colors mt-4"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default Chatbot;