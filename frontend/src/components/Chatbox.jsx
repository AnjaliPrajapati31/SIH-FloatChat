import React, { useState, useRef, useEffect } from "react";

export default function Chatbox({ onSend }) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Welcome to FloatChat! Aapka Jal Saathi \n\nI can help you explore marine buoy data:\n\n• Type 'temperature' to view temperature data\n• Type 'map' to see buoy locations\n• Type 'compare floats 1901910 1902050' to compare buoys\n• Type 'help' for all available commands\n\nWhat would you like to explore?",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(e) {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setText("");
    setIsLoading(true);

    // Add user message immediately
    const userMsg = { from: "user", text: userMessage };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate processing delay for better UX
    setTimeout(() => {
      const reply = onSend(userMessage);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className="chatbox-container">
      {/* Messages Area */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`msg ${msg.from}`}>
            <span>{msg.text}</span>
          </div>
        ))}

        {isLoading && (
          <div className="msg bot">
            <span className="loading">Analyzing data</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={submit} className="chat-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about marine data... (try 'temperature', 'map', or 'help')"
          disabled={isLoading}
          autoComplete="off"
        />
        <button type="submit" disabled={isLoading || !text.trim()}>
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
