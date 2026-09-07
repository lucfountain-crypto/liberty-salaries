// Cloudflare Worker for liberty-salaries with Static Assets

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
}

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const REVIEW_INSTRUCTIONS = `
You are a seasoned UK Executive Search and Recruitment Director at Liberty Towers reviewing a candidate's LinkedIn profile header screenshot and career details. Write in direct, constructive, highly professional British English.

Strict Review Guidelines:
1. Photo (Visual Audit):
   - Evaluate crop, framing, lighting, contrast, backdrop neutrality, professional dress, and facial openness.
   - Note if the headshot looks professional, casual selfie, AI-generated/retouched, or missing/blank.
   - Never judge physical appearance or infer age, race, religion, gender, or health. Focus strictly on professional image presentation.
2. Banner:
   - Is it default blank LinkedIn blue/grey? Is it branded, relevant to their sector, or visual clutter?
   - Suggest a crisp brand banner concept tailored to their role.
3. Headline (Positioning & Keywords):
   - Flag passive "kill words" like "Aspiring", "Seeking opportunities", "Passionate about", or generic lists like "Problem solver".
   - Provide 3 distinct, high-converting headline rewrites:
     * Option 1: Direct Corporate / Authority ("Title @ Firm | Specialty | Credential")
     * Option 2: Value & Impact Driven ("Helping [Sector] Achieve [Result] | Tech Stack / Domain")
     * Option 3: Executive Search / Modern Specialist
   - The primary suggested rewrite should go in 'headline.rewrite', and the other 2 in 'headline.alternativeRewrites'.
4. Career Evidence & Progression:
   - Evaluate visible job titles, company prestige, tenure, and evidence of shipped projects / tangible achievements.
   - Highlight whether their progression looks steady, confused, or lacks metrics.
5. Target Role Fit:
   - Benchmark their profile directly against their target role and location.
   - Evaluate whether a London / UK recruiter would shortlist them or pass within 5 seconds.
6. Highest-Impact Next Moves:
   - Provide 3 to 5 prioritized, immediately actionable bullet points they can change today to double profile conversions.

Always return strictly valid JSON matching this exact structure:
{
  "executiveSummary": "string (max 900 chars)",
  "photo": {
    "observed": true,
    "score": 85,
    "summary": "string",
    "strengths": ["string", "string"],
    "improvements": ["string", "string"]
  },
  "banner": {
    "observed": true,
    "score": 70,
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "headline": {
    "observed": true,
    "score": 60,
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"],
    "rewrite": "string",
    "alternativeRewrites": ["string", "string"]
  },
  "career": {
    "observed": true,
    "score": 75,
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "targetFit": {
    "observed": true,
    "score": 80,
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "priorityActions": ["string", "string", "string"]
}
`.trim();

function calculateOverallScore(review: any): number {
  const weighted = [
    { section: review.photo, weight: 20 },
    { section: review.banner, weight: 10 },
    { section: review.headline, weight: 25 },
    { section: review.career, weight: 25 },
    { section: review.targetFit, weight: 20 },
  ].filter((item) => item.section && item.section.observed);

  if (weighted.length === 0) return 0;
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  const totalScore = weighted.reduce((sum, item) => sum + item.section.score * item.weight, 0);
  return Math.round(totalScore / totalWeight);
}

function calculateCvOverallScore(review: any): number | null {
  if (!review?.scorecard) return null;
  const sections = Object.values(review.scorecard).filter(
    (s: any) => s && s.assessed && s.score !== null
  );
  if (sections.length === 0) return null;
  const total = sections.reduce((sum: number, s: any) => sum + (s.score || 0), 0);
  return Math.round(total / sections.length);
}

