import fs from 'fs';
import path from 'path';

const salariesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/salaries.json'), 'utf8'));
const predefinedRoles = salariesData.roles;

// Location parser from SalaryDashboard.tsx
function parseLocation(locationNatural: string, roleInput: string) {
  const locLower = (locationNatural || '').trim().toLowerCase();
  
  let derivedStyle = '';
  if (/\b(remote|wfh|home|telecommute|distributed)\b/.test(locLower)) {
    derivedStyle = 'remote';
  } else if (/\b(office|onsite|in-office|site-based|desk)\b/.test(locLower)) {
    derivedStyle = 'office';
  } else {
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
      warning: null
    };
  }

  const isUS = /\b(us|usa|united states|new york|wall street|silicon valley|san francisco|california|boston|chicago)\b/.test(locLower);
  const isExplicitEU = /\b(spain|spanish|malta|gibraltar|poland|portugal|germany|france|italy|europe|eu|offshore|overseas|amsterdam|dublin|ireland)\b/.test(locLower);
  const isUKExplicit = /\b(uk|united kingdom|britain|british|england|london|manchester|leeds|birmingham|scotland|edinburgh|glasgow|bristol|cardiff|belfast|newcastle|sheffield|liverpool|nottingham|leicester|surrey|kent|essex|reading|oxford|cambridge)\b/.test(locLower);

  if (isExplicitEU && !isUS && !isUKExplicit) {
    return { regionKey: 'eu_remote', regionName: 'European & Overseas Remote', multiplier: 0.72, derivedStyle, isOverseasEU: true, isUnrecognised: false, warning: null };
  } else if (isUS) {
    return { regionKey: 'us_remote', regionName: 'US & Global Remote', multiplier: 1.30, derivedStyle, isOverseasEU: false, isUnrecognised: false, warning: null };
  } else if (/\b(scotland|edinburgh|glasgow|aberdeen|dundee)\b/.test(locLower)) {
    return { regionKey: 'scotland', regionName: 'Scotland & Regional Centers', multiplier: 0.82, derivedStyle, isOverseasEU: false, isUnrecognised: false, warning: null };
  } else if (/\b(birmingham|midlands|nottingham|leicester|coventry|derby|stoke|wolverhampton|northampton)\b/.test(locLower)) {
    return { regionKey: 'midlands', regionName: 'Midlands (Birmingham, Nottingham, Northampton)', multiplier: 0.82, derivedStyle, isOverseasEU: false, isUnrecognised: false, warning: null };
  } else if (/\b(manchester|leeds|liverpool|sheffield|newcastle|hull|bradford|sunderland|north|yorkshire)\b/.test(locLower)) {
    return { regionKey: 'north', regionName: 'North UK (Manchester, Leeds, Liverpool)', multiplier: 0.80, derivedStyle, isOverseasEU: false, isUnrecognised: false, warning: null };
  } else if (/\b(bristol|bath|swindon|gloucester|plymouth|exeter|south west|cardiff|swansea|wales)\b/.test(locLower)) {
    return { regionKey: 'southwest', regionName: 'South West & Wales', multiplier: 0.82, derivedStyle, isOverseasEU: false, isUnrecognised: false, warning: null };
  } else if (/\b(belfast|derry|northern ireland|ulster)\b/.test(locLower)) {
    return { regionKey: 'ni', regionName: 'Northern Ireland (Belfast)', multiplier: 0.80, derivedStyle, isOverseasEU: false, isUnrecognised: false, warning: null };
  } else if (/\b(surrey|kent|essex|reading|oxford|cambridge|berkshire|hampshire|sussex|south east|brighton|milton keynes|south)\b/.test(locLower)) {
    return { regionKey: 'southeast', regionName: 'South East England (Reading, Oxford, Guildford)', multiplier: 0.88, derivedStyle, isOverseasEU: false, isUnrecognised: false, warning: null };
  } else if (/\b(remote|telecommute|wfh|home|virtual|distributed)\b/.test(locLower) && !isExplicitEU) {
    return { regionKey: 'uk_remote', regionName: 'UK National Remote', multiplier: 0.92, derivedStyle: 'remote', isOverseasEU: false, isUnrecognised: false, warning: null };
  } else if (/\b(london|mayfair|canary wharf|city|square mile|west end|soho|ec1|ec2|ec3|ec4|wc1|wc2|w1|sw1|shoreditch|camden|islington|stratford|croydon|richmond)\b/.test(locLower) || locLower.includes("lloyd's")) {
    return { regionKey: 'london', regionName: locLower.includes("lloyd's") ? "London (Lloyd's Market)" : "Greater London & City", multiplier: 1.0, derivedStyle, isOverseasEU: false, isUnrecognised: false, warning: null };
  }

  return { regionKey: 'uk_national', regionName: 'UK National Average (Unspecified Region)', multiplier: 0.82, derivedStyle, isOverseasEU: false, isUnrecognised: true, warning: 'Unrecognised' };
}

