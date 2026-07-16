"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

const OWL_DATA = {
    slug: "owl-sofa",
    name: "Owl Chair",
    animal: "Owl",
    brand: "FUZZ SOFA",
    tagline: "Wisdom and Watchfulness",
    description: "The Owl Chair captures the alert, watchful essence of an owl at rest. Its compact scale and distinctive rounded backrest make it the most versatile piece in the Fuzz Sofa collection — a statement chair that transforms any corner into a place of contemplation and style.",

    priceRange: {
        americas: [4800, 4800] as [number, number],
        europe: [4800, 4800] as [number, number],
        middle_east: [4800, 4800] as [number, number],
        se_asia: [4800, 4800] as [number, number]
    },

    images: [
        "/products/owl/black-leather.png",
        "/products/owl/dusty-pink-fur.png",
        "/products/owl/snowy-white.png",
        "/products/owl/rose-pink.png",
        "/products/owl/warm-gray.png",
        "/products/owl/warm-gray.png",
        "/products/owl/forest-green.png",
        "/products/owl/rose-pink.png"
    ],

    colors: [{
        key: "agate-black",
        label: "玛瑙黑 · 皮革",
        colorCode: "#1A1A1A",
        imageIndex: 0,
        group: "Leather"
    }, {
        key: "chestnut",
        label: "栗棕 · 皮革",
        colorCode: "#6B3A2A",
        imageIndex: 1,
        group: "Leather"
    }, {
        key: "snowy-white",
        label: "雪山白 · 长毛绒",
        colorCode: "#F5F0EB",
        imageIndex: 2,
        group: "Plush"
    }, {
        key: "rose-pink",
        label: "玫瑰粉 · 长毛绒",
        colorCode: "#E8B4B8",
        imageIndex: 3,
        group: "Plush"
    }, {
        key: "warm-gray",
        label: "暖灰 · 亚麻",
        colorCode: "#8A8580",
        imageIndex: 4,
        group: "Linen"
    }, {
        key: "oatmeal",
        label: "燕麦色 · 亚麻",
        colorCode: "#C8BFA8",
        imageIndex: 5,
        group: "Linen"
    }, {
        key: "forest-green",
        label: "森林绿 · 天鹅绒",
        colorCode: "#2D5A3D",
        imageIndex: 6,
        group: "Velvet"
    }, {
        key: "burgundy",
        label: "勃艮第红 · 天鹅绒",
        colorCode: "#6B2D3E",
        imageIndex: 7,
        group: "Velvet"
    }],

    fabrics: [{
        key: "cloud",
        label: "Cloud Touch"
    }, {
        key: "wild",
        label: "Wild Touch"
    }, {
        key: "velvet",
        label: "Velvet"
    }],

    features: [{
        num: "01",
        label: "守望之姿",
        desc: "圆润椅背如猫头鹰展翅，180° 环绕拥抱感"
    }, {
        num: "02",
        label: "精巧尺度",
        desc: "紧凑比例，任何角落都能成为沉思之地"
    }, {
        num: "03",
        label: "多面性格",
        desc: "8 种面料 × 4 种材质，从卧室到书房自由切换"
    }],

    storyTitle: "猫头鹰的凝视",

    storyText: [
        "猫头鹰栖息在枝头 — 警觉、观察、完美自若。Owl Chair 将这份安静的力量转化为一把椅子的形态。",
        "它的圆润椅背仿佛猫头鹰竖起的翅膀，在 180° 的弧度中创造出一种温和的围合感。坐下时，你会感到一种被凝视守护的安全感 — 仿佛有人在为你守望。",
        "而它最迷人的特质是：无论放在哪个角落，它都能让那个角落变得特别。阅读角、窗边沉思、卧室的安静陪伴 — Owl Chair 从不抢戏，但总是不可或缺。"
    ],

    specs: [{
        label: "宽度",
        cm: "88",
        inch: "34.6"
    }, {
        label: "深度",
        cm: "85",
        inch: "33.5"
    }, {
        label: "高度",
        cm: "92",
        inch: "36.2"
    }, {
        label: "座高",
        cm: "42",
        inch: "16.5"
    }, {
        label: "重量",
        cm: "28",
        inch: "61.7"
    }, {
        label: "承重",
        cm: "1 人",
        inch: "1 person"
    }],

    crafts: [{
        name: "高密度冷发泡",
        detail: "5 层渐进式填充，久坐不塌陷"
    }, {
        name: "实木内框",
        detail: "欧洲榉木框架，10 年结构质保"
    }, {
        name: "手工裁剪",
        detail: "每件面料独立裁剪，纹路对齐误差 < 2mm"
    }, {
        name: "可拆洗套",
        detail: "隐藏拉链设计，整套可机洗"
    }],

    scenes: [{
        image: "/products/owl/snowy-white.png",
        label: "静谧书房",
        sub: "阅读角的独处时光"
    }, {
        image: "/products/owl/forest-green.png",
        label: "自然角落",
        sub: "森林绿 · 沉思 · 惬意"
    }, {
        image: "/products/owl/black-leather.png",
        label: "都会客厅",
        sub: "皮革质感 · 精致空间"
    }],

    explore: [{
        key: "gorilla-sofa",
        name: "Gorilla Sofa",
        desc: "Raw Power",
        price: "$7,800",
        image: "/products/gorilla-sofa/gray.jpg"
    }, {
        key: "flamingo-sofa",
        name: "Flamingo Sofa",
        desc: "Graceful Elegance",
        price: "$5,600",
        image: "/products/gorilla-sofa/cream.jpg"
    }]
};

