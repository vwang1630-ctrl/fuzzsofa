'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/app/m/sofaapp.css';

function PaymentContent() {
  const router = useRouter();
  
  const [orderId, setOrderId] = useState('');
  const [items, setItems] = useState<{name: string; color: string; quantity: number; price: number}[]>([]);
  const [total, setTotal] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Validation state
  const [cardError, setCardError] = useState('');
  
  useEffect(() => {
    // 从 sessionStorage 读取订单信息
    const storedOrderId = sessionStorage.getItem('paymentOrderId') || '';
    const storedItems = sessionStorage.getItem('paymentItems') || '[]';
    const storedTotal = sessionStorage.getItem('paymentTotal') || '0';
    
    setOrderId(storedOrderId);
    setTotal(storedTotal);
    
    try {
      const parsedItems = JSON.parse(storedItems);
      setItems(parsedItems);
    } catch (e) {
      setItems([]);
    }
  }, []);
  
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ').substring(0, 19);
  };
  
  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };
  
  const validateCard = () => {
    const cardDigits = cardNumber.replace(/\s/g, '');
    if (cardDigits.length < 16) {
      setCardError('Please enter a valid card number');
      return false;
    }
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setCardError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (cvv.length < 3) {
      setCardError('Please enter a valid CVV');
      return false;
    }
    if (!cardName.trim()) {
      setCardError('Please enter cardholder name');
      return false;
    }
    setCardError('');
    return true;
  };
  
  const handlePayNow = async () => {
    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear payment session data
    sessionStorage.removeItem('paymentOrderId');
    sessionStorage.removeItem('paymentItems');
    sessionStorage.removeItem('paymentTotal');
    
    // Redirect to order success
    const itemsJson = encodeURIComponent(JSON.stringify(items));
    router.push(`/m/order-success?orderId=${orderId}&items=${itemsJson}&total=${total}`);
  };
  
  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-header">
        <Link href="/m/cart" className="shop-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 className="shop-title">Payment</h1>
        <div className="shop-header-right"></div>
      </div>
      
      {/* Content */}
      <div className="shop-content payment-content">
        {/* Order Summary */}
        <section className="payment-section">
          <h2 className="shop-section-title">Order Summary</h2>
          <div className="payment-summary">
            {items.map((item, index) => (
              <div key={index} className="payment-summary-row">
                <span className="payment-item-name">{item.name} - {item.color}</span>
                <span className="payment-item-qty">×{item.quantity}</span>
              </div>
            ))}
            <div className="payment-total-row">
              <span>Total</span>
              <span className="payment-total-amount">$ {total} USD</span>
            </div>
          </div>
        </section>
        
        {/* Payment Method */}
        <section className="payment-section">
          <h2 className="shop-section-title">Payment Method</h2>
          <div className="shop-payment-row">
            <button
              className={`shop-payment-btn ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <span>Credit Card</span>
            </button>
            <button
              className={`shop-payment-btn ${paymentMethod === 'paypal' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.38 5.474 0 5.998 0h7.47c2.836 0 5.083.584 6.628 1.74 1.555 1.166 2.348 2.972 2.348 5.362 0 3.562-1.49 6.286-4.39 8.04-2.896 1.753-6.936 2.635-12.02 2.635H7.076z"/>
              </svg>
              <span>PayPal</span>
            </button>
          </div>
        </section>
        
        {/* Card Details (only show when card selected) */}
        {paymentMethod === 'card' && (
          <section className="payment-section">
            <h2 className="shop-section-title">Card Details</h2>
            <div className="shop-input-row">
              <input
                type="text"
                className="shop-input"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
              <div className="card-fields-row">
                <input
                  type="text"
                  className="shop-input card-field-half"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
                <input
                  type="text"
                  className="shop-input card-field-half"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                  maxLength={4}
                />
              </div>
              <input
                type="text"
                className="shop-input"
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
              {cardError && <p className="card-error">{cardError}</p>}
            </div>
          </section>
        )}
        
        {/* PayPal Info (only show when PayPal selected) */}
        {paymentMethod === 'paypal' && (
          <section className="payment-section paypal-notice">
            <p>You will be redirected to PayPal to complete your payment securely.</p>
          </section>
        )}
      </div>
      
      {/* Bottom Bar */}
      <div className="shop-bottom-bar">
        <button 
          className="shop-submit-btn"
          onClick={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="processing-text">
              <svg className="processing-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${total}`
          )}
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="shop-page"><div className="shop-loading">Loading...</div></div>}>
      <PaymentContent />
    </Suspense>
  );
}