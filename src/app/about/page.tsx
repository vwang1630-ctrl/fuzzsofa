import { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Fuzz Sofa Studio | Furniture Design & Manufacturing",
  description: "Fuzz Sofa Studio is a contemporary furniture design studio specializing in sculptural sofas for modern interiors. With 10+ years of manufacturing experience, we combine design vision with production capability.",
};

export default function AboutPage() {
  return <AboutClient />;
}
