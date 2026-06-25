import { Metadata } from "next";
import WorkshopClient from "./workshop-client";

export const metadata: Metadata = {
  title: "Workshop | Fuzz Sofa Studio",
  description: "Behind the studio — where design becomes physical furniture. Frame fabrication, upholstery production, material selection, quality inspection, and export preparation.",
};

export default function WorkshopPage() {
  return <WorkshopClient />;
}