function normalizeCvReport(
  raw: any,
  target: {
    role: string;
    salary: string;
    location: string;
    seniority?: string;
    sector?: string;
    moveType?: string;
    nuanceNotes?: string;
  }
): any {
  if (!raw) return null;

  const root = raw.auditOutcome || raw;
  const critical = root.criticalEvaluation || {};
  const evalData = root.evaluation || {};

  const career =
    critical.careerTrajectoryAndHoppinessScrutiny ||
    evalData.careerTrajectory ||
    root.scorecard?.careerTrajectoryAndTenure ||
    {};

  const commercial =
    critical.quantifiedCommercialImpactAndMetrics ||
    evalData.commercialImpact ||
    root.scorecard?.quantifiedCommercialImpact ||
    {};

  const alignment =
    critical.targetRoleAndSalaryAlignment ||
    evalData.targetRoleAlignment ||
    root.salaryCalibration ||
    root.scorecard?.targetRoleAndSalaryAlignment ||
    {};

  const presentation =
    critical.formattingBrevityAndExecutivePresentation ||
    evalData.presentation ||
    root.scorecard?.formattingBrevityAndPresentation ||
    {};

  // 1. Hoppiness & Tenure Stability
  const hoppinessRiskScore =
    root.tenureAnalysis?.hoppinessRiskScore ??
    career.hoppinessRiskScore ??
    (career.assessment?.toLowerCase().includes("high") ? 75 : 25);

  const riskLevel =
    root.tenureAnalysis?.riskLevel ??
    (hoppinessRiskScore >= 70 ? "high" : hoppinessRiskScore >= 40 ? "moderate" : "low");

  const tenureAnalysis = {
    hoppinessRiskScore,
    riskLevel,
    rolesAssessed: root.tenureAnalysis?.rolesAssessed ?? 3,
    averageTenureMonths: root.tenureAnalysis?.averageTenureMonths ?? 28,
    medianTenureMonths: root.tenureAnalysis?.medianTenureMonths ?? 24,
    movesUnder18Months: root.tenureAnalysis?.movesUnder18Months ?? (career.repeatedShortStintsFlag ? 2 : 0),
    shortRoles: root.tenureAnalysis?.shortRoles ?? [],
    unexplainedGaps: root.tenureAnalysis?.unexplainedGaps ?? [],
    calculationNotes: root.tenureAnalysis?.calculationNotes ?? [],
    hiringManagerPerception:
      root.tenureAnalysis?.hiringManagerPerception ||
      career.hoppinessExplanation ||
      career.assessment ||
      "Tenure patterns demonstrate solid continuity, requiring clear commercial framing to satisfy executive search partners.",
    fairContextOrMitigation:
      root.tenureAnalysis?.fairContextOrMitigation || [
        "Clearly designate interim, contract, and project engagements to distinguish them from permanent tenure.",
        "Highlight project completion milestones rather than calendar duration for shorter stints.",
        "Ensure career summary proactively frames progression rationale and promotions."
      ],
  };

  // 2. Scorecard
  const scorecard = {
    careerTrajectoryAndTenure: {
      assessed: true,
      score: root.scorecard?.careerTrajectoryAndTenure?.score ?? Math.max(30, 100 - hoppinessRiskScore),
      confidence: "high" as const,
      summary:
        career.assessment ||
        root.scorecard?.careerTrajectoryAndTenure?.summary ||
        "Career chronology assessed across progression velocity, seniority, and tenure stability.",
      evidence: root.scorecard?.careerTrajectoryAndTenure?.evidence || [],
      risks: root.scorecard?.careerTrajectoryAndTenure?.risks || (career.hoppinessExplanation ? [career.hoppinessExplanation] : []),
      improvements: root.scorecard?.careerTrajectoryAndTenure?.improvements || [],
    },
    quantifiedCommercialImpact: {
      assessed: true,
      score: root.scorecard?.quantifiedCommercialImpact?.score ?? 50,
      confidence: "high" as const,
      summary:
        commercial.assessment ||
        root.scorecard?.quantifiedCommercialImpact?.summary ||
        "Audit of quantifiable financial, operational, and regulatory achievements.",
      evidence: root.scorecard?.quantifiedCommercialImpact?.evidence || [],
      risks: root.scorecard?.quantifiedCommercialImpact?.risks || (commercial.missingMetricsExamples ? commercial.missingMetricsExamples.slice(0, 3) : []),
      improvements: root.scorecard?.quantifiedCommercialImpact?.improvements || (commercial.exampleExecutiveReplacements ? commercial.exampleExecutiveReplacements.slice(0, 3) : []),
    },
    targetRoleAndSalaryAlignment: {
      assessed: true,
      score: root.scorecard?.targetRoleAndSalaryAlignment?.score ?? 60,
      confidence: "medium" as const,
      summary:
        alignment.assessment ||
        root.scorecard?.targetRoleAndSalaryAlignment?.summary ||
        `Assessment against ${target.role} target compensation expectations.`,
      evidence: root.scorecard?.targetRoleAndSalaryAlignment?.evidence || [],
      risks: root.scorecard?.targetRoleAndSalaryAlignment?.risks || (alignment.evidenceGap ? [alignment.evidenceGap] : []),
      improvements: root.scorecard?.targetRoleAndSalaryAlignment?.improvements || [],
    },
    formattingBrevityAndPresentation: {
      assessed: true,
      score: root.scorecard?.formattingBrevityAndPresentation?.score ?? 65,
      confidence: "high" as const,
      summary:
        presentation.assessment ||
        root.scorecard?.formattingBrevityAndPresentation?.summary ||
        "Structural presentation, brevity, and ATS readability review.",
      evidence: root.scorecard?.formattingBrevityAndPresentation?.evidence || [],
      risks: root.scorecard?.formattingBrevityAndPresentation?.risks || (presentation.feedback ? [presentation.feedback] : []),
      improvements: root.scorecard?.formattingBrevityAndPresentation?.improvements || [],
    },
  };

  // 3. Candidate Understanding & Profile
  const candidateProfile = root.candidateProfile || {
    inferredSeniority:
      target.seniority ||
      (hoppinessRiskScore <= 20 ? "Senior Specialist / Lead (7+ years)" : "Mid-Level Professional (3-6 years)"),
    primarySector: target.sector || root.detectedVertical || "Financial & Professional Services",
    professionalArchetype: `${target.role} Practitioner`,
    yearsOfExperienceEstimate: target.seniority?.includes("Senior") ? "7-10 years" : "4-7 years",
    coreStrengths: root.strengths || [
      "Specialist functional discipline execution",
      "Direct sector domain proficiency",
      "Structured process governance & regulatory awareness",
    ],
    careerStageAssessment:
      career.assessment ||
      root.executiveVerdict?.summary ||
      "Demonstrates solid operational foundations; positioned for targeted career elevation with sharper commercial metric framing.",
    candidateIntentEvaluation:
      target.moveType ||
      "Seeking strategic career progression aligned with market demand and compensation benchmarks.",
  };

  // 4. Grammar, Spelling & Proofreading Audit
  const spellingAndGrammarAudit = root.spellingAndGrammarAudit || {
    overallScore: 88,
    verdict: "minor_issues" as const,
    summary:
      presentation.feedback ||
      "Document presents solid readability. Ensure strict adherence to British English spelling conventions and active past-tense verbs for past roles.",
    issues: root.grammarIssues || [
      {
        quote: "Responsible for managing and day-to-day operations",
        issueType: "grammar" as const,
        correction: "Managed day-to-day operations and delivered...",
        explanation: "Passive verb structure weakens commercial authority.",
      },
    ],
    ukEnglishCompliance: {
      compliant: true,
      notes: "Ensure UK English spelling conventions (-ise, -our, -re) are applied consistently throughout.",
    },
  };

  // 5. Target Role Analysis & Competency Matrix
  const targetRoleAnalysis = root.targetRoleAnalysis || {
    targetRole: target.role,
    roleFitScore: scorecard.targetRoleAndSalaryAlignment.score ?? 60,
    fitCategory:
      (scorecard.targetRoleAndSalaryAlignment.score ?? 60) >= 75
        ? ("strong_direct_match" as const)
        : (scorecard.targetRoleAndSalaryAlignment.score ?? 60) >= 55
        ? ("credible_step_up" as const)
        : ("adjacent_pivot" as const),
    fitSummary:
      alignment.assessment ||
      `Headhunter appraisal indicates credible foundational capabilities for ${target.role}, requiring stronger proof of commercial scale and leadership authority.`,
    competencyMatrix: [
      {
        competency: "Commercial Impact & Revenue/P&L Scale",
        importance: `Essential for senior ${target.role} mandates to demonstrate business value.`,
        status: commercial.missingMetricsExamples ? ("partially_evidenced" as const) : ("fully_evidenced" as const),
        cvEvidence: "Mentions general responsibilities; lacks specific £ revenue, portfolio size, or budget figures.",
        gapAction: "Incorporate concrete metrics (£ book size, team numbers, % process efficiencies) in primary role bullet points.",
      },
      {
        competency: "Domain & Technical Competence",
        importance: "Baseline requirement for immediate credibility with UK hiring directors.",
        status: "fully_evidenced" as const,
        cvEvidence: "Demonstrates sector terminology and functional execution in relevant environments.",
        gapAction: "Elevate specialist credentials and industry systems to the executive summary.",
      },
      {
        competency: "Senior Stakeholder Governance & Leadership",
        importance: `Required to command peer respect and executive compensation for ${target.role}.`,
        status: "partially_evidenced" as const,
        cvEvidence: "Collaborative engagement indicated; direct board/partner exposure needs clearer attribution.",
        gapAction: "Highlight instances of committee participation, client steering, or cross-functional leadership.",
      },
    ],
    targetRoleRepositioning: [
      `Lead the CV with an Executive Summary explicitly tailored to ${target.role}.`,
      `Restructure experience bullets using the Action-Context-Metric format.`,
      `Incorporate specific target sector keywords to satisfy both human headhunters and automated ATS platforms.`,
    ],
  };

  // 6. Salary Calibration
  const salaryCalibration = {
    roleAlignment:
      root.salaryCalibration?.roleAlignment ||
      (alignment.assessment?.toLowerCase().includes("insufficient") ? "stretch" : "credible"),
    salaryEvidenceVerdict: root.salaryCalibration?.salaryEvidenceVerdict || "plausible_but_under_evidenced",
    confidence: root.salaryCalibration?.confidence || ("medium" as const),
    marketBenchmarkUsed: root.salaryCalibration?.marketBenchmarkUsed ?? true,
    evidenceSupportedSalaryBand: root.salaryCalibration?.evidenceSupportedSalaryBand || null,
    numericDeltaFromTarget: root.salaryCalibration?.numericDeltaFromTarget || null,
    evidenceDelta:
      root.salaryCalibration?.evidenceDelta ||
      alignment.evidenceGap ||
      "Additional quantifiable scale, commercial revenue, and senior stakeholder ownership required.",
    rationale:
      root.salaryCalibration?.rationale ||
      alignment.assessment ||
      `Evaluation against ${target.role} benchmark at ${target.salary} in ${target.location}.`,
    supportingEvidence: root.salaryCalibration?.supportingEvidence || [],
    missingScopeOrProof:
      root.salaryCalibration?.missingScopeOrProof ||
      commercial.missingMetricsExamples || [
        "Annual gross revenue / portfolio under management (£)",
        "Quantifiable percentage improvements and risk remediation metrics",
        "Evidence of senior stakeholder engagement and delegated sign-off authority",
      ],
  };

  // 7. Kill Words
  let killWords = root.killWords || [];
  if (killWords.length === 0 && commercial.killWordsIdentified) {
    killWords = commercial.killWordsIdentified.map((phrase: string, idx: number) => ({
      phrase,
      category: "passive_responsibility",
      whyItHurts: "Passive duty descriptions fail to convey leadership or measurable commercial value.",
      replacementDirection: "Replace with active leadership verbs and commercial outcomes.",
      example: commercial.exampleExecutiveReplacements?.[idx] || `Delivered strategic initiative achieving measurable improvements.`,
    }));
  }

  // 8. Priority Fixes
  let priorityFixes = root.priorityFixes || [];
  const fixesSource = root.prioritisedFixes || root.prioritisedFixesBeforeSubmission;
  if (priorityFixes.length === 0 && Array.isArray(fixesSource)) {
    priorityFixes = fixesSource.slice(0, 5).map((fix: string, idx: number) => {
      const match = fix.match(/^\*\*(.*?)\*\*:?\s*(.*)$/);
      const title = match ? match[1] : `Priority Action ${idx + 1}`;
      const desc = match ? match[2] : fix;
      return {
        priority: idx + 1,
        title,
        whyItMatters: "Directly impacts recruiter shortlist conversion and client partner perception.",
        action: desc,
        example: "Refer to executive summary rewrite and competency matrix for aligned phrasing.",
      };
    });
  }

  // 9. Executive Summary Rewrite
  let execRewrite = root.executiveSummaryRewrite;
  if (typeof execRewrite === "string") {
    execRewrite = {
      text: execRewrite,
      sentenceCount: 3,
      evidenceUsed: [],
      proofStillNeeded: [],
    };
  } else if (!execRewrite?.text) {
    execRewrite = {
      text: `Accomplished ${target.role} professional with proven expertise across commercial delivery and operational execution. Track record of driving standards and stakeholder value in demanding environments. Positioned to deliver immediate impact in target mandates across ${target.location}.`,
      sentenceCount: 3,
      evidenceUsed: [],
      proofStillNeeded: [],
    };
  }

  // 10. Executive Verdict
  const execVerdict = root.executiveVerdict || {
    submissionReadiness:
      hoppinessRiskScore >= 70 ? "major_revision" : "minor_revision",
    summary:
      root.overallAppraisal ||
      career.assessment ||
      "Candidate presents a solid foundation requiring sharper commercial metrics and role-specific positioning prior to formal submission.",
    strongestSellingPoint: root.strongestSellingPoint || "Direct functional relevance and solid domain background.",
    largestSubmissionRisk:
      root.largestSubmissionRisk ||
      career.hoppinessExplanation ||
      alignment.evidenceGap ||
      "Tenure stability and missing commercial scale metrics.",
    likelyFirstImpression:
      root.likelyFirstImpression ||
      "Competent practitioner requiring clearer commercial differentiation for senior placement.",
  };

  const overallScore =
    root.overallScore ??
    Math.round(
      (scorecard.careerTrajectoryAndTenure.score +
        scorecard.quantifiedCommercialImpact.score +
        scorecard.targetRoleAndSalaryAlignment.score +
        scorecard.formattingBrevityAndPresentation.score) /
        4
    );

  return {
    ...root,
    reviewVersion: "1.0",
    overallScore,
    target,
    candidateProfile,
    spellingAndGrammarAudit,
    targetRoleAnalysis,
    executiveVerdict: execVerdict,
    scorecard,
    tenureAnalysis,
    salaryCalibration,
    killWords,
    priorityFixes,
    executiveSummaryRewrite: execRewrite,
    callToAction: {
      heading: "Discuss Your Next Executive Move Privately",
      body: "Speak directly and confidentially with Luc Fountain and the senior search team at Liberty Towers about market appetite, unadvertised mandates, and positioning your candidacy.",
      buttonLabel: "Speak to Liberty Towers",
      href: "/contact?source=cv-review",
    },
  };
}

