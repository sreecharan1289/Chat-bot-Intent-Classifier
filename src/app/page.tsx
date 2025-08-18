"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  intent?: string;
  confidence?: number;
  timestamp: Date;
}

export default function ModernChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hi! I'm your Intent Classifier. Ask me something and I'll classify it.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      if (data.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `⚠️ Error: ${data.error}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Here's the Intent and Confidence!",
          isUser: false,
          intent: data.intent,
          confidence: data.confidence,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "❌ Couldn't connect to the server.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Add Google Fonts for Material Icons */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0" />
      
      {/* Main centering container for the whole chatbox */}
      <div className="flex items-center justify-center min-h-screen bg-purple-50 p-6">
        {/* Chatbox container - Increased width for more breadth */}
        <div className="w-[750px] max-w-4xl h-[600px] rounded-3xl shadow-2xl bg-white overflow-hidden border border-gray-100 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 flex items-center justify-between relative rounded-t-3xl shadow-md">
            <div className="flex items-center gap-4">
              {/* Robot SVG avatar/logo in header */}
              <svg className="w-10 h-10 text-purple-100" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1024 1024">
                <path
                  d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
                  fill="currentColor"
                />
              </svg>
              <h2 className="text-2xl text-white font-bold leading-none">Intent Classifier</h2>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-indigo-100 p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                {!message.isUser && (
                  <svg className="w-8 h-8 mt-auto mr-3 text-indigo-700 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path
                      d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <div
                  className={`px-5 py-3 rounded-2xl max-w-[70%] text-sm shadow-md ${
                    message.isUser
                      ? "bg-blue-500 text-white rounded-br-none ml-auto"
                      : "bg-white text-gray-800 rounded-bl-none mr-auto border border-gray-200"
                  }`}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: message.text,
                    }}
                  />
                  {message.intent && !message.isUser && (
                    <div className="mt-3 text-xs bg-green-50 text-green-800 border border-green-200 p-3 rounded-lg">
                      <strong>Intent:</strong> {message.intent}
                      {message.confidence !== undefined && (
                        <>
                          <br />
                          <strong>Confidence:</strong> {(message.confidence * 100).toFixed(1)}%
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="mb-3 flex justify-start">
                <div className="px-4 py-2 rounded-xl bg-gray-200 text-gray-600 text-sm">
                  <span className="animate-pulse">Processing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer - Input Area */}
          <form
            className="bg-white border-t border-gray-200 flex items-center p-5 gap-3"
            onSubmit={handleSend}
          >
            <textarea
              placeholder="Type your message..."
              className="flex-1 text-sm border border-gray-300 rounded-full py-3 px-5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 h-12 overflow-hidden"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              required
            />
            {/* Send button with better visibility */}
            <button
              type="submit"
              className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 shadow-lg transition-all duration-200 hover:scale-105"
              disabled={!input.trim() || isTyping}
              aria-label="Send"
            >
              {/* Use SVG icon as fallback if Material Icons don't load */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V6m0 0L5 13m7-7l7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
