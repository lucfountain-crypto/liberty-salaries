import type { Metadata } from "next";
import CVReviewComponent from "../components/CVReview";

export const metadata: Metadata = {
  title: "AI CV Review & Executive Audit | Liberty Towers",
  description:
    "Upload your CV for an immediate, confidential executive recruiter critique. Evaluate tenure stability, job-hoppiness risk, quantified commercial metrics, and target salary calibration.",
};

export default function CVReviewPage() {
  return <CVReviewComponent />;
}
