'use client';

import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="page page-help active" id="pageHelp">
      <div className="page-header">
        <Link href="/m/profile" className="log-detail-back">‹</Link>
        <span className="title">帮助与反馈</span>
      </div>
      <div className="help-section">
        <div className="help-title">常见问题</div>
        <div className="faq-item">
          <div className="faq-q">如何查看订单状态？</div>
          <div className="faq-a">在「我的订单」页面可以实时查看制作进度和物流信息。</div>
        </div>
        <div className="faq-item">
          <div className="faq-q">支持哪些支付方式？</div>
          <div className="faq-a">支持 Visa、Mastercard、PayPal 及银行转账。</div>
        </div>
        <div className="faq-item">
          <div className="faq-q">可以退换吗？</div>
          <div className="faq-a">手工定制产品不支持无理由退换。如有质量问题，请在收到后 7 天内联系我们。</div>
        </div>
        <div className="faq-item">
          <div className="faq-q">配送需要多久？</div>
          <div className="faq-a">制作周期 1-2 周，配送时间因地区而异，通常 3-7 个工作日。</div>
        </div>
      </div>
      <div className="help-section">
        <div className="help-title">联系我们</div>
        <div className="contact-item">
          <span className="icon">✉️</span>
          <span>studio@fuzzsofa.com</span>
        </div>
        <div className="contact-item">
          <span className="icon">💬</span>
          <span>在线客服（工作日 9:00-18:00）</span>
        </div>
      </div>
      <div className="help-section">
        <div className="help-title">意见反馈</div>
        <textarea className="feedback-input" placeholder="请描述您的问题或建议…" />
        <button className="btn-primary">提交反馈</button>
      </div>
    </div>
  );
}
