'use client';

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="page page-settings active" id="pageSettings">
      <div className="page-header">
        <Link href="/m/profile" className="log-detail-back">‹</Link>
        <span className="title">设置与隐私</span>
      </div>
      <div className="settings-list">
        <div className="settings-item">
          <span className="label">推送通知</span>
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="slider" />
          </label>
        </div>
        <div className="settings-item">
          <span className="label">语言</span>
          <span className="value">简体中文</span>
        </div>
        <div className="settings-item">
          <span className="label">货币</span>
          <span className="value">USD ($)</span>
        </div>
        <div className="settings-item">
          <span className="label">清除缓存</span>
          <span className="value arrow">→</span>
        </div>
        <div className="settings-item">
          <span className="label">隐私政策</span>
          <span className="value arrow">→</span>
        </div>
        <div className="settings-item">
          <span className="label">用户协议</span>
          <span className="value arrow">→</span>
        </div>
        <div className="settings-item danger">
          <span className="label">退出登录</span>
        </div>
      </div>
    </div>
  );
}
