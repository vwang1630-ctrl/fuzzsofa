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
      <div className="page-header">
        <Link href="/m/profile" className="log-detail-back">&lsaquo;</Link>
        <span className="title">Settings</span>
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
