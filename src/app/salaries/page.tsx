import React from 'react';
import Link from 'next/link';
import salaryData from '@/data/salaries.json';
import { ArrowLeft, BookOpen, ChevronRight, TrendingUp, Briefcase, Award } from 'lucide-react';

export const metadata = {
  title: 'UK Salary Guides 2026 | Liberty Towers Intelligence Directory',
  description: 'Comprehensive 2026 UK salary guides, benchmark percentiles, and hiring demand across Audit, Quant, Insurance, Tech, Legal, and Corporate Finance.',
};

export default function SalariesIndexPage() {
  const roles = salaryData.roles;

  // Group roles by category
  const categories = Array.from(new Set(roles.map(r => r.category)));

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
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Salary Directory 2026</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            Market Intelligence Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            UK Salary Guides & Compensation Benchmarks (2026)
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Detailed remuneration reports, 10th-to-90th percentile distributions, regional multipliers, and candidate market analysis across key executive search practice disciplines.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryRoles = roles.filter(r => r.category === category);
            return (
              <div key={category} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-900" />
                    {category}
                  </h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {categoryRoles.length} {categoryRoles.length === 1 ? 'Guide' : 'Guides'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {categoryRoles.map((role) => (
                    <Link
                      key={role.id}
                      href={`/salaries/${role.id}`}
                      className="group p-5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 group-hover:text-blue-900 text-base transition">
                            {role.title}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 transition shrink-0" />
                        </div>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                          {role.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 text-slate-500">
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <TrendingUp className="w-3.5 h-3.5" />
                          2026 Verified Benchmark
                        </span>
                        <span className="text-blue-900 font-semibold group-hover:underline">
                          View Full Report →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Hub Callout */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white rounded-2xl p-8 shadow-sm text-center sm:text-left sm:flex items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Interactive Calculator</h3>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">
              Want to calculate custom regional salary adjustments and experience percentiles on the fly?
            </p>
          </div>
          <Link
            href="/"
            className="inline-block mt-4 sm:mt-0 bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition"
          >
            Launch Interactive Calculator
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
            <Link href="/about" className="hover:underline text-slate-600">About Us</Link>
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
