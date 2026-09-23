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

export const reviewerSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  lens: z.string(),
  description: z.string(),
  gradient: z.string(),
  bgLight: z.string(),
  initials: z.string(),
  genderStyle: z.enum(["female", "male", "neutral"]).optional(),
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
  reviewer: reviewerSchema,
});

export type ReviewSection = z.infer<typeof reviewSectionSchema>;
export type Reviewer = z.infer<typeof reviewerSchema>;
export type ModelReview = z.infer<typeof modelReviewSchema>;
export type ProfileReview = z.infer<typeof profileReviewSchema>;

export const PANEL_REVIEWERS: Reviewer[] = [
  {
    id: "hannah",
    name: "Hannah",
    role: "Senior In-House Talent Lead",
    lens: "Recruiter 5-Second Scan & ATS Readability",
    description: "Focuses on how corporate in-house recruiters parse titles, career progression, and ATS keyword visibility.",
    gradient: "from-rose-500 to-pink-600",
    bgLight: "bg-pink-50 text-pink-700 border-pink-200",
    initials: "HN",
    genderStyle: "female",
  },
  {
    id: "emily",
    name: "Emily",
    role: "Executive Search Consultant",
    lens: "Board-Level Polish & Leadership Gravitas",
    description: "Focuses on strategic commercial value, executive tone, and eliminating passive phrases.",
    gradient: "from-violet-500 to-purple-700",
    bgLight: "bg-purple-50 text-purple-700 border-purple-200",
    initials: "EM",
    genderStyle: "female",
  },
  {
    id: "mark",
    name: "Mark",
    role: "Commercial Practice Director",
    lens: "Quantifiable ROI & Revenue Impact",
    description: "Focuses on hard metrics, portfolio and deal sizes, commercial evidence, and bottom-line contributions.",
    gradient: "from-blue-600 to-indigo-700",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    initials: "MK",
    genderStyle: "male",
  },
  {
    id: "luke",
    name: "Luke",
    role: "Headhunting Specialist",
    lens: "Competitor Poaching Appeal & Punchy Headlines",
    description: "Focuses on market differentiation, high-converting hooks, and making the profile stand out to headhunters.",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 text-amber-700 border-amber-200",
    initials: "LK",
    genderStyle: "male",
  },
  {
    id: "jon",
    name: "Jon",
    role: "Technical Recruitment Lead",
    lens: "Hard Skill Credibility & Tech Deliverables",
    description: "Focuses on concrete project outcomes, technical stack depth, architecture credentials, and domain mastery.",
    gradient: "from-teal-500 to-emerald-700",
    bgLight: "bg-teal-50 text-teal-700 border-teal-200",
    initials: "JN",
    genderStyle: "male",
  },
  {
    id: "nita",
    name: "Nita",
    role: "People & Talent Director",
    lens: "Career Trajectory & Cultural Leadership",
    description: "Focuses on team enablement, career longevity, cultural alignment, and cross-functional leadership proof.",
    gradient: "from-fuchsia-500 to-pink-600",
    bgLight: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    initials: "NT",
    genderStyle: "female",
  },
  {
    id: "abdul",
    name: "Abdul",
    role: "Enterprise Hiring Consultant",
    lens: "Enterprise Complexity & Scale of Influence",
    description: "Focuses on multi-stakeholder governance, budget accountability, and enterprise delivery scale.",
    gradient: "from-sky-500 to-blue-700",
    bgLight: "bg-sky-50 text-sky-700 border-sky-200",
    initials: "AB",
    genderStyle: "male",
  },
  {
    id: "patrick",
    name: "Patrick",
    role: "Senior Search Partner",
    lens: "C-Suite Gravitas & Brevity",
    description: "Focuses on crisp executive communication, decisive tone, and cutting out low-impact fluff.",
    gradient: "from-slate-700 to-slate-900",
    bgLight: "bg-slate-100 text-slate-800 border-slate-300",
    initials: "PK",
    genderStyle: "male",
  },
  {
    id: "alex",
    name: "Alex",
    role: "In-House Talent Specialist",
    lens: "First-Impression Clarity & Role Match",
    description: "Focuses on fast visual hierarchy, clear role scope, and immediate shortlist suitability.",
    gradient: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50 text-cyan-700 border-cyan-200",
    initials: "AX",
    genderStyle: "neutral",
  },
  {
    id: "simon",
    name: "Simon",
    role: "Financial & Professional Services Recruiter",
    lens: "Fiduciary Standing & Regulatory Rigor",
    description: "Focuses on governance credentials, institutional reputation, compliance awareness, and risk acumen.",
    gradient: "from-emerald-600 to-teal-800",
    bgLight: "bg-emerald-50 text-emerald-800 border-emerald-200",
    initials: "SM",
    genderStyle: "male",
  },
  {
    id: "debbie",
    name: "Debbie",
    role: "Senior Talent Acquisition Manager",
    lens: "Promotion Velocity & Cohesive Narrative",
    description: "Focuses on logical tenure progression, internal stepping stones, and explaining role transitions.",
    gradient: "from-rose-400 to-red-600",
    bgLight: "bg-rose-50 text-rose-700 border-rose-200",
    initials: "DB",
    genderStyle: "female",
  },
  {
    id: "lili",
    name: "Lili",
    role: "Modern Brand & Digital Advisor",
    lens: "Visual Presentation & Brand Alignment",
    description: "Focuses on headshot framing, banner relevance, clean typography, and modern digital presence.",
    gradient: "from-indigo-400 to-purple-600",
    bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
    initials: "LL",
    genderStyle: "female",
  },
  {
    id: "marina",
    name: "Marina",
    role: "Global Talent Strategist",
    lens: "International Mobility & Cross-Border Scope",
    description: "Focuses on global market relevance, multi-territory coordination, and sector adaptability.",
    gradient: "from-blue-500 to-cyan-700",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    initials: "MR",
    genderStyle: "female",
  },
  {
    id: "terri",
    name: "Terri",
    role: "Operations & Transformation Lead",
    lens: "Operational Efficiency & Execution Proof",
    description: "Focuses on process transformation, delivery cadence, and evidence of organizational problem solving.",
    gradient: "from-emerald-500 to-green-700",
    bgLight: "bg-green-50 text-green-700 border-green-200",
    initials: "TR",
    genderStyle: "female",
  },
  {
    id: "tanya",
    name: "Tanya",
    role: "Boutique Search Consultant",
    lens: "Niche Domain Authority & Uniqueness",
    description: "Focuses on what makes the candidate truly rare in their specific market niche.",
    gradient: "from-amber-600 to-yellow-600",
    bgLight: "bg-amber-50 text-amber-800 border-amber-200",
    initials: "TY",
    genderStyle: "female",
  },
  {
    id: "rosie",
    name: "Rosie",
    role: "Creative & Growth Talent Partner",
    lens: "Storytelling Hook & Authenticity",
    description: "Focuses on personal narrative voice, engagement magnetism, and an authentic professional persona.",
    gradient: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50 text-pink-700 border-pink-200",
    initials: "RS",
    genderStyle: "female",
  },
  {
    id: "penny",
    name: "Penny",
    role: "Senior Talent Resourcer",
    lens: "Boolean Search & Keyword Density",
    description: "Focuses on how recruiters query LinkedIn Recruiter filters and whether critical search terms are present.",
    gradient: "from-indigo-500 to-blue-600",
    bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
    initials: "PN",
    genderStyle: "female",
  },
  {
    id: "harry",
    name: "Harry",
    role: "Commercial Director & Search Lead",
    lens: "Commercial Accountability & Revenue Focus",
    description: "Focuses on business growth outcomes, P&L ownership, and client retention proof.",
    gradient: "from-slate-600 to-slate-800",
    bgLight: "bg-slate-100 text-slate-800 border-slate-300",
    initials: "HR",
    genderStyle: "male",
  },
  {
    id: "nick",
    name: "Nick",
    role: "Strategic Sourcing Lead",
    lens: "Outbound Candidate Appeal",
    description: "Focuses on how compelling the profile looks to a hiring manager who is cold-messaging top talent.",
    gradient: "from-blue-600 to-slate-700",
    bgLight: "bg-blue-50 text-blue-800 border-blue-200",
    initials: "NK",
    genderStyle: "male",
  },
  {
    id: "gosia",
    name: "Gosia",
    role: "European & UK Practice Lead",
    lens: "Core Competencies & Structural Clarity",
    description: "Focuses on structured readability, clear domain competencies, and market-ready positioning.",
    gradient: "from-purple-600 to-indigo-800",
    bgLight: "bg-purple-50 text-purple-700 border-purple-200",
    initials: "GS",
    genderStyle: "female",
  },
  {
    id: "luna",
    name: "Luna",
    role: "Digital & Product Talent Partner",
    lens: "Modern Deliverables & Agile Impact",
    description: "Focuses on product thinking, modern tech positioning, and demonstrable output.",
    gradient: "from-violet-600 to-fuchsia-700",
    bgLight: "bg-violet-50 text-violet-700 border-violet-200",
    initials: "LN",
    genderStyle: "female",
  },
  {
    id: "peter",
    name: "Peter",
    role: "Board & Non-Exec Advisory Lead",
    lens: "Governance Standing & Advisory Weight",
    description: "Focuses on senior stakeholder influence, strategic oversight, and corporate maturity.",
    gradient: "from-zinc-700 to-neutral-900",
    bgLight: "bg-zinc-100 text-zinc-800 border-zinc-300",
    initials: "PT",
    genderStyle: "male",
  },
  {
    id: "paul",
    name: "Paul",
    role: "Senior Industry Practice Recruiter",
    lens: "Domain Depth & Technical Rigor",
    description: "Focuses on industry-specific nuances, authentic domain vocabulary, and functional authority.",
    gradient: "from-sky-600 to-cyan-800",
    bgLight: "bg-sky-50 text-sky-800 border-sky-200",
    initials: "PL",
    genderStyle: "male",
  },
  {
    id: "betsy",
    name: "Betsy",
    role: "Talent Engagement Specialist",
    lens: "Conversational Tone & Approachability",
    description: "Focuses on making the profile approachable, engaging, and inviting high-quality inbound conversations.",
    gradient: "from-teal-600 to-emerald-600",
    bgLight: "bg-teal-50 text-teal-700 border-teal-200",
    initials: "BT",
    genderStyle: "female",
  },
  {
    id: "ronnie",
    name: "Ronnie",
    role: "Senior Headhunter",
    lens: "Direct Commercial Differentiation",
    description: "Focuses on stripping out boilerplate corporate jargon to highlight what is truly unique.",
    gradient: "from-red-600 to-rose-700",
    bgLight: "bg-red-50 text-red-700 border-red-200",
    initials: "RN",
    genderStyle: "male",
  },
  {
    id: "wendy",
    name: "Wendy",
    role: "Executive Talent Partner",
    lens: "Leadership Presence & Executive Polish",
    description: "Focuses on senior professionalism, diplomatic tone, and high-trust leadership signals.",
    gradient: "from-amber-500 to-orange-700",
    bgLight: "bg-orange-50 text-orange-800 border-orange-200",
    initials: "WD",
    genderStyle: "female",
  },
  {
    id: "graeme",
    name: "Graeme",
    role: "Strategic Workforce Consultant",
    lens: "Problem-Solving Proof & Organizational Impact",
    description: "Focuses on documented evidence of solving complex business challenges and delivering turnaround.",
    gradient: "from-slate-700 to-blue-900",
    bgLight: "bg-slate-100 text-slate-800 border-slate-300",
    initials: "GM",
    genderStyle: "male",
  },
  {
    id: "emma",
    name: "Emma",
    role: "Personal Branding & Career Lead",
    lens: "Distinctive Narrative & Brand Positioning",
    description: "Focuses on headline-to-summary synergy, personal narrative cohesion, and career brand uniqueness.",
    gradient: "from-fuchsia-600 to-pink-700",
    bgLight: "bg-pink-50 text-pink-700 border-pink-200",
    initials: "EM",
    genderStyle: "female",
  },
];

export function getReviewer(id?: string | null): Reviewer {
  if (id) {
    const found = PANEL_REVIEWERS.find((r) => r.id.toLowerCase() === id.trim().toLowerCase());
    if (found) return found;
  }
  const randomIndex = Math.floor(Math.random() * PANEL_REVIEWERS.length);
  return PANEL_REVIEWERS[randomIndex];
}

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
