'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="page page-terms active" id="pageTerms">
      {/* Header */}
      <div className="page-header">
        <Link href="/m/profile/settings" className="log-detail-back">&lsaquo;</Link>
        <span className="title">Terms of Service</span>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px', color: '#8A8580', fontSize: '13px', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '16px' }}>Last updated: July 9, 2025</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>1. Acceptance of Terms</h3>
        <p style={{ marginBottom: '16px' }}>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>2. Use License</h3>
        <p style={{ marginBottom: '16px' }}>Permission is granted to temporarily use the materials on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>3. Disclaimer</h3>
        <p style={{ marginBottom: '16px' }}>The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>4. Limitations</h3>
        <p style={{ marginBottom: '16px' }}>In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>5. Revisions and Errata</h3>
        <p style={{ marginBottom: '16px' }}>The materials appearing on this website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>6. Links</h3>
        <p style={{ marginBottom: '16px' }}>We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>7. Site Terms of Use Modifications</h3>
        <p style={{ marginBottom: '16px' }}>We may revise these terms of use for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.</p>

        <h3 style={{ color: '#F5F0EB', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontSize: '16px', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>8. Governing Law</h3>
        <p style={{ marginBottom: '16px' }}>Any claim relating to this website shall be governed by the laws of the United States without regard to its conflict of law provisions.</p>
      </div>
    </div>
  );
}
