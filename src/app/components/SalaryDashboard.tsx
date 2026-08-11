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
  // Conversational Form State
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
    const locLower = (locationNatural || 'London, hybrid').toLowerCase();
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
      multiplier = 0.72; // European Remote Pay (~0.72x London)
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
      regionName = 'London';
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
    let rawTitle = roleInput.trim();
    // Clean natural language artifacts or instructions in parentheses
    rawTitle = rawTitle.replace(/\(.*?\)/g, (match) => {
      if (match.toLowerCase().includes('unless') || match.toLowerCase().includes('box') || match.toLowerCase().includes('tell me') || match.toLowerCase().includes('natural')) {
        return '';
      }
      return match;
    });
    rawTitle = rawTitle.replace(/unless otherwise stated.*$/gi, '');
    rawTitle = rawTitle.replace(/tell me what role.*$/gi, '');
    const titleClean = rawTitle.trim() || 'Internal Auditor';
    const inputLower = titleClean.toLowerCase();

    const isGraduateInput = /\b(graduate|grad|trainee|intern|internship|junior graduate|entry level)\b/i.test(inputLower);

    // Check if matches one of our pre-cached roles
    const predefined = predefinedRoles.find(r => {
      const titleLower = r.title.toLowerCase();
      const match = titleLower === inputLower || titleLower.includes(inputLower) || inputLower.includes(titleLower);
      if (!match) return false;
      
      // If user specified graduate/trainee, don't match standard experienced predefined roles
      const isPredefinedGrad = /\b(graduate|grad|trainee|intern|entry level)\b/i.test(titleLower) || r.category === "Graduate Entry";
      if (isGraduateInput && !isPredefinedGrad) return false;
      
      return true;
    });

    if (predefined) {
      const titleLower = predefined.title.toLowerCase();
      const isAudit = titleLower.includes('audit');
      const isQuantOrIB = titleLower.includes('quant') || titleLower.includes('m&a') || titleLower.includes('banking');
      return {
        ...predefined,
        confidence: 'High',
        confidenceReason: 'Verified benchmark from Liberty Towers 2026 Database',
        targetBonusText: isAudit 
          ? '0–10% typical (higher in specialist financial services)' 
          : isQuantOrIB 
          ? '30–50%+ variable target bonus'
          : '10–20% typical',
        salaryMovementText: isAudit 
          ? '+1% to +4% annual movement (Source: Barclay Simpson 2026 Internal Audit Salary Guide)'
          : '+1% to +3% annual movement (Source: Liberty Towers 2026 Market Intelligence)'
      };
    }

    // Check for Executive / Director level titles with word boundaries
    const isDirectorLevel = /\b(director|cmo|cfo|cro|coo|ceo|vp|head of|chief|partner|managing director|md)\b/i.test(inputLower);

    // ----------------------------------------------------
    // SECTOR & ORGANISATION CLASSIFIER FOR CUSTOM ROLES
    // ----------------------------------------------------
    const isPublicSector = /\b(council|city council|borough|local government|nhs|civil service|ministry|public sector|charity|not for profit|nfp|university|college|school)\b/i.test(inputLower);
    const isTechSector = /\b(technology|tech|software|saas|digital|startup|scale-up|asset-light)\b/i.test(inputLower) && !/\b(asset management|wealth)\b/i.test(inputLower);
    const isRetailSector = /\b(retail|retailer|fmcg|consumer|e-commerce|ecommerce|logistics|brand|manufacturing)\b/i.test(inputLower);
    const isFinancialServices = /\b(financial services|financial institution|investment bank|asset management|hedge fund|wealth management|capital markets|private equity|lloyd's|insurance|brokerage)\b/i.test(inputLower) || /\b(bank|banking|insurer|city financial|financial firm|city firm)\b/i.test(inputLower);

    let confidenceScore: 'High' | 'Medium' | 'Low' = 'Low';
    let confidenceReason = 'Generic job title provided without sector or organisation context. Enter organisation details (e.g. Retail, Local Council, Financial Services) for higher precision.';
    let salaryMovementText = 'Market tracking (broad economic index)';
    let targetBonusText = '5–15% typical';

    if (isPublicSector) {
      confidenceScore = 'Medium';
      confidenceReason = 'Parsed role with explicit public sector / local authority context.';
      targetBonusText = '0–5% typical (public sector / non-profit)';
      salaryMovementText = 'Public sector pay framework (NJC / NHS Agenda for Change)';
    } else if (isFinancialServices) {
      confidenceScore = 'Medium';
      confidenceReason = 'Parsed role with explicit financial services & banking context.';
      targetBonusText = '15–30%+ typical (higher in investment banking and markets)';
      salaryMovementText = '+2% to +5% annual movement (Source: City & Financial Services Compensation Index)';
    } else if (isTechSector) {
      confidenceScore = 'Medium';
      confidenceReason = 'Parsed role with explicit technology & software context.';
      targetBonusText = '10–20% typical (+ equity / option incentive)';
      salaryMovementText = '+2% to +4% annual movement (Source: UK Tech & SaaS Salary Benchmark)';
    } else if (isRetailSector) {
      confidenceScore = 'Medium';
      confidenceReason = 'Parsed role with explicit retail & consumer commercial context.';
      targetBonusText = '5–15% typical';
      salaryMovementText = '+1% to +3% annual movement (Source: Retail & Commercial Commerce Index)';
    }

    // Universal Heuristic Engine for ANY custom job title
    let sector = isPublicSector 
      ? "Public Sector & Government Services"
      : isFinancialServices
      ? "Financial Services & Banking"
      : isTechSector
      ? "Technology & Software Platforms"
      : isRetailSector
      ? "Retail & Consumer Commerce"
      : isDirectorLevel 
      ? "Senior Leadership" 
      : "General Commercial & Industrial Operations";

    let baseP10 = isDirectorLevel ? 70000 : 26000;
    let baseP50 = isDirectorLevel ? 98000 : 38000;
    let baseP90 = isDirectorLevel ? 140000 : 55000;
    let basePct = isDirectorLevel ? 75 : 90;
    let bonusPct = isDirectorLevel ? 25 : 10;
    let yoy = salaryMovementText;
    let description = isDirectorLevel 
      ? "Provides senior operational leadership, domain strategy, governance, and business-critical delivery."
      : "Executes operational, administrative, or functional delivery within this domain.";
    let demand = isDirectorLevel ? "Constrained candidate availability for senior leadership" : "Moderate Candidate Availability";
    let hiringInsight = isDirectorLevel 
      ? "Senior leadership candidates command competitive compensation packages including performance bonuses and LTIP incentives."
      : "Broad market candidate availability. Compensation varies based on specialist certifications, supervisory duties, and industry sector.";
    let maxExpMultiplier = isDirectorLevel ? 1.50 : 1.30;

    // DATA, ANALYTICS & AI LEADERSHIP
    if (/\b(head of data|chief data officer|cdo|data director|head of data analytics|head of data engineering|data science director)\b/i.test(inputLower)) {
      maxExpMultiplier = 1.35;
      description = "Directs enterprise data strategy, governance, analytics, engineering and platform delivery across organizational operations.";
      
      if (isPublicSector) {
        sector = "Public Sector & Government Data Leadership";
        baseP10 = 65000; baseP50 = 80000; baseP90 = 100000; // at 1.25 multiplier (6-10 yrs) -> £81k / £100k / £125k
        demand = "Constrained for experienced public sector data leaders familiar with local authority governance and statutory reporting frameworks.";
        hiringInsight = "Public sector Head of Data positions (e.g. Local Councils, NHS Trusts) offer strong pension and work-life balance benefits; base pay reflects public sector grading structures.";
      } else if (isTechSector) {
        sector = "Technology & Software Data Leadership";
        baseP10 = 80000; baseP50 = 104000; baseP90 = 132000; // at 1.25 multiplier (6-10 yrs) -> £100k / £130k / £165k
        demand = "High demand for data leaders with modern cloud data warehouse, automated pipeline engineering, and product analytics expertise.";
        hiringInsight = "Tech and SaaS Heads of Data typically command equity / option packages alongside competitive base compensation.";
      } else if (isRetailSector) {
        sector = "Retail & Commerce Data Leadership";
        baseP10 = 76000; baseP50 = 96000; baseP90 = 124000; // at 1.25 multiplier (6-10 yrs) -> £95k / £120k / £155k
        demand = "Demand driven by customer analytics, supply chain optimization, and commercial data platform modernization.";
        hiringInsight = "Omni-channel retail and consumer data leaders are evaluated on commercial ROI, customer lifetime value analytics, and inventory forecasting.";
      } else if (isFinancialServices) {
        sector = "Financial Services & Banking Data Leadership";
        baseP10 = 88000; baseP50 = 112000; baseP90 = 144000; // at 1.25 multiplier (6-10 yrs) -> £110k / £140k / £180k
        demand = "Constrained for leaders combining regulated financial-services experience with enterprise data governance and modern platform or AI delivery.";
        hiringInsight = "Head of Data responsibilities in financial services vary considerably according to global remit, market risk governance, and trading technology infrastructure.";
      } else {
        sector = "Data, Analytics & Technology Leadership";
        baseP10 = 76000; baseP50 = 100000; baseP90 = 128000; // at 1.25 multiplier (6-10 yrs) -> £95k / £125k / £160k
        demand = "Candidate availability varies based on team remit, cloud stack expertise, and enterprise scale.";
        hiringInsight = "Head of Data packages depend on team scale, whether the role is strategic vs hands-on engineering, and executive reporting lines.";
      }
    }
    // INDUSTRIAL, DRIVING, LOGISTICS & OPERATIONAL BRANCHES

    // A. Heavy Freight, HGV Class 1 & Artic Lorry Driving (Big Goods - High Salary)
    if (/\b(hgv|lgv|artic|articulated|lorry|class 1|c\+e|big goods|heavy goods|tanker driver|haulage|heavy driver)\b/i.test(inputLower)) {
      sector = "Heavy Freight, Haulage & HGV Transport";
      baseP10 = 38000; baseP50 = 48000; baseP90 = 62000;
      basePct = 92; bonusPct = 8;
      description = "Operates Class 1 (C+E) articulated heavy goods vehicles, long-haul freight, bulk cargo logistics, and tachograph-compliant transport.";
      demand = "High Scarcity (Licensed HGV Class 1 Drivers)";
      yoy = "1–4%";
      hiringInsight = "Severe UK driver shortage for Class 1 (C+E) articulated lorry drivers commands premium pay scales. Night shift allowances, tramping pay, and hazard premiums significantly increase gross compensation.";
      maxExpMultiplier = 1.30;
    }
    // B. Van Driver, Light Commercial Transport & Delivery
    else if (/\b(van driver|courier|delivery driver|light goods|sprinter driver|parcel driver)\b/i.test(inputLower)) {
      sector = "Logistics, Warehousing & Light Transport";
      baseP10 = 25000; baseP50 = 30000; baseP90 = 38000;
      basePct = 95; bonusPct = 5;
      description = "Operates light commercial vehicles, parcel delivery routing, last-mile logistics, and customer freight dispatch.";
      demand = "High Demand for Licensed Light Commercial Drivers";
      yoy = "1–4%";
      hiringInsight = "Steady demand across e-commerce and regional distribution networks. Clean driving record and multi-drop routing efficiency command top end of grade.";
      maxExpMultiplier = 1.20;
    }
    // C. Forklift Truck, Materials Handling & Warehouse Logistics
    else if (/\b(forklift|flt|reach truck|counterbalance|materials handling|warehouse|picker|packer|logistics operative|yard operative)\b/i.test(inputLower)) {
      sector = "Logistics, Warehousing & Distribution";
      baseP10 = 25000; baseP50 = 31000; baseP90 = 40000;
      basePct = 95; bonusPct = 5;
      description = "Operates counterbalance or reach forklift trucks, materials handling equipment, stock movement, and warehouse loading systems.";
      demand = "High Scarcity (FLT Certified Operatives)";
      yoy = "1–4%";
      hiringInsight = "Certified forklift operators (ITSSAR/RTITB) and warehouse team leads are in high demand across regional distribution centers.";
      maxExpMultiplier = 1.20;
    }
    // D. Cleaning, Facilities, Janitorial & Domestic Support Services
    else if (/\b(cleaner|cleaning|janitor|caretaker|housekeeper|facilities operative|domestic|sanitation|window cleaner)\b/i.test(inputLower)) {
      sector = "Facilities, Property & Support Services";
      baseP10 = 24000; baseP50 = 27000; baseP90 = 34000;
      basePct = 98; bonusPct = 2;
      description = "Maintains environmental cleanliness, hygiene standards, facility sanitation, and site support operations across commercial and residential premises.";
      demand = "High Candidate Availability";
      yoy = "1–4%";
      hiringInsight = "Pay scales closely track UK Real Living Wage / National Living Wage benchmarks, with supervisory and multi-site mobile roles reaching higher bands.";
      maxExpMultiplier = 1.15;
    }
    // E. Industrial Manufacturing, Factory & Production Operatives
    else if (/\b(factory|assembly|production operative|machine operator|manufacturing operative|plant operative|assembler)\b/i.test(inputLower)) {
      sector = "Industrial Manufacturing & Production";
      baseP10 = 24000; baseP50 = 29000; baseP90 = 36000;
      basePct = 95; bonusPct = 5;
      description = "Operates industrial production machinery, assembly lines, quality check processes, and manufacturing plant operations.";
      demand = "Moderate Candidate Availability";
      yoy = "1–4%";
      hiringInsight = "Shift patterns (rotating continental / night shifts) typically attract 15–25% shift premium over standard base rates.";
      maxExpMultiplier = 1.20;
    }
    // F. Skilled Trades, Construction & Industrial Maintenance
    else if (/\b(electrician|plumber|carpenter|builder|mechanic|fitter|welder|handyman|maintenance technician|maintenance engineer|tradesperson|gas engineer|pipefitter)\b/i.test(inputLower)) {
      sector = "Skilled Trades & Industrial Engineering";
      baseP10 = 30000; baseP50 = 42000; baseP90 = 58000;
      basePct = 92; bonusPct = 8;
      description = "Executes technical trade installation, mechanical/electrical maintenance, diagnostics, and facility engineering operations.";
      demand = "High Scarcity (Certified Trades)";
      yoy = "1–4%";
      hiringInsight = "Certified trade professionals (Gas Safe, NVQ Level 3, 18th Edition) command strong premium rates across commercial and industrial sectors.";
      maxExpMultiplier = 1.35;
    }
    // G. Hospitality, Retail, Catering & Customer Services
    else if (/\b(chef|cook|waiter|waitress|bartender|barista|retail assistant|store assistant|cashier|customer service|call centre)\b/i.test(inputLower)) {
      sector = "Hospitality, Retail & Customer Services";
      baseP10 = 24000; baseP50 = 28000; baseP90 = 38000;
      basePct = 95; bonusPct = 5;
      description = "Delivers customer service, retail operations, food preparation, or frontline service execution.";
      demand = "High Candidate Availability";
      yoy = "1–4%";
      hiringInsight = "Frontline roles track retail and hospitality pay agreements; head chefs and store managers command higher salary tiers.";
      maxExpMultiplier = 1.25;
    }
    // H. Healthcare & Social Care Support
    else if (/\b(carer|care assistant|healthcare assistant|nurse|nursing|support worker|care worker)\b/i.test(inputLower)) {
      sector = "Healthcare & Care Services";
      baseP10 = 24500; baseP50 = 31000; baseP90 = 45000;
      basePct = 95; bonusPct = 5;
      description = "Provides clinical care, patient support, elderly or disability care, and social care service delivery.";
      demand = "High Demand for Registered Care Staff";
      yoy = "1–4%";
      hiringInsight = "High demand for qualified healthcare workers across NHS and private care providers.";
      maxExpMultiplier = 1.30;
    }

    // 1. Audit, Governance & Risk - Distinct sub-role definitions
    if (/\b(part qualified|pq auditor|pq audit)\b/i.test(inputLower)) {
      sector = "Audit & Public Practice";
      baseP10 = 37500; baseP50 = 45000; baseP90 = 52500; // at 1-3 yrs (0.80 mult) -> £30,000 / £36,000 / £42,000
      basePct = 95; bonusPct = 5;
      description = "Delivers audit testing, control evaluations, and statutory reporting support while progressing ACA/ACCA professional qualification.";
      demand = "High Demand for Qualified ACA/ACCA Trainees";
      yoy = "1–4%";
      hiringInsight = "London part-qualified external audit ranges approximately £30,000–£42,000 depending on exam passes (ACA/ACCA) and firm size (Big Four / Top 10 vs mid-tier).";
    }
    else if (/\b(external audit|external auditor|statutory audit|public practice audit)\b/i.test(inputLower)) {
      sector = "Audit & Public Practice";
      baseP10 = 50000; baseP50 = 66000; baseP90 = 80000;
      basePct = 92; bonusPct = 8;
      description = "Delivers statutory financial statement audits, internal control assessments, and regulatory assurance for public practice clients across Big Four, Top 10, and mid-tier firms.";
      demand = "High Scarcity (ACA / ACCA Qualified)";
      yoy = "1–4%";
      hiringInsight = "London part-qualified external audit ranges approximately £30,000–£42,000; newly qualified ACA/ACCA external audit averages £51,000–£56,000.";
    }
    else if (/\b(it audit|it auditor|cyber audit|technology audit|systems audit)\b/i.test(inputLower)) {
      sector = "Audit, Governance & Risk";
      baseP10 = 50000; baseP50 = 72500; baseP90 = 93750;
      basePct = 88; bonusPct = 12;
      description = "Audits technology infrastructure, cyber security governance, cloud controls, and automated application systems.";
      demand = "Constrained for IT & Cyber Specialists";
      yoy = "1–4%";
      hiringInsight = "Specialist skills in IT audit, cyber security, cloud controls, and model risk remain difficult to recruit.";
    }
    else if (/\b(audit manager|head of audit|audit director|avp audit)\b/i.test(inputLower)) {
      sector = "Audit, Governance & Risk";
      baseP10 = 69000; baseP50 = 80250; baseP90 = 105000;
      basePct = 85; bonusPct = 15;
      description = "Leads internal or external audit teams, manages risk reporting, and presents governance recommendations to executive audit committees.";
      demand = "High Scarcity (Experienced Managers)";
      yoy = "1–4%";
      hiringInsight = "Audit Manager ranges span £69k–£80k in commerce up to £105k in specialist financial services, with 15–20% variable bonus typical at manager level.";
    }
    else if (/\b(internal audit|internal auditor|audit|auditor)\b/i.test(inputLower)) {
      sector = "Audit, Governance & Risk";
      baseP10 = 43750; baseP50 = 62500; baseP90 = 81250; // Map at 1-3 yrs (0.80 mult) -> £35,000 / £50,000 / £65,000
      basePct = 90; bonusPct = 10;
      description = "Reviews internal controls, risk-management processes, financial governance and regulatory compliance. Identifies control weaknesses and recommends practical improvements.";
      demand = "Moderate overall; constrained for specialists";
      yoy = "1–4%";
      hiringInsight = "Candidate availability is moderate overall, although newly qualified auditors and candidates with financial-services, IT audit, cyber, model-risk or regulatory experience remain harder to secure. Typical bonuses range from 0–10%, with higher variable compensation possible in specialist financial-services positions.";
    }
    // 2. Legal & Professional Services (Separating City/US Premium vs Standard / Regional Practice)
    else if (/\b(legal|solicitor|lawyer|counsel|partner|attorney|barrister|conveyancer)\b/i.test(inputLower)) {
      const isCityOrUS = /\b(city|us firm|us law|magic circle|silver circle|wall street|white shoe|us legal)\b/i.test(inputLower);

      if (isCityOrUS) {
        sector = "Legal & Professional Services (City & US Elite)";
        if (isDirectorLevel || /\b(partner|general counsel)\b/i.test(inputLower)) {
          baseP10 = 140000; baseP50 = 220000; baseP90 = 350000;
          basePct = 80; bonusPct = 20;
          description = "Leads corporate governance, high-stakes M&A litigation, regulatory compliance, and partner equity advisory across City and US elite law firms.";
          demand = "High Scarcity";
          yoy = "1–4%";
          hiringInsight = "City and US law firm Partners command top-tier compensation (£200k–£350k+ base plus profit share).";
        } else {
          baseP10 = 85000; baseP50 = 125000; baseP90 = 185000;
          basePct = 85; bonusPct = 15;
          description = "Advises on corporate transactions, regulatory governance, commercial contracts, and high-stakes dispute resolution for City/US firms.";
          demand = "High Scarcity";
          yoy = "1–4%";
          hiringInsight = "City NQ/Associate legal counsel in London command premium base scales (£105k–£160k+) driven by US law firm pay benchmarks.";
        }
      } else {
        sector = "Legal & Professional Services";
        if (isDirectorLevel || /\b(partner|general counsel|head of legal)\b/i.test(inputLower)) {
          baseP10 = 90000; baseP50 = 135000; baseP90 = 195000;
          basePct = 85; bonusPct = 15;
          description = "Leads legal affairs, corporate governance, risk management, and regulatory compliance for commercial organisations or practice groups.";
          demand = "High Demand for Experienced Counsel";
          yoy = "1–4%";
          hiringInsight = "General Counsel and Regional Law Firm Partners average £110k–£180k base pay depending on company turnover or equity structure.";
        } else {
          baseP10 = 48000; baseP50 = 72000; baseP90 = 105000;
          basePct = 88; bonusPct = 12;
          description = "Advises on corporate transactions, regulatory governance, commercial contracts, employment law, and dispute resolution.";
          demand = "High Demand for Experienced Practitioners";
          yoy = "1–4%";
          hiringInsight = "UK mid-market, regional commercial practices, and in-house roles typically range £50k–£80k for mid-level solicitors, whereas London City/US elite firms command £105k+ base scales.";
        }
      }
    }
    // 3. Investment Banking, Financial Services & Private Equity
    else if (/\b(bank|banking|m&a|equity|asset management|hedge fund|capital markets|investment)\b/i.test(inputLower)) {
      sector = "Investment Banking & Capital Markets";
      if (isDirectorLevel || /\b(managing director|md)\b/i.test(inputLower)) {
        baseP10 = 160000; baseP50 = 260000; baseP90 = 420000;
        basePct = 50; bonusPct = 50;
        description = "Drives deal origination, M&A execution, institutional capital allocation, and portfolio asset performance.";
        demand = "High Scarcity";
        yoy = "1–4%";
        hiringInsight = "Managing Directors and Partners in Investment Banking expect 50%+ performance bonus allocations alongside substantial base pay.";
      } else {
        baseP10 = 75000; baseP50 = 135000; baseP90 = 210000;
        basePct = 60; bonusPct = 40;
        description = "Executes M&A transactions, financial valuation modeling, client pitch books, and buy-side portfolio management.";
        demand = "High Scarcity";
        yoy = "1–4%";
        hiringInsight = "Investment banking analysts and associates command significant bonus pools (30-50% variable) above base salary.";
      }
    }
    // 4. Marketing, Brand, Sales, Business Development & Commercial Leadership
    else if (/\b(marketing|market|brand|growth|sales|commercial|business development|biz dev|bd|account director|sales director)\b/i.test(inputLower)) {
      sector = "Commercial, Sales, Marketing & Business Development";
      if (isDirectorLevel) {
        baseP10 = 75000; baseP50 = 105000; baseP90 = 150000;
        basePct = 75; bonusPct = 25;
        description = "Leads commercial strategy, business development, omni-channel growth, revenue expansion, and executive sales operations.";
        demand = "High Demand for Commercial & BD Directors";
        yoy = "1–4%";
        hiringInsight = "Business Development and Commercial Directors with verified ROI on client acquisition and revenue growth command top-tier packages (£120k–£180k+).";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 42000; baseP50 = 68000; baseP90 = 110000;
        basePct = 80; bonusPct = 20;
        description = "Drives brand positioning, campaign execution, digital marketing channels, and client acquisition pipelines.";
        demand = "Moderate Candidate Availability";
        yoy = "1–4%";
        hiringInsight = "Good active applicant volume. Primary differentiator is demonstrated campaign conversion and sector-specific domain knowledge.";
        maxExpMultiplier = 1.30;
      }
    }
    // 5. Insurance Account Handler / Account Executive / Broking
    else if (/\b(account handler|account executive|broker support|broking|client manager)\b/i.test(inputLower)) {
      sector = "Insurance & Commercial Broking";
      if (isDirectorLevel) {
        baseP10 = 80000; baseP50 = 115000; baseP90 = 165000;
        basePct = 75; bonusPct = 25;
        description = "Directs commercial broking operations, key client portfolio placements, insurer relationships, and regional practice leadership.";
        demand = "High Scarcity (Broking Directors)";
        yoy = "1–4%";
        hiringInsight = "Broking Directors with portable books of business and strong market relationships command executive compensation.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 42000; baseP50 = 58000; baseP90 = 92000;
        basePct = 85; bonusPct = 15;
        description = "Manages commercial client policy portfolios, renewal placements, Lloyd's/company market negotiations, and broker client accounts.";
        demand = "High Demand for Experienced Handlers";
        yoy = "1–4%";
        hiringInsight = "Competitive broking market. Experienced handlers with Acturis/Open GI mastery and strong insurer relationships command premium London packages.";
      }
    }
    // 6. Admin & EA/PA (STRICT WORD BOUNDARY: \bpa\b so "part" never matches)
    else if (/\b(pa|personal assistant|executive assistant|secretary|receptionist|reception|admin|office manager)\b/i.test(inputLower)) {
      sector = "Corporate Administration & Executive Support";
      if (isDirectorLevel) {
        baseP10 = 70000; baseP50 = 95000; baseP90 = 135000;
        basePct = 85; bonusPct = 15;
        description = "Directs corporate administration, facilities, C-suite office operations, and executive support infrastructure.";
        demand = "High Demand for Administration Directors";
        yoy = "1–4%";
        hiringInsight = "Heads of Administration and Operations Directors in corporate services command senior management packages.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 32000; baseP50 = 42000; baseP90 = 58000;
        basePct = 95; bonusPct = 5;
        description = "Manages executive diaries, travel logistics, board coordination, and senior administrative operations.";
        demand = "High Candidate Availability";
        yoy = "1–4%";
        hiringInsight = "Roles attract high active applicant volumes. Liberty Towers pre-screens and filters for candidate stability, C-suite discretion, and culture fit.";
      }
    } 
    // 7. Tech Infrastructure, Cloud, DevOps & Cyber Security
    else if (/\b(devops|cloud|sre|cyber|security|infrastructure|network|sysadmin|ciso)\b/i.test(inputLower)) {
      sector = "Tech Infrastructure, Cloud & Cyber Security";
      if (isDirectorLevel) {
        baseP10 = 85000; baseP50 = 120000; baseP90 = 175000;
        basePct = 80; bonusPct = 20;
        description = "Directs enterprise infrastructure, cloud architecture (AWS/Azure), Zero-Trust cybersecurity governance, and technical risk management.";
        demand = "High Scarcity (CISOs & Infrastructure Directors)";
        yoy = "1–4%";
        hiringInsight = "CISOs and IT Directors face intense competition and command high executive baselines.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 55000; baseP50 = 88000; baseP90 = 145000;
        basePct = 85; bonusPct = 15;
        description = "Architects cloud environments (AWS/Azure), CI/CD automation pipelines, Zero-Trust cyber security, and system resilience.";
        demand = "Constrained for Cyber & Cloud Specialists";
        yoy = "1–4%";
        hiringInsight = "Cyber and Cloud Architects face intense buy-side competition. Candidates expect remote/hybrid flexibility and certification bonuses.";
      }
    } 
    // 8. Finance, Controller, Tax & Treasury
    else if (/\b(finance|accountant|accounting|controller|tax|treasury|cfo)\b/i.test(inputLower)) {
      sector = "Finance & Corporate Accounting";
      if (isDirectorLevel) {
        baseP10 = 80000; baseP50 = 115000; baseP90 = 165000;
        basePct = 75; bonusPct = 25;
        description = "Leads corporate financial strategy, FP&A, capital allocation, statutory reporting, tax governance, and executive board reporting.";
        demand = "High Scarcity (Finance Directors & CFOs)";
        yoy = "1–4%";
        hiringInsight = "Finance Directors and CFOs command strong base salaries with substantial annual equity or performance bonuses.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 45000; baseP50 = 75000; baseP90 = 130000;
        basePct = 82; bonusPct = 18;
        description = "Oversees financial planning & analysis (FP&A), statutory reporting, tax governance, and balance sheet control.";
        demand = "Moderate-High Scarcity (Qualified ACA)";
        yoy = "1–4%";
        hiringInsight = "ACA/ACCA qualified talent commands strong counter-offers. Speed to offer is critical.";
      }
    } 
    // 9. Software Engineering & Technology
    else if (/\b(developer|software|frontend|backend|fullstack|engineer|programmer|cto|engineering director)\b/i.test(inputLower)) {
      sector = "Tech & Software Engineering";
      if (isDirectorLevel) {
        baseP10 = 85000; baseP50 = 120000; baseP90 = 175000;
        basePct = 80; bonusPct = 20;
        description = "Directs technology vision, software engineering strategy, platform architecture, and engineering organization delivery.";
        demand = "High Scarcity (Engineering Directors & CTOs)";
        yoy = "1–4%";
        hiringInsight = "Engineering Directors and CTOs command premium executive packages with equity and bonus incentives.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 52000; baseP50 = 82000; baseP90 = 135000;
        basePct = 85; bonusPct = 15;
        description = "Engineers scalable software platforms, microservices architecture, API integrations, and core product code.";
        demand = "High Demand for Senior Engineers";
        yoy = "1–4%";
        hiringInsight = "Strong competition for senior engineers with modern framework proficiency and cloud deployment experience.";
      }
    }
    // 10. Quant & Quantitative Finance
    else if (/\b(quant|hft|prop trading|alpha researcher)\b/i.test(inputLower)) {
      sector = "Quant & Quantitative Finance";
      if (isDirectorLevel) {
        baseP10 = 120000; baseP50 = 220000; baseP90 = 350000;
        basePct = 50; bonusPct = 50;
        description = "Directs quantitative strategy research, high-frequency execution architecture, alpha generation, and portfolio risk management.";
        demand = "Critical Scarcity (Quant Directors & Heads of Research)";
        yoy = "1–4%";
        hiringInsight = "Quant Directors and Heads of Research receive top-tier buy-side compensation with 50%+ bonus pools.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 90000; baseP50 = 180000; baseP90 = 280000;
        basePct = 60; bonusPct = 40;
        description = "Engineers algorithmic trading models, high-frequency execution infrastructure, and strategy research.";
        demand = "High Scarcity";
        yoy = "1–4%";
        hiringInsight = "Fierce bidding war across buy-side funds. Candidates hold multiple competing offers.";
      }
    } 
    // 11. Insurance Underwriting
    else if (/\b(underwriter|insurance|broker|claims)\b/i.test(inputLower)) {
      sector = "Insurance & Specialty Reinsurance";
      if (isDirectorLevel) {
        baseP10 = 90000; baseP50 = 135000; baseP90 = 195000;
        basePct = 70; bonusPct = 30;
        description = "Directs underwriting portfolio strategy, Lloyd's syndicate exposure, risk appetite, pricing, and broker market relationships.";
        demand = "High Scarcity (Underwriting Directors & Active Underwriters)";
        yoy = "1–4%";
        hiringInsight = "Lloyd's and company market Underwriting Directors command executive packages with significant performance bonuses.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 55000; baseP50 = 95000; baseP90 = 160000;
        basePct = 75; bonusPct = 25;
        description = "Evaluates portfolio risk, Lloyd's syndicate exposure, pricing strategy, and broker client relationships.";
        demand = "High Scarcity";
        yoy = "1–4%";
        hiringInsight = "Lloyd's and company markets face tight supply of profitable book leads. Direct headhunting recommended.";
      }
    }

    // Graduate & Entry-Level Calibration Guardrail
    if (isGraduateInput) {
      const isSuperCorporateHighPaying = /\b(quant|hft|prop trading|alpha|m&a|investment|bank|banking|city|us firm|us law|magic circle|silver circle|developer|software|fullstack|backend|frontend)\b/i.test(inputLower);

      if (!isSuperCorporateHighPaying) {
        // Non-supercorporate graduate roles (fashion, marketing, sales, admin, HR, operations, retail, creative, general commercial)
        // Baseline London figures calibrate at 1-3 yrs (0.80 expMult) to:
        // Lower Market P10: £25,000 | Median P50: £29,000 | Upper Market P90 (Peak): £35,000
        baseP10 = 31250;
        baseP50 = 36250;
        baseP90 = 43750;
        maxExpMultiplier = 1.00;
        basePct = 95;
        bonusPct = 5;
        demand = "High Active Applicant Volume (Graduate Level)";
        hiringInsight = "Graduate and entry-level positions outside of specialist corporate finance, quant, or City law schemes typically range from £25,000 to £35,000 in London & City Hubs. Candidate differentiation rests on campaign portfolios, internship experience, and sector-specific skills.";
      } else {
        // High-paying supercorporate / tech / elite legal graduate schemes
        if (/\b(city|us firm|us law|magic circle|silver circle)\b/i.test(inputLower)) {
          baseP10 = 55000; baseP50 = 68000; baseP90 = 80000;
        } else if (/\b(quant|hft|prop trading|alpha)\b/i.test(inputLower)) {
          baseP10 = 65000; baseP50 = 85000; baseP90 = 115000;
        } else if (/\b(m&a|investment|bank|banking)\b/i.test(inputLower)) {
          baseP10 = 55000; baseP50 = 70000; baseP90 = 90000;
        } else if (/\b(developer|software|fullstack|backend|frontend)\b/i.test(inputLower)) {
          baseP10 = 38000; baseP50 = 48000; baseP90 = 60000;
        }
        maxExpMultiplier = 1.00;
        demand = "High Scarcity (Top-Tier Corporate Graduate Schemes)";
        hiringInsight = "Top-tier corporate, City legal, and quantitative finance graduate schemes command premium starting packages (£50k+).";
      }
    }

    const regMult = parsedLocation.multiplier;

    let displayTitle = titleClean.replace(/\b\w/g, l => l.toUpperCase());
    
    if (titleClean.includes(',')) {
      const parts = titleClean.split(',');
      const mainRole = parts[0].trim().replace(/\b\w/g, l => l.toUpperCase());
      const orgDetail = parts.slice(1).join(' ').trim().replace(/\b\w/g, l => l.toUpperCase());
      if (orgDetail) {
        displayTitle = `${mainRole} — ${orgDetail}`;
      }
    } else if (/\bhead of data\b/i.test(inputLower)) {
      if (isFinancialServices) {
        displayTitle = "Head of Data — Large Financial Services Firm";
      } else if (isPublicSector) {
        displayTitle = "Head of Data — Public Sector";
      } else if (isTechSector) {
        displayTitle = "Head of Data — Technology & Software";
      } else if (isRetailSector) {
        displayTitle = "Head of Data — Retail & Consumer Commerce";
      } else {
        displayTitle = "Head of Data";
      }
    }

    return {
      id: `custom-${inputLower.replace(/[^a-z0-9]/g, '-')}`,
      title: displayTitle,
      sector: sector,
      category: isDirectorLevel ? "Executive Benchmark" : "Market Benchmark",
      description: description,
      confidence: confidenceScore,
      confidenceReason: confidenceReason,
      targetBonusText: targetBonusText,
      salaryMovementText: salaryMovementText,
      maxExpMultiplier: maxExpMultiplier,
      regional_data: {
        [parsedLocation.regionKey]: {
          p10: Math.round(baseP10 * regMult),
          p50: Math.round(baseP50 * regMult),
          p90: Math.round(baseP90 * regMult),
          base_pct: basePct,
          bonus_pct: bonusPct,
          demand: demand,
          yoy: salaryMovementText,
          hiring_insight: hiringInsight
        }
      }
    };
  }, [roleInput, parsedLocation, predefinedRoles]);

  // Experience level multipliers
  const expMultipliers: Record<string, { label: string; multiplier: number }> = {
    '1-3': { label: '1–3 Years (Junior / Associate)', multiplier: 0.80 },
    '3-6': { label: '3–6 Years (Mid-Level Specialist)', multiplier: 1.00 },
    '6-10': { label: '6–10 Years (Senior Lead)', multiplier: 1.25 },
    '10+': { label: '10+ Years (Highly Experienced / Senior Lead)', multiplier: 1.50 }
  };

  const currentExpMeta = useMemo(() => {
    const raw = expMultipliers[expYears] || expMultipliers['1-3'];
    if (expYears === '10+') {
      const titleLower = roleInput.toLowerCase();
      const isExec = /\b(director|cmo|cfo|cro|vp|head of|chief|partner|managing director|md)\b/i.test(titleLower);
      return {
        ...raw,
        label: isExec ? '10+ Years (Highly Experienced / Executive Director)' : '10+ Years (Highly Experienced / Senior Lead)'
      };
    }
    return raw;
  }, [expYears, roleInput]);

  const rawMultiplier = currentExpMeta.multiplier;
  const maxCap = (activeRoleData as any).maxExpMultiplier || 1.50;
  const multiplier = Math.min(rawMultiplier, maxCap);

  // Active region data
  const rawRegionData = activeRoleData.regional_data[parsedLocation.regionKey as keyof typeof activeRoleData.regional_data] || {
    p10: 28000,
    p50: 38000,
    p90: 55000,
    base_pct: 90,
    bonus_pct: 10,
    demand: "Moderate Candidate Availability",
    yoy: "1–4%",
    hiring_insight: "Moderate active applicant volume."
  };

  // Work style adjustment factor
  const styleMultiplier = parsedLocation.derivedStyle === 'remote' ? 1.0 : parsedLocation.derivedStyle === 'onsite' ? 0.97 : 1.0;

  // Calculated final benchmarks
  const nmwFloor = parsedLocation.isOverseasEU ? 18000 : (parsedLocation.regionKey === 'london' ? 28000 : 25000);
  
  const p10 = Math.max(nmwFloor, Math.round((rawRegionData.p10 * multiplier * styleMultiplier) / 500) * 500);
  const p50 = Math.max(p10 + 2000, Math.round((rawRegionData.p50 * multiplier * styleMultiplier) / 500) * 500);
  const p90 = Math.max(p50 + 4000, Math.round((rawRegionData.p90 * multiplier * styleMultiplier) / 500) * 500);

  const basePct = rawRegionData.base_pct || 90;
  const bonusPct = rawRegionData.bonus_pct || 10;

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
            Current UK salary benchmarks, market demand, and compensation insights.
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
                    Tell us which role you are researching.
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
                      placeholder="Example: Internal Auditor, External Auditor, IT Auditor..."
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-800/10 transition"
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      'Internal Auditor',
                      'External Auditor',
                      'IT Auditor',
                      'Audit Manager',
                      'Commercial Solicitor',
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
                        How many years’ experience are required?
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
                      <option value="1-3">1–3 Years (Junior / Associate)</option>
                      <option value="3-6">3–6 Years (Mid-Level)</option>
                      <option value="6-10">6–10 Years (Senior)</option>
                      <option value="10+">10+ Years (Highly Experienced)</option>
                    </select>
                  </div>

                  {/* Input 3: Location & Setup */}
                  <div className="flex flex-col">
                    <div className="min-h-[44px] flex items-end pb-2">
                      <label className="text-sm font-bold text-slate-900 leading-tight">
                        Enter the location and select whether the role is office-based, hybrid or remote.
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
                          placeholder="Example: London, hybrid"
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
                ADVERTISEMENTS
              </span>
              <div className="h-[90px] flex items-center justify-center bg-white rounded-lg border border-slate-200 text-xs text-slate-300">
                {/* Pending Google AdSense auto-ad activation */}
              </div>
            </div>

            {/* Benchmark Results Output Card */}
            {hasGenerated && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                        {activeRoleData.sector}
                      </span>
                      <span className="text-xs text-slate-500">• {currentExpMeta.label}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                        (activeRoleData as any).confidence === 'High'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : (activeRoleData as any).confidence === 'Medium'
                          ? 'bg-blue-50 text-blue-900 border-blue-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`} title={(activeRoleData as any).confidenceReason || ''}>
                        Confidence: {(activeRoleData as any).confidence || 'Medium'}
                      </span>
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

                {/* Indicative Base Salary Cards */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Indicative Base Salary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Lower Hiring Point */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Lower Hiring Point
                      </span>
                      <span className="text-2xl font-bold text-slate-800">
                        {formatCurrency(p10)}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-1">Lower market hiring benchmark</span>
                    </div>

                    {/* Typical Market Salary */}
                    <div className="bg-blue-50/60 border-2 border-blue-800/40 rounded-xl p-5 text-center relative shadow-sm">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                        Typical Market
                      </div>
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                        Typical Market Salary
                      </span>
                      <span className="text-3xl font-extrabold text-blue-950">
                        {formatCurrency(p50)}
                      </span>
                      <span className="text-[11px] text-blue-900/80 block mt-1">Mid-market hiring benchmark</span>
                    </div>

                    {/* Upper / Specialist Market */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Upper / Specialist Market
                      </span>
                      <span className="text-2xl font-bold text-slate-800">
                        {formatCurrency(p90)}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-1">Upper & specialist market benchmark</span>
                    </div>

                  </div>
                </div>

                {/* Candidate Market & Target Bonus Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-900 rounded-lg shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Candidate Market & Movement</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        <strong className="text-slate-900">Candidate Market:</strong> {rawRegionData.demand}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <strong className="text-slate-800">Salary Movement:</strong> {(activeRoleData as any).salaryMovementText || rawRegionData.yoy}
                      </p>
                      {(rawRegionData as any).hiring_insight && (
                        <p className="text-[11px] text-slate-600 mt-1.5 italic border-t border-slate-200/60 pt-1.5">
                          💡 Recruiter Note: {(rawRegionData as any).hiring_insight}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 bg-white border border-slate-200 px-4 py-3 rounded-lg text-center md:min-w-[180px]">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Typical Target Bonus</span>
                    <span className="text-xs font-bold text-slate-900 block mt-0.5">
                      {(activeRoleData as any).targetBonusText || "5–15% typical"}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Excludes LTIP, pension & equity</span>
                  </div>
                </div>

                {/* B2B Action Box */}
                <div className="bg-blue-950 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold">Looking to hire for this role?</h4>
                    <p className="text-xs text-blue-200 mt-1">
                      Liberty Towers pre-screens candidates against the experience, qualifications and sector requirements of each vacancy.
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

                {/* Indicative Disclaimer Footer */}
                <div className="border-t border-slate-100 pt-3 space-y-1 text-center">
                  {(activeRoleData as any).confidenceReason && (
                    <p className="text-[11px] text-slate-600 font-medium">
                      ℹ️ Benchmarking Confidence: <span className="text-slate-800">{(activeRoleData as any).confidenceReason}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                    Indicative hiring guidance, updated August 2026. Actual compensation depends on responsibilities, organisation size and total reward. Salary figures exclude bonus, pension, LTIP and equity.
                  </p>
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
