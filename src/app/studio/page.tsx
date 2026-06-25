import { Metadata } from "next";
import StudioClient from "./studio-client";

export const metadata: Metadata = {
  title: "Studio | Made-to-Order Sculptural Furniture",
  description:
    "Fuzz Sofa Studio is a design-led furniture studio specializing in sculptural sofas produced through a made-to-order system. Each piece is individually produced after order confirmation. No inventory. No mass production.",
};

export default function StudioPage() {
  return <StudioClient />;
}
