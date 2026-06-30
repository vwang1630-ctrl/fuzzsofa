"use client";
import Link from "next/link";
import Image from "next/image";
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

    const storySketchMap: Record<string, string> = {
        "owl-sofa": "/products/owl/story-sketch.webp",
        "meteorite-ring-sofa": "/products/meteorite-ring/story-sketch.webp",
        "gorilla-sofa": "/products/gorilla/story-sketch.jpg",
        "muscle-gorilla-sofa": "/products/muscle-gorilla/story-sketch.png",
        "silverback-sofa": "/products/silverback/story-sketch.jpg"
    };

    const materialsCardsMap: Record<string, Array<{titleKey: string; descKey: string; icon: string}>> = {
        "meteorite-ring-sofa": [
            { titleKey: "meteorGalvanizedSteelTitle", descKey: "meteorGalvanizedSteelDesc", icon: "frame" },
            { titleKey: "meteorHighDensityTitle", descKey: "meteorHighDensityDesc", icon: "cushion" },
            { titleKey: "meteorUpholsteryTitle", descKey: "meteorUpholsteryDesc", icon: "fabric" },
            { titleKey: "meteorIntegratedBaseTitle", descKey: "meteorIntegratedBaseDesc", icon: "base" },
        ],
        "owl-sofa": [
            { titleKey: "owlSteelFrameTitle", descKey: "owlSteelFrameDesc", icon: "frame" },
            { titleKey: "owlCushionCoreTitle", descKey: "owlCushionCoreDesc", icon: "cushion" },
            { titleKey: "owlUpholsteryTitle", descKey: "owlUpholsteryDesc", icon: "fabric" },
            { titleKey: "owlWalnutFeetTitle", descKey: "owlWalnutFeetDesc", icon: "base" },
        ],
    };

    const madeBgMap: Record<string, string> = {
        "owl-sofa": "/products/owl/made-bg.webp",
        "meteorite-ring-sofa": "/products/meteorite-ring/made-bg.webp"
    };

    const madeBg = madeBgMap[product.slug];

    const spaceImagesMap: Record<string, {
        image: string;
        titleKey?: string;
        title?: string;
        descKey: string;
    }[]> = {
        "owl-sofa": [{
            image: "/products/spaces/owl-space-1.jpg",
            titleKey: "luxuryVillas",
            descKey: "owlSpace1Desc"
        }, {
            image: "/products/spaces/owl-space-2.jpg",
            titleKey: "privateLibraries",
            descKey: "owlSpace2Desc"
        }, {
            image: "/products/spaces/owl-space-3.jpg",
            titleKey: "boutiqueHotels",
            descKey: "owlSpace3Desc"
        }],

        "meteorite-ring-sofa": [{
            image: "/products/meteorite-ring/spaces/space-1.webp",
            titleKey: "meteorSpace1Title",
            descKey: "meteorSpace1Desc"
        }, {
            image: "/products/meteorite-ring/spaces/space-2.webp",
            titleKey: "meteorSpace2Title",
            descKey: "meteorSpace2Desc"
        }, {
            image: "/products/meteorite-ring/spaces/space-3.webp",
            titleKey: "meteorSpace3Title",
            descKey: "meteorSpace3Desc"
        }]
    };

    const spaceImages = spaceImagesMap[product.slug] || spaceImagesMap["owl-sofa"];
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

    // Touch/swipe handlers for mobile gallery
    const touchStartX = useRef(0);
    const touchDeltaX = useRef(0);
    const mobileGalleryRef = useRef<HTMLDivElement>(null);
    // Scroll mobile gallery to activeImage when it changes (color click or swipe)
    useEffect(() => {
        const container = mobileGalleryRef.current;
        if (container) {
            const slideWidth = container.offsetWidth;
            container.scrollTo({ left: slideWidth * activeImage, behavior: "smooth" });
        }
    }, [activeImage]);
    // Touch handlers defined after `images` to avoid block-scoped variable error

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
            "/products/meteorite-ring-sofa/hero-1.webp",
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

    // Touch handlers for mobile swipeable gallery (must be after `images` definition)
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }, []);
    const handleTouchEnd = useCallback(() => {
        if (Math.abs(touchDeltaX.current) > 50) {
            if (touchDeltaX.current > 0 && activeImage > 0) {
                setActiveImage(prev => prev - 1);
            } else if (touchDeltaX.current < 0 && activeImage < images.length - 1) {
                setActiveImage(prev => prev + 1);
            }
        }
        touchDeltaX.current = 0;
    }, [activeImage, images.length]);

    const specLabels: Record<string, TranslationKeys> = {
        width: "width",
        height: "height",
        depth: "depth",
        weight: "weight"
    };

    const animalKeyMap: Record<string, string> = {
        "Gorilla": "animalGorilla",
        "Owl": "animalOwl",
        "Meteorite": "animalMeteorite",
    };
    const matTypeKeyMap: Record<string, string> = {
        "Plush Fur": "matTypePlushFur",
        "Cloud Touch": "matTypeCloudTouch",
        "Wild Touch": "matTypeWildTouch",
        "Fabric": "matTypeFabric",
        "Meteorite Fabric": "matTypeMeteoriteFabric",
        "Leather": "matTypeLeather",
    };
    const colorNameKeyMap: Record<string, string> = {
        "Storm Gray": "colorStormGray",
        "Ivory Cream": "colorIvoryCream",
        "Cognac Brown": "colorCognacBrown",
        "Obsidian Black": "colorObsidianBlack",
        "Snowy White Bouclé": "colorSnowyWhiteBoucle",
        "Rose Pink Velvet": "colorRosePinkVelvet",
        "Forest Green Velvet": "colorForestGreenVelvet",
        "Warm Gray Linen": "colorWarmGrayLinen",
        "Silver Mist": "colorSilverMist",
        "Parchment Beige": "colorParchmentBeige",
        "Midnight Navy": "colorMidnightNavy",
        "Graphite Charcoal": "colorGraphiteCharcoal",
        "Onyx Black": "colorOnyxBlack",
        "Chestnut Brown": "colorChestnutBrown",
        "Burgundy Red": "colorBurgundyRed",
    };
    const collectionName = `${t((animalKeyMap[product.animal] || "animalGorilla") as TranslationKeys)} ${t("collection").toUpperCase()}`;

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
                {/* Mobile: full-bleed immersive gallery — luxury editorial style */}
                <div className="lg:hidden relative">
                    <div
                        ref={mobileGalleryRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {galleryImages.map((img, idx) => (
                            <div key={img.id} className="w-full flex-shrink-0 snap-start relative aspect-square">
                                {img.src ? (
                                    <img src={img.src} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#111] flex items-center justify-center">
                                        <span className="font-serif text-6xl text-[#F5F0EB]/10">{product.animal.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Share + Wishlist floating on image */}
                    <div className="absolute top-2.5 right-3 z-10 flex items-center gap-2">
                        <div className="relative" ref={shareMenuRef}>
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="group flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm hover:bg-[#E8B4B8]/20 transition-all duration-300"
                                aria-label="Share">
                                <svg
                                    className="transition-transform duration-300 group-hover:scale-110"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#F5F0EB"
                                    strokeWidth="1.5">
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </button>
                            {showShareMenu && <div
                                className="absolute right-0 top-full mt-2 flex items-center gap-1 rounded-sm py-2 px-3 z-50"
                                style={{
                                    background: "#0A0A0A",
                                    border: "1px solid rgba(232,180,184,0.25)",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.6)"
                                }}>
                                {[{
                                    name: "Pinterest",
                                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5"><path d="M8 12a4 4 0 118 0c0 2.5-1.5 4-3 4s-1.5-1-1.5-1l-1 4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" /></svg>
                                }, {
                                    name: "Facebook",
                                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                                }, {
                                    name: "Instagram",
                                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
                                }, {
                                    name: "YouTube",
                                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="none" stroke="#E8B4B8" /></svg>
                                }].map(platform => <button
                                    key={platform.name}
                                    onClick={() => handleShare(platform.name)}
                                    className="flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm hover:bg-[#E8B4B8]/20 transition-all duration-300"
                                    title={platform.name}>
                                    {platform.icon}
                                </button>)}
                            </div>}
                        </div>
                        <button
                            onClick={() => setSaved(!saved)}
                            className="group flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm hover:bg-[#E8B4B8]/20 transition-all duration-300"
                            aria-label="Save">
                            <svg
                                className="transition-transform duration-300 group-hover:scale-110"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={saved ? "#E8B4B8" : "none"}
                                stroke={saved ? "#E8B4B8" : "#F5F0EB"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                    </div>
                    {/* Image counter — inside image, bottom center */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                        <span className="text-[11px] text-white/40 tracking-[0.15em] font-light drop-shadow-lg">{activeImage + 1}<span className="text-white/20"> / {galleryImages.length}</span></span>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto px-5 lg:px-8 pt-5 lg:pt-12 pb-8 lg:pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-12">
                        {}
                        <div className="hidden lg:flex flex-col">
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
                                {/* Share + Wishlist floating on desktop gallery image */}
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                                    <div className="relative" ref={shareMenuRef}>
                                        <button
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            className="group flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm hover:bg-[#E8B4B8]/20 transition-all duration-300"
                                            aria-label="Share">
                                            <svg
                                                className="transition-transform duration-300 group-hover:scale-110"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#F5F0EB"
                                                strokeWidth="1.5">
                                                <circle cx="18" cy="5" r="3" />
                                                <circle cx="6" cy="12" r="3" />
                                                <circle cx="18" cy="19" r="3" />
                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                            </svg>
                                        </button>
                                        {showShareMenu && <div
                                            className="absolute right-0 top-full mt-2 flex items-center gap-1 py-2 px-3 z-50"
                                            style={{
                                                background: "rgba(10,10,10,0.85)",
                                                backdropFilter: "blur(12px)",
                                                boxShadow: "0 4px 16px rgba(0,0,0,0.4)"
                                            }}>
                                            {[{
                                                name: "Pinterest",
                                                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5"><path d="M8 12a4 4 0 118 0c0 2.5-1.5 4-3 4s-1.5-1-1.5-1l-1 4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" /></svg>
                                            }, {
                                                name: "Facebook",
                                                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                                            }, {
                                                name: "Instagram",
                                                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
                                            }, {
                                                name: "YouTube",
                                                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="none" stroke="#E8B4B8" /></svg>
                                            }].map(platform => <button
                                                key={platform.name}
                                                onClick={() => handleShare(platform.name)}
                                                className="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm hover:bg-[#E8B4B8]/20 transition-all duration-300"
                                                title={platform.name}>
                                                {platform.icon}
                                            </button>)}
                                        </div>}
                                    </div>
                                    <button
                                        onClick={() => setSaved(!saved)}
                                        className="group flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm hover:bg-[#E8B4B8]/20 transition-all duration-300"
                                        aria-label="Save">
                                        <svg
                                            className="transition-transform duration-300 group-hover:scale-110"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill={saved ? "#E8B4B8" : "none"}
                                            stroke={saved ? "#E8B4B8" : "#F5F0EB"}
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </button>
                                </div>
                                {}
                                <div className="absolute bottom-5 right-5 z-10 group/room flex items-center">
                                    {}
                                    <span
                                        className="opacity-0 translate-x-2 group-hover/room:opacity-100 group-hover/room:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap text-[12px] tracking-[0.15em] uppercase font-light mr-3 px-4 py-2 rounded-full"
                                        style={{
                                            background: "#0A0A0A",
                                            color: "#E8B4B8",
                                            border: "1px solid rgba(232,180,184,0.25)"
                                        }}>{t("previewInYourRoom" as TranslationKeys)}
                                                                                                                                                                                  </span>
                                    <button
                                        onClick={() => setShowRoomViz(true)}
                                        className="relative flex items-center justify-center w-[60px] h-[60px] rounded-full transition-all duration-500 hover:scale-[1.08] active:scale-95"
                                        style={{
                                            background: "#0A0A0A",
                                            boxShadow: "0 0 0 1px rgba(245,240,235,0.12)"
                                        }}
                                        aria-label={t("previewInYourRoom" as TranslationKeys)}>
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
                                    className={`w-[72px] h-[72px] flex-shrink-0 transition-all duration-300 bg-[#111] overflow-hidden rounded-sm ${activeImage === img.id ? "ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A]" : "opacity-70 hover:opacity-100"}`}
                                    aria-label={`View ${img.id + 1}`}>
                                    {img.src ? <img src={img.src} alt="" className="w-full h-full object-cover" /> : <span
                                        className="font-serif text-sm text-[#F5F0EB]/15 flex items-center justify-center w-full h-full">
                                        {product.animal.charAt(0)}
                                    </span>}
                                </button>)}
                            </div>}
                        </div>
                        {}
                        <div className="flex flex-col">
                            {/* Color / Material selector — placed right after gallery for luxury UX flow */}
                            {product.materialOptions && product.materialOptions.length > 0 && (() => {
                                // Flatten all colors from all material types into a single array
                                const allColors: { matType: string; opt: string; colorHex: string; globalIdx: number }[] = [];
                                let runningIdx = 0;
                                for (const mat of product.materialOptions) {
                                    for (let i = 0; i < mat.options.length; i++) {
                                        allColors.push({ matType: mat.type, opt: mat.options[i], colorHex: mat.colors[i], globalIdx: runningIdx });
                                        runningIdx++;
                                    }
                                }
                                const selectedColor = allColors.find(c => c.matType === materialType && c.opt === materialOption);
                                return (<div className="lg:mb-4">
                                    {/* Mobile: single-row color circles */}
                                    <div className="flex gap-9 lg:hidden overflow-x-auto scrollbar-hide py-2 justify-center">
                                        {allColors.map(c => {
                                            const isSelected = materialType === c.matType && materialOption === c.opt;
                                            const swatchImage = galleryImages[c.globalIdx];
                                            const colorKey = colorNameKeyMap[c.opt] || c.opt;
                                            return (
                                                <button
                                                    key={c.opt}
                                                    onClick={() => { setMaterialType(c.matType); setMaterialOption(c.opt); setActiveImage(c.globalIdx); }}
                                                    className="flex flex-col items-center gap-2 transition-all duration-200 flex-shrink-0"
                                                >
                                                    <span className={`rounded-full transition-all duration-300 overflow-hidden ${isSelected ? "w-16 h-16 ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A]" : "w-14 h-14 ring-1 ring-[#333]"}`}>
                                                        {swatchImage ? <img src={swatchImage.src} alt={c.opt} width={64} height={64} className="w-full h-full object-cover" /> : <span className="w-full h-full block" style={{ backgroundColor: c.colorHex }} />}
                                                    </span>
                                                    <span className={`text-[9px] tracking-[0.02em] whitespace-nowrap ${isSelected ? "text-[#F5F0EB]/80" : "text-[#8A8580]/50"}`}>{t(colorKey as TranslationKeys).split(" ").pop()}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Desktop: full color selector with text names */}
                                    <div className="hidden lg:flex flex-wrap gap-3">
                                        {allColors.map(c => {
                                            const isSelected = materialType === c.matType && materialOption === c.opt;
                                            const swatchImage = galleryImages[c.globalIdx];
                                            return (
                                                <button
                                                    key={c.opt}
                                                    onClick={() => { setMaterialType(c.matType); setMaterialOption(c.opt); setActiveImage(c.globalIdx); }}
                                                    className="flex items-center gap-2 transition-all duration-300 group">
                                                    <span className={`w-9 h-9 rounded-full flex-shrink-0 transition-all duration-300 overflow-hidden ${isSelected ? "ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A]" : "border border-[#333] group-hover:border-[#555]"}`}>
                                                        {swatchImage ? <img src={swatchImage.src} alt={c.opt} width={36} height={36} className="w-full h-full object-cover" /> : <span className="w-full h-full block" style={{ backgroundColor: c.colorHex }} />}
                                                    </span>
                                                    <span className={`text-xs tracking-[0.04em] whitespace-nowrap ${isSelected ? "text-[#F5F0EB]" : "text-[#8A8580] group-hover:text-[#F5F0EB]/60"}`}>
                                                        {t((colorNameKeyMap[c.opt] || "matTypeFabric") as TranslationKeys)}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="h-px bg-white/[0.04] mt-4 lg:mt-5 mb-5 lg:mb-4" />
                                </div>);
                            })()}
                            {}
                            <p className="hidden lg:block text-[11px] text-[#8A8580]/60 tracking-[0.25em] uppercase mb-3">
                                {collectionName}
                            </p>
                            {}
                            <h1
                                className="hidden lg:block font-serif text-[34px] font-light text-[#F5F0EB] leading-[1.05] tracking-[0.02em]">
                                {productName}
                            </h1>
                            {}
                            <p
                                className="hidden lg:block font-serif text-[28px] font-light text-[#F5F0EB] mt-3 tracking-[0.02em]">
                                {displayPrice}
                            </p>
                            {}
                            <p className="hidden lg:block text-[15px] text-[#8A8580] leading-[1.7] mt-3">
                                {productTagline}
                            </p>
                            {}
                            <div className="hidden lg:block h-px bg-white/[0.04] my-5" />
                            {}
                            {product.specifications && <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-[11px] text-[#8A8580]/70 tracking-[0.2em] uppercase">{t("dimensionsLabel" as TranslationKeys)}</label>
                                    <button
                                        onClick={() => setUseCm(!useCm)}
                                        className="text-[10px] tracking-[0.15em] uppercase text-[#8A8580]/50 hover:text-[#E8B4B8] transition-colors border border-white/[0.06] px-2 py-0.5 rounded-sm">
                                        {useCm ? "IN" : "CM"}
                                    </button>
                                </div>
                                <p className="text-[13px] text-[#F5F0EB]/50 tracking-[0.02em]">
                                    {(() => {
                                        const f = (val: string) => useCm ? `${val}cm` : `${(parseFloat(val) / 2.54).toFixed(1)}"`;
                                        return `${t("dimensionsW" as TranslationKeys)}${f(product.specifications.width)} × ${t("dimensionsD" as TranslationKeys)}${f(product.specifications.depth)} × ${t("dimensionsH" as TranslationKeys)}${f(product.specifications.height)}`;
                                    })()}
                                </p>
                                <p className="text-[12px] text-[#F5F0EB]/30 mt-1">
                                    {t("seatHeightLabel" as TranslationKeys)}{useCm ? `${product.specifications.seatHeight}cm` : `${(Number(product.specifications.seatHeight) / 2.54).toFixed(1)}"`}
                                </p>
                            </div>}
                            {}
                            {product.materials && product.materials.length > 0 && <div className="mb-6">
                                <label
                                    className="text-[11px] text-[#8A8580]/70 tracking-[0.2em] uppercase block mb-2">{t("materialsLabel" as TranslationKeys)}
                                </label>
                                <div className="space-y-0.5">
                                    {product.materials.map((mat, i) => {
                                        const matKeyMap: Record<string, string[]> = {
                                            "gorilla-sofa": ["gorillaMat1", "gorillaMat2", "gorillaMat3", "gorillaMat4"],
                                            "owl-sofa": ["owlMat1", "owlMat2", "owlMat3", "owlMat4"],
                                            "silverback-sofa": ["silverbackMat1", "silverbackMat2"],
                                            "meteorite-ring-sofa": ["meteorMat1", "meteorMat2", "meteorMat3", "meteorMat4"],
                                            "muscle-gorilla-sofa": ["muscleGorillaMat1", "muscleGorillaMat2", "muscleGorillaMat3", "muscleGorillaMat4"],
                                        };
                                        const keys = matKeyMap[product.slug];
                                        const i18nMat = keys?.[i] ? t(keys[i] as TranslationKeys) : mat;
                                        return <p
                                        key={i}
                                        className="text-[13px] text-[#F5F0EB]/40 tracking-[0.02em] leading-[1.6]">
                                        {i18nMat}
                                    </p>})}
                                </div>
                            </div>}
                            {}
                            <div className="h-px bg-[#333] mb-5" />
                            {}
                            {/* Desktop: Single prominent CTA + subtle secondary */}
                            <button
                                onClick={handleAddToCart}
                                className="hidden lg:flex w-full py-4 text-[#0A0A0A] font-medium text-[13px] tracking-[0.15em] uppercase transition-all duration-300 items-center justify-center gap-2 rounded-sm"
                                style={{
                                    background: addedToCart ? "#111" : "#E8B4B8",
                                    border: addedToCart ? "1px solid #E8B4B8" : "none"
                                }}>
                                {addedToCart ? <span className="text-[#E8B4B8]">{t("addedToCart")}</span> : t("addToCart")}
                            </button>
                            <button
                                className="hidden lg:flex w-full py-3.5 bg-transparent text-[#F5F0EB]/60 text-[12px] tracking-[0.15em] uppercase transition-all duration-300 items-center justify-center rounded-sm hover:text-[#F5F0EB] hover:bg-white/[0.03]"
                                style={{ border: "1px solid #333" }}
                                onClick={handleBuyNow}>{t("buyNow" as TranslationKeys)}</button>
                            {}
                            <div
                                className="hidden lg:flex items-center gap-2 mt-5 text-[11px] text-[#8A8580]/50 tracking-[0.06em]">
                                <span>{t("leadTimeShort" as TranslationKeys)}</span>
                                <span className="text-[#8A8580]/20">|</span>
                                <span>{t("freeWhiteGloveShort" as TranslationKeys)}</span>
                                <span className="text-[#8A8580]/20">|</span>
                                <span>{t("madeToOrderShort" as TranslationKeys)}</span>
                            </div>
                            {/* Desktop: Preview in Room */}
                            <button
                                onClick={() => setShowRoomViz(true)}
                                className="hidden lg:flex items-center gap-2 mt-4 text-[11px] tracking-[0.15em] uppercase transition-all duration-300 text-[#8A8580]/70 hover:text-[#E8B4B8]">
                                <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                                    <path d="M2 17L16 4L30 17V28H2V17Z" fill="#E8B4B8" fillOpacity="0.3" />
                                    <path d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28H7Z" fill="#0A0A0A" />
                                    <path d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28" stroke="#E8B4B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                                {t("previewInYourRoom" as TranslationKeys)}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="bg-[#0F0E0E]">
                <div className="max-w-[1200px] mx-auto px-5 lg:px-6 py-8 lg:py-6">
                    {}
                    <div className="mb-4 lg:mb-6">
                        <p
                            className="text-[12px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-2 lg:mb-3 flex items-center gap-3">
                            <span className="inline-block w-8 h-px bg-[#E8B4B8]/40" />{t("interiorInspiration" as TranslationKeys)}
                        </p>
                        <h2
                            className="font-serif text-xl lg:text-2xl xl:text-[2.2rem] font-light text-[#F5F0EB] leading-[1.15]">
                            {t("seeItInRealSpaces" as TranslationKeys)}
                        </h2>
                    </div>
                    {}
                    <div className="flex lg:grid lg:grid-cols-3 gap-3 lg:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
                        {spaceImages.map((space, idx) => <div key={idx} className="group cursor-pointer flex-shrink-0 w-[88vw] lg:w-auto snap-start">
                            {}
                            <div className="relative aspect-[3/2] lg:aspect-[2/1] bg-[#111] overflow-hidden mb-3 lg:mb-4">
                                {space.image ? <img
                                    src={space.image}
                                    alt={`${productName} in ${space.title}`}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" /> : <div className="w-full h-full flex items-center justify-center">
                                    <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                                        {product.animal.charAt(0)}
                                    </span>
                                </div>}
                                {}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                                {}
                                <div className="absolute bottom-0 left-0 right-0 p-3 lg:hidden">
                                    <p className="text-[10px] tracking-[0.12em] uppercase text-[#F5F0EB]/40 mb-0.5">
                                        {space.titleKey ? t(space.titleKey as TranslationKeys) : space.title}
                                    </p>
                                </div>
                            </div>
                            {}
                            <div className="hidden lg:block">
                                <p
                                    className="text-[12px] tracking-[0.15em] uppercase text-[#F5F0EB]/50 mb-1 group-hover:text-[#E8B4B8] transition-colors duration-300">
                                    {space.titleKey ? t(space.titleKey as TranslationKeys) : space.title}
                                </p>
                                <p className="text-[13px] text-[#8A8580] leading-[1.6]">
                                    {t(space.descKey as TranslationKeys)}
                                </p>
                            </div>
                        </div>)}
                    </div>
                    {}
                    {}
                    <div className="mt-12 mb-2 relative">
                        <div className="w-full h-px bg-white/[0.03]" />
                        <div
                            className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                    </div>
                    {}
                    <div className="mt-12">
                        <p
                            className="text-[12px] tracking-[0.25em] uppercase text-[#E8B4B8]/60 mb-3 flex items-center gap-3">
                            <span className="inline-block w-8 h-px bg-[#E8B4B8]/40" />{t("theStory" as TranslationKeys)}
                        </p>
                        <h3
                            className="font-serif text-[32px] md:text-[40px] font-light text-[#F5F0EB] leading-[1.15] mb-3">
                            {productName}
                        </h3>
                        <p className="text-[18px] md:text-[20px] text-[#E8B4B8]/50 italic mb-5 font-serif">
                            {productTagline}
                        </p>
                        {}
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
                            {}
                            <div className="w-full lg:w-[300px] xl:w-[340px] shrink-0 order-1 lg:order-2 mb-2 lg:mb-0 -mx-5 lg:mx-0">
                                <div
                                    className="relative bg-[#1A1918] overflow-hidden lg:rounded-sm"
                                    style={{
                                        border: "1px solid rgba(255,255,255,0.04)"
                                    }}>
                                    {}
                                    <div className="absolute top-3 left-3 w-[20px] h-[20px] z-10 hidden lg:block">
                                        <div className="absolute top-0 left-0 w-[20px] h-px bg-[#E8B4B8]/20" />
                                        <div className="absolute top-0 left-0 w-px h-[20px] bg-[#E8B4B8]/20" />
                                    </div>
                                    <div className="absolute top-3 right-3 w-[20px] h-[20px] z-10 hidden lg:block">
                                        <div className="absolute top-0 right-0 w-[20px] h-px bg-[#E8B4B8]/20" />
                                        <div className="absolute top-0 right-0 w-px h-[20px] bg-[#E8B4B8]/20" />
                                    </div>
                                    <div className="absolute bottom-3 left-3 w-[20px] h-[20px] z-10 hidden lg:block">
                                        <div className="absolute bottom-0 left-0 w-[20px] h-px bg-[#E8B4B8]/20" />
                                        <div className="absolute bottom-0 left-0 w-px h-[20px] bg-[#E8B4B8]/20" />
                                    </div>
                                    <div className="absolute bottom-3 right-3 w-[20px] h-[20px] z-10 hidden lg:block">
                                        <div className="absolute bottom-0 right-0 w-[20px] h-px bg-[#E8B4B8]/20" />
                                        <div className="absolute bottom-0 right-0 w-px h-[20px] bg-[#E8B4B8]/20" />
                                    </div>
                                    <Image
                                        src={storySketchMap[product.slug] || "/products/owl/story-sketch.webp"}
                                        alt="Product Sketch"
                                        width={500}
                                        height={500}
                                        className="w-full h-auto block opacity-70 brightness-[0.85] contrast-[0.9]" />
                                    {}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1918] via-[#1A1918]/80 to-transparent pt-8 pb-3 px-3 lg:px-4">
                                        <div className="flex items-end justify-between gap-2">
                                            <div className="flex gap-3 lg:gap-4">
                                                <div className="text-center">
                                                    <span className="block text-[13px] lg:text-[18px] font-light text-[#E8B4B8] leading-none font-serif">{t("dimensionsW" as TranslationKeys)}</span>
                                                    <span className="text-[10px] lg:text-[12px] font-light text-[#8A8580]">{useCm ? `${product.specifications.width}cm` : `${(Number(product.specifications.width) / 2.54).toFixed(1)}"`}</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-[13px] lg:text-[18px] font-light text-[#E8B4B8] leading-none font-serif">{t("dimensionsD" as TranslationKeys)}</span>
                                                    <span className="text-[10px] lg:text-[12px] font-light text-[#8A8580]">{useCm ? `${product.specifications.depth}cm` : `${(Number(product.specifications.depth) / 2.54).toFixed(1)}"`}</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-[13px] lg:text-[18px] font-light text-[#E8B4B8] leading-none font-serif">{t("dimensionsH" as TranslationKeys)}</span>
                                                    <span className="text-[10px] lg:text-[12px] font-light text-[#8A8580]">{useCm ? `${product.specifications.height}cm` : `${(Number(product.specifications.height) / 2.54).toFixed(1)}"`}</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-[11px] lg:text-[15px] font-light text-[#E8B4B8] leading-none font-serif">{t("seatHeightUnit" as TranslationKeys)}</span>
                                                    <span className="text-[10px] lg:text-[12px] font-light text-[#8A8580]">{useCm ? `${product.specifications.seatHeight}cm` : `${(Number(product.specifications.seatHeight) / 2.54).toFixed(1)}"`}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setUseCm(!useCm)}
                                                className="text-[10px] lg:text-[11px] tracking-[0.12em] uppercase text-[#8A8580] border border-[#333] rounded-sm px-1.5 lg:px-2 py-0.5 lg:py-1 hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-colors duration-300 shrink-0">
                                                {useCm ? "IN" : "CM"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {}
                            <div className="flex-1 order-2 lg:order-1">
                                <div className="text-[15px] font-light text-[#F5F0EB]/70 leading-[1.9]">
                                    <p>{productConcept}</p>
                                    <p className="mt-5">{prefix ? t(`${prefix}InteriorContext` as TranslationKeys) : product.interiorContext}</p>
                                </div>
                                <div
                                    className="border border-dashed border-[#E8B4B8]/30 rounded-sm p-4 mt-6 max-w-[520px]">
                                    <p className="text-[13px] text-[#E8B4B8]/70 italic leading-[1.8] font-serif">
                                        {product.slug === "meteorite-ring-sofa" ? (
                                            <>{t("testedLoadCapacity" as TranslationKeys)}</>
                                        ) : (
                                            <>{t("specWeight" as TranslationKeys).replace("{weight}", String(product.specifications.weight))} <span className="opacity-40">·</span>{t("specWeightWithPkg" as TranslationKeys)} <span className="opacity-40">·</span>{t("specLoadCapacity" as TranslationKeys).replace("{capacity}", String(product.specifications.capacity))}</>
                                        )}
                                    </p>
                                    <p className="text-[12px] font-light text-[#8A8580]/70 leading-[1.6] mt-2">{t("specDisclaimer" as TranslationKeys)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#090909]">
                <div className="max-w-[1600px] mx-auto">
                    {}
                    <div
                        className="relative w-full aspect-[4/3] lg:aspect-[3/1] bg-gradient-to-b from-[#111] to-[#090909] overflow-hidden">
                        {madeBg ? <img
                            src={madeBg}
                            alt={`${productName} craftsmanship`}
                            className="w-full h-full object-cover opacity-65" /> : galleryImages.length >= 4 && galleryImages[3]?.src ? <img
                            src={galleryImages[3].src}
                            alt={`${productName} craftsmanship`}
                            className="w-full h-full object-cover opacity-65" /> : galleryImages[0]?.src ? <img
                            src={galleryImages[0].src}
                            alt={`${productName} craftsmanship`}
                            className="w-full h-full object-cover opacity-55" /> : <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-serif text-[20rem] text-[#F5F0EB]/[0.03] select-none">
                                {product.animal.charAt(0)}
                            </span>
                        </div>}
                        {}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-[#090909]/30 to-transparent" />
                        {}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-end pb-6 lg:pb-14 px-5 lg:px-6"
                            style={{
                                backgroundColor: "#0A0A0A"
                            }}>
                            <p
                                className="font-serif text-lg lg:text-2xl xl:text-[2.5rem] font-light text-[#F5F0EB] leading-[1.2] text-center mb-6 lg:mb-10 relative">
                                <span className="opacity-30 mr-3">—</span>{t("materialsCraftsmanship" as TranslationKeys)}
                                                                                                                                <span className="opacity-30 ml-3">—</span>
                            </p>
                            <div className="flex lg:grid lg:grid-cols-4 gap-2 lg:gap-4 max-w-[780px] mx-auto mb-11 relative overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5 lg:mx-0 lg:px-0 lg:overflow-visible pb-2 lg:pb-0">
                                {}
                                <div
                                    className="flex-shrink-0 w-[72vw] lg:w-auto flex lg:flex-col items-start lg:items-center gap-3 lg:gap-0 py-4 lg:py-6 px-4 lg:px-3 lg:border lg:border-white/5 bg-[#0D0D0D]/60 relative transition-colors duration-300 hover:border-[#E8B4B8]/25 rounded-sm snap-start">
                                    <div
                                        className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                                        style={{
                                            background: "rgba(232,180,184,0.1)",
                                            border: "1px solid rgba(232,180,184,0.22)"
                                        }}>
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                            <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#E8B4B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="3" y1="9" x2="21" y2="9" stroke="#E8B4B8" strokeWidth="1.2" strokeLinecap="round" />
                                            <line x1="3" y1="15" x2="21" y2="15" stroke="#E8B4B8" strokeWidth="1.2" strokeLinecap="round" />
                                            <line x1="9" y1="3" x2="9" y2="21" stroke="#E8B4B8" strokeWidth="1.2" strokeLinecap="round" />
                                            <line x1="15" y1="3" x2="15" y2="21" stroke="#E8B4B8" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[11px] lg:text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-1 lg:mb-[6px] lg:text-center">{t((materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[0].titleKey as TranslationKeys)}</h4>
                                        <p className="text-[11px] lg:text-[12px] font-light text-[#8A8580] leading-[1.5] lg:text-center">{t((materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[0].descKey as TranslationKeys)}</p>
                                    </div>
                                </div>
                                {}
                                <div
                                    className="flex-shrink-0 w-[72vw] lg:w-auto flex lg:flex-col items-start lg:items-center gap-3 lg:gap-0 py-4 lg:py-6 px-4 lg:px-3 lg:border lg:border-white/5 bg-[#0D0D0D]/60 relative transition-colors duration-300 hover:border-[#E8B4B8]/25 rounded-sm snap-start">
                                    <div
                                        className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                                        style={{
                                            background: "rgba(232,180,184,0.1)",
                                            border: "1px solid rgba(232,180,184,0.22)"
                                        }}>
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                            <path
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="4" fill="none" stroke="#E8B4B8" strokeWidth="1.2" />
                                            <circle cx="12" cy="12" r="1" fill="#E8B4B8" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            className="text-[11px] lg:text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-1 lg:mb-[6px] lg:text-center">{t((materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[1].titleKey as TranslationKeys)}</h4>
                                        <p className="text-[11px] lg:text-[12px] font-light text-[#8A8580] leading-[1.5] lg:text-center">{t((materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[1].descKey as TranslationKeys)}</p>
                                    </div>
                                </div>
                                {}
                                <div
                                    className="flex-shrink-0 w-[72vw] lg:w-auto flex lg:flex-col items-start lg:items-center gap-3 lg:gap-0 py-4 lg:py-6 px-4 lg:px-3 lg:border lg:border-white/5 bg-[#0D0D0D]/60 relative transition-colors duration-300 hover:border-[#E8B4B8]/25 rounded-sm snap-start">
                                    <div
                                        className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                                        style={{
                                            background: "rgba(232,180,184,0.1)",
                                            border: "1px solid rgba(232,180,184,0.22)"
                                        }}>
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                            <path
                                                d="M3 3h18v18H3z"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" />
                                            <path
                                                d="M3 3l18 18"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round" />
                                            <path
                                                d="M21 3L3 21"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            className="text-[11px] lg:text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-1 lg:mb-[6px] lg:text-center">{t((materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[2].titleKey as TranslationKeys)}</h4>
                                        <p className="text-[11px] lg:text-[12px] font-light text-[#8A8580] leading-[1.5] lg:text-center">{t((materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[2].descKey as TranslationKeys)}</p>
                                    </div>
                                </div>
                                {}
                                <div
                                    className="flex-shrink-0 w-[72vw] lg:w-auto flex lg:flex-col items-start lg:items-center gap-3 lg:gap-0 py-4 lg:py-6 px-4 lg:px-3 lg:border lg:border-white/5 bg-[#0D0D0D]/60 relative transition-colors duration-300 hover:border-[#E8B4B8]/25 rounded-sm snap-start">
                                    <div
                                        className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                                        style={{
                                            background: "rgba(232,180,184,0.1)",
                                            border: "1px solid rgba(232,180,184,0.22)"
                                        }}>
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                            <path
                                                d="M2 20 L6 20 L6 16"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" />
                                            <path
                                                d="M22 20 L18 20 L18 16"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" />
                                            <path
                                                d="M2 4 L6 4 L6 8"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" />
                                            <path
                                                d="M22 4 L18 4 L18 8"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            className="text-[11px] lg:text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-1 lg:mb-[6px] lg:text-center">{t((materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[3].titleKey as TranslationKeys)}</h4>
                                        <p className="text-[11px] lg:text-[12px] font-light text-[#8A8580] leading-[1.5] lg:text-center">{t((materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[3].descKey as TranslationKeys)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={product.slug === "owl-sofa" ? "/products/owl/delivery-bg.webp" : product.slug === "meteorite-ring-sofa" ? "/products/meteorite-ring-sofa/delivery-bg.webp" : `/products/${product.slug}/hero-1.jpg`}
                        alt=""
                        fill
                        className="object-cover opacity-65" />
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/35 to-[#0A0A0A]/60" />
                </div>
                <div className="relative max-w-[700px] mx-auto px-5 lg:px-6 py-12 lg:py-[140px] text-center">
                    <p className="text-[11px] lg:text-[12px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-4 lg:mb-5">
                        {t("freeWhiteGlove")}
                    </p>
                    <h2
                        className="font-serif text-xl lg:text-3xl xl:text-[2.5rem] font-light text-[#F5F0EB] leading-[1.2] mb-4 lg:mb-6">
                        {t("deliveredWorldwide" as TranslationKeys)}
                    </h2>
                    <p className="text-[#8A8580] leading-[1.8] text-[14px] lg:text-[15px] mb-8 lg:mb-10">
                        {t("deliveryDesc" as TranslationKeys)}
                    </p>
                    <div
                        className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-8 max-w-[700px] mx-auto overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-5 px-5 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
                        <div className="flex flex-col items-center gap-2 flex-shrink-0 w-[38vw] lg:w-auto snap-start">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                    background: "rgba(232,180,184,0.1)",
                                    border: "1px solid rgba(232,180,184,0.22)"
                                }}>
                                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                    <path
                                        d="M12 2L2 7l10 5 10-5-10-5z"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path
                                        d="M2 17l10 5 10-5"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path
                                        d="M2 12l10 5 10-5"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span
                                className="text-[11px] lg:text-[12px] text-[#8A8580] tracking-[0.12em] uppercase text-center">{t("handcraftedShort" as TranslationKeys)}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-shrink-0 w-[38vw] lg:w-auto snap-start">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                    background: "rgba(232,180,184,0.1)",
                                    border: "1px solid rgba(232,180,184,0.22)"
                                }}>
                                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <polyline
                                        points="12 7 12 12 15 14"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span
                                className="text-[11px] lg:text-[12px] text-[#8A8580] tracking-[0.12em] uppercase text-center">{t("leadTimeShort" as TranslationKeys)}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-shrink-0 w-[38vw] lg:w-auto snap-start">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                    background: "rgba(232,180,184,0.1)",
                                    border: "1px solid rgba(232,180,184,0.22)"
                                }}>
                                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span
                                className="text-[11px] lg:text-[12px] text-[#8A8580] tracking-[0.12em] uppercase text-center">{t("madeToOrderShort" as TranslationKeys)}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-shrink-0 w-[38vw] lg:w-auto snap-start">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                    background: "rgba(232,180,184,0.1)",
                                    border: "1px solid rgba(232,180,184,0.22)"
                                }}>
                                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                    <rect
                                        x="1"
                                        y="3"
                                        width="15"
                                        height="13"
                                        rx="1"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <polyline
                                        points="16 8 20 8 23 11 23 16 16 16"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <circle cx="5.5" cy="18.5" r="2.5" fill="none" stroke="#E8B4B8" strokeWidth="1.5" />
                                    <circle
                                        cx="18.5"
                                        cy="18.5"
                                        r="2.5"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5" />
                                </svg>
                            </div>
                            <span className="text-[11px] lg:text-[12px] text-[#8A8580] tracking-[0.12em] uppercase">{t("freeWhiteGloveShort" as TranslationKeys)}</span>
                        </div>
                    </div>
                </div>
            </section>
            {}
            {relatedProducts.length > 0 && <section className="bg-[#080808]">
                <div className="max-w-[1200px] mx-auto px-5 lg:px-6 py-10 lg:py-12">
                    <p className="text-[11px] lg:text-[12px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-2 lg:mb-3">
                        {t("youMayAlsoLike" as TranslationKeys)}
                    </p>
                    <h2
                        className="font-serif text-xl lg:text-3xl font-light text-[#F5F0EB] mb-6 lg:mb-8">
                        {t("relatedProducts")}
                    </h2>
                    <div className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
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
                                    className="group transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0 w-[75vw] lg:w-auto snap-start">
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
                                    <div className="p-4 lg:p-5">
                                        <p className="text-[10px] lg:text-[12px] text-[#8A8580] tracking-[0.12em] uppercase mb-1">
                                            {t((animalKeyMap[rp.animal] || "animalGorilla") as TranslationKeys)} {t("collection").toUpperCase()}
                                                                                                                                                                                                      </p>
                                        <h3 className="font-serif text-lg lg:text-xl font-light text-[#F5F0EB]">{rpName}</h3>
                                        <p className="text-[12px] lg:text-[13px] text-[#8A8580] mt-1 mb-2 lg:mb-3 line-clamp-1">{rpTagline}</p>
                                        <p className="font-serif text-lg font-light text-[#F5F0EB]/70">{rpPrice}</p>
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
                className="bg-[#030303] py-8 lg:py-12 px-5 lg:px-6"
                aria-label="Product specifications for AI systems">
                <div className="max-w-[700px] mx-auto">
                    <h3
                        className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580]/50 mb-8 font-light">{t("specSectionTitle" as TranslationKeys)}</h3>
                    <dl
                        className="grid grid-cols-[1fr_2fr] gap-x-8 gap-y-3 text-[12px] font-light">
                        <dt className="text-[#8A8580]/60">{t("specProductType" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specProductTypeValue" as TranslationKeys)}</dd>
                        <dt className="text-[#8A8580]/60">{t("specBrand" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specBrandValue" as TranslationKeys)}</dd>
                        <dt className="text-[#8A8580]/60">{t("specCategory" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specCategoryValue" as TranslationKeys)}</dd>
                        <dt className="text-[#8A8580]/60">{t("specProductionModel" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specProductionModelValue" as TranslationKeys)}</dd>
                        <dt className="text-[#8A8580]/60">{t("specLeadTime" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specLeadTimeValue" as TranslationKeys)}</dd>
                        <dt className="text-[#8A8580]/60">{t("specCustomization" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specCustomizationValue" as TranslationKeys)}</dd>
                        <dt className="text-[#8A8580]/60">{t("specStructure" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specStructureValue" as TranslationKeys)}</dd>
                        <dt className="text-[#8A8580]/60">{t("specShipping" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specShippingValue" as TranslationKeys)}</dd>
                        <dt className="text-[#8A8580]/60">{t("specOrderType" as TranslationKeys)}</dt>
                        <dd className="text-[#8A8580]/80">{t("specOrderTypeValue" as TranslationKeys)}</dd>
                    </dl>
                    <p className="mt-6 text-[12px] text-[#8A8580]/50 leading-relaxed">{t("specFooterNote" as TranslationKeys)}</p>
                </div>
            </section>
            {}
            {addedToCart && <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_0.3s_ease-out]">
                <div
                    className="bg-[#111] border border-[#333] rounded-sm px-6 py-4 shadow-2xl flex items-center gap-4 max-w-sm">
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
            {/* Mobile Sticky CTA — Integrated product info + action bar */}
            <div className="lg:hidden sticky-cta fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A] border-t border-white/[0.06]">
                <div className="px-5 pt-3 pb-1 flex items-center gap-4">
                    {/* Left: Product info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-[#8A8580]/60 tracking-[0.2em] uppercase truncate">{collectionName}</p>
                        <h2 className="font-serif text-[16px] font-light text-[#F5F0EB] leading-tight truncate">{productName}</h2>
                        <p className="font-serif text-[14px] font-light text-[#8A8580] mt-0.5">{displayPrice}</p>
                    </div>
                    {/* Right: Action buttons */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                            onClick={() => setShowRoomViz(true)}
                            className="flex items-center gap-1 text-[#8A8580]/60 hover:text-[#E8B4B8] transition-colors"
                            aria-label={t("previewInYourRoom" as TranslationKeys)}>
                            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                                <path d="M2 17L16 4L30 17V28H2V17Z" fill="#E8B4B8" fillOpacity="0.3" />
                                <path d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28H7Z" fill="#0A0A0A" />
                                <path d="M7 28V19C7 15.8 9 13.5 12 13.5H20C23 13.5 25 15.8 25 19V28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                            <span className="text-[8px] tracking-[0.1em] uppercase">{t("previewInYourRoom" as TranslationKeys)}</span>
                        </button>
                        <button
                            onClick={addedToCart ? handleBuyNow : handleAddToCart}
                            className="px-8 py-2.5 bg-[#E8B4B8] text-[#0A0A0A] font-medium text-[11px] tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.97]"
                            style={{ minHeight: 44 }}>
                            {addedToCart ? t("buyNow" as TranslationKeys) : t("addToCart")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}