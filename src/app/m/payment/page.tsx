'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { saveOrder, getOrders, type Order } from '@/lib/order-storage';
import { useCart } from '@/lib/cart-context';
import '@/app/m/sofaapp.css';

function PaymentContent() {
  const router = useRouter();
  const { clearCart } = useCart();
  
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
    
    // Save order to localStorage
    const order: Order = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Shipping',
      total: Number(total),
      items: items.map(item => ({
        name: item.name,
        color: item.color,
        fabric: '',
        price: item.price,
        quantity: item.quantity,
        image: ''
      }))
    };
    saveOrder(order);
    
    // Clear cart after successful payment
    clearCart();
    
    // Clear payment session data
    sessionStorage.removeItem('paymentOrderId');
    sessionStorage.removeItem('paymentItems');
    sessionStorage.removeItem('paymentTotal');
    
    // Redirect to order success
    const itemsJson = encodeURIComponent(JSON.stringify(items));
    router.push(`/m/order-success?orderId=${orderId}&items=${itemsJson}&total=${total}`);
  };
  
  return (
    <div className="payment-page-new">
      {/* Header */}
      <div className="payment-header-new">
        <Link href="/m/cart" className="payment-back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="payment-title-new">PAYMENT</h1>
        <span className="payment-header-right"></span>
      </div>
      
      {/* Content */}
      <div className="payment-content-new">
        {/* Order Summary Card */}
        <section className="payment-card">
          <div className="payment-card-header">
            <span className="payment-card-title">ORDER SUMMARY</span>
            <span className="payment-order-id">#{orderId}</span>
          </div>
          <div className="payment-card-body">
            {items.map((item, index) => (
              <div key={index} className="payment-item-row">
                <div className="payment-item-info">
                  <span className="payment-item-name">{item.name}</span>
                  <span className="payment-item-variant">{item.color} × {item.quantity}</span>
                </div>
                <span className="payment-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="payment-total-divider"></div>
            <div className="payment-total-row">
              <span className="payment-total-label">Total</span>
              <span className="payment-total-amount">${total}</span>
            </div>
          </div>
        </section>
        
        {/* Payment Method Card */}
        <section className="payment-card">
          <div className="payment-card-header">
            <span className="payment-card-title">PAYMENT METHOD</span>
          </div>
          <div className="payment-card-body">
            <button
              className={`payment-method-option ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <span className={`payment-radio-new ${paymentMethod === 'card' ? 'checked' : ''}`}>
                {paymentMethod === 'card' && <span className="payment-radio-dot-new"></span>}
              </span>
              <svg
                className="payment-method-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span className="payment-method-text">Credit Card</span>
            </button>
            <div className="payment-method-divider"></div>
            <button
              className={`payment-method-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <span className={`payment-radio-new ${paymentMethod === 'paypal' ? 'checked' : ''}`}>
                {paymentMethod === 'paypal' && <span className="payment-radio-dot-new"></span>}
              </span>
              <svg
                className="payment-method-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .757-.64h6.953c2.297 0 4.147.485 5.195 1.38.995.85 1.394 2.097 1.176 3.707-.37 2.717-2.042 4.49-4.94 5.09-.8.17-1.67.24-2.58.24H8.91a.77.77 0 0 0-.756.64l-.92 5.83a.641.641 0 0 1-.633.74l-.525.003z" />
              </svg>
              <span className="payment-method-text">PayPal</span>
            </button>
          </div>
        </section>
        
        {/* Card Details Card (only show when card selected) */}
        {paymentMethod === 'card' && (
          <section className="payment-card">
            <div className="payment-card-header">
              <span className="payment-card-title">CARD DETAILS</span>
            </div>
            <div className="payment-card-body">
              <div className="payment-input-group">
                <label className="payment-input-label">Card Number</label>
                <input
                  type="text"
                  className="payment-input-new"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              <div className="payment-input-row">
                <div className="payment-input-group">
                  <label className="payment-input-label">Expiry</label>
                  <input
                    type="text"
                    className="payment-input-new"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="payment-input-group">
                  <label className="payment-input-label">CVV</label>
                  <input
                    type="text"
                    className="payment-input-new"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="payment-input-group">
                <label className="payment-input-label">Cardholder Name</label>
                <input
                  type="text"
                  className="payment-input-new"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              {cardError && <p className="payment-error">{cardError}</p>}
            </div>
          </section>
        )}
        
        {/* PayPal Info */}
        {paymentMethod === 'paypal' && (
          <section className="payment-card">
            <div className="payment-card-body">
              <p className="payment-notice-text">You will be redirected to PayPal to complete your payment securely.</p>
            </div>
          </section>
        )}
        
        {/* Pay Button */}
        <button 
          className="payment-pay-btn"
          onClick={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="payment-processing">
              <svg className="payment-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
              </svg>
              Processing...
            </span>
          ) : (
            `PAY $${total}`
          )}
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="payment-page-new"><div className="shop-loading">Loading...</div></div>}>
      <PaymentContent />
    </Suspense>
  );
}
