"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import CosmicInspiration from "@/components/cosmic-inspiration";
import type { Product } from "@/lib/products";
import { getPrice, formatPrice } from "@/lib/products";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd, itemPageJsonLd, spaceImagesJsonLd } from "@/lib/seo";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import RoomVisualizationModal from "@/components/room-visualization-modal";

interface Props {
    product: Product;
    relatedProducts?: Product[];
}

export function ProductPageClient(
    {
        product,
        relatedProducts: relatedProductsProp = []
    }: Props
) {
    const {
        addItem,
        region
    } = useCart();

    const {
        t,
        locale: lang
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

    const scenesMap: Record<string, {
        image: string;
        label: string;
    }[]> = {
        "owl-sofa": [{
            image: "/products/owl/detail-1.jpg",
            label: "泡沫模型"
        }, {
            image: "/products/owl/detail-2.jpg",
            label: "工艺细节"
        }, {
            image: "/products/owl/detail-3.jpg",
            label: "材质特写"
        }],

        "meteorite-ring-sofa": [{
            image: "/products/meteorite-ring/detail-1.jpg",
            label: "陨石纹理"
        }, {
            image: "/products/meteorite-ring/detail-2.jpg",
            label: "环形设计"
        }, {
            image: "/products/meteorite-ring/detail-3.jpg",
            label: "金属质感"
        }],

        "gorilla-sofa": [{
            image: "/products/gorilla/detail-1.jpg",
            label: "力量线条"
        }, {
            image: "/products/gorilla/detail-2.jpg",
            label: "背部纹理"
        }, {
            image: "/products/gorilla/detail-3.jpg",
            label: "扶手细节"
        }],

        "muscle-gorilla-sofa": [{
            image: "/products/muscle-gorilla/detail-1.jpg",
            label: "肌肉曲线"
        }, {
            image: "/products/muscle-gorilla/detail-2.jpg",
            label: "皮革质感"
        }, {
            image: "/products/muscle-gorilla/detail-3.jpg",
            label: "缝合工艺"
        }],

        "silverback-sofa": [{
            image: "/products/silverback/detail-1.jpg",
            label: "银背纹理"
        }, {
            image: "/products/silverback/detail-2.jpg",
            label: "侧面轮廓"
        }, {
            image: "/products/silverback/detail-3.jpg",
            label: "底座细节"
        }]
    };

    const scenes = scenesMap[product.slug] || scenesMap["owl-sofa"];

    const materialsCardsMap: Record<string, Array<{
        titleKey: string;
        descKey: string;
        icon: string;
    }>> = {
        "meteorite-ring-sofa": [{
            titleKey: "meteorGalvanizedSteelTitle",
            descKey: "meteorGalvanizedSteelDesc",
            icon: "frame"
        }, {
            titleKey: "meteorHighDensityTitle",
            descKey: "meteorHighDensityDesc",
            icon: "cushion"
        }, {
            titleKey: "meteorUpholsteryTitle",
            descKey: "meteorUpholsteryDesc",
            icon: "fabric"
        }, {
            titleKey: "meteorIntegratedBaseTitle",
            descKey: "meteorIntegratedBaseDesc",
            icon: "base"
        }],

        "owl-sofa": [{
            titleKey: "owlSteelFrameTitle",
            descKey: "owlSteelFrameDesc",
            icon: "frame"
        }, {
            titleKey: "owlCushionCoreTitle",
            descKey: "owlCushionCoreDesc",
            icon: "cushion"
        }, {
            titleKey: "owlUpholsteryTitle",
            descKey: "owlUpholsteryDesc",
            icon: "fabric"
        }, {
            titleKey: "owlWalnutFeetTitle",
            descKey: "owlWalnutFeetDesc",
            icon: "base"
        }]
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
            image: "/products/spaces/owl-space-1.png",
            titleKey: "luxuryVillas",
            descKey: "owlSpace1Desc"
        }, {
            image: "/products/spaces/owl-space-2.png",
            titleKey: "privateLibraries",
            descKey: "owlSpace2Desc"
        }, {
            image: "/products/spaces/owl-space-3.png",
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
    const mobileGalleryRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

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
    const relatedProducts = relatedProductsProp;

    const productImages: Record<string, string[]> = {
        "owl-sofa": [
            "/products/owl/snowy-white.png",
            "/products/owl/snowy-white-side.png",
            "/products/owl/dusty-pink-fur.png",
            "/products/owl/black-leather.png",
            "/products/owl/forest-green.png",
            "/products/owl/forest-green-side.png",
            "/products/owl/rose-pink.png"
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

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && activeImage < images.length - 1) {
                setActiveImage(prev => prev + 1);
            } else if (diff < 0 && activeImage > 0) {
                setActiveImage(prev => prev - 1);
            }
        }
    }, [activeImage, images.length]);

    useEffect(() => {
        if (mobileGalleryRef.current) {
            const container = mobileGalleryRef.current;
            const slide = container.children[activeImage] as HTMLElement;

            if (slide) {
                slide.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });
            }
        }
    }, [activeImage]);

    const specLabels: Record<string, TranslationKeys> = {
        width: "width",
        height: "height",
        depth: "depth",
        weight: "weight"
    };

    const animalKeyMap: Record<string, string> = {
        "Gorilla": "animalGorilla",
        "Owl": "animalOwl",
        "Meteorite": "animalMeteorite"
    };

    const collectionName = `${t(animalKeyMap[product.animal] || "animalGorilla" as TranslationKeys)} ${t("collection").toUpperCase()}`;

    const matTypeKeyMap: Record<string, string> = {
        "Plush Fur": "matTypePlushFur",
        "Leather": "matTypeLeather",
        "Plush": "matTypePlush",
        "Linen": "matTypeLinen",
        "Velvet": "matTypeVelvet"
    };

    const colorNameKeyMap: Record<string, string> = {
        "Storm Gray": "colorStormGray",
        "Ivory Cream": "colorIvoryCream",
        "Cognac Brown": "colorCognacBrown",
        "Obsidian Black": "colorObsidianBlack",
        "Black Leather": "colorBlackLeather",
        "Agate Black Leather": "colorAgateBlackLeather",
        "Chestnut Brown Leather": "colorChestnutBrownLeather",
        "Snowy White Plush": "colorSnowyWhitePlush",
        "Dusty Pink Plush": "colorDustyPinkPlush",
        "Warm Gray Linen": "colorWarmGrayLinen",
        "Oatmeal Linen": "colorOatmealLinen",
        "Forest Green Velvet": "colorForestGreenVelvet",
        "Burgundy Velvet": "colorBurgundyVelvet",
        "Rose Pink Linen": "colorRosePinkLinen"
    };

    // 颜色选项到图片索引的映射（owl-sofa 专用）
    const colorToImageIndex: Record<string, number> = {
        "Snowy White Plush": 0,
        "Dusty Pink Plush": 2,
        "Black Leather": 3,
        "Forest Green Velvet": 4,
        "Rose Pink Linen": 6
    };

    // 图片索引到材质类型和颜色选项的反向映射（owl-sofa 专用）
    const imageIndexToMaterial: Record<number, { type: string; option: string }> = {
        0: { type: "Plush", option: "Snowy White Plush" },
        1: { type: "Plush", option: "Snowy White Plush" },
        2: { type: "Plush", option: "Dusty Pink Plush" },
        3: { type: "Leather", option: "Black Leather" },
        4: { type: "Velvet", option: "Forest Green Velvet" },
        5: { type: "Velvet", option: "Forest Green Velvet" },
        6: { type: "Linen", option: "Rose Pink Linen" }
    };

    // 点击缩略图时同步更新图片、材质类型和颜色选项
    const handleThumbnailClick = useCallback((index: number) => {
        setActiveImage(index);
        if (product.slug === "owl-sofa" && imageIndexToMaterial[index]) {
            const { type, option } = imageIndexToMaterial[index];
            setMaterialType(type);
            setMaterialOption(option);
        }
    }, [product.slug]);

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
            {product.slug === "owl-sofa" && spaceImages && spaceImages.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(spaceImagesJsonLd(product, spaceImages))
                    }} />
            )}
            {}
            <section className="bg-[#0A0A0A]">
                <div
                    className="max-w-[1200px] mx-auto px-4 md:px-8 pt-4 md:pt-12 pb-8 md:pb-12">
                    {}
                    <div className="sm:hidden relative">
                        {}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                            <div className="relative">
                                <button
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="group flex items-center justify-center w-9 h-9 rounded-full border border-[#333] hover:border-[#E8B4B8]/25 transition-all duration-300"
                                    aria-label="Share">
                                    <svg
                                        className="transition-transform duration-300 group-hover:scale-110"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#E8B4B8"
                                        strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                                </button>
                                {showShareMenu && <div
                                    className="absolute right-0 top-full mt-1.5 flex items-center gap-1 rounded-sm py-1.5 px-2 z-50"
                                    style={{
                                        background: "#0A0A0A",
                                        border: "1px solid rgba(232,180,184,0.25)",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.6)"
                                    }}>
                                    {[{
                                        name: "Pinterest",

                                        icon: <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#E8B4B8"
                                            strokeWidth="1.5"><path
                                                d="M8 12a4 4 0 118 0c0 2.5-1.5 4-3 4s-1.5-1-1.5-1l-1 4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" /><circle cx="12" cy="12" r="10" /></svg>
                                    }, {
                                        name: "Facebook",

                                        icon: <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#E8B4B8"
                                            strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                                    }, {
                                        name: "Instagram",

                                        icon: <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#E8B4B8"
                                            strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
                                    }, {
                                        name: "YouTube",

                                        icon: <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#E8B4B8"
                                            strokeWidth="1.5"><path
                                                d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon
                                                points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                                                fill="none"
                                                stroke="#E8B4B8" /></svg>
                                    }].map(platform => <button
                                        key={platform.name}
                                        onClick={() => handleShare(platform.name)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full border border-[#333] hover:border-[#E8B4B8]/25 transition-all duration-300"
                                        title={platform.name}>
                                        {platform.icon}
                                    </button>)}
                                </div>}
                            </div>
                            <button
                                onClick={() => setSaved(!saved)}
                                className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-[#E8B4B8]/25 hover:bg-[#E8B4B8]/8 transition-all duration-300"
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
                                    strokeLinejoin="round"><path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                            </button>
                        </div>
                        <div
                            ref={mobileGalleryRef}
                            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none"
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}>
                            {galleryImages.map(
                                (img, idx) => <div key={img.id} className="w-full flex-shrink-0 snap-center">
                                    <div className="relative w-full aspect-square overflow-hidden">
                                        {img.src ? <img
                                            src={img.src}
                                            alt={productName}
                                            className="absolute inset-0 w-full h-full object-cover" /> : <div className="flex items-center justify-center py-20"><span className="font-serif text-[10rem] text-[#F5F0EB]/[0.04] select-none">{product.animal.charAt(0)}</span></div>}
                                    </div>
                                </div>
                            )}
                        </div>
                        {}
                        {galleryImages.length > 1 && <div className="flex items-center justify-center gap-2 py-2">
                            {galleryImages.map((_, idx) => <span
                                key={idx}
                                className={`block rounded-full transition-all duration-300 ${idx === activeImage ? "w-5 h-[5px] bg-[#E8B4B8]" : "w-[5px] h-[5px] bg-white/20"}`} />)}
                        </div>}
                        {}
                        {product.materialOptions && product.materialOptions.length > 0 && <div className="px-4 pt-0.5 pb-2">
                            {}
                            <div
                                className="flex items-center justify-center gap-2 mb-2 overflow-x-auto scrollbar-hide"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none"
                                }}>
                                {product.materialOptions.map(mat => {
                                    const isMatSel = materialType === mat.type;

                                    return (
                                        <button
                                            key={mat.type}
                                            onClick={() => {
                                                setMaterialType(mat.type);
                                                setMaterialOption(mat.options[0]);
                                                // 使用颜色到图片索引的映射表
                                                const firstOpt = mat.options[0];
                                                setActiveImage(colorToImageIndex[firstOpt] ?? 0);
                                            }}
                                            className={`text-[12px] tracking-[0.06em] px-3 py-1 rounded-sm transition-all duration-300 ${isMatSel ? "text-[#E8B4B8] border border-[#E8B4B8]/50 bg-[#E8B4B8]/8" : "text-[#8A8580] border border-[#333] hover:border-[#555]"}`}>
                                            {t(matTypeKeyMap[mat.type] || "matTypeFabric" as TranslationKeys)}
                                        </button>
                                    );
                                })}
                            </div>
                            {}
                            {(() => {
                                const activeMat = product.materialOptions.find(m => m.type === materialType);

                                if (!activeMat)
                                    return null;

                                let baseIdx = 0;

                                for (const m of product.materialOptions) {
                                    if (m.type === materialType)
                                        break;

                                    baseIdx += m.options.length;
                                }

                                return (
                                    <div
                                        className="flex items-center justify-center gap-4 overflow-x-auto scrollbar-hide py-0.5"
                                        style={{
                                            scrollbarWidth: "none",
                                            msOverflowStyle: "none"
                                        }}>
                                        {activeMat.options.map((opt, optIdx) => {
                                            const colorHex = activeMat.colors[optIdx];
                                            const isSelected = materialOption === opt;
                                            // 使用颜色到图片索引的映射表
                                            const globalIdx = colorToImageIndex[opt] ?? (baseIdx + optIdx);
                                            const swatchImg = galleryImages[globalIdx];

                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => {
                                                        setMaterialOption(opt);
                                                        setActiveImage(globalIdx);
                                                    }}
                                                    className="flex flex-col items-center gap-0.5">
                                                    <span
                                                        className={`w-11 h-11 rounded-full flex-shrink-0 transition-all duration-300 overflow-hidden ${isSelected ? "ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A] scale-110" : "border border-white/15"}`}>
                                                        {swatchImg ? <img
                                                            src={swatchImg.src}
                                                            alt={opt}
                                                            width={44}
                                                            height={44}
                                                            className="w-full h-full object-cover" /> : <span
                                                            className="w-full h-full block"
                                                            style={{
                                                                backgroundColor: colorHex
                                                            }} />}
                                                    </span>
                                                    <span
                                                        className={`text-[12px] tracking-[0.03em] max-w-[64px] truncate ${isSelected ? "text-[#E8B4B8]" : "text-[#8A8580]"}`}>
                                                        {t(colorNameKeyMap[opt] || "colorSelectColor" as TranslationKeys)}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                            {}
                        </div>}
                    </div>
                    {}
                    <div className="sm:hidden px-4 pt-2.5 pb-4 bg-[#111]">
                        {}
                        <p className="text-[12px] text-[#8A8580] tracking-[0.25em] uppercase mb-1.5">{collectionName}</p>
                        {}
                        <div className="flex items-baseline justify-between gap-2 mb-2">
                            <h1
                                className="font-serif text-[18px] font-light text-[#F5F0EB] leading-[1.15] tracking-[0.02em]">{productName}</h1>
                            <span
                                className="font-serif text-[16px] font-light text-[#E8B4B8] flex-shrink-0">{displayPrice}</span>
                        </div>
                        {}
                        <p className="text-[12px] text-[#8A8580] leading-[1.5] mb-3">{productTagline}</p>
                        {}
                        <div className="space-y-2 mb-3">
                            {(() => {
                                const featureData: Record<string, Array<{
                                    titleKey: string;
                                    descKey: string;
                                    fallbackTitle: string;
                                    fallbackDesc: string;
                                }>> = {
                                    "gorilla-sofa": [{
                                        titleKey: "gorillaFeat1",
                                        descKey: "gorillaFeat1Desc",
                                        fallbackTitle: "Comfort Support Structure",
                                        fallbackDesc: "Ergonomic curved support for long-hour comfortable seating"
                                    }, {
                                        titleKey: "gorillaFeat2",
                                        descKey: "gorillaFeat2Desc",
                                        fallbackTitle: "High Density Shaped Foam",
                                        fallbackDesc: "Custom molded foam, no deformation after years of use"
                                    }, {
                                        titleKey: "gorillaFeat3",
                                        descKey: "gorillaFeat3Desc",
                                        fallbackTitle: "Galvanized Steel Frame",
                                        fallbackDesc: "Rust-proof solid metal internal support structure"
                                    }, {
                                        titleKey: "gorillaFeat4",
                                        descKey: "gorillaFeat4Desc",
                                        fallbackTitle: "Matches Luxury Living Rooms",
                                        fallbackDesc: "Sculptural design fits villa, hotel & minimalist space"
                                    }],

                                    "owl-sofa": [{
                                        titleKey: "owlFeat1",
                                        descKey: "owlFeat1Desc",
                                        fallbackTitle: "Owl-Inspired Ergonomic Curve",
                                        fallbackDesc: "Wrap-around backrest inspired by owl wings for full support"
                                    }, {
                                        titleKey: "owlFeat2",
                                        descKey: "owlFeat2Desc",
                                        fallbackTitle: "Premium Velvet Upholstery",
                                        fallbackDesc: "Stain-resistant velvet with rich texture and color depth"
                                    }, {
                                        titleKey: "owlFeat3",
                                        descKey: "owlFeat3Desc",
                                        fallbackTitle: "Solid Wood Base",
                                        fallbackDesc: "Natural walnut wood legs with anti-scratch pads"
                                    }, {
                                        titleKey: "owlFeat4",
                                        descKey: "owlFeat4Desc",
                                        fallbackTitle: "Modular Design",
                                        fallbackDesc: "Configurable left/right orientation for any room layout"
                                    }],

                                    "silverback-sofa": [{
                                        titleKey: "silverbackFeat1",
                                        descKey: "silverbackFeat1Desc",
                                        fallbackTitle: "Dominant Presence",
                                        fallbackDesc: "Oversized sculptural silhouette commands any space"
                                    }, {
                                        titleKey: "silverbackFeat2",
                                        descKey: "silverbackFeat2Desc",
                                        fallbackTitle: "Reinforced Steel Core",
                                        fallbackDesc: "Commercial-grade frame for heavy-duty long-term use"
                                    }],

                                    "meteorite-ring-sofa": [{
                                        titleKey: "meteorFeat1",
                                        descKey: "meteorFeat1Desc",
                                        fallbackTitle: "Comfort Support Structure",
                                        fallbackDesc: "Ergonomic curved support for long-hour comfortable seating"
                                    }, {
                                        titleKey: "meteorFeat2",
                                        descKey: "meteorFeat2Desc",
                                        fallbackTitle: "High Density Shaped Foam",
                                        fallbackDesc: "Custom molded foam, no deformation after years of use"
                                    }, {
                                        titleKey: "meteorFeat3",
                                        descKey: "meteorFeat3Desc",
                                        fallbackTitle: "Galvanized Steel Frame",
                                        fallbackDesc: "Rust-proof solid metal internal support structure"
                                    }, {
                                        titleKey: "meteorFeat4",
                                        descKey: "meteorFeat4Desc",
                                        fallbackTitle: "Matches Luxury Living Rooms",
                                        fallbackDesc: "Sculptural design fits villa, hotel & minimalist space"
                                    }, {
                                        titleKey: "meteorFeat5",
                                        descKey: "meteorFeat5Desc",
                                        fallbackTitle: "Long-Term Anti-Collapse",
                                        fallbackDesc: "Multi-layer filling structure to avoid sinking & sagging"
                                    }],

                                    "muscle-gorilla-sofa": [{
                                        titleKey: "muscleGorillaFeat1",
                                        descKey: "muscleGorillaFeat1Desc",
                                        fallbackTitle: "Power Ergonomics",
                                        fallbackDesc: "Dynamic lumbar support inspired by gorilla posture"
                                    }, {
                                        titleKey: "muscleGorillaFeat2",
                                        descKey: "muscleGorillaFeat2Desc",
                                        fallbackTitle: "High-Density Memory Foam",
                                        fallbackDesc: "Pressure-responsive foam for personalized comfort"
                                    }, {
                                        titleKey: "muscleGorillaFeat3",
                                        descKey: "muscleGorillaFeat3Desc",
                                        fallbackTitle: "Carbon Steel Skeleton",
                                        fallbackDesc: "Ultra-strong frame with 10-year structural warranty"
                                    }, {
                                        titleKey: "muscleGorillaFeat4",
                                        descKey: "muscleGorillaFeat4Desc",
                                        fallbackTitle: "Statement Sculpture",
                                        fallbackDesc: "Museum-worthy design that transforms any interior"
                                    }]
                                };

                                const feats = featureData[product.slug] || [];

                                return feats.map((feat, i) => <div key={i} className="flex items-start gap-2">
                                    <span className="text-[#E8B4B8] text-[12px] mt-0.5 flex-shrink-0">✦</span>
                                    <div>
                                        <h4
                                            className="text-[12px] text-[#F5F0EB] tracking-[0.04em] font-light leading-[1.3]">{(() => {
                                                const v = t(feat.titleKey as TranslationKeys);
                                                return v === feat.titleKey ? feat.fallbackTitle : v;
                                            })()}</h4>
                                        <p className="text-[12px] text-[#8A8580] leading-[1.5]">{(() => {
                                                const v = t(feat.descKey as TranslationKeys);
                                                return v === feat.descKey ? feat.fallbackDesc : v;
                                            })()}</p>
                                    </div>
                                </div>);
                            })()}
                        </div>
                        {}
                        {product.specifications && <div className="pt-2.5 border-t border-white/[0.06]">
                            <div className="flex items-center justify-between mb-0.5">
                                <label className="text-[12px] text-[#8A8580] tracking-[0.2em] uppercase">{t("dimensionsLabel" as TranslationKeys)}</label>
                                <button
                                    onClick={() => setUseCm(!useCm)}
                                    className="text-[12px] tracking-[0.12em] uppercase text-[#8A8580] border border-white/10 px-1.5 py-0.5 rounded-sm">{useCm ? "IN" : "CM"}</button>
                            </div>
                            <p className="text-[12px] text-[#F5F0EB]/50 tracking-[0.02em]">
                                {(() => {
                                    const f = (val: string) => useCm ? `${val}cm` : `${(parseFloat(val) / 2.54).toFixed(1)}"`;
                                    return `${t("dimensionsW" as TranslationKeys)}${f(product.specifications.width)} × ${t("dimensionsD" as TranslationKeys)}${f(product.specifications.depth)} × ${t("dimensionsH" as TranslationKeys)}${f(product.specifications.height)}`;
                                })()}
                            </p>
                        </div>}
                        {}
                        {product.materials && product.materials.length > 0 && <div className="mt-2 pt-2 border-t border-white/[0.06]">
                            <label
                                className="text-[12px] text-[#8A8580] tracking-[0.2em] uppercase block mb-0.5">{t("materialsLabel" as TranslationKeys)}</label>
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                                {product.materials.map((mat, i) => {
                                    const matKeyMap: Record<string, string[]> = {
                                        "gorilla-sofa": ["gorillaMat1", "gorillaMat2", "gorillaMat3", "gorillaMat4"],
                                        "owl-sofa": ["owlMat1", "owlMat2", "owlMat3", "owlMat4"],
                                        "silverback-sofa": ["silverbackMat1", "silverbackMat2"],
                                        "meteorite-ring-sofa": ["meteorMat1", "meteorMat2", "meteorMat3", "meteorMat4"],

                                        "muscle-gorilla-sofa": [
                                            "muscleGorillaMat1",
                                            "muscleGorillaMat2",
                                            "muscleGorillaMat3",
                                            "muscleGorillaMat4"
                                        ]
                                    };

                                    const keys = matKeyMap[product.slug];
                                    const i18nMat = keys?.[i] ? t(keys[i] as TranslationKeys) : mat;
                                    return <span key={i} className="text-[12px] text-[#F5F0EB]/40">{i18nMat}{i < product.materials.length - 1 && <span className="mx-1 text-[#8A8580]/30">·</span>}</span>;
                                })}
                            </div>
                        </div>}
                        {}
                        <div
                            className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-2 text-[12px] text-[#8A8580]/60">
                            <span>{t("leadTimeShort" as TranslationKeys)}</span>
                            <span className="text-white/10">·</span>
                            <span>{t("freeWhiteGloveShort" as TranslationKeys)}</span>
                            <span className="text-white/10">·</span>
                            <span>{t("madeToOrderShort" as TranslationKeys)}</span>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-[1fr_340px] xl:grid-cols-[1fr_400px] gap-8 md:gap-8 xl:gap-12">
                        {}
                        <div className="hidden sm:flex flex-col">
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
                                    onClick={() => handleThumbnailClick(img.id)}
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
                        <div className="flex flex-col hidden sm:flex">
                            {}
                            <p className="text-[12px] text-[#8A8580] tracking-[0.2em] uppercase mb-3">
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
                                            className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-[#E8B4B8]/25 hover:bg-[#E8B4B8]/8 transition-all duration-300"
                                            aria-label="Share">
                                            <svg
                                                className="transition-transform duration-300 group-hover:scale-110"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#E8B4B8"
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

                                                icon: <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#E8B4B8"
                                                    strokeWidth="1.5"><path
                                                        d="M8 12a4 4 0 118 0c0 2.5-1.5 4-3 4s-1.5-1-1.5-1l-1 4"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" /><circle cx="12" cy="12" r="10" /></svg>
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
                                                    strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
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
                                                        fill="none"
                                                        stroke="#E8B4B8" /></svg>
                                            }].map(platform => <button
                                                key={platform.name}
                                                onClick={() => handleShare(platform.name)}
                                                className="flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-[#E8B4B8]/25 hover:bg-[#E8B4B8]/8 transition-all duration-300"
                                                title={platform.name}>
                                                {platform.icon}
                                            </button>)}
                                        </div>}
                                    </div>
                                    {}
                                    <button
                                        onClick={() => setSaved(!saved)}
                                        className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-[#E8B4B8]/25 hover:bg-[#E8B4B8]/8 transition-all duration-300"
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
                                className="font-serif text-[24px] md:text-[28px] font-light text-[#F5F0EB]/70 mt-1 hidden sm:block">
                                {displayPrice}
                            </p>
                            {}
                            <p className="text-[14px] text-[#8A8580] leading-[1.7] mt-3 hidden sm:block">
                                {productTagline}
                            </p>
                            {}
                            <div className="h-px bg-[#333] my-5 hidden sm:block" />
                            {}
                            {product.materialOptions && product.materialOptions.length > 0 && <div className="mb-5 hidden sm:block">
                                {}
                                {product.materialOptions.length > 1 && <div className="flex flex-wrap gap-3 mb-4">
                                    {product.materialOptions.map(mat => {
                                        const isMatSelected = materialType === mat.type;

                                        return (
                                            <button
                                                key={mat.type}
                                                onClick={() => {
                                                    setMaterialType(mat.type);
                                                    const firstOpt = mat.options[0];
                                                    setMaterialOption(firstOpt);
                                                    // 使用颜色到图片索引的映射表
                                                    setActiveImage(colorToImageIndex[firstOpt] ?? 0);
                                                }}
                                                className={`text-xs tracking-[0.08em] px-4 py-1.5 rounded-sm transition-all duration-300 ${isMatSelected ? "text-[#E8B4B8] border border-[#E8B4B8]/50 bg-[#E8B4B8]/8" : "text-[#8A8580] border border-[#333] hover:border-[#555] hover:text-[#F5F0EB]/60"}`}>
                                                {t(matTypeKeyMap[mat.type] || "matTypeFabric" as TranslationKeys)}
                                            </button>
                                        );
                                    })}
                                </div>}
                                {}
                                {(() => {
                                    const activeMat = product.materialOptions.length > 1 ? product.materialOptions.find(m => m.type === materialType) || product.materialOptions[0] : product.materialOptions[0];
                                    const isSingleFabric = product.materialOptions.length <= 1;
                                    let baseIdx = 0;

                                    if (!isSingleFabric) {
                                        for (const m of product.materialOptions) {
                                            if (m.type === materialType)
                                                break;

                                            baseIdx += m.options.length;
                                        }
                                    }

                                    return (
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            {activeMat.options.map((opt, optIdx) => {
                                                const colorHex = activeMat.colors[optIdx];
                                                const isSelected = materialOption === opt;
                                                // 使用颜色到图片索引的映射表
                                                const globalIdx = colorToImageIndex[opt] ?? ((isSingleFabric ? 0 : baseIdx) + optIdx);
                                                const swatchImage = galleryImages[globalIdx];

                                                return (
                                                    <button
                                                        key={opt}
                                                        onClick={() => {
                                                            setMaterialType(activeMat.type);
                                                            setMaterialOption(opt);
                                                            setActiveImage(globalIdx);
                                                        }}
                                                        className="flex flex-col items-center transition-all duration-300 group min-w-[60px]">
                                                        <span
                                                            className={`w-11 h-11 rounded-full flex-shrink-0 transition-all duration-300 overflow-hidden ${isSelected ? "ring-2 ring-[#E8B4B8] ring-offset-2 ring-offset-[#0A0A0A]" : "border border-[#333] group-hover:border-[#555]"}`}>
                                                            {swatchImage ? <img
                                                                src={swatchImage.src}
                                                                alt={opt}
                                                                width={44}
                                                                height={44}
                                                                className="w-full h-full object-cover" /> : <span
                                                                className="w-full h-full block"
                                                                style={{
                                                                    backgroundColor: colorHex
                                                                }} />}
                                                        </span>
                                                        <span
                                                            className={`text-[12px] tracking-[0.04em] mt-1.5 whitespace-nowrap ${isSelected ? "text-[#E8B4B8]" : "text-[#8A8580] group-hover:text-[#F5F0EB]/60"}`}>
                                                            {t(colorNameKeyMap[opt] || "matTypeFabric" as TranslationKeys)}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>}
                            {}
                            <div className="h-px bg-[#333] mb-5" />
                            {}
                            {product.specifications && <div className="mb-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-[12px] text-[#8A8580] tracking-[0.2em] uppercase">{t("dimensionsLabel" as TranslationKeys)}</label>
                                    <button
                                        onClick={() => setUseCm(!useCm)}
                                        className="text-[12px] tracking-[0.12em] uppercase text-[#8A8580] hover:text-[#E8B4B8] transition-colors border border-[#333] px-2.5 py-1 rounded-sm">
                                        {useCm ? t("switchToInches" as TranslationKeys) : t("switchToCm" as TranslationKeys)}
                                    </button>
                                </div>
                                <p className="text-[14px] text-[#F5F0EB]/60">
                                    {(() => {
                                        const f = (val: string) => useCm ? `${val}cm` : `${(parseFloat(val) / 2.54).toFixed(1)}"`;
                                        return `${t("dimensionsW" as TranslationKeys)}${f(product.specifications.width)} × ${t("dimensionsD" as TranslationKeys)}${f(product.specifications.depth)} × ${t("dimensionsH" as TranslationKeys)}${f(product.specifications.height)} · ${t("seatHeightLabel" as TranslationKeys)}${f(product.specifications.seatHeight)}`;
                                    })()}
                                </p>
                            </div>}
                            {}
                            {product.materials && product.materials.length > 0 && product.materialOptions && product.materialOptions.length <= 1 && <div className="mb-5">
                                <label
                                    className="text-[12px] text-[#8A8580] tracking-[0.2em] uppercase block mb-2">{t("materialsLabel" as TranslationKeys)}
                                </label>
                                <div className="space-y-0.5">
                                    {product.materials.map((mat, i) => {
                                        const matKeyMap: Record<string, string[]> = {
                                            "gorilla-sofa": ["gorillaMat1", "gorillaMat2", "gorillaMat3", "gorillaMat4"],
                                            "owl-sofa": ["owlMat1", "owlMat2", "owlMat3", "owlMat4"],
                                            "silverback-sofa": ["silverbackMat1", "silverbackMat2"],
                                            "meteorite-ring-sofa": ["meteorMat1", "meteorMat2", "meteorMat3", "meteorMat4"],

                                            "muscle-gorilla-sofa": [
                                                "muscleGorillaMat1",
                                                "muscleGorillaMat2",
                                                "muscleGorillaMat3",
                                                "muscleGorillaMat4"
                                            ]
                                        };

                                        const keys = matKeyMap[product.slug];
                                        const i18nMat = keys?.[i] ? t(keys[i] as TranslationKeys) : mat;

                                        return (
                                            <p
                                                key={i}
                                                className="text-[14px] text-[#F5F0EB]/50 tracking-[0.02em] leading-[1.5]">
                                                {i18nMat}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>}
                            {}
                            <div className="h-px bg-[#333] mb-5" />
                            {}
                            <button
                                onClick={handleAddToCart}
                                className="hidden sm:flex w-full py-3 text-[#0A0A0A] font-medium text-[14px] tracking-[0.15em] uppercase transition-all duration-300 mb-2 items-center justify-center gap-2 rounded-sm"
                                style={{
                                    background: addedToCart ? "#111" : "#E8B4B8",
                                    border: addedToCart ? "1px solid #E8B4B8" : "none"
                                }}>
                                {addedToCart ? <span className="text-[#E8B4B8]">{t("addedToCart")}</span> : t("addToCart")}
                            </button>
                            <button
                                className="hidden sm:flex w-full py-2.5 bg-transparent text-[#E8B4B8] text-[14px] tracking-[0.15em] uppercase transition-all duration-300 items-center justify-center rounded-sm hover:bg-[#E8B4B8]/8"
                                style={{
                                    border: "1px solid #E8B4B8"
                                }}
                                onClick={handleBuyNow}>{t("buyNow" as TranslationKeys)}
                            </button>
                            {}
                            <div
                                className="hidden sm:flex items-center gap-1 mt-4 text-[12px] text-[#8A8580]/70 tracking-[0.04em]">
                                <span>{t("leadTimeShort" as TranslationKeys)}</span>
                                <span className="mx-1">·</span>
                                <span>{t("freeWhiteGloveShort" as TranslationKeys)}</span>
                                <span className="mx-1">·</span>
                                <span>{t("madeToOrderShort" as TranslationKeys)}</span>
                            </div>
                            {}
                            <button
                                onClick={() => setShowRoomViz(true)}
                                className="hidden sm:flex mt-3 text-[12px] text-[#8A8580]/70 tracking-[0.04em] hover:text-[#E8B4B8] transition-colors duration-300 items-center gap-1.5">
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
                                </svg>{t("previewInYourRoom" as TranslationKeys)}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="bg-[#0F0E0E]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-9 md:pt-[68px] pb-6 md:pb-10">
                    {}
                    <div className="mb-2 md:mb-4">
                        <p
                            className="text-[12px] md:text-[12px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-1 md:mb-2 flex items-center gap-2">
                            <span className="inline-block w-6 h-px bg-[#E8B4B8]/40" />{t("interiorInspiration" as TranslationKeys)}
                        </p>
                        <h2
                            className="font-serif text-lg md:text-[2.2rem] font-light text-[#F5F0EB] leading-[1.15]">
                            {t("seeItInRealSpaces" as TranslationKeys)}
                        </h2>
                    </div>
                    {}
                    <div
                        className="flex sm:grid sm:grid-cols-3 gap-2.5 md:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0 pb-1 sm:pb-0"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none"
                        }}>
                        {spaceImages.map((space, idx) => <div
                            key={idx}
                            className="group cursor-pointer flex-shrink-0 w-[80vw] sm:w-auto snap-start">
                            {}
                            <div
                                className="relative bg-[#111] overflow-hidden mb-1.5 md:mb-2.5 rounded-sm">
                                {space.image ? <img
                                    src={space.image}
                                    alt={`${productName} in ${space.title}`}
                                    className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.03]" /> : <div className="w-full aspect-[3/2] flex items-center justify-center">
                                    <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                                        {product.animal.charAt(0)}
                                    </span>
                                </div>}
                                {}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent" />
                                {}
                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:hidden">
                                    <p className="text-[12px] tracking-[0.15em] uppercase text-[#F5F0EB]/60">
                                        {space.titleKey ? t(space.titleKey as TranslationKeys) : space.title}
                                    </p>
                                </div>
                            </div>
                            {}
                            <div className="hidden sm:block">
                                <p
                                    className="text-[12px] tracking-[0.15em] uppercase text-[#F5F0EB]/50 mb-0.5 group-hover:text-[#E8B4B8] transition-colors duration-300">
                                    {space.titleKey ? t(space.titleKey as TranslationKeys) : space.title}
                                </p>
                                <p className="text-[14px] text-[#8A8580] leading-[1.6]">
                                    {t(space.descKey as TranslationKeys)}
                                </p>
                            </div>
                        </div>)}
                    </div>
                    {}
                    {}
                    <div className="mt-5 md:mt-12 mb-2 relative">
                        <div className="w-full h-px bg-white/[0.03]" />
                        <div
                            className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                    </div>
                    <div
                        className="mt-4 md:mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        {}
                        <div className="flex-1">
                            <p
                                className="text-[12px] md:text-[12px] tracking-[0.25em] uppercase text-[#E8B4B8]/60 mb-3 md:mb-5 flex items-center gap-2">
                                <span className="inline-block w-6 h-px bg-[#E8B4B8]/40" />{t("theStory" as TranslationKeys)}
                            </p>
                            <h3
                                className="font-serif text-[22px] md:text-[40px] font-light text-[#F5F0EB] leading-[1.15] mb-1.5 md:mb-3">
                                {productName}
                            </h3>
                            <p
                                className="text-[14px] md:text-[20px] text-[#E8B4B8]/50 italic mb-3 md:mb-5 font-serif">
                                {productTagline}
                            </p>
                            <div
                                className="text-[12px] md:text-[14px] font-light text-[#F5F0EB]/70 leading-[1.9]">
                                <p>{productConcept} {prefix ? t(`${prefix}InteriorContext` as TranslationKeys) : product.interiorContext}</p>
                            </div>
                            <div
                                className="border border-dashed border-[#E8B4B8]/30 rounded-sm p-4 mt-6 max-w-[520px]">
                                <p className="text-[14px] text-[#E8B4B8]/70 italic leading-[1.8] font-serif">
                                    {product.slug === "meteorite-ring-sofa" ? <>{t("testedLoadCapacity" as TranslationKeys)}</> : <>{t("specWeight" as TranslationKeys).replace("{weight}", String(product.specifications.weight))} <span className="opacity-40">·</span>{t("specWeightWithPkg" as TranslationKeys)} <span className="opacity-40">·</span>{t("specLoadCapacity" as TranslationKeys).replace("{capacity}", String(product.specifications.capacity))}</>}
                                </p>
                                <p className="text-[12px] font-light text-[#8A8580]/70 leading-[1.6] mt-2">{t("specDisclaimer" as TranslationKeys)}
                                </p>
                            </div>
                        </div>
                        {}
                        <div className="w-[220px] md:w-[260px] shrink-0">
                            <div className="flex flex-col items-center">
                                <div
                                    className="relative bg-[#1A1918] rounded-sm overflow-hidden w-full"
                                    style={{
                                        border: "1px solid rgba(255,255,255,0.08)"
                                    }}>
                                    <div className="absolute top-3 left-3 w-[20px] h-[20px] z-10">
                                        <div className="absolute top-0 left-0 w-[20px] h-px bg-[#E8B4B8]/20" />
                                        <div className="absolute top-0 left-0 w-px h-[20px] bg-[#E8B4B8]/20" />
                                    </div>
                                    <div className="absolute top-3 right-3 w-[20px] h-[20px] z-10">
                                        <div className="absolute top-0 right-0 w-[20px] h-px bg-[#E8B4B8]/20" />
                                        <div className="absolute top-0 right-0 w-px h-[20px] bg-[#E8B4B8]/20" />
                                    </div>
                                    <div className="absolute bottom-3 left-3 w-[20px] h-[20px] z-10">
                                        <div className="absolute bottom-0 left-0 w-[20px] h-px bg-[#E8B4B8]/20" />
                                        <div className="absolute bottom-0 left-0 w-px h-[20px] bg-[#E8B4B8]/20" />
                                    </div>
                                    <div className="absolute bottom-3 right-3 w-[20px] h-[20px] z-10">
                                        <div className="absolute bottom-0 right-0 w-[20px] h-px bg-[#E8B4B8]/20" />
                                        <div className="absolute bottom-0 right-0 w-px h-[20px] bg-[#E8B4B8]/20" />
                                    </div>
                                    <Image
                                        src={storySketchMap[product.slug] || "/products/owl/story-sketch.webp"}
                                        alt="Product Sketch"
                                        width={500}
                                        height={500}
                                        className="mx-auto h-auto block opacity-70 brightness-[0.85] contrast-[0.9] md:w-full" />
                                </div>
                                <div className="flex items-center justify-center gap-6 mt-3">
                                    <div className="text-center">
                                        <span
                                            className="block text-[18px] font-light text-[#E8B4B8] leading-none font-serif">{t("dimensionsW" as TranslationKeys)}</span>
                                        <span className="text-[12px] font-light text-[#8A8580]">{useCm ? `${product.specifications.width}cm` : `${(Number(product.specifications.width) / 2.54).toFixed(1)}"`}</span>
                                    </div>
                                    <div className="text-center">
                                        <span
                                            className="block text-[18px] font-light text-[#E8B4B8] leading-none font-serif">{t("dimensionsD" as TranslationKeys)}</span>
                                        <span className="text-[12px] font-light text-[#8A8580]">{useCm ? `${product.specifications.depth}cm` : `${(Number(product.specifications.depth) / 2.54).toFixed(1)}"`}</span>
                                    </div>
                                    <div className="text-center">
                                        <span
                                            className="block text-[18px] font-light text-[#E8B4B8] leading-none font-serif">{t("dimensionsH" as TranslationKeys)}</span>
                                        <span className="text-[12px] font-light text-[#8A8580]">{useCm ? `${product.specifications.height}cm` : `${(Number(product.specifications.height) / 2.54).toFixed(1)}"`}</span>
                                    </div>
                                    <div className="text-center">
                                        <span
                                            className="block text-[14px] font-light text-[#E8B4B8] leading-none font-serif">{t("seatHeightUnit" as TranslationKeys)}</span>
                                        <span className="text-[12px] font-light text-[#8A8580] font-serif">{useCm ? `${product.specifications.seatHeight}cm` : `${(Number(product.specifications.seatHeight) / 2.54).toFixed(1)}"`}</span>
                                    </div>
                                    <button
                                        onClick={() => setUseCm(!useCm)}
                                        className="ml-1 text-[12px] tracking-[0.12em] uppercase text-[#8A8580] border border-[#333] rounded-sm px-2.5 py-1 hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-colors duration-300">
                                        {useCm ? "IN" : "CM"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {}
                    {}
                    <div className="mt-8 md:mt-16 mb-8 md:mb-12">
                        <div className="mb-4 md:mb-6">
                            <p
                                className="text-[12px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-1.5 flex items-center gap-2">
                                <span className="inline-block w-6 h-px bg-[#E8B4B8]/40" />✦ 细节展示
                                                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-10 max-w-[500px] mx-auto">
                            {scenes.map((
                                scene: {
                                    image: string;
                                    label: string;
                                },
                                idx: number
                            ) => <div key={idx} className="relative bg-[#111] overflow-hidden">
                                <div className="aspect-square">
                                    <img
                                        src={scene.image}
                                        alt={scene.label}
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover"
                                        loading="lazy" />
                                </div>
                            </div>)}
                        </div>
                    </div>
                    {}
                    <div className="sm:hidden">
                        {}
                        <div
                            className="relative w-full aspect-[16/10] bg-gradient-to-b from-[#111] to-[#090909] overflow-hidden">
                            {madeBg ? <img
                                src={madeBg}
                                alt={`${productName} craftsmanship`}
                                className="w-full h-full object-cover opacity-60" /> : galleryImages.length >= 4 && galleryImages[3]?.src ? <img
                                src={galleryImages[3].src}
                                alt={`${productName} craftsmanship`}
                                className="w-full h-full object-cover opacity-60" /> : galleryImages[0]?.src ? <img
                                src={galleryImages[0].src}
                                alt={`${productName} craftsmanship`}
                                className="w-full h-full object-cover opacity-50" /> : <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-serif text-[20rem] text-[#F5F0EB]/[0.03] select-none">
                                    {product.animal.charAt(0)}
                                </span>
                            </div>}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/30 to-transparent" />
                        </div>
                        {}
                        <div className="px-4 py-3 bg-[#090909]">
                            <p
                                className="font-serif text-[14px] font-light text-[#F5F0EB] leading-[1.2] text-center mb-2">
                                <span className="opacity-20 mr-2">—</span>{t("materialsCraftsmanship" as TranslationKeys)}<span className="opacity-20 ml-2">—</span>
                            </p>
                            <div
                                className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-5 px-5 pb-0.5"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none"
                                }}>
                                {(() => {
                                    const cards = materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"];

                                    return cards.map((
                                        card: {
                                            titleKey: string;
                                            descKey: string;
                                            icon: string;
                                        },
                                        idx: number
                                    ) => <div
                                        key={idx}
                                        className="flex-shrink-0 w-[72vw] snap-start text-center py-4 px-4 border border-white/[0.04] bg-[#0D0D0D]/40 rounded-sm">
                                        <div
                                            className="w-9 h-9 rounded-full mx-auto mb-3 flex items-center justify-center"
                                            style={{
                                                background: "rgba(232,180,184,0.08)",
                                                border: "1px solid rgba(232,180,184,0.18)"
                                            }}>
                                            <svg viewBox="0 0 24 24" className="w-4 h-4">
                                                {card.icon === "fabric" && <><rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="2"
                                                        fill="none"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" /><line
                                                        x1="3"
                                                        y1="9"
                                                        x2="21"
                                                        y2="9"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round" /><line
                                                        x1="3"
                                                        y1="15"
                                                        x2="21"
                                                        y2="15"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round" /><line
                                                        x1="9"
                                                        y1="3"
                                                        x2="9"
                                                        y2="21"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round" /><line
                                                        x1="15"
                                                        y1="3"
                                                        x2="15"
                                                        y2="21"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round" /></>}
                                                {card.icon === "frame" && <><rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="2"
                                                        fill="none"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" /><line
                                                        x1="9"
                                                        y1="3"
                                                        x2="9"
                                                        y2="21"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round" /><line
                                                        x1="15"
                                                        y1="3"
                                                        x2="15"
                                                        y2="21"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round" /></>}
                                                {card.icon === "cushion" && <><path
                                                        d="M3 3h18v18H3z"
                                                        fill="none"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" /><path
                                                        d="M3 9h18"
                                                        fill="none"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round" /><path
                                                        d="M9 3v18"
                                                        fill="none"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round" /></>}
                                                {card.icon === "detail" && <><path
                                                        d="M2 20 L6 20 L6 16"
                                                        fill="none"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" /><path
                                                        d="M22 20 L18 20 L18 16"
                                                        fill="none"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" /><path
                                                        d="M6 16 L18 16 L18 4 L6 4 Z"
                                                        fill="none"
                                                        stroke="#E8B4B8"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" /></>}
                                            </svg>
                                        </div>
                                        <h4
                                            className="text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-1">{t(card.titleKey as TranslationKeys)}</h4>
                                        <p className="text-[12px] font-light text-[#8A8580] leading-[1.6]">{t(card.descKey as TranslationKeys)}</p>
                                    </div>);
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#090909]">
                <div className="max-w-[1600px] mx-auto">
                    {}
                    <div
                        className="relative w-full aspect-[16/6] bg-gradient-to-b from-[#111] to-[#090909] overflow-hidden hidden sm:block">
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
                            className="absolute inset-0 flex flex-col items-center justify-end pb-10 md:pb-14 px-6"
                            style={{
                                backgroundColor: "#0A0A0A"
                            }}>
                            <p
                                className="font-serif text-2xl md:text-[2.5rem] font-light text-[#F5F0EB] leading-[1.2] text-center mb-5 relative">
                                <span className="opacity-30 mr-3">—</span>{t("materialsCraftsmanship" as TranslationKeys)}
                                <span className="opacity-30 ml-3">—</span>
                            </p>
                            <div
                                className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5 max-w-[780px] mx-auto mb-11 relative">
                                {}
                                <div
                                    className="text-center py-6 px-3 pb-5 border border-white/5 bg-[#0D0D0D]/60 relative transition-colors duration-300 hover:border-[#E8B4B8]/25 rounded-sm">
                                    <div
                                        className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                                        style={{
                                            background: "rgba(232,180,184,0.1)",
                                            border: "1px solid rgba(232,180,184,0.22)"
                                        }}>
                                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                fill="none"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round" />
                                            <line
                                                x1="3"
                                                y1="9"
                                                x2="21"
                                                y2="9"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round" />
                                            <line
                                                x1="3"
                                                y1="15"
                                                x2="21"
                                                y2="15"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round" />
                                            <line
                                                x1="9"
                                                y1="3"
                                                x2="9"
                                                y2="21"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round" />
                                            <line
                                                x1="15"
                                                y1="3"
                                                x2="15"
                                                y2="21"
                                                stroke="#E8B4B8"
                                                strokeWidth="1.2"
                                                strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <h4
                                        className="text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-[6px]">{t(
                                            (materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[0].titleKey as TranslationKeys
                                        )}</h4>
                                    <p className="text-[12px] font-light text-[#8A8580] leading-[1.5]">{t(
                                            (materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[0].descKey as TranslationKeys
                                        )}</p>
                                </div>
                                {}
                                <div
                                    className="text-center py-6 px-3 pb-5 border border-white/5 bg-[#0D0D0D]/60 relative transition-colors duration-300 hover:border-[#E8B4B8]/25 rounded-sm">
                                    <div
                                        className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
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
                                    <h4
                                        className="text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-[6px]">{t(
                                            (materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[1].titleKey as TranslationKeys
                                        )}</h4>
                                    <p className="text-[12px] font-light text-[#8A8580] leading-[1.5]">{t(
                                            (materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[1].descKey as TranslationKeys
                                        )}</p>
                                </div>
                                {}
                                <div
                                    className="text-center py-6 px-3 pb-5 border border-white/5 bg-[#0D0D0D]/60 relative transition-colors duration-300 hover:border-[#E8B4B8]/25 rounded-sm">
                                    <div
                                        className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
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
                                    <h4
                                        className="text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-[6px]">{t(
                                            (materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[2].titleKey as TranslationKeys
                                        )}</h4>
                                    <p className="text-[12px] font-light text-[#8A8580] leading-[1.5]">{t(
                                            (materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[2].descKey as TranslationKeys
                                        )}</p>
                                </div>
                                {}
                                <div
                                    className="text-center py-6 px-3 pb-5 border border-white/5 bg-[#0D0D0D]/60 relative transition-colors duration-300 hover:border-[#E8B4B8]/25 rounded-sm">
                                    <div
                                        className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#E8B4B8]/15" />
                                    <div
                                        className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
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
                                    <h4
                                        className="text-[12px] font-light tracking-[0.12em] uppercase text-[#F5F0EB] mb-[6px]">{t(
                                            (materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[3].titleKey as TranslationKeys
                                        )}</h4>
                                    <p className="text-[12px] font-light text-[#8A8580] leading-[1.5]">{t(
                                            (materialsCardsMap[product.slug] || materialsCardsMap["owl-sofa"])[3].descKey as TranslationKeys
                                        )}</p>
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
                <div
                    className="relative max-w-[700px] mx-auto px-5 py-10 md:py-[140px] text-center">
                    <p
                        className="text-[12px] md:text-[12px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-2.5 md:mb-5">
                        {t("freeWhiteGlove")}
                    </p>
                    <h2
                        className="font-serif text-xl md:text-[2.5rem] font-light text-[#F5F0EB] leading-[1.2] mb-4 md:mb-6">
                        {t("deliveredWorldwide" as TranslationKeys)}
                    </h2>
                    <p
                        className="text-[#8A8580] leading-[1.8] text-[14px] md:text-[14px] mb-8 md:mb-10">
                        {t("deliveryDesc" as TranslationKeys)}
                    </p>
                    <div
                        className="flex sm:grid sm:grid-cols-4 gap-4 md:gap-8 max-w-[700px] mx-auto overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 sm:mx-0 sm:px-0 pb-1 sm:pb-0"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none"
                        }}>
                        <div
                            className="flex flex-col items-center gap-2 flex-shrink-0 w-[42vw] sm:w-auto snap-start">
                            <div
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center"
                                style={{
                                    background: "rgba(232,180,184,0.08)",
                                    border: "1px solid rgba(232,180,184,0.18)"
                                }}>
                                <svg viewBox="0 0 24 24" className="w-4 h-4">
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
                                className="text-[12px] text-[#8A8580] tracking-[0.1em] uppercase text-center leading-[1.4]">{t("handcraftedShort" as TranslationKeys)}</span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-2 flex-shrink-0 w-[42vw] md:w-auto snap-start">
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
                                className="text-[12px] text-[#8A8580] tracking-[0.12em] uppercase text-center">{t("leadTimeShort" as TranslationKeys)}</span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-2 flex-shrink-0 w-[42vw] md:w-auto snap-start">
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
                                className="text-[12px] text-[#8A8580] tracking-[0.12em] uppercase text-center">{t("madeToOrderShort" as TranslationKeys)}</span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-2 flex-shrink-0 w-[42vw] md:w-auto snap-start">
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
                            <span className="text-[12px] text-[#8A8580] tracking-[0.12em] uppercase">{t("freeWhiteGloveShort" as TranslationKeys)}</span>
                        </div>
                    </div>
                </div>
            </section>
            {}
            {relatedProducts.length > 0 && <section className="bg-[#080808]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-12">
                    <p
                        className="text-[12px] md:text-[12px] text-[#E8B4B8]/60 tracking-[0.2em] uppercase mb-1.5 md:mb-2">
                        {t("youMayAlsoLike" as TranslationKeys)}
                    </p>
                    <h2
                        className="font-serif text-lg md:text-3xl font-light text-[#F5F0EB] mb-3 md:mb-8">
                        {t("relatedProducts")}
                    </h2>
                    <div
                        className="flex sm:grid sm:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0 pb-1 sm:pb-0"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none"
                        }}>
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
                                    className="group transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0 w-[50vw] sm:w-auto snap-start">
                                    <div
                                        className="aspect-[4/5] sm:aspect-square bg-gradient-to-b from-[#111] to-[#080808] relative overflow-hidden rounded-sm sm:rounded-none">
                                        {rpImages[0] ? <img
                                            src={rpImages[0]}
                                            alt={rpName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-serif text-[8rem] text-[#F5F0EB]/[0.04] select-none">
                                                {rp.animal.charAt(0)}
                                            </span>
                                        </div>}
                                    </div>
                                    <div className="pt-2 pb-0.5 sm:p-5">
                                        <p
                                            className="text-[12px] sm:text-[12px] text-[#8A8580] tracking-[0.12em] uppercase mb-0.5 sm:mb-1">
                                            {t(animalKeyMap[rp.animal] || "animalGorilla" as TranslationKeys)} {t("collection").toUpperCase()}
                                        </p>
                                        <h3
                                            className="font-serif text-[14px] sm:text-xl font-light text-[#F5F0EB] leading-snug">{rpName}</h3>
                                        <p
                                            className="text-[12px] sm:text-[14px] text-[#8A8580] mt-0.5 sm:mt-1 mb-0.5 sm:mb-3 line-clamp-1">{rpTagline}</p>
                                        <p
                                            className="font-serif text-[12px] sm:text-lg font-light text-[#F5F0EB]/70">{rpPrice}</p>
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
                className="bg-[#030303] py-8 md:py-12 px-5 md:px-6"
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
            {product.slug === "meteorite-ring-sofa" && <CosmicInspiration lang={lang} />}
            {}
            <div
                className="sm:hidden fixed bottom-0 left-0 right-0 z-40"
                style={{
                    paddingBottom: "env(safe-area-inset-bottom, 0px)",
                    background: "#0A0A0A"
                }}>
                <div className="px-4 pt-2.5 pb-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[12px] font-light text-[#F5F0EB] truncate leading-tight">{productName}</p>
                        <p className="text-[14px] font-light text-[#E8B4B8] mt-0.5">{displayPrice}</p>
                    </div>
                    <div className="relative flex-shrink-0">
                        <div
                            className="absolute -inset-1 rounded-full opacity-30 pointer-events-none"
                            style={{
                                background: "radial-gradient(circle, #E8B4B8 0%, transparent 70%)",
                                filter: "blur(6px)"
                            }} />
                        <button
                            onClick={handleBuyNow}
                            className="relative flex items-center gap-1.5 px-5 py-2 text-[#0A0A0A] text-[15px] tracking-[0.15em] uppercase font-medium rounded-full active:scale-[0.97] transition-transform"
                            style={{
                                background: "#E8B4B8"
                            }}>
                            {t("buyNow" as TranslationKeys)}
                            <svg aria-hidden="true" viewBox="0 0 10 10" width="9" height="9" fill="none">
                                <path d="M0 5h7" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
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
        </>
    );
}