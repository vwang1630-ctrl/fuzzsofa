"use client";

import Link from "next/link";

export default function RefundPolicyClient() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F0EB] min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-6">Policy</p>
          <h1 className="font-serif text-[2.8rem] font-light leading-[1.1] tracking-[0.02em] text-[#F5F0EB] mb-8">
            Refund Policy
          </h1>

          <div className="space-y-8 text-sm font-light leading-[1.8] text-[#8A8580]">
            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">Made-to-Order Products</h2>
              <p>
                Because each product is made to order specifically for you, returns are not
                generally accepted. We invest significant time and materials into each piece,
                and custom production cannot be restocked.
              </p>
            </div>

            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">Damage & Defects</h2>
              <p>
                If your product arrives damaged or with manufacturing defects, we will fully
                support a resolution. This may include:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#8A8580]">
                <li>Full replacement at no additional cost</li>
                <li>Repair by our workshop</li>
                <li>Full refund upon verified evidence</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">How to Report an Issue</h2>
              <p>
                If you receive a damaged or defective product, please contact us within 7 days
                of delivery at{" "}
                <a href="mailto:support@fuzzsofa.com" className="text-[#D6A8AC] hover:text-[#E0BEC0] transition-colors">
                  support@fuzzsofa.com
                </a>
                {" "}with photos of the issue. Verified claims will be processed promptly.
              </p>
            </div>

            <div>
              <h2 className="text-base text-[#F5F0EB] mb-3">Order Cancellation</h2>
              <p>
                Orders may be cancelled within 48 hours of placement. After production begins,
                cancellation is not possible as materials and labor have already been committed.
              </p>
            </div>

            <div className="pt-6">
              <p className="text-xs text-[#8A8580]/60">
                Secure international checkout supported via Stripe. All transactions are encrypted.
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
