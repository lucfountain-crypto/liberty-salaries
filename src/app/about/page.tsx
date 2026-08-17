import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, TrendingUp, Users, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Us | Liberty Towers Compensation & Executive Search Intelligence',
  description: 'Learn about Liberty Towers Intelligence, our executive search methodology, and our independent UK compensation benchmarks.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-blue-950 text-white py-6 border-b border-blue-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-xs font-semibold text-blue-200 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Calculator</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">About Liberty Towers</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            Executive Search & Compensation Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            About Liberty Towers
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Delivering data-driven executive search, verified salary intelligence, and talent advisory across the UK and international markets.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-900" />
              Our Mission & Philosophy
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At <strong>Liberty Towers</strong>, our philosophy is simple: <em>Recruitment without borders. Talent without compromise.</em> In high-stakes professional sectors—including Corporate Governance, Internal Audit, Quantitative Finance, Specialty Insurance, Legal, and Applied AI—compensation transparency is critical for both hiring organizations and senior professionals.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Traditional salary surveys are often outdated before publication or restricted behind high paywalls. We created the <strong>Liberty Towers Salary Benchmarks</strong> platform to provide real-time, indicative remuneration data reflecting actual market offers, statutory requirements, and regional cost-of-talent variations across London, regional UK hubs, and European remote operations.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Data Accuracy</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Calibrated against active placements, real-world offer letters, and validated UK industry benchmarks updated continuously for 2026.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Specialist Focus</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dedicated domain expertise across Audit, Risk & Compliance, Quantitative Trading, Corporate Finance, and High-Growth Engineering.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Executive Confidentiality</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Protecting candidate privacy and client anonymity with strict GDPR compliance and discrete talent advisory protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Practice Areas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Key Practice Groups</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold">Internal Audit & Corporate Governance</strong>
                <p className="text-xs text-slate-600 mt-1">Practice and industry internal auditors, IT audit specialists, and Heads of Audit.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold">Quantitative Finance & Algorithmic Trading</strong>
                <p className="text-xs text-slate-600 mt-1">Alpha generation researchers, high-frequency C++ developers, and quantitative analysts.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold">Specialty Insurance & Actuarial</strong>
                <p className="text-xs text-slate-600 mt-1">Lloyd's syndicates, pricing actuaries, reserving leads, and specialty lines underwriters.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold">Corporate Finance, M&A & Legal</strong>
                <p className="text-xs text-slate-600 mt-1">Investment banking associates/VPs, in-house commercial legal counsel, and regulatory compliance heads.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white rounded-2xl p-8 text-center sm:text-left sm:flex items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-xl font-bold">Need a bespoke compensation assessment?</h3>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">
              Contact our search advisors for custom role benchmarking, executive search mandates, or candidate shortlisting.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-block mt-4 sm:mt-0 bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition"
          >
            Speak to an Advisor
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Liberty Towers | Executive Search & Talent Intelligence</span>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:underline text-slate-600">Calculator</Link>
            <span>•</span>
            <Link href="/salaries" className="hover:underline text-slate-600">Salary Guides</Link>
            <span>•</span>
            <Link href="/methodology" className="hover:underline text-slate-600">Methodology</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:underline text-slate-600">Privacy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline text-slate-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
