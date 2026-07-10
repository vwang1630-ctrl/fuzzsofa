'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NewAddressPage() {
  const [isDefault, setIsDefault] = useState(false);

  return (
    <div className="page page-addr-form active" id="pageAddrForm">
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
          href="/m/profile/addresses"
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
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#F5F0EB",
            margin: 0
          }}>
          添加地址
        </h1>
      </div>
      <form className="addr-form" id="addrForm">
        <div className="form-group">
          <label>收件人</label>
          <input type="text" placeholder="请输入姓名" required />
        </div>
        <div className="form-group">
          <label>手机号码</label>
          <input type="tel" placeholder="+86" required />
        </div>
        <div className="form-group">
          <label>省 / 市 / 区</label>
          <input type="text" placeholder="请选择" required />
        </div>
        <div className="form-group">
          <label>详细地址</label>
          <textarea placeholder="街道、楼栋、门牌号…" required />
        </div>
        <div className="form-group">
          <label className="checkbox-label" onClick={() => setIsDefault(!isDefault)}>
            <span className={`custom-checkbox ${isDefault ? 'checked' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="checkbox-text">设为默认地址</span>
          </label>
        </div>
        <button type="submit" className="btn-primary">保存</button>
      </form>
    </div>
  );
}
