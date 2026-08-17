import React from 'react';
import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, MapPin, Calculator, BarChart3, Database, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Compensation Survey Methodology 2026 | Liberty Towers Intelligence',
  description: 'Learn how Liberty Towers compiles UK salary benchmarks, regional cost-of-talent multipliers, and compensation percentiles.',
};

export default function MethodologyPage() {
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
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Methodology & Regional Index</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            Data Science & Market Calibration
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Compensation Survey Methodology (2026 Edition)
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            A comprehensive framework for evaluating UK and international base remuneration, total compensation packages, and regional geographic differentials.
          </p>
        </div>

        {/* Data Architecture */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-900" />
              1. Data Sources & Compilation Framework
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Liberty Towers benchmarks are synthesized from three core data streams to ensure statistical robustness and market relevance:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="block text-slate-900 text-sm font-bold">1. Verified Search Placements</strong>
                <p className="text-xs text-slate-600 mt-1">First-hand compensation data from executed search mandates, signed offer letters, and candidate verification across London and the UK.</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="block text-slate-900 text-sm font-bold">2. Industry & Professional Surveys</strong>
                <p className="text-xs text-slate-600 mt-1">Cross-referenced against leading industry publications, ICAEW, Barclay Simpson, Actuarial Post, and City of London legal remuneration filings.</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="block text-slate-900 text-sm font-bold">3. Macroeconomic & ONS Indices</strong>
                <p className="text-xs text-slate-600 mt-1">Calibrated with UK Office for National Statistics (ONS) labour market data, National Living Wage statutory baselines, and CPI inflation adjustments.</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Percentiles Explained */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-900" />
              2. Understanding Compensation Percentiles
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Rather than presenting a single misleading &quot;average&quot; salary, our model maps roles across three distinct statistical percentiles:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r-xl">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-slate-900">10th Percentile (Entry / Developing Level)</strong>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">Starting Range</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Represents candidates entering the role bracket, those with foundational domain experience, or smaller organizations with tighter compensation budgets.
                </p>
              </div>

              <div className="p-4 bg-blue-50/50 border-l-4 border-blue-800 rounded-r-xl">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-blue-950">50th Percentile (Market Median / Standard Specialist)</strong>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Core Benchmark</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  The median compensation for fully autonomous, proven professionals meeting all standard job specifications with proven track records.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/50 border-l-4 border-emerald-600 rounded-r-xl">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-slate-900">90th Percentile (Top-Decile / High Performer)</strong>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Premium Tier</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Upper-tier compensation commanded by top performers, individuals with scarce niche qualifications, or premier tier-1 global institutions (e.g. US law firms, tier-1 prop trading shops).
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Regional Multipliers */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-900" />
              3. Geographic & Regional Multipliers
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Compensation benchmarks are baseline-calibrated against <strong>London & the City of London (1.00x)</strong>. Regional locations and remote work structures are adjusted using our verified 2026 regional index:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-3.5">Region / Geographic Hub</th>
                    <th className="p-3.5">Base Multiplier</th>
                    <th className="p-3.5">Representative Markets</th>
                    <th className="p-3.5">Market Characteristics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-3.5 font-bold text-slate-900">London & City Hubs</td>
                    <td className="p-3.5 font-bold text-blue-900">1.00x (Baseline)</td>
                    <td className="p-3.5 text-slate-600">Square Mile, Mayfair, Canary Wharf</td>
                    <td className="p-3.5 text-slate-600">Global financial center; highest market density and bonus pools.</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">UK National Remote</td>
                    <td className="p-3.5 font-bold text-blue-900">0.92x</td>
                    <td className="p-3.5 text-slate-600">UK-wide home working</td>
                    <td className="p-3.5 text-slate-600">High mobility, balanced compensation between London and regional baselines.</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3.5 font-bold text-slate-900">South East England</td>
                    <td className="p-3.5 font-bold text-blue-900">0.88x</td>
                    <td className="p-3.5 text-slate-600">Reading, Oxford, Cambridge, Guildford</td>
                    <td className="p-3.5 text-slate-600">Strong tech and pharmaceutical presence; commuter belt competition.</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Midlands & Central UK</td>
                    <td className="p-3.5 font-bold text-blue-900">0.82x</td>
                    <td className="p-3.5 text-slate-600">Birmingham, Nottingham, Northampton</td>
                    <td className="p-3.5 text-slate-600">Major corporate back-office, logistics, and regional financial services.</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3.5 font-bold text-slate-900">Scotland & Regional Centers</td>
                    <td className="p-3.5 font-bold text-blue-900">0.82x</td>
                    <td className="p-3.5 text-slate-600">Edinburgh, Glasgow, Aberdeen</td>
                    <td className="p-3.5 text-slate-600">Asset management and fintech hub in Edinburgh; energy focus in Aberdeen.</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">North UK</td>
                    <td className="p-3.5 font-bold text-blue-900">0.80x</td>
                    <td className="p-3.5 text-slate-600">Manchester, Leeds, Liverpool, Newcastle</td>
                    <td className="p-3.5 text-slate-600">Expanding corporate hubs with growing legal and digital practice groups.</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3.5 font-bold text-slate-900">European Remote (EU)</td>
                    <td className="p-3.5 font-bold text-blue-900">0.72x</td>
                    <td className="p-3.5 text-slate-600">Spain, Portugal, Poland, Germany</td>
                    <td className="p-3.5 text-slate-600">Cross-border remote hiring adjusted for European purchasing power parity.</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">US & Wall Street Remote</td>
                    <td className="p-3.5 font-bold text-blue-900">1.30x</td>
                    <td className="p-3.5 text-slate-600">New York, San Francisco, Chicago</td>
                    <td className="p-3.5 text-slate-600">High-dollar compensation bands reflecting US tech and banking baselines.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="p-6 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
          <strong className="block font-bold text-slate-900">Benchmark Notice & Limitations:</strong>
          <p>
            Compensation benchmarks presented across the Liberty Towers platform are indicative guidelines intended for executive planning, recruitment budgeting, and career development. Individual package determinations depend on numerous specific variables including exact candidate qualifications, track record, organizational size, bonus structure, equity allocation, and corporate total reward policies.
          </p>
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
            <Link href="/about" className="hover:underline text-slate-600">About Us</Link>
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