export default function MobileProductPage(
    {
        params
    }: {
        params: Promise<{
            slug: string;
        }>;
    }
) {
    const router = useRouter();

    const {
        addItem,
        totalItems
    } = useCart();

    const [slug, setSlug] = useState<string>("");

    useEffect(() => {
        params.then(p => setSlug(p.slug));
    }, [params]);

    const MATERIAL_GROUPS = [{
        key: "Leather",
        label: "皮革"
    }, {
        key: "Plush",
        label: "长毛绒"
    }, {
        key: "Linen",
        label: "亚麻"
    }, {
        key: "Velvet",
        label: "天鹅绒"
    }];

    const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_GROUPS[0].key);
    const [selectedColor, setSelectedColor] = useState(OWL_DATA.colors[0].key);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [unit, setUnit] = useState<"cm" | "in">("cm");
    const [faved, setFaved] = useState(false);
    
    // 从 localStorage 读取收藏状态
    useEffect(() => {
        if (typeof window !== "undefined") {
            const favs = JSON.parse(localStorage.getItem("fuzz_favs") || "[]");
            setFaved(favs.includes(OWL_DATA.slug));
        }
    }, []);
    const [showShare, setShowShare] = useState(false);
    const [showPurchasePanel, setShowPurchasePanel] = useState(false);
    const [purchaseSource, setPurchaseSource] = useState<"cart" | "buy">("cart");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAIOverlay, setShowAIOverlay] = useState(false);
    const [showAR, setShowAR] = useState(false);
    const [panelColor, setPanelColor] = useState(OWL_DATA.colors[0].key);
    const [quantity, setQuantity] = useState(1);
    const [arSize, setArSize] = useState(80);
    const [arOpacity, setArOpacity] = useState(90);
    const [showCartSuccess, setShowCartSuccess] = useState(false);

    if (slug && slug !== "owl-sofa" && slug !== "owl") {
        return (
            <div className="page active" id="pageDetail">
                <div
                    className="container"
                    style={{
                        padding: "3rem 1.5rem",
                        textAlign: "center",
                        minHeight: "60vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <p
                        style={{
                            color: "#8A8580",
                            fontSize: 14,
                            letterSpacing: "0.1em"
                        }}>此产品移动端页面正在制作中</p>
                    <Link
                        href="/m"
                        style={{
                            color: "#E8B4B8",
                            marginTop: 16,
                            fontSize: 13,
                            letterSpacing: "0.04em"
                        }}>← 返回首页</Link>
                </div>
            </div>
        );
    }

    const currentColor = OWL_DATA.colors.find(c => c.key === selectedColor) || OWL_DATA.colors[0];

    const handleColorSelect = (colorKey: string) => {
        setSelectedColor(colorKey);
        const c = OWL_DATA.colors.find(cl => cl.key === colorKey);

        if (c)
            setCurrentImageIndex(c.imageIndex);
    };

    const fabricMap: Record<string, string> = {
        cloud: "Cloud Touch",
        wild: "Wild Touch",
        velvet: "Velvet"
    };

    return (
        <div className="page active" id="pageDetail">
            <div className="container">
                {}
                <div className="hero-image" id="detailHeroImage">
                    <img
                        src={OWL_DATA.images[currentImageIndex]}
                        alt={OWL_DATA.name}
                        id="detailMainImage" />
                    <div className="float-ai">
                        <button id="detailTryARBtn" onClick={() => setShowAIOverlay(true)}>
                            <svg className="icon" viewBox="0 0 24 24">
                                <path
                                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </button>
                    </div>
                    {}
                    <div className="share-dropdown" id="detailShareDropdown">
                        <button
                            className="share-toggle"
                            id="detailShareToggle"
                            onClick={() => setShowShare(!showShare)}
                            aria-label="Share">
                            <svg viewBox="0 0 24 24">
                                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                        </button>
                        {showShare && <div className="share-menu open" id="detailShareMenu">
                            <button
                                className="menu-item"
                                onClick={() => {
                                    navigator.clipboard?.writeText(window.location.href);
                                    setShowShare(false);
                                }}>
                                <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                <span>复制链接</span>
                            </button>
                            <div className="menu-divider" />
                            <button className="menu-item" onClick={() => setShowShare(false)}>
                                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                                <span>Instagram</span>
                            </button>
                            <button className="menu-item" onClick={() => setShowShare(false)}>
                                <svg viewBox="0 0 24 24"><path
                                        d="M12 2C6.48 2 2 6.48 2 12c0 3.85 2.14 7.2 5.27 8.94-.07-.75-.14-1.9.03-2.72.16-.74 1.04-4.4 1.04-4.4s-.26-.54-.26-1.33c0-1.25.72-2.18 1.62-2.18.77 0 1.14.58 1.14 1.27 0 .77-.49 1.93-.74 3.01-.21.9.45 1.64 1.34 1.64 1.61 0 2.85-1.7 2.85-4.14 0-2.16-1.55-3.68-3.77-3.68-2.57 0-4.07 1.93-4.07 3.92 0 .78.3 1.61.67 2.06.08.08.1.16.07.24-.07.29-.22.9-.25.92-.04.15-.12.18-.24.11-1.8-.83-2.92-3.43-2.92-5.52C7.52 6.8 10.47 4 14.05 4c3.03 0 5.38 2.16 5.38 5.04 0 3.01-1.9 5.43-4.53 5.43-.89 0-1.72-.46-2-1.01 0 0-.44 1.67-.55 2.08-.2.76-.74 1.73-1.1 2.31.82.25 1.7.4 2.62.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
                                <span>Pinterest</span>
                            </button>
                            <button className="menu-item" onClick={() => setShowShare(false)}>
                                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                <span>Facebook</span>
                            </button>
                        </div>}
                    </div>
                    {showShare && <div className="share-backdrop open" onClick={() => setShowShare(false)} />}
                    {}
                    <div className="float-actions">
                        <button
                            id="detailFavBtn"
                            className={faved ? "faved" : ""}
                            onClick={() => {
                                const newFaved = !faved;
                                setFaved(newFaved);
                                if (typeof window !== "undefined") {
                                    const favs = JSON.parse(localStorage.getItem("fuzz_favs") || "[]");
                                    if (newFaved) {
                                        if (!favs.includes(OWL_DATA.slug)) {
                                            favs.push(OWL_DATA.slug);
                                        }
                                    } else {
                                        const idx = favs.indexOf(OWL_DATA.slug);
                                        if (idx > -1) {
                                            favs.splice(idx, 1);
                                        }
                                    }
                                    localStorage.setItem("fuzz_favs", JSON.stringify(favs));
                                }
                            }}>
                            <svg
                                className="icon"
                                viewBox="0 0 24 24"
                                id="detailFavIcon"
                                style={{
                                    fill: faved ? "#E8B4B8" : "none",
                                    stroke: faved ? "#E8B4B8" : "rgba(255,255,255,0.5)"
                                }}>
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                    </div>
                </div>
                {}
                <div className="spec-selector">
                    {}
                    <div className="material-tabs">
                        {MATERIAL_GROUPS.map(mg => {
                            const hasColorsInGroup = OWL_DATA.colors.some(c => c.group === mg.key);

                            if (!hasColorsInGroup)
                                return null;

                            return (
                                <button
                                    key={mg.key}
                                    className={`material-tab${selectedMaterial === mg.key ? " active" : ""}`}
                                    onClick={() => {
                                        setSelectedMaterial(mg.key);
                                        const firstColorInGroup = OWL_DATA.colors.find(c => c.group === mg.key);

                                        if (firstColorInGroup) {
                                            setCurrentImageIndex(firstColorInGroup.imageIndex);
                                        }
                                    }}>
                                    {mg.label}
                                </button>
                            );
                        })}
                    </div>
                    {}
                    <div className="color-circles">
                        {OWL_DATA.colors.filter(c => c.group === selectedMaterial).map(c => <button
                            key={c.key}
                            className={`color-circle${selectedColor === c.key ? " selected" : ""}`}
                            onClick={() => handleColorSelect(c.key)}>
                            <img
                                src={OWL_DATA.images[c.imageIndex]}
                                alt={c.label}
                                className="circle-thumb" />
                            {selectedColor === c.key && <span className="selected-dot" />}
                        </button>)}
                    </div>
                </div>
                {}
                <div className="inspiration">
                    <div className="section-label">实景灵感</div>
                    <div className="scene-scroll">
                        {OWL_DATA.scenes.map((s, i) => <div key={i} className="scene-card">
                            <img src={s.image} alt="" loading="lazy" />
                            <div className="label">{s.label}</div>
                            <div className="sub">{s.sub}</div>
                        </div>)}
                    </div>
                </div>
                {}
                <div className="features">
                    {OWL_DATA.features.map(f => <div key={f.num} className="feature-row">
                        <span className="num">{f.num}</span>
                        <span className="label">{f.label}</span>
                        <span className="desc">{f.desc}</span>
                    </div>)}
                </div>
                {}
                <div className="description">
                    <p>{OWL_DATA.description}</p>
                </div>
                {}
                {/* Interior Inspiration */}
                <div className="interior-inspiration">
                    <div className="interior-header">
                        <span className="interior-label">✦ 细节展示</span>
                    </div>
                    <div className="interior-grid">
                        {OWL_DATA.scenes.map((scene: { image: string; label: string; sub: string }, idx: number) => (
                            <div key={idx} className="interior-item">
                                <div className="interior-image">
                                    <img src={scene.image} alt={scene.label} loading="lazy" width={400} height={400} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {}
                <div className="story">
                    <div className="section-label">设计故事</div>
                    <div className="story-grid">
                        <div className="story-image">
                            <img src={OWL_DATA.images[2]} alt="Design sketch" loading="lazy" />
                            <span className="sketch-tag">✧ 手稿 · 概念设计</span>
                        </div>
                        <div className="story-text">
                            <div className="title">
                                {OWL_DATA.storyTitle} <span className="light">✦</span>
                            </div>
                            {OWL_DATA.storyText.map((t: string, i: number) => <p key={i}>{t}</p>)}
                            <p className="spec-note">* 手工制作 · 尺寸可能存在 ±1-3cm 差异 · 重量因面料批次略有浮动</p>
                        </div>
                    </div>
                </div>
                {}
                <div className="specs-header">
                    <span className="label">尺寸</span>
                    <div className="unit-toggle" id="detailUnitToggle">
                        <button className={unit === "cm" ? "active" : ""} onClick={() => setUnit("cm")}>cm</button>
                        <button className={unit === "in" ? "active" : ""} onClick={() => setUnit("in")}>in</button>
                    </div>
                </div>
                <div className="specs" id="detailSpecsContainer">
                    {OWL_DATA.specs.map(s => <div key={s.label} className="spec-item">
                        <span className="l">{s.label}</span>
                        <span className="v">{unit === "cm" ? `${s.cm} cm` : `${s.inch} in`}</span>
                    </div>)}
                </div>
                {}
                <div className="craft">
                    <div className="section-label">材质与工艺</div>
                    <div className="craft-list">
                        {OWL_DATA.crafts.map(c => <div key={c.name} className="craft-item">
                            <span className="line" />
                            <span className="name">{c.name}</span>
                            <span className="detail">{c.detail}</span>
                        </div>)}
                    </div>
                </div>
                {}
                <div className="explore-more">
                    <div className="explore-header">
                        <span className="explore-label">发现更多</span>
                        <Link href="/m/collection" className="explore-view-all">查看全部 →</Link>
                    </div>
                    <div className="explore-scroll">
                        {OWL_DATA.explore.map(
                            e => <Link key={e.key} href={`/m/product/${e.key}`} className="explore-card">
                                <div className="explore-card-image">
                                    <img src={e.image} alt={e.name} loading="lazy" />
                                </div>
                                <div className="explore-card-info">
                                    <div className="explore-card-name">{e.name}</div>
                                    <div className="explore-card-desc">{e.desc}</div>
                                    <div className="explore-card-price">{e.price}</div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            {}
            {!showAR && !showAIOverlay && <button
                className={`btn-ai-float${showPurchasePanel ? " panel-open" : ""}`}
                onClick={() => setShowAIOverlay(true)}>
                <svg className="icon" viewBox="0 0 24 24">
                    <path
                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <span className="ai-label">AI 预览</span>
            </button>}
            {}
            <div className="bottom-cta">
                <div className="row-top">
                    <div className="product-id">
                        <span className="brand">FUZZ SOFA</span>
                        <span className="name">{OWL_DATA.name}</span>
                    </div>
                    <span className="price">$3,500 <small>USD</small></span>
                </div>
                <div className="row-bottom">
                    <button
                        className="btn-cart"
                        onClick={() => {
                            setPurchaseSource("cart");
                            setShowPurchasePanel(true);
                        }}>加入购物车</button>
                    <button
                        className="btn-buy"
                        onClick={() => {
                            setPurchaseSource("buy");
                            setShowPurchasePanel(true);
                        }}>立即购买</button>
                </div>
            </div>
            {}
            {showPurchasePanel && <div
                className="new-bottom-sheet-overlay"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (e.target === e.currentTarget)
                        setShowPurchasePanel(false);
                }}>
                <div className="new-bottom-sheet-panel">
                    <div className="new-bottom-sheet-content">
                        {/* Header with close button */}
                        <div className="new-sheet-header">
                            <button className="new-sheet-close" onClick={() => setShowPurchasePanel(false)}>×</button>
                        </div>
                        
                        {/* Material selection */}
                        <div className="new-sheet-section">
                            <div className="new-sheet-material-tabs">
                                {MATERIAL_GROUPS.map(mg => {
                                    const hasColorsInGroup = OWL_DATA.colors.some(c => c.group === mg.key);
                                    if (!hasColorsInGroup) return null;
                                    return (
                                        <button
                                            key={mg.key}
                                            className={`new-sheet-material-tab${selectedMaterial === mg.key ? " active" : ""}`}
                                            onClick={() => {
                                                setSelectedMaterial(mg.key);
                                                const firstColorInGroup = OWL_DATA.colors.find(c => c.group === mg.key);
                                                if (firstColorInGroup) {
                                                    setPanelColor(firstColorInGroup.key);
                                                }
                                            }}>
                                            {mg.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="new-sheet-color-circles">
                                {OWL_DATA.colors.filter(c => c.group === selectedMaterial).map(c => (
                                    <button
                                        key={c.key}
                                        className={`new-sheet-color-circle${panelColor === c.key ? " selected" : ""}`}
                                        onClick={() => setPanelColor(c.key)}>
                                        <img
                                            src={OWL_DATA.images[c.imageIndex]}
                                            alt={c.label}
                                            className="new-sheet-circle-thumb" />
                                        {panelColor === c.key && <span className="new-sheet-selected-dot" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Quantity */}
                        <div className="new-sheet-section new-sheet-quantity-row">
                            <span className="new-sheet-qty-label">Quantity</span>
                            <div className="new-sheet-qty-controls">
                                <button
                                    className="new-sheet-qty-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span className="new-sheet-qty-value">{quantity}</span>
                                <button className="new-sheet-qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>
                        
                        {/* Price summary */}
                        <div className="new-sheet-section new-sheet-price-row">
                            <span className="new-sheet-summary-label">Total</span>
                            <span className="new-sheet-summary-price">${(OWL_DATA.priceRange.americas[0] * quantity).toLocaleString()}USD</span>
                        </div>
                        
                        {/* Confirm button */}
                        <button
                            className="new-sheet-confirm-btn"
                            onClick={() => {
                                const selectedColorData = OWL_DATA.colors.find(c => c.key === panelColor);
                                if (purchaseSource === "cart") {
                                    addItem({
                                        product: {
                                            slug: OWL_DATA.slug,
                                            name: OWL_DATA.name,
                                            priceRange: OWL_DATA.priceRange,
                                            images: OWL_DATA.images
                                        },
                                        quantity: quantity,
                                        materialType: selectedMaterial,
                                        materialOption: selectedColorData?.label || panelColor,
                                        region: "americas",
                                        selected: true
                                    });
                                    setShowPurchasePanel(false);
                                    setShowCartSuccess(true);
                                    setTimeout(() => setShowCartSuccess(false), 3000);
                                } else {
                                    const selectedColorData = OWL_DATA.colors.find(c => c.key === panelColor);
                                    const priceRange = OWL_DATA.priceRange.americas;
                                    const price = priceRange[0];
                                    const orderId = `FZ-${Date.now()}`;
                                    const items = [{
                                        name: OWL_DATA.name,
                                        color: selectedColorData?.label || panelColor,
                                        quantity: quantity,
                                        price: price
                                    }];
                                    const total = (price * quantity).toFixed(2);
                                    sessionStorage.setItem('paymentOrderId', orderId);
                                    sessionStorage.setItem('paymentItems', JSON.stringify(items));
                                    sessionStorage.setItem('paymentTotal', total);
                                    setShowPurchasePanel(false);
                                    router.push("/m/payment");
                                }
                            }}>{purchaseSource === "cart" ? "Add to Cart" : "Buy Now"}</button>
                    </div>
                </div>
            </div>}
            {}
            {showCartSuccess && <div
                className="cart-success-overlay"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (e.target === e.currentTarget)
                        setShowCartSuccess(false);
                }}>
                <div className="cart-success-popup">
                    <div className="success-icon">
                        <svg
                            viewBox="0 0 24 24"
                            width="32"
                            height="32"
                            stroke="#E8B4B8"
                            strokeWidth="2"
                            fill="none">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <p className="success-text">{OWL_DATA.name}已成功加入购物车</p>
                    <div className="success-buttons">
                        <button className="btn-view-cart" onClick={() => router.push("/m/cart")}>查看购物车</button>
                        <button className="btn-continue" onClick={() => setShowCartSuccess(false)}>继续浏览</button>
                    </div>
                </div>
            </div>}
            {}
            {showAIOverlay && <div
                className="ai-overlay"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (e.target === e.currentTarget)
                        setShowAIOverlay(false);
                }}>
                <div className="ai-content">
                    <button className="ai-close" onClick={() => setShowAIOverlay(false)}>×</button>
                    <div className="ai-header">
                        <h2>AI 试用体验</h2>
                        <p>将 {OWL_DATA.name}放入您的空间</p>
                    </div>
                    <div className="ai-preview">
                        <img src={OWL_DATA.images[0]} alt={OWL_DATA.name} />
                        <div className="ai-hint">点击相机按钮，拍摄您的空间</div>
                    </div>
                    <div className="ai-controls">
                        <button className="ai-camera-btn">
                            <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none">
                                <path
                                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                            </svg>拍摄空间
                                                                                                  </button>
                    </div>
                </div>
            </div>}
            {}
            {showAR && <div className="ar-overlay open" id="detailArOverlay">
                <div className="ar-header">
                    <button className="ar-back" onClick={() => setShowAR(false)}>← 返回</button>
                    <span
                        style={{
                            fontSize: 13,
                            color: "#8A8580",
                            letterSpacing: "0.04em"
                        }}>AR 预览</span>
                    <button className="ar-done" onClick={() => setShowAR(false)}>完成 ✓</button>
                </div>
                <div className="ar-scene">
                    <img src={OWL_DATA.images[0]} alt="Room" className="room-bg" id="detailRoomBg" />
                    <div
                        className="ar-product-overlay"
                        id="detailArProduct"
                        style={{
                            transform: `translateX(-50%) scale(${0.4 + arSize / 100 * 0.8})`,
                            opacity: 0.3 + arOpacity / 100 * 0.7
                        }}>
                        <img src={OWL_DATA.images[0]} alt={OWL_DATA.name} />
                    </div>
                    <div className="ar-product-label">
                        <strong>{OWL_DATA.name}</strong>· 拖拽调整位置
                                                                                    </div>
                    <div className="ar-hint">👆 双指缩放 · 单指旋转 <span className="hint-sub">点击产品可切换角度</span>
                    </div>
                    <div className="ar-controls">
                        <div className="control-item">
                            <span className="ctrl-label">大小</span>
                            <span className="ctrl-value">{arSize}%</span>
                            <input
                                type="range"
                                className="ctrl-slider"
                                min={40}
                                max={120}
                                value={arSize}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArSize(Number(e.target.value))} />
                        </div>
                        <div className="control-item">
                            <span className="ctrl-label">透明度</span>
                            <span className="ctrl-value">{arOpacity}%</span>
                            <input
                                type="range"
                                className="ctrl-slider"
                                min={30}
                                max={100}
                                value={arOpacity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArOpacity(Number(e.target.value))} />
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}