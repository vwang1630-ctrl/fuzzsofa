'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PaymentMethod {
    id: string;
    type: 'credit_card' | 'paypal';
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    email?: string;
    isDefault?: boolean;
}

export default function PaymentPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: '1',
            type: 'credit_card',
            cardNumber: '**** **** **** 4242',
            cardHolder: 'John Doe',
            expiryDate: '12/25',
            isDefault: true
        },
        {
            id: '2',
            type: 'paypal',
            email: 'john@example.com',
            isDefault: false
        }
    ]);

    const handleDelete = (id: string) => {
        setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    };

    const handleSetDefault = (id: string) => {
        setPaymentMethods(paymentMethods.map(pm => ({
            ...pm,
            isDefault: pm.id === id
        })));
    };

    return (
        <div className="page page-payment active" id="pagePayment">
            {/* Header */}
            <div className="page-header">
                <Link href="/m/profile" className="log-detail-back">&lsaquo;</Link>
                <span className="title">Payment Methods</span>
            </div>

            {/* Payment Methods List */}
            <div className="payment-list">
                {paymentMethods.length === 0 ? (
                    <div className="payment-empty">
                        <p>No payment methods</p>
                    </div>
                ) : (
                    paymentMethods.map(pm => (
                        <div key={pm.id} className="payment-card">
                            <div className="payment-card-header">
                                <div className="payment-card-type">
                                    {pm.type === 'credit_card' ? (
                                        <>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                                <line x1="1" y1="10" x2="23" y2="10" />
                                            </svg>
                                            <span>Credit Card</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                <path d="M9 12l2 2 4-4" />
                                            </svg>
                                            <span>PayPal</span>
                                        </>
                                    )}
                                </div>
                                {pm.isDefault && (
                                    <span className="payment-card-default">Default</span>
                                )}
                            </div>
                            <div className="payment-card-info">
                                {pm.type === 'credit_card' ? (
                                    <>
                                        <div className="payment-card-number">{pm.cardNumber}</div>
                                        <div className="payment-card-details">
                                            <span>{pm.cardHolder}</span>
                                            <span>Expires: {pm.expiryDate}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="payment-card-email">{pm.email}</div>
                                )}
                            </div>
                            <div className="payment-card-actions">
                                {!pm.isDefault && (
                                    <button 
                                        className="payment-card-action"
                                        onClick={() => handleSetDefault(pm.id)}
                                    >
                                        Set Default
                                    </button>
                                )}
                                <button 
                                    className="payment-card-action payment-card-delete"
                                    onClick={() => handleDelete(pm.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Payment Method Button */}
            <div className="payment-add">
                <Link href="/m/profile/payment/add" className="panel-confirm-btn">
                    Add Payment Method
                </Link>
            </div>

            <style jsx>{`
                .page-payment {
                    min-height: 100vh;
                    background: #0A0A0A;
                    padding-bottom: 40px;
                }

                .payment-list {
                    padding: 20px;
                }

                .payment-empty {
                    text-align: center;
                    padding: 60px 20px;
                    color: #6A6560;
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                }

                .payment-card {
                    background: #111111;
                    border: 1px solid #1A1A1A;
                    border-radius: 0;
                    padding: 16px;
                    margin-bottom: 16px;
                }

                .payment-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .payment-card-type {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #E8B4B8;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 16px;
                    font-weight: 500;
                }

                .payment-card-default {
                    font-family: 'Inter', sans-serif;
                    font-size: 10px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #E8B4B8;
                    border: 1px solid #E8B4B8;
                    padding: 2px 8px;
                }

                .payment-card-info {
                    margin-bottom: 12px;
                }

                .payment-card-number {
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                    color: #F5F0EB;
                    letter-spacing: 0.05em;
                    margin-bottom: 4px;
                }

                .payment-card-details {
                    display: flex;
                    justify-content: space-between;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    color: #8A8580;
                }

                .payment-card-email {
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                    color: #F5F0EB;
                }

                .payment-card-actions {
                    display: flex;
                    gap: 12px;
                    padding-top: 12px;
                    border-top: 1px solid #1A1A1A;
                }

                .payment-card-action {
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #8A8580;
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .payment-card-action:hover {
                    color: #E8B4B8;
                }

                .payment-card-delete:hover {
                    color: #E85050;
                }

                .payment-add {
                    padding: 20px;
                }

                .panel-confirm-btn {
                    display: block;
                    text-align: center;
                    padding: 16px;
                    border: 1px solid rgba(232, 180, 184, 0.35);
                    border-radius: 0;
                    color: #E8B4B8;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 15px;
                    font-weight: 500;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .panel-confirm-btn:hover {
                    background: rgba(232, 180, 184, 0.1);
                }
            `}</style>
        </div>
    );
}
