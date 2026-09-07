import { z } from "zod";

const finding = z.string().trim().min(1).max(500);
const concise = z.string().trim().min(1).max(1000);

export const documentTypeSchema = z.enum([
  "pdf",
  "docx",
  "txt",
  "pasted_text",
]);

export const confidenceSchema = z.enum(["low", "medium", "high"]);

export const candidateProfileSchema = z.object({
  inferredSeniority: z.string().trim().min(1).max(120),
  primarySector: z.string().trim().min(1).max(120),
  professionalArchetype: z.string().trim().min(1).max(200),
  yearsOfExperienceEstimate: z.string().trim().min(1).max(80),
  coreStrengths: z.array(finding).min(2).max(6),
  careerStageAssessment: concise,
  candidateIntentEvaluation: concise,
});

export const grammarIssueSchema = z.object({
  quote: z.string().trim().min(1).max(300),
  issueType: z.enum([
    "spelling",
    "grammar",
    "us_vs_uk_spelling",
    "punctuation_capitalisation",
    "inconsistent_tense",
  ]),
  correction: z.string().trim().min(1).max(300),
  explanation: concise,
});

export const spellingAndGrammarAuditSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  verdict: z.enum([
    "flawless",
    "minor_issues",
    "needs_remedying",
    "critically_flawed",
  ]),
  summary: concise,
  issues: z.array(grammarIssueSchema).max(12),
  ukEnglishCompliance: z.object({
    compliant: z.boolean(),
    notes: finding,
  }),
});

export const competencyRequirementSchema = z.object({
  competency: z.string().trim().min(1).max(160),
  importance: concise,
  status: z.enum(["fully_evidenced", "partially_evidenced", "missing"]),
  cvEvidence: concise,
  gapAction: concise,
});

export const targetRoleAnalysisSchema = z.object({
  targetRole: z.string().trim().min(1).max(160),
  roleFitScore: z.number().int().min(0).max(100),
  fitCategory: z.enum([
    "strong_direct_match",
    "credible_step_up",
    "adjacent_pivot",
    "under_qualified",
  ]),
  fitSummary: concise,
  competencyMatrix: z.array(competencyRequirementSchema).min(3).max(8),
  targetRoleRepositioning: z.array(finding).min(2).max(6),
});

export const scoreSectionSchema = z.object({
  assessed: z.boolean().describe("Whether the supplied evidence supports a fair score."),
  score: z.number().int().min(0).max(100).nullable(),
  confidence: confidenceSchema,
  summary: concise,
  evidence: z.array(finding).max(6),
  risks: z.array(finding).max(5),
  improvements: z.array(finding).max(5),
});

export const shortRoleSchema = z.object({
  employer: z.string().trim().min(1).max(160),
  role: z.string().trim().min(1).max(160),
  datesAsWritten: z.string().trim().min(1).max(80),
  approximateTenureMonths: z.number().int().nonnegative().nullable(),
  classification: z.enum([
    "permanent",
    "contract",
    "interim",
    "secondment",
    "internal_move",
    "unclear",
  ]),
  concernLevel: z.enum(["none", "low", "medium", "high"]),
  assessment: concise,
});

export const gapSchema = z.object({
  between: z.string().trim().min(1).max(240),
  approximateMonths: z.number().int().nonnegative().nullable(),
  confidence: confidenceSchema,
  assessment: concise,
});

export const killWordSchema = z.object({
  phrase: z.string().trim().min(1).max(160),
  category: z.enum([
    "passive_responsibility",
    "cliche",
    "vague_claim",
    "weak_verb",
    "filler",
    "outdated_wording",
  ]),
  whyItHurts: concise,
  replacementDirection: concise,
  example: z.string().trim().min(1).max(500),
});

export const priorityFixSchema = z.object({
  priority: z.number().int().min(1).max(5),
  title: z.string().trim().min(1).max(140),
  whyItMatters: concise,
  action: concise,
  example: z.string().trim().max(600),
});

