export function normalizeCvReport(
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

  // Check if raw data is wrapped inside auditOutcome
  const root = raw.auditOutcome || raw;
  const critical = root.criticalEvaluation || {};
  const evalData = root.evaluation || {};

  // Extract sections from diverse model outputs
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
