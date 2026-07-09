'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="page page-privacy active" id="pagePrivacy">
      {/* Header */}
      <div className="page-header">
        <Link href="/m/profile/settings" className="log-detail-back">&lsaquo;</Link>
        <span className="title">Privacy Policy</span>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px', color: '#8A8580', fontSize: '13px', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '16px' }}>Last updated: July 9, 2025</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>1. Information We Collect</h3>
        <p style={{ marginBottom: '16px' }}>We collect information you provide directly to us, such as when you create an account, place an order, update your account information, or contact us for customer support. This information may include:</p>
        <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
          <li>Name, email address, phone number</li>
          <li>Shipping and billing address</li>
          <li>Payment information</li>
          <li>Order history and preferences</li>
        </ul>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>2. How We Use Your Information</h3>
        <p style={{ marginBottom: '16px' }}>We use the information we collect to:</p>
        <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
          <li>Process and fulfill your orders</li>
          <li>Send you order confirmations and updates</li>
          <li>Provide customer support</li>
          <li>Send you marketing communications (with your consent)</li>
          <li>Improve our website and services</li>
        </ul>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>3. Information Sharing</h3>
        <p style={{ marginBottom: '16px' }}>We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>4. Data Security</h3>
        <p style={{ marginBottom: '16px' }}>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>5. Cookies</h3>
        <p style={{ marginBottom: '16px' }}>We use cookies to understand and save your preferences for future visits, compile aggregate data about site traffic and site interactions, and provide better site experiences and tools in the future.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>6. Your Rights</h3>
        <p style={{ marginBottom: '16px' }}>You have the right to access, update, or delete your personal information at any time. You can do this by logging into your account or contacting us directly.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>7. Changes to This Policy</h3>
        <p style={{ marginBottom: '16px' }}>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>8. Contact Us</h3>
        <p style={{ marginBottom: '16px' }}>If you have any questions about this Privacy Policy, please contact us at privacy@sofa.com.</p>
      </div>
    </div>
  );
}
