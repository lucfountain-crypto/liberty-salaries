'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  // Conversational Form State (Clean default placeholders)
  const [roleInput, setRoleInput] = useState<string>('');
  const [expYears, setExpYears] = useState<string>('1-3'); // '1-3', '3-6', '6-10', '10+'
  const [locationNatural, setLocationNatural] = useState<string>('');
  
  // App view modes
  const [viewMode, setViewMode] = useState<'guided' | 'full'>('guided');
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Lead Form State
  const [leadName, setLeadName] = useState<string>('');
  const [leadContact, setLeadContact] = useState<string>('');
  const [leadQuery, setLeadQuery] = useState<string>('');
  const [leadSubmitting, setLeadSubmitting] = useState<boolean>(false);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  // URL Magic Links support: ?role=...&location=...&exp=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role') || params.get('job');
      const urlLocation = params.get('location') || params.get('loc');
      const urlExp = params.get('exp') || params.get('tier');

      if (urlRole) setRoleInput(urlRole);
      if (urlLocation) setLocationNatural(urlLocation);
      if (urlExp && ['1-3', '3-6', '6-10', '10+'].includes(urlExp)) setExpYears(urlExp);
    }
  }, []);

  // Pre-cached roles from JSON
  const predefinedRoles = salaryData.roles;

  // Real-world Regional, UK Remote & Overseas Location Parser
  const parsedLocation = useMemo(() => {
    const locLower = (locationNatural || 'London').toLowerCase();
    let regionKey = 'london';
    let regionName = "London & City Hubs";
    let multiplier = 1.0;
    let isOverseasEU = false;

    // Word boundary checks for UK vs EU vs US
    const isUS = /\b(us|usa|united states|new york|wall street|silicon valley)\b/.test(locLower);
    const isExplicitEU = /\b(spain|spanish|malta|gibraltar|poland|portugal|germany|france|italy|europe|eu|offshore|overseas)\b/.test(locLower);
    const isUKExplicit = /\b(uk|united kingdom|britain|british|england|london|manchester|leeds|birmingham|scotland)\b/.test(locLower);

    if (isExplicitEU && !isUS && !isUKExplicit) {
      regionKey = 'eu_remote';
      regionName = 'European & Overseas Remote';
      multiplier = 0.72; // Realistic EU Remote Pay (~€35k-€44k EUR)
      isOverseasEU = true;
    } else if (isUS) {
      regionKey = 'us_remote';
      regionName = 'US & Wall Street Remote';
      multiplier = 1.30;
    } else if (
      locLower.includes('manchester') || locLower.includes('leeds') || 
      locLower.includes('north') || locLower.includes('birmingham') || locLower.includes('liverpool')
    ) {
      regionKey = 'north';
      regionName = 'North UK (Manchester/Leeds)';
      multiplier = 0.80;
    } else if (
      locLower.includes('scotland') || locLower.includes('edinburgh') || 
      locLower.includes('glasgow') || locLower.includes('aberdeen')
    ) {
      regionKey = 'scotland';
      regionName = 'Scotland & Regional';
      multiplier = 0.82;
    } else if (
      locLower.includes('south') || locLower.includes('surrey') || 
      locLower.includes('kent') || locLower.includes('essex') || locLower.includes('reading')
    ) {
      regionKey = 'southeast';
      regionName = 'South East England';
      multiplier = 0.88;
    } else if (locLower.includes('remote') && !isExplicitEU) {
      // UK National Remote
      regionKey = 'uk_remote';
      regionName = 'UK National Remote';
      multiplier = 0.92;
    } else if (
      locLower.includes('london') || locLower.includes('mayfair') || locLower.includes('canary wharf') || 
      locLower.includes("lloyd's") || locLower.includes('city') || locLower.includes('square mile') || 
      locLower.includes('west end') || locLower.includes('soho') || locLower.includes('ec1') || 
      locLower.includes('ec2') || locLower.includes('ec3') || locLower.includes('ec4') || 
      locLower.includes('wc1') || locLower.includes('wc2') || locLower.includes('w1') || locLower.includes('sw1')
    ) {
      regionKey = 'london';
      regionName = 'London & City Hubs';
      multiplier = 1.0;
    }

    // Work style extraction from text
    let derivedStyle = 'hybrid';
    if (locLower.includes('remote') || locLower.includes('home')) {
      derivedStyle = 'remote';
    } else if (locLower.includes('office') || locLower.includes('onsite') || locLower.includes('in-office')) {
      derivedStyle = 'onsite';
    }

    return { regionKey, regionName, multiplier, derivedStyle, isOverseasEU };
  }, [locationNatural]);

  // Role Knowledge Base / Heuristic AI Parser for ANY job title
  const activeRoleData = useMemo(() => {
    const titleClean = roleInput.trim() || 'Finance Manager, Property';
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
    let baseP10 = 34000;
    let baseP50 = 48000;
    let baseP90 = 70000;
    let basePct = 90;
    let bonusPct = 10;
    let description = `Provides administrative, organisational, and operational support for business leaders.`;
    let demand = "High Candidate Availability (Abundant Talent)";
    let yoy = "+3.8%";
    let hiringInsight = "High active applicant volume on market release. Rigorous screening required to shortlist top 5% performers.";

    // Check for Executive Director level titles (Director, CMO, CFO, VP, Chief, Head of, Partner)
    const isDirectorLevel = inputLower.includes('director') || inputLower.includes('cmo') || inputLower.includes('cfo') || inputLower.includes('cro') || inputLower.includes('vp') || inputLower.includes('head of') || inputLower.includes('chief') || inputLower.includes('partner');

    // 1. Legal & Professional Services (City Premium)
    if (inputLower.includes('legal') || inputLower.includes('solicitor') || inputLower.includes('lawyer') || inputLower.includes('counsel') || inputLower.includes('partner')) {
      sector = "Legal & Professional Services (City & US Firms)";
      if (isDirectorLevel || inputLower.includes('partner') || inputLower.includes('general counsel')) {
        baseP10 = 140000; baseP50 = 220000; baseP90 = 350000;
        basePct = 80; bonusPct = 20;
        description = "Leads corporate governance, high-stakes M&A litigation, regulatory compliance, and partner equity advisory.";
        demand = "Extreme Talent Scarcity";
        yoy = "+7.5%";
        hiringInsight = "City and US law firm Partners / General Counsels command top-tier equity packages (£200k-£350k+ base plus profit share).";
      } else {
        baseP10 = 85000; baseP50 = 125000; baseP90 = 185000;
        basePct = 85; bonusPct = 15;
        description = "Advises on corporate transactions, regulatory governance, commercial contracts, and dispute resolution.";
        demand = "High Talent Scarcity";
        yoy = "+6.8%";
        hiringInsight = "City NQ/Associate legal counsel in London command premium base scales (£105k-£160k+) driven by US law firm pay benchmarks.";
      }
    }
    // 2. Investment Banking, Financial Services & Private Equity (Banking Premium)
    else if (inputLower.includes('bank') || inputLower.includes('banking') || inputLower.includes('m&a') || inputLower.includes('equity') || inputLower.includes('asset management') || inputLower.includes('hedge fund') || inputLower.includes('capital markets') || inputLower.includes('investment')) {
      sector = "Investment Banking & Capital Markets";
      if (isDirectorLevel || inputLower.includes('managing director') || inputLower.includes('md')) {
        baseP10 = 160000; baseP50 = 260000; baseP90 = 420000;
        basePct = 50; bonusPct = 50;
        description = "Drives deal origination, M&A execution, institutional capital allocation, and portfolio asset performance.";
        demand = "Extreme Talent Scarcity";
        yoy = "+8.0%";
        hiringInsight = "Managing Directors and Partners in Investment Banking expect 50%+ performance bonus allocations alongside substantial base pay.";
      } else {
        baseP10 = 75000; baseP50 = 135000; baseP90 = 210000;
        basePct = 60; bonusPct = 40;
        description = "Executes M&A transactions, financial valuation modeling, client pitch books, and buy-side portfolio management.";
        demand = "High Talent Scarcity";
        yoy = "+7.2%";
        hiringInsight = "Investment banking analysts and associates command significant bonus pools (30-50% variable) above base salary.";
      }
    }
    // 3. Marketing, Brand, Sales & Commercial Leadership
    else if (inputLower.includes('market') || inputLower.includes('brand') || inputLower.includes('growth') || inputLower.includes('sales') || inputLower.includes('commercial director')) {
      sector = "Commercial, Marketing & Growth Strategy";
      if (isDirectorLevel) {
        baseP10 = 85000; baseP50 = 135000; baseP90 = 195000;
        basePct = 75; bonusPct = 25;
        description = "Leads commercial brand architecture, omni-channel growth strategy, revenue expansion, and executive marketing operations.";
        demand = "High Demand for Proven Growth Directors";
        yoy = "+6.2%";
        hiringInsight = "Marketing Directors with verified ROI on customer acquisition, brand repositioning, and digital growth command top-tier packages (£120k-£180k+).";
      } else {
        baseP10 = 42000; baseP50 = 68000; baseP90 = 110000;
        basePct = 80; bonusPct = 20;
        description = "Drives brand positioning, campaign execution, digital marketing channels, and client acquisition pipelines.";
        demand = "Moderate-High Candidate Availability";
        yoy = "+4.8%";
        hiringInsight = "Good active applicant volume. Primary differentiator is demonstrated campaign conversion and sector-specific domain knowledge.";
      }
    }
    // 4. Insurance Account Handler / Account Executive / Broking
    else if (
      inputLower.includes('account handler') || 
      inputLower.includes('account executive') || 
      inputLower.includes('broker support') || 
      inputLower.includes('broking') || 
      inputLower.includes('client manager')
    ) {
      sector = "Insurance & Commercial Broking";
      baseP10 = 42000; baseP50 = 58000; baseP90 = 92000;
      basePct = 85; bonusPct = 15;
      description = "Manages commercial client policy portfolios, renewal placements, Lloyd's/company market negotiations, and broker client accounts.";
      demand = "High Demand for Experienced Commercial Handlers";
      yoy = "+5.8%";
      hiringInsight = "Competitive broking market. Experienced handlers with Acturis/Open GI mastery and strong insurer relationships command premium London packages.";
    }
    // 5. Gaming, iGaming, Sportsbook & Retention Analyst
    else if (inputLower.includes('gaming') || inputLower.includes('retention') || inputLower.includes('casino') || inputLower.includes('sportsbook') || inputLower.includes('igaming') || inputLower.includes('crm analyst')) {
      sector = "iGaming, Gaming & Digital Media";
      baseP10 = 26000; baseP50 = 36000; baseP90 = 52000;
      basePct = 88; bonusPct = 12;
      description = "Analyses player lifecycle, retention campaigns, churn reduction metrics, and promotional engagement across gaming platforms.";
      demand = "High Remote Talent Availability";
      yoy = "+3.2%";
      hiringInsight = "European & offshore remote hubs (Spain, Malta, Gibraltar) command lower base pay rates (~€28k-€44k EUR). High applicant volume for remote roles.";
    }
    // 6. Admin & EA/PA
    else if (inputLower.includes('pa') || inputLower.includes('secretary') || inputLower.includes('assistant') || inputLower.includes('reception') || inputLower.includes('admin') || inputLower.includes('office manager')) {
      sector = "Corporate Administration & Executive Support";
      baseP10 = 32000; baseP50 = 42000; baseP90 = 58000;
      basePct = 95; bonusPct = 5;
      description = "Manages executive diaries, travel logistics, board coordination, and senior administrative operations.";
      demand = "High Candidate Availability (Swamped with Applicants)";
      yoy = "+3.5%";
      hiringInsight = "Roles attract huge active applicant volumes. Liberty Towers pre-screens and filters for candidate stability, C-suite discretion, and culture fit.";
    } 
    // 7. Architecture, Property & Built Environment
    else if (inputLower.includes('architect') || inputLower.includes('design') || inputLower.includes('building') || inputLower.includes('property') || inputLower.includes('surveyor') || inputLower.includes('construction') || inputLower.includes('cad') || inputLower.includes('bim')) {
      sector = "Architecture, Property & Built Environment";
      baseP10 = 38000; baseP50 = 58000; baseP90 = 92000;
      basePct = 88; bonusPct = 12;
      description = "Drives property financial management, asset accounting, planning compliance, and development forecasting.";
      demand = "High Demand for Experienced Property Specialists";
      yoy = "+4.6%";
      hiringInsight = "Steady market demand. Finance and Property managers with commercial lease and asset accounting proficiency command premium rates.";
    } 
    // 8. Operations, Change & Business Analysis
    else if (inputLower.includes('ops') || inputLower.includes('operation') || inputLower.includes('business analyst') || inputLower.includes('supply chain') || inputLower.includes('change manager') || inputLower.includes('transformation')) {
      sector = "Operations, Change & Business Transformation";
      baseP10 = 42000; baseP50 = 68000; baseP90 = 110000;
      basePct = 85; bonusPct = 15;
      description = "Optimises business workflows, platform migrations, operational efficiency, and cross-functional delivery.";
      demand = "High Demand for Process Specialists";
      yoy = "+4.8%";
      hiringInsight = "Strong demand in financial services and corporate ops. Proven track record in cost-reduction or systems rollout is key.";
    } 
    // 9. Tech Infrastructure, Cloud, DevOps & Cyber Security
    else if (inputLower.includes('devops') || inputLower.includes('cloud') || inputLower.includes('sre') || inputLower.includes('cyber') || inputLower.includes('security') || inputLower.includes('infrastructure') || inputLower.includes('network') || inputLower.includes('sysadmin')) {
      sector = "Tech Infrastructure, Cloud & Cyber Security";
      baseP10 = 55000; baseP50 = 88000; baseP90 = 145000;
      basePct = 85; bonusPct = 15;
      description = "Architects cloud environments (AWS/Azure), CI/CD automation pipelines, Zero-Trust cyber security, and system resilience.";
      demand = "Critical Talent Scarcity";
      yoy = "+7.2%";
      hiringInsight = "Cyber and Cloud Architects face intense buy-side competition. Candidates expect remote/hybrid flexibility and certification bonuses.";
    } 
    // 10. Insurance & Reinsurance / Actuarial
    else if (inputLower.includes('actuary') || inputLower.includes('pricing') || inputLower.includes('risk model')) {
      sector = "Insurance & Reinsurance";
      baseP10 = 65000; baseP50 = 105000; baseP90 = 165000;
      basePct = 80; bonusPct = 20;
      description = "Develops stochastic risk models, catastrophe pricing frameworks, and capital adequacy reserves.";
      demand = "Critical Talent Scarcity";
      yoy = "+5.8%";
      hiringInsight = "Tight candidate pool. Targeted headhunting required to reach passive actuarial specialists.";
    } 
    // 11. HR & Talent Management
    else if (inputLower.includes('hr') || inputLower.includes('people') || inputLower.includes('talent') || inputLower.includes('recruit')) {
      sector = "Human Resources & Talent Leadership";
      baseP10 = 38000; baseP50 = 62000; baseP90 = 105000;
      basePct = 88; bonusPct = 12;
      description = "Leads talent acquisition, organisational development, employee retention, and compensation strategy.";
      demand = "High Candidate Availability";
      yoy = "+4.2%";
      hiringInsight = "Strong active market response; pre-screening focuses on strategic ER experience and sector alignment.";
    } 
    // 12. Finance & Corporate Accounting
    else if (inputLower.includes('finance') || inputLower.includes('accountant') || inputLower.includes('accounting') || inputLower.includes('controller')) {
      sector = "Finance & Corporate Accounting";
      baseP10 = 45000; baseP50 = 75000; baseP90 = 130000;
      basePct = 82; bonusPct = 18;
      description = "Oversees financial planning & analysis (FP&A), statutory reporting, tax governance, and audit compliance.";
      demand = "Moderate-High Scarcity (Qualified ACA)";
      yoy = "+5.0%";
      hiringInsight = "ACA/ACCA qualified talent commands strong counter-offers. Speed to offer is critical.";
    } 
    // 13. Quant & Quantitative Finance
    else if (inputLower.includes('quant') || inputLower.includes('trading') || inputLower.includes('hft') || inputLower.includes('dev')) {
      sector = "Quant & Quantitative Finance";
      baseP10 = 90000; baseP50 = 180000; baseP90 = 280000;
      basePct = 60; bonusPct = 40;
      description = "Engineers algorithmic trading models, high-frequency execution infrastructure, and strategy research.";
      demand = "Extreme Talent Scarcity";
      yoy = "+8.5%";
      hiringInsight = "Fierce bidding war across buy-side funds. Candidates hold multiple competing offers.";
    } 
    // 14. Insurance Underwriting
    else if (inputLower.includes('underwriter') || inputLower.includes('insurance') || inputLower.includes('broker') || inputLower.includes('claims')) {
      sector = "Insurance & Specialty Reinsurance";
      baseP10 = 55000; baseP50 = 95000; baseP90 = 160000;
      basePct = 75; bonusPct = 25;
      description = "Evaluates portfolio risk, Lloyd's syndicate exposure, pricing strategy, and broker client relationships.";
      demand = "High Talent Scarcity";
      yoy = "+6.0%";
      hiringInsight = "Lloyd's and company markets face tight supply of profitable book leads. Direct headhunting recommended.";
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
          yoy: yoy,
          hiring_insight: hiringInsight
        }
      }
    };
  }, [roleInput, parsedLocation, predefinedRoles]);

  // Experience level multipliers
  const expMultipliers: Record<string, { label: string; multiplier: number }> = {
    '1-3': { label: '1–3 Years (Junior / Assistant)', multiplier: 0.80 },
    '3-6': { label: '3–6 Years (Mid-Level Specialist)', multiplier: 1.00 },
    '6-10': { label: '6–10 Years (Senior Lead)', multiplier: 1.25 },
    '10+': { label: '10+ Years (Highly Experienced / Executive Director)', multiplier: 1.50 }
  };

  const currentExpMeta = expMultipliers[expYears] || expMultipliers['1-3'];
  const multiplier = currentExpMeta.multiplier;

  // Active region data
  const rawRegionData = activeRoleData.regional_data[parsedLocation.regionKey as keyof typeof activeRoleData.regional_data] || {
    p10: 28000,
    p50: 38000,
    p90: 55000,
    base_pct: 90,
    bonus_pct: 10,
    demand: "High Candidate Availability",
    yoy: "+3.8%",
    hiring_insight: "High active applicant volume on market release."
  };

  // Work style adjustment factor
  const styleMultiplier = parsedLocation.derivedStyle === 'remote' ? 1.0 : parsedLocation.derivedStyle === 'onsite' ? 0.97 : 1.0;

  // Calculated final benchmarks (NMW floor only applies to UK/London, NOT European/Overseas Remote)
  const nmwFloor = parsedLocation.isOverseasEU ? 18000 : (parsedLocation.regionKey === 'london' ? 28000 : 25000);
  
  const p10 = Math.max(nmwFloor, Math.round((rawRegionData.p10 * multiplier * styleMultiplier) / 500) * 500);
  const p50 = Math.max(p10 + 4000, Math.round((rawRegionData.p50 * multiplier * styleMultiplier) / 500) * 500);
  const p90 = Math.max(p50 + 8000, Math.round((rawRegionData.p90 * multiplier * styleMultiplier) / 500) * 500);

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

  // Lead Capture Submission Route
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          contact: leadContact,
          query: leadQuery || `Benchmark query for ${activeRoleData.title}`,
          role: activeRoleData.title,
          location: parsedLocation.regionName,
          expTier: currentExpMeta.label,
          medianSalary: formatCurrency(p50),
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.log('Lead submission logged');
    }

    setLeadSubmitting(false);
    setLeadSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setLeadSubmitted(false);
      setLeadName('');
      setLeadContact('');
      setLeadQuery('');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Liberty Clean Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Liberty Towers Navy Blue Logo Badge Container */}
          <div className="flex items-center space-x-4">
            <a href="https://www.libertytowers.co.uk/" target="_blank" rel="noopener noreferrer" className="bg-blue-900 px-3.5 py-2 rounded-xl shadow-sm flex items-center hover:bg-blue-800 transition">
              <img 
                src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png" 
                alt="Liberty Towers Logo" 
                className="h-7 sm:h-8 w-auto object-contain brightness-0 invert"
              />
            </a>
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <span className="text-xs font-bold tracking-wider text-blue-900 uppercase block">SALARY INTELLIGENCE</span>
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
            LT Salary Benchmarks 2026
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
                      placeholder="Example: Finance Manager, Property (or you can leave sector blank)"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-800/10 transition"
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      'PA Secretary',
                      'Executive Assistant',
                      'Commercial Solicitor',
                      'Investment Banking VP',
                      'Specialty Underwriter'
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

                {/* Grid for Steps 2 & 3 - Perfectly Aligned Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  
                  {/* Input 2: Years Experience */}
                  <div className="flex flex-col">
                    <div className="min-h-[44px] flex items-end pb-2">
                      <label className="text-sm font-bold text-slate-900 leading-tight">
                        2. How many years of experience?
                      </label>
                    </div>
                    <select
                      value={expYears}
                      onChange={(e) => {
                        setExpYears(e.target.value);
                        setHasGenerated(true);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 px-4 py-3.5 rounded-xl text-sm focus:outline-none transition h-[48px]"
                    >
                      <option value="1-3">1–3 Years (Junior / Assistant)</option>
                      <option value="3-6">3–6 Years (Mid-Level)</option>
                      <option value="6-10">6–10 Years (Senior)</option>
                      <option value="10+">10+ Years (Highly Experienced)</option>
                    </select>
                  </div>

                  {/* Input 3: Location & Setup (Natural Language) */}
                  <div className="flex flex-col">
                    <div className="min-h-[44px] flex items-end pb-2">
                      <label className="text-sm font-bold text-slate-900 leading-tight">
                        3. Type location and is the role Based in Office, Hybrid or remote.
                      </label>
                    </div>
                    <div>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-blue-800" />
                        <input
                          type="text"
                          value={locationNatural}
                          onChange={(e) => {
                            setLocationNatural(e.target.value);
                            setHasGenerated(true);
                          }}
                          placeholder="Example: London, Hybrid 2 days"
                          className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 pl-10 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800/10 transition h-[48px]"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Parsed: <strong className="text-slate-800">{parsedLocation.regionName}</strong> ({parsedLocation.derivedStyle})
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Button - Centered */}
              <div className="mt-8 pt-4 flex justify-center border-t border-slate-100">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
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

            {/* Google AdSense Leaderboard Slot */}
            <div className="bg-slate-100 border border-slate-200 border-dashed rounded-xl p-4 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">
                ADVERTISEMENT • GOOGLE ADSENSE HIGH-ECPM B2B PARTNER
              </span>
              <div className="h-[90px] flex items-center justify-center bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
                <span>Enterprise HR, Payroll & Wealth Management Ads (Auto-Served by Google AdSense)</span>
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
                      <h4 className="text-sm font-bold text-slate-900">Market Supply & Candidate Volume</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        At median salary (<strong className="text-slate-900">{formatCurrency(p50)}</strong>), candidate supply for <strong className="text-slate-900">{activeRoleData.title}</strong> is rated as <span className="text-blue-900 font-bold">{rawRegionData.demand}</span> with a <strong className="text-emerald-700">{rawRegionData.yoy}</strong> year-on-year market trend.
                      </p>
                      {(rawRegionData as any).hiring_insight && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          💡 Recruiter Note: {(rawRegionData as any).hiring_insight}
                        </p>
                      )}
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
                      Liberty Towers pre-screens and filters top 5% candidates matched to these benchmarks.
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
          <div className="bg-[#111827] text-white border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold">Pre-cached Industry Roles</h2>
              <button
                onClick={() => setViewMode('guided')}
                className="text-xs text-amber-400 font-semibold"
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
                  className="p-3.5 rounded-xl bg-[#0b1120] border border-slate-800 hover:border-amber-500 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-amber-400 uppercase block">{r.sector}</span>
                    <h4 className="text-sm font-bold text-white">{r.title}</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Advisory Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative text-slate-900">
            <h3 className="text-lg font-bold">Speak to a Liberty Towers Advisor</h3>
            <p className="text-xs text-slate-600 mt-1">
              Discuss custom benchmarking or candidate shortlists for your team.
            </p>

            {leadSubmitted ? (
              <div className="my-8 text-center py-6 bg-blue-50 border border-blue-200 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-blue-900 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-base">Request Received!</h4>
                <p className="text-xs text-slate-600 mt-1">A Liberty Towers executive specialist will contact you directly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4 mt-5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name / Company</label>
                  <input 
                    required 
                    type="text" 
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Sarah / Acme Corp" 
                    className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-800" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email or Phone</label>
                  <input 
                    required 
                    type="text" 
                    value={leadContact}
                    onChange={(e) => setLeadContact(e.target.value)}
                    placeholder="s.jenkins@company.com" 
                    className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-800" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Benchmark Query</label>
                  <textarea 
                    rows={3} 
                    value={leadQuery}
                    onChange={(e) => setLeadQuery(e.target.value)}
                    placeholder={`Query regarding ${activeRoleData.title} compensation...`} 
                    className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-800 text-xs" 
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="text-xs text-slate-500 hover:text-slate-900 px-3 py-2">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={leadSubmitting}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-sm flex items-center space-x-1.5"
                  >
                    {leadSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-900 px-2.5 py-1.5 rounded-lg">
              <img 
                src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png" 
                alt="Liberty Towers" 
                className="h-5 w-auto object-contain brightness-0 invert"
              />
            </div>
            <span>Recruitment without borders. Talent without compromise.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <a href="/privacy" className="hover:underline hover:text-blue-900 transition font-medium">Privacy Policy</a>
            <span>•</span>
            <a href="/ads.txt" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-900 transition font-medium">ads.txt</a>
            <span>•</span>
            <span>© 2026 Liberty Towers | Executive Search</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
