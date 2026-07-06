'use client';

import Link from 'next/link';

const addresses = [
  { id: 1, name: '张三', phone: '+86 138****5678', line1: '上海市静安区南京西路 1688 号', line2: '静安嘉里中心 T3-2801', default: true },
];

export default function AddressesPage() {
  return (
    <div className="page page-addresses active" id="pageAddresses">
      <div className="page-header">
        <Link href="/m/profile" className="log-detail-back">‹</Link>
        <span className="title">地址管理</span>
      </div>
      {addresses.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          <div className="empty-text">暂无地址</div>
        </div>
      ) : (
        <div className="addr-list" id="addrList">
          {addresses.map((a) => (
            <div key={a.id} className="addr-card">
              <div className="addr-top">
                <span className="addr-name">{a.name}</span>
                <span className="addr-phone">{a.phone}</span>
                {a.default && <span className="addr-default">默认</span>}
              </div>
              <div className="addr-line">{a.line1}</div>
              <div className="addr-line">{a.line2}</div>
              <div className="addr-actions">
                <button className="addr-edit">编辑</button>
                <button className="addr-del">删除</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link href="/m/profile/addresses/new" className="addr-add-btn">+ 新增地址</Link>
    </div>
  );
}
