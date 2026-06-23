import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";
import { BoutiqueHotelContent } from "./boutique-hotel-content";

export const metadata: Metadata = {
  title: "Boutique Hotel Lobby Furniture | Sculptural Statements",
  description:
    "How sculptural furniture transforms boutique hotel lobbies into memorable first impressions. Fuzz Sofa pieces for hospitality spaces. Free white-glove delivery worldwide.",
};

export default function BoutiqueHotelLobbyPage() {
  const hotelProducts = products.filter((p) =>
    p.relatedInteriors.includes("boutique-hotel-lobby")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Boutique Hotel Lobby", url: "https://fuzzsofa.com/boutique-hotel-lobby" },
            ])
          ),
        }}
      />
      <BoutiqueHotelContent products={hotelProducts} />
    </>
  );
}
