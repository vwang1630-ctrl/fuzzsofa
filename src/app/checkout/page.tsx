"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

export default function CheckoutPage() {
  const { items, region, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    notes: "",
  });

  const subtotal = items.reduce((sum, item) => {
    return sum + item.product.priceRange[region][0] * item.quantity;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-light text-[#F5F0EB] mb-4">Order Received</h1>
          <p className="text-[#F5F0EB]/60 max-w-md mx-auto">
            Thank you for your order. Our team will confirm your specifications and begin production at our Shanghai workshop. You will receive photo and video documentation throughout the process.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-4xl font-light text-[#F5F0EB] mb-4">Checkout</h1>
        <p className="text-[#8A8580] mb-8">Your cart is empty</p>
        <Link
          href="/animal-sofa-collection"
          className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl font-light text-[#F5F0EB] mb-12">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Shipping form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">Shipping Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">Address</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">City</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">Country</label>
                <input
                  type="text"
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">Postal Code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">Order Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors resize-none"
                placeholder="Special delivery instructions, design preferences..."
              />
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <h2 className="font-serif text-xl text-[#F5F0EB] mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.slug} className="flex justify-between text-sm">
                    <div>
                      <p className="text-[#F5F0EB]">{item.product.name}</p>
                      <p className="text-xs text-[#8A8580]">{item.materialType} / {item.materialOption} x{item.quantity}</p>
                    </div>
                    <p className="text-[#F5F0EB]">{formatPrice(item.product.priceRange[region][0] * item.quantity, region)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1A1A1A] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8580]">Subtotal</span>
                  <span className="text-[#F5F0EB]">{formatPrice(subtotal, region)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8580]">Shipping</span>
                  <span className="text-[#E8B4B8]">Free White-Glove</span>
                </div>
                <div className="border-t border-[#1A1A1A] pt-2 flex justify-between">
                  <span className="text-[#F5F0EB]">Total</span>
                  <span className="text-[#F5F0EB] text-lg">{formatPrice(subtotal, region)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full py-4 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
              >
                Place Order
              </button>

              <div className="mt-4 space-y-1">
                <p className="text-xs text-[#8A8580]"><span className="text-[#E8B4B8]">&#10003;</span> Free White-Glove Delivery</p>
                <p className="text-xs text-[#8A8580]"><span className="text-[#E8B4B8]">&#10003;</span> 14-Day Quality Guarantee</p>
                <p className="text-xs text-[#8A8580]"><span className="text-[#E8B4B8]">&#10003;</span> Photo & Video Documentation</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