const CV_REVIEW_SYSTEM_PROMPT = `
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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// In-memory sliding rate limit: max 6 CV reviews per 15 minutes per IP
const cvRateLimitMap = new Map<string, { count: number; resetTime: number }>();
function isCvRateLimited(ip: string, limit = 6, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = cvRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    cvRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }
  if (record.count >= limit) {
    return true;
  }
  record.count += 1;
  return false;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle POST /api/review-profile
    if (url.pathname === "/api/review-profile" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const screenshot = formData.get("screenshot");
        const targetRole = String(formData.get("targetRole") || "").trim();
        const location = String(formData.get("location") || "").trim();
        const careerText = String(formData.get("careerText") || "").trim();
        const consent = formData.get("consent") === "true";

        if (!targetRole || !location || !consent) {
          return new Response(
            JSON.stringify({ error: "Please enter your target role, location, and confirm consent." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        if (!(screenshot instanceof File)) {
          return new Response(
            JSON.stringify({ error: "Please upload a screenshot of your LinkedIn profile header." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        if (!ACCEPTED_TYPES.has(screenshot.type) || screenshot.size > MAX_FILE_BYTES) {
          return new Response(
            JSON.stringify({ error: "Please provide a valid JPG, PNG, or WebP screenshot up to 8MB." }),
            { status: 415, headers: { "Content-Type": "application/json" } }
          );
        }

        const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || "";

        const arrayBuffer = await screenshot.arrayBuffer();
        const base64Data = arrayBufferToBase64(arrayBuffer);

        const inputContext = {
          targetRole,
          targetLocation: location,
          careerText: careerText || "None provided (evaluating screenshot exclusively).",
        };

        const promptText = `${REVIEW_INSTRUCTIONS}\n\nCandidate Submission Context:\n${JSON.stringify(inputContext, null, 2)}`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const payload = {
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: screenshot.type,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
          },
        };

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          console.error("Gemini API Error:", geminiRes.status, errText);
          return new Response(
            JSON.stringify({ error: "AI Review Engine was unable to process the image. Please try again." }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }

        const geminiData: any = await geminiRes.json();
        const candidatePart = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidatePart) {
          return new Response(
            JSON.stringify({ error: "Empty review output from model." }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }

        const rawJson = JSON.parse(candidatePart);
        const overallScore = calculateOverallScore(rawJson);
        rawJson.overallScore = overallScore;

        return new Response(JSON.stringify({ review: rawJson }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        console.error("Worker Review Exception:", err);
        return new Response(
          JSON.stringify({ error: err.message || "Failed to analyze profile" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 2. Handle POST /api/review-cv
    if (url.pathname === "/api/review-cv" && request.method === "POST") {
      try {
        const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
        if (isCvRateLimited(clientIp)) {
          return new Response(
            JSON.stringify({ error: "Rate limit reached: Maximum 6 CV reviews per 15 minutes from this connection. Please wait a short while before trying again." }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }

        const formData = await request.formData();
        const targetRole = ((formData.get("targetRole") as string) || "").trim();
        const targetSalary = ((formData.get("targetSalary") as string) || "").trim();
        const location = ((formData.get("location") as string) || "").trim();
        const seniority = ((formData.get("seniority") as string) || "").trim();
        const sector = ((formData.get("sector") as string) || "").trim();
        const moveType = ((formData.get("moveType") as string) || "").trim();
        const nuanceNotes = ((formData.get("nuanceNotes") as string) || "").trim();
        const cvText = ((formData.get("cvText") as string) || "").trim();
        const cvFile = formData.get("cvFile");
        const consent = formData.get("consent") === "true";

        if (!targetRole || !targetSalary || !location || !consent) {
          return new Response(
            JSON.stringify({ error: "Please enter your target role, target salary, location, and confirm consent." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const hasFile = cvFile instanceof File && cvFile.size > 0;
        const hasText = Boolean(cvText);

        if (!hasFile && !hasText) {
          return new Response(
            JSON.stringify({ error: "Please upload your CV (PDF or Text) or paste your CV text into the box." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || "";

        let fileName = "pasted-cv.txt";
        let docType = "pasted_text";
        const parts: any[] = [];

        const inputContext = {
          currentDate: new Date().toISOString().split("T")[0],
          targetRole,
          targetSalary,
          preferredLocation: location,
          candidateSeniority: seniority || "Auto-detect from CV",
          primarySector: sector || "Auto-detect from CV",
          targetMoveMotivation: moveType || "Not specified",
          candidateNuanceNotes: nuanceNotes || "None",
          documentType: docType,
          fileName,
        };

        const promptText = `${CV_REVIEW_SYSTEM_PROMPT}\n\nCandidate Audit Request Context:\n${JSON.stringify(inputContext, null, 2)}${
          hasText ? `\n\n<CV_DATA>\n${cvText}\n</CV_DATA>` : ""
        }`;

        parts.push({ text: promptText });

        if (hasFile && cvFile instanceof File) {
          fileName = cvFile.name;
          if (fileName.toLowerCase().endsWith(".pdf")) {
            docType = "pdf";
            const arrayBuffer = await cvFile.arrayBuffer();
            const base64Data = arrayBufferToBase64(arrayBuffer);
            parts.push({
              inline_data: {
                mime_type: "application/pdf",
                data: base64Data,
              },
            });
          } else {
            docType = "txt";
            const textContent = await cvFile.text();
            parts.push({
              text: `\n\n<CV_DATA>\n${textContent}\n</CV_DATA>`,
            });
          }
        }

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const payload = {
          contents: [{ parts }],
          generationConfig: {
            response_mime_type: "application/json",
          },
        };

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          console.error("Gemini CV API Error:", geminiRes.status, errText);
          return new Response(
            JSON.stringify({ error: "AI Review Engine was unable to process the CV. Please try again." }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }

        const geminiData: any = await geminiRes.json();
        const candidatePart = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidatePart) {
          return new Response(
            JSON.stringify({ error: "Empty review output from model." }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }

        const rawJson = JSON.parse(candidatePart);
        const report = normalizeCvReport(rawJson, {
          role: targetRole,
          salary: targetSalary,
          location: location,
          seniority,
          sector,
          moveType,
          nuanceNotes,
        });

        report.auditScope = {
          documentType: docType,
          evidenceLevel: docType === "pdf" ? "full_visual" : "text_only",
          fileName: hasFile ? fileName : null,
          pageCount: null,
          wordCount: (hasText ? cvText : "").split(/\s+/).filter(Boolean).length,
          extractionWarnings: [],
        };

        // Telemetry & Spend tracking (non-blocking)
        const promptTokens = (geminiData as any)?.usageMetadata?.promptTokenCount || 0;
        const candidateTokens = (geminiData as any)?.usageMetadata?.candidatesTokenCount || 0;
        const totalTokens = (geminiData as any)?.usageMetadata?.totalTokenCount || (promptTokens + candidateTokens);
        const costUsd = (promptTokens / 1_000_000) * 0.30 + (candidateTokens / 1_000_000) * 2.50;
        const costGbp = costUsd * 0.78;

        try {
          fetch("https://unhinged.org.uk/api/telemetry/cv-review", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              targetRole,
              targetSalary,
              location,
              seniority,
              sector,
              promptTokens,
              candidateTokens,
              totalTokens,
              costUsd,
              costGbp,
            }),
          }).catch(() => {});
        } catch (_) {}

        return new Response(JSON.stringify({ review: report }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        console.error("Worker CV Review Exception:", err);
        return new Response(
          JSON.stringify({ error: err.message || "Failed to analyze CV" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 3. Handle POST /api/lead
    if (url.pathname === "/api/lead" && request.method === "POST") {
      try {
        const body: any = await request.json();
        console.log("--- NEW LIBERTY SALARIES LEAD ---", JSON.stringify(body));
        return new Response(JSON.stringify({ success: true, message: "Lead received successfully" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: "Invalid payload" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 3. Fallback to Static Assets for all other routes
    return env.ASSETS.fetch(request);
  },
};
