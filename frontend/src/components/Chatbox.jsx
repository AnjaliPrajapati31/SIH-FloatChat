import React, { useState } from "react";

export default function Chatbox({ onSend }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: 'Commands: "temperature/salinity/pressure/depth", "comparison [param]", "compare floats [id1] [id2]", "buoy [id]", "help"',
    },
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
          placeholder="Type a command... (try 'help')"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
