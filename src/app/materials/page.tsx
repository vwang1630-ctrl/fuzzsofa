import type { Metadata } from "next";
import { MaterialsContent } from "./materials-content";

export const metadata: Metadata = {
  title: "Materials — Fuzz Sofa Fabric and Leather Guide",
  description:
    "Fuzz Sofa material guide: Cloud Touch fabrics, Wild Touch textures, and Leather Touch options. Every material selected for tactile richness, visual depth, and lasting performance.",
};

export default function MaterialsPage() {
  return <MaterialsContent />;
}
