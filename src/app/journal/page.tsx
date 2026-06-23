import type { Metadata } from "next";
import JournalContent from "./journal-content";

export const metadata: Metadata = {
  title: "Journal — Fuzz Sofa Design and Furniture Insights",
  description:
    "Design insights, furniture guides, and trend analysis from Fuzz Sofa. Explore articles on statement furniture, sculptural design, and animal-inspired interiors.",
};

export default function JournalPage() {
  return <JournalContent />;
}
