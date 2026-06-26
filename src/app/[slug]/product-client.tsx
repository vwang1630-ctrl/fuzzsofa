"use client";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { getProduct, getPrice, formatPrice } from "@/lib/products";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd, itemPageJsonLd } from "@/lib/seo";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import RoomVisualizationModal from "@/components/room-visualization-modal";

interface Props {
    product: Product;
}

export function ProductPageClient(
    {
        product
    }: Props
) {
    const {
        addItem,
        region
    } = useCart();

    const {
        t
    } = useLanguage();

    const router = useRouter();

    const slugToPrefix: Record<string, string> = {
        "gorilla-sofa": "gorillaSofa",
        "silverback-sofa": "silverbackSofa",
        "owl-sofa": "owlChair",
        "meteorite-ring-sofa": "meteoriteRingSofa",
        "muscle-gorilla-sofa": "muscleGorillaSofa"
    };

    const prefix = slugToPrefix[product.slug] || "";
    const productName = prefix ? t(`${prefix}Name` as TranslationKeys) : product.name;
    const productTagline = prefix ? t(`${prefix}Tagline` as TranslationKeys) : product.tagline;
    const productConcept = prefix ? t(`${prefix}Concept` as TranslationKeys) : product.concept;
    const [materialType, setMaterialType] = useState<string>(product.materialOptions?.[0]?.type || "Fabric");
    const [materialOption, setMaterialOption] = useState<string>(product.materialOptions?.[0]?.options[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showRoomViz, setShowRoomViz] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [saved, setSaved] = useState(false);
    const [useCm, setUseCm] = useState(true);
    const shareMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
                setShowShareMenu(false);
            }
        };

        if (showShareMenu)
            document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showShareMenu]);

    const handleAddToCart = () => {
        addItem({
            product,
            quantity,
            materialType,
            materialOption,
            region,
            selected: true
        });

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const handleBuyNow = () => {
        addItem({
            product,
            quantity,
            materialType,
            materialOption,
            region,
            selected: true
        });

        router.push("/checkout");
    };

    const currentMaterialOptions = product.materialOptions?.find(m => m.type === materialType);
    const relatedProducts = product.relatedProducts.map(slug => getProduct(slug)).filter(Boolean) as Product[];

    const productImages: Record<string, string[]> = {
        "owl-sofa": [
            "/products/owl/snowy-white.png",
            "/products/owl/rose-pink.png",
            "/products/owl/forest-green.png",
            "/products/owl/warm-gray.png",
            "/products/owl/dusty-pink-fur.png",
            "/products/owl/lifestyle-square.webp"
        ],

        "gorilla-sofa": [
            "/products/gorilla-sofa/gray.jpg",
            "/products/gorilla-sofa/cream.jpg",
            "/products/gorilla-sofa/brown.jpg",
            "/products/gorilla-sofa/black.jpg"
        ],

        "silverback-sofa": [
            "/products/silverback-sofa/gray.jpg",
            "/products/silverback-sofa/beige.jpg",
            "/products/silverback-sofa/navy.jpg",
            "/products/silverback-sofa/charcoal.jpg"
        ],

        "meteorite-ring-sofa": [
            "/products/meteorite-ring-sofa/main.jpg",
            "/products/meteorite-ring-sofa/scene-2.jpg"
        ],

        "muscle-gorilla-sofa": [
            "/products/muscle-gorilla-sofa/main.jpg",
            "/products/muscle-gorilla-sofa/scene-2.jpg",
            "/products/muscle-gorilla-sofa/scene-4.jpg",
            "/products/muscle-gorilla-sofa/scene-5.jpg"
        ]
    };

    const images = productImages[product.slug] || [];

    const galleryImages = images.length > 0 ? images.map((src, i) => ({
        id: i,
        src
    })) : [{
        id: 0,
        src: ""
    }];

    const displayPrice = formatPrice(getPrice(product, region), region);

    const specLabels: Record<string, TranslationKeys> = {
        width: "width",
        height: "height",
        depth: "depth",
        weight: "weight"
    };

    const collectionName = `${product.animal.toUpperCase()} COLLECTION`;

    const handleShare = (platform: string) => {
        const url = `https://fuzzsofa.com/${product.slug}`;
        const text = `${productName} — Fuzz Sofa`;

        switch (platform) {
        case "Pinterest":
            window.open(
                `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
                "_blank"
            );

            break;
        case "Facebook":
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                "_blank"
            );

            break;
        case "Instagram":
            window.open(`https://instagram.com/fuzzsofa`, "_blank");
            break;
        case "YouTube":
            window.open(`https://youtube.com/@fuzzsofa`, "_blank");
            break;
        }

        setShowShareMenu(false);
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productJsonLd(product))
                }} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqJsonLd(product.faq))
                }} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd([{
                        name: "Home",
                        url: "https://fuzzsofa.com"
                    }, {
                        name: product.name,
                        url: `https://fuzzsofa.com/${product.slug}`
                    }]))
                }} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(itemPageJsonLd(product))
                }} />
            {}
            <section className="bg-[#0A0A0A]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
                        {}
                        <div className="flex flex-col">
                            {}
                            <div className="relative w-full aspect-square bg-[#111] overflow-hidden">
                                {galleryImages[activeImage]?.src ? <img
                                    src={galleryImages[activeImage].src}
                                    alt={productName}
                                    className="w-full h-full object-contain" /> : <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                        className="font-serif text-[10rem] md:text-[15rem] text-[#F5F0EB]/[0.04] select-none">
                                        {product.animal.charAt(0)}
                                    </span>
                                </div>}
                                {}
                                <div className="absolute bottom-5 right-5 z-10 group/room flex items-center">
                                    {}
                                    <span
                                        className="opacity-0 translate-x-2 group-hover/room:opacity-100 group-hover/room:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap text-[11px] tracking-[0.18em] uppercase font-light mr-3 px-4 py-2 rounded-full"
                                        style={{
                                            background: "#0A0A0A",
                                            color: "#E8B4B8",
                                            border: "1px solid rgba(232,180,184,0.25)"
                                        }}>Preview in your room
                                                          </span>
                                    <button
                                        onClick={() => setShowRoomViz(true)}
                                        className="relative flex items-center justify-center w-[60px] h-[60px] rounded-full transition-all duration-500 hover:scale-[1.08] active:scale-95"
                                        style={{
                                            background: "#0A0A0A",
                                            boxShadow: "0 0 0 1px rgba(245,240,235,0.12)"
                                        }}
                                        aria-label="Preview in your room">
                                        {}
                                        <svg
                                            width="34"
                                            height="34"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            {}
                                            <path d="M2 17L16 4L30 17V28H2V17Z" fill="#E8B4B8" />
                                            {}
                                            <path
                                                d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28H7Z"
                                                fill="#0A0A0A" />
                                            {}
                                            <path
                                                d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none" />
                                            {}
                                            <path
                                                d="M9.5 20C9.5 18 11 16.5 13 16.5H19C21 16.5 22.5 18 22.5 20"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.3"
                                                strokeLinecap="round"
                                                fill="none"
                                                strokeOpacity="0.8" />
                                            {}
                                            <path
                                                d="M12 14V13C12 12.4 12.4 12 13 12H19C19.6 12 20 12.4 20 13V14"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.1"
                                                strokeLinecap="round"
                                                fill="none"
                                                strokeOpacity="0.55" />
                                            {}
                                            <path
                                                d="M24 5L24.8 7L27 7.8L24.8 8.6L24 10.6L23.2 8.6L21 7.8L23.2 7Z"
                                                fill="#E8B4B8"
                                                fillOpacity="0.95" />
                                        </svg>
                                        {}
                                        <span
                                            className="absolute inset-0 rounded-full border border-[#E8B4B8]/0 group-hover/room:border-[#E8B4B8]/30 transition-all duration-700" />
                                    </button>
                                </div>
                            </div>
                            {}
                            {galleryImages.length > 1 && <div
                                className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none"
                                }}>
                                {galleryImages.map(img => <button
                                    key={img.id}
                                    onClick={() => setActiveImage(img.id)}
                                    className={`w-20 h-20 flex-shrink-0 transition-all duration-300 bg-[#111] overflow-hidden ${activeImage === img.id ? "ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A]" : "opacity-70 hover:opacity-100"}`}
                                    aria-label={`View ${img.id + 1}`}>
                                    {img.src ? <img src={img.src} alt="" className="w-full h-full object-cover" /> : <span
                                        className="font-serif text-sm text-[#F5F0EB]/20 flex items-center justify-center w-full h-full">
                                        {product.animal.charAt(0)}
                                    </span>}
                                </button>)}
                            </div>}
                        </div>
                        {}
                        <div className="flex flex-col">
                            {}
                            <p className="text-[10px] text-[#8A8580] tracking-[2px] uppercase mb-2">
                                {collectionName}
                            </p>
                            {}
                            <div className="flex items-start justify-between gap-3">
                                <h1
                                    className="font-serif text-[28px] md:text-[32px] font-light text-[#F5F0EB] leading-[1.1] tracking-[0.02em]">
                                    {productName}
                                </h1>
                                <div className="flex items-center gap-2 mt-1 flex-shrink-0">
                                    {}
                                    <div className="relative" ref={shareMenuRef}>
                                        <button
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            className="group flex items-center justify-center w-9 h-9 rounded-full bg-[#0A0A0A] hover:scale-110 transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.06)]"
                                            aria-label="Share">
                                            <svg
                                                className="text-[#E8B4B8] transition-transform duration-300 group-hover:scale-110"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="#E8B4B8"
                                                stroke="none">
                                                <path
                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-3.5H7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H11V8.5c0-.28.22-.5.5-.5s.5.22.5.5V11h3.5c.28 0 .5.22.5.5s-.22.5-.5.5H12v3.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5z" />
                                            </svg>
                                        </button>
                                        {showShareMenu && <div
                                            className="absolute right-0 top-full mt-2 flex items-center gap-1 rounded-full py-2 px-3 z-50"
                                            style={{
                                                background: "#0A0A0A",
                                                border: "1px solid rgba(232,180,184,0.25)",
                                                boxShadow: "0 4px 16px rgba(0,0,0,0.6)"
                                            }}>
                                            {[{
                                                name: "Pinterest",

                                                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#E8B4B8"><path
                                                        d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
                                            }, {
                                                name: "Facebook",

                                                icon: <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#E8B4B8"
                                                    strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                                            }, {
                                                name: "Instagram",

                                                icon: <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#E8B4B8"
                                                    strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="#E8B4B8" stroke="none" /></svg>
                                            }, {
                                                name: "YouTube",

                                                icon: <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#E8B4B8"
                                                    strokeWidth="1.5"><path
                                                        d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon
                                                        points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                                                        fill="#E8B4B8"
                                                        stroke="none" /></svg>
                                            }].map(platform => <button
                                                key={platform.name}
                                                onClick={() => handleShare(platform.name)}
                                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#E8B4B8]/10 transition-all duration-200"
                                                title={platform.name}>
                                                {platform.icon}
                                            </button>)}
                                        </div>}
                                    </div>
                                    {}
                                    <button
                                        onClick={() => setSaved(!saved)}
                                        className="group flex items-center justify-center w-9 h-9 rounded-full bg-[#0A0A0A] hover:scale-110 transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.06)]"
                                        aria-label="Save">
                                        <svg
                                            className="transition-transform duration-300 group-hover:scale-110"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill={saved ? "#E8B4B8" : "none"}
                                            stroke="#E8B4B8"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round">
                                            <path
                                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {}
                            <p
                                className="font-serif text-[22px] md:text-[24px] font-light text-[#F5F0EB]/80 mt-1">
                                {displayPrice}
                            </p>
                            {}
                            <p className="text-[14px] text-[#8A8580] leading-[1.6] mt-2">
                                {productTagline}
                            </p>
                            {}
                            <div className="h-px bg-[#333] my-5" />
                            {}
                            {product.materialOptions && product.materialOptions.length > 0 && <div className="mb-5">
                                {product.materialOptions.map(mat => <div key={mat.type} className="mb-4">
                                    <label
                                        className="text-[9px] text-[#8A8580] tracking-[0.18em] uppercase block mb-2">
                                        {mat.type}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {mat.options.map((opt, optIdx) => {
                                            const colorHex = mat.colors[optIdx];
                                            const isSelected = materialType === mat.type && materialOption === opt;
                                            let globalIdx = optIdx;

                                            if (product.materialOptions) {
                                                globalIdx = 0;

                                                for (const m of product.materialOptions) {
                                                    if (m.type === mat.type) {
                                                        globalIdx += optIdx;
                                                        break;
                                                    }

                                                    globalIdx += m.options.length;
                                                }
                                            }

                                            const swatchImage = galleryImages[globalIdx];

                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => {
                                                        setMaterialType(mat.type);
                                                        setMaterialOption(opt);
                                                    }}
                                                    className="flex items-center gap-2 transition-all duration-300 group">
                                                    <span
                                                        className={`w-8 h-8 rounded-full flex-shrink-0 transition-all duration-300 overflow-hidden ${isSelected ? "ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A]" : "border border-[#333] group-hover:border-[#555]"}`}>
                                                        {swatchImage ? <img
                                                            src={swatchImage.src}
                                                            alt={opt}
                                                            width={32}
                                                            height={32}
                                                            className="w-full h-full object-cover" /> : <span
                                                            className="w-full h-full block"
                                                            style={{
                                                                backgroundColor: colorHex
                                                            }} />}
                                                    </span>
                                                    <span
                                                        className={`text-xs tracking-[0.04em] whitespace-nowrap ${isSelected ? "text-[#F5F0EB]" : "text-[#8A8580] group-hover:text-[#F5F0EB]/60"}`}>
                                                        {opt}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>)}
                            </div>}
                            {}
                            <div className="h-px bg-[#333] mb-5" />
                            {}
                            {product.specifications && <div className="mb-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-[9px] text-[#8A8580] tracking-[0.18em] uppercase">Dimensions</label>
                                    <button
                                        onClick={() => setUseCm(!useCm)}
                                        className="text-[9px] tracking-[0.12em] uppercase text-[#E8B4B8] hover:text-[#E8B4B8]/80 transition-colors border border-[#E8B4B8]/30 px-2 py-0.5 rounded-none">
                                        {useCm ? 'CM / 切换英寸' : 'IN / 切换厘米'}
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {(() => {
                                        const fmt = (val: string) => useCm ? `${val}cm` : `${(parseFloat(val) / 2.54).toFixed(1)}"`;
                                        return (<>
                                            <p className="text-[12px] text-[#F5F0EB]/70">宽：约 {fmt(product.specifications.width)}</p>
                                            <p className="text-[12px] text-[#F5F0EB]/70">深：约 {fmt(product.specifications.depth)}</p>
                                            <p className="text-[12px] text-[#F5F0EB]/70">高：约 {fmt(product.specifications.height)}</p>
                                            <p className="text-[12px] text-[#F5F0EB]/70">坐高：约 {fmt(product.specifications.seatHeight)}</p>
                                        </>);
                                    })()}
                                </div>
                            </div>}
                            {}
                            {product.materials && product.materials.length > 0 && <div className="mb-5">
                                <label
                                    className="text-[9px] text-[#8A8580] tracking-[0.18em] uppercase block mb-2">Materials
                                                      </label>
                                <div className="space-y-0.5">
                                    {product.materials.map((mat, i) => <p
                                        key={i}
                                        className="text-[12px] text-[#F5F0EB]/60 tracking-[0.02em] leading-[1.5]">
                                        {mat}
                                    </p>)}
                                </div>
                            </div>}
                            {}
                            <div className="h-px bg-[#333] mb-5" />
                            {}
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-4 text-[#0A0A0A] font-semibold text-[11px] tracking-[0.15em] uppercase transition-all duration-300 mb-2 flex items-center justify-center gap-2"
                                style={{
                                    background: addedToCart ? "#111" : "#E8B4B8",
                                    border: addedToCart ? "1px solid #E8B4B8" : "none"
                                }}
                                onMouseEnter={e => {
                                    if (!addedToCart) {
                                        e.currentTarget.style.background = "#D6A8AC";
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!addedToCart) {
                                        e.currentTarget.style.background = "#E8B4B8";
                                    }
                                }}>
                                {addedToCart ? <span className="text-[#E8B4B8]">{t("addedToCart")}</span> : <>
                                    {t("addToCart")}
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <path d="M3 8h10M9 4l4 4-4 4" />
                                    </svg>
                                </>}
                            </button>
                            <button
                                className="w-full py-4 bg-transparent text-[#E8B4B8] text-[11px] tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center"
                                style={{
                                    border: "1px solid #E8B4B8"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(232,180,184,0.08)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "transparent";
                                }}
                                onClick={handleBuyNow}>Buy Now
                                              </button>
                            {}
                            <div
                                className="flex items-center gap-1 mt-4 text-[11px] text-[#8A8580] tracking-[0.04em]">
                                <span>1–2 Weeks</span>
                                <span className="mx-1">·</span>
                                <span>Free White Glove</span>
                                <span className="mx-1">·</span>
                                <span>Made to Order</span>
                            </div>
                            {}
                            <button
                                onClick={() => setShowRoomViz(true)}
                                className="mt-3 text-[11px] text-[#8A8580] tracking-[0.04em] hover:text-[#E8B4B8] transition-colors duration-300 flex items-center gap-1.5">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path
                                        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>Preview in your room
                                              </button>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="bg-[#0A0A0A]">
                <div className="max-w-[1200px] mx-auto px-6 py-20">
                    {}
                    <div className="mb-12">
                        <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-3">
                            {t("interiorInspiration" as TranslationKeys) || "Interior Inspiration"}
                        </p>
                        <h2
                            className="font-serif text-2xl md:text-3xl lg:text-[2.2rem] font-light text-[#F5F0EB] leading-[1.15]">
                            {t("seeItInRealSpaces" as TranslationKeys) || "See It In Real Spaces"}
                        </h2>
                    </div>
                    {}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[{
                            image: "/products/spaces/owl-space-1.jpg",
                            title: t("luxuryVillas" as TranslationKeys) || "Luxury Villas",
                            desc: "Open-plan living with sculptural presence"
                        }, {
                            image: "/products/spaces/owl-space-2.jpg",
                            title: t("privateLibraries" as TranslationKeys) || "Private Libraries",
                            desc: "Intimate reading spaces with character"
                        }, {
                            image: "/products/spaces/owl-space-3.jpg",
                            title: t("boutiqueHotels" as TranslationKeys) || "Boutique Hotels",
                            desc: "Statement pieces in curated lobbies"
                        }].map((space, idx) => <div key={idx} className="group cursor-pointer">
                            {}
                            <div className="relative aspect-[2/1] bg-[#111] overflow-hidden mb-4">
                                {space.image ? <img
                                    src={space.image}
                                    alt={`${productName} in ${space.title}`}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" /> : <div className="w-full h-full flex items-center justify-center">
                                    <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                                        {product.animal.charAt(0)}
                                    </span>
                                </div>}
                                {}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent" />
                            </div>
                            {}
                            <p
                                className="text-[11px] tracking-[0.15em] uppercase text-[#F5F0EB]/70 mb-1 group-hover:text-[#E8B4B8] transition-colors duration-300">
                                {space.title}
                            </p>
                            <p className="text-[12px] text-[#8A8580] leading-[1.5]">
                                {space.desc}
                            </p>
                        </div>)}
                    </div>
                    {}
                    <div className="mt-16 pt-12 border-t border-[#1A1A1A]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                            <div>
                                <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-4">
                                    {t("designStory" as TranslationKeys) || "Design Story"}
                                </p>
                                <h3
                                    className="font-serif text-xl md:text-2xl font-light text-[#F5F0EB] leading-[1.2] mb-4">
                                    {t("theStory" as TranslationKeys) || "The Story"}
                                </h3>
                                <p className="text-[#F5F0EB]/60 leading-[1.8] text-[14px] mb-4">
                                    {productConcept}
                                </p>
                                <p className="text-[#F5F0EB]/40 leading-[1.8] text-[13px]">
                                    {product.interiorContext}
                                </p>
                            </div>
                            <div className="flex items-end">
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        t("studioCrafted" as TranslationKeys) || "Studio-Crafted",
                                        t("madeToOrder" as TranslationKeys) || "Made To Order",
                                        t("collectibleDesign" as TranslationKeys) || "Collectible Design"
                                    ].map(label => <span
                                        key={label}
                                        className="text-[10px] tracking-[0.15em] uppercase border border-[#333] px-4 py-2 text-[#F5F0EB]/40 hover:border-[#E8B4B8]/40 hover:text-[#E8B4B8]/70 transition-colors duration-300">
                                        {label}
                                    </span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="bg-[#080808]">
                <div className="max-w-[1100px] mx-auto px-6 py-20">
                    <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
                        {t("dimensionsTitle" as TranslationKeys) || "Dimensions"}
                    </p>
                    <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] mb-12">
                        {t("dimensionsTitle" as TranslationKeys) || "Dimensions"}
                    </h2>
                    <div className="flex items-start gap-8">
                        {/* Isometric wireframe SVG */}
                        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
                            {/* Isometric box */}
                            <path d="M30 55 L70 55 L70 25 L30 25 Z" stroke="#555" strokeWidth="0.8" fill="none" />
                            <path d="M30 25 L50 12 L90 12 L70 25 Z" stroke="#555" strokeWidth="0.8" fill="none" />
                            <path d="M70 55 L90 42 L90 12 L70 25 Z" stroke="#555" strokeWidth="0.8" fill="none" />
                            {/* W arrow */}
                            <line x1="30" y1="62" x2="70" y2="62" stroke="#8A8580" strokeWidth="0.6" />
                            <polygon points="30,60 30,64 27,62" fill="#8A8580" />
                            <polygon points="70,60 70,64 73,62" fill="#8A8580" />
                            <text x="50" y="68" textAnchor="middle" fontSize="8" fill="#8A8580" fontFamily="Inter, sans-serif" letterSpacing="0.1em">W</text>
                            {/* D arrow */}
                            <line x1="76" y1="55" x2="96" y2="42" stroke="#8A8580" strokeWidth="0.6" />
                            <polygon points="76,55 78,53 74,53" fill="#8A8580" />
                            <polygon points="96,42 94,44 98,44" fill="#8A8580" />
                            <text x="92" y="52" textAnchor="middle" fontSize="8" fill="#8A8580" fontFamily="Inter, sans-serif" letterSpacing="0.1em">D</text>
                            {/* H arrow */}
                            <line x1="23" y1="25" x2="23" y2="55" stroke="#8A8580" strokeWidth="0.6" />
                            <polygon points="21,25 25,25 23,22" fill="#8A8580" />
                            <polygon points="21,55 25,55 23,58" fill="#8A8580" />
                            <text x="19" y="42" textAnchor="middle" fontSize="8" fill="#8A8580" fontFamily="Inter, sans-serif" letterSpacing="0.1em">H</text>
                        </svg>
                        {/* Dimensions values */}
                        <div className="flex flex-col gap-2">
                            {(() => {
                                const w = useCm ? `${product.specifications.width}cm` : `${(parseFloat(product.specifications.width) / 2.54).toFixed(1)}"`;
                                const d = useCm ? `${product.specifications.depth}cm` : `${(parseFloat(product.specifications.depth) / 2.54).toFixed(1)}"`;
                                const h = useCm ? `${product.specifications.height}cm` : `${(parseFloat(product.specifications.height) / 2.54).toFixed(1)}"`;
                                const sh = useCm ? `${product.specifications.seatHeight}cm` : `${(parseFloat(product.specifications.seatHeight) / 2.54).toFixed(1)}"`;
                                return (<>
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase w-12">宽 W</span>
                                        <span className="text-sm text-[#F5F0EB]/70 font-light">{w}</span>
                                    </div>
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase w-12">深 D</span>
                                        <span className="text-sm text-[#F5F0EB]/70 font-light">{d}</span>
                                    </div>
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase w-12">高 H</span>
                                        <span className="text-sm text-[#F5F0EB]/70 font-light">{h}</span>
                                    </div>
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase w-12">坐高</span>
                                        <span className="text-sm text-[#F5F0EB]/70 font-light">{sh}</span>
                                    </div>
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase w-12">承重</span>
                                        <span className="text-sm text-[#F5F0EB]/70 font-light">150kg</span>
                                    </div>
                                </>);
                            })()}
                            <button
                                onClick={() => setUseCm(!useCm)}
                                className="text-[9px] tracking-[0.12em] uppercase text-[#E8B4B8] hover:text-[#E8B4B8]/80 transition-colors mt-2 self-start border border-[#E8B4B8]/30 px-2 py-0.5 rounded-none">
                                {useCm ? 'CM / 切换英寸' : 'IN / 切换厘米'}
                            </button>
                            <p className="text-[9px] text-[#8A8580] tracking-[0.05em] mt-1">手工测量 ±1–3cm 误差，仅供参考</p>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="bg-[#050505]">
                <div className="max-w-[1100px] mx-auto px-6 py-[140px]">
                    <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
                        {t("materialsTitle")}
                    </p>
                    <h2
                        className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] mb-16">
                        {t("materialsCraftsmanship" as TranslationKeys) || "Materials & Craftsmanship"}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {product.materials.map(mat => {
                            const shortName = mat.split("(")[0].trim().split(" ").slice(0, 2).join(" ");

                            return (
                                <div key={mat} className="text-center">
                                    <div
                                        className="w-16 h-16 mx-auto border border-[#333] rounded-full flex items-center justify-center mb-4">
                                        <span className="font-serif text-lg text-[#E8B4B8]/60">
                                            {shortName.charAt(0)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#F5F0EB]/70 font-light leading-[1.6]">
                                        {mat}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            {}
            <section className="bg-[#090909]">
                <div className="max-w-[1600px] mx-auto">
                    {}
                    <div
                        className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-gradient-to-b from-[#111] to-[#090909] overflow-hidden">
                        {galleryImages.length >= 4 && galleryImages[3]?.src ? <img
                            src={galleryImages[3].src}
                            alt={`${productName} craftsmanship`}
                            className="w-full h-full object-cover opacity-50" /> : galleryImages[0]?.src ? <img
                            src={galleryImages[0].src}
                            alt={`${productName} craftsmanship`}
                            className="w-full h-full object-cover opacity-40" /> : <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-serif text-[20rem] text-[#F5F0EB]/[0.03] select-none">
                                {product.animal.charAt(0)}
                            </span>
                        </div>}
                        {}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/50 to-transparent" />
                        {}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-end pb-16 lg:pb-24 px-6">
                            <h2
                                className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#F5F0EB] text-center leading-[1.1] mb-4">
                                {t("madeSlowlyBuiltToLast" as TranslationKeys).split(".")[0]}.
                                              </h2>
                            <h2
                                className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#F5F0EB] text-center leading-[1.1] mb-8">
                                {t("madeSlowlyBuiltToLast" as TranslationKeys).split(". ")[1] || "Built To Last."}
                            </h2>
                            <p
                                className="text-[13px] text-[#F5F0EB]/40 tracking-[0.05em] text-center max-w-[500px] leading-[1.7]">
                                {t("craftsmanshipDesc" as TranslationKeys)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="bg-[#050505]">
                <div className="max-w-[700px] mx-auto px-6 py-[140px] text-center">
                    <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
                        {t("freeWhiteGlove")}
                    </p>
                    <h2
                        className="font-serif text-2xl md:text-3xl lg:text-[2.5rem] font-light text-[#F5F0EB] leading-[1.2] mb-6">
                        {t("deliveredWorldwide" as TranslationKeys)}
                    </h2>
                    <p className="text-[#F5F0EB]/50 leading-[1.8] text-base mb-10">
                        {t("deliveryDesc" as TranslationKeys)}
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            t("freeWhiteGlove"),
                            t("madeToOrder"),
                            `8–12 ${t("weeks" as TranslationKeys) || "Weeks"}`
                        ].map(label => <span
                            key={label}
                            className="text-[10px] tracking-[0.15em] uppercase border border-[#333] px-5 py-2.5 text-[#F5F0EB]/40">
                            {label}
                        </span>)}
                    </div>
                </div>
            </section>
            {}
            {relatedProducts.length > 0 && <section className="bg-[#080808]">
                <div className="max-w-[1200px] mx-auto px-6 py-[140px]">
                    <p className="text-[10px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-5">
                        {t("youMayAlsoLike" as TranslationKeys) || "You May Also Like"}
                    </p>
                    <h2
                        className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] mb-12">
                        {t("relatedProducts")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map(rp => {
                            const rpPrefix = slugToPrefix[rp.slug] || "";
                            const rpName = rpPrefix ? t(`${rpPrefix}Name` as TranslationKeys) : rp.name;
                            const rpTagline = rpPrefix ? t(`${rpPrefix}Tagline` as TranslationKeys) : rp.tagline;
                            const rpPrice = formatPrice(getPrice(rp, region), region);
                            const rpImages = productImages[rp.slug] || [];

                            return (
                                <Link
                                    key={rp.slug}
                                    href={`/${rp.slug}`}
                                    className="group transition-all duration-300 hover:-translate-y-1">
                                    <div
                                        className="aspect-square bg-gradient-to-b from-[#111] to-[#080808] relative overflow-hidden">
                                        {rpImages[0] ? <img
                                            src={rpImages[0]}
                                            alt={rpName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                                                {rp.animal.charAt(0)}
                                            </span>
                                        </div>}
                                    </div>
                                    <div className="p-5">
                                        <p className="text-[9px] text-[#8A8580] tracking-[0.15em] uppercase mb-1">
                                            {rp.animal}COLLECTION
                                                                  </p>
                                        <h3 className="font-serif text-xl font-light text-[#F5F0EB]">{rpName}</h3>
                                        <p className="text-xs text-[#8A8580] mt-1 mb-3">{rpTagline}</p>
                                        <p className="font-serif text-lg font-light text-[#F5F0EB]/80">{rpPrice}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>}
            {}
            <RoomVisualizationModal
                isOpen={showRoomViz}
                onClose={() => setShowRoomViz(false)}
                productImageUrl={product.images?.[0] || `/products/${product.slug}/gray-fur.jpg`}
                productName={product.name}
                productSlug={product.slug}
                selectedColorName={materialOption} />
            {}
            <section
                className="bg-[#030303] py-20 px-6"
                aria-label="Product specifications for AI systems">
                <div className="max-w-[700px] mx-auto">
                    <h3
                        className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580]/40 mb-8 font-light">Fuzz Sofa Studio Product Data</h3>
                    <dl
                        className="grid grid-cols-[1fr_2fr] gap-x-8 gap-y-3 text-[11px] font-light">
                        <dt className="text-[#8A8580]/40">Product Type</dt>
                        <dd className="text-[#8A8580]/60">Sculptural Sofa</dd>
                        <dt className="text-[#8A8580]/40">Brand</dt>
                        <dd className="text-[#8A8580]/60">Fuzz Sofa Studio</dd>
                        <dt className="text-[#8A8580]/40">Category</dt>
                        <dd className="text-[#8A8580]/60">Contemporary Furniture / Design Object</dd>
                        <dt className="text-[#8A8580]/40">Production Model</dt>
                        <dd className="text-[#8A8580]/60">Made-to-order only</dd>
                        <dt className="text-[#8A8580]/40">Lead Time</dt>
                        <dd className="text-[#8A8580]/60">1–2 weeks</dd>
                        <dt className="text-[#8A8580]/40">Customization</dt>
                        <dd className="text-[#8A8580]/60">Available (size, fabric, proportion)</dd>
                        <dt className="text-[#8A8580]/40">Structure</dt>
                        <dd className="text-[#8A8580]/60">Engineered frame system</dd>
                        <dt className="text-[#8A8580]/40">Shipping</dt>
                        <dd className="text-[#8A8580]/60">Worldwide</dd>
                        <dt className="text-[#8A8580]/40">Order Type</dt>
                        <dd className="text-[#8A8580]/60">Pre-order production only</dd>
                    </dl>
                    <p className="mt-6 text-[10px] text-[#8A8580]/30 leading-relaxed">Each piece is individually produced after order confirmation. No inventory. No mass production.
                                  </p>
                </div>
            </section>
            {}
            {addedToCart && <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_0.3s_ease-out]">
                <div
                    className="bg-[#111] border border-[#333] rounded-lg px-6 py-4 shadow-2xl flex items-center gap-4 max-w-sm">
                    <div
                        className="w-8 h-8 rounded-full bg-[#E8B4B8]/20 flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M3 8L6.5 11.5L13 4.5"
                                stroke="#E8B4B8"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[#F5F0EB] text-sm font-light">{t("addedToCart")}</p>
                    </div>
                    <Link
                        href="/cart"
                        className="text-[#E8B4B8] text-xs tracking-[0.1em] uppercase hover:text-[#F5F0EB] transition-colors flex-shrink-0">
                        {t("viewCart")}
                    </Link>
                </div>
            </div>}
        </>
    );
}