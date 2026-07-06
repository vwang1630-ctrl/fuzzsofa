'use client';

import Link from 'next/link';

export default function NewAddressPage() {
  return (
    <div className="page page-addr-form active" id="pageAddrForm">
      <div className="page-header">
        <Link href="/m/profile/addresses" className="log-detail-back">‹</Link>
        <span className="title">添加地址</span>
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
          <label className="checkbox-label">
            <input type="checkbox" /> 设为默认地址
          </label>
        </div>
        <button type="submit" className="btn-primary">保存</button>
      </form>
    </div>
  );
}
