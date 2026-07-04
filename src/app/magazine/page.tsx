import type { Metadata } from "next";
import { MagazinePageClient } from "./magazine-client";

export const metadata: Metadata = {
  title: "Fuzz Sofa World",
  description:
    "Explore the world of sculptural furniture through curated editorials, artisan stories, and community spaces. Fuzz Sofa World for those who see furniture as art.",
  openGraph: {
    title: "Fuzz Sofa World",
    description:
      "Curated editorials, artisan stories, and community spaces for sculptural furniture lovers.",
  },
};

export default function MagazinePage() {
  return <MagazinePageClient />;
}
