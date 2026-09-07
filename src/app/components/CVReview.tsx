"use client";

import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CvReviewReport, ScoreSection, PriorityFix, KillWord } from "@/lib/cv-review";
import { normalizeCvReport } from "@/lib/cv-normalizer";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  MapPin,
  PoundSterling,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
  HelpCircle,
  BarChart3,
  FileCheck2,
  RefreshCw,
  SpellCheck,
  UserCheck,
  Compass,
  Target,
  Layers,
  BookOpen,
} from "lucide-react";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

type ApiResponse = { review?: CvReviewReport; error?: string };

const LOADING_STEPS = [
  "Extracting candidate background, domain & career trajectory...",
  "Auditing CV alignment against target role competencies...",
  "Inspecting grammar, spelling & British English conventions...",
  "Evaluating tenure stability & 'hoppiness' patterns...",
  "Calibrating commercial scope against target salary...",
  "Compiling prioritised fixes & executive summary rewrite...",
];

function ScorePill({ score, inverse = false }: { score: number | null; inverse?: boolean }) {
  if (score === null) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
        N/A
      </span>
    );
  }

  let tone = "bg-slate-100 text-slate-700 border-slate-200";

  if (!inverse) {
    tone =
      score >= 80
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : score >= 65
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : score >= 50
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";
  } else {
    // Inverse risk gauge (lower is safer/better)
    tone =
      score <= 25
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : score <= 50
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : score <= 70
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${tone}`}>
      {score}/100
    </span>
  );
}

function SectionCard({
  title,
  icon: Icon,
  section,
  children,
}: {
  title: string;
  icon: React.ElementType;
  section: ScoreSection;
  children?: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-slate-50 text-blue-900 border border-slate-100">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
            <span className="text-[11px] text-slate-500 capitalize">
              Confidence: {section.confidence}
            </span>
          </div>
        </div>
        <ScorePill score={section.score} />
      </div>

      <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-700">
        {section.summary}
      </p>

      {section.evidence && section.evidence.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Evidenced in CV:
          </span>
          <ul className="space-y-1 text-xs text-slate-600">
            {section.evidence.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.risks && section.risks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 block mb-1">
            Headhunter Flags:
          </span>
          <ul className="space-y-1 text-xs text-rose-700">
            {section.risks.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {children}
    </article>
  );
}

export default function CVReviewComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvInputMode, setCvInputMode] = useState<"upload" | "paste">("upload");
  const [pastedCvText, setPastedCvText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetSalary, setTargetSalary] = useState("");
  const [location, setLocation] = useState("");

  // Candidate Context Fields
  const [seniority, setSeniority] = useState("");
  const [sector, setSector] = useState("");
  const [moveType, setMoveType] = useState("");
  const [nuanceNotes, setNuanceNotes] = useState("");
  const [showAdvancedContext, setShowAdvancedContext] = useState(false);

  const [consent, setConsent] = useState(false);
  const [optInContact, setOptInContact] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<CvReviewReport | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  // Cycling loading steps
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (file.size > MAX_FILE_BYTES) {
      setError("File exceeds 10MB limit. Please upload a smaller PDF or text file.");
      return;
    }
    const name = file.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".txt") && !name.endsWith(".docx")) {
      setError("Please upload a PDF, DOCX, or TXT document.");
      return;
    }
    setSelectedFile(file);
  };

  const handleCopySummary = () => {
    if (!review?.executiveSummaryRewrite?.text) return;
    navigator.clipboard.writeText(review.executiveSummaryRewrite.text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (cvInputMode === "upload" && !selectedFile) {
      setError("Please select or drop your CV file (PDF recommended).");
      return;
    }

    if (cvInputMode === "paste" && !pastedCvText.trim()) {
      setError("Please paste your CV text into the area provided.");
      return;
    }

    if (!consent) {
      setError("Please confirm consent to process your CV for this review.");
      return;
    }

    try {
      setLoading(true);
      setLoadingStepIdx(0);

      const formData = new FormData();
      formData.set("targetRole", targetRole);
      formData.set("targetSalary", targetSalary);
      formData.set("location", location);
      if (seniority) formData.set("seniority", seniority);
      if (sector) formData.set("sector", sector);
      if (moveType) formData.set("moveType", moveType);
      if (nuanceNotes) formData.set("nuanceNotes", nuanceNotes);
      formData.set("consent", "true");

      if (cvInputMode === "upload" && selectedFile) {
        formData.set("cvFile", selectedFile);
      } else {
        formData.set("cvText", pastedCvText);
      }

      const res = await fetch("/api/review-cv", {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.review) {
        throw new Error(data.error || "Unable to complete CV review. Please try again.");
      }

      const normalized = normalizeCvReport(data.review, {
        role: targetRole,
        salary: targetSalary,
        location,
        seniority,
        sector,
        moveType,
        nuanceNotes,
      });

      setReview(normalized);

      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-900 selection:text-white font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/" className="bg-blue-900 px-3.5 py-2 rounded-xl shadow-sm flex items-center hover:bg-blue-800 transition">
              <img 
                src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png" 
                alt="Liberty Towers Logo" 
                className="h-7 sm:h-8 w-auto object-contain brightness-0 invert"
              />
            </a>
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <span className="text-xs font-bold tracking-wider text-blue-900 uppercase block">CV AUDIT & REVIEW</span>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <a href="/salaries" className="text-slate-600 hover:text-blue-900 transition">
              Salary Guides
            </a>
            <a href="/profile-review" className="text-slate-600 hover:text-blue-900 transition">
              LinkedIn Review
            </a>
            <a
              href="/contact"
              className="bg-blue-950 hover:bg-blue-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
            >
              Contact Advisory
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            AI Executive CV Audit & Calibration
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
            See What a Headhunter Sees in 30 Seconds
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            A comprehensive executive appraisal of your background: target role fit, spelling & grammar check, commercial metrics, and tenure stability before submission.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Confidential
            </span>
            <span className="flex items-center gap-1">
              <SpellCheck className="w-3.5 h-3.5 text-indigo-600" />
              Spelling & Grammar Check
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              Target Role Benchmarking
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Calibrated to London Search Standards
            </span>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Target Position Calibration */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-blue-950 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Calibrate Your Target Position & Career Context
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Job Title *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Senior Property Underwriter"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Salary Bracket *
                  </label>
                  <div className="relative">
                    <PoundSterling className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      value={targetSalary}
                      onChange={(e) => setTargetSalary(e.target.value)}
                      placeholder="e.g. £110,000 - £130,000"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. London (Hybrid) or City of London"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 text-slate-900 pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Candidate Understanding Expandable Section */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvancedContext(!showAdvancedContext)}
                  className="flex items-center justify-between w-full text-left py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-900" />
                    <span className="text-xs font-bold text-slate-800">
                      Candidate Context & Ambition (Helps Us Understand Your Profile Deeper)
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                      Recommended
                    </span>
                  </div>
                  {showAdvancedContext ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {showAdvancedContext && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Current Seniority Level
                        </label>
                        <select
                          value={seniority}
                          onChange={(e) => setSeniority(e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-blue-900 text-slate-900 px-3 py-2 rounded-xl text-xs focus:outline-none"
                        >
                          <option value="">Auto-detect from CV</option>
                          <option value="Junior / Associate (1-3 years)">Junior / Associate (1-3 yrs)</option>
                          <option value="Mid-Weight Professional (4-6 years)">Mid-Weight Professional (4-6 yrs)</option>
                          <option value="Senior Specialist / Lead (7-11 years)">Senior Specialist / Lead (7-11 yrs)</option>
                          <option value="Head of / Director (12-18 years)">Head of / Director (12-18 yrs)</option>
                          <option value="Partner / C-Suite / Executive (18+ years)">Partner / C-Suite / Exec (18+ yrs)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Primary Sector / Specialism
                        </label>
                        <select
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-blue-900 text-slate-900 px-3 py-2 rounded-xl text-xs focus:outline-none"
                        >
                          <option value="">Auto-detect from CV</option>
                          <option value="Insurance & Reinsurance">Insurance & Reinsurance (Lloyd&apos;s, Treaty, Actuarial)</option>
                          <option value="Quantitative Finance & Trading">Quant Finance & Trading (HFT, Alpha, Dev)</option>
                          <option value="Tech & Software Engineering">Tech & Software Engineering (Principal, AI/ML)</option>
                          <option value="Audit, Risk & Governance">Audit, Risk & Governance (Internal/IT Audit)</option>
                          <option value="Legal & Compliance">Legal & Compliance (In-House, FCA/PRA)</option>
                          <option value="Banking & Capital Markets">Banking & Capital Markets</option>
                          <option value="Other Corporate">Other Corporate / Professional Services</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          What kind of move are you seeking?
                        </label>
                        <select
                          value={moveType}
                          onChange={(e) => setMoveType(e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-blue-900 text-slate-900 px-3 py-2 rounded-xl text-xs focus:outline-none"
                        >
                          <option value="">Not specified</option>
                          <option value="Step-up in seniority and management authority">Step-up in seniority & management authority</option>
                          <option value="Lateral move into a tier-1 / market-leading firm">Lateral move into a tier-1 / market-leading firm</option>
                          <option value="Transitioning from practice/consulting to in-house">Transitioning from practice/consulting to in-house</option>
                          <option value="Maximising commercial compensation & bonus pool">Maximising commercial compensation & bonus pool</option>
                          <option value="Moving from contracting/interim to permanent">Moving from contracting/interim to permanent</option>
                          <option value="Relocation or flexible/remote arrangement">Relocation or flexible/remote arrangement</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Any specific career nuances or notes? (Optional)
                      </label>
                      <input
                        type="text"
                        value={nuanceNotes}
                        onChange={(e) => setNuanceNotes(e.target.value)}
                        placeholder="e.g. Recently completed Lloyd's ACII qualification; returning from parental leave; looking to transition from Big 4 to in-house."
                        className="w-full bg-white border border-slate-300 focus:border-blue-900 text-slate-900 px-3 py-2 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Upload or Paste CV */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-950 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Input Your CV
                  </h2>
                </div>

                {/* Toggle Upload vs Paste */}
                <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setCvInputMode("upload")}
                    className={`px-3 py-1 rounded-md transition ${
                      cvInputMode === "upload"
                        ? "bg-white text-slate-900 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Upload Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setCvInputMode("paste")}
                    className={`px-3 py-1 rounded-md transition ${
                      cvInputMode === "paste"
                        ? "bg-white text-slate-900 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Paste Text
                  </button>
                </div>
              </div>

              {cvInputMode === "upload" ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition ${
                    isDragOver
                      ? "border-blue-900 bg-blue-50/50"
                      : selectedFile
                      ? "border-emerald-300 bg-emerald-50/20"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.docx,application/pdf,text/plain"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-blue-950 mb-3">
                      <FileText className="w-6 h-6" />
                    </div>
                    {selectedFile ? (
                      <div>
                        <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for audit
                        </p>
                        <span className="inline-block mt-2 text-[11px] font-semibold text-blue-900 underline">
                          Click to choose another file
                        </span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          Drop your CV here, or <span className="text-blue-950 underline">browse</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          PDF recommended for full visual & layout audit (up to 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    rows={8}
                    value={pastedCvText}
                    onChange={(e) => setPastedCvText(e.target.value)}
                    placeholder="Paste the complete text of your CV here (Experience, Education, Key Achievements)..."
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 text-slate-900 p-3.5 rounded-xl text-xs sm:text-sm focus:outline-none transition font-mono leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tip: Uploading a PDF preserves formatting and visual layout analysis.
                  </p>
                </div>
              )}
            </div>

            {/* Consent & Disclaimers */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-950 focus:ring-blue-900"
                />
                <span>
                  I confirm this is my own CV and agree to transient AI evaluation. Liberty Towers
                  does not store, train on, or resell candidate documents.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={optInContact}
                  onChange={(e) => setOptInContact(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-950 focus:ring-blue-900"
                />
                <span>
                  (Optional) I would like a confidential conversation with Liberty Towers consultants
                  if relevant senior roles match my profile.
                </span>
              </label>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing CV...</span>
                </>
              ) : (
                <>
                  <span>Run Executive CV Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Loading Animation Card */}
          {loading && (
            <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center animate-pulse">
              <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-blue-900 border-t-transparent animate-spin" />
              <p className="text-sm font-bold text-slate-900">{LOADING_STEPS[loadingStepIdx]}</p>
              <p className="text-xs text-slate-500 mt-1">
                Applying London executive search standards across role alignment, spelling, grammar, and commercial metrics...
              </p>
            </div>
          )}
        </div>

        {/* Results Report View */}
        {review && (
          <div ref={reportRef} className="mt-12 space-y-8 animate-fadeIn">
            {/* Header / Submission Readiness Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                      Audit Target
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {review.target.role} • {review.target.salary} ({review.target.location})
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                    Executive Audit Report
                  </h2>
                </div>

                {/* Score Pill / Readiness Badge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Submission Score</div>
                    <div className="text-2xl font-black text-blue-950">
                      {review.overallScore ?? "N/A"}/100
                    </div>
                  </div>
                  <div
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                      review.executiveVerdict.submissionReadiness === "ready"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : review.executiveVerdict.submissionReadiness === "minor_revision"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : review.executiveVerdict.submissionReadiness === "major_revision"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {review.executiveVerdict.submissionReadiness.replace(/_/g, " ")}
                  </div>
                </div>
              </div>

              {/* Executive Summary Paragraph */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Headhunter Appraisal
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {review.executiveVerdict.summary}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-[11px] font-bold text-emerald-900 block mb-0.5">
                      Strongest Selling Point
                    </span>
                    <p className="text-xs text-emerald-800">
                      {review.executiveVerdict.strongestSellingPoint}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                    <span className="text-[11px] font-bold text-rose-900 block mb-0.5">
                      Primary Submission Risk
                    </span>
                    <p className="text-xs text-rose-800">
                      {review.executiveVerdict.largestSubmissionRisk}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW SECTION: Candidate Understanding & Profile Archetype */}
            {review.candidateProfile && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-950">
                      Candidate Profile & Background Understanding
                    </h3>
                    <p className="text-xs text-slate-500">
                      How recruitment partners and search directors understand your identity and career standing
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Inferred Seniority
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      {review.candidateProfile.inferredSeniority}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Primary Sector
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      {review.candidateProfile.primarySector}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Experience Band
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      {review.candidateProfile.yearsOfExperienceEstimate}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Domain Archetype
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-blue-950 block truncate" title={review.candidateProfile.professionalArchetype}>
                      {review.candidateProfile.professionalArchetype}
                    </span>
                  </div>
                </div>

                {review.candidateProfile.coreStrengths && review.candidateProfile.coreStrengths.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 mb-2">
                      Core Demonstrated Strengths Evidenced in CV:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {review.candidateProfile.coreStrengths.map((str, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 rounded-lg font-medium flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 block">
                      Career Stage Appraisal:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      {review.candidateProfile.careerStageAssessment}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-900 block">
                      Market Appetite for Stated Move:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      {review.candidateProfile.candidateIntentEvaluation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* NEW SECTION: Target Role Fit & Competency Benchmark Matrix */}
            {review.targetRoleAnalysis && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-950">
                        Analysis Against Target Role: {review.targetRoleAnalysis.targetRole}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Detailed benchmark against the exact skills and commercial scope employers expect
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Role Match</span>
                      <ScorePill score={review.targetRoleAnalysis.roleFitScore} />
                    </div>
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-xl border ${
                        review.targetRoleAnalysis.fitCategory === "strong_direct_match"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : review.targetRoleAnalysis.fitCategory === "credible_step_up"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : review.targetRoleAnalysis.fitCategory === "adjacent_pivot"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {review.targetRoleAnalysis.fitCategory.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                  {review.targetRoleAnalysis.fitSummary}
                </p>

                {/* Competency Benchmark Breakdown */}
                {review.targetRoleAnalysis.competencyMatrix && review.targetRoleAnalysis.competencyMatrix.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Core Role Requirements vs Your CV Evidence
                    </h4>
                    {review.targetRoleAnalysis.competencyMatrix.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                              {comp.competency}
                            </h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {comp.importance}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                              comp.status === "fully_evidenced"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : comp.status === "partially_evidenced"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {comp.status.replace(/_/g, " ")}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                          <div>
                            <span className="font-semibold text-slate-700 block mb-0.5">
                              CV Evidence Found:
                            </span>
                            <p className="text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                              {comp.cvEvidence}
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-blue-900 block mb-0.5">
                              Action to Solidify for this Role:
                            </span>
                            <p className="text-blue-950 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                              {comp.gapAction}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Target Role Repositioning Advice */}
                {review.targetRoleAnalysis.targetRoleRepositioning && review.targetRoleAnalysis.targetRoleRepositioning.length > 0 && (
                  <div className="mt-5 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-950 mb-2">
                      Strategic Repositioning Roadmap for {review.targetRoleAnalysis.targetRole}:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-blue-900 list-disc list-inside">
                      {review.targetRoleAnalysis.targetRoleRepositioning.map((step, idx) => (
                        <li key={idx} className="leading-snug">{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* NEW SECTION: Grammar, Spelling & British English Audit */}
            {review.spellingAndGrammarAudit && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center justify-center">
                      <SpellCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-950">
                        Spelling, Grammar & British English Audit
                      </h3>
                      <p className="text-xs text-slate-500">
                        Line-by-line inspection of proofreading, syntax, regional consistency, and executive polish
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Language Score</span>
                      <ScorePill score={review.spellingAndGrammarAudit.overallScore} />
                    </div>
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-xl border ${
                        review.spellingAndGrammarAudit.verdict === "flawless"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : review.spellingAndGrammarAudit.verdict === "minor_issues"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : review.spellingAndGrammarAudit.verdict === "needs_remedying"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {review.spellingAndGrammarAudit.verdict.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                  {review.spellingAndGrammarAudit.summary}
                </p>

                {/* UK English Compliance Note */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-900" />
                    <span className="font-bold text-slate-800">UK English Consistency:</span>
                    <span className="text-slate-600">{review.spellingAndGrammarAudit.ukEnglishCompliance.notes}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${review.spellingAndGrammarAudit.ukEnglishCompliance.compliant ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {review.spellingAndGrammarAudit.ukEnglishCompliance.compliant ? "City / UK Compliant" : "Mixed Regional Spelling"}
                  </span>
                </div>

                {/* Issues List */}
                {review.spellingAndGrammarAudit.issues && review.spellingAndGrammarAudit.issues.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Identified Proofreading & Syntax Issues ({review.spellingAndGrammarAudit.issues.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {review.spellingAndGrammarAudit.issues.map((iss, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {iss.issueType.replace(/_/g, " ")}
                            </span>
                            <span className="text-[10px] text-rose-600 font-bold">Needs Correction</span>
                          </div>

                          <div className="p-2 rounded bg-rose-50/50 border border-rose-100 text-rose-900 font-mono text-[11px]">
                            &quot;{iss.quote}&quot;
                          </div>

                          <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100 text-emerald-900">
                            <span className="font-bold">Correction:</span> {iss.correction}
                          </div>

                          <p className="text-[11px] text-slate-500 italic mt-1">
                            {iss.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Flawless proofreading: zero spelling mistakes, grammar flaws, or Americanisms detected.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Special Focus: The Hoppiness & Stability Scrutiny */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-950">
                      The &quot;Hoppiness&quot; & Tenure Stability Scrutiny
                    </h3>
                    <p className="text-xs text-slate-500">
                      How recruitment partners and hiring directors judge your mobility pattern
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">Hoppiness Risk</span>
                  <ScorePill score={review.tenureAnalysis.hoppinessRiskScore} inverse={true} />
                </div>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Roles Assessed
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {review.tenureAnalysis.rolesAssessed}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Avg Tenure
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {review.tenureAnalysis.averageTenureMonths
                      ? `${(review.tenureAnalysis.averageTenureMonths / 12).toFixed(1)} yrs`
                      : "N/A"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Moves &lt;18 Mos
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {review.tenureAnalysis.movesUnder18Months}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Risk Level
                  </span>
                  <span className="text-sm font-black uppercase text-slate-900">
                    {review.tenureAnalysis.riskLevel}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mt-4">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Hiring Manager Perception</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {review.tenureAnalysis.hiringManagerPerception}
                </p>
              </div>

              {review.tenureAnalysis.fairContextOrMitigation && review.tenureAnalysis.fairContextOrMitigation.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    How to Defend & Mitigate Movement on Your CV:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    {review.tenureAnalysis.fairContextOrMitigation.map((tip, idx) => (
                      <li key={idx} className="leading-snug">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Special Focus: Salary & Role Calibration */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center">
                    <PoundSterling className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-950">
                      Target Salary & Commercial Scope Calibration
                    </h3>
                    <p className="text-xs text-slate-500">
                      Target: {review.target.role} @ {review.target.salary} ({review.target.location})
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                  {review.salaryCalibration.roleAlignment.replace(/_/g, " ")}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {review.salaryCalibration.rationale}
              </p>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Commercial Evidence Gap to Justify Stated Salary:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {review.salaryCalibration.evidenceDelta}
                </p>
              </div>

              {review.salaryCalibration.missingScopeOrProof && review.salaryCalibration.missingScopeOrProof.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    Scope & Proof Required to Unlock That Compensation:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    {review.salaryCalibration.missingScopeOrProof.map((item, idx) => (
                      <li key={idx} className="leading-snug">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Scorecard Grid (4 Core Areas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SectionCard
                title="Career Trajectory & Growth"
                icon={TrendingUp}
                section={review.scorecard.careerTrajectoryAndTenure}
              />
              <SectionCard
                title="Quantified Commercial Impact"
                icon={BarChart3}
                section={review.scorecard.quantifiedCommercialImpact}
              />
              <SectionCard
                title="Target Role Calibration"
                icon={Briefcase}
                section={review.scorecard.targetRoleAndSalaryAlignment}
              />
              <SectionCard
                title="Presentation & ATS Readability"
                icon={FileCheck2}
                section={review.scorecard.formattingBrevityAndPresentation}
              />
            </div>

            {/* Kill Words & Cliché Replacement */}
            {review.killWords && review.killWords.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Flagged Passive Phrases & Clichés
                    </h3>
                    <p className="text-xs text-slate-500">
                      Phrases that dilute executive gravitas and their suggested replacements
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {review.killWords.map((kw, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-rose-800 line-through">
                          &quot;{kw.phrase}&quot;
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          {kw.category.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{kw.whyItHurts}</p>
                      <div className="text-xs font-medium text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                        <span className="font-bold">Alternative:</span> {kw.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority Fixes Prior to Submission */}
            {review.priorityFixes && review.priorityFixes.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-100">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Make It Perfect Prior to Submission
                    </h3>
                    <p className="text-xs text-slate-500">
                      Prioritised actions to implement before sending to recruiters or clients
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {review.priorityFixes.map((fix) => (
                    <div
                      key={fix.priority}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-950 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {fix.priority}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{fix.title}</h4>
                        <p className="text-xs text-slate-600">{fix.whyItMatters}</p>
                        <div className="mt-2 text-xs font-semibold text-blue-950 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                          <span className="uppercase text-[10px] font-bold text-blue-800 block mb-0.5">
                            Action to take:
                          </span>
                          {fix.action}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tailored Executive Summary Rewrite */}
            {review.executiveSummaryRewrite && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Tailored Executive Summary Rewrite
                    </h3>
                    <p className="text-xs text-slate-500">
                      A 3-sentence profile paragraph repositioned for your target role
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-serif text-slate-800 text-xs sm:text-sm leading-relaxed italic">
                  &quot;{review.executiveSummaryRewrite.text}&quot;
                </div>

                {review.executiveSummaryRewrite.proofStillNeeded && review.executiveSummaryRewrite.proofStillNeeded.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-700 mb-1.5">
                      Proof points still needed to solidify this summary:
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-500 list-disc list-inside">
                      {review.executiveSummaryRewrite.proofStillNeeded.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Liberty Towers Advisory CTA */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg text-center">
              <span className="inline-block text-[11px] uppercase tracking-widest font-bold text-amber-400 mb-2">
                Executive Career Advisory
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                {review.callToAction.heading}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                {review.callToAction.body}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={review.callToAction.href}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-blue-950 font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-md"
                >
                  {review.callToAction.buttonLabel}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setReview(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm transition cursor-pointer"
                >
                  Audit Another CV
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[11px] text-slate-400 max-w-xl mx-auto">
              This is an AI-assisted candidate self-audit based only on the information supplied. It is
              not an automated hiring decision, guarantee of interview, or definitive salary valuation.
            </p>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-900 px-2.5 py-1.5 rounded-lg">
              <img 
                src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png" 
                alt="Liberty Towers" 
                className="h-5 w-auto object-contain brightness-0 invert"
              />
            </div>
            <span>© {new Date().getFullYear()} Liberty Towers Ltd. All rights reserved. London, UK.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/salaries" className="hover:underline">Salary Benchmarks</a>
            <a href="/profile-review" className="hover:underline">LinkedIn Review</a>
            <a href="/cv-review" className="hover:underline font-bold text-blue-950">CV Review</a>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
