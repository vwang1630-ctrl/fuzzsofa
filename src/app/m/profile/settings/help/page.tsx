'use client';

import Link from 'next/link';
import { useState } from 'react';

const faqCategories = [
  {
    title: 'Orders',
    items: [
      { q: 'How do I track my order?', a: 'Go to Orders page and click "Track" button on your order. You will see real-time shipping status and tracking information.' },
      { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 2 hours of placement. Go to Orders page and click "Cancel Order" button.' },
      { q: 'How do I return an item?', a: 'Items can be returned within 30 days of delivery. Go to Orders page, select the order, and click "Return Items".' },
    ]
  },
  {
    title: 'Payment',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept Credit Card (Visa, Mastercard, Amex), PayPal, and Apple Pay.' },
      { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard encryption to protect your payment information.' },
      { q: 'When will I be charged?', a: 'You will be charged immediately when you place your order.' },
    ]
  },
  {
    title: 'Shipping',
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide. Shipping times vary by destination.' },
      { q: 'How much is shipping?', a: 'Standard shipping is free for orders over $100. Otherwise, it is $10. Express shipping is $20.' },
    ]
  },
  {
    title: 'Account',
    items: [
      { q: 'How do I change my password?', a: 'Go to Settings > Change Password. Enter your current password and new password.' },
      { q: 'How do I update my address?', a: 'Go to Addresses page. Click "Edit" on the address you want to update.' },
      { q: 'How do I delete my account?', a: 'Please contact customer support to delete your account.' },
    ]
  }
];

export default function HelpCenterPage() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    setExpandedItem(expandedItem === key ? null : key);
  };

  return (
    <div className="page page-help active" id="pageHelp">
      {/* Header */}
      <div className="page-header">
        <Link href="/m/profile/settings" className="log-detail-back">&lsaquo;</Link>
        <span className="title">Help Center</span>
      </div>

      {/* FAQ Sections */}
      <div style={{ padding: '0 16px' }}>
        {faqCategories.map((category, catIdx) => (
          <div key={catIdx} style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '14px',
              color: '#F5F0EB',
              fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
              letterSpacing: '0.1em',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid #1A1A1A'
            }}>
              {category.title}
            </div>
            {category.items.map((item, idx) => {
              const key = `${catIdx}-${idx}`;
              const isExpanded = expandedItem === key;
              return (
                <div key={idx} style={{
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '0',
                  marginBottom: '8px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => toggleItem(key)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'transparent',
                      border: 'none',
                      color: '#F5F0EB',
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{item.q}</span>
                    <span style={{ color: '#E8B4B8', fontSize: '16px' }}>
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>
                  {isExpanded && (
                    <div style={{
                      padding: '0 16px 14px',
                      color: '#8A8580',
                      fontSize: '12px',
                      lineHeight: '1.6'
                    }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div style={{ padding: '20px 16px', borderTop: '1px solid #1A1A1A' }}>
        <div style={{
          fontSize: '11px',
          color: '#8A8580',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          Still need help?
        </div>
        <div style={{
          fontSize: '13px',
          color: '#F5F0EB',
          marginBottom: '8px'
        }}>
          Email: support@sofa.com
        </div>
        <div style={{
          fontSize: '13px',
          color: '#F5F0EB'
        }}>
          Phone: +1 (888) 123-4567
        </div>
      </div>
    </div>
  );
}
