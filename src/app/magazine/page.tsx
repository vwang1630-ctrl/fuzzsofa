import type { Metadata } from "next";
import { MagazinePageClient } from "./magazine-client";

export const metadata: Metadata = {
  title: "The Gallery",
  description:
    "Explore the world of sculptural furniture through curated editorials, artisan stories, and community spaces. The Gallery for those who see furniture as art.",
  openGraph: {
    title: "The Gallery",
    description:
      "Curated editorials, artisan stories, and community spaces for sculptural furniture lovers.",
  },
};

export default function MagazinePage() {
  return <MagazinePageClient />;
}
