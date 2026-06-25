"use client";

import Link from "next/link";

export default function ShippingPolicyClient() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F0EB] min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-6">Policy</p>
          <h1 className="font-serif text-[2.8rem] font-light leading-[1.1] tracking-[0.02em] text-[#F5F0EB] mb-8">
            Shipping Policy
          </h1>

          <div className="space-y-8 text-sm font-light leading-[1.8] text-[#8A8580]">
            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">Made-to-Order Production</h2>
              <p>
                All Fuzz Sofa products are made to order. Production time is required before shipping.
                Typical production lead time is 3–6 weeks depending on the product and customization.
              </p>
            </div>

            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">Worldwide Shipping</h2>
              <p>
                We ship worldwide using reliable logistics partners. Delivery times vary by destination:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#8A8580]">
                <li>North America: 2–4 weeks after production</li>
                <li>Europe: 2–4 weeks after production</li>
                <li>Middle East: 2–3 weeks after production</li>
                <li>Asia-Pacific: 1–3 weeks after production</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">Shipping Cost</h2>
              <p>
                Shipping costs are calculated at checkout based on destination and product dimensions.
                White-glove delivery is available for select regions.
              </p>
            </div>

            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">Tracking</h2>
              <p>
                Once your order ships, you will receive a tracking number via email.
                You can also check order status in your account dashboard.
              </p>
            </div>

            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">Import Duties & Taxes</h2>
              <p>
                International orders may be subject to import duties and taxes, which are the
                responsibility of the buyer. These charges vary by country and are not included in
                our product pricing or shipping fees.
              </p>
            </div>

            <div className="pt-6">
              <p className="text-xs text-[#8A8580]/60">
                Secure international checkout supported via Stripe.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1A1A1A]">
            <Link
              href="/contact"
              className="text-sm tracking-[0.05em] text-[#D6A8AC] hover:text-[#E0BEC0] transition-colors"
            >
              Questions? Contact us →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
