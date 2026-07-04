import type { Metadata } from "next";
import { MagazinePageClient } from "./magazine-client";

export const metadata: Metadata = {
  title: "Interior World — Fuzz Sofa Studio",
  description:
    "Explore the world of sculptural furniture through curated editorials, artisan stories, and community spaces. Interior World for those who see furniture as art.",
  openGraph: {
    title: "Interior World — Fuzz Sofa Studio",
    description:
      "Curated editorials, artisan stories, and community spaces for sculptural furniture lovers.",
  },
};

export default function MagazinePage() {
  return <MagazinePageClient />;
}
