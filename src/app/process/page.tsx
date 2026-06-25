import type { Metadata } from "next";
import { ProcessContent } from "./process-content";

export const metadata: Metadata = {
  title: "Our Process — How Fuzz Sofa Furniture Is Made",
  description:
    "Every Fuzz Sofa piece is made to order at our Shanghai workshop. From frame construction to final upholstery, the process takes 1–2 weeks and involves over 40 individual steps.",
};

export default function ProcessPage() {
  return <ProcessContent />;
}
