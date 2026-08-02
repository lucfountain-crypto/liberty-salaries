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
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function SalaryDashboard() {
  // Conversational Form State
  const [roleInput, setRoleInput] = useState<string>('PA Secretary');
  const [expYears, setExpYears] = useState<string>('1-3'); // '1-3', '3-6', '6-10', '10+'
  const [locationNatural, setLocationNatural] = useState<string>('London, Hybrid 3 days');
  const [workStyle, setWorkStyle] = useState<string>('hybrid'); // 'hybrid', 'remote', 'onsite'
  
  // App view modes: 'guided' (simple natural language) vs 'full' (all roles matrix)
  const [viewMode, setViewMode] = useState<'guided' | 'full'>('guided');
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Pre-cached roles from JSON
  const predefinedRoles = salaryData.roles;

  // Natural language location parser
  const parsedLocation = useMemo(() => {
    const locLower = locationNatural.toLowerCase();
    let regionKey = 'london';
    let regionName = 'London & City Hubs';
    let multiplier = 1.0;

    if (locLower.includes('manchester') || locLower.includes('leeds') || locLower.includes('north') || locLower.includes('birmingham')) {
      regionKey = 'north';
      regionName = 'North UK (Manchester/Leeds)';
      multiplier = 0.80;
    } else if (locLower.includes('scotland') || locLower.includes('edinburgh') || locLower.includes('glasgow')) {
      regionKey = 'scotland';
      regionName = 'Scotland & Regional';
      multiplier = 0.82;
    } else if (locLower.includes('south') || locLower.includes('surrey') || locLower.includes('kent') || locLower.includes('essex')) {
      regionKey = 'southeast';
      regionName = 'South East England';
      multiplier = 0.88;
    } else if (locLower.includes('us') || locLower.includes('new york') || locLower.includes('remote') || locLower.includes('overseas') || locLower.includes('global')) {
      regionKey = 'us_remote';
      regionName = 'US / Overseas & Remote';
      multiplier = 1.25;
    }

    // Work style extraction from text
    let derivedStyle = 'hybrid';
    if (locLower.includes('remote') || locLower.includes('home')) {
      derivedStyle = 'remote';
    } else if (locLower.includes('office') || locLower.includes('onsite') || locLower.includes('in-office')) {
      derivedStyle = 'onsite';
    }

    return { regionKey, regionName, multiplier, derivedStyle };
  }, [locationNatural]);

  // Role Knowledge Base / Heuristic AI Parser for ANY job title
  const activeRoleData = useMemo(() => {
    const titleClean = roleInput.trim() || 'PA Secretary';
    const inputLower = titleClean.toLowerCase();

    // Check if matches one of our pre-cached roles
    const predefined = predefinedRoles.find(r => 
      r.title.toLowerCase().includes(inputLower) || 
      inputLower.includes(r.title.toLowerCase())
    );

    if (predefined) {
      return predefined;
    }

    // Universal Heuristic Engine for ANY custom job title
    let sector = "Corporate & Executive Support";
    let baseP10 = 32000;
    let baseP50 = 45000;
    let baseP90 = 65000;
    let basePct = 90;
    let bonusPct = 10;
    let description = `Provides administrative, organizational, and operational support for business leaders.`;
    let demand = "High Demand";
    let yoy = "+4.8%";

    if (inputLower.includes('pa') || inputLower.includes('secretary') || inputLower.includes('assistant') || inputLower.includes('reception') || inputLower.includes('admin')) {
      sector = "Corporate Administration & Executive Support";
      baseP10 = 30000; baseP50 = 42000; baseP90 = 60000;
      basePct = 92; bonusPct = 8;
      description = "Manages executive diaries, travel logistics, board coordination, and senior administrative operations.";
      demand = "High Demand"; yoy = "+4.2%";
    } else if (inputLower.includes('legal') || inputLower.includes('solicitor') || inputLower.includes('lawyer') || inputLower.includes('counsel')) {
      sector = "Legal & Professional Services";
      baseP10 = 65000; baseP50 = 105000; baseP90 = 165000;
      basePct = 85; bonusPct = 15;
      description = "Advises on corporate transactions, regulatory governance, commercial contracts, and dispute resolution.";
      demand = "Critical Scarcity"; yoy = "+6.2%";
    } else if (inputLower.includes('market') || inputLower.includes('brand') || inputLower.includes('growth') || inputLower.includes('sales')) {
      sector = "Commercial & Growth Strategy";
      baseP10 = 40000; baseP50 = 65000; baseP90 = 105000;
      basePct = 75; bonusPct = 25;
      description = "Drives brand positioning, client acquisition, revenue channels, and strategic market expansion.";
      demand = "High Demand"; yoy = "+5.0%";
    } else if (inputLower.includes('hr') || inputLower.includes('people') || inputLower.includes('talent') || inputLower.includes('recruit')) {
      sector = "Human Resources & Talent Leadership";
      baseP10 = 42000; baseP50 = 70000; baseP90 = 115000;
      basePct = 85; bonusPct = 15;
      description = "Leads talent acquisition, organizational development, employee retention, and compensation strategy.";
      demand = "High Demand"; yoy = "+4.9%";
    } else if (inputLower.includes('finance') || inputLower.includes('account') || inputLower.includes('controller') || inputLower.includes('cfo')) {
      sector = "Finance & Corporate Accounting";
      baseP10 = 48000; baseP50 = 80000; baseP90 = 135000;
      basePct = 80; bonusPct = 20;
      description = "Oversees financial planning & analysis (FP&A), statutory reporting, tax governance, and audit compliance.";
      demand = "High Demand"; yoy = "+5.4%";
    } else if (inputLower.includes('quant') || inputLower.includes('trading') || inputLower.includes('hft') || inputLower.includes('dev')) {
      sector = "Quant & Quantitative Finance";
      baseP10 = 90000; baseP50 = 180000; baseP90 = 280000;
      basePct = 60; bonusPct = 40;
      description = "Engineers algorithmic trading models, high-frequency execution infrastructure, and strategy research.";
      demand = "Critical Scarcity"; yoy = "+8.5%";
    } else if (inputLower.includes('underwriter') || inputLower.includes('insurance') || inputLower.includes('broker') || inputLower.includes('claims')) {
      sector = "Insurance & Specialty Reinsurance";
      baseP10 = 55000; baseP50 = 95000; baseP90 = 160000;
      basePct = 75; bonusPct = 25;
      description = "Evaluates portfolio risk, Lloyd's syndicate exposure, pricing strategy, and broker client relationships.";
      demand = "Critical Scarcity"; yoy = "+6.0%";
    }

    const regMult = parsedLocation.multiplier;

    return {
      id: `custom-${inputLower.replace(/[^a-z0-9]/g, '-')}`,
      title: titleClean.replace(/\b\w/g, l => l.toUpperCase()),
      sector: sector,
      category: "Executive Benchmark",
      description: description,
      regional_data: {
        [parsedLocation.regionKey]: {
          p10: Math.round(baseP10 * regMult),
          p50: Math.round(baseP50 * regMult),
          p90: Math.round(baseP90 * regMult),
          base_pct: basePct,
          bonus_pct: bonusPct,
          demand: demand,
          yoy: yoy
        }
      }
    };
  }, [roleInput, parsedLocation, predefinedRoles]);

  // Experience level multipliers
  const expMultipliers: Record<string, { label: string; multiplier: number }> = {
    '1-3': { label: '1–3 Years (Junior / Assistant)', multiplier: 0.72 },
    '3-6': { label: '3–6 Years (Mid-Level)', multiplier: 0.88 },
    '6-10': { label: '6–10 Years (Senior)', multiplier: 1.00 },
    '10+': { label: '10+ Years (Director / Head)', multiplier: 1.35 }
  };

  const currentExpMeta = expMultipliers[expYears] || expMultipliers['1-3'];
  const multiplier = currentExpMeta.multiplier;

  // Active region data
  const rawRegionData = activeRoleData.regional_data[parsedLocation.regionKey as keyof typeof activeRoleData.regional_data] || {
    p10: 30000,
    p50: 45000,
    p90: 65000,
    base_pct: 90,
    bonus_pct: 10,
    demand: "High Demand",
    yoy: "+4.5%"
  };

  // Work style adjustment factor
  const styleMultiplier = parsedLocation.derivedStyle === 'remote' ? 1.05 : parsedLocation.derivedStyle === 'onsite' ? 0.97 : 1.0;

  // Calculated final benchmarks
  const p10 = Math.round((rawRegionData.p10 * multiplier * styleMultiplier) / 500) * 500;
  const p50 = Math.round((rawRegionData.p50 * multiplier * styleMultiplier) / 500) * 500;
  const p90 = Math.round((rawRegionData.p90 * multiplier * styleMultiplier) / 500) * 500;

  const basePct = rawRegionData.base_pct || 85;
  const bonusPct = rawRegionData.bonus_pct || 15;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setHasGenerated(true);
      setIsGenerating(false);
    }, 200);
  };

  const handleQuickSelect = (roleTitle: string) => {
    setRoleInput(roleTitle);
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Liberty Clean Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Liberty Towers Logo */}
          <div className="flex items-center space-x-4">
            <a href="https://www.libertytowers.co.uk/" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition">
              <img 
                src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png" 
                alt="Liberty Towers Logo" 
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </a>
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <span className="text-xs font-semibold tracking-wider text-blue-900 uppercase block">Salary Intelligence</span>
            </div>
          </div>

          {/* Contact / Switch Action */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'guided' ? 'full' : 'guided')}
              className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-lg transition flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-800" />
              <span className="hidden md:inline">{viewMode === 'guided' ? 'Full Directory' : 'Simple Assistant'}</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition"
            >
              Speak to an Advisor
            </button>
          </div>

        </div>
      </header>

      {/* Clean White Hero Section */}
      <section className="bg-white border-b border-slate-200 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Liberty Towers Executive Salary Benchmarks
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Real-time UK salary percentiles, market demand, and compensation breakdowns.
          </p>
        </div>
      </section>

      {/* Main Form & Results Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {viewMode === 'guided' ? (
          <div className="space-y-8">
            
            {/* Step-by-Step Conversational Input Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              
              <div className="space-y-6">
                
                {/* Input 1: Role Search */}
                <div>
                  <label className="text-sm font-bold text-slate-900 block mb-2">
                    Use Natural language: Tell me what role you are researching?
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-blue-800" />
                    <input
                      type="text"
                      value={roleInput}
                      onChange={(e) => {
                        setRoleInput(e.target.value);
                        setHasGenerated(true);
                      }}
                      placeholder="e.g. PA Secretary, Specialty Underwriter, Commercial Solicitor, Quant Developer..."
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-800/10 transition"
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      'PA Secretary',
                      'Executive Assistant',
                      'Specialty Underwriter',
                      'Quant Researcher',
                      'Commercial Solicitor'
                    ].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleQuickSelect(role)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                          roleInput.toLowerCase() === role.toLowerCase()
                            ? 'bg-blue-50 text-blue-900 border-blue-800 font-semibold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid for Steps 2 & 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  
                  {/* Input 2: Years Experience */}
                  <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">
                      2. How many years of experience?
                    </label>
                    <select
                      value={expYears}
                      onChange={(e) => {
                        setExpYears(e.target.value);
                        setHasGenerated(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                    >
                      <option value="1-3">1–3 Years (Junior / Assistant)</option>
                      <option value="3-6">3–6 Years (Mid-Level)</option>
                      <option value="6-10">6–10 Years (Senior)</option>
                      <option value="10+">10+ Years (Director / Head)</option>
                    </select>
                  </div>

                  {/* Input 3: Location & Setup (Natural Language) */}
                  <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">
                      3. Where is the role based and setup? (Natural language)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-blue-800" />
                      <input
                        type="text"
                        value={locationNatural}
                        onChange={(e) => {
                          setLocationNatural(e.target.value);
                          setHasGenerated(true);
                        }}
                        placeholder="e.g. London hybrid 3 days, Manchester remote, London in-office..."
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800/10 transition"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Parsed: <strong className="text-slate-800">{parsedLocation.regionName}</strong> ({parsedLocation.derivedStyle})
                    </span>
                  </div>

                </div>

              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 flex justify-end border-t border-slate-100">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>Generate Salary Benchmark</span>
                </button>
              </div>

            </div>

            {/* Benchmark Results Output Card */}
            {hasGenerated && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                        {activeRoleData.sector}
                      </span>
                      <span className="text-xs text-slate-500">• {currentExpMeta.label}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {activeRoleData.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      {activeRoleData.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-700 shrink-0">
                    <MapPin className="w-4 h-4 text-blue-800" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Location & Setup</span>
                      <span className="text-xs font-bold text-slate-900">
                        {parsedLocation.regionName} ({parsedLocation.derivedStyle})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Salary Percentile Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* 10th Percentile */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      10th Percentile (Min)
                    </span>
                    <span className="text-2xl font-bold text-slate-800">
                      {formatCurrency(p10)}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">Entry / Starting range</span>
                  </div>

                  {/* 50th Percentile (Median) */}
                  <div className="bg-blue-50/60 border-2 border-blue-800/40 rounded-xl p-5 text-center relative shadow-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                      Market Median
                    </div>
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                      50th Percentile (Average)
                    </span>
                    <span className="text-3xl font-extrabold text-blue-950">
                      {formatCurrency(p50)}
                    </span>
                    <span className="text-[11px] text-blue-900/80 block mt-1">Expected market rate</span>
                  </div>

                  {/* 90th Percentile (Peak) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      90th Percentile (Peak)
                    </span>
                    <span className="text-2xl font-bold text-slate-800">
                      {formatCurrency(p90)}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">Top-tier packages</span>
                  </div>

                </div>

                {/* Market Scarcity & Demand Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-900 rounded-lg shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Market Demand & Availability</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        At median salary (<strong className="text-slate-900">{formatCurrency(p50)}</strong>), candidate availability for <strong className="text-slate-900">{activeRoleData.title}</strong> is rated as <span className="text-blue-900 font-bold">{rawRegionData.demand}</span> with a <strong className="text-emerald-700">{rawRegionData.yoy}</strong> year-on-year market trend.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 bg-white border border-slate-200 px-4 py-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Base vs Bonus Split</span>
                    <span className="text-xs font-bold text-slate-900">{basePct}% Base / {bonusPct}% Variable</span>
                  </div>
                </div>

                {/* B2B Action Box */}
                <div className="bg-blue-950 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold">Looking to hire for this role?</h4>
                    <p className="text-xs text-blue-200 mt-1">
                      Liberty Towers sources pre-screened candidates matched to these benchmarks.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto bg-white hover:bg-slate-100 text-blue-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition flex items-center justify-center space-x-2 shrink-0 shadow-sm"
                  >
                    <span>Request Candidate Shortlist</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        ) : (
          /* Full Directory View */
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Pre-cached Industry Roles</h2>
              <button
                onClick={() => setViewMode('guided')}
                className="text-xs text-blue-900 font-semibold"
              >
                ← Simple Assistant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predefinedRoles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    setRoleInput(r.title);
                    setViewMode('guided');
                    setHasGenerated(true);
                  }}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-800 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-blue-900 uppercase block">{r.sector}</span>
                    <h4 className="text-sm font-bold text-slate-900">{r.title}</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Advisory Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative text-slate-900">
            <h3 className="text-lg font-bold">Speak to a Liberty Towers Advisor</h3>
            <p className="text-xs text-slate-600 mt-1">
              Discuss custom benchmarking or candidate shortlists for your team.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! A Liberty Towers specialist will reach out shortly.'); setShowModal(false); }} className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name / Company</label>
                <input required type="text" placeholder="e.g. Sarah / Acme Corp" className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-800" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email or Phone</label>
                <input required type="text" placeholder="s.jenkins@company.com" className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-800" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Benchmark Query</label>
                <textarea rows={3} placeholder={`Query regarding ${activeRoleData.title} compensation...`} className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-800 text-xs" />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="text-xs text-slate-500 hover:text-slate-900 px-3 py-2">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2 rounded-lg">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img 
              src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png" 
              alt="Liberty Towers" 
              className="h-6 w-auto opacity-80"
            />
            <span>Recruitment without borders. Talent without compromise.</span>
          </div>
          <span>© 2026 Liberty Towers | Executive Search</span>
        </div>
      </footer>

    </div>
  );
}
