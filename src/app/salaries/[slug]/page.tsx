import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import salaryData from '@/data/salaries.json';
import { 
  ArrowLeft, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  SlidersHorizontal, 
  ArrowRight,
  BookOpen,
  Users
} from 'lucide-react';

interface TierCompensation {
  p10: number;
  p50: number;
  p90: number;
  desc: string;
}

interface RoleBenchmarkMeta {
  basePct: number;
  bonusPct: number;
  demand: string;
  movement: string;
  certifications: string[];
  overview: string;
  responsibilities: string[];
  marketContext: string;
  tiers: {
    '1-3': TierCompensation;
    '3-6': TierCompensation;
    '6-10': TierCompensation;
    '10+': TierCompensation;
  };
}

// 2026 Recalibrated City of London & UK Executive Search Compensation Benchmarks
const ROLE_DETAILS: Record<string, RoleBenchmarkMeta> = {
  'audit-part-qualified': {
    basePct: 95,
    bonusPct: 5,
    demand: 'High (Continuous Trainee & Associate Recruitment)',
    movement: '+5% to +8% annual base increase on passing ACA/ACCA stages',
    certifications: ['ACA (ICAEW) in progress', 'ACCA in progress', 'Strong University Degree'],
    overview: 'Part-Qualified Auditors operate within public practice (Big Four, Top 10, mid-tier accountancy firms) or corporate internal audit teams. They perform substantive testing, transaction sampling, statutory balance sheet reconciliations, and internal control reviews while actively progressing their professional ACA or ACCA qualification.',
    responsibilities: [
      'Executing substantive testing of balance sheet accounts and profit-and-loss line items.',
      'Performing walkthrough tests of internal financial controls and risk governance procedures.',
      'Drafting audit queries, workpapers, and documentation in accordance with UK GAAP / IFRS.',
      'Liaising directly with client finance managers and operational department leads.',
      'Supporting Senior Auditors and Managers in preparing audit committee review packs.'
    ],
    marketContext: 'London and regional practice firms compete intensely for high-performing trainees who have passed early professional exams. First-time pass rates and clean academic records command premium trainee salaries and full exam support packages.',
    tiers: {
      '1-3': { p10: 34000, p50: 42000, p90: 48000, desc: 'Early ACA/ACCA stage trainee; transaction testing' },
      '3-6': { p10: 52000, p50: 62000, p90: 72000, desc: 'Finalist / Newly Qualified; audit engagement lead' },
      '6-10': { p10: 70000, p50: 85000, p90: 100000, desc: 'Assistant Manager / Audit Supervisor' },
      '10+': { p10: 90000, p50: 110000, p90: 135000, desc: 'Senior Practice Manager / Department Head' }
    }
  },
  'audit-internal': {
    basePct: 88,
    bonusPct: 12,
    demand: 'High (Regulated Banking, Insurance & FTSE 100 Scarcity)',
    movement: '+4% to +7% annual base movement across financial services & commerce',
    certifications: ['ACA / ACCA Qualified', 'CIA (Certified Internal Auditor)', 'CISA (IT Audit)'],
    overview: 'Internal Auditors evaluate the adequacy and effectiveness of an organization\'s risk management, internal controls, and corporate governance systems. Operating independently of line management, they provide objective assurance to executive management and the Board\'s Audit Committee.',
    responsibilities: [
      'Planning and conducting end-to-end operational, financial, and compliance audit reviews.',
      'Assessing the design and operating effectiveness of enterprise risk controls.',
      'Identifying root causes of control breakdowns and formulating commercially practical remediation plans.',
      'Drafting clear, actionable internal audit reports for presentation to executive leadership.',
      'Tracking management remediation commitments and performing post-audit validation.'
    ],
    marketContext: 'Demand remains robust in regulated financial services (banking, insurance, asset management) and corporate enterprises undergoing digital transformation or ERP implementations.',
    tiers: {
      '1-3': { p10: 45000, p50: 55000, p90: 65000, desc: 'Junior Internal Auditor; walkthroughs and control testing' },
      '3-6': { p10: 68000, p50: 82000, p90: 95000, desc: 'Senior Internal Auditor (ACA/CIA 1-3y PQE); end-to-end audit reviews' },
      '6-10': { p10: 92000, p50: 110000, p90: 130000, desc: 'Internal Audit Manager / Principal Auditor' },
      '10+': { p10: 125000, p50: 155000, p90: 195000, desc: 'Head of Internal Audit (HIA) / Chief Audit Executive' }
    }
  },
  'audit-external': {
    basePct: 88,
    bonusPct: 12,
    demand: 'Acute Talent Shortage (Post-Qualified ACAs in London)',
    movement: '+5% to +9% annual base increase for senior associates & managers',
    certifications: ['ACA (ICAEW Qualified)', 'ACCA Qualified', 'ICAS'],
    overview: 'External Auditors deliver independent statutory financial statement audits, regulatory assurance, and technical accounting assessments for public and private corporate clients across the Big Four and mid-tier accountancy firms.',
    responsibilities: [
      'Managing audit fieldwork, team workflow, and timetable execution for client engagements.',
      'Evaluating complex accounting treatments under UK GAAP, IFRS, and US GAAP.',
      'Reviewing revenue recognition, asset impairment models, and going-concern assessments.',
      'Directing and mentoring junior trainee auditors and reviewing engagement files.',
      'Serving as the primary on-site technical contact for client financial controllers and CFOs.'
    ],
    marketContext: 'Post-qualified ACAs (1–3 years PQE) represent one of the most liquid talent pools in the UK market, with significant competition between public practice retention and corporate in-house moves.',
    tiers: {
      '1-3': { p10: 38000, p50: 48000, p90: 56000, desc: 'Audit Associate / Trainee ACA' },
      '3-6': { p10: 62000, p50: 76000, p90: 90000, desc: 'Newly Qualified Senior Associate / Assistant Manager (Big 4 / Top 10)' },
      '6-10': { p10: 85000, p50: 108000, p90: 130000, desc: 'Audit Manager / Senior Manager' },
      '10+': { p10: 135000, p50: 180000, p90: 260000, desc: 'Audit Director / Responsible Individual (RI) Partner Track' }
    }
  },
  'audit-it': {
    basePct: 85,
    bonusPct: 15,
    demand: 'Extreme Scarcity (DORA, Cloud & Cyber Governance Mandates)',
    movement: '+6% to +10% annual movement driven by cybersecurity regulations',
    certifications: ['CISA (Certified Information Systems Auditor)', 'CRISC', 'CISSP', 'AWS/Azure Security'],
    overview: 'IT Auditors provide specialized assurance over IT general controls (ITGC), application controls, cloud security architecture, data governance frameworks, and operational resilience across modern digital infrastructure.',
    responsibilities: [
      'Evaluating IT general controls across identity access management (IAM), change control, and backups.',
      'Auditing automated application controls within major ERP environments (SAP, Oracle, NetSuite).',
      'Assessing cybersecurity governance, penetration testing remediation, and third-party vendor risks.',
      'Reviewing cloud infrastructure compliance across AWS, Microsoft Azure, and GCP deployments.',
      'Aligning audit scopes with regulatory mandates including DORA, FCA Operational Resilience, and ISO 27001.'
    ],
    marketContext: 'The intersection of automated controls, cyber assurance, and stringent regulatory oversight (DORA and FCA frameworks) makes certified IT Auditors among the most highly sought-after governance professionals.',
    tiers: {
      '1-3': { p10: 50000, p50: 62000, p90: 74000, desc: 'Associate IT Auditor; ITGC testing and SOX reviews' },
      '3-6': { p10: 75000, p50: 92000, p90: 110000, desc: 'Senior IT / Cyber Auditor (CISA); cloud & ERP application audits' },
      '6-10': { p10: 100000, p50: 125000, p90: 150000, desc: 'IT Audit Manager / Technology Governance Lead' },
      '10+': { p10: 145000, p50: 180000, p90: 230000, desc: 'Head of Technology Audit / CISO Assurance Director' }
    }
  },
  'audit-manager': {
    basePct: 82,
    bonusPct: 18,
    demand: 'High (Audit Committee Interface & Strategic Leadership)',
    movement: '+5% to +8% annual base growth with executive bonus packages',
    certifications: ['ACA / ACCA Fellow', 'CIA', 'Extensive Stakeholder Leadership'],
    overview: 'Audit Managers lead audit engagement portfolios or corporate internal audit divisions, setting audit plans, overseeing senior auditors, and presenting critical governance evaluations directly to Executive Committees and Boards of Directors.',
    responsibilities: [
      'Designing annual risk-based audit plans and allocating engagement resources effectively.',
      'Leading multiple audit teams across concurrent financial, operational, and regulatory reviews.',
      'Presenting high-impact audit findings and thematic risk assessments to Audit Committees.',
      'Managing senior stakeholder relationships across C-suite executives and business division leaders.',
      'Driving continuous improvement in audit methodology, data analytics, and continuous auditing tools.'
    ],
    marketContext: 'Experienced managers capable of translating technical accounting and risk findings into strategic commercial insights for C-level leadership command top-tier compensation packages.',
    tiers: {
      '1-3': { p10: 78000, p50: 90000, p90: 105000, desc: 'New Audit Manager (1st-2nd Year in Grade)' },
      '3-6': { p10: 92000, p50: 112000, p90: 132000, desc: 'Senior Audit Manager; multi-business unit portfolio' },
      '6-10': { p10: 120000, p50: 145000, p90: 180000, desc: 'Group Audit Lead / Deputy Head of Audit' },
      '10+': { p10: 160000, p50: 210000, p90: 285000, desc: 'Chief Audit Executive / Partner / Executive Director' }
    }
  },
  'ins-underwriter-sr': {
    basePct: 75,
    bonusPct: 25,
    demand: 'High Scarcity (Lloyd\'s Specialty Lines, Cyber, Marine & Energy)',
    movement: '+5% to +8% base growth plus substantial annual performance bonuses',
    certifications: ['ACII (Chartered Insurance Institute)', 'Degree in Finance/Economics'],
    overview: 'Specialty Underwriters evaluate, price, and accept complex commercial risks in the Lloyd\'s of London and company insurance markets, building profitable portfolios and cultivating key broker syndicate relationships.',
    responsibilities: [
      'Underwriting complex commercial risks across specialty classes (Cyber, Marine, Energy, D&O, Property).',
      'Structuring risk pricing, policy wordings, reinsurance protections, and capacity allocations.',
      'Developing and managing productive trading relationships with major international broker houses.',
      'Monitoring portfolio loss ratios, aggregate exposure accumulations, and treaty performance.',
      'Ensuring strict adherence to underwriting authority limits and PRA/Lloyd\'s regulatory standards.'
    ],
    marketContext: 'Specialty classes such as Cyber, Renewable Energy, and Political Risk command premium compensation due to specialized risk modeling requirements and Lloyd\'s syndicate competition.',
    tiers: {
      '1-3': { p10: 48000, p50: 62000, p90: 76000, desc: 'Assistant Underwriter / Box Trainee at Lloyd\'s' },
      '3-6': { p10: 85000, p50: 115000, p90: 150000, desc: 'Class Underwriter / Specialty Lines Underwriter' },
      '6-10': { p10: 130000, p50: 170000, p90: 220000, desc: 'Senior Underwriter / Syndicate Portfolio Lead' },
      '10+': { p10: 195000, p50: 270000, p90: 390000, desc: 'Active Underwriter / Chief Underwriting Officer (CUO)' }
    }
  },
  'ins-actuary-lead': {
    basePct: 75,
    bonusPct: 25,
    demand: 'Acute Scarcity (FIA Reserving, Pricing & Solvency II Leads)',
    movement: '+6% to +10% annual base growth with significant performance bonus pools',
    certifications: ['FIA (Fellow of the Institute and Faculty of Actuaries)', 'MSc Mathematics/Statistics'],
    overview: 'Risk Modeling & Pricing Actuaries develop sophisticated stochastic risk frameworks, catastrophe models, and capital adequacy reserves for general insurers, life companies, and Lloyd\'s managing agencies.',
    responsibilities: [
      'Developing and refining dynamic financial pricing models for complex multi-line insurance portfolios.',
      'Performing technical reserving analyses under IFRS 17 and Solvency II regulatory frameworks.',
      'Building stochastic catastrophe models and capital assessment algorithms in Python and R.',
      'Presenting capital adequacy and underwriting risk insights to Chief Risk Officers and Actuarial Function Holders.',
      'Advising executive leadership on reinsurance treaty optimization and capital allocation strategies.'
    ],
    marketContext: 'Qualified FIAs with strong Python/data science capabilities remain among the highest-paid technical specialists in London financial services.',
    tiers: {
      '1-3': { p10: 52000, p50: 68000, p90: 82000, desc: 'Actuarial Analyst (Core exam progress in CT/CS)' },
      '3-6': { p10: 90000, p50: 120000, p90: 150000, desc: 'Newly Qualified FIA / Senior Pricing Actuary' },
      '6-10': { p10: 130000, p50: 170000, p90: 215000, desc: 'Lead Reserving Actuary / Capital Modeling Manager' },
      '10+': { p10: 190000, p50: 260000, p90: 360000, desc: 'Chief Actuary / Actuarial Function Holder / CRO' }
    }
  },
  'quant-researcher-sr': {
    basePct: 50,
    bonusPct: 50,
    demand: 'Extreme Scarcity (Top Prop Trading Desks & Buy-Side Hedge Funds)',
    movement: '+8% to +18% base growth with uncapped PnL-linked bonus structures',
    certifications: ['PhD / MSc in Mathematics, Theoretical Physics, CS or ML', 'Deep Python / C++ / PyTorch'],
    overview: 'Quantitative Researchers design and backtest mathematical alpha models, statistical arbitrage strategies, and systematic execution algorithms for quantitative hedge funds and proprietary trading firms.',
    responsibilities: [
      'Conducting rigorous quantitative research on large-scale tick-level and alternative datasets.',
      'Designing predictive statistical models and machine learning alphas for equities, FX, and futures markets.',
      'Developing high-performance backtesting frameworks and simulating portfolio execution slippage.',
      'Collaborating with C++ execution engineers to deploy strategies into production trading systems.',
      'Managing risk parameters, factor exposures, and portfolio capacity across market regimes.'
    ],
    marketContext: 'Buy-side quantitative research offers the highest total compensation in financial markets. Base salaries often exceed £200k with performance bonuses frequently doubling or tripling base pay based on strategy Sharpe ratio.',
    tiers: {
      '1-3': { p10: 120000, p50: 165000, p90: 225000, desc: 'Junior Quant Researcher (PhD entry; +50-100% bonus)' },
      '3-6': { p10: 175000, p50: 260000, p90: 360000, desc: 'Quant Researcher (Proven alpha track record; +100-200% bonus)' },
      '6-10': { p10: 260000, p50: 400000, p90: 580000, desc: 'Senior Lead Quant / Sub-Portfolio Manager (+PnL share)' },
      '10+': { p10: 360000, p50: 650000, p90: 1200000, desc: 'Head of Quant Research / Managing Director / Fund Partner' }
    }
  },
  'quant-dev-cpp': {
    basePct: 60,
    bonusPct: 40,
    demand: 'Extreme Scarcity (Sub-Microsecond Low Latency Architecture)',
    movement: '+8% to +14% annual compensation growth across top market-makers',
    certifications: ['BSc/MSc Computer Science', 'Expert Modern C++ (C++20/23)', 'Linux Kernel Bypass / FPGA'],
    overview: 'HFT C++ Core Developers build sub-microsecond algorithmic execution gateways, high-throughput market data parsers, and custom low-latency networking stacks for ultra-fast trading desks.',
    responsibilities: [
      'Engineering deterministic, lock-free, zero-allocation C++ trading systems and execution gateways.',
      'Optimizing market data feeds, exchange protocol parsers (FIX, ITCH, OUCH), and order book state engines.',
      'Profiling cache locality, memory layout, CPU instruction cycles, and kernel bypass (Solarflare OpenOnload).',
      'Implementing automated automated risk checks and circuit breakers at sub-microsecond latencies.',
      'Partnering closely with quantitative researchers to productionize mathematical trading models.'
    ],
    marketContext: 'London prop trading firms and hedge funds (e.g. Citadel, Jane Street, Optiver, XTX) benchmark C++ developers against top US tech and quantitative finance baselines.',
    tiers: {
      '1-3': { p10: 100000, p50: 145000, p90: 190000, desc: 'Junior Low-Latency Engineer (High-throughput systems)' },
      '3-6': { p10: 160000, p50: 230000, p90: 310000, desc: 'Core HFT C++ Developer (Exchange gateways & order books)' },
      '6-10': { p10: 230000, p50: 340000, p90: 460000, desc: 'Principal Systems Architect / Low-Latency Lead' },
      '10+': { p10: 320000, p50: 480000, p90: 680000, desc: 'Head of Core Engineering / CTO Prop Trading' }
    }
  },
  'ib-vp-ma': {
    basePct: 55,
    bonusPct: 45,
    demand: 'High (Deal Execution Leads & M&A Sector Coverage)',
    movement: '+6% to +10% base increases with substantial closed-deal bonus allocations',
    certifications: ['ACA', 'CFA Charterholder', 'Top-Tier MBA / Finance Degree'],
    overview: 'M&A Vice Presidents lead the day-to-day execution of buy-side and sell-side corporate finance transactions, directing financial modeling, managing deal teams, and interfacing directly with corporate boards and private equity clients.',
    responsibilities: [
      'Leading M&A deal execution from transaction kickoff through due diligence and legal completion.',
      'Supervising complex financial modeling, DCF valuations, leveraged buyout (LBO) models, and merger consequence analyses.',
      'Drafting confidential information memoranda (CIM), executive pitchbooks, and board presentations.',
      'Managing transaction workflows across legal counsel, tax advisors, accounting firms, and target executives.',
      'Mentoring and developing cohorts of investment banking analysts and associates.'
    ],
    marketContext: 'City of London corporate finance compensation combines strong base salaries with significant variable bonuses linked to closed deal volume and firm performance.',
    tiers: {
      '1-3': { p10: 80000, p50: 120000, p90: 155000, desc: 'Investment Banking Analyst / Associate (+30-50% bonus)' },
      '3-6': { p10: 145000, p50: 190000, p90: 245000, desc: 'M&A Vice President (VP 1-3; +60-100% deal bonus)' },
      '6-10': { p10: 200000, p50: 265000, p90: 340000, desc: 'Director / Executive Director (+80-140% bonus)' },
      '10+': { p10: 290000, p50: 420000, p90: 650000, desc: 'Managing Director / Sector Head (+100-200%+ bonus pool)' }
    }
  },
  'tech-ai-principal': {
    basePct: 75,
    bonusPct: 25,
    demand: 'Extreme Scarcity (Enterprise LLMs, High-Throughput Inference & GPU Clusters)',
    movement: '+10% to +18% annual compensation growth including equity grants',
    certifications: ['MSc/PhD in AI/CS', 'Deep PyTorch, vLLM, TensorRT-LLM, CUDA', 'Kubernetes / Cloud ML'],
    overview: 'Principal AI Systems Engineers design and scale enterprise LLM infrastructure, retrieval-augmented generation (RAG) architectures, model fine-tuning pipelines, and high-throughput GPU inference clusters.',
    responsibilities: [
      'Architecting resilient, scalable AI infrastructure for generative AI models and multi-agent systems.',
      'Implementing high-throughput, low-latency inference engines using vLLM, TensorRT, and CUDA acceleration.',
      'Designing production RAG pipelines, semantic search engines, and vector database architectures.',
      'Overseeing data curation, embedding pipelines, fine-tuning workflows, and model evaluation benchmarks.',
      'Establishing AI safety, evaluation guardrails, and compliance governance across enterprise workloads.'
    ],
    marketContext: 'Generative AI deployment is the single fastest-growing technical discipline in the UK, with venture-backed tech and tier-1 financial institutions competing aggressively for experienced systems architects.',
    tiers: {
      '1-3': { p10: 80000, p50: 105000, p90: 135000, desc: 'AI / Machine Learning Engineer' },
      '3-6': { p10: 125000, p50: 165000, p90: 210000, desc: 'Senior AI Systems Engineer (Production LLMs & inference)' },
      '6-10': { p10: 170000, p50: 225000, p90: 290000, desc: 'Principal AI Systems Engineer / Infrastructure Architect' },
      '10+': { p10: 230000, p50: 320000, p90: 440000, desc: 'VP of AI Engineering / Chief AI Architect' }
    }
  },
  'legal-compliance-head': {
    basePct: 80,
    bonusPct: 20,
    demand: 'High (FCA / PRA Regulated Governance & Financial Crime Leads)',
    movement: '+5% to +8% base pay growth with executive bonus packages',
    certifications: ['Qualified Solicitor / Barrister', 'ICA Diploma in Governance, Risk & Compliance'],
    overview: 'Heads of Regulatory Compliance lead corporate compliance programs, regulatory relationships (FCA, PRA, Bank of England), anti-money laundering (AML) controls, and ethical conduct frameworks across financial institutions.',
    responsibilities: [
      'Establishing and maintaining comprehensive compliance frameworks across FCA/PRA regulated entities.',
      'Serving as the primary liaison with regulatory bodies and managing regulatory examinations.',
      'Directing financial crime prevention, sanctions screening, AML, and Market Abuse compliance.',
      'Advising executive boards and senior management on new regulatory developments and strategic impacts.',
      'Overseeing compliance monitoring, risk assessments, policy approvals, and staff training.'
    ],
    marketContext: 'Increasing regulatory complexity across the UK and European financial markets maintains strong executive demand for seasoned compliance heads with direct regulatory engagement track records.',
    tiers: {
      '1-3': { p10: 55000, p50: 72000, p90: 88000, desc: 'Compliance Officer / Regulatory Analyst' },
      '3-6': { p10: 90000, p50: 122000, p90: 155000, desc: 'Senior Compliance Manager / Deputy MLRO' },
      '6-10': { p10: 140000, p50: 185000, p90: 235000, desc: 'Head of Compliance / Designated SMF16' },
      '10+': { p10: 200000, p50: 280000, p90: 375000, desc: 'Chief Compliance Officer (CCO) / Group Legal & Compliance Director' }
    }
  },
  'grad-quant-analyst': {
    basePct: 70,
    bonusPct: 30,
    demand: 'Extreme Competition (Top 1% STEM Graduate Scheme Cohorts in London)',
    movement: '+10% to +18% rapid annual progression across early trading desk rotations',
    certifications: ['1st Class / 2:1 Honours in Mathematics, Physics, Computing or Engineering'],
    overview: 'Graduate Quantitative Analysts enter quantitative hedge funds, prop trading firms, and investment banks to assist in mathematical research, algorithmic backtesting, data engineering, and automated trade execution.',
    responsibilities: [
      'Cleaning, analyzing, and transforming financial market tick data and macroeconomic time series.',
      'Implementing mathematical prototypes and statistical models in Python and modern C++.',
      'Conducting empirical backtests and performance evaluations on algorithmic trading strategies.',
      'Automating daily trading reports, PnL attribution, and factor risk decomposition.',
      'Participating in structured firm-wide quantitative trading and market microstructure training programs.'
    ],
    marketContext: 'Elite graduate schemes in London quantitative finance and market making offer starting packages significantly higher than broader corporate graduate schemes.',
    tiers: {
      '1-3': { p10: 80000, p50: 115000, p90: 155000, desc: '1st–3rd Year STEM Graduate Scheme (Base + £25k–£60k sign-on/bonus)' },
      '3-6': { p10: 135000, p50: 190000, p90: 255000, desc: 'Desk Quant / Junior Systematic Trader' },
      '6-10': { p10: 210000, p50: 330000, p90: 480000, desc: 'Quantitative Portfolio Manager / Strategy Lead' },
      '10+': { p10: 340000, p50: 550000, p90: 950000, desc: 'Partner / Head of Systematic Trading' }
    }
  },
  'media-journalist': {
    basePct: 95,
    bonusPct: 5,
    demand: 'High Competition; Constrained for Specialist Financial, Tech & Investigative Beats',
    movement: '+2% to +5% annual growth with London weighting adjustments',
    certifications: ['NCTJ Diploma in Journalism', 'Media Law (NCTJ/BCTJ)', 'Data Journalism & Analytics'],
    overview: 'Journalists and Digital News Reporters investigate, verify, write, and produce breaking news, in-depth features, and multimedia analysis across national broadsheets, digital publishers, wire agencies (Reuters, Bloomberg), and broadcast networks (BBC, Sky).',
    responsibilities: [
      'Originating, researching, and breaking exclusive news stories across print, digital, and broadcast channels.',
      'Cultivating and protecting confidential industry and regulatory source networks.',
      'Conducting interviews, fact-checking assertions, and navigating UK media law and defamation standards.',
      'Producing data-driven visualizations, multimedia packages, newsletters, and podcast briefings.',
      'Collaborating with sub-editors, digital strategists, and desk editors to optimize audience engagement.'
    ],
    marketContext: 'While early-career and general lifestyle journalism sees high applicant volumes, experienced domain correspondents covering City finance, macroeconomic policy, technology, and investigative data command substantial salary premiums across London newsrooms.',
    tiers: {
      '1-3': { p10: 24000, p50: 30000, p90: 36000, desc: 'Junior / Trainee Reporter (Regional newsroom / local reporting / digital writer)' },
      '3-6': { p10: 34000, p50: 44000, p90: 58000, desc: 'Staff Journalist / Desk Reporter (National publication / broadcast producer)' },
      '6-10': { p10: 48000, p50: 65000, p90: 85000, desc: 'Senior Specialist Correspondent / News Editor (City, politics, investigative lead)' },
      '10+': { p10: 75000, p50: 105000, p90: 145000, desc: 'Editor-in-Chief / Head of News / Executive Managing Editor' }
    }
  },
  'property-estate-agent': {
    basePct: 65,
    bonusPct: 35,
    demand: 'High Demand for Proven Billing Negotiators & Branch Valuers',
    movement: '+3% to +6% annual base movement plus high commission velocity',
    certifications: ['NAEA Propertymark (Sales)', 'ARLA Propertymark (Lettings)', 'RICS Associate', 'Full UK Driving Licence'],
    overview: 'Estate Agents and Property Valuers oversee residential and commercial property transactions, market valuations, vendor representations, buyer negotiations, and deal progression to exchange and completion.',
    responsibilities: [
      'Conducting comprehensive market appraisals, property valuations, and vendor pitching.',
      'Negotiating purchase and lettings offers between buyers, landlords, and applicants to maximize sale value.',
      'Managing sales progression workflows with conveyancers, mortgage brokers, and surveyors.',
      'Sourcing new instructions through proactive market canvassing and local network development.',
      'Ensuring strict compliance with anti-money laundering (AML) and Consumer Protection regulations.'
    ],
    marketContext: 'Estate agency is a heavily performance-incentivised sector where basic salaries (£25k–£45k) are coupled with 25%–40%+ variable commission splits. Prime Central London (PCL) desks command major transaction fee upside on multi-million pound listings.',
    tiers: {
      '1-3': { p10: 22000, p50: 28000, p90: 38000, desc: 'Trainee / Junior Negotiator (Basic pay; OTE £32k–£48k)' },
      '3-6': { p10: 30000, p50: 42000, p90: 62000, desc: 'Sales & Lettings Negotiator / Senior Negotiator (Basic pay; OTE £55k–£85k)' },
      '6-10': { p10: 42000, p50: 58000, p90: 88000, desc: 'Senior Valuer / Assistant Branch Manager (Basic pay; OTE £75k–£115k)' },
      '10+': { p10: 60000, p50: 90000, p90: 145000, desc: 'Branch Director / Prime Central London Partner (Basic pay; OTE £120k–£220k+)' }
    }
  },
  'medical-paediatrician-doctor': {
    basePct: 95,
    bonusPct: 5,
    demand: 'Acute Scarcity (GMC Specialist Register & NHS Consultant Shortages)',
    movement: '+3% to +6% annual growth (NHS Pay Review Body Framework)',
    certifications: ['GMC Full Registration with Licence to Practise', 'GMC Specialist Register (Paediatrics)', 'MRCPCH / FRCPCH', 'APLS (Advanced Paediatric Life Support)'],
    overview: 'Paediatricians are medical doctors specializing in the diagnosis, medical management, and holistic treatment of infants, children, and young people across NHS acute hospital trusts, neonatal intensive care units (NICU), and specialist outpatient clinics.',
    responsibilities: [
      'Diagnosing and treating complex paediatric acute illnesses, developmental disorders, and chronic conditions.',
      'Leading emergency resuscitation, neonatal intensive care, and paediatric inpatient ward rounds.',
      'Collaborating within multidisciplinary clinical teams, safeguarding leads, and allied health professionals.',
      'Directing clinical governance, junior doctor training rotations, and NHS quality improvement initiatives.',
      'Conducting specialist outpatient clinics and liaising with tertiary specialist centres.'
    ],
    marketContext: 'UK paediatric medical compensation is governed by national NHS Medical & Dental Pay circulars. Remuneration is augmented by 20–30% through on-call rota banding, Extra Programmed Activities (EPAs), Clinical Impact Awards, and private clinic sessions, alongside the NHS Defined Benefit Pension (~20.6% employer contribution).',
    tiers: {
      '1-3': { p10: 45000, p50: 54000, p90: 68000, desc: 'Specialty Trainee ST1–ST3 (Resident Doctor basic; gross £55k–£68k with on-call)' },
      '3-6': { p10: 58000, p50: 72000, p90: 88000, desc: 'Specialty Registrar ST4–ST8 (MRCPCH qualified; gross £72k–£95k with rota banding)' },
      '6-10': { p10: 99500, p50: 114000, p90: 130000, desc: 'Newly Appointed NHS Consultant Paediatrician (Thresholds 1–4 + EPAs / On-call)' },
      '10+': { p10: 120000, p50: 148000, p90: 185000, desc: 'Senior Consultant / Clinical Director / Private Clinic Practice (Thresholds 5–8+ & NCIAs)' }
    }
  }
};

