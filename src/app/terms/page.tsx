import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Liberty Towers Salary Benchmarks',
  description: 'Terms of Service, acceptable use, and compensation benchmarking disclaimers for Liberty Towers.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-blue-950 text-white py-6 border-b border-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-xs font-semibold text-blue-200 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Calculator</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Terms of Service</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: August 2026 • Liberty Towers Intelligence</p>
        </div>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-900" />
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              By accessing or using the <strong>Liberty Towers Salary Benchmarks</strong> website (<code>liberty-towers.org</code> and related subdomains), you agree to be legally bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-900" />
              2. Nature of Benchmarking Data & Disclaimer
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              All salary figures, percentile distributions, bonus splits, and market movement commentary provided on this platform are for general informational, educational, and guidance purposes only.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-3 space-y-2 leading-relaxed pl-2">
              <li>
                <strong>Indicative Only:</strong> Benchmarks represent statistical approximations based on verified search placements, industry surveys, and public indices. They do not constitute a formal valuation, contractual promise, or binding legal advice.
              </li>
              <li>
                <strong>No Guarantee:</strong> Liberty Towers makes no warranties regarding the complete accuracy or applicability of compensation figures to any single individual candidate or organization. Actual remuneration depends on unique commercial negotiations, corporate policy, and specific candidate capabilities.
              </li>
            </ul>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-900" />
              3. Intellectual Property & Acceptable Use
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              All proprietary algorithms, regional weighting indices, brand assets, logos, and written market guides published on this platform are the intellectual property of Liberty Towers.
            </p>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              You are permitted to use this site for personal career planning or internal corporate hiring reference. You may not scrape, systematically copy, reverse engineer, or redistribute our datasets for commercial reselling without prior written authorization from Liberty Towers.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">4. Third-Party Links & Advertising</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              This site may feature external links and automated advertisements served by Google AdSense. Liberty Towers is not responsible for the content, privacy practices, or goods/services offered by third-party advertisers or external websites.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">5. Governing Law</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of England and Wales. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Liberty Towers | Executive Search</span>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:underline text-slate-600">Calculator</Link>
            <span>•</span>
            <Link href="/about" className="hover:underline text-slate-600">About Us</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:underline text-slate-600">Privacy Policy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline text-slate-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
