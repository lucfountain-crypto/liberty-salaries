import { z } from "zod";

const conciseText = z.string().trim().min(1).max(1000);
const bullet = z.string().trim().min(1).max(300);

export const reviewSectionSchema = z.object({
  observed: z.boolean(),
  score: z.number().int().min(0).max(100),
  summary: conciseText,
  strengths: z.array(bullet).max(3),
  improvements: z.array(bullet).max(3),
});

export const modelReviewSchema = z.object({
  executiveSummary: z.string().trim().min(1).max(1200),
  photo: reviewSectionSchema,
  banner: reviewSectionSchema,
  headline: reviewSectionSchema.extend({
    rewrite: z.string().trim().max(400),
    alternativeRewrites: z.array(z.string().trim().max(400)).optional(),
  }),
  career: reviewSectionSchema,
  targetFit: reviewSectionSchema,
  priorityActions: z.array(bullet).min(3).max(5),
});

export const profileReviewSchema = modelReviewSchema.extend({
  overallScore: z.number().int().min(0).max(100),
});

export type ReviewSection = z.infer<typeof reviewSectionSchema>;
export type ModelReview = z.infer<typeof modelReviewSchema>;
export type ProfileReview = z.infer<typeof profileReviewSchema>;

export function calculateOverallScore(review: ModelReview): number {
  const weightedSections = [
    { section: review.photo, weight: 20 },
    { section: review.banner, weight: 10 },
    { section: review.headline, weight: 25 },
    { section: review.career, weight: 25 },
    { section: review.targetFit, weight: 20 },
  ].filter(({ section }) => section.observed);

  if (weightedSections.length === 0) {
    return 0;
  }

  const totalWeight = weightedSections.reduce((sum, item) => sum + item.weight, 0);
  const weightedScore = weightedSections.reduce(
    (sum, item) => sum + item.section.score * item.weight,
    0
  );

  return Math.round(weightedScore / totalWeight);
}