export const modelCvReviewSchema = z.object({
  detectedVertical: z.enum([
    "insurance_reinsurance",
    "quant_finance",
    "tech_engineering",
    "audit_governance",
    "legal_compliance",
    "banking_finance",
    "other",
    "unclear",
  ]),

  candidateProfile: candidateProfileSchema,
  spellingAndGrammarAudit: spellingAndGrammarAuditSchema,
  targetRoleAnalysis: targetRoleAnalysisSchema,

  executiveVerdict: z.object({
    submissionReadiness: z.enum([
      "ready",
      "minor_revision",
      "major_revision",
      "reposition_before_submission",
    ]),
    summary: concise,
    strongestSellingPoint: finding,
    largestSubmissionRisk: finding,
    likelyFirstImpression: concise,
  }),

  scorecard: z.object({
    careerTrajectoryAndTenure: scoreSectionSchema,
    quantifiedCommercialImpact: scoreSectionSchema,
    targetRoleAndSalaryAlignment: scoreSectionSchema,
    formattingBrevityAndPresentation: scoreSectionSchema,
  }),

  tenureAnalysis: z.object({
    hoppinessRiskScore: z
      .number()
      .int()
      .min(0)
      .max(100)
      .nullable()
      .describe("Inverse risk score: 0 means very stable and 100 means high job-hopping risk."),
    riskLevel: z.enum(["low", "moderate", "high", "unable_to_assess"]),
    rolesAssessed: z.number().int().nonnegative(),
    averageTenureMonths: z.number().int().nonnegative().nullable(),
    medianTenureMonths: z.number().int().nonnegative().nullable(),
    movesUnder18Months: z.number().int().nonnegative(),
    shortRoles: z.array(shortRoleSchema).max(12),
    unexplainedGaps: z.array(gapSchema).max(10),
    calculationNotes: z.array(finding).max(6),
    hiringManagerPerception: concise,
    fairContextOrMitigation: z.array(finding).max(6),
  }),

  salaryCalibration: z.object({
    roleAlignment: z.enum([
      "strongly_supported",
      "credible",
      "stretch",
      "significant_gap",
      "insufficient_evidence",
    ]),
    salaryEvidenceVerdict: z.enum([
      "supported",
      "plausible_but_under_evidenced",
      "ambitious",
      "unsupported",
      "market_data_required",
    ]),
    confidence: confidenceSchema,
    marketBenchmarkUsed: z.boolean(),
    evidenceSupportedSalaryBand: z.string().trim().max(120).nullable(),
    numericDeltaFromTarget: z.string().trim().max(120).nullable(),
    evidenceDelta: concise,
    rationale: concise,
    supportingEvidence: z.array(finding).max(6),
    missingScopeOrProof: z.array(finding).max(6),
  }),

  strengths: z.array(finding).min(2).max(6),
  keyWeaknesses: z.array(finding).min(2).max(8),
  killWords: z.array(killWordSchema).max(10),
  missingMetrics: z.array(finding).max(10),

  structuralFindings: z.object({
    pageLengthAssessment: concise,
    chronologyAndDateClarity: concise,
    sectionOrderAndHierarchy: concise,
    atsRisks: z.array(finding).max(6),
    outdatedOrUnhelpfulContent: z.array(finding).max(6),
  }),

  priorityFixes: z.array(priorityFixSchema).min(3).max(5),

  executiveSummaryRewrite: z.object({
    text: z.string().trim().min(1).max(1200),
    sentenceCount: z.number().int().min(1).max(4),
    evidenceUsed: z.array(finding).max(6),
    proofStillNeeded: z.array(finding).max(5),
  }),

  limitations: z.array(finding).max(8),
});

