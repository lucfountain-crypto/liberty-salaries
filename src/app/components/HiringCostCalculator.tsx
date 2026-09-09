'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Clock,
  TrendingUp,
  Printer,
  ShieldCheck,
  Building2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  DEFAULT_INPUTS,
  SENIORITY_PRESETS,
  parseInputs,
  calculateVacancyCosts,
  HiringCostInputs,
  CalculationResult,
} from '@/lib/hiring-cost-model';

const moneyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

export default function HiringCostCalculator() {
  const [rawInputs, setRawInputs] = useState({
    annualSalary: numberFormatter.format(DEFAULT_INPUTS.annualSalary),
    vacantWeeks: numberFormatter.format(DEFAULT_INPUTS.vacantWeeks),
    productivityLoss: numberFormatter.format(DEFAULT_INPUTS.productivityLoss),
    managementHours: numberFormatter.format(DEFAULT_INPUTS.managementHours),
    managementHourlyCost: numberFormatter.format(DEFAULT_INPUTS.managementHourlyCost),
    advertisingSpend: numberFormatter.format(DEFAULT_INPUTS.advertisingSpend),
    recruitmentFees: numberFormatter.format(DEFAULT_INPUTS.recruitmentFees),
  });

  const [activePreset, setActivePreset] = useState<string | null>(null);

  const parsed = useMemo(() => parseInputs(rawInputs), [rawInputs]);

  const calculationResult: CalculationResult | null = useMemo(() => {
    if (!parsed.ok) return null;
    try {
      return calculateVacancyCosts(parsed.values);
    } catch {
      return null;
    }
  }, [parsed]);

  const handleInputChange = (field: keyof HiringCostInputs, val: string) => {
    setActivePreset(null);
    setRawInputs((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = SENIORITY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    setRawInputs({
      annualSalary: numberFormatter.format(preset.inputs.annualSalary),
      vacantWeeks: numberFormatter.format(preset.inputs.vacantWeeks),
      productivityLoss: numberFormatter.format(preset.inputs.productivityLoss),
      managementHours: numberFormatter.format(preset.inputs.managementHours),
      managementHourlyCost: numberFormatter.format(preset.inputs.managementHourlyCost),
      advertisingSpend: numberFormatter.format(preset.inputs.advertisingSpend),
      recruitmentFees: numberFormatter.format(preset.inputs.recruitmentFees),
    });
  };

  const handleReset = () => {
    setActivePreset(null);
    setRawInputs({
      annualSalary: numberFormatter.format(DEFAULT_INPUTS.annualSalary),
      vacantWeeks: numberFormatter.format(DEFAULT_INPUTS.vacantWeeks),
      productivityLoss: numberFormatter.format(DEFAULT_INPUTS.productivityLoss),
      managementHours: numberFormatter.format(DEFAULT_INPUTS.managementHours),
      managementHourlyCost: numberFormatter.format(DEFAULT_INPUTS.managementHourlyCost),
      advertisingSpend: numberFormatter.format(DEFAULT_INPUTS.advertisingSpend),
      recruitmentFees: numberFormatter.format(DEFAULT_INPUTS.recruitmentFees),
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-900 selection:text-white font-sans print:bg-white print:text-black">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/" className="bg-blue-900 px-3.5 py-2 rounded-xl shadow-sm flex items-center hover:bg-blue-800 transition">
              <img
                src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png"
                alt="Liberty Towers Logo"
                className="h-7 sm:h-8 w-auto object-contain brightness-0 invert"
              />
            </a>
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <span className="text-xs font-bold tracking-wider text-blue-900 uppercase block">EMPLOYER TOOLS · COST MODEL</span>
            </div>
          </div>
          <nav className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium">
            <a href="/salaries" className="text-slate-600 hover:text-blue-900 transition">
              Salary Guides
            </a>
            <a href="/cv-review" className="text-slate-600 hover:text-blue-900 transition">
              CV Review
            </a>
            <a href="/profile-review" className="text-slate-600 hover:text-blue-900 transition">
              LinkedIn Review
            </a>
            <a
              href="/contact"
              className="bg-blue-950 hover:bg-blue-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
            >
              Contact Advisory
            </a>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Printable Header (Visible only when printed) */}
        <div className="hidden print:block mb-8 pb-4 border-b border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Liberty Towers · Cost of Vacancy Assessment</h1>
              <p className="text-xs text-slate-500">Corporate Advisory & Search · London, UK · www.liberty-towers.org</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
              <p>CONFIDENTIAL BUSINESS CASE</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-4">
            <Calculator className="w-3.5 h-3.5 text-blue-700" />
            Executive Hiring Intelligence
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
            UK Hiring Cost & Vacancy Calculator
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Quantify the true commercial cost of an unfilled position: lost productivity, management interview time, and projected financial exposure over 30, 60, and 90 days of continued delay.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Private (Runs In Browser)
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Calibrated to UK Corporate Standards
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              30 / 60 / 90 Day Delay Scenarios
            </span>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-900" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">Quick Seniority Presets:</span>
              <span className="text-xs text-slate-500 hidden md:inline">Click to pre-fill typical market metrics</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {SENIORITY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activePreset === preset.id
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 bg-transparent hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                title="Reset to default example"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Vacancy Parameters</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Role remuneration and elapsed vacancy duration</p>
                </div>
                <span className="text-[11px] font-semibold bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md">
                  All figures in GBP (£)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Annual Salary */}
                <div>
                  <label htmlFor="annualSalary" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Annual Base Salary <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      £
                    </span>
                    <input
                      id="annualSalary"
                      type="text"
                      inputMode="decimal"
                      value={rawInputs.annualSalary}
                      onChange={(e) => handleInputChange('annualSalary', e.target.value)}
                      className={`block w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition ${
                        parsed.errors.annualSalary
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-300 focus:ring-blue-900/20 focus:border-blue-900'
                      }`}
                      placeholder="60,000"
                    />
                  </div>
                  {parsed.errors.annualSalary ? (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {parsed.errors.annualSalary}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-slate-400">Target annual remuneration for the position.</p>
                  )}
                </div>

                {/* Weeks Vacant */}
                <div>
                  <label htmlFor="vacantWeeks" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Weeks Role Has Been Vacant <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      id="vacantWeeks"
                      type="text"
                      inputMode="decimal"
                      value={rawInputs.vacantWeeks}
                      onChange={(e) => handleInputChange('vacantWeeks', e.target.value)}
                      className={`block w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition ${
                        parsed.errors.vacantWeeks
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-300 focus:ring-blue-900/20 focus:border-blue-900'
                      }`}
                      placeholder="8"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
                      weeks
                    </span>
                  </div>
                  {parsed.errors.vacantWeeks ? (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {parsed.errors.vacantWeeks}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-slate-400">Total duration unfilled so far (part weeks accepted).</p>
                  )}
                </div>

                {/* Productivity Loss */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="productivityLoss" className="block text-xs font-bold text-slate-700">
                      Estimated Daily Productivity Loss <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[11px] text-blue-900 font-semibold">{rawInputs.productivityLoss}% Loss</span>
                  </div>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      id="productivityLoss"
                      type="text"
                      inputMode="decimal"
                      value={rawInputs.productivityLoss}
                      onChange={(e) => handleInputChange('productivityLoss', e.target.value)}
                      className={`block w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition ${
                        parsed.errors.productivityLoss
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-300 focus:ring-blue-900/20 focus:border-blue-900'
                      }`}
                      placeholder="30"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                      %
                    </span>
                  </div>
                  {parsed.errors.productivityLoss ? (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {parsed.errors.productivityLoss}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Net lost capacity (0-100%) after internal cover or redistribution. 30% is a standard baseline assumption.
                    </p>
                  )}
                </div>
              </div>

              {/* Section 2: Management & Spend */}
              <div className="border-t border-slate-100 pt-6 mt-6 mb-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Time & Recruitment Costs Incurred</h2>
                <p className="text-xs text-slate-500 mt-0.5">Direct costs committed to date (enter 0 if none)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Management Hours */}
                <div>
                  <label htmlFor="managementHours" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Interview & Management Hours
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      id="managementHours"
                      type="text"
                      inputMode="decimal"
                      value={rawInputs.managementHours}
                      onChange={(e) => handleInputChange('managementHours', e.target.value)}
                      className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
                      placeholder="20"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
                      hours
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">Total person-hours spent reviewing, interviewing, and briefing.</p>
                </div>

                {/* Management Hourly Cost */}
                <div>
                  <label htmlFor="managementHourlyCost" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hourly Management Cost
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      £
                    </span>
                    <input
                      id="managementHourlyCost"
                      type="text"
                      inputMode="decimal"
                      value={rawInputs.managementHourlyCost}
                      onChange={(e) => handleInputChange('managementHourlyCost', e.target.value)}
                      className={`block w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition ${
                        parsed.errors.managementHourlyCost
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-300 focus:ring-blue-900/20 focus:border-blue-900'
                      }`}
                      placeholder="50"
                    />
                  </div>
                  {parsed.errors.managementHourlyCost ? (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {parsed.errors.managementHourlyCost}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-slate-400">Blended cost per hour of participating managers/partners.</p>
                  )}
                </div>

                {/* Advertising Spend */}
                <div>
                  <label htmlFor="advertisingSpend" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Advertising & Job Board Spend
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      £
                    </span>
                    <input
                      id="advertisingSpend"
                      type="text"
                      inputMode="decimal"
                      value={rawInputs.advertisingSpend}
                      onChange={(e) => handleInputChange('advertisingSpend', e.target.value)}
                      className="block w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
                      placeholder="0"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">Direct spend committed to boards, LinkedIn slots, or media.</p>
                </div>

                {/* Recruitment Fees */}
                <div>
                  <label htmlFor="recruitmentFees" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Recruitment Fees Incurred So Far
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      £
                    </span>
                    <input
                      id="recruitmentFees"
                      type="text"
                      inputMode="decimal"
                      value={rawInputs.recruitmentFees}
                      onChange={(e) => handleInputChange('recruitmentFees', e.target.value)}
                      className="block w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
                      placeholder="0"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">Retainers or fees already paid (exclude contingent fees payable on hire).</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Calculated purely client-side
                </span>
                <span>Values update automatically</span>
              </div>
            </div>
          </div>

          {/* Results Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {calculationResult ? (
              <div className="bg-white border-2 border-blue-900 rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Live Assessment
                </div>

                <div className="mb-5">
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Estimated Total Cost So Far</p>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-1 tracking-tight">
                    {moneyFormatter.format(calculationResult.totalCost)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Over {numberFormatter.format(parsed.values.vacantWeeks)}{' '}
                    {parsed.values.vacantWeeks === 1 ? 'week' : 'weeks'} ({calculationResult.vacantDays} calendar days) ·{' '}
                    <span className="font-semibold text-slate-700">
                      {moneyFormatter.format(calculationResult.dailyProductivityCost)}/day
                    </span>
                  </p>
                </div>

                {/* Breakdown List */}
                <div className="border-t border-slate-100 pt-4 mb-6 space-y-2.5">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Cost Breakdown</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Estimated Lost Productivity:</span>
                    <span className="font-semibold text-slate-900">
                      {moneyFormatter.format(calculationResult.productivityCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Management & Interview Hours:</span>
                    <span className="font-semibold text-slate-900">
                      {moneyFormatter.format(calculationResult.managementCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Advertising & Job Boards:</span>
                    <span className="font-semibold text-slate-900">
                      {moneyFormatter.format(calculationResult.advertisingSpend)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Recruitment Fees Incurred:</span>
                    <span className="font-semibold text-slate-900">
                      {moneyFormatter.format(calculationResult.recruitmentFees)}
                    </span>
                  </div>
                </div>

                {/* Delay Forecast */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5 text-blue-900" />
                    <span>Cost of Further Hiring Delay</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Projected additional loss if position remains unfilled:
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {calculationResult.delays.map((delay) => (
                      <div key={delay.days} className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
                        <div className="text-[11px] font-bold text-slate-700">+{delay.days} Days</div>
                        <div className="text-xs sm:text-sm font-extrabold text-blue-900 mt-0.5">
                          {moneyFormatter.format(delay.additionalCost)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Total: {moneyFormatter.format(delay.totalCost)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Print / Save Action */}
                <div className="print:hidden mb-6">
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-4 rounded-xl transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    Print / Save Assessment as PDF
                  </button>
                </div>

                {/* Sharpened B2B Advisory Call to Action */}
                <div className="bg-blue-950 text-white rounded-xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold">Cut Your Vacancy Time</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Every 30 days of vacancy costs your organisation an additional{' '}
                    <strong className="text-white">
                      {moneyFormatter.format(calculationResult.delays[0].additionalCost)}
                    </strong>
                    . Speak with Liberty Towers to benchmark candidate availability and explore pre-vetted shortlists.
                  </p>
                  <a
                    href="/contact"
                    className="block text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition shadow-xs"
                  >
                    Request Free Market Check on Time-to-Hire ↗
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900 mb-1">Check Required Fields</h3>
                <p className="text-xs text-slate-500">
                  Please correct the highlighted inputs to calculate the vacancy cost.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Methodology & Assumptions Section */}
        <section className="mt-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">Calculation Methodology & Assumptions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Core Formula</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-slate-800">Lost Productivity:</strong> Annual Base Salary ÷ 365 × (Weeks Vacant × 7) × (Productivity Loss % ÷ 100).
                </li>
                <li>
                  <strong className="text-slate-800">Management Cost:</strong> Total interview and briefing hours × blended hourly management cost.
                </li>
                <li>
                  <strong className="text-slate-800">Total Incurred:</strong> Lost productivity + Management time + Advertising spend + Incurred recruitment fees.
                </li>
                <li>
                  <strong className="text-slate-800">Future Delay Scenarios:</strong> Calculated strictly on additional daily productivity loss across 30, 60, and 90 calendar days. Committed spend is never double-counted.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Key Operational Assumptions</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Salary serves as a conservative proxy for the position’s productive contribution to the enterprise.
                </li>
                <li>
                  Gross opportunity cost model: unpaid salary savings are not deducted, as business output and team capacity are forfeited.
                </li>
                <li>
                  All projections use calendar days consistently (365-day fiscal year) to reflect genuine time elapsed.
                </li>
                <li>
                  This tool provides indicative commercial estimation for executive decision-making and does not constitute a fee quote.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-8 print:hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-900 px-2.5 py-1.5 rounded-lg">
              <img
                src="https://s3-eu-west-1.amazonaws.com/rss-websites/libertytowers.co.uk/05-03-2025-84d6f95879f38981b06deb3d3b3c1ac753eaf0ab.png"
                alt="Liberty Towers"
                className="h-5 w-auto object-contain brightness-0 invert"
              />
            </div>
            <span>© {new Date().getFullYear()} Liberty Towers Ltd. All rights reserved. London, UK.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/salaries" className="hover:underline">
              Salary Benchmarks
            </a>
            <a href="/cv-review" className="hover:underline">
              CV Review
            </a>
            <a href="/profile-review" className="hover:underline">
              LinkedIn Review
            </a>
            <a href="/hiring-cost-calculator" className="hover:underline font-bold text-blue-950">
              Hiring Cost Calculator
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
