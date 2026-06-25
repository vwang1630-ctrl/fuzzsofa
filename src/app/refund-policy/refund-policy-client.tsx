"use client";

export default function RefundPolicyClient() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F0EB] min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-6">Refund Policy</p>
          <h1 className="font-serif text-[2.5rem] font-light leading-[1.1] tracking-[0.02em] text-[#F5F0EB] mb-10">
            Returns & Refunds
          </h1>

          <div className="space-y-10 text-sm font-light leading-[1.8] text-[#8A8580]">
            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Made-to-Order Policy</h2>
              <p>
                Because each piece is made to order and crafted specifically for you,
                returns are generally not accepted. We recommend confirming all details —
                dimensions, materials, and finish — before placing your order.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Damage & Defects</h2>
              <p>
                If your piece arrives with damage or a manufacturing defect, we will fully support
                a resolution. This may include repair, replacement, or refund depending on the nature
                of the issue.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">How to Report an Issue</h2>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-[#D6A8AC]">1.</span>
                  <span>Contact us within 7 days of receiving your order</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D6A8AC]">2.</span>
                  <span>Provide photos clearly showing the damage or defect</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D6A8AC]">3.</span>
                  <span>Include your order number and a brief description of the issue</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Verified Issues</h2>
              <p>
                Verified issues will be resolved promptly. We will work with you to determine
                the best course of action — whether that is a repair, a replacement piece,
                or a full refund. Shipping costs for verified defect returns are covered by us.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Custom Orders</h2>
              <p>
                Custom modifications (non-standard sizes, special fabrics, unique configurations)
                are final sale and cannot be returned or exchanged. We will confirm all custom
                specifications with you before production begins.
              </p>
            </div>

            <div className="bg-[#0E0E0E] rounded-lg p-6">
              <p className="text-xs text-[#8A8580]">
                Questions about returns? Contact us at{" "}
                <a href="mailto:support@fuzzsofa.com" className="text-[#D6A8AC] hover:underline">
                  support@fuzzsofa.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
