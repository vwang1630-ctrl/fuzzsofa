import { Metadata } from "next";
import StudioClient from "./studio-client";

export const metadata: Metadata = {
  title: "Studio | Made-to-Order Custom Sculptural Sofa Studio",
  description:
    "Fuzz Sofa Studio is a design-led furniture studio specializing in custom sculptural sofas produced through a made-to-order system. Each piece is individually produced after order confirmation. No inventory. No mass production. Worldwide shipping.",
  keywords: [
    "custom sculptural sofa",
    "made-to-order sofa studio",
    "designer sofa",
    "custom furniture studio",
    "sculptural furniture design",
    "bespoke sofa",
    "contemporary furniture studio",
  ],
};

export default function StudioPage() {
  return <StudioClient />;
}
