import type { Metadata } from "next";
import ProfileReviewComponent from "../components/ProfileReview";

export const metadata: Metadata = {
  title: "AI LinkedIn Profile Review & Audit | Liberty Towers",
  description:
    "Upload a profile screenshot for an immediate, confidential recruiter evaluation of your photograph, brand banner, headline, and target market positioning.",
};

export default function ProfileReviewPage() {
  return <ProfileReviewComponent />;
}
