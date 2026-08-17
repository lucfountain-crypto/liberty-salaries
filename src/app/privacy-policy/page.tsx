import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Cookie } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Liberty Towers Salary Benchmarks',
  description: 'Privacy Policy and Google AdSense cookie notice for Liberty Towers Salary Benchmarks 2026.',
};

export default function PrivacyPolicyPage() {
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
            <span>Back to Salary Benchmarks</span>
          </Link>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Privacy & Compliance</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: August 2026 • Liberty Towers Intelligence</p>
        </div>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Overview */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-900" />
              1. Overview & Data Protection
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Liberty Towers (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the <strong>LT Salary Benchmarks</strong> tool at <code>liberty-towers.org</code>. We are committed to protecting user privacy and ensuring complete transparency regarding how data and cookies are handled across our benchmark services in full compliance with UK GDPR and the Data Protection Act 2018.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* AdSense & Third-Party Advertising */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-blue-900" />
              2. Cookies & Google AdSense Advertising
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We use third-party vendor services, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-3 space-y-2 leading-relaxed pl-2">
              <li>
                Google, as a third-party vendor, uses cookies (such as the DoubleClick cookie) to serve relevant advertisements based on user visits to this website and other websites across the internet.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to display ads based on your navigation history and preferences.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium">Google Ads Settings</a>.
              </li>
              <li>
                Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium">aboutads.info</a>.
              </li>
            </ul>
          </div>

          <hr className="border-slate-100" />

          {/* Information We Collect */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-900" />
              3. Information We Collect
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Our salary benchmark calculator is designed for anonymous interactive use.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mt-3 space-y-2 leading-relaxed pl-2">
              <li>
                <strong>Benchmark Queries:</strong> Role, region, and experience inputs typed into the calculator are processed client-side to compute salary percentiles and are not stored against your personal identity.
              </li>
              <li>
                <strong>Advisory Requests:</strong> If you voluntarily submit a request via the &quot;Request Candidate Shortlist&quot; modal or contact form, we collect your name, business email/phone, and query strictly for executive search advisory communications. We never sell, rent, or trade contact details to third parties.
              </li>
            </ul>
          </div>

          <hr className="border-slate-100" />

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">4. Contacting Us Regarding Data Privacy</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              If you have any questions regarding this Privacy Policy or wish to exercise your data subject rights under UK GDPR, please contact our data compliance officer at:
            </p>
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:support@liberty-towers.org" className="text-blue-700 hover:underline">support@liberty-towers.org</a></p>
              <p><strong>Entity:</strong> Liberty Towers (Executive Search & Talent Intelligence)</p>
              <p><strong>Location:</strong> City of London & Northampton, United Kingdom</p>
            </div>
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
            <Link href="/terms" className="hover:underline text-slate-600">Terms of Service</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline text-slate-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
