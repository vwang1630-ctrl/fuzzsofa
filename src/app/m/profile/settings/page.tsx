'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD ($)');

  return (
    <div className="page page-settings active" id="pageSettings">
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#0A0A0A",
          borderBottom: "1px solid #1A1A1A",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 100
        }}>
        <Link
          href="/m/profile"
          style={{
            background: "transparent",
            border: "none",
            color: "#E8B4B8",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            textDecoration: "none"
          }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1
          style={{
            color: "#F5F0EB",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "'Cormorant Garamond', Georgia, serif"
          }}>
          Settings
        </h1>
      </div>

      {/* Settings Sections */}
      <div className="settings-sections">
        {/* Account Section */}
        <div className="settings-section">
          <div className="settings-section-title">Account</div>
          <div className="settings-group">
            <Link href="/m/profile/settings/account" className="settings-item">
              <span className="settings-label">Account Information</span>
              <span className="settings-arrow">&rsaquo;</span>
            </Link>
            <Link href="/m/profile/settings/password" className="settings-item">
              <span className="settings-label">Change Password</span>
              <span className="settings-arrow">&rsaquo;</span>
            </Link>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="settings-section">
          <div className="settings-section-title">Preferences</div>
          <div className="settings-group">
            <div className="settings-item">
              <span className="settings-label">Push Notifications</span>
              <label className="settings-toggle">
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="settings-item">
              <span className="settings-label">Language</span>
              <select 
                className="settings-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="settings-item">
              <span className="settings-label">Currency</span>
              <select 
                className="settings-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="settings-section">
          <div className="settings-section-title">Support</div>
          <div className="settings-group">
            <Link href="/m/profile/settings/help" className="settings-item">
              <span className="settings-label">Help Center</span>
              <span className="settings-arrow">&rsaquo;</span>
            </Link>
            <Link href="/m/profile/settings/terms" className="settings-item">
              <span className="settings-label">Terms of Service</span>
              <span className="settings-arrow">&rsaquo;</span>
            </Link>
            <Link href="/m/profile/settings/privacy" className="settings-item">
              <span className="settings-label">Privacy Policy</span>
              <span className="settings-arrow">&rsaquo;</span>
            </Link>
          </div>
        </div>

        {/* Sign Out */}
        <button className="settings-signout">
          Sign Out
        </button>
      </div>
    </div>
  );
}
