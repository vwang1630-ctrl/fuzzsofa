'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="page page-password active" id="pagePassword">
      {/* Header */}
      <div className="page-header">
        <Link href="/m/profile/settings" className="log-detail-back">&lsaquo;</Link>
        <span className="title">Change Password</span>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(168, 168, 168, 0.1)',
          border: '1px solid #A8A8A8',
          borderRadius: '4px',
          margin: '16px',
          color: '#A8A8A8',
          fontSize: '13px',
          textAlign: 'center'
        }}>
          Password changed successfully!
        </div>
      )}

      {/* Form */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            color: '#8A8580',
            marginBottom: '8px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            style={{
              width: '100%',
              padding: '14px 16px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '0',
              color: '#F5F0EB',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            color: '#8A8580',
            marginBottom: '8px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            style={{
              width: '100%',
              padding: '14px 16px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '0',
              color: '#F5F0EB',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            color: '#8A8580',
            marginBottom: '8px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            style={{
              width: '100%',
              padding: '14px 16px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '0',
              color: '#F5F0EB',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <button
          className="panel-confirm-btn"
          onClick={handleSave}
          style={{ width: '100%' }}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
