"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, getUnitPrice } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";

const slugToPrefix: Record<string, string> = {
  "bear-sofa": "bearSofa",
  "lion-sofa": "lionSofa",
  "tiger-sofa": "tigerSofa",
  "gorilla-sofa": "gorillaSofa",
  "owl-sofa": "owlChair",
  "silverback-sofa": "silverbackSofa",
  "meteorite-ring-sofa": "meteoriteRingSofa",
  "muscle-gorilla-sofa": "muscleGorillaSofa",
};

const slugToImage: Record<string, string> = {
  "bear-sofa": "/products/bear-sofa/thumb.jpg",
  "lion-sofa": "/products/lion-sofa/thumb.jpg",
  "tiger-sofa": "/products/tiger-sofa/thumb.jpg",
  "gorilla-sofa": "/products/gorilla-sofa/thumb.jpg",
  "owl-sofa": "/products/owl-sofa/thumb.jpg",
  "silverback-sofa": "/products/silverback-sofa/thumb.jpg",
  "meteorite-ring-sofa": "/products/meteorite-ring-sofa/thumb.jpg",
  "muscle-gorilla-sofa": "/products/muscle-gorilla-sofa/thumb.jpg",
};

type ShippingMethod = "standard" | "express";

interface AddressForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const defaultForm: AddressForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
};

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "AU", name: "Australia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export default function CheckoutPage() {
  const { selectedItems, selectedTotal, region } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AddressForm>(defaultForm);
  const [addressLoaded, setAddressLoaded] = useState(false);

  // Load session and saved address on mount
  useEffect(() => {
    async function init() {
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          setSessionToken(session.access_token);
          setUserId(session.user.id);

          // Load saved default address + preferences in parallel
          const [addrRes, prefRes] = await Promise.all([
            fetch("/api/addresses", { headers: { "x-session": session.access_token } }),
            fetch("/api/preferences", { headers: { "x-session": session.access_token } }),
          ]);

          if (addrRes.ok) {
            const data = await addrRes.json();
            const defaultAddr = (data.addresses || [])[0]; // first is default
            if (defaultAddr) {
              setForm({
                firstName: defaultAddr.first_name || "",
                lastName: defaultAddr.last_name || "",
                email: defaultAddr.email || session.user.email || "",
                phone: defaultAddr.phone || "",
                addressLine1: defaultAddr.address_line1 || "",
                addressLine2: defaultAddr.address_line2 || "",
                city: defaultAddr.city || "",
                state: defaultAddr.state || "",
                zipCode: defaultAddr.zip_code || "",
                country: defaultAddr.country || "US",
              });
            } else if (session.user.email) {
              setForm((prev) => ({ ...prev, email: session.user!.email! }));
            }
          }

          if (prefRes.ok) {
            const prefData = await prefRes.json();
            if (prefData.preferences) {
              if (prefData.preferences.preferred_shipping_method) {
                setShippingMethod(prefData.preferences.preferred_shipping_method as ShippingMethod);
              }
            }
          }
        }
      } catch {
        // User not logged in — order creation will fail with 401
      }
      setAddressLoaded(true);
    }
    init();
  }, []);

  const shippingFee = shippingMethod === "express" ? 200 : (selectedTotal >= 10000 ? 0 : 300);
  const total = selectedTotal + shippingFee;

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-4">{t("checkoutTitle")}</h1>
        <p className="text-[#8A8580] mb-8 text-sm">{t("cartEmpty")}</p>
        <Link
          href="/animal-sofa-collection"
          className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
        >
          {t("cartContinueShopping")}
        </Link>
      </div>
    );
  }

  const updateForm = (field: keyof AddressForm, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!form.firstName.trim()) newErrors.firstName = true;
    if (!form.lastName.trim()) newErrors.lastName = true;
    if (!form.email.trim()) newErrors.email = true;
    if (!form.phone.trim()) newErrors.phone = true;
    if (!form.addressLine1.trim()) newErrors.addressLine1 = true;
    if (!form.city.trim()) newErrors.city = true;
    if (!form.state.trim()) newErrors.state = true;
    if (!form.zipCode.trim()) newErrors.zipCode = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Store checkout data in sessionStorage for the payment page
    const checkoutData = {
      address: form,
      shippingMethod,
      shippingFee,
      subtotal: selectedTotal,
      total,
      currency: "USD",
      items: selectedItems.map((item) => {
        const price = getUnitPrice(item.product, item.region);
        return {
          productSlug: item.product.slug,
          productName: slugToPrefix[item.product.slug]
            ? t(`${slugToPrefix[item.product.slug]}Name` as TranslationKeys)
            : item.product.name,
          colorName: item.materialOption,
          colorHex: "#333333",
          quantity: item.quantity,
          unitPrice: price,
          subtotal: price * item.quantity,
          imageUrl: slugToImage[item.product.slug] || item.product.images?.[0] || "",
        };
      }),
    };
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    // Save address for future use (fire and forget)
    if (sessionToken) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-session": sessionToken,
      };
      fetch("/api/addresses", {
        method: "POST",
        headers,
        body: JSON.stringify({
          label: "Home",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
          isDefault: true,
        }),
      }).catch(() => {});

      // Save shipping preference (fire and forget)
      fetch("/api/preferences", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          preferredShippingMethod: shippingMethod,
        }),
      }).catch(() => {});
    }

    router.push("/payment");
  };

  const inputClass = (field: string) =>
    `w-full bg-[#111111] border ${errors[field] ? "border-red-500" : "border-[#1A1A1A]"} px-4 py-3 text-[#F5F0EB] text-sm focus:border-[#E8B4B8] focus:outline-none transition-colors`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-12 tracking-wide">{t("checkoutTitle")}</h1>

      <form onSubmit={handleContinueToPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Left Column - Form */}
          <div className="space-y-10">
            {/* Shipping Address */}
            <section>
              <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-6 tracking-wide">
                {t("checkoutShippingInfo")}
              </h2>
              <div className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutFirstName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => updateForm("firstName", e.target.value)}
                      className={inputClass("firstName")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutLastName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => updateForm("lastName", e.target.value)}
                      className={inputClass("lastName")}
                    />
                  </div>
                </div>

                {/* Email + Phone row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutEmail")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className={inputClass("email")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutPhone")} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className={inputClass("phone")}
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("checkoutCountry")} *
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => updateForm("country", e.target.value)}
                    className={inputClass("country") + " appearance-none cursor-pointer"}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#111111] text-[#F5F0EB]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("checkoutAddressLine1")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street address, P.O. box"
                    value={form.addressLine1}
                    onChange={(e) => updateForm("addressLine1", e.target.value)}
                    className={inputClass("addressLine1")}
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                    {t("checkoutAddressLine2")}
                  </label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    value={form.addressLine2}
                    onChange={(e) => updateForm("addressLine2", e.target.value)}
                    className={inputClass("addressLine2")}
                  />
                </div>

                {/* City + State + ZIP row */}
                <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-4">
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutCity")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      className={inputClass("city")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutState")} *
                    </label>
                    {form.country === "US" ? (
                      <select
                        value={form.state}
                        onChange={(e) => updateForm("state", e.target.value)}
                        className={inputClass("state") + " appearance-none cursor-pointer"}
                      >
                        <option value="" className="bg-[#111111]">Select</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s} className="bg-[#111111]">{s}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        placeholder="State / Province / Region"
                        value={form.state}
                        onChange={(e) => updateForm("state", e.target.value)}
                        className={inputClass("state")}
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block mb-2">
                      {t("checkoutZipCode")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.zipCode}
                      onChange={(e) => updateForm("zipCode", e.target.value)}
                      className={inputClass("zipCode")}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section>
              <h2 className="font-serif text-xl font-light text-[#F5F0EB] mb-6 tracking-wide">
                {t("checkoutShippingMethod")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShippingMethod("standard")}
                  className={`p-4 border text-left transition-all duration-300 ${
                    shippingMethod === "standard"
                      ? "border-[#E8B4B8] bg-[#E8B4B8]/5"
                      : "border-[#1A1A1A] hover:border-[#333]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F0EB] text-sm">{t("checkoutStandardShipping")}</span>
                    <span className="text-[#E8B4B8] text-sm">{t("free") || "Free"}</span>
                  </div>
                  <p className="text-xs text-[#8A8580] mt-1">7-15 business days</p>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingMethod("express")}
                  className={`p-4 border text-left transition-all duration-300 ${
                    shippingMethod === "express"
                      ? "border-[#E8B4B8] bg-[#E8B4B8]/5"
                      : "border-[#1A1A1A] hover:border-[#333]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F0EB] text-sm">{t("checkoutExpressShipping")}</span>
                    <span className="text-[#F5F0EB] text-sm">$200</span>
                  </div>
                  <p className="text-xs text-[#8A8580] mt-1">3-5 business days</p>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary (sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-[#111111] border border-[#1A1A1A] p-6">
              <h2 className="font-serif text-xl text-[#F5F0EB] mb-6">{t("checkoutOrderSummary")}</h2>

              <div className="space-y-4 mb-6">
                {selectedItems.map((item) => {
                  const price = getUnitPrice(item.product, item.region);
                  const productName = slugToPrefix[item.product.slug]
                    ? t(`${slugToPrefix[item.product.slug]}Name` as TranslationKeys)
                    : item.product.name;
                  const thumbSrc = slugToImage[item.product.slug] || "/products/placeholder/thumb.jpg";
                  return (
                    <div key={item.product.slug} className="flex gap-3">
                      <div className="w-12 h-12 bg-[#1A1A1A] shrink-0 overflow-hidden relative">
                        <Image src={thumbSrc} alt={productName} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F5F0EB] text-sm truncate">{productName}</p>
                        <p className="text-xs text-[#8A8580]">
                          {item.materialOption} x{item.quantity}
                        </p>
                      </div>
                      <p className="text-[#F5F0EB] text-sm shrink-0">{formatPrice(price * item.quantity, region)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#1A1A1A] pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8580]">{t("cartSubtotal")}</span>
                  <span className="text-[#F5F0EB]">{formatPrice(selectedTotal, region)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8580]">{t("cartShipping")}</span>
                  <span className={shippingFee === 0 ? "text-[#E8B4B8]" : "text-[#F5F0EB]"}>
                    {shippingFee === 0 ? (t("free") || "Free") : formatPrice(shippingFee, region)}
                  </span>
                </div>
                <div className="border-t border-[#1A1A1A] pt-3 flex justify-between">
                  <span className="text-[#F5F0EB] font-light">{t("cartTotal")}</span>
                  <span className="text-[#F5F0EB] text-lg">{formatPrice(total, region)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 border border-[#F5F0EB] text-[#F5F0EB] py-4 text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "..." : t("checkoutContinueToPayment")}
              </button>

              <Link
                href="/cart"
                className="block text-center mt-4 text-[#8A8580] text-xs tracking-[0.1em] uppercase hover:text-[#F5F0EB] transition-colors"
              >
                {t("checkoutBackToCart")}
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
