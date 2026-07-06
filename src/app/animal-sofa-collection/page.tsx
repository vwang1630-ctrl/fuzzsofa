import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products-server";
import { formatPrice, type Region } from "@/lib/products";
import { breadcrumbJsonLd } from "@/lib/seo";
import { CollectionClient } from "./collection-client";

export const metadata: Metadata = {
  title: "Animal Sofa Collection — Sculptural Furniture Inspired by Nature",
  description:
    "The complete Fuzz Sofa animal-inspired collection: Bear, Lion, Tiger, Gorilla, and Owl. Sculptural statement pieces made to order in Shanghai. Free white-glove delivery worldwide.",
};

export default function AnimalSofaCollectionPage() {
  return <CollectionClient />;
}