export function generateStaticParams() {
  return salaryData.roles.map((role) => ({
    slug: role.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = salaryData.roles.find((r) => r.id === slug);
  if (!role) return { title: 'Salary Guide Not Found | Liberty Towers' };

  return {
    title: `${role.title} Salary Guide 2026 | Liberty Towers Intelligence`,
    description: `UK salary benchmarks, 10th-90th percentiles, regional multipliers, and hiring insights for ${role.title}.`,
  };
}

export default async function RoleSalaryGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = salaryData.roles.find((r) => r.id === slug);

  if (!role) {
    notFound();
  }

  const details = ROLE_DETAILS[slug] || {
    basePct: 85,
    bonusPct: 15,
    demand: 'Steady UK Market Demand',
    movement: '+4% to +6% annual growth',
    certifications: ['Relevant Degree', 'Professional Accreditation'],
    overview: role.description,
    responsibilities: [
      'Delivering core professional domain responsibilities.',
      'Ensuring compliance with UK industry and statutory frameworks.',
      'Collaborating across executive and operational teams.'
    ],
    marketContext: 'Compensation is calibrated against active market placements and UK economic indicators.',
    tiers: {
      '1-3': { p10: 45000, p50: 60000, p90: 75000, desc: 'Junior / Associate' },
      '3-6': { p10: 70000, p50: 90000, p90: 115000, desc: 'Mid-Level Specialist' },
      '6-10': { p10: 100000, p50: 130000, p90: 165000, desc: 'Senior / Lead' },
      '10+': { p10: 140000, p50: 180000, p90: 240000, desc: 'Director / Senior Head' }
    }
  };

  const expTierKeys = ['1-3', '3-6', '6-10', '10+'] as const;
  const expTierLabels = {
    '1-3': '1–3 Years (Junior / Associate)',
    '3-6': '3–6 Years (Mid-Level Specialist)',
    '6-10': '6–10 Years (Senior / Lead)',
    '10+': '10+ Years (Highly Experienced / Director)'
  };

  const midTier = details.tiers['3-6'];

  // Regional comparisons (based on mid-level 3-6 yrs 50th percentile)
  const regions = [
    { name: 'London & City Hubs (Square Mile, Mayfair)', mult: 1.00 },
    { name: 'UK National Remote', mult: 0.92 },
    { name: 'South East England (Reading, Oxford, Guildford)', mult: 0.88 },
    { name: 'Midlands (Birmingham, Nottingham, Northampton)', mult: 0.82 },
    { name: 'Scotland & Regional Centers (Edinburgh, Glasgow)', mult: 0.82 },
    { name: 'North UK (Manchester, Leeds, Liverpool)', mult: 0.80 },
    { name: 'European Remote (Spain, Portugal, Poland)', mult: 0.72 },
    { name: 'US Remote (New York, San Francisco)', mult: 1.30 },
  ];

  const formatCurrency = (val: number) => `£${Math.round(val / 500) * 500}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-blue-950 text-white py-6 border-b border-blue-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link 
            href="/salaries" 
            className="flex items-center space-x-2 text-xs font-semibold text-blue-200 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Salary Guides</span>
          </Link>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">2026 Compensation Guide</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-10">
        {/* Title Block */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
              {role.category}
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Verified 2026 City & London Market
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            {role.title} Salary Guide & Benchmarks (UK 2026)
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            {role.description}
          </p>
        </div>

        {/* Quick Numbers Banner (Mid-Level 3-6y) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Baseline London Compensation (Mid-Level Specialist: 3–6 Years)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold uppercase text-slate-500 block">10th Percentile (Min)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                {formatCurrency(midTier.p10)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Developing / Standard Base</span>
            </div>

            <div className="p-5 bg-blue-50/60 border-2 border-blue-800 rounded-xl shadow-xs">
              <span className="text-xs font-bold uppercase text-blue-900 block">50th Percentile (Median)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1 block">
                {formatCurrency(midTier.p50)}
              </span>
              <span className="text-xs font-semibold text-blue-800 mt-1 block">Market Standard Benchmark</span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold uppercase text-slate-500 block">90th Percentile (Peak)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                {formatCurrency(midTier.p90)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Top Decile / Tier-1 Firm</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <div>
              <strong className="block text-slate-900 font-semibold mb-1">Base vs Variable Split:</strong>
              <span>{details.basePct}% Base Salary / {details.bonusPct}% Annual Variable Bonus</span>
            </div>
            <div>
              <strong className="block text-slate-900 font-semibold mb-1">Annual Market Movement:</strong>
              <span>{details.movement}</span>
            </div>
          </div>
        </div>

        {/* In-depth Role Analysis */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-900" />
              Role Overview & Mandate
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {details.overview}
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Core Responsibilities */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Key Responsibilities & Deliverables</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {details.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-slate-100" />

          {/* Certifications & Market Dynamics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-900" />
                Required Credentials & Qualifications
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                {details.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-900" />
                Candidate Demand & Market Scarcity
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {details.marketContext}
              </p>
            </div>
          </div>
        </section>

        {/* Experience Level Percentiles Table */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-900" />
            Compensation by Experience Tier (London Base)
          </h2>
          <p className="text-xs text-slate-500">
            Calibrated for London & City financial hubs. Excludes annual performance bonuses, pensions, and equity awards.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-3.5">Experience Tier</th>
                  <th className="p-3.5">10th % (Min)</th>
                  <th className="p-3.5 bg-blue-100/60 text-blue-950">50th % (Median)</th>
                  <th className="p-3.5">90th % (Peak)</th>
                  <th className="p-3.5">Typical Scope & Remit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {expTierKeys.map((tierKey) => {
                  const t = details.tiers[tierKey];
                  return (
                    <tr key={tierKey} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-900">{expTierLabels[tierKey]}</td>
                      <td className="p-3.5 text-slate-600">{formatCurrency(t.p10)}</td>
                      <td className="p-3.5 font-bold text-blue-900 bg-blue-50/30">{formatCurrency(t.p50)}</td>
                      <td className="p-3.5 text-slate-600">{formatCurrency(t.p90)}</td>
                      <td className="p-3.5 text-xs text-slate-500">{t.desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Regional Multiplier Breakdown */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-900" />
            Regional Salary Multipliers for {role.title}
          </h2>
          <p className="text-xs text-slate-500">
            Regional median salaries (50th percentile) calculated across UK geographic centers and remote working options.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {regions.map((reg) => (
              <div key={reg.name} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-slate-500 block truncate" title={reg.name}>{reg.name}</span>
                <span className="text-lg font-bold text-slate-900 block">{formatCurrency(midTier.p50 * reg.mult)}</span>
                <span className="text-xs text-blue-800 font-medium block">Index: {reg.mult.toFixed(2)}x London</span>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive CTA */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white rounded-2xl p-8 shadow-sm text-center sm:text-left sm:flex items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Calculate custom benchmarks for this role</h3>
            <p className="text-xs sm:text-sm text-blue-200">
              Adjust work style (onsite/hybrid/remote), custom regional postcodes, and experience tiers in real-time.
            </p>
          </div>
          <Link
            href={`/?role=${encodeURIComponent(role.title)}`}
            className="inline-block mt-4 sm:mt-0 bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition whitespace-nowrap"
          >
            Open in Live Calculator →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Liberty Towers | Executive Search & Talent Intelligence</span>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:underline text-slate-600">Calculator</Link>
            <span>•</span>
            <Link href="/salaries" className="hover:underline text-slate-600">All Salary Guides</Link>
            <span>•</span>
            <Link href="/methodology" className="hover:underline text-slate-600">Methodology</Link>
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
