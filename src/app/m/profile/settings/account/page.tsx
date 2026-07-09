'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, MapPin, Save, X } from 'lucide-react';
import { getSavedAddresses, saveAddress, deleteAddress } from '@/lib/address-storage';
import type { SavedAddress } from '@/lib/address-storage';

export default function AccountSettingsPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user data from localStorage or API
        const savedData = localStorage.getItem('user_profile');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                });
            } catch (e) {
                console.error('Failed to parse user data:', e);
            }
        }
        setLoading(false);
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('user_profile', JSON.stringify(formData));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) {
        return (
            <div className="page-account-settings" style={{
                minHeight: '100vh',
                background: '#0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ color: '#8A8580', fontFamily: 'Inter, sans-serif' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="page-account-settings" style={{
            minHeight: '100vh',
            background: '#0A0A0A',
            paddingBottom: '2rem'
        }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid #1A1A1A',
                padding: '0 1.5rem'
            }}>
                <div style={{
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <Link href="/m/profile/settings" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#8A8580',
                        textDecoration: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        letterSpacing: '0.05em'
                    }}>
                        <ArrowLeft size={18} />
                        <span>BACK</span>
                    </Link>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        color: '#F5F0EB',
                        letterSpacing: '0.1em'
                    }}>
                        ACCOUNT
                    </h1>
                    <div style={{ width: '60px' }}></div>
                </div>
            </header>

            {/* Content */}
            <main style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '2rem 1.5rem'
            }}>
                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* First Name */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            color: '#8A8580',
                            letterSpacing: '0.1em',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase'
                        }}>
                            FIRST NAME
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Enter your first name"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                background: '#111111',
                                border: '1px solid #333333',
                                borderRadius: 0,
                                color: '#F5F0EB',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#E8B4B8'}
                            onBlur={(e) => e.target.style.borderColor = '#333333'}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            color: '#8A8580',
                            letterSpacing: '0.1em',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase'
                        }}>
                            LAST NAME
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter your last name"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                background: '#111111',
                                border: '1px solid #333333',
                                borderRadius: 0,
                                color: '#F5F0EB',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#E8B4B8'}
                            onBlur={(e) => e.target.style.borderColor = '#333333'}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            color: '#8A8580',
                            letterSpacing: '0.1em',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase'
                        }}>
                            EMAIL
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                background: '#111111',
                                border: '1px solid #333333',
                                borderRadius: 0,
                                color: '#F5F0EB',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#E8B4B8'}
                            onBlur={(e) => e.target.style.borderColor = '#333333'}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            color: '#8A8580',
                            letterSpacing: '0.1em',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase'
                        }}>
                            PHONE
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                background: '#111111',
                                border: '1px solid #333333',
                                borderRadius: 0,
                                color: '#F5F0EB',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#E8B4B8'}
                            onBlur={(e) => e.target.style.borderColor = '#333333'}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    style={{
                        width: '100%',
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'rgba(232, 180, 184, 0.06)',
                        border: '1.5px solid rgba(232, 180, 184, 0.35)',
                        borderRadius: 0,
                        color: '#E8B4B8',
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textTransform: 'uppercase'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(232, 180, 184, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(232, 180, 184, 0.55)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(232, 180, 184, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(232, 180, 184, 0.35)';
                    }}
                >
                    {saved ? 'SAVED' : 'SAVE CHANGES'}
                </button>

                {/* Success Message */}
                {saved && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(168, 168, 168, 0.1)',
                        border: '1px solid rgba(168, 168, 168, 0.3)',
                        color: '#A8A8A8',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8125rem',
                        textAlign: 'center'
                    }}>
                        Your account information has been updated.
                    </div>
                )}
            </main>
        </div>
    );
}
