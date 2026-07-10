"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";

type FavItem = {
  slug: string;
  name: string;
  priceRange: {
    americas: [number, number];
    europe: [number, number];
    middle_east: [number, number];
    se_asia: [number, number];
  };
  images?: string[];
  mobileShortKey?: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavItem[]>([]);

  useEffect(() => {
    // 从 localStorage 读取收藏数据
    const savedFavorites = localStorage.getItem("fuzz_favorites");
    if (savedFavorites) {
      try {
        const favSlugs: string[] = JSON.parse(savedFavorites);
        // 从 localStorage 读取产品数据
        const products: FavItem[] = [];
        favSlugs.forEach(slug => {
          const productData = localStorage.getItem(`fuzz_product_${slug}`);
          if (productData) {
            try {
              products.push(JSON.parse(productData));
            } catch (e) {
              console.error("Failed to parse product data:", e);
            }
          }
        });
        setFavorites(products);
      } catch (e) {
        console.error("Failed to parse favorites:", e);
      }
    }
  }, []);

  const handleRemoveFavorite = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const savedFavorites = localStorage.getItem("fuzz_favorites");
    if (savedFavorites) {
      try {
        const favSlugs: string[] = JSON.parse(savedFavorites);
        const newFavSlugs = favSlugs.filter(s => s !== slug);
        localStorage.setItem("fuzz_favorites", JSON.stringify(newFavSlugs));
        setFavorites(prev => prev.filter(f => f.slug !== slug));
      } catch (e) {
        console.error("Failed to remove favorite:", e);
      }
    }
  };

  return (
    <div className="page page-favorites active" id="pageFavorites" style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        background: "#0A0A0A",
        borderBottom: "1px solid #1A1A1A",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 100
      }}>
        <Link href="/m/profile" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
          background: "transparent",
          border: "none",
          cursor: "pointer"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "16px",
          fontWeight: 400,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#F5F0EB"
        }}>My Favorites</span>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 20px",
          textAlign: "center"
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8A8580" strokeWidth="1" style={{ opacity: 0.4, marginBottom: "16px" }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "18px",
            fontWeight: 400,
            color: "#F5F0EB",
            marginBottom: "8px"
          }}>No favorites yet</div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 400,
            color: "#8A8580",
            letterSpacing: "0.05em",
            marginBottom: "24px"
          }}>Save your favorite items to view them later</div>
          <Link href="/m" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#E8B4B8",
            background: "transparent",
            border: "1px solid #E8B4B8",
            padding: "12px 32px",
            cursor: "pointer",
            textDecoration: "none"
          }}>Browse Products</Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          padding: "16px"
        }}>
          {favorites.map((item) => (
            <div key={item.slug} style={{ position: "relative" }}>
              <Link href={`/m/product/${item.mobileShortKey || item.slug}`} style={{
                display: "block",
                background: "#111111",
                border: "1px solid #1A1A1A",
                borderRadius: 0,
                overflow: "hidden",
                textDecoration: "none"
              }}>
                <div style={{
                  width: "100%",
                  aspectRatio: "1",
                  background: "#0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}>
                  <img 
                    src={item.images?.[0] || '/products/placeholder.jpg'} 
                    alt={item.name} 
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <div style={{ padding: "12px" }}>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#F5F0EB",
                    marginBottom: "8px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>{item.name}</div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#E8B4B8"
                  }}>{formatPrice(item.priceRange?.americas?.[0] ?? 0)}</div>
                </div>
              </Link>
              <button
                onClick={(e) => handleRemoveFavorite(item.slug, e)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "32px",
                  height: "32px",
                  background: "#0A0A0A",
                  border: "1px solid #1A1A1A",
                  borderRadius: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8B4B8" stroke="#E8B4B8" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
