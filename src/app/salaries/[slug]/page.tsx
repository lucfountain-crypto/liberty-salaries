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

interface RoleBenchmarkMeta {
  baseP10: number;
  baseP50: number;
  baseP90: number;
  basePct: number;
  bonusPct: number;
  demand: string;
  movement: string;
  certifications: string[];
  overview: string;
  responsibilities: string[];
  marketContext: string;
}

// Role-specific rich compensation intelligence dictionary
const ROLE_DETAILS: Record<string, RoleBenchmarkMeta> = {
  'audit-part-qualified': {
    baseP10: 30000,
    baseP50: 36000,
    baseP90: 42000,
    basePct: 95,
    bonusPct: 5,
    demand: 'High (Continuous Trainee & Associate Recruitment)',
    movement: '+4% to +7% annual movement upon passing professional exam stages',
    certifications: ['ACA (ICAEW) in progress', 'ACCA in progress', 'Strong University Degree'],
    overview: 'Part-Qualified Auditors operate within public practice (Big Four, Top 10, mid-tier accountancy firms) or corporate internal audit teams. They perform substantive testing, transaction sampling, statutory balance sheet reconciliations, and internal control reviews while actively progressing their professional ACA or ACCA qualification.',
    responsibilities: [
      'Executing substantive testing of balance sheet accounts and profit-and-loss line items.',
      'Performing walkthrough tests of internal financial controls and risk governance procedures.',
      'Drafting audit queries, workpapers, and documentation in accordance with UK GAAP / IFRS.',
      'Liaising directly with client finance managers and operational department leads.',
      'Supporting Senior Auditors and Managers in preparing audit committee review packs.'
    ],
    marketContext: 'London and regional practice firms compete intensely for high-performing trainees who have passed early professional exams. First-time pass rates and clean academic records command premium trainee salaries and full exam support packages.'
  },
  'audit-internal': {
    baseP10: 50000,
    baseP50: 66000,
    baseP90: 80000,
    basePct: 92,
    bonusPct: 8,
    demand: 'Moderate to High; constrained for SOX & regulated sector specialists',
    movement: '+3% to +5% annual base movement across FTSE 250 & financial services',
    certifications: ['ACA', 'ACCA', 'CIA (Certified Internal Auditor)', 'CISA (IT Audit)'],
    overview: 'Internal Auditors evaluate the adequacy and effectiveness of an organization\'s risk management, internal controls, and corporate governance systems. Operating independently of line management, they provide objective assurance to executive management and the Board\'s Audit Committee.',
    responsibilities: [
      'Planning and conducting end-to-end operational, financial, and compliance audit reviews.',
      'Assessing the design and operating effectiveness of enterprise risk controls.',
      'Identifying root causes of control breakdowns and formulating commercially practical remediation plans.',
      'Drafting clear, actionable internal audit reports for presentation to executive leadership.',
      'Tracking management remediation commitments and performing post-audit validation.'
    ],
    marketContext: 'Demand remains robust in regulated financial services (banking, insurance, asset management) and corporate enterprises undergoing digital transformation or ERP implementations.'
  },
  'audit-external': {
    baseP10: 50000,
    baseP50: 72500,
    baseP90: 93750,
    basePct: 88,
    bonusPct: 12,
    demand: 'High across London & Top 10 Practice Groups',
    movement: '+4% to +8% annual base increase for post-qualified seniors and assistant managers',
    certifications: ['ACA (ICAEW Qualified)', 'ACCA Qualified', 'ICAS'],
    overview: 'External Auditors deliver independent statutory financial statement audits, regulatory assurance, and technical accounting assessments for public and private corporate clients across the Big Four and mid-tier accountancy firms.',
    responsibilities: [
      'Managing audit fieldwork, team workflow, and timetable execution for client engagements.',
      'Evaluating complex accounting treatments under UK GAAP, IFRS, and US GAAP.',
      'Reviewing revenue recognition, asset impairment models, and going-concern assessments.',
      'Directing and mentoring junior trainee auditors and reviewing engagement files.',
      'Serving as the primary on-site technical contact for client financial controllers and CFOs.'
    ],
    marketContext: 'Post-qualified ACAs (1–3 years PQE) represent one of the most liquid talent pools in the UK market, with significant competition between public practice retention and corporate in-house moves.'
  },
  'audit-it': {
    baseP10: 55000,
    baseP50: 75000,
    baseP90: 95000,
    basePct: 90,
    bonusPct: 10,
    demand: 'High Scarcity (Cloud, Cyber & Automated Control Assurance)',
    movement: '+5% to +8% annual movement driven by cybersecurity governance mandates',
    certifications: ['CISA (Certified Information Systems Auditor)', 'CRISC', 'CISSP', 'AWS/Azure Security'],
    overview: 'IT Auditors provide specialized assurance over IT general controls (ITGC), application controls, cloud security architecture, data governance frameworks, and operational resilience across modern digital infrastructure.',
    responsibilities: [
      'Evaluating IT general controls across identity access management (IAM), change control, and backups.',
      'Auditing automated application controls within major ERP environments (SAP, Oracle, NetSuite).',
      'Assessing cybersecurity governance, penetration testing remediation, and third-party vendor risks.',
      'Reviewing cloud infrastructure compliance across AWS, Microsoft Azure, and GCP deployments.',
      'Aligning audit scopes with regulatory mandates including DORA, FCA Operational Resilience, and ISO 27001.'
    ],
    marketContext: 'The intersection of automated controls, cyber assurance, and stringent regulatory oversight (DORA and FCA frameworks) makes certified IT Auditors among the most highly sought-after governance professionals.'
  },
  'audit-manager': {
    baseP10: 69000,
    baseP50: 80250,
    baseP90: 105000,
    basePct: 85,
    bonusPct: 15,
    demand: 'High (Leadership & Audit Committee Interface)',
    movement: '+4% to +6% annual base growth with performance bonus eligibility',
    certifications: ['ACA / ACCA Fellow', 'CIA', 'Extensive Stakeholder Leadership'],
    overview: 'Audit Managers lead audit engagement portfolios or corporate internal audit divisions, setting audit plans, overseeing senior auditors, and presenting critical governance evaluations directly to Executive Committees and Boards of Directors.',
    responsibilities: [
      'Designing annual risk-based audit plans and allocating engagement resources effectively.',
      'Leading multiple audit teams across concurrent financial, operational, and regulatory reviews.',
      'Presenting high-impact audit findings and thematic risk assessments to Audit Committees.',
      'Managing senior stakeholder relationships across C-suite executives and business division leaders.',
      'Driving continuous improvement in audit methodology, data analytics, and continuous auditing tools.'
    ],
    marketContext: 'Experienced managers capable of translating technical accounting and risk findings into strategic commercial insights for C-level leadership command top-tier compensation packages.'
  },
  'ins-underwriter-sr': {
    baseP10: 70000,
    baseP50: 95000,
    baseP90: 135000,
    basePct: 80,
    bonusPct: 20,
    demand: 'High for Specialty Lines, Cyber & Marine/Energy',
    movement: '+4% to +7% base pay growth plus substantial annual performance bonuses',
    certifications: ['ACII (Chartered Insurance Institute)', 'Degree in Finance/Economics'],
    overview: 'Specialty Underwriters evaluate, price, and accept complex commercial risks in the Lloyd\'s of London and company insurance markets, building profitable portfolios and cultivating key broker syndicate relationships.',
    responsibilities: [
      'Underwriting complex commercial risks across specialty classes (Cyber, Marine, Energy, D&O, Property).',
      'Structuring risk pricing, policy wordings, reinsurance protections, and capacity allocations.',
      'Developing and managing productive trading relationships with major international broker houses.',
      'Monitoring portfolio loss ratios, aggregate exposure accumulations, and treaty performance.',
      'Ensuring strict adherence to underwriting authority limits and PRA/Lloyd\'s regulatory standards.'
    ],
    marketContext: 'Specialty classes such as Cyber, Renewable Energy, and Political Risk command premium compensation due to specialized risk modeling requirements and Lloyd\'s syndicate competition.'
  },
  'ins-actuary-lead': {
    baseP10: 80000,
    baseP50: 115000,
    baseP90: 165000,
    basePct: 80,
    bonusPct: 20,
    demand: 'Acute Scarcity (Solvency II, IFRS 17 & Cat Modeling Specialists)',
    movement: '+5% to +9% annual base growth with significant performance bonus pools',
    certifications: ['FIA (Fellow of the Institute and Faculty of Actuaries)', 'MSc Mathematics/Statistics'],
    overview: 'Risk Modeling & Pricing Actuaries develop sophisticated stochastic risk frameworks, catastrophe models, and capital adequacy reserves for general insurers, life companies, and Lloyd\'s managing agencies.',
    responsibilities: [
      'Developing and refining dynamic financial pricing models for complex multi-line insurance portfolios.',
      'Performing technical reserving analyses under IFRS 17 and Solvency II regulatory frameworks.',
      'Building stochastic catastrophe models and capital assessment algorithms in Python and R.',
      'Presenting capital adequacy and underwriting risk insights to Chief Risk Officers and Actuarial Function Holders.',
      'Advising executive leadership on reinsurance treaty optimization and capital allocation strategies.'
    ],
    marketContext: 'Qualified FIAs with strong Python/data science capabilities remain among the highest-paid technical specialists in London financial services.'
  },
  'quant-researcher-sr': {
    baseP10: 120000,
    baseP50: 220000,
    baseP90: 350000,
    basePct: 50,
    bonusPct: 50,
    demand: 'Extreme Scarcity (Top-Tier Systematic Trading & Prop Shops)',
    movement: '+8% to +15% base growth with uncapped PnL-linked bonus structures',
    certifications: ['PhD / MSc in Mathematics, Physics, Machine Learning or CS', 'Deep Python / C++ / PyTorch'],
    overview: 'Quantitative Researchers design and backtest mathematical alpha models, statistical arbitrage strategies, and systematic execution algorithms for quantitative hedge funds and proprietary trading firms.',
    responsibilities: [
      'Conducting rigorous quantitative research on large-scale tick-level and alternative datasets.',
      'Designing predictive statistical models and machine learning alphas for equities, FX, and futures markets.',
      'Developing high-performance backtesting frameworks and simulating portfolio execution slippage.',
      'Collaborating with C++ execution engineers to deploy strategies into production trading systems.',
      'Managing risk parameters, factor exposures, and portfolio capacity across market regimes.'
    ],
    marketContext: 'Buy-side quantitative research offers the highest total compensation in financial markets. Base salaries often exceed £200k with performance bonuses frequently doubling or tripling base pay based on strategy Sharpe ratio.'
  },
  'quant-dev-cpp': {
    baseP10: 90000,
    baseP50: 180000,
    baseP90: 280000,
    basePct: 60,
    bonusPct: 40,
    demand: 'Extreme Scarcity (Sub-Microsecond Low Latency Architecture)',
    movement: '+7% to +12% annual compensation growth across top market-makers',
    certifications: ['BSc/MSc Computer Science', 'Expert Modern C++ (C++20/23)', 'Linux Kernel / FPGA'],
    overview: 'HFT C++ Core Developers build sub-microsecond algorithmic execution gateways, high-throughput market data parsers, and custom low-latency networking stacks for ultra-fast trading desks.',
    responsibilities: [
      'Engineering deterministic, lock-free, zero-allocation C++ trading systems and execution gateways.',
      'Optimizing market data feeds, exchange protocol parsers (FIX, ITCH, OUCH), and order book state engines.',
      'Profiling cache locality, memory layout, CPU instruction cycles, and kernel bypass (Solarflare OpenOnload).',
      'Implementing automated automated risk checks and circuit breakers at sub-microsecond latencies.',
      'Partnering closely with quantitative researchers to productionize mathematical trading models.'
    ],
    marketContext: 'London prop trading firms and hedge funds (e.g. Citadel, Jane Street, Optiver, XTX) benchmark C++ developers against top US tech and quantitative finance baselines.'
  },
  'ib-vp-ma': {
    baseP10: 135000,
    baseP50: 175000,
    baseP90: 220000,
    basePct: 60,
    bonusPct: 40,
    demand: 'High for Proven Sector Coverage & Deal Execution Leads',
    movement: '+5% to +10% base increases with substantial year-end deal bonus allocations',
    certifications: ['ACA', 'CFA Charterholder', 'Top-Tier MBA / Finance Degree'],
    overview: 'M&A Vice Presidents lead the day-to-day execution of buy-side and sell-side corporate finance transactions, directing financial modeling, managing deal teams, and interfacing directly with corporate boards and private equity clients.',
    responsibilities: [
      'Leading M&A deal execution from transaction kickoff through due diligence and legal completion.',
      'Supervising complex financial modeling, DCF valuations, leveraged buyout (LBO) models, and merger consequence analyses.',
      'Drafting confidential information memoranda (CIM), executive pitchbooks, and board presentations.',
      'Managing transaction workflows across legal counsel, tax advisors, accounting firms, and target executives.',
      'Mentoring and developing cohorts of investment banking analysts and associates.'
    ],
    marketContext: 'City of London corporate finance compensation combines strong base salaries with significant variable bonuses linked to closed deal volume and firm performance.'
  },
  'tech-ai-principal': {
    baseP10: 95000,
    baseP50: 140000,
    baseP90: 195000,
    basePct: 75,
    bonusPct: 25,
    demand: 'Extreme Scarcity (Enterprise AI & GPU Infrastructure Architects)',
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
    marketContext: 'Generative AI deployment is the single fastest-growing technical discipline in the UK, with venture-backed tech and tier-1 financial institutions competing aggressively for experienced systems architects.'
  },
  'legal-compliance-head': {
    baseP10: 90000,
    baseP50: 135000,
    baseP90: 195000,
    basePct: 85,
    bonusPct: 15,
    demand: 'High across Regulated Financial Institutions & FinTech',
    movement: '+4% to +7% base pay growth with executive bonus packages',
    certifications: ['Qualified Solicitor / Barrister', 'ICA Diploma in Governance, Risk & Compliance'],
    overview: 'Heads of Regulatory Compliance lead corporate compliance programs, regulatory relationships (FCA, PRA, Bank of England), anti-money laundering (AML) controls, and ethical conduct frameworks across financial institutions.',
    responsibilities: [
      'Establishing and maintaining comprehensive compliance frameworks across FCA/PRA regulated entities.',
      'Serving as the primary liaison with regulatory bodies and managing regulatory examinations.',
      'Directing financial crime prevention, sanctions screening, AML, and Market Abuse compliance.',
      'Advising executive boards and senior management on new regulatory developments and strategic impacts.',
      'Overseeing compliance monitoring, risk assessments, policy approvals, and staff training.'
    ],
    marketContext: 'Increasing regulatory complexity across the UK and European financial markets maintains strong executive demand for seasoned compliance heads with direct regulatory engagement track records.'
  },
  'grad-quant-analyst': {
    baseP10: 55000,
    baseP50: 75000,
    baseP90: 105000,
    basePct: 75,
    bonusPct: 25,
    demand: 'High Competition (Top 1% STEM Graduate Scheme Cohorts)',
    movement: '+8% to +15% rapid progression across early career trading rotations',
    certifications: ['1st Class / 2:1 Honours in Mathematics, Physics, Computing or Engineering'],
    overview: 'Graduate Quantitative Analysts enter quantitative hedge funds, prop trading firms, and investment banks to assist in mathematical research, algorithmic backtesting, data engineering, and automated trade execution.',
    responsibilities: [
      'Cleaning, analyzing, and transforming financial market tick data and macroeconomic time series.',
      'Implementing mathematical prototypes and statistical models in Python and modern C++.',
      'Conducting empirical backtests and performance evaluations on algorithmic trading strategies.',
      'Automating daily trading reports, PnL attribution, and factor risk decomposition.',
      'Participating in structured firm-wide quantitative trading and market microstructure training programs.'
    ],
    marketContext: 'Elite graduate schemes in London quantitative finance and market making offer starting packages significantly higher than broader corporate graduate schemes.'
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
    baseP10: 45000,
    baseP50: 65000,
    baseP90: 90000,
    basePct: 90,
    bonusPct: 10,
    demand: 'Steady UK Market Demand',
    movement: '+3% to +5% annual growth',
    certifications: ['Relevant Degree', 'Professional Accreditation'],
    overview: role.description,
    responsibilities: [
      'Delivering core professional domain responsibilities.',
      'Ensuring compliance with UK industry and statutory frameworks.',
      'Collaborating across executive and operational teams.'
    ],
    marketContext: 'Compensation is calibrated against active market placements and UK economic indicators.'
  };

  // Experience level table data
  const expTiers = [
    { label: '1–3 Years (Junior / Associate)', mult: 0.80, desc: 'Developing foundational expertise; execution focus' },
    { label: '3–6 Years (Mid-Level Specialist)', mult: 1.00, desc: 'Autonomous delivery; solid domain ownership' },
    { label: '6–10 Years (Senior / Lead)', mult: 1.25, desc: 'Technical mastery, team mentoring, complex project lead' },
    { label: '10+ Years (Director / Senior Head)', mult: 1.50, desc: 'Strategic governance, executive stakeholder management' }
  ];

  // Regional comparisons (at 3-6 yrs mid-tier)
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
              Verified 2026 Data
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            {role.title} Salary Guide & Benchmarks (UK 2026)
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            {role.description}
          </p>
        </div>

        {/* Quick Numbers Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Baseline London Compensation (Mid-Level 3–6 Years)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold uppercase text-slate-500 block">10th Percentile (Min)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                {formatCurrency(details.baseP10)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Entry / Developing</span>
            </div>

            <div className="p-5 bg-blue-50/60 border-2 border-blue-800 rounded-xl shadow-xs">
              <span className="text-xs font-bold uppercase text-blue-900 block">50th Percentile (Median)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1 block">
                {formatCurrency(details.baseP50)}
              </span>
              <span className="text-xs font-semibold text-blue-800 mt-1 block">Market Standard Benchmark</span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold uppercase text-slate-500 block">90th Percentile (Peak)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                {formatCurrency(details.baseP90)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Top Performer / Tier-1 Firm</span>
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
            Based on London market baselines. Excludes annual performance bonuses, pensions, and equity awards.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-3.5">Experience Tier</th>
                  <th className="p-3.5">10th % (Entry)</th>
                  <th className="p-3.5 bg-blue-100/60 text-blue-950">50th % (Median)</th>
                  <th className="p-3.5">90th % (Peak)</th>
                  <th className="p-3.5">Typical Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {expTiers.map((tier) => (
                  <tr key={tier.label} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{tier.label}</td>
                    <td className="p-3.5 text-slate-600">{formatCurrency(details.baseP10 * tier.mult)}</td>
                    <td className="p-3.5 font-bold text-blue-900 bg-blue-50/30">{formatCurrency(details.baseP50 * tier.mult)}</td>
                    <td className="p-3.5 text-slate-600">{formatCurrency(details.baseP90 * tier.mult)}</td>
                    <td className="p-3.5 text-xs text-slate-500">{tier.desc}</td>
                  </tr>
                ))}
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
                <span className="text-lg font-bold text-slate-900 block">{formatCurrency(details.baseP50 * reg.mult)}</span>
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