export const cvReviewReportSchema = modelCvReviewSchema.extend({
  reviewVersion: z.literal("1.0"),
  overallScore: z.number().int().min(0).max(100).nullable(),
  target: z.object({
    role: z.string().trim().min(2).max(160),
    salary: z.string().trim().min(1).max(100),
    location: z.string().trim().min(2).max(160),
    seniority: z.string().trim().optional(),
    sector: z.string().trim().optional(),
    moveType: z.string().trim().optional(),
    nuanceNotes: z.string().trim().optional(),
  }),
  auditScope: z.object({
    documentType: documentTypeSchema,
    evidenceLevel: z.enum(["full_visual", "structural", "text_only"]),
    fileName: z.string().trim().max(220).nullable(),
    pageCount: z.number().int().positive().nullable(),
    wordCount: z.number().int().nonnegative(),
    extractionWarnings: z.array(finding).max(8),
  }),
  callToAction: z.object({
    heading: z.string().trim(),
    body: z.string().trim(),
    buttonLabel: z.string().trim(),
    href: z.string().trim(),
  }),
});

export type CandidateProfile = z.infer<typeof candidateProfileSchema>;
export type GrammarIssue = z.infer<typeof grammarIssueSchema>;
export type SpellingAndGrammarAudit = z.infer<typeof spellingAndGrammarAuditSchema>;
export type CompetencyRequirement = z.infer<typeof competencyRequirementSchema>;
export type TargetRoleAnalysis = z.infer<typeof targetRoleAnalysisSchema>;
export type ScoreSection = z.infer<typeof scoreSectionSchema>;
export type ShortRole = z.infer<typeof shortRoleSchema>;
export type KillWord = z.infer<typeof killWordSchema>;
export type PriorityFix = z.infer<typeof priorityFixSchema>;
export type ModelCvReview = z.infer<typeof modelCvReviewSchema>;
export type CvReviewReport = z.infer<typeof cvReviewReportSchema>;

export function calculateCvOverallScore(review: ModelCvReview): number | null {
  const sections = Object.values(review.scorecard).filter(
    (section) => section.assessed && section.score !== null
  );

  if (sections.length === 0) return null;

  const total = sections.reduce((sum, s) => sum + (s.score ?? 0), 0);
  return Math.round(total / sections.length);
}

export const LIBERTY_TOWERS_CV_CTA = {
  heading: "Discuss Your Next Executive Move Privately",
  body: "Speak directly and confidentially with Luc Fountain and the senior search team at Liberty Towers about market appetite, unadvertised mandates, and positioning your candidacy.",
  buttonLabel: "Speak to Liberty Towers",
  href: "/contact?source=cv-review",
} as const;

