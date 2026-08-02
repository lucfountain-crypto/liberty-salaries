'use client';

import React, { useState, useMemo } from 'react';
import salaryData from '@/data/salaries.json';
import { 
  Search, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Award, 
  Sparkles,
  Zap,
  Users,
  ChevronRight,
  Info,
  Clock,
  Briefcase,
  CheckCircle2,
  Send,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

export default function SalaryDashboard() {
  // Conversational Form State
  const [roleInput, setRoleInput] = useState<string>('Specialty Underwriter');
  const [expYears, setExpYears] = useState<string>('6-10'); // '1-3', '3-6', '6-10', '10+'
  const [locationInput, setLocationInput] = useState<string>('london'); // 'london', 'southeast', 'north', 'scotland', 'us_remote'
  const [workStyle, setWorkStyle] = useState<string>('hybrid'); // 'hybrid', 'remote', 'onsite'
  
  // App view modes: 'guided' (simple natural language) vs 'full' (all roles matrix)
  const [viewMode, setViewMode] = useState<'guided' | 'full'>('guided');
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Sector & Role Data matching
  const roles = salaryData.roles;
  
  // Find best matching role based on user natural language input
  const matchedRole = useMemo(() => {
    const inputLower = roleInput.toLowerCase().trim();
    if (!inputLower) return roles[0];
    
    // Direct or partial title match
    const exactMatch = roles.find(r => r.title.toLowerCase().includes(inputLower) || inputLower.includes(r.title.toLowerCase()));
    if (exactMatch) return exactMatch;

    // Category / description match
    const categoryMatch = roles.find(r => 
      r.category.toLowerCase().includes(inputLower) || 
      r.description.toLowerCase().includes(inputLower) ||
      r.sector.toLowerCase().includes(inputLower)
    );
    if (categoryMatch) return categoryMatch;

    return roles[0];
  }, [roleInput, roles]);

  // Experience level multipliers
  const expMultipliers: Record<string, { label: string; multiplier: number }> = {
    '1-3': { label: '1–3 Years (Junior / Associate)', multiplier: 0.72 },
    '3-6': { label: '3–6 Years (Mid-Level)', multiplier: 0.88 },
    '6-10': { label: '6–10 Years (Senior Lead)', multiplier: 1.00 },
    '10+': { label: '10+ Years (Director / Head)', multiplier: 1.35 }
  };

  const currentExpMeta = expMultipliers[expYears] || expMultipliers['6-10'];
  const multiplier = currentExpMeta.multiplier;

  // Raw region data for current role
  const rawRegionData = matchedRole.regional_data[locationInput as keyof typeof matchedRole.regional_data] || matchedRole.regional_data.london;

  // Work style adjustment factor
  const workStyleMultiplier = workStyle === 'remote' ? 1.05 : workStyle === 'onsite' ? 0.97 : 1.0;

  // Calculated final benchmarks
  const p10 = Math.round((rawRegionData.p10 * multiplier * workStyleMultiplier) / 1000) * 1000;
  const p50 = Math.round((rawRegionData.p50 * multiplier * workStyleMultiplier) / 1000) * 1000;
  const p90 = Math.round((rawRegionData.p90 * multiplier * workStyleMultiplier) / 1000) * 1000;

  const basePct = rawRegionData.base_pct || 80;
  const bonusPct = rawRegionData.bonus_pct || 20;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);
  };

  const handleQuickSelect = (roleTitle: string) => {
    setRoleInput(roleTitle);
    setHasGenerated(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Executive Header */}
      <header className="border-b border-slate-800/80 bg-[#0c1222]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Liberty Towers Official Logo & Tagline */}
          <div className="flex items-center space-x-4">
            <a href="https://www.libertytowers.co.uk/" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition">
              <img 
                src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png" 
                alt="Liberty Towers Logo" 
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </a>
            <div className="hidden sm:block border-l border-slate-700/60 pl-4">
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase block">Salary & Market Intelligence</span>
              <span className="text-[11px] text-slate-400 block">Executive Benchmarks 2026</span>
            </div>
          </div>

          {/* Contact / Toggle Action */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'guided' ? 'full' : 'guided')}
              className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg transition flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{viewMode === 'guided' ? 'Switch to Full Directory' : 'Switch to Simple Assistant'}</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-md shadow-amber-500/20 transition flex items-center space-x-1"
            >
              <span>Speak to an Advisor</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Intro Banner */}
      <section className="bg-gradient-to-b from-[#0f172a] via-[#0b1324] to-[#0a0e1a] border-b border-slate-800/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Liberty Towers Executive Market Research</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Your Success, Our Expertise. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              Instant Executive Salary & Demand Benchmarks
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get instant, real-time UK market compensation distribution (10th, 50th, 90th percentiles), talent scarcity indicators, and base/bonus breakdowns for any role or experience level.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {viewMode === 'guided' ? (
          <div className="space-y-8">
            
            {/* Step-by-Step Conversational Input Card */}
            <div className="bg-[#111827] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
              
              <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">What role would you like current Market data on?</h2>
                  <p className="text-xs text-slate-400">Type in natural human language, or pick a popular benchmark below.</p>
                </div>
              </div>

              {/* Natural Language Job Role Input */}
              <div className="mt-6">
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-amber-400" />
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g. Specialty Underwriter, Quant Developer, Head of Risk, M&A Advisor..."
                    className="w-full bg-[#0d1322] border border-slate-700 focus:border-amber-500 text-white pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>

                {/* Popular Role Quick Buttons */}
                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Popular Executive Benchmarks:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Specialty Underwriter',
                      'Quant Researcher',
                      'HFT C++ Developer',
                      'Risk Actuary',
                      'Regulatory Compliance Officer',
                      'Project & Change Manager'
                    ].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleQuickSelect(role)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                          roleInput.toLowerCase() === role.toLowerCase()
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                            : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Steps 2 & 3: Experience & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-800">
                
                {/* Years Experience */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                    2. Years of Experience
                  </label>
                  <select
                    value={expYears}
                    onChange={(e) => setExpYears(e.target.value)}
                    className="w-full bg-[#0d1322] border border-slate-700 focus:border-amber-500 text-white px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                  >
                    <option value="1-3">1–3 Years (Junior / Associate)</option>
                    <option value="3-6">3–6 Years (Mid-Level)</option>
                    <option value="6-10">6–10 Years (Senior Lead)</option>
                    <option value="10+">10+ Years (Director / Head)</option>
                  </select>
                </div>

                {/* Location & Region */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                    3. Location & Work Setup
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="bg-[#0d1322] border border-slate-700 focus:border-amber-500 text-white px-3 py-3 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                    >
                      <option value="london">London & Lloyd's Market</option>
                      <option value="southeast">South East England</option>
                      <option value="north">North UK (Manchester/Leeds)</option>
                      <option value="scotland">Scotland & Regional Hubs</option>
                      <option value="us_remote">US / Overseas & Remote</option>
                    </select>

                    <select
                      value={workStyle}
                      onChange={(e) => setWorkStyle(e.target.value)}
                      className="bg-[#0d1322] border border-slate-700 focus:border-amber-500 text-white px-3 py-3 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                    >
                      <option value="hybrid">Hybrid Working</option>
                      <option value="remote">Fully Remote</option>
                      <option value="onsite">Fully In-Office</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 flex justify-end">
                <button
                  onClick={() => setHasGenerated(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Executive Benchmark</span>
                </button>
              </div>

            </div>

            {/* Benchmark Results Output Card */}
            {hasGenerated && (
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {matchedRole.sector}
                      </span>
                      <span className="text-xs text-slate-400">• {currentExpMeta.label}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {matchedRole.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                      {matchedRole.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Region & Setup</span>
                      <span className="text-xs font-bold text-white">
                        {locationInput === 'london' ? "London & Lloyd's" : locationInput.toUpperCase()} ({workStyle})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Salary Percentile Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                  
                  {/* 10th Percentile */}
                  <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      10th Percentile (Entry / Min)
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-200">
                      {formatCurrency(p10)}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">Base package threshold</span>
                  </div>

                  {/* 50th Percentile (Median) */}
                  <div className="bg-gradient-to-b from-[#172033] to-[#0d1424] border-2 border-amber-500/50 rounded-xl p-5 text-center relative shadow-lg shadow-amber-500/10">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow">
                      Market Median
                    </div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      50th Percentile (Average)
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {formatCurrency(p50)}
                    </span>
                    <span className="text-[11px] text-amber-200/80 block mt-1">Expected market package</span>
                  </div>

                  {/* 90th Percentile (Peak) */}
                  <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      90th Percentile (Peak Tier)
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-200">
                      {formatCurrency(p90)}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">Top-tier packages</span>
                  </div>

                </div>

                {/* Demand & Scarcity Analysis Banner */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20 shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Market Scarcity & Demand Insight</h4>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        At median compensation (<strong className="text-amber-400">{formatCurrency(p50)}</strong>), candidate pool availability for <strong className="text-white">{matchedRole.title}</strong> is currently rated as <span className="text-amber-400 font-bold">{rawRegionData.demand}</span> with a <strong className="text-emerald-400">{rawRegionData.yoy}</strong> year-on-year pay trajectory.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 bg-slate-800 px-4 py-2 rounded-lg text-center border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Base vs Bonus Split</span>
                    <span className="text-xs font-bold text-white">{basePct}% Base / {bonusPct}% Variable</span>
                  </div>
                </div>

                {/* B2B Call-To-Action Banner */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-2xl border-amber-500/20">
                  <div>
                    <h4 className="text-base font-extrabold text-white">Hiring for this role or scaling your team?</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Liberty Towers delivers pre-screened executive candidates matched to these benchmarks within 48 hours.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-amber-500/20"
                  >
                    <span>Request Candidate Shortlist</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        ) : (
          /* Full Matrix Directory View for Technical Users */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">All Sector Roles & Benchmarks Directory</h2>
                <p className="text-xs text-slate-400">Comprehensive overview across all benchmarked roles.</p>
              </div>
              <button
                onClick={() => setViewMode('guided')}
                className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg font-semibold"
              >
                ← Return to Simple Assistant
              </button>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {salaryData.roles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setRoleInput(r.title);
                      setViewMode('guided');
                      setHasGenerated(true);
                    }}
                    className="p-4 rounded-xl bg-[#0b1120] border border-slate-800 hover:border-amber-500/50 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">{r.sector}</span>
                      <h4 className="text-sm font-bold text-white">{r.title}</h4>
                      <span className="text-xs text-slate-400">Median: {formatCurrency(r.regional_data.london.p50)}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Advisory Consultation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white">Speak to a Liberty Towers Advisor</h3>
            <p className="text-xs text-slate-300 mt-1">
              Discuss custom benchmarking, talent scarcity analysis, or candidate shortlists for your organization.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! A Liberty Towers specialist will reach out shortly.'); setShowModal(false); }} className="space-y-4 mt-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name / Company</label>
                <input required type="text" placeholder="e.g. Sarah Jenkins / Acme Insurance" className="w-full bg-[#0d1322] border border-slate-700 text-white px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email or Phone</label>
                <input required type="text" placeholder="s.jenkins@company.com or +44 20..." className="w-full bg-[#0d1322] border border-slate-700 text-white px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role / Benchmark Query</label>
                <textarea rows={3} placeholder={`Query regarding ${matchedRole.title} compensation...`} className="w-full bg-[#0d1322] border border-slate-700 text-white px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-500 text-xs" />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="text-xs text-slate-400 hover:text-white px-3 py-2">
                  Cancel
                </button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d18] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img 
              src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png" 
              alt="Liberty Towers" 
              className="h-6 w-auto opacity-70"
            />
            <span>Recruitment without borders. Talent without compromise.</span>
          </div>
          <span>© 2026 Liberty Towers | Executive Search & Market Intelligence</span>
        </div>
      </footer>

    </div>
  );
}
