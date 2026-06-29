"use client";

export default function RefundPolicyClient() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F0EB] min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6">Refund Policy</p>
          <h1 className="font-serif text-[2.5rem] font-light leading-[1.1] tracking-[0.02em] text-[#F5F0EB] mb-10">
            Made-to-Order, Exclusively for You
          </h1>

          <div className="space-y-10 text-sm font-light leading-[1.8] text-[#8A8580]">
            <div>
              <p>
                Each Fuzz Sofa piece is created exclusively for you after order confirmation.
                Because your piece is produced specifically for you and cannot be resold,
                it cannot be returned for change of mind, subjective preference, or spatial incompatibility.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Before Ordering</h2>
              <p>
                We encourage you to: review all dimensions carefully, request free fabric or leather swatches,
                use our design consultation, or try our AI room preview.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Quality Defects</h2>
              <p>
                If a manufacturing quality defect is found upon delivery, contact us with video evidence
                within 7 days — we will arrange repair, replacement, or full refund at our cost.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Non-Defective Returns</h2>
              <p>
                If you insist on returning a non-defective item, both outbound and return shipping costs
                are borne by the buyer and can be substantial.
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
