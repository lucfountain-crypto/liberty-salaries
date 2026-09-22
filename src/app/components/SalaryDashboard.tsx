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
  ChevronDown,
  Info,
  Clock,
  Briefcase,
  CheckCircle2,
  Send,
  SlidersHorizontal,
  ArrowRight,
  RefreshCw,
  FileText,
  Calculator
} from 'lucide-react';

export default function SalaryDashboard() {
  // Conversational Form State
  const [roleInput, setRoleInput] = useState<string>('');
  const [expYears, setExpYears] = useState<string>('1-3'); // '1-3', '3-6', '6-10', '10+'
  const [locationNatural, setLocationNatural] = useState<string>('');
  
  // Optional Refinement State
  const [showRefinements, setShowRefinements] = useState<boolean>(false);
  const [employerType, setEmployerType] = useState<'standard' | 'specialist' | 'city_elite' | 'public'>('standard');
  const [roleSpecialism, setRoleSpecialism] = useState<string>('default');

  // App view modes & drawers
  const [viewMode, setViewMode] = useState<'guided' | 'full'>('guided');
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMethodologyDrawer, setShowMethodologyDrawer] = useState<boolean>(false);

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
  // Guardrail: NO silent fallback to London for unrecognised UK locations
  const parsedLocation = useMemo(() => {
    const locLower = (locationNatural || '').trim().toLowerCase();
    
    // Work style extraction
    let derivedStyle = '';
    if (/\b(remote|wfh|home|telecommute|distributed)\b/.test(locLower)) {
      derivedStyle = 'remote';
    } else if (/\b(office|onsite|in-office|site-based|desk)\b/.test(locLower)) {
      derivedStyle = 'office';
    } else {
      // Physical / site-based occupations default to on-site, not hybrid
      const isPhysicalOnSite = /\b(nurse|nursing|doctor|medical|teacher|teaching|chef|cook|electrician|plumber|carpenter|builder|mechanic|fitter|welder|cleaner|cleaning|driver|warehouse|picker|packer|carer|care assistant|bartender|waiter|waitress|catering)\b/i.test(roleInput || '');
      derivedStyle = isPhysicalOnSite ? 'on-site' : 'hybrid';
    }

    if (!locLower) {
      return {
        regionKey: 'london',
        regionName: 'Greater London & City Hubs',
        multiplier: 1.0,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null as string | null
      };
    }

    // Word boundary checks for UK vs EU vs US
    const isUS = /\b(us|usa|united states|new york|wall street|silicon valley)\b/.test(locLower);
    const isExplicitEU = /\b(spain|spanish|malta|gibraltar|poland|portugal|germany|france|italy|europe|eu|offshore|overseas)\b/.test(locLower);
    const isUKExplicit = /\b(uk|united kingdom|britain|british|england|london|manchester|leeds|birmingham|northampton|nottingham|leicester|scotland)\b/.test(locLower);

    if (isExplicitEU && !isUS && !isUKExplicit) {
      return {
        regionKey: 'eu_remote',
        regionName: 'European & Overseas Remote',
        multiplier: 0.72,
        derivedStyle: 'remote',
        isOverseasEU: true,
        isUnrecognised: false,
        warning: null
      };
    }
    
    if (isUS) {
      return {
        regionKey: 'us_remote',
        regionName: 'US & Wall Street Remote',
        multiplier: 1.30,
        derivedStyle: 'remote',
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // Midlands (Birmingham, Nottingham, Leicester, Northampton, etc.)
    if (/\b(birmingham|nottingham|leicester|northampton|northamptonshire|coventry|derby|stoke|wolverhampton|solihull|midlands|east midlands|west midlands|milton keynes|peterborough|kettering|corby|wellingborough)\b/.test(locLower)) {
      return {
        regionKey: 'midlands',
        regionName: 'Midlands (Birmingham, Nottingham, Leicester)',
        multiplier: 0.82,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // North UK (Manchester, Leeds, Liverpool, Sheffield, Newcastle, etc.)
    if (/\b(manchester|leeds|liverpool|sheffield|newcastle|sunderland|teesside|cumbria|carlisle|preston|lancaster|blackpool|bolton|warrington|hull|york|yorkshire|merseyside|lancashire|tyneside|north|north west|north east|north uk|northern)\b/.test(locLower)) {
      return {
        regionKey: 'north_uk',
        regionName: 'North UK (Manchester, Leeds, Liverpool)',
        multiplier: 0.82,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // Scotland
    if (/\b(scotland|edinburgh|glasgow|aberdeen|dundee|inverness|scottish)\b/.test(locLower)) {
      return {
        regionKey: 'scotland',
        regionName: 'Scotland (Edinburgh, Glasgow, Regional)',
        multiplier: 0.82,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // South West & Wales
    if (/\b(bristol|bath|cardiff|swansea|newport|exeter|plymouth|cornwall|devon|swindon|wiltshire|somerset|dorset|gloucester|cheltenham|wales|south west)\b/.test(locLower)) {
      return {
        regionKey: 'south_west',
        regionName: 'South West England & Wales',
        multiplier: 0.82,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // South East England
    if (/\b(surrey|kent|essex|reading|berkshire|oxford|oxfordshire|cambridge|cambridgeshire|brighton|southampton|portsmouth|guildford|st albans|hertfordshire|herts|sussex|hampshire|south|south east|southeast)\b/.test(locLower)) {
      return {
        regionKey: 'south_east',
        regionName: 'South East England & Home Counties',
        multiplier: 0.88,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // East of England
    if (/\b(norfolk|norwich|suffolk|ipswich|colchester|chelmsford|east anglia|east of england)\b/.test(locLower)) {
      return {
        regionKey: 'east_england',
        regionName: 'East of England',
        multiplier: 0.85,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // Northern Ireland
    if (/\b(belfast|derry|northern ireland|antrim)\b/.test(locLower)) {
      return {
        regionKey: 'northern_ireland',
        regionName: 'Northern Ireland (Belfast)',
        multiplier: 0.80,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // UK National Remote
    if (locLower.includes('remote') && !isExplicitEU) {
      return {
        regionKey: 'uk_remote',
        regionName: 'UK National Remote',
        multiplier: 0.95,
        derivedStyle: 'remote',
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // London & Central City Hubs
    if (
      locLower.includes('london') || locLower.includes('mayfair') || locLower.includes('canary wharf') || 
      locLower.includes("lloyd's") || locLower.includes('city') || locLower.includes('square mile') || 
      locLower.includes('west end') || locLower.includes('soho') || locLower.includes('ec1') || 
      locLower.includes('ec2') || locLower.includes('ec3') || locLower.includes('ec4') || 
      locLower.includes('wc1') || locLower.includes('wc2') || locLower.includes('w1') || locLower.includes('sw1')
    ) {
      return {
        regionKey: 'london',
        regionName: locLower.includes("lloyd's") ? "London (Lloyd's Market)" : "Greater London & City",
        multiplier: 1.0,
        derivedStyle,
        isOverseasEU: false,
        isUnrecognised: false,
        warning: null
      };
    }

    // Graceful Unrecognised Location Fallback (NO silent London default!)
    return {
      regionKey: 'uk_national',
      regionName: 'UK National Average (Unspecified Region)',
      multiplier: 0.82,
      derivedStyle,
      isOverseasEU: false,
      isUnrecognised: true,
      warning: 'Location not explicitly recognized — calibrated against UK National Average (0.82x London baseline). Enter a specific UK city (e.g. London, Manchester, Birmingham) for local precision.'
    };
  }, [locationNatural, roleInput]);

  // Optional Refinement Multipliers
  const refinementMultiplier = useMemo(() => {
    let mult = 1.0;
    
    // Employer type adjustments
    if (employerType === 'specialist') mult *= 1.10; // Boutique / specialist firm premium
    else if (employerType === 'city_elite') mult *= 1.45; // City / US Elite
    else if (employerType === 'public') mult *= 0.88; // Public sector / NJC / NHS

    // Role-specific focus adjustments
    if (roleSpecialism === 'cisa') mult *= 1.15;
    else if (roleSpecialism === 'fintech') mult *= 1.20;
    else if (roleSpecialism === 'lloyds') mult *= 1.20;
    else if (roleSpecialism === 'banking_fs') mult *= 1.20;
    else if (roleSpecialism === 'city_law') mult *= 1.45;

    return mult;
  }, [employerType, roleSpecialism]);

  // Dynamic Seniority Market Commentary (strictly matched to selected seniority)
  const seniorityCommentary = useMemo(() => {
    switch (expYears) {
      case '1-3':
        return {
          demand: 'Active demand for developing professionals and trainees; focus on exam support, professional accreditation, and retention.',
          recruiterNote: 'Developing professionals (1–3 years) require structured mentorship and qualification support. Study leave and post-qualification retention packages are primary differentiators.'
        };
      case '3-6':
        return {
          demand: 'Liquid market with strong demand for fully autonomous specialists and qualified practitioners.',
          recruiterNote: 'Autonomous specialists (3–6 years) represent the most actively contested talent tier. Speed of hiring process and clear advancement pathways are decisive.'
        };
      case '6-10':
        return {
          demand: 'Constrained candidate availability for experienced team leads, technical specialists, and portfolio managers.',
          recruiterNote: 'Senior specialists and managers (6–10 years) command premiums for domain depth and cross-functional leadership; retention packages and deferred bonuses are prevalent.'
        };
      case '10+':
        return {
          demand: 'Acute scarcity for executive leaders, partners, and strategic governance directors.',
          recruiterNote: 'Executive and director appointments (10+ years) typically involve bespoke remuneration including long-term incentive plans (LTIP), equity, or profit sharing.'
        };
      default:
        return {
          demand: 'Moderate candidate availability across UK commercial sectors.',
          recruiterNote: 'Compensation reflects autonomous delivery against standard UK occupational specifications.'
        };
    }
  }, [expYears]);

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
      const normInput = inputLower.replace(/\b(solutions)\b/g, 'solution');
      const normTitle = titleLower.replace(/\b(solutions)\b/g, 'solution');
      const match = titleLower === inputLower || 
                    normTitle === normInput ||
                    titleLower.includes(inputLower) || 
                    inputLower.includes(titleLower) ||
                    normTitle.includes(normInput) ||
                    normInput.includes(normTitle);
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
      const isLegal = titleLower.includes('solicitor') || titleLower.includes('law') || titleLower.includes('compliance');
      const isInsurance = titleLower.includes('underwriter') || titleLower.includes('actuary');
      const isTech = titleLower.includes('architect') || titleLower.includes('software') || titleLower.includes('engineer') || titleLower.includes('developer');
      const isMarketingOrComms = titleLower.includes('communication') || titleLower.includes('marketing') || titleLower.includes('comms') || titleLower.includes('brand') || titleLower.includes('pr');

      let movementText = '+2% to +4% broad UK professional services annual salary movement.';
      if (isAudit) {
        movementText = '+1% to +4% planned internal pay reviews for retained employees (Source: Barclay Simpson 2026 Internal Audit Salary Guide); external career moves between employers typically achieve 8% to 15% salary progression.';
      } else if (isQuantOrIB) {
        movementText = '+6% to +12% annual compensation movement across front-office trading, quant research, and M&A mandates.';
      } else if (isLegal) {
        movementText = '+3% to +6% annual associate scale movement; lateral hiring at 3–5y PQE attracts significant retention premiums.';
      } else if (isInsurance) {
        movementText = '+3% to +6% annual movement; specialty and Lloyd\'s syndicate lines command premium underwriting authority allocations.';
      } else if (isTech) {
        movementText = '+4% to +8% annual movement across UK enterprise technology, cloud architecture, and modern engineering platforms.';
      } else if (isMarketingOrComms) {
        movementText = '+3% to +6% annual salary movement across UK corporate affairs, internal engagement, and strategic marketing disciplines.';
      }

      return {
        ...predefined,
        confidence: 'High',
        confidenceLabel: 'High Confidence (Specialist Benchmark)',
        confidenceReason: 'Verified benchmark from Liberty Towers executive search mandates and published UK professional salary guides.',
        targetBonusText: isAudit 
          ? '0–10% typical (higher in specialist financial services)' 
          : isQuantOrIB 
          ? '30–50%+ variable target bonus'
          : isInsurance
          ? '15–30% typical (syndicate performance bonuses)'
          : isTech
          ? '15–25% typical (+ equity / performance bonus)'
          : isMarketingOrComms
          ? '10–20% typical (higher in FTSE / financial services)'
          : '10–20% typical',
        salaryMovementText: movementText,
        tiers: (predefined as any).tiers
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

    let confidenceScore: 'High' | 'Moderate' = 'Moderate';
    let confidenceLabel = 'Indicative Model (Broad UK Market)';
    let confidenceReason = 'Modelled from broader UK occupational datasets and ONS labour market benchmarks.';
    let salaryMovementText = '+2% to +4% annual UK commercial salary movement';
    let targetBonusText = '5–15% typical';

    if (isPublicSector) {
      confidenceScore = 'Moderate';
      confidenceReason = 'Parsed role with explicit public sector / local authority context.';
      targetBonusText = '0–5% typical (public sector / non-profit)';
      salaryMovementText = 'Public sector pay framework (NJC / NHS Agenda for Change)';
    } else if (isFinancialServices) {
      confidenceScore = 'Moderate';
      confidenceReason = 'Parsed role with explicit financial services & banking context.';
      targetBonusText = '15–30%+ typical (higher in investment banking and markets)';
      salaryMovementText = '+2% to +5% annual movement (Source: City & Financial Services Compensation Index)';
    } else if (isTechSector) {
      confidenceScore = 'Moderate';
      confidenceReason = 'Parsed role with explicit technology & software context.';
      targetBonusText = '10–20% typical (+ equity / option incentive)';
      salaryMovementText = '+2% to +4% annual movement (Source: UK Tech & SaaS Salary Benchmark)';
    } else if (isRetailSector) {
      confidenceScore = 'Moderate';
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
    // INDUSTRIAL, LOGISTICS, INFRASTRUCTURE, HEALTHCARE & OPERATIONAL BRANCHES

    // 0A. Civil, Structural & Infrastructure Engineering (Physical vs Software Engineering)
    if (/\b(civil|structural|geotechnical|highways?|bridge|drainage|infrastructure|building services|m&e)\s+(engineer|designer|consultant|technician)\b/i.test(inputLower) || /\b(civil engineer|structural engineer|highways engineer|geotechnical engineer)\b/i.test(inputLower)) {
      sector = "Engineering & Infrastructure";
      if (isDirectorLevel) {
        baseP10 = 70000; baseP50 = 92000; baseP90 = 130000;
        basePct = 88; bonusPct = 12;
        description = "Directs civil, structural and infrastructure delivery, major capital works, statutory approvals, and multi-disciplinary engineering teams.";
        demand = "High Scarcity (CEng Chartered Engineering Directors)";
        yoy = "3–6%";
        hiringInsight = "Chartered Engineering Directors (CEng MICE / MIStructE) command £85k–£120k+ with project delivery performance bonuses.";
        maxExpMultiplier = 1.40;
      } else {
        baseP10 = 36000; baseP50 = 54000; baseP90 = 78000;
        basePct = 92; bonusPct = 8;
        description = "Delivers civil and structural design, infrastructure modeling (BIM/CAD), site engineering assessments, and statutory technical compliance.";
        demand = "Constrained (Chartered & Senior Civil Engineers)";
        yoy = "3–5%";
        hiringInsight = "Chartership with the Institution of Civil Engineers (ICE) or IStructE commands an immediate £8,000–£15,000 salary premium over unchartered engineers.";
        maxExpMultiplier = 1.30;
      }
    }
    // 0B. Education, School Teaching & Leadership (STPCD Pay Framework)
    else if (/\b(teacher|teaching|primary teacher|secondary teacher|headteacher|head teacher|deputy head|special needs teacher|sen teacher|school leader)\b/i.test(inputLower)) {
      sector = "Education & School Leadership";
      const isLeadership = isDirectorLevel || /\b(headteacher|head teacher|deputy head|assistant head|principal)\b/i.test(inputLower);
      if (isLeadership) {
        baseP10 = 62000; baseP50 = 82000; baseP90 = 118000;
        basePct = 100; bonusPct = 0;
        description = "Directs school governance, instructional leadership, curriculum standards, regulatory compliance (Ofsted), and staff leadership.";
        demand = "High Demand (Headteachers & Executive Principals)";
        yoy = "School Teachers' Pay & Conditions Document (STPCD)";
        hiringInsight = "School leadership pay follows STPCD Leadership Pay Group scales, with London weighting (Inner/Outer) and pupil roll tiers.";
        maxExpMultiplier = 1.40;
      } else {
        baseP10 = 36000; baseP50 = 46000; baseP90 = 58000;
        basePct = 100; bonusPct = 0;
        description = "Delivers classroom instruction, curriculum planning, student assessment, and pastoral care under qualified teacher status (QTS).";
        demand = "Acute Shortage (Qualified Teachers - STEM, Primary, Secondary)";
        yoy = "STPCD Statutory Scales (Main & Upper Pay Ranges)";
        hiringInsight = "Classroom teachers follow national STPCD statutory points: M1–M6 Main Pay Scale progressing to Upper Pay Scale (U1–U3), with Inner London M1 starting at £40,317.";
        maxExpMultiplier = 1.30;
      }
    }
    // 0C. Registered Nurses & Clinical Nursing (NHS Agenda for Change Framework)
    else if (/\b(registered nurse|staff nurse|rgn|rmn|theatre nurse|icu nurse|district nurse|clinical nurse|nurse practitioner|midwife|ward sister|charge nurse)\b/i.test(inputLower)) {
      sector = "Healthcare & Clinical Nursing";
      const isSeniorNurse = isDirectorLevel || /\b(matron|lead nurse|nurse consultant|ward sister|charge nurse|advanced nurse)\b/i.test(inputLower);
      if (isSeniorNurse) {
        baseP10 = 49000; baseP50 = 58000; baseP90 = 74000;
        basePct = 100; bonusPct = 0;
        description = "Provides clinical ward leadership, advanced nurse practice, clinical governance, and team management.";
        demand = "Severe Scarcity (Band 7 / 8a Clinical Leads)";
        yoy = "NHS Agenda for Change Annual Pay Award";
        hiringInsight = "Senior nurses and ward managers map to NHS Agenda for Change Bands 7 & 8a. High Cost Area Supplement (HCAS) adds up to 20% in Inner London.";
        maxExpMultiplier = 1.35;
      } else {
        baseP10 = 32000; baseP50 = 38000; baseP90 = 46000;
        basePct = 100; bonusPct = 0;
        description = "Delivers direct clinical patient care, medication administration, care planning, and clinical triage under NMC registration.";
        demand = "Critical Scarcity (NMC Registered Nurses)";
        yoy = "NHS Agenda for Change (Band 5/6)";
        hiringInsight = "Registered nurses in the NHS start on Band 5 (£32,073 entry in 2026/27) progressing with recognized service to Band 6 (£39,959–£48,117). Private healthcare offers comparable base with flexible shift premiums.";
        maxExpMultiplier = 1.25;
      }
    }
    // 0D. Warehouse, Logistics & Supply Chain Operations Management
    else if (/\b(warehouse|logistics|distribution|supply chain|inventory|transport|depot)\s+(operations?\s+)?(manager|director|lead|controller|supervisor|head)\b/i.test(inputLower) || /\b(operations manager|distribution manager|transport manager|logistics manager)\b/i.test(inputLower)) {
      sector = "Logistics, Warehousing & Supply Chain Management";
      if (isDirectorLevel) {
        baseP10 = 65000; baseP50 = 85000; baseP90 = 125000;
        basePct = 85; bonusPct = 15;
        description = "Directs multi-site distribution network operations, supply chain strategy, carrier contracts, automation hubs, and logistics P&L.";
        demand = "High Scarcity (Logistics & Supply Chain Directors)";
        yoy = "2–5%";
        hiringInsight = "Supply chain and multi-site distribution directors command £80k–£120k+ with performance-linked bonus pools.";
        maxExpMultiplier = 1.45;
      } else {
        baseP10 = 38000; baseP50 = 50000; baseP90 = 68000;
        basePct = 90; bonusPct = 10;
        description = "Manages daily warehouse fulfilment, shift operations, health & safety (IOSH), inventory accuracy, and logistics team leadership.";
        demand = "Strong Demand for Experienced Warehouse & Ops Managers";
        yoy = "2–4%";
        hiringInsight = "Operations and shift managers in UK logistics golden-triangle hubs (Northampton, East/West Midlands) command £45,000–£58,000 base pay plus shift premiums.";
        maxExpMultiplier = 1.30;
      }
    }
    // 0E. Head Chef, Sous Chef & Culinary Leadership
    else if (/\b(head chef|executive chef|sous chef|pastry chef|chef de cuisine|culinary director)\b/i.test(inputLower)) {
      sector = "Hospitality & Culinary Leadership";
      const isExecOrHead = /\b(head chef|executive chef|culinary director)\b/i.test(inputLower) || isDirectorLevel;
      if (isExecOrHead) {
        baseP10 = 38000; baseP50 = 48000; baseP90 = 68000;
        basePct = 90; bonusPct = 10;
        description = "Leads kitchen brigade operations, menu development, gross profit margin control, supplier procurement, and food safety standards.";
        demand = "Acute Scarcity (Experienced Head Chefs & Kitchen Directors)";
        yoy = "3–6%";
        hiringInsight = "Head Chefs in premium venues and city centers command £42k–£55k+ base salary, plus tronc / service charge distributions and performance bonuses.";
        maxExpMultiplier = 1.35;
      } else {
        baseP10 = 30000; baseP50 = 36000; baseP90 = 44000;
        basePct = 92; bonusPct = 8;
        description = "Directs section food preparation, kitchen line execution, inventory control, and sous-chef brigade support.";
        demand = "High Demand for Qualified Sous Chefs & Section Leads";
        yoy = "2–5%";
        hiringInsight = "Sous Chefs track £32k–£40k across regional UK hubs with tronc additions.";
        maxExpMultiplier = 1.25;
      }
    }
    // A. Heavy Freight, HGV Class 1 & Artic Lorry Driving (Big Goods - High Salary)
    else if (/\b(hgv|lgv|artic|articulated|lorry|class 1|c\+e|big goods|heavy goods|tanker driver|haulage|heavy driver)\b/i.test(inputLower)) {
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
    // C. Forklift Truck, Materials Handling & Warehouse Logistics (Operatives)
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
    // F. Skilled Trades, Construction & Industrial Maintenance (Electricians, Plumbers, Gas)
    else if (/\b(electrician|plumber|carpenter|builder|mechanic|fitter|welder|handyman|maintenance technician|maintenance engineer|tradesperson|gas engineer|pipefitter)\b/i.test(inputLower)) {
      sector = "Skilled Trades & Industrial Engineering";
      baseP10 = 34000; baseP50 = 44000; baseP90 = 62000;
      basePct = 92; bonusPct = 8;
      description = "Executes technical trade installation, mechanical/electrical maintenance, diagnostics, and facility engineering operations.";
      demand = "High Scarcity (Certified Trades & JIB Approved)";
      yoy = "2–5%";
      hiringInsight = "Certified trade professionals (JIB Gold Card, 18th Edition, Gas Safe, NVQ Level 3) command £38,000–£48,000+ base rates, with overtime and van allowances.";
      maxExpMultiplier = 1.35;
    }
    // G. Frontline Hospitality, Retail, Catering & Customer Services
    else if (/\b(chef|cook|waiter|waitress|bartender|barista|retail assistant|store assistant|cashier|customer service|call centre)\b/i.test(inputLower)) {
      sector = "Hospitality, Retail & Customer Services";
      baseP10 = 24500; baseP50 = 28500; baseP90 = 36000;
      basePct = 95; bonusPct = 5;
      description = "Delivers customer service, retail operations, food preparation, or frontline service execution.";
      demand = "High Candidate Availability";
      yoy = "1–4%";
      hiringInsight = "Frontline roles track retail and hospitality pay agreements; supervisory and team leadership roles reach £30k–£35k.";
      maxExpMultiplier = 1.25;
    }
    // H. Care Assistants & Social Care Support (Frontline Support)
    else if (/\b(carer|care assistant|healthcare assistant|hca|support worker|care worker)\b/i.test(inputLower)) {
      sector = "Healthcare & Care Services";
      baseP10 = 24500; baseP50 = 29000; baseP90 = 38000;
      basePct = 95; bonusPct = 5;
      description = "Provides patient support, elderly or disability care, and social care service delivery under supervision.";
      demand = "High Demand for Care Staff";
      yoy = "1–4%";
      hiringInsight = "Pay closely tracks National Living Wage with NVQ Level 2/3 qualifications commanding modest differentials.";
      maxExpMultiplier = 1.25;
    }
    // 1. Audit, Governance & Risk - Distinct sub-role definitions
    else if (/\b(part qualified|pq auditor|pq audit)\b/i.test(inputLower)) {
      sector = "Audit & Public Practice";
      baseP10 = 42500; baseP50 = 52500; baseP90 = 60000; // at 1-3 yrs (0.80 mult) -> £34,000 / £42,000 / £48,000
      basePct = 95; bonusPct = 5;
      description = "Delivers audit testing, control evaluations, and statutory reporting support while progressing ACA/ACCA professional qualification.";
      demand = "High (Continuous Trainee & Associate Recruitment)";
      yoy = "5–8%";
      hiringInsight = "London part-qualified external audit ranges £34,000–£48,000 depending on exam passes (ACA/ACCA) and firm tier.";
    } 
    else if (/\b(external audit|external auditor|statutory audit|public practice audit)\b/i.test(inputLower)) {
      sector = "Audit & Public Practice";
      baseP10 = 62000; baseP50 = 76000; baseP90 = 90000;
      basePct = 88; bonusPct = 12;
      description = "Delivers statutory financial statement audits, internal control assessments, and regulatory assurance for public practice clients across Big Four, Top 10, and mid-tier firms.";
      demand = "Acute Scarcity (ACA / ACCA Qualified in London)";
      yoy = "5–9%";
      hiringInsight = "London newly qualified ACA/ACCA external audit averages £62,000–£76,000 in Big 4 and Top 10 firms.";
    }
    else if (/\b(it audit|it auditor|cyber audit|technology audit|systems audit)\b/i.test(inputLower)) {
      sector = "Audit, Governance & Risk";
      baseP10 = 75000; baseP50 = 92000; baseP90 = 110000;
      basePct = 85; bonusPct = 15;
      description = "Audits technology infrastructure, cyber security governance, cloud controls, and automated application systems.";
      demand = "Extreme Scarcity (DORA, Cloud & Cyber Governance)";
      yoy = "6–10%";
      hiringInsight = "CISA-qualified IT auditors in London command £75k–£110k+ across regulated financial services.";
    }
    else if (/\b(audit manager|head of audit|audit director|avp audit)\b/i.test(inputLower)) {
      sector = "Audit, Governance & Risk";
      baseP10 = 92000; baseP50 = 112000; baseP90 = 132000;
      basePct = 82; bonusPct = 18;
      description = "Leads internal or external audit teams, manages risk reporting, and presents governance recommendations to executive audit committees.";
      demand = "High Scarcity (Audit Committee & Leadership)";
      yoy = "5–8%";
      hiringInsight = "Audit Manager ranges span £92k–£112k in commerce up to £132k+ in specialist financial services with 15–25% bonus.";
    }
    else if (/\b(internal audit|internal auditor|audit|auditor)\b/i.test(inputLower)) {
      sector = "Audit, Governance & Risk";
      baseP10 = 68000; baseP50 = 82000; baseP90 = 95000;
      basePct = 88; bonusPct = 12;
      description = "Reviews internal controls, risk-management processes, financial governance and regulatory compliance. Identifies control weaknesses and recommends practical improvements.";
      demand = "High (Regulated Banking, Insurance & FTSE 100)";
      yoy = "4–7%";
      hiringInsight = "Internal Auditors (ACA/CIA 1–3 yrs PQE) range £68k–£95k base in London financial institutions.";
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
    // 4. Marketing, Brand, Communications, PR & Corporate Affairs
    else if (/\b(marketing|market|brand|growth|sales|commercial|business development|biz dev|bd|account director|sales director|communication|communications|comms|internal comms|corporate affairs|public relations|\bpr\b|media relations|employee engagement|content strategy)\b/i.test(inputLower)) {
      const isCommsSpecific = /\b(communication|communications|comms|internal comms|corporate affairs|public relations|\bpr\b|media relations|employee engagement)\b/i.test(inputLower);
      sector = isCommsSpecific 
        ? "Marketing & Corporate Communications" 
        : "Commercial, Sales, Marketing & Business Development";

      const isSeniorLeadership = isDirectorLevel || /\b(head of|director|vp|cmo|chief)\b/i.test(inputLower);
      const isManagerOrLead = /\b(manager|lead|specialist|business partner|bp|consultant|strategist)\b/i.test(inputLower);

      if (isSeniorLeadership) {
        baseP10 = 85000; baseP50 = 115000; baseP90 = 165000;
        basePct = 75; bonusPct = 25;
        description = isCommsSpecific
          ? "Leads enterprise corporate communications, executive narrative strategy, brand reputation, and internal stakeholder alignment."
          : "Leads commercial strategy, business development, omni-channel growth, revenue expansion, and executive sales operations.";
        demand = isCommsSpecific
          ? "High Demand (Corporate Comms & Internal Engagement Directors)"
          : "High Demand for Commercial & BD Directors";
        yoy = "+3% to +6%";
        hiringInsight = isCommsSpecific
          ? "Heads of Internal Communications and Comms Directors command executive compensation (£110k–£165k+), especially across FTSE transformations and financial services."
          : "Business Development and Commercial Directors with verified ROI on client acquisition and revenue growth command top-tier packages (£120k–£180k+).";
        maxExpMultiplier = 1.50;
      } else if (isManagerOrLead) {
        baseP10 = 55000; baseP50 = 72000; baseP90 = 95000;
        basePct = 85; bonusPct = 15;
        description = isCommsSpecific
          ? "Develops and executes internal communications strategies, executive leadership messaging, employee engagement programmes, and change management narratives."
          : "Drives product marketing campaigns, customer acquisition funnels, brand growth strategy, and team delivery.";
        demand = isCommsSpecific
          ? "High Demand for Experienced Comms & Marketing Managers"
          : "High Demand for Senior Marketing & Commercial Managers";
        yoy = "+3% to +5%";
        hiringInsight = isCommsSpecific
          ? "Internal Communications Managers are in high demand for corporate restructuring, hybrid-workforce engagement, and M&A integration. Financial services and professional firms offer 15–20% premiums."
          : "Senior Marketing Managers with proven campaign ROI and multi-channel expertise command upper-quartile remuneration (£70k–£95k+).";
        maxExpMultiplier = 1.40;
      } else {
        baseP10 = 30000; baseP50 = 44000; baseP90 = 62000;
        basePct = 90; bonusPct = 10;
        description = isCommsSpecific
          ? "Coordinates employee communications, newsletter distribution, intranet content, and digital messaging channels."
          : "Executes digital marketing campaigns, SEO/PPC channels, social media engagement, and lead generation funnels.";
        demand = "High Active Candidate Volume";
        yoy = "+2% to +4%";
        hiringInsight = "Digital Marketing Executives with hands-on platform certification (Google Ads, Meta, HubSpot) and demonstrable ROI command top quartile of scale.";
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
    // 7b. Tech & Enterprise Architecture (Solutions Architect, Enterprise Architect, Cloud Architect, Systems Architect)
    else if (/\b(architect|architecture)\b/i.test(inputLower) && !/\b(landscape|interior|building|civil|naval|garden)\b/i.test(inputLower)) {
      sector = "Tech & Software Engineering";
      const isPrincipalOrEnterprise = isDirectorLevel || /\b(enterprise|principal|lead|chief|head of|partner)\b/i.test(inputLower);

      if (isPrincipalOrEnterprise) {
        baseP10 = 105000; baseP50 = 145000; baseP90 = 195000;
        basePct = 80; bonusPct = 20;
        description = "Directs enterprise technology strategy, multi-cloud target architectures, legacy modernization, and architecture governance across business units.";
        demand = "Critical Scarcity (Principal & Enterprise Architects)";
        yoy = "+4% to +8%";
        hiringInsight = "Enterprise and Principal Solutions Architects command executive packages (£140k–£200k+). TOGAF, AWS/Azure Solution Architect Professional certs, and board stakeholder skills are highly valued.";
        maxExpMultiplier = 1.45;
      } else {
        baseP10 = 80000; baseP50 = 112000; baseP90 = 155000;
        basePct = 85; bonusPct = 15;
        description = "Designs, evaluates, and oversees enterprise IT systems, cloud platforms (AWS/Azure/GCP), microservices architectures, and technical integration roadmaps.";
        demand = "High Scarcity (Senior Solutions & Cloud Architects)";
        yoy = "+4% to +7%";
        hiringInsight = "Solutions Architecture is a senior IT discipline bridging engineering delivery and commercial strategy. Candidates command strong base salaries, remote flexibility, and 15–20% bonus incentives.";
        maxExpMultiplier = 1.35;
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
    else if (/\b(developer|software|frontend|backend|fullstack|programmer|cto|engineering director)\b/i.test(inputLower) || (/\bengineer\b/i.test(inputLower) && !/\b(civil|structural|geotechnical|highways?|bridge|drainage|infrastructure|site|building services|m&e|gas|heating|mechanical|pipefitter|maintenance engineer|audio engineer|sound engineer)\b/i.test(inputLower))) {
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
        baseP10 = 260000; baseP50 = 400000; baseP90 = 580000;
        basePct = 50; bonusPct = 50;
        description = "Directs quantitative strategy research, high-frequency execution architecture, alpha generation, and portfolio risk management.";
        demand = "Critical Scarcity (Quant Directors, PMs & Partners)";
        yoy = "8–18%";
        hiringInsight = "Quant Directors and Heads of Research receive top-tier buy-side compensation (£400k–£1m+ total comp with 50%+ bonus pools).";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 160000; baseP50 = 250000; baseP90 = 360000;
        basePct = 50; bonusPct = 50;
        description = "Engineers algorithmic trading models, high-frequency execution infrastructure, and strategy research.";
        demand = "Extreme Scarcity (Alpha Generation & High Sharpe Models)";
        yoy = "8–15%";
        hiringInsight = "Top prop shops (Citadel, Jane Street, Millennium, XTX) offer £250k+ base with 100–200% PnL bonus pools.";
      }
    } 
    // 11. Insurance Underwriting & Actuarial
    else if (/\b(underwriter|actuary|actuarial|insurance|broker|claims)\b/i.test(inputLower)) {
      sector = "Insurance, Actuarial & Specialty Reinsurance";
      if (isDirectorLevel) {
        baseP10 = 135000; baseP50 = 185000; baseP90 = 260000;
        basePct = 70; bonusPct = 30;
        description = "Directs underwriting portfolio strategy, Lloyd's syndicate exposure, risk appetite, pricing, and broker market relationships.";
        demand = "High Scarcity (Chief Actuaries & Active Underwriters)";
        yoy = "5–9%";
        hiringInsight = "Lloyd's and company market Underwriting Directors & Chief Actuaries command £185k–£260k+ base with significant performance bonuses.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 85000; baseP50 = 118000; baseP90 = 155000;
        basePct = 75; bonusPct = 25;
        description = "Evaluates portfolio risk, Lloyd's syndicate exposure, pricing strategy, and broker client relationships.";
        demand = "High Scarcity (Specialty Lines Underwriters & Qualified FIAs)";
        yoy = "5–8%";
        hiringInsight = "Lloyd's specialty underwriters (Cyber, Marine, Energy) and qualified FIAs average £110k–£155k base in London.";
      }
    }
    // 12. Journalism, Media, Editorial & News Publishing
    else if (/\b(journalist|journalism|reporter|sub-editor|subeditor|news editor|broadcast journalist|columnist|correspondent|copywriter|editorial|photojournalist|foreign correspondent|staff writer)\b/i.test(inputLower)) {
      sector = "Media, Journalism & Digital Publishing";
      if (isDirectorLevel || /\b(editor-in-chief|managing editor|head of news|editorial director)\b/i.test(inputLower)) {
        baseP10 = 75000; baseP50 = 105000; baseP90 = 150000;
        basePct = 92; bonusPct = 8;
        description = "Directs editorial strategy, newsroom operations, investigative features, cross-platform publishing, and media compliance.";
        demand = "High Scarcity (Senior Newsroom & Editorial Leaders)";
        yoy = "2–4%";
        hiringInsight = "Editors-in-Chief and Heads of News command senior compensation across national broadsheets, major broadcasters (BBC, Sky), and high-traffic digital publications.";
        maxExpMultiplier = 1.45;
      } else {
        baseP10 = 34000; baseP50 = 46000; baseP90 = 72000;
        basePct = 95; bonusPct = 5;
        description = "Investigates, researches, writes, and produces breaking news, features, and multimedia analysis across digital, broadcast, and print channels.";
        demand = "High Competition; Constrained for Specialist Financial, Tech & Investigative Beats";
        yoy = "2–4%";
        hiringInsight = "London national titles and broadcasters pay £4k–£6k London weighting over regional newsrooms. Specialist domain reporters (finance/City, policy, tech, investigative data) command significant premiums over general news desks.";
        maxExpMultiplier = 1.40;
      }
    }
    // 13. Property, Real Estate & Estate Agency
    else if (/\b(estate agent|lettings negotiator|sales negotiator|property negotiator|valuer|property valuer|branch manager property|residential sales|real estate agent|property manager|commercial agent|land agent|real estate negotiator)\b/i.test(inputLower)) {
      sector = "Property & Real Estate Services";
      if (isDirectorLevel || /\b(branch director|area director|head of sales|head of lettings|partner)\b/i.test(inputLower)) {
        baseP10 = 60000; baseP50 = 90000; baseP90 = 145000;
        basePct = 60; bonusPct = 40;
        description = "Leads branch sales and lettings operations, high-value prime property negotiations, vendor relationships, and estate agency territory growth.";
        demand = "High Scarcity (Prime Market & High-Billing Branch Directors)";
        yoy = "3–6%";
        hiringInsight = "Branch Directors and Prime Central London (PCL) partners command substantial profit share and instruction commissions, with total on-target earnings (OTE) reaching £120k–£220k+.";
        maxExpMultiplier = 1.50;
      } else {
        baseP10 = 26000; baseP50 = 34000; baseP90 = 48000;
        basePct = 60; bonusPct = 40;
        description = "Manages residential property sales, lettings negotiations, market valuations, vendor onboarding, and property conveyance progression.";
        demand = "High Demand for Proven Billing Negotiators";
        yoy = "3–6%";
        hiringInsight = "Estate agency compensation is heavily commission-geared: basic salaries (£24k–£36k) are combined with 30–50% variable commission, delivering realistic on-target earnings (OTE) of £45k–£65k+ in London.";
        maxExpMultiplier = 1.35;
      }
    }
    // 14. Medical Practitioners, Doctors, Paediatricians & Clinical Specialists
    else if (/\b(paediatri\w*|pediatri\w*|doctor|physician|consultant doctor|medical doctor|registrar doctor|clinical lead|general practitioner|gp|surgeon|specialty doctor|consultant paediatrician|consultant pediatrician|anaesthetist|psychiatrist|radiologist)\b/i.test(inputLower)) {
      sector = "Healthcare & Clinical Medicine";
      if (isDirectorLevel || /\b(consultant|clinical director|medical director|head of paediatrics|lead consultant)\b/i.test(inputLower) || /\b(paediatri\w*|pediatri\w*)\b/i.test(inputLower)) {
        baseP10 = 99500; baseP50 = 122000; baseP90 = 165000;
        basePct = 95; bonusPct = 5;
        description = "Delivers expert medical care, specialist paediatric diagnosis, clinical leadership, inpatient ward management, and patient care governance within NHS Trusts and private medical facilities.";
        demand = "Acute Scarcity (NHS Consultant & Specialist Registrars)";
        yoy = "3–6% (NHS Pay Review Body Framework)";
        hiringInsight = "Governed by national NHS Consultant & Specialist Doctor pay scales (basic £99.5k–£150.5k+). Remuneration is augmented by 20–30% through on-call rota banding, Extra Programmed Activities (EPAs), Clinical Impact Awards, and private practice/Harley Street sessions. NHS Defined Benefit Pension Scheme (~20.6% employer contribution) adds significant total reward value.";
        maxExpMultiplier = 1.35;
      } else {
        baseP10 = 55000; baseP50 = 74000; baseP90 = 98000;
        basePct = 95; bonusPct = 5;
        description = "Provides clinical care, patient diagnosis, acute medical intervention, and inpatient management under NHS medical specialty training programmes.";
        demand = "High Scarcity (Specialty Trainees & Resident Doctors)";
        yoy = "3–6%";
        hiringInsight = "Specialty Registrars (ST3–ST8) and resident doctors receive basic salaries of £50k–£74k, augmented by 20–35% in unsocial hours / out-of-hours rota supplements, giving average gross NHS earnings of £70k–£95k+.";
        maxExpMultiplier = 1.30;
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
      confidenceLabel: confidenceLabel,
      confidenceReason: confidenceReason,
      targetBonusText: targetBonusText,
      salaryMovementText: salaryMovementText,
      baseP10: baseP10,
      baseP50: baseP50,
      baseP90: baseP90,
      maxExpMultiplier: maxExpMultiplier,
      basePct: basePct,
      bonusPct: bonusPct,
      demand: demand,
      hiringInsight: hiringInsight,
      tiers: null,
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

  // Experience level metadata
  const expMetadata: Record<string, { label: string; defaultMultiplier: number }> = {
    '1-3': { label: '1–3 Years (Junior / Associate / 1–2y PQE)', defaultMultiplier: 0.75 },
    '3-6': { label: '3–6 Years (Mid-Level Specialist / 3–5y PQE)', defaultMultiplier: 1.00 },
    '6-10': { label: '6–10 Years (Senior Specialist / Lead)', defaultMultiplier: 1.25 },
    '10+': { label: '10+ Years (Leadership / Partner / Director)', defaultMultiplier: 1.50 }
  };

  const currentExpMeta = useMemo(() => {
    return expMetadata[expYears] || expMetadata['1-3'];
  }, [expYears]);

  // Dynamic salary calculation
  const regMult = parsedLocation.multiplier;
  const refMult = refinementMultiplier;

  let baseP10Val = 30000;
  let baseP50Val = 40000;
  let baseP90Val = 55000;

  if (activeRoleData.tiers && (activeRoleData.tiers as any)[expYears]) {
    const tier = (activeRoleData.tiers as any)[expYears];
    baseP10Val = tier.p10;
    baseP50Val = tier.p50;
    baseP90Val = tier.p90;
  } else {
    // Custom role: baseP10/50/90 scaled by calibrated expFactor
    const expFactor = expMetadata[expYears]?.defaultMultiplier || 1.0;
    baseP10Val = ((activeRoleData as any).baseP10 || 35000) * expFactor;
    baseP50Val = ((activeRoleData as any).baseP50 || 48000) * expFactor;
    baseP90Val = ((activeRoleData as any).baseP90 || 68000) * expFactor;
  }

  // Work style multiplier: Exact parity between office and hybrid
  const styleMultiplier = parsedLocation.derivedStyle === 'remote' 
    ? (parsedLocation.regionKey === 'london' ? 0.95 : 1.0) 
    : 1.0;

  const rawP10 = baseP10Val * regMult * styleMultiplier * refMult;
  const rawP50 = baseP50Val * regMult * styleMultiplier * refMult;
  const rawP90 = baseP90Val * regMult * styleMultiplier * refMult;

  const nmwFloor = parsedLocation.isOverseasEU ? 18000 : (parsedLocation.regionKey === 'london' ? 28000 : 25000);
  
  const p10 = Math.max(nmwFloor, Math.round(rawP10 / 500) * 500);
  const p50 = Math.max(p10 + 2000, Math.round(rawP50 / 500) * 500);
  const p90 = Math.max(p50 + 4000, Math.round(rawP90 / 500) * 500);

  const basePct = (activeRoleData as any).basePct || 90;
  const bonusPct = (activeRoleData as any).bonusPct || 10;

  const inputTitleLower = (roleInput || activeRoleData.title).toLowerCase();
  const isLegalRole = inputTitleLower.includes('solicitor') || inputTitleLower.includes('legal') || inputTitleLower.includes('counsel') || inputTitleLower.includes('lawyer');
  const isTechRole = inputTitleLower.includes('developer') || inputTitleLower.includes('software') || inputTitleLower.includes('engineer') || inputTitleLower.includes('tech') || inputTitleLower.includes('architect');
  const isAuditRole = inputTitleLower.includes('audit');
  const isInsuranceRole = inputTitleLower.includes('underwriter') || inputTitleLower.includes('actuary') || inputTitleLower.includes('insurance');
  const isMarketingOrCommsRole = inputTitleLower.includes('marketing') || inputTitleLower.includes('communication') || inputTitleLower.includes('comms') || inputTitleLower.includes('brand') || inputTitleLower.includes('pr');

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
          <div className="flex items-center space-x-2 sm:space-x-3">
            <a 
              href="https://www.libertytowers.co.uk/labour-talent-index/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-slate-200 border border-orange-500 hover:border-orange-600 px-3 py-2 rounded-lg transition flex items-center space-x-1.5 font-medium shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
              <span>LT Index <span className="hidden sm:inline">(Market Sentiment)</span></span>
            </a>
            <a
              href="/profile-review"
              className="text-xs text-blue-900 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg transition flex items-center space-x-1.5 font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-800" />
              <span>LinkedIn Review</span>
            </a>
            <a
              href="/cv-review"
              className="text-xs text-emerald-900 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition flex items-center space-x-1.5 font-semibold shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>CV Review</span>
            </a>
            <a
              href="/hiring-cost-calculator"
              className="text-xs text-indigo-900 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-2 rounded-lg transition flex items-center space-x-1.5 font-semibold shadow-xs"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-700" />
              <span>Hiring Calculator</span>
            </a>
            <button
              onClick={() => setViewMode(viewMode === 'guided' ? 'full' : 'guided')}
              className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-lg transition flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-800" />
              <span className="hidden md:inline">{viewMode === 'guided' ? 'Salary Directory' : 'Salary Benchmarks'}</span>
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
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore indicative UK base salary ranges. Pay varies by sector, employer, qualifications and the responsibilities of the role.
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
                      placeholder="Example: Internal Auditor, Commercial Solicitor, Software Engineer..."
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-800/10 transition"
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      'Internal Auditor',
                      'IT Auditor',
                      'Commercial Solicitor',
                      'Specialty Underwriter',
                      'Software Engineer',
                      'Audit Manager',
                      'External Auditor'
                    ].map((role) => (
                      <button
                        key={role}
                        type="button"
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
                  
                  {/* Input 2: Years Experience / PQE */}
                  <div className="flex flex-col">
                    <div className="min-h-[44px] flex items-end pb-2">
                      <label className="text-sm font-bold text-slate-900 leading-tight">
                        Experience / PQE Level
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
                      <option value="1-3">1–3 Years (Junior / Associate / 1–2y PQE)</option>
                      <option value="3-6">3–6 Years (Mid-Level Specialist / 3–5y PQE)</option>
                      <option value="6-10">6–10 Years (Senior Lead / Manager)</option>
                      <option value="10+">10+ Years (Executive / Partner / Director)</option>
                    </select>
                  </div>

                  {/* Input 3: Location & Setup */}
                  <div className="flex flex-col">
                    <div className="min-h-[44px] flex items-end pb-2">
                      <label className="text-sm font-bold text-slate-900 leading-tight">
                        Location & Working Setup
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
                          placeholder="Example: London, hybrid / Manchester / Birmingham"
                          className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 text-slate-900 pl-10 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800/10 transition h-[48px]"
                        />
                      </div>
                      <div className="mt-1.5">
                        <span className="text-[11px] text-slate-500 block">
                          Parsed: <strong className="text-slate-800">{parsedLocation.regionName}</strong> ({parsedLocation.derivedStyle})
                        </span>
                        {parsedLocation.warning && (
                          <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md mt-1 block">
                            ℹ️ {parsedLocation.warning}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Optional Refinements Accordion */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowRefinements(!showRefinements)}
                    className="text-xs font-semibold text-blue-900 hover:text-blue-800 flex items-center space-x-1.5 transition"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{showRefinements ? 'Hide Optional Refinements' : '+ Refine Estimate (Sector, Employer Type, Specialist Remit)'}</span>
                  </button>

                  {showRefinements && (
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                          Employer / Organisation Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'standard', label: 'Established Corporate / Mid-Market (Standard)' },
                            { id: 'specialist', label: 'Specialist Boutique / High-Growth (+10%)' },
                            { id: 'city_elite', label: 'City / US Elite / Bulge Bracket (+45%)' },
                            { id: 'public', label: 'Public Sector / NHS / Local Authority' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setEmployerType(opt.id as any)}
                              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                employerType === opt.id
                                  ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {isLegalRole && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Legal Practice Setting (Experience evaluated as PQE)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'default', label: 'Commercial In-House / Regional Practice' },
                              { id: 'city_law', label: 'City & US Elite Law Firm Practice' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setRoleSpecialism(opt.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                  roleSpecialism === opt.id
                                    ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isTechRole && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Technical Domain Specialism
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'default', label: 'General Commercial Web & Applications' },
                              { id: 'fintech', label: 'FinTech / High-Throughput Cloud & AI (+20%)' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setRoleSpecialism(opt.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                  roleSpecialism === opt.id
                                    ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isAuditRole && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Audit Specialism & Industry Focus
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'default', label: 'Commercial Internal / External Audit' },
                              { id: 'cisa', label: 'IT & Cyber Security Audit (CISA) (+15%)' },
                              { id: 'banking_fs', label: 'Investment Banking & Capital Markets (+20%)' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setRoleSpecialism(opt.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                  roleSpecialism === opt.id
                                    ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isInsuranceRole && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Underwriting Market & Class
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'default', label: 'Commercial Company Market Lines' },
                              { id: 'lloyds', label: 'Lloyd\'s Syndicate Specialty Lines (+20%)' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setRoleSpecialism(opt.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                  roleSpecialism === opt.id
                                    ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isMarketingOrCommsRole && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Corporate Sector Focus
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'default', label: 'Commercial & Mid-Market Enterprise' },
                              { id: 'banking_fs', label: 'Financial Services & City Corporate (+20%)' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setRoleSpecialism(opt.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                  roleSpecialism === opt.id
                                    ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
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
                          : 'bg-blue-50 text-blue-900 border-blue-200'
                      }`} title={(activeRoleData as any).confidenceReason || ''}>
                        {(activeRoleData as any).confidenceLabel || ((activeRoleData as any).confidence === 'High' ? 'High Confidence (Specialist Benchmark)' : 'Indicative Model (Broad UK Market)')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {activeRoleData.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
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
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Indicative UK Base Salary</h4>
                    <span className="text-[11px] text-slate-400">Excludes annual bonus, pension & equity</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Indicative Lower Range */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Indicative Lower Range
                      </span>
                      <span className="text-2xl font-bold text-slate-800">
                        {formatCurrency(p10)}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-1">Typical entry into grade or smaller firm</span>
                    </div>

                    {/* Indicative Midpoint */}
                    <div className="bg-blue-50/60 border-2 border-blue-800/40 rounded-xl p-5 text-center relative shadow-sm">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                        Modelled Midpoint
                      </div>
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                        Indicative Midpoint
                      </span>
                      <span className="text-3xl font-extrabold text-blue-950">
                        {formatCurrency(p50)}
                      </span>
                      <span className="text-[11px] text-blue-900/80 block mt-1">Modelled market reference point for autonomous delivery</span>
                    </div>

                    {/* Specialist Upper Range */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Specialist Upper Range
                      </span>
                      <span className="text-2xl font-bold text-slate-800">
                        {formatCurrency(p90)}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-1">Upper decile, scarce certifications, or premium-paying firms</span>
                    </div>

                  </div>
                </div>

                {/* Expandable Transparency Drawer */}
                <div className="border border-slate-200 rounded-xl bg-slate-50/70 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowMethodologyDrawer(!showMethodologyDrawer)}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-100/80 transition"
                  >
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-blue-900" />
                      <span>How this estimate was produced</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showMethodologyDrawer ? 'rotate-180' : ''}`} />
                  </button>
                  {showMethodologyDrawer && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-3 leading-relaxed">
                      <div>
                        <strong className="text-slate-800 block mb-0.5">1. Evidence & Data Sources</strong>
                        <span>Calibrated against executed search mandates from Liberty Towers, verified UK professional salary guides ({activeRoleData.title.toLowerCase().includes('audit') ? 'Barclay Simpson 2026 Internal Audit Salary Guide, ICAEW' : activeRoleData.title.toLowerCase().includes('underwriter') ? 'Lloyd\'s of London Market Intelligence, Actuarial Post' : activeRoleData.title.toLowerCase().includes('solicitor') ? 'Law Society of England & Wales, The Lawyer Remuneration Survey' : 'Liberty Towers Market Intelligence, ONS ASHE Occupational Data'}), and signed client offer letters.</span>
                      </div>
                      <div>
                        <strong className="text-slate-800 block mb-0.5">2. Geographic & Working Setup Calibration</strong>
                        <span>Location parsed as <strong className="text-slate-900">{parsedLocation.regionName}</strong> (applied regional factor: <strong>{parsedLocation.multiplier}x</strong> London benchmark). Office-based and hybrid arrangements share equal base salary parity in modern UK professional practice.</span>
                      </div>
                      <div>
                        <strong className="text-slate-800 block mb-0.5">3. Seniority & Responsibility Level</strong>
                        <span>Assumes autonomous execution at the <strong className="text-slate-900">{currentExpMeta.label}</strong> tier. Midpoint represents fully autonomous delivery for standard specifications; upper range reflects scarce technical certifications, team leadership, or top-decile paying firms.</span>
                      </div>
                      <div>
                        <strong className="text-slate-800 block mb-0.5">4. Total Reward Separation</strong>
                        <span>Figures represent gross basic annual salary in GBP (£). Annual performance bonuses, pensions (employer contributions), private medical, car allowances, LTIP, and equity/options are excluded from base numbers and evaluated separately.</span>
                      </div>
                    </div>
                  )}
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
                        <strong className="text-slate-900">Candidate Market:</strong> {seniorityCommentary.demand}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <strong className="text-slate-800">Salary Movement:</strong> {(activeRoleData as any).salaryMovementText}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1.5 italic border-t border-slate-200/60 pt-1.5">
                        💡 Recruiter Note: {seniorityCommentary.recruiterNote}
                      </p>
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
          /* Salary Directory View */
          <div className="bg-[#111827] text-white border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold">Pre-cached Industry Roles</h2>
              <button
                onClick={() => setViewMode('guided')}
                className="text-xs text-amber-400 font-semibold"
              >
                ← Salary Benchmarks
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
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600">
            <a href="/hiring-cost-calculator" className="hover:underline hover:text-blue-900 transition font-medium">Hiring Calculator</a>
            <span>•</span>
            <a href="/cv-review" className="hover:underline hover:text-blue-900 transition font-medium">CV Review</a>
            <span>•</span>
            <a href="/profile-review" className="hover:underline hover:text-blue-900 transition font-medium">LinkedIn Audit</a>
            <span>•</span>
            <a href="/salaries" className="hover:underline hover:text-blue-900 transition font-medium">Salary Guides</a>
            <span>•</span>
            <a href="/about" className="hover:underline hover:text-blue-900 transition font-medium">About</a>
            <span>•</span>
            <a href="/methodology" className="hover:underline hover:text-blue-900 transition font-medium">Methodology</a>
            <span>•</span>
            <a href="/contact" className="hover:underline hover:text-blue-900 transition font-medium">Contact</a>
            <span>•</span>
            <a href="/privacy-policy" className="hover:underline hover:text-blue-900 transition font-medium">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:underline hover:text-blue-900 transition font-medium">Terms</a>
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