// We load SalaryDashboard.tsx parser via eval or extraction
const dashCode = fs.readFileSync(path.join(__dirname, '../src/app/components/SalaryDashboard.tsx'), 'utf8');

// Test runner function
async function evaluateDashboard(roleInput: string, expYears: string, locationNatural: string) {
  const parsedLocation = parseLocation(locationNatural, roleInput);

  let rawTitle = roleInput.trim();
  rawTitle = rawTitle.replace(/\(.*?\)/g, (match) => {
    if (match.toLowerCase().includes('unless') || match.toLowerCase().includes('box') || match.toLowerCase().includes('tell me') || match.toLowerCase().includes('natural')) return '';
    return match;
  });
  rawTitle = rawTitle.replace(/unless otherwise stated.*$/gi, '');
  rawTitle = rawTitle.replace(/tell me what role.*$/gi, '');

  const inlineExpMatch = rawTitle.match(/\b(\d+)\s*[-–]\s*(\d+)\s*(years?|yrs?|y|pqe)\b/i) || rawTitle.match(/\b(\d+)\s*\+?\s*(years?|yrs?|y|pqe)\b/i);
  let effectiveExp = expYears;
  if (inlineExpMatch) {
    const startYears = parseInt(inlineExpMatch[1], 10);
    if (startYears <= 2) effectiveExp = '1-3';
    else if (startYears <= 5) effectiveExp = '3-6';
    else if (startYears <= 9) effectiveExp = '6-10';
    else effectiveExp = '10+';
  }

  const cleanedTitleForMatching = rawTitle.replace(/\b\d+\s*[-–]\s*\d+\s*(years?|yrs?|y|pqe)\b/gi, '').replace(/\b\d+\s*\+?\s*(years?|yrs?|y|pqe)\b/gi, '').trim();
  const titleClean = cleanedTitleForMatching || rawTitle.trim() || 'Internal Auditor';
  const inputLower = titleClean.toLowerCase();

  const isGraduateInput = /\b(graduate|grad|trainee|intern|internship|junior graduate|entry level)\b/i.test(inputLower);

  const predefined = predefinedRoles.find((r: any) => {
    const titleLower = r.title.toLowerCase();
    const normInput = inputLower.replace(/\b(solutions)\b/g, 'solution');
    const normTitle = titleLower.replace(/\b(solutions)\b/g, 'solution');

    if (r.id === 'ins-account-handler-manager') {
      const isInsuranceContext = /\b(insurance|broker|broking|commercial|lloyd'?s)\b/i.test(inputLower);
      const isAccountRole = /\b(account handler|account manager|account exec|account executive|broker support|broking handler)\b/i.test(inputLower);
      if (isInsuranceContext && isAccountRole) return true;
      if (inputLower === 'account handler' || inputLower === 'insurance account handler' || inputLower === 'insurance account manager' || inputLower === 'account manager, insurance' || inputLower === 'commercial account manager') return true;
    }

    const match = titleLower === inputLower || 
                  normTitle === normInput ||
                  titleLower.includes(inputLower) || 
                  inputLower.includes(titleLower) ||
                  normTitle.includes(normInput) ||
                  normInput.includes(normTitle);
    if (!match) return false;
    
    const isPredefinedGrad = /\b(graduate|grad|trainee|intern|entry level)\b/i.test(titleLower) || r.category === "Graduate Entry";
    if (isGraduateInput && !isPredefinedGrad) return false;
    
    return true;
  });

  let activeRoleData: any = null;

  if (predefined) {
    activeRoleData = { ...predefined };
  } else {
    // Run heuristic logic
    const isDirectorLevel = /\b(director|cmo|cfo|cro|coo|ceo|vp|head of|chief|partner|managing director|md)\b/i.test(inputLower);
    
    let sector = "General Commercial & Operations";
    let baseP10 = 26000;
    let baseP50 = 38000;
    let baseP90 = 55000;
    let basePct = 90;
    let bonusPct = 10;
    let description = "Provides operational delivery, professional administration, and stakeholder coordination.";
    let demand = "Moderate Candidate Availability";
    let yoy = "+2% to +4%";
    let hiringInsight = "Candidate availability is liquid. Pre-screening focuses on proven industry track record and role-specific systems.";
    let maxExpMultiplier = 1.30;

    // Evaluate heuristics from dashCode
    // Let us extract the heuristic chain from SalaryDashboard.tsx
    const startIdx = dashCode.indexOf("const isSoftwareRole =");
    const endIdx = dashCode.indexOf("const regMult = parsedLocation.multiplier;", startIdx);
    const chainCode = dashCode.substring(startIdx, endIdx);

    // Run in local scope
    const evalFn = new Function(
      "inputLower", "isDirectorLevel", "sector", "baseP10", "baseP50", "baseP90", "basePct", "bonusPct", "description", "demand", "yoy", "hiringInsight", "maxExpMultiplier", "isGraduateInput",
      `${chainCode}; return { sector, baseP10, baseP50, baseP90, basePct, bonusPct, description, demand, yoy, hiringInsight, maxExpMultiplier };`
    );

    const hRes = evalFn(inputLower, isDirectorLevel, sector, baseP10, baseP50, baseP90, basePct, bonusPct, description, demand, yoy, hiringInsight, maxExpMultiplier, isGraduateInput);

    activeRoleData = {
      id: `custom-${inputLower.replace(/[^a-z0-9]/g, '-')}`,
      title: titleClean.replace(/\b\w/g, l => l.toUpperCase()),
      sector: hRes.sector,
      category: "Market Benchmark",
      description: hRes.description,
      baseP10: hRes.baseP10,
      baseP50: hRes.baseP50,
      baseP90: hRes.baseP90,
      tiers: null
    };
  }

  const expMetadata: Record<string, { label: string; defaultMultiplier: number }> = {
    '1-3': { label: '1–3 Years', defaultMultiplier: 0.75 },
    '3-6': { label: '3–6 Years', defaultMultiplier: 1.00 },
    '6-10': { label: '6–10 Years', defaultMultiplier: 1.25 },
    '10+': { label: '10+ Years', defaultMultiplier: 1.50 }
  };

  const regMult = parsedLocation.multiplier;
  let baseP10Val = 30000;
  let baseP50Val = 40000;
  let baseP90Val = 55000;

  if (activeRoleData.tiers && activeRoleData.tiers[effectiveExp]) {
    const tier = activeRoleData.tiers[effectiveExp];
    baseP10Val = tier.p10;
    baseP50Val = tier.p50;
    baseP90Val = tier.p90;
  } else {
    const expFactor = expMetadata[effectiveExp]?.defaultMultiplier || 1.0;
    baseP10Val = (activeRoleData.baseP10 || 35000) * expFactor;
    baseP50Val = (activeRoleData.baseP50 || 48000) * expFactor;
    baseP90Val = (activeRoleData.baseP90 || 68000) * expFactor;
  }

  const rawP10 = baseP10Val * regMult;
  const rawP50 = baseP50Val * regMult;
  const rawP90 = baseP90Val * regMult;

  const nmwFloor = parsedLocation.isOverseasEU ? 18000 : (parsedLocation.regionKey === 'london' ? 28000 : 25000);
  const p10 = Math.max(nmwFloor, Math.round(rawP10 / 500) * 500);
  const p50 = Math.max(p10 + 2000, Math.round(rawP50 / 500) * 500);
  const p90 = Math.max(p50 + 4000, Math.round(rawP90 / 500) * 500);

  return {
    title: activeRoleData.title,
    sector: activeRoleData.sector,
    effectiveExp,
    region: parsedLocation.regionName,
    p10,
    p50,
    p90
  };
}

// Run test cases
const testSuite = [
  { role: "Data Warehouse Engineer", exp: "3-6", loc: "London", expectedSector: "Tech", minP50: 60000, maxP50: 95000 },
  { role: "Software Engineer", exp: "3-6", loc: "London", expectedSector: "Tech", minP50: 60000, maxP50: 85000 },
  { role: "Solutions Architect", exp: "6-10", loc: "London", expectedSector: "Tech", minP50: 110000, maxP50: 145000 },
  { role: "Software Engineer, Civil Infrastructure", exp: "3-6", loc: "London", expectedSector: "Tech", minP50: 60000, maxP50: 90000 },
  { role: "Civil Engineer", exp: "3-6", loc: "Bristol", expectedSector: "Engineering", minP50: 38000, maxP50: 55000 },
  { role: "Senior Civil Engineer", exp: "6-10", loc: "London", expectedSector: "Engineering", minP50: 60000, maxP50: 85000 },
  { role: "Structural Engineer", exp: "3-6", loc: "Leeds", expectedSector: "Engineering", minP50: 35000, maxP50: 52000 },
  { role: "Site Engineer", exp: "3-6", loc: "Birmingham", expectedSector: "Engineering", minP50: 35000, maxP50: 55000 },
  { role: "Insurance Account Manager", exp: "1-3", loc: "London", expectedSector: "Insurance & Commercial Broking", minP50: 28000, maxP50: 35000 },
  { role: "Insurance Account Handler", exp: "1-3", loc: "London", expectedSector: "Insurance & Commercial Broking", minP50: 28000, maxP50: 35000 },
  { role: "Specialty Underwriter", exp: "6-10", loc: "London", expectedSector: "Insurance", minP50: 110000, maxP50: 150000 },
  { role: "Broking Team Leader", exp: "6-10", loc: "London", expectedSector: "Insurance & Commercial Broking", minP50: 60000, maxP50: 85000 },
  { role: "Internal Communications Manager", exp: "3-6", loc: "London", expectedSector: "Marketing", minP50: 65000, maxP50: 80000 },
  { role: "Digital Marketing Executive", exp: "1-3", loc: "Leeds", expectedSector: "Marketing", minP50: 24000, maxP50: 34000 },
  { role: "Internal Auditor", exp: "3-6", loc: "London", expectedSector: "Audit", minP50: 55000, maxP50: 85000 },
  { role: "Management Accountant", exp: "3-6", loc: "London", expectedSector: "Finance", minP50: 55000, maxP50: 75000 },
  { role: "Commercial Solicitor", exp: "3-6", loc: "London", expectedSector: "Legal", minP50: 70000, maxP50: 95000 },
  { role: "Staff Nurse", exp: "1-3", loc: "Manchester", expectedSector: "Healthcare", minP50: 28000, maxP50: 38000 },
  { role: "Primary School Teacher", exp: "3-6", loc: "London", expectedSector: "Education", minP50: 38000, maxP50: 52000 },
  { role: "Dental Nurse", exp: "3-6", loc: "London", expectedSector: "Healthcare", minP50: 26000, maxP50: 38000 },
  { role: "Veterinary Nurse", exp: "3-6", loc: "Bristol", expectedSector: "Veterinary", minP50: 24000, maxP50: 36000 },
  { role: "Nursery Nurse", exp: "3-6", loc: "Manchester", expectedSector: "Education", minP50: 22000, maxP50: 32000 },
  { role: "Warehouse Operations Manager", exp: "6-10", loc: "Northampton", expectedSector: "Logistics", minP50: 42000, maxP50: 62000 },
  { role: "Warehouse Operative", exp: "1-3", loc: "Birmingham", expectedSector: "Logistics", minP50: 22000, maxP50: 28000 },
  { role: "Head Chef", exp: "6-10", loc: "Edinburgh", expectedSector: "Hospitality", minP50: 38000, maxP50: 52000 },
  { role: "Electrician", exp: "3-6", loc: "Birmingham", expectedSector: "Trades", minP50: 34000, maxP50: 46000 },
  { role: "Customer Service Representative", exp: "1-3", loc: "Newcastle", expectedSector: "Customer", minP50: 22000, maxP50: 28000 },
  { role: "Estate Agent", exp: "3-6", loc: "London", expectedSector: "Property", minP50: 30000, maxP50: 48000 }
];

async function main() {
  console.log("=== SALARY BENCHMARK AUDIT REPORT ===");
  let passed = 0;
  let failed = 0;

  for (const t of testSuite) {
    const res = await evaluateDashboard(t.role, t.exp, t.loc);
    const sectorMatch = res.sector.toLowerCase().includes(t.expectedSector.toLowerCase());
    const salaryOk = res.p50 >= t.minP50 && res.p50 <= t.maxP50;

    const ok = sectorMatch && salaryOk;
    if (ok) {
      passed++;
      console.log(`✅ [PASS] ${t.role.padEnd(38)} | ${res.sector.padEnd(36)} | P50: £${res.p50.toLocaleString()}`);
    } else {
      failed++;
      console.log(`❌ [FAIL] ${t.role.padEnd(38)} | Sector: ${res.sector} (expected: ${t.expectedSector}) | P50: £${res.p50.toLocaleString()} (expected: £${t.minP50}-£${t.maxP50})`);
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testSuite.length} tests.`);
}

main();
