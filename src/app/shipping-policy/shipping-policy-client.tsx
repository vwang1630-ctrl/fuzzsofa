"use client";

export default function ShippingPolicyClient() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F0EB] min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6">Shipping Policy</p>
          <h1 className="font-serif text-[2.5rem] font-light leading-[1.1] tracking-[0.02em] text-[#F5F0EB] mb-10">
            Shipping & Delivery
          </h1>

          <div className="space-y-10 text-sm font-light leading-[1.8] text-[#8A8580]">
            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Made-to-Order Production</h2>
              <p>
                Made-to-order products require production time before shipping.
                Production typically takes 1–2 weeks depending on the complexity of the piece
                and current studio capacity. Production begins after order confirmation and payment.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Worldwide Delivery</h2>
              <p>
                We ship worldwide using trusted logistics partners.
                Delivery time depends on your location and the shipping method selected at checkout.
                International shipments may be subject to customs duties and import taxes,
                which are the responsibility of the recipient.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Shipping Options</h2>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-[#D6A8AC]">—</span>
                  <span>Standard international shipping (4–6 weeks transit)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D6A8AC]">—</span>
                  <span>Express international shipping (2–3 weeks transit)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D6A8AC]">—</span>
                  <span>White-glove delivery with in-home installation (available in select regions)</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Packaging</h2>
              <p>
                All products are export-packaged with protective materials designed for
                international shipping. This includes corner guards, wrapped frames,
                and reinforced cartons to ensure your piece arrives in perfect condition.
              </p>
            </div>

            <div>
              <h2 className="text-base font-light tracking-[0.02em] text-[#F5F0EB] mb-3">Tracking</h2>
              <p>
                Once your order ships, you will receive a tracking number via email.
                You can track your shipment through your account page or the logistics partner&apos;s website.
              </p>
            </div>

            <div className="bg-[#0E0E0E] rounded-lg p-6">
              <p className="text-xs text-[#8A8580]">
                Questions about shipping? Contact us at{" "}
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
