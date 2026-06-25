import { Metadata } from "next";
import RefundPolicyClient from "./refund-policy-client";

export const metadata: Metadata = {
  title: "Refund Policy | Fuzz Sofa Studio",
  description: "Our refund and returns policy for made-to-order sculptural furniture. Damage and defect support included.",
};

export default function RefundPolicyPage() {
  return <RefundPolicyClient />;
}
