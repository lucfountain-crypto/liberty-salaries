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
import type { ProfileReview, ReviewSection } from "@/lib/profile-review";
import { 
  Camera, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  TrendingUp, 
  AlertCircle, 
  Briefcase, 
  MapPin, 
  Laptop, 
  Smartphone,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from "lucide-react";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const LIBERTY_BLUE = "#0f4c81";

type ApiResponse = { review?: ProfileReview; error?: string };

function ScorePill({ observed, score }: Pick<ReviewSection, "observed" | "score">) {
  if (!observed) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
        Not visible
      </span>
    );
  }

  const tone =
    score >= 80
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 65
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : score >= 50
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${tone}`}>
      {score}/100
    </span>
  );
}

function ScoreCard({
  title,
  icon: Icon,
  section,
  children,
}: {
  title: string;
  icon: React.ElementType;
  section: ReviewSection;
  children?: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-slate-50 text-blue-900 border border-slate-100">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>
        <ScorePill observed={section.observed} score={section.score} />
      </div>

      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
        {section.summary}
      </p>

      {section.observed && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 pt-3 border-t border-slate-100">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Working Well
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-slate-600">
              {section.strengths.map((item) => (
                <li className="flex items-start gap-1.5" key={item}>
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              High-Impact Fixes
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-slate-600">
              {section.improvements.map((item) => (
                <li className="flex items-start gap-1.5" key={item}>
                  <span className="text-amber-600 font-bold">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {children}
    </article>
  );
}

function HeadlineRewriteBox({ rewrite, alternatives }: { rewrite: string; alternatives?: string[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const allRewrites = [rewrite, ...(alternatives || [])].filter(Boolean);

  return (
    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-800" />
          Recommended High-Converting Headlines
        </span>
      </div>

      <div className="space-y-2">
        {allRewrites.map((text, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-blue-100 text-xs font-medium text-slate-900 shadow-2xs"
          >
            <span className="leading-snug">{text}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(text, idx)}
              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-900 rounded-md transition shrink-0"
              title="Copy to clipboard"
            >
              {copiedIndex === idx ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Report({ review }: { review: ProfileReview }) {
  const scoreTier =
    review.overallScore >= 85
      ? { label: "Executive Tier (Top 10%)", tone: "text-emerald-400 border-emerald-400/30" }
      : review.overallScore >= 70
      ? { label: "Strong & Competitive", tone: "text-blue-300 border-blue-300/30" }
      : review.overallScore >= 55
      ? { label: "Needs Positioning Polish", tone: "text-amber-300 border-amber-300/30" }
      : { label: "Losing Recruiter Attention", tone: "text-rose-400 border-rose-400/30" };

  return (
    <section aria-labelledby="report-title" className="mt-10 scroll-mt-6 space-y-6" id="profile-report">
      {/* Score Header */}
      <div className="overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex size-28 shrink-0 flex-col items-center justify-center rounded-full border-4 border-white/20 bg-white/5 shadow-inner">
            <span className="text-4xl font-black tracking-tight text-white">
              {review.overallScore}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              out of 100
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                RECRUITER 5-SECOND AUDIT
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${scoreTier.tone}`}>
                {scoreTier.label}
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl" id="report-title">
              Your Professional Market Impression
            </h2>

            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              {review.executiveSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ScoreCard section={review.photo} title="Profile Photo & Crop" icon={Camera} />
        <ScoreCard section={review.banner} title="Brand Banner & Backdrop" icon={ImageIcon} />

        <ScoreCard section={review.headline} title="Headline & Keywords" icon={Sparkles}>
          {review.headline.rewrite && (
            <HeadlineRewriteBox
              rewrite={review.headline.rewrite}
              alternatives={review.headline.alternativeRewrites}
            />
          )}
        </ScoreCard>

        <ScoreCard section={review.career} title="Career Progression & Evidence" icon={TrendingUp} />

        <div className="lg:col-span-2">
          <ScoreCard section={review.targetFit} title="Target Role Alignment" icon={Briefcase} />
        </div>
      </div>

      {/* Priority Action Items */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 sm:p-7">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-900" />
          Top Priority Next Steps (To Make Today)
        </h3>

        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {review.priorityActions.map((action, index) => (
            <li
              key={index}
              className="flex items-start gap-3 rounded-xl bg-white p-4 text-xs sm:text-sm text-slate-700 shadow-2xs border border-slate-200"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-blue-900">
                {index + 1}
              </span>
              <span className="leading-snug">{action}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Commercial Retained Search CTA (Zero Manual Review Promises) */}
      <div className="rounded-2xl bg-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-400 block mb-1">
            LIBERTY TOWERS EXECUTIVE SEARCH
          </span>
          <h3 className="text-lg sm:text-xl font-bold">
            Targeting £60k–£180k+ in Legal, Finance, Insurance, or Tech?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Compare your target package against live UK market medians or submit your details confidentially to be matched directly against active retained employer mandates.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0 w-full md:w-auto">
          <a
            href="/"
            className="flex-1 md:flex-none text-center bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow-sm"
          >
            Explore Salary Calculator
          </a>
          <a
            href="/contact"
            className="flex-1 md:flex-none text-center bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow-sm"
          >
            Register Confidentially
          </a>
        </div>
      </div>

      <p className="text-[11px] text-center text-slate-500 leading-relaxed">
        This automated scorecard is generated based solely on visible screenshot evidence and provided parameters. Liberty Towers does not store or share uploaded profile media. This independent service is not affiliated with or endorsed by LinkedIn Corporation.
      </p>
    </section>
  );
}

export default function ProfileReviewComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<ProfileReview | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(nextFile?: File) {
    setError("");
    setReport(null);

    if (!nextFile) return;

    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setError("Please use a JPG, PNG or WebP image file.");
      return;
    }

    if (nextFile.size > MAX_FILE_BYTES) {
      setError("The screenshot must be under 8MB.");
      return;
    }

    setFile(nextFile);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  }

  function removeFile() {
    setFile(null);
    setReport(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setReport(null);

    if (!file) {
      setError("Please add a profile header screenshot to begin.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("screenshot", file);
    formData.set("consent", "true");

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/review-profile", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok || !payload.review) {
        throw new Error(payload.error || "The review could not be completed. Please try again.");
      }

      setReport(payload.review);

      window.setTimeout(() => {
        document.getElementById("profile-report")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong processing your screenshot. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
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
              <span className="text-xs font-bold tracking-wider text-blue-900 uppercase block">LINKEDIN AUDIT</span>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <a href="/salaries" className="text-slate-600 hover:text-blue-900 transition">
              Salary Guides
            </a>
            <a href="/cv-review" className="text-slate-600 hover:text-blue-900 transition font-semibold text-emerald-800">
              CV Review
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

      <main className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full text-xs font-bold text-blue-900 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-blue-800" />
            <span>AI Recruiter Profile Audit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Does Your LinkedIn Say in 5 Seconds?
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload a quick screenshot of your profile header to get an immediate, honest recruiter evaluation of your photo, banner, headline, and target market positioning.
          </p>
        </div>

        {/* Shortcuts Helper */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <button
            type="button"
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-blue-900 transition"
          >
            <div className="flex items-center space-x-2">
              <Laptop className="w-4 h-4 text-blue-800" />
              <span>How to take a profile snip (Desktop & Mobile Shortcuts)</span>
            </div>
            {showShortcuts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showShortcuts && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">Windows PC:</strong>
                <code>Win + Shift + S</code>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">Apple Mac:</strong>
                <code>Cmd + Shift + 4</code>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">iPhone:</strong>
                Side + Volume Up
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">Android:</strong>
                Power + Volume Down
              </div>
            </div>
          )}
        </div>

        {/* Upload & Options Form */}
        <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step 1: Dropzone */}
          <div>
            <label className="text-sm font-bold text-slate-900 block mb-2">
              1. Upload Profile Header Screenshot (Photo + Banner + Headline)
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                isDragging
                  ? "border-blue-700 bg-blue-50/50"
                  : previewUrl
                  ? "border-emerald-300 bg-emerald-50/20"
                  : "border-slate-300 hover:border-blue-800 bg-slate-50/50"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3 w-full max-w-sm">
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 flex justify-center bg-black/5">
                    <img src={previewUrl} alt="Uploaded screenshot" className="object-contain max-h-48 w-full" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs font-semibold text-emerald-700">✓ Screenshot Attached</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Change image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="size-12 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to browse or drag and drop your screenshot here
                  </p>
                  <p className="text-xs text-slate-500">Supports JPG, PNG or WebP up to 8MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Target Positioning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-900" />
                Target Role / Next Career Step
              </label>
              <input
                required
                name="targetRole"
                type="text"
                placeholder="e.g. Commercial Solicitor / Finance Director"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-900" />
                Target Location / Working Setup
              </label>
              <input
                required
                name="location"
                type="text"
                placeholder="e.g. London (Hybrid) / Manchester / Remote"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition"
              />
            </div>
          </div>

          {/* Step 3: Optional Text Deep Dive */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Cut and paste your LinkedIn About and Experience for deeper evidence audit (Optional)
            </label>
            <textarea
              name="careerText"
              rows={3}
              placeholder="Copy and paste text directly from your LinkedIn About summary and Experience roles..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition"
            />
          </div>

          {/* GDPR Compliance Notice */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-slate-700 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold block mb-0.5">GDPR Compliance</strong>
              <p className="leading-relaxed text-slate-600">
                This tool is a guide on how your LinkedIn profile is perceived. We do not store or hold your data.
              </p>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
              <input
                required
                type="checkbox"
                name="consentCheckbox"
                defaultChecked
                className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              />
              <span>
                I confirm this screenshot is my own professional profile and grant permission for automated AI analysis.
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Auditing Profile & Formulating Rewrites...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generate Instant Profile Scorecard
              </span>
            )}
          </button>
        </form>

        {/* Render Generated Report */}
        {report && <Report review={report} />}
      </div>
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
          <a href="/profile-review" className="hover:underline font-bold text-blue-950">LinkedIn Review</a>
          <a href="/cv-review" className="hover:underline">CV Review</a>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms</a>
        </div>
      </div>
    </footer>
  </div>
  );
}