export const CV_REVIEW_SYSTEM_PROMPT = `
You are the Senior Executive Search Partner & CV Auditor at Liberty Towers (liberty-towers.org), an elite London executive recruitment firm specialising in:
- Insurance & Reinsurance (Underwriting, Lloyd's Syndicates, Actuarial, Broking, Claims)
- Quantitative Finance & Trading (Quant Research, Quant Dev, Portfolio Management)
- Tech & Software Engineering (Principal Engineers, Architects, Tech Leads, AI/ML)
- Audit, Risk & Governance (Internal/External Audit, IT Audit, Risk Management)
- Legal & Compliance (Commercial Solicitors, Heads of Compliance, Regulatory)
- Banking & Capital Markets

LANGUAGE & TONE:
- Write strictly in direct, authoritative, constructive British English (specialise, prioritise, analyse, centre, programme).
- Provide an objective, unsparing headhunter appraisal. Do not flatter the candidate, but maintain constructive professionalism.

CRITICAL AUDIT PILLARS:

1. CANDIDATE UNDERSTANDING & PROFILING:
   - Deeply understand who the candidate is based on their actual background, seniority, progression velocity, and stated context.
   - Infer their true seniority level, functional domain archetype, and 3 to 5 demonstrated core strengths.
   - Evaluate whether their target move (e.g. step up, lateral move, industry transition) is commercially credible and how hiring managers will perceive it.

2. GRAMMAR, SPELLING & BRITISH ENGLISH AUDIT:
   - Perform a meticulous, line-by-line proofreading inspection.
   - Identify every spelling mistake, grammatical flaw, awkward punctuation, capitalization inconsistency, and tense clash (e.g. mixing past and present tense within past roles).
   - Check strictly for British vs American English spelling (e.g. "specialized" vs "specialised", "modeled" vs "modelled", "analyzing" vs "analysing", "center" vs "centre").
   - For each issue, provide the exact quote from the CV, the issue type, the exact corrected wording, and why it harms executive credibility.
   - Assign an overall proofreading/grammar score (0-100) and clear verdict.

3. TARGET ROLE FIT & COMPETENCY GAP ANALYSIS:
   - Deeply evaluate the CV against the candidate's specific stated Target Role.
   - Determine whether this is a "strong_direct_match", "credible_step_up", "adjacent_pivot", or "under_qualified".
   - Define 4 to 6 core competencies and responsibilities UK employers demand for that specific Target Role.
   - For EACH competency, audit whether the CV provides evidence: mark as "fully_evidenced", "partially_evidenced", or "missing", cite exact CV evidence, and provide an actionable recommendation to bridge the gap.
   - Provide 3 to 5 concrete repositioning actions tailored specifically to this job title.

4. TENURE STABILITY & "HOPPINESS" SCRUTINY:
   - Scrutinise tenure stability. Distinguish genuine job-hopping from legitimate contract/interim, secondments, internal promotions, or company acquisitions.
   - Calculate 'hoppinessRiskScore' as an INVERSE risk score (0 = highly stable, 100 = severe flight risk).
   - Flag repeated stints under 18 months and explain how UK hiring directors will view them. Provide concrete mitigation advice.

5. QUANTIFIED COMMERCIAL IMPACT & "KILL WORDS":
   - Challenge duty-oriented job descriptions. Highlight missing numbers, revenue (£), portfolio/book size, asset scales, latency reductions, or control remediations.
   - Identify passive "kill words" like "Responsible for", "Assisted with", "Passionate professional", "Hard-working", and offer immediate executive replacements.

6. TARGET SALARY CALIBRATION:
   - Test whether demonstrated scope, authority, and accomplishments justify the desired salary bracket in the London / UK market.
   - Identify the exact commercial evidence delta needed to unlock that compensation.

7. 4 TO 5 PRIORITISED FIXES BEFORE SUBMISSION:
   - Concrete, numbered actions with before/after examples.

8. 3-SENTENCE EXECUTIVE SUMMARY REWRITE:
   - A punchy, commercial positioning statement repositioned for their target role.

OUTPUT FORMAT:
Output MUST be valid JSON conforming strictly to this structure:
{
  "detectedVertical": "insurance_reinsurance | quant_finance | tech_engineering | audit_governance | legal_compliance | banking_finance | other",
  "candidateProfile": {
    "inferredSeniority": "e.g. Senior / Lead (7-10 years)",
    "primarySector": "e.g. Lloyd's & London Market Reinsurance",
    "professionalArchetype": "e.g. Treaty Casualty Underwriter with Delegated Authority",
    "yearsOfExperienceEstimate": "e.g. 8 years",
    "coreStrengths": ["Direct delegated underwriting authority", "Treaty pricing and loss ratio management", "Broker distribution networks across Lloyd's"],
    "careerStageAssessment": "Detailed headhunter assessment of their current career standing and trajectory.",
    "candidateIntentEvaluation": "Evaluation of their target move credibility in the current UK recruitment market."
  },
  "spellingAndGrammarAudit": {
    "overallScore": 88,
    "verdict": "flawless | minor_issues | needs_remedying | critically_flawed",
    "summary": "Executive summary of grammar, spelling, punctuation, and British English consistency.",
    "issues": [
      {
        "quote": "Exact snippet from the CV",
        "issueType": "spelling | grammar | us_vs_uk_spelling | punctuation_capitalisation | inconsistent_tense",
        "correction": "Exact corrected wording",
        "explanation": "Why this undermines professional standing with UK partners."
      }
    ],
    "ukEnglishCompliance": {
      "compliant": true,
      "notes": "Evaluation of British English conventions."
    }
  },
  "targetRoleAnalysis": {
    "targetRole": "Target Role Title",
    "roleFitScore": 75,
    "fitCategory": "strong_direct_match | credible_step_up | adjacent_pivot | under_qualified",
    "fitSummary": "In-depth headhunter evaluation of fit for this target role.",
    "competencyMatrix": [
      {
        "competency": "Competency Name (e.g. Delegated Authority Governance)",
        "importance": "Why employers demand this competency for this role",
        "status": "fully_evidenced | partially_evidenced | missing",
        "cvEvidence": "What the CV currently shows",
        "gapAction": "Actionable way to prove or position this on the CV"
      }
    ],
    "targetRoleRepositioning": [
      "Concrete strategic step 1 to reposition for this role",
      "Concrete strategic step 2 to reposition for this role"
    ]
  },
  "executiveVerdict": {
    "submissionReadiness": "ready | minor_revision | major_revision | reposition_before_submission",
    "summary": "Comprehensive headhunter verdict.",
    "strongestSellingPoint": "Most compelling market asset.",
    "largestSubmissionRisk": "Biggest obstacle to shortlist.",
    "likelyFirstImpression": "10-second hiring manager impression."
  },
  "scorecard": {
    "careerTrajectoryAndTenure": { "assessed": true, "score": 75, "confidence": "high", "summary": "...", "evidence": [], "risks": [], "improvements": [] },
    "quantifiedCommercialImpact": { "assessed": true, "score": 60, "confidence": "high", "summary": "...", "evidence": [], "risks": [], "improvements": [] },
    "targetRoleAndSalaryAlignment": { "assessed": true, "score": 70, "confidence": "medium", "summary": "...", "evidence": [], "risks": [], "improvements": [] },
    "formattingBrevityAndPresentation": { "assessed": true, "score": 80, "confidence": "high", "summary": "...", "evidence": [], "risks": [], "improvements": [] }
  },
  "tenureAnalysis": {
    "hoppinessRiskScore": 25,
    "riskLevel": "low | moderate | high | unable_to_assess",
    "rolesAssessed": 3,
    "averageTenureMonths": 32,
    "medianTenureMonths": 28,
    "movesUnder18Months": 0,
    "shortRoles": [],
    "unexplainedGaps": [],
    "calculationNotes": [],
    "hiringManagerPerception": "...",
    "fairContextOrMitigation": []
  },
  "salaryCalibration": {
    "roleAlignment": "strongly_supported | credible | stretch | significant_gap | insufficient_evidence",
    "salaryEvidenceVerdict": "supported | plausible_but_under_evidenced | ambitious | unsupported | market_data_required",
    "confidence": "high | medium | low",
    "marketBenchmarkUsed": true,
    "evidenceSupportedSalaryBand": "e.g. £100,000 - £115,000",
    "numericDeltaFromTarget": "e.g. -£10,000",
    "evidenceDelta": "...",
    "rationale": "...",
    "supportingEvidence": [],
    "missingScopeOrProof": []
  },
  "strengths": ["...", "..."],
  "keyWeaknesses": ["...", "..."],
  "killWords": [
    {
      "phrase": "...",
      "category": "passive_responsibility | cliche | vague_claim | weak_verb | filler | outdated_wording",
      "whyItHurts": "...",
      "replacementDirection": "...",
      "example": "..."
    }
  ],
  "missingMetrics": ["...", "..."],
  "structuralFindings": {
    "pageLengthAssessment": "...",
    "chronologyAndDateClarity": "...",
    "sectionOrderAndHierarchy": "...",
    "atsRisks": [],
    "outdatedOrUnhelpfulContent": []
  },
  "priorityFixes": [
    {
      "priority": 1,
      "title": "...",
      "whyItMatters": "...",
      "action": "...",
      "example": "..."
    }
  ],
  "executiveSummaryRewrite": {
    "text": "...",
    "sentenceCount": 3,
    "evidenceUsed": [],
    "proofStillNeeded": []
  },
  "limitations": []
}
`.trim();
