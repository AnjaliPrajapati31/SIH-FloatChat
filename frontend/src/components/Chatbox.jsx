import React, { useState } from "react";

export default function Chatbox({ onSend }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: 'Type: "temperature", "salinity"' },
  ]);

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const userMsg = { from: "user", text };
    setMessages((m) => [...m, userMsg]);

    const reply = onSend(text);
    setMessages((m) => [...m, { from: "bot", text: reply }]);

    setText("");
  }

  return (
    <div className="chatbox-container">
      {/* Header */}
      <div className="chatbox-header">
        <h3>Chat Assistant</h3>
        <button className="toggle-btn">☰</button>
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.from}`}>
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={submit} className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a command..."
        />
        <button type="submit">Send</button>
      </form>

      {/* Styles */}
      <style jsx>{`
        .chatbox-container {
        display: flex;
        flex-direction: column;
        width: 100%;        /* Take full width of left panel */
        height: 100%;       /* Take full height of the panel */
        border-radius: 0;   /* No floating rounded corners */
        overflow: hidden;
        background: #f9f9f9;
        }

        .chatbox-header {
          background: #0077b6;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 15px;
          border-radius: 5px;
        }

        .chatbox-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .toggle-btn {
          background: #0077b6 ;         
          color: white;
          border: none;
          border-radius: 6px;
          padding: 5px 10px;
          cursor: pointer;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .msg {
          max-width: 75%;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
          line-height: 1.4;
        }

        .msg.user {
          align-self: flex-end;
          background: #0077b6;
          color: white;
          border-bottom-right-radius: 0;
        }

        .msg.bot {
          align-self: flex-start;
          background: #e5e5e5;
          color: #333;
          border-bottom-left-radius: 0;
        }

        .chat-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ddd;
          background: #fff;
        }

        .chat-input input {
          flex: 1;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          outline: none;
        }

        .chat-input button {
          margin-left: 8px;
          background: #0077b6;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        }

        .chat-input button:hover {
          background: #005f86;
        }
      `}</style>
    </div>
  );
}
