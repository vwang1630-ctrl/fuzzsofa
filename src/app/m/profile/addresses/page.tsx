'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Address {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zipCode: string;
  isDefault: boolean;
}

const addresses: Address[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1 212-555-0123',
    country: 'United States',
    address1: '123 Fifth Avenue',
    address2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    isDefault: true
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1 212-555-0123',
    country: 'United States',
    address1: '456 Park Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10022',
    isDefault: false
  }
];

export default function AddressesPage() {
  const [addressList, setAddressList] = useState<Address[]>(addresses);

  const handleDelete = (id: number) => {
    setAddressList(addressList.filter(a => a.id !== id));
  };

  return (
    <div className="page page-addresses active" id="pageAddresses">
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#0A0A0A",
          borderBottom: "1px solid #1A1A1A",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 100
        }}>
        <Link
          href="/m/profile"
          style={{
            background: "transparent",
            border: "none",
            color: "#E8B4B8",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center"
          }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#F5F0EB",
            margin: 0
          }}>
          SHIPPING ADDRESSES
        </h1>
      </div>

      {/* Address List */}
      {addressList.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div className="empty-text">No addresses saved</div>
        </div>
      ) : (
        <div className="addr-list" id="addrList">
          {addressList.map((addr) => (
            <div key={addr.id} className="addr-card">
              {/* Address Header */}
              <div className="addr-header">
                <div className="addr-name-group">
                  <span className="addr-name">{addr.firstName} {addr.lastName}</span>
                  {addr.isDefault && <span className="addr-badge">Default</span>}
                </div>
                <span className="addr-phone">{addr.phone}</span>
              </div>

              {/* Address Body */}
              <div className="addr-body">
                <div className="addr-line">{addr.address1}</div>
                {addr.address2 && <div className="addr-line">{addr.address2}</div>}
                <div className="addr-line">
                  {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zipCode}
                </div>
                <div className="addr-line addr-country">{addr.country}</div>
              </div>

              {/* Address Actions */}
              <div className="addr-actions">
                <Link href={`/m/profile/addresses/edit/${addr.id}`} className="addr-action-btn">
                  Edit
                </Link>
                <button 
                  className="addr-action-btn danger"
                  onClick={() => handleDelete(addr.id)}
                  aria-label="Delete address"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Button */}
      <Link href="/m/profile/addresses/new" className="addr-add-btn panel-confirm-btn">
        + Add New Address
      </Link>
    </div>
  );
}
