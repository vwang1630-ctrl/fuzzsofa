import type { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Fuzz Sofa — Sculptural Furniture from Shanghai",
  description:
    "Fuzz Sofa creates sculptural animal-inspired furniture at our Shanghai workshop. Learn about our origin, design philosophy, and commitment to lasting quality. Free white-glove delivery worldwide.",
};

export default function AboutPage() {
  return <AboutContent />;
}
