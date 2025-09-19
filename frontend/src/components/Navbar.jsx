import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar({
  title = "FloatChat",
  showBackButton = false,
  onBack,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-left">
        {showBackButton && (
          <button onClick={onBack} className="back-btn">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <div className="navbar-title">
          <span className="app-icon">🌊</span>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="navbar-right">
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title="Toggle theme"
        >
          <span className="material-symbols-outlined">
            {darkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <div className="profile-section">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="profile-btn"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-name">Adarsh Jha</div>
                <div className="profile-email">adarsh@floatchat.com</div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                <span className="material-symbols-outlined">settings</span>
                Settings
              </button>
              <button className="dropdown-item">
                <span className="material-symbols-outlined">help</span>
                Help
              </button>
              <button className="dropdown-item danger">
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
