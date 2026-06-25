import { Metadata } from "next";
import ShippingPolicyClient from "./shipping-policy-client";

export const metadata: Metadata = {
  title: "Shipping Policy | Fuzz Sofa Studio",
  description: "Made-to-order furniture with worldwide shipping. Learn about our production timeline, delivery process, and international logistics.",
};

export default function ShippingPolicyPage() {
  return <ShippingPolicyClient />;
}
