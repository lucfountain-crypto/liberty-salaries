'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact: `${email} | ${company}`,
          query: message,
          role: 'Contact Form Inquiry',
          source: 'Contact Page'
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

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
            <Mail className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Contact Us</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Contact Liberty Towers Advisory
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Whether you are commissioning an executive search mandate, seeking custom compensation benchmarking, or exploring market intelligence, our advisors are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-900" />
                Office & Enquiries
              </h2>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">General & Support Enquiries</strong>
                    <a href="mailto:support@liberty-towers.org" className="text-blue-700 hover:underline">support@liberty-towers.org</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Executive Search Direct</strong>
                    <a href="mailto:l.fountain@libertytowers.co.uk" className="text-blue-700 hover:underline">l.fountain@libertytowers.co.uk</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">London Headquarters</strong>
                    <p className="text-xs text-slate-500 mt-0.5">City of London & Northampton Operations</p>
                    <p className="text-xs text-slate-500">United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 text-white rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="font-bold text-base">Corporate Headhunters</h3>
              <p className="text-xs text-blue-200 leading-relaxed">
                Specialist practice leads across Internal Audit, Governance, Quant Research, Specialty Underwriting, and Tech Engineering.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Send an Advisory Message</h2>
            <p className="text-xs text-slate-500 mb-6">All communications are treated under strict commercial confidentiality.</p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out. A senior Liberty Towers search advisor will review your enquiry and respond within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Mitchell"
                      className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-blue-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Business Email *</label>
                    <input 
                      type="email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Organization / Firm</label>
                  <input 
                    type="text" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Asset Management LLP or Corporate Audit Group"
                    className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">How can we assist? *</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details regarding your search mandate, benchmarking inquiry, or hiring requirements..."
                    className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-blue-900"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Submit Advisory Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
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
            <Link href="/methodology" className="hover:underline text-slate-600">Methodology</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:underline text-slate-600">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
