"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type Product, getPrice } from "@/lib/products";
import "../sofaapp.css";

// ===== 类型定义 =====
interface CartItem {
    product: Product;
    quantity: number;
    materialOption: string;
    color: string;
}

interface SavedAddress {
    id: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
    label?: string;
    isDefault?: boolean;
}

interface AddressForm {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince?: string;
    postalCode: string;
    country: string;
}

// ===== 国家列表 =====
const countries = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" }
];

// ===== 辅助函数 =====
function getUnitPrice(item: CartItem): number {
    const base = getPrice(item.product, "americas");
    if (item.materialOption === "Premium") return Math.round(base * 1.3);
    if (item.materialOption === "Deluxe") return Math.round(base * 1.6);
    return base;
}

// ===== 主页面组件 =====
export default function MobileCheckoutPage() {
    const router = useRouter();

    // ===== 状态管理 =====
    const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [saveNewAddress, setSaveNewAddress] = useState(false);
    const [addressLabel, setAddressLabel] = useState<"Home" | "Office" | "Other">("Home");
    const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal">("credit-card");
    const [isProcessing, setIsProcessing] = useState(false);

    const [addressForm, setAddressForm] = useState<AddressForm>({
        fullName: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        country: "US"
    });

    const [formErrors, setFormErrors] = useState<Partial<AddressForm>>({});

    // ===== 初始化数据 =====
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        const validItems = items.filter((item: CartItem) => item.product && item.product.slug);
        setCheckoutItems(validItems);

        const addresses = JSON.parse(localStorage.getItem("savedAddresses") || "[]");
        setSavedAddresses(addresses);
        const defaultAddr = addresses.find((a: SavedAddress) => a.isDefault);
        if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
        } else if (addresses.length > 0) {
            setSelectedAddressId(addresses[0].id);
        }
    }, []);

    // ===== 计算价格 =====
    const selectedTotal = checkoutItems.reduce((sum, item) => {
        return sum + getUnitPrice(item) * item.quantity;
    }, 0);
    const shippingFee = selectedTotal > 500 ? 0 : 50;
    const totalWithShipping = selectedTotal + shippingFee;

    // ===== 判断是否需要州/省字段 =====
    const needsStateField = ["US", "CA", "AU"].includes(addressForm.country);

    // ===== 表单验证 =====
    const validateForm = (): boolean => {
        const errors: Partial<AddressForm> = {};

        if (!addressForm.fullName.trim()) errors.fullName = "Name is required";
        if (!addressForm.email.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(addressForm.email)) errors.email = "Invalid email";
        if (!addressForm.phone.trim()) errors.phone = "Phone is required";
        if (!addressForm.addressLine1.trim()) errors.addressLine1 = "Address is required";
        if (!addressForm.city.trim()) errors.city = "City is required";
        if (needsStateField && !addressForm.stateProvince?.trim()) errors.stateProvince = "State is required";
        if (!addressForm.postalCode.trim()) errors.postalCode = "ZIP is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ===== 处理返回 =====
    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/m/cart");
        }
    };

    // ===== 选择地址 =====
    const handleSelectAddress = (addr: SavedAddress) => {
        setSelectedAddressId(addr.id);
        setUseNewAddress(false);
    };

    // ===== 使用新地址 =====
    const handleUseNewAddress = () => {
        setUseNewAddress(true);
        setSelectedAddressId("");
    };

    // ===== 保存地址 =====
    const saveAddress = () => {
        if (saveNewAddress && selectedAddressId === "") {
            const newAddr: SavedAddress = {
                id: Date.now().toString(),
                fullName: addressForm.fullName,
                addressLine1: addressForm.addressLine1,
                addressLine2: addressForm.addressLine2,
                city: addressForm.city,
                state: addressForm.stateProvince,
                zipCode: addressForm.postalCode,
                country: addressForm.country,
                label: addressLabel,
                isDefault: savedAddresses.length === 0
            };
            const updated = [...savedAddresses, newAddr];
            setSavedAddresses(updated);
            localStorage.setItem("savedAddresses", JSON.stringify(updated));
        }
    };

    // ===== 提交订单 =====
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsProcessing(true);
        saveAddress();

        await new Promise(resolve => setTimeout(resolve, 1500));

        const orderData = {
            items: checkoutItems,
            shippingAddress: useNewAddress ? addressForm : savedAddresses.find(a => a.id === selectedAddressId),
            paymentMethod,
            subtotal: selectedTotal,
            shipping: shippingFee,
            total: totalWithShipping,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem("lastOrder", JSON.stringify(orderData));
        localStorage.removeItem("cart");
        setIsProcessing(false);
        router.push("/m/payment");
    };

    // ===== 空购物车状态 =====
    if (checkoutItems.length === 0) {
        return (
            <div className="shop-page" id="checkoutPage">
                <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", background: "#000", borderBottom: "1px solid #1A1A1A" }}>
                    <button onClick={handleBack} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#E8B4B8", cursor: "pointer", padding: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", fontWeight: 400, letterSpacing: "0.15em", color: "#F5F0EB", margin: 0, flex: 1, textAlign: "center", textTransform: "uppercase" }}>CHECKOUT</h1>
                    <span style={{ width: "32px" }}></span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8A8580" strokeWidth="1">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", fontWeight: 400, color: "#F5F0EB", letterSpacing: "0.05em", margin: "20px 0 8px" }}>No Items</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 400, color: "#8A8580", margin: "0 0 24px" }}>Add items to cart first</p>
                    <Link href="/m" style={{ display: "inline-block", padding: "12px 24px", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#F5F0EB", border: "1px solid #333333", borderRadius: "5px", textDecoration: "none" }}>Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="shop-page" id="checkoutPage" style={{ background: "#000000", minHeight: "100vh", paddingBottom: "100px" }}>
            {/* ===== Header ===== */}
            <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", background: "#000", borderBottom: "1px solid #1A1A1A", position: "sticky", top: 0, zIndex: 100 }}>
                <button onClick={handleBack} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#E8B4B8", cursor: "pointer", padding: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", fontWeight: 400, letterSpacing: "0.15em", color: "#F5F0EB", margin: 0, flex: 1, textAlign: "center", textTransform: "uppercase" }}>CHECKOUT</h1>
                <span style={{ width: "32px" }}></span>
            </div>

            {/* ===== Content ===== */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* ===== Order Items Card ===== */}
                <div style={{ background: "#121212", border: "1px solid #1A1A1A", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #1A1A1A" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: "#8A8580", textTransform: "uppercase" }}>Order Items</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#666" }}>{checkoutItems.length} items</span>
                    </div>
                    <div style={{ padding: "0" }}>
                        {checkoutItems.map((item, index) => {
                            const imageSrc = slugToImage[item.product.slug] || "/products/owl/black-leather.png";
                            const unitPrice = getUnitPrice(item);
                            const itemTotal = unitPrice * item.quantity;

                            return (
                                <div key={item.product.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 16px", borderBottom: index < checkoutItems.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                                    <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: 0 }}>
                                        <div style={{ width: "56px", height: "56px", background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                                            <img src={imageSrc} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 400, color: "#F5F0EB", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product.name}</div>
                                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 400, color: "#8A8580", marginTop: "4px" }}>{item.materialOption || "Standard"} × {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace", fontSize: "14px", fontWeight: 500, color: "#E8B4B8", flexShrink: 0, marginLeft: "12px" }}>${itemTotal.toLocaleString()}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== Shipping Information Card ===== */}
                <div style={{ background: "#121212", border: "1px solid #1A1A1A", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1A1A1A" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: "#8A8580", textTransform: "uppercase" }}>Shipping Information</span>
                    </div>
                    <div style={{ padding: "16px" }}>
                        {/* Saved Addresses */}
                        {savedAddresses.length > 0 && (
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {savedAddresses.map(addr => (
                                        <button
                                            key={addr.id}
                                            onClick={() => handleSelectAddress(addr)}
                                            style={{
                                                width: "100%",
                                                padding: "12px 14px",
                                                background: selectedAddressId === addr.id ? "rgba(232, 180, 184, 0.06)" : "#0A0A0A",
                                                border: `1px solid ${selectedAddressId === addr.id ? "#E8B4B8" : "#333333"}`,
                                                borderRadius: "5px",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em", color: "#E8B4B8", textTransform: "uppercase" }}>{addr.label || "Address"}</span>
                                                {addr.isDefault && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#8A8580" }}>Default</span>}
                                            </div>
                                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 400, color: "#F5F0EB" }}>{addr.fullName}</div>
                                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 400, color: "#8A8580", marginTop: "2px" }}>
                                                {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                                            </div>
                                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 400, color: "#8A8580" }}>
                                                {addr.city}, {addr.state} {addr.zipCode}
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleUseNewAddress}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            background: useNewAddress ? "rgba(232, 180, 184, 0.06)" : "transparent",
                                            border: `1px dashed ${useNewAddress ? "#E8B4B8" : "#333333"}`,
                                            borderRadius: "5px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "6px",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={useNewAddress ? "#E8B4B8" : "#8A8580"} strokeWidth="1.5">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 400, color: useNewAddress ? "#E8B4B8" : "#8A8580" }}>Add New Address</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* New Address Form */}
                        {(useNewAddress || savedAddresses.length === 0) && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div>
                                    <select
                                        value={addressForm.country}
                                        onChange={e => setAddressForm({ ...addressForm, country: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: "#F5F0EB",
                                            background: "#0A0A0A",
                                            border: "1px solid #333333",
                                            borderRadius: "5px",
                                            outline: "none"
                                        }}>
                                        {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={addressForm.fullName}
                                        onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: "#F5F0EB",
                                            background: "#0A0A0A",
                                            border: `1px solid ${formErrors.fullName ? "#E8B4B8" : "#333333"}`,
                                            borderRadius: "5px",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }} />
                                    {formErrors.fullName && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.fullName}</div>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={addressForm.email}
                                        onChange={e => setAddressForm({ ...addressForm, email: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: "#F5F0EB",
                                            background: "#0A0A0A",
                                            border: `1px solid ${formErrors.email ? "#E8B4B8" : "#333333"}`,
                                            borderRadius: "5px",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }} />
                                    {formErrors.email && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.email}</div>}
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={addressForm.phone}
                                        onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: "#F5F0EB",
                                            background: "#0A0A0A",
                                            border: `1px solid ${formErrors.phone ? "#E8B4B8" : "#333333"}`,
                                            borderRadius: "5px",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }} />
                                    {formErrors.phone && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.phone}</div>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={addressForm.addressLine1}
                                        onChange={e => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: "#F5F0EB",
                                            background: "#0A0A0A",
                                            border: `1px solid ${formErrors.addressLine1 ? "#E8B4B8" : "#333333"}`,
                                            borderRadius: "5px",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }} />
                                    {formErrors.addressLine1 && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.addressLine1}</div>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Apt, Suite, etc. (optional)"
                                        value={addressForm.addressLine2}
                                        onChange={e => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: "#F5F0EB",
                                            background: "#0A0A0A",
                                            border: "1px solid #333333",
                                            borderRadius: "5px",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={addressForm.city}
                                            onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                                            style={{
                                                width: "100%",
                                                padding: "12px 14px",
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                color: "#F5F0EB",
                                                background: "#0A0A0A",
                                                border: `1px solid ${formErrors.city ? "#E8B4B8" : "#333333"}`,
                                                borderRadius: "5px",
                                                outline: "none",
                                                boxSizing: "border-box"
                                            }} />
                                        {formErrors.city && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.city}</div>}
                                    </div>
                                    {needsStateField && <div>
                                        <input
                                            type="text"
                                            placeholder="State"
                                            value={addressForm.stateProvince}
                                            onChange={e => setAddressForm({ ...addressForm, stateProvince: e.target.value })}
                                            style={{
                                                width: "100%",
                                                padding: "12px 14px",
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                color: "#F5F0EB",
                                                background: "#0A0A0A",
                                                border: `1px solid ${formErrors.stateProvince ? "#E8B4B8" : "#333333"}`,
                                                borderRadius: "5px",
                                                outline: "none",
                                                boxSizing: "border-box"
                                            }} />
                                        {formErrors.stateProvince && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.stateProvince}</div>}
                                    </div>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="ZIP Code"
                                        value={addressForm.postalCode}
                                        onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: "#F5F0EB",
                                            background: "#0A0A0A",
                                            border: `1px solid ${formErrors.postalCode ? "#E8B4B8" : "#333333"}`,
                                            borderRadius: "5px",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }} />
                                    {formErrors.postalCode && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#E8B4B8", marginTop: "4px" }}>{formErrors.postalCode}</div>}
                                </div>

                                {/* Save Address Checkbox */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                                    <button
                                        onClick={() => setSaveNewAddress(!saveNewAddress)}
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            border: `1px solid ${saveNewAddress ? "#E8B4B8" : "#333333"}`,
                                            borderRadius: "3px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: saveNewAddress ? "#E8B4B8" : "transparent",
                                            cursor: "pointer",
                                            flexShrink: 0
                                        }}>
                                        {saveNewAddress && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </button>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#8A8580" }}>Save this address for future orders</span>
                                </div>

                                {/* Address Label */}
                                {saveNewAddress && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#8A8580" }}>Label:</span>
                                        {(["Home", "Office", "Other"] as const).map(label => (
                                            <button
                                                key={label}
                                                onClick={() => setAddressLabel(label)}
                                                style={{
                                                    padding: "6px 12px",
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: "11px",
                                                    fontWeight: 400,
                                                    color: addressLabel === label ? "#E8B4B8" : "#8A8580",
                                                    background: "transparent",
                                                    border: `1px solid ${addressLabel === label ? "#E8B4B8" : "#333333"}`,
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                }}>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== Payment Method Card ===== */}
                <div style={{ background: "#121212", border: "1px solid #1A1A1A", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1A1A1A" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: "#8A8580", textTransform: "uppercase" }}>Payment Method</span>
                    </div>
                    <div style={{ padding: "0" }}>
                        <button
                            onClick={() => setPaymentMethod("credit-card")}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "14px 16px",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid #1A1A1A",
                                cursor: "pointer",
                                textAlign: "left"
                            }}>
                            <span style={{
                                width: "18px",
                                height: "18px",
                                border: `1px solid ${paymentMethod === "credit-card" ? "#E8B4B8" : "#333333"}`,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}>
                                {paymentMethod === "credit-card" && <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#E8B4B8" }}></span>}
                            </span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === "credit-card" ? "#F5F0EB" : "#8A8580"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 400, color: "#F5F0EB" }}>Credit Card</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod("paypal")}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "14px 16px",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left"
                            }}>
                            <span style={{
                                width: "18px",
                                height: "18px",
                                border: `1px solid ${paymentMethod === "paypal" ? "#E8B4B8" : "#333333"}`,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}>
                                {paymentMethod === "paypal" && <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#E8B4B8" }}></span>}
                            </span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={paymentMethod === "paypal" ? "#F5F0EB" : "#8A8580"}>
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .757-.64h6.953c2.297 0 4.147.485 5.195 1.38.995.85 1.394 2.097 1.176 3.707-.37 2.717-2.042 4.49-4.94 5.09-.8.17-1.67.24-2.58.24H8.91a.77.77 0 0 0-.756.64l-.92 5.83a.641.641 0 0 1-.633.74l-.525.003z" />
                            </svg>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 400, color: "#F5F0EB" }}>PayPal</span>
                        </button>
                    </div>
                </div>

                {/* ===== Order Summary Card ===== */}
                <div style={{ background: "#121212", border: "1px solid #1A1A1A", borderRadius: "6px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 400, color: "#8A8580" }}>Subtotal</span>
                        <span style={{ fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace", fontSize: "14px", fontWeight: 500, color: "#F5F0EB" }}>${selectedTotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 400, color: "#8A8580" }}>Shipping</span>
                        <span style={{ fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace", fontSize: "14px", fontWeight: 500, color: shippingFee === 0 ? "#E8B4B8" : "#F5F0EB" }}>
                            {shippingFee === 0 ? "Free" : `$${shippingFee}`}
                        </span>
                    </div>
                    <div style={{ height: "1px", background: "#333333", margin: "8px 0" }}></div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500, color: "#F5F0EB" }}>Total</span>
                        <span style={{ fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace", fontSize: "18px", fontWeight: 600, color: "#E8B4B8" }}>${totalWithShipping.toLocaleString()}</span>
                    </div>
                </div>

                {/* ===== Place Order Button ===== */}
                <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    style={{
                        width: "100%",
                        padding: "16px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#000000",
                        background: "#E8B4B8",
                        border: "none",
                        borderRadius: "5px",
                        cursor: isProcessing ? "not-allowed" : "pointer",
                        opacity: isProcessing ? 0.5 : 1,
                        marginTop: "8px"
                    }}>
                    {isProcessing ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Processing...
                        </span>
                    ) : "Place Order"}
                </button>
            </div>
        </div>
    );
}

// ===== 产品图片映射 =====
const slugToImage: Record<string, string> = {
    "owl-sofa": "/products/owl/black-leather.png",
    "meteorite-ring-sofa": "/products/gorilla-sofa/gray.jpg",
    "silverback-sofa": "/products/gorilla-sofa/charcoal.png",
    "muscle-gorilla-sofa": "/products/gorilla-sofa/muscular.png"
};
