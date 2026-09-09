/**
 * Pure calculation model for the Liberty Towers Hiring Cost Calculator.
 * 100% deterministic, framework-independent, UK-formatted.
 */

export const DAYS_PER_YEAR = 365;
export const DELAY_DAYS = [30, 60, 90] as const;

export interface HiringCostInputs {
  annualSalary: number;
  vacantWeeks: number;
  productivityLoss: number;
  managementHours: number;
  managementHourlyCost: number;
  advertisingSpend: number;
  recruitmentFees: number;
}

export const DEFAULT_INPUTS: HiringCostInputs = {
  annualSalary: 60000,
  vacantWeeks: 8,
  productivityLoss: 30,
  managementHours: 20,
  managementHourlyCost: 50,
  advertisingSpend: 0,
  recruitmentFees: 0,
};

export interface SeniorityPreset {
  id: string;
  name: string;
  description: string;
  inputs: HiringCostInputs;
}

export const SENIORITY_PRESETS: SeniorityPreset[] = [
  {
    id: 'mid',
    name: 'Mid-Level Professional',
    description: 'e.g. Underwriter, Audit Senior, Developer (£55k)',
    inputs: {
      annualSalary: 55000,
      vacantWeeks: 6,
      productivityLoss: 25,
      managementHours: 15,
      managementHourlyCost: 45,
      advertisingSpend: 500,
      recruitmentFees: 0,
    },
  },
  {
    id: 'senior',
    name: 'Senior Specialist / Manager',
    description: 'e.g. Senior Underwriter, Quant Researcher (£95k)',
    inputs: {
      annualSalary: 95000,
      vacantWeeks: 8,
      productivityLoss: 35,
      managementHours: 25,
      managementHourlyCost: 65,
      advertisingSpend: 1000,
      recruitmentFees: 0,
    },
  },
  {
    id: 'executive',
    name: 'Director / Executive',
    description: 'e.g. Head of Compliance, Partner, C-Suite (£160k)',
    inputs: {
      annualSalary: 160000,
      vacantWeeks: 12,
      productivityLoss: 45,
      managementHours: 40,
      managementHourlyCost: 100,
      advertisingSpend: 2500,
      recruitmentFees: 0,
    },
  },
];

export interface FieldRule {
  label: string;
  min: number;
  max: number;
  money?: boolean;
  required?: boolean;
}

export const FIELD_RULES: Record<keyof HiringCostInputs, FieldRule> = {
  annualSalary: { label: 'Annual salary', min: 0.01, max: 10000000, money: true, required: true },
  vacantWeeks: { label: 'Weeks vacant', min: 0, max: 520, required: true },
  productivityLoss: { label: 'Productivity loss', min: 0, max: 100, required: true },
  managementHours: { label: 'Management and interview hours', min: 0, max: 100000 },
  managementHourlyCost: { label: 'Hourly management cost', min: 0, max: 100000, money: true },
  advertisingSpend: { label: 'Advertising spend', min: 0, max: 10000000, money: true },
  recruitmentFees: { label: 'Recruitment or agency fees', min: 0, max: 10000000, money: true },
};

const numberPattern = /^(?:(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?|\.\d{1,2})$/;

export interface ParseResult {
  ok: boolean;
  values: HiringCostInputs;
  errors: Partial<Record<keyof HiringCostInputs, string>>;
}

export function parseInputs(raw: Record<string, string | number>): ParseResult {
  const values: Partial<HiringCostInputs> = {};
  const errors: Partial<Record<keyof HiringCostInputs, string>> = {};

  for (const [keyStr, rule] of Object.entries(FIELD_RULES)) {
    const key = keyStr as keyof HiringCostInputs;
    const rawVal = raw?.[key];
    const original = String(rawVal ?? '').trim();
    let value = original;
    if (rule.money) value = value.replace(/^£\s*/, '');

    if (value === '') {
      if (rule.required || original !== '') {
        errors[key] = `Enter ${rule.label.toLowerCase()}.`;
      }
      values[key] = 0;
      continue;
    }

    if (!numberPattern.test(value)) {
      errors[key] = 'Use a positive number or zero, with up to two decimal places (e.g. 1,250.50).';
      continue;
    }

    const numericValue = Number(value.replaceAll(',', ''));
    if (!Number.isFinite(numericValue) || numericValue < rule.min || numericValue > rule.max) {
      errors[key] = `Enter a value from ${rule.min.toLocaleString('en-GB')} to ${rule.max.toLocaleString('en-GB')}.`;
      continue;
    }

    values[key] = numericValue;
  }

  if ((values.managementHours ?? 0) > 0 && String(raw?.managementHourlyCost ?? '').trim().replace(/^£\s*/, '') === '') {
    errors.managementHourlyCost = 'Enter an hourly cost for management time, or 0 if there is no cost.';
  }

  const ok = Object.keys(errors).length === 0;
  return {
    ok,
    values: values as HiringCostInputs,
    errors,
  };
}

export interface DelayScenario {
  days: number;
  additionalCost: number;
  totalCost: number;
}

export interface CalculationResult {
  vacantDays: number;
  dailyProductivityCost: number;
  productivityCost: number;
  managementCost: number;
  advertisingSpend: number;
  recruitmentFees: number;
  recruitmentSpend: number;
  totalCost: number;
  delays: DelayScenario[];
}

export function calculateVacancyCosts(inputs: HiringCostInputs): CalculationResult {
  for (const [keyStr, rule] of Object.entries(FIELD_RULES)) {
    const key = keyStr as keyof HiringCostInputs;
    const value = inputs?.[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < rule.min || value > rule.max) {
      throw new RangeError(`Invalid ${key}: expected a finite number from ${rule.min} to ${rule.max}.`);
    }
  }

  const vacantDays = inputs.vacantWeeks * 7;
  const dailyProductivityCost = (inputs.annualSalary / DAYS_PER_YEAR) * (inputs.productivityLoss / 100);
  const productivityCost = dailyProductivityCost * vacantDays;
  const managementCost = inputs.managementHours * inputs.managementHourlyCost;
  const recruitmentSpend = inputs.advertisingSpend + inputs.recruitmentFees;
  const totalCost = productivityCost + managementCost + recruitmentSpend;

  return {
    vacantDays,
    dailyProductivityCost,
    productivityCost,
    managementCost,
    advertisingSpend: inputs.advertisingSpend,
    recruitmentFees: inputs.recruitmentFees,
    recruitmentSpend,
    totalCost,
    delays: DELAY_DAYS.map((days) => ({
      days,
      additionalCost: dailyProductivityCost * days,
      totalCost: totalCost + dailyProductivityCost * days,
    })),
  };
}
