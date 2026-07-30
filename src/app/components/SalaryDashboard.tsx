'use client';

import React, { useState, useMemo } from 'react';
import salaryData from '@/data/salaries.json';
import { 
  Search, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Award, 
  Download, 
  Sparkles,
  Zap,
  BarChart3,
  Users,
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';

export default function SalaryDashboard() {
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [selectedRegion, setSelectedRegion] = useState<string>('london');
  const [selectedExpTier, setSelectedExpTier] = useState<string>('senior');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(salaryData.roles[0].id);
  const [showModal, setShowModal] = useState<boolean>(false);

  const sectors = ['All Sectors', ...salaryData.meta.sectors];
  const regions = salaryData.meta.regions;
  const expTiers = salaryData.meta.experience_tiers || [
    { id: "junior", name: "1–3 Years (Junior / Associate)", multiplier: 0.72 },
    { id: "mid", name: "3–6 Years (Mid-Level)", multiplier: 0.88 },
    { id: "senior", name: "6–10 Years (Senior Lead)", multiplier: 1.00 },
    { id: "lead_exec", name: "10+ Years (Principal / Director)", multiplier: 1.35 }
  ];

  // Current selected experience tier multiplier
  const currentExpMeta = expTiers.find(e => e.id === selectedExpTier) || expTiers[2];
  const expMultiplier = currentExpMeta.multiplier;

  // Filter roles based on search and sector
  const filteredRoles = useMemo(() => {
    return salaryData.roles.filter(role => {
      const matchesSector = selectedSector === 'All Sectors' || role.sector === selectedSector;
      const matchesSearch = searchQuery === '' || 
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesSearch;
    });
  }, [selectedSector, searchQuery]);

  // Active selected role
  const activeRole = useMemo(() => {
    return salaryData.roles.find(r => r.id === selectedRoleId) || filteredRoles[0] || salaryData.roles[0];
  }, [selectedRoleId, filteredRoles]);

  // Raw region data for current role
  const rawRegionData = activeRole.regional_data[selectedRegion as keyof typeof activeRole.regional_data] || activeRole.regional_data.london;
  const currentRegionMeta = regions.find(r => r.id === selectedRegion) || regions[0];

  // Calculated adjusted percentile numbers based on Experience Level Multiplier
  const currentRegionData = {
    ...rawRegionData,
    p10: Math.round((rawRegionData.p10 * expMultiplier) / 500) * 500,
    p50: Math.round((rawRegionData.p50 * expMultiplier) / 500) * 500,
    p90: Math.round((rawRegionData.p90 * expMultiplier) / 500) * 500,
  };

  // Sector summary
  const sectorSummary = salaryData.sector_summaries[activeRole.sector as keyof typeof salaryData.sector_summaries] || {
    macro_trend: "Steady demand across all mid and senior tiers in Q1 2026.",
    scarcity_index: "High",
    hot_roles: []
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header / Branding */}
      <header className="border-b border-slate-800/80 bg-[#0c1220]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-amber-400 text-lg tracking-wider">LT</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-white text-lg">LIBERTY TOWERS</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Market Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400">Compensation Benchmarks & Talent Intelligence • 2026</p>
            </div>
          </div>

          {/* Live Status Badge & Actions */}
          <div className="flex items-center justify-between md:justify-end space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Benchmarks • {salaryData.meta.updated_at} Edition</span>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wide shadow-md shadow-amber-500/10 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e1628] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Free Unlocked Industry Data • Experience & Regional Adjusted</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              UK Salary & Executive Compensation <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400 bg-clip-text text-transparent">Benchmarks</span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real-time percentile distributions (10th, 50th, 90th), experience level tiers (1-10+ yrs), base vs. bonus allocations, and regional variance indicators across top UK institutions.
            </p>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 uppercase font-medium">Roles Benchmarked</p>
                <p className="text-xl font-bold text-amber-400">{salaryData.meta.total_roles_benchmarked}+</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 uppercase font-medium">Sectors Covered</p>
                <p className="text-xl font-bold text-white">{salaryData.meta.sectors.length}</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 uppercase font-medium">Experience Tiers</p>
                <p className="text-xl font-bold text-emerald-400">{expTiers.length} Seniorities</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 uppercase font-medium">Data Cycle</p>
                <p className="text-xl font-bold text-cyan-400">Monthly Fresh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section: Search + Sectors + Experience + Regions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl backdrop-blur-sm">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by job title, role, skill, or keyword (e.g. 'Project Manager', 'Underwriter', 'Quant')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Sector</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedSector === sec
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level & Seniority Selector */}
          <div className="space-y-2 pt-1 border-t border-slate-800/60">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Experience & Seniority Level</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {expTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedExpTier(tier.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
                    selectedExpTier === tier.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  {tier.name}
                </button>
              ))}
            </div>
          </div>

          {/* Region Selector */}
          <div className="space-y-2 pt-1 border-t border-slate-800/60">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Region Benchmark</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
                    selectedRegion === reg.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  {reg.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Role Selection List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Benchmarked Roles ({filteredRoles.length})</span>
              </h2>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {filteredRoles.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                  <p className="text-slate-400 text-sm">No roles found matching "{searchQuery}".</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedSector('All Sectors'); }}
                    className="text-xs text-amber-400 hover:underline font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredRoles.map((role) => {
                  const regData = role.regional_data[selectedRegion as keyof typeof role.regional_data] || role.regional_data.london;
                  const adjMedian = Math.round((regData.p50 * expMultiplier) / 500) * 500;
                  const isSelected = activeRole.id === role.id;

                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-slate-850 border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 block">
                            {role.sector}
                          </span>
                          <h3 className="text-sm font-bold text-white leading-snug">{role.title}</h3>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold whitespace-nowrap ${
                          regData.demand === 'Critical Scarcity' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          regData.demand === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {regData.demand}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                        <span className="text-slate-400">Median ({currentExpMeta.name.split(' ')[0]}):</span>
                        <span className="font-bold text-white">{formatCurrency(adjMedian)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* AdSense Unit Placeholder #1 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-slate-600 block">ADVERTISEMENT</span>
              <div className="py-4 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                Google AdSense Partner Spot
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Salary Gauge & Analytics */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Interactive Salary Gauge Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

              {/* Role Title & Filters Summary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                    <span>{activeRole.sector}</span>
                    <span>•</span>
                    <span className="text-slate-400">{activeRole.category}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">{activeRole.title}</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">{activeRole.description}</p>
                </div>

                <div className="sm:text-right shrink-0 space-y-1">
                  <div>
                    <span className="text-xs text-slate-400">Region: </span>
                    <span className="text-xs font-bold text-cyan-400">{currentRegionMeta.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Experience: </span>
                    <span className="text-xs font-bold text-emerald-400">{currentExpMeta.name}</span>
                  </div>
                  <div className="text-xs text-amber-400 font-semibold flex items-center sm:justify-end space-x-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{currentRegionData.yoy} YoY Increment</span>
                  </div>
                </div>
              </div>

              {/* THE SALARY GAUGE DISPLAY */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>Compensation Distribution ({currentExpMeta.name})</span>
                  </h3>
                  <span className="text-xs text-slate-400">Base Salary Range (£ GBP)</span>
                </div>

                {/* 3 Percentile Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {/* 10th Percentile */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Lowest (10th%)</span>
                    <p className="text-lg sm:text-2xl font-black text-slate-300">{formatCurrency(currentRegionData.p10)}</p>
                    <span className="text-[10px] text-slate-500 block">Entry Tier Band</span>
                  </div>

                  {/* 50th Percentile (MEDIAN HERO) */}
                  <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/10 to-amber-950/30 border border-amber-500/40 text-center space-y-1 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Average (50th%)</span>
                    <p className="text-xl sm:text-3xl font-black text-amber-300">{formatCurrency(currentRegionData.p50)}</p>
                    <span className="text-[10px] text-amber-400/80 block font-medium">Market Median Benchmark</span>
                  </div>

                  {/* 90th Percentile */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Highest (90th%)</span>
                    <p className="text-lg sm:text-2xl font-black text-slate-300">{formatCurrency(currentRegionData.p90)}</p>
                    <span className="text-[10px] text-slate-500 block">Top Tier / Outperformer</span>
                  </div>
                </div>

                {/* Visual Gauge Bar */}
                <div className="space-y-2 pt-2">
                  <div className="relative h-4 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-slate-700 via-amber-500 to-amber-300 relative"
                      style={{ width: '100%' }}
                    >
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-1 w-2 bg-white rounded-full shadow-md shadow-amber-500/80"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
                    <span>10th Percentile ({formatCurrency(currentRegionData.p10)})</span>
                    <span className="text-amber-400 font-bold">50th Median ({formatCurrency(currentRegionData.p50)})</span>
                    <span>90th Percentile ({formatCurrency(currentRegionData.p90)})</span>
                  </div>
                </div>
              </div>

              {/* Base vs Bonus Split & Scarcity Indicator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Base vs Bonus split */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Total Package Allocation</span>
                    <span className="text-amber-400 font-bold">{currentRegionData.bonus_pct}% Target Bonus</span>
                  </div>

                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="bg-amber-500 h-full" style={{ width: `${currentRegionData.base_pct}%` }}></div>
                    <div className="bg-cyan-400 h-full" style={{ width: `${currentRegionData.bonus_pct}%` }}></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span>Base Salary ({currentRegionData.base_pct}%)</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                      <span>Bonus / Variable ({currentRegionData.bonus_pct}%)</span>
                    </span>
                  </div>
                </div>

                {/* Scarcity & Candidate Pool Availability */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Talent Pool Availability</span>
                    <span className="text-xs font-bold text-red-400">{currentRegionData.demand}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    At median salary ({formatCurrency(currentRegionData.p50)}), active candidate availability is rated as <strong className="text-white">{currentRegionData.demand}</strong> for {currentExpMeta.name.toLowerCase()}.
                  </p>

                  <div className="pt-1 flex items-center space-x-1 text-[11px] text-amber-400 font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Hiring advice: Packages at 75th%+ required to attract passive talent.</span>
                  </div>
                </div>
              </div>

              {/* Key Insights Bullets */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Key Market & Compensation Drivers</span>
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                  {activeRole.key_insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cross-Regional Comparison Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Regional Salary Breakdown for {activeRole.title} ({currentExpMeta.name.split(' ')[0]})</span>
                  </h3>
                  <p className="text-xs text-slate-400">Compare compensation benchmarks across top geographic hubs.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Region</th>
                      <th className="p-3">10th Percentile</th>
                      <th className="p-3">50th (Median)</th>
                      <th className="p-3">90th Percentile</th>
                      <th className="p-3">YoY Trend</th>
                      <th className="p-3">Scarcity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {regions.map((reg) => {
                      const regD = activeRole.regional_data[reg.id as keyof typeof activeRole.regional_data];
                      if (!regD) return null;
                      const isCurrent = reg.id === selectedRegion;

                      const adj10 = Math.round((regD.p10 * expMultiplier) / 500) * 500;
                      const adj50 = Math.round((regD.p50 * expMultiplier) / 500) * 500;
                      const adj90 = Math.round((regD.p90 * expMultiplier) / 500) * 500;

                      return (
                        <tr 
                          key={reg.id} 
                          onClick={() => setSelectedRegion(reg.id)}
                          className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                            isCurrent ? 'bg-cyan-500/10 font-medium' : ''
                          }`}
                        >
                          <td className="p-3 font-semibold text-white flex items-center space-x-2">
                            {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>}
                            <span>{reg.name}</span>
                          </td>
                          <td className="p-3 text-slate-300">{formatCurrency(adj10)}</td>
                          <td className="p-3 font-bold text-amber-400">{formatCurrency(adj50)}</td>
                          <td className="p-3 text-slate-300">{formatCurrency(adj90)}</td>
                          <td className="p-3 text-emerald-400 font-medium">{regD.yoy}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              regD.demand === 'Critical Scarcity' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {regD.demand}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Macro Sector Intelligence Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{activeRole.sector} Market Commentary</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {sectorSummary.macro_trend}
              </p>
            </div>

            {/* AdSense Placement Banner #2 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-slate-600 block">ADVERTISEMENT</span>
              <div className="py-6 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                Google AdSense Responsive Leaderboard Banner
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Bottom Sticky Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-[#0c1220]/95 backdrop-blur-md border-t border-slate-800 py-3.5 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 hidden sm:flex">
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Hiring for roles at these market benchmarks?</p>
              <p className="text-[11px] text-slate-400">Liberty Towers sources top 5% pre-screened candidates within 48 hours.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Request Candidate Shortlist
            </button>
          </div>
        </div>
      </div>

      {/* Lead Modal Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 relative shadow-2xl">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Liberty Towers Executive Search</span>
              <h3 className="text-xl font-bold text-white">Request Bespoke Market Shortlist</h3>
              <p className="text-xs text-slate-400">Get pre-vetted candidate benchmarks tailored to your exact team structure.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Request sent! A Liberty Towers specialist will contact you shortly.'); setShowModal(false); }} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Your Name / Title</label>
                <input required type="text" placeholder="e.g. Sarah Jenkins (Head of Talent)" className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Company Email</label>
                <input required type="email" placeholder="e.g. s.jenkins@company.com" className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Target Role & Salary Band</label>
                <input type="text" defaultValue={`${activeRole.title} - ${currentExpMeta.name} (${formatCurrency(currentRegionData.p50)})`} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Submit Shortlist Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 pb-24 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-300">Liberty Towers Compensation Intelligence Platform</p>
            <p className="mt-1">© {new Date().getFullYear()} Liberty Towers. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 text-slate-400">
            <a href="https://libertytowers.co.uk" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">Main Site</a>
            <span>•</span>
            <span className="hover:text-slate-200">Data Sources</span>
            <span>•</span>
            <span className="hover:text-slate-200">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
