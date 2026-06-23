"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            Contact Fuzz Sofa
          </h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            Talk to our design team about your space, your vision, or your order.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="bg-[#111111] border border-[#E8B4B8]/30 p-8">
                <h2 className="font-serif text-2xl text-[#F5F0EB] mb-3">Message Received</h2>
                <p className="text-[#F5F0EB]/60">
                  Thank you for reaching out. Our design team will respond within 24 hours. For urgent inquiries, please reach us directly at hello@fuzzsofa.com.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="trade">Trade / Bulk Pricing</option>
                    <option value="designer">Talk to a Designer</option>
                    <option value="custom">Custom Material Request</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#111111] border border-[#1A1A1A] px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project or question..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">Email</p>
                <p className="text-[#F5F0EB]/70">hello@fuzzsofa.com</p>
                <p className="text-sm text-[#8A8580] mt-1">General inquiries</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">Support</p>
                <p className="text-[#F5F0EB]/70">support@fuzzsofa.com</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">Trade</p>
                <p className="text-[#F5F0EB]/70">trade@fuzzsofa.com</p>
                <p className="text-sm text-[#8A8580] mt-1">Bulk &amp; hospitality pricing</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">Other</p>
                <p className="text-[#F5F0EB]/70">warranty@fuzzsofa.com · privacy@fuzzsofa.com</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">Workshop</p>
                <p className="text-[#F5F0EB]/70">Shanghai, China</p>
                <p className="text-sm text-[#8A8580]">By appointment only</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">Response Time</p>
                <p className="text-[#F5F0EB]/70">Within 24 hours</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">Follow Us</p>
                <div className="flex gap-4 mt-2">
                  {[
                    { href: "https://instagram.com/fuzzsofa", label: "Instagram" },
                    { href: "https://facebook.com/fuzzsofa", label: "Facebook" },
                    { href: "https://pinterest.com/fuzzsofa", label: "Pinterest" },
                    { href: "https://tiktok.com/@fuzzsofa", label: "TikTok" },
                    { href: "https://youtube.com/@fuzzsofa", label: "YouTube" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#F5F0EB]/40 hover:text-[#E8B4B8] transition-colors"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 bg-[#111111] border border-[#1A1A1A] p-6">
              <h3 className="font-serif text-lg text-[#F5F0EB] mb-3">For Trade & Hospitality</h3>
              <p className="text-sm text-[#8A8580] leading-relaxed">
                Contract-grade specifications, bulk pricing, and dedicated project management for hospitality and commercial projects. Select &ldquo;Trade / Bulk Pricing&rdquo; in the form above, or email trade@fuzzsofa.com directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
