
// Financial calculation utilities for solar energy investment analysis

export interface SystemData {
  power: number; // Potência CC (kWp)
  annualGeneration: number; // Geração Anual (MWh) - P90
  contractedDemand: number; // Demanda Contratada (kW)
}

export interface CostData {
  capexPerWp: number; // Capex (R$/Wp)
  capexTotal?: number; // Alternative: direct Capex value
  insurancePercent: number; // % Seguros
  omPercent: number; // % O&M (Operation & Maintenance)
  admPercent: number; // % ADM
  rent: number; // Aluguel (R$/mês) - Ano 1
  inverterReplacePercent: number; // % Troca de Inversores (Ano 10)
}

export interface TariffData {
  energyTariff: number; // TE (R$/MWh)
  tusd: number; // TUSD (R$/MWh)
  tusdgDemand: number; // TUSDg (R$/kW)
  tusdcDemand: number; // TUSDc (R$/kW)
  icmsPercent: number; // % ICMS
  pisCofinsPercent: number; // % PIS/COFINS
}

export interface FinancialData {
  discountRate: number; // Taxa de desconto (%)
  adjustmentType: "IPCA" | "ENERGY"; // Reajuste (IPCA ou Energético)
  adjustmentRate: number; // Rate for the chosen adjustment type
  annualDegradation: number; // % Degradação anual
  depreciationYears: number; // Anos de depreciação
  projectYears: number; // Project lifetime (typically 20-25 years)
}

export interface YearlyResult {
  year: number;
  generation: number; // MWh
  revenue: number; // R$
  omCost: number; // R$
  insuranceCost: number; // R$
  admCost: number; // R$
  rentCost: number; // R$
  inverterCost: number; // R$
  taxesIcms: number; // R$
  taxesPisCofins: number; // R$
  depreciation: number; // R$
  taxBenefit: number; // R$
  netCashFlow: number; // R$
  cumulativeCashFlow: number; // R$
  discountedCashFlow: number; // R$
  cumulativeDiscountedCashFlow: number; // R$
}

export interface CalculationResults {
  years: YearlyResult[];
  npv: number; // VPL - Valor Presente Líquido
  irr: number; // TIR - Taxa Interna de Retorno
  paybackYear: number; // Simple payback year
  discountedPaybackYear: number; // Discounted payback year
  initialInvestment: number;
  totalRevenue: number;
  totalOperationalCosts: number;
  totalTaxes: number;
}

// Calculate degraded generation for a specific year
const calculateDegradedGeneration = (
  baseGeneration: number,
  degradationRate: number,
  year: number
): number => {
  return baseGeneration * Math.pow(1 - degradationRate / 100, year);
};

// Calculate annual revenue
const calculateRevenue = (
  generation: number,
  energyTariff: number,
  tusd: number,
  contractedDemand: number,
  tusdgDemand: number,
  tusdcDemand: number
): number => {
  const energyRevenue = generation * (energyTariff + tusd);
  const demandRevenue = contractedDemand * (tusdgDemand + tusdcDemand) * 12; // Annual demand revenue
  return energyRevenue + demandRevenue;
};

// Calculate operation and maintenance costs
const calculateOMCost = (capex: number, omPercent: number): number => {
  return capex * (omPercent / 100);
};

// Calculate insurance costs
const calculateInsuranceCost = (capex: number, insurancePercent: number): number => {
  return capex * (insurancePercent / 100);
};

// Calculate administrative costs
const calculateAdmCost = (revenue: number, admPercent: number): number => {
  return revenue * (admPercent / 100);
};

// Calculate adjusted rent for a specific year
const calculateRent = (baseRent: number, adjustmentRate: number, year: number): number => {
  return baseRent * 12 * Math.pow(1 + adjustmentRate / 100, year); // Annual rent with adjustment
};

// Calculate inverter replacement cost (typically in year 10)
const calculateInverterCost = (capex: number, inverterReplacePercent: number, year: number): number => {
  return year === 10 ? capex * (inverterReplacePercent / 100) : 0;
};

// Calculate taxes (ICMS, PIS/COFINS)
const calculateTaxes = (
  revenue: number,
  icmsPercent: number,
  pisCofinsPercent: number
): { icms: number; pisCofins: number } => {
  return {
    icms: revenue * (icmsPercent / 100),
    pisCofins: revenue * (pisCofinsPercent / 100),
  };
};

// Calculate depreciation benefit
const calculateDepreciationBenefit = (
  capex: number,
  depreciationYears: number,
  year: number
): number => {
  const depreciationRate = 34; // Corporate tax rate in Brazil (approximately)
  if (year <= depreciationYears) {
    const yearlyDepreciation = capex / depreciationYears;
    return yearlyDepreciation * (depreciationRate / 100);
  }
  return 0;
};

// Calculate NPV (Net Present Value)
const calculateNPV = (cashFlows: number[], discountRate: number, initialInvestment: number): number => {
  let npv = -initialInvestment;
  
  for (let year = 0; year < cashFlows.length; year++) {
    npv += cashFlows[year] / Math.pow(1 + discountRate / 100, year + 1);
  }
  
  return npv;
};

// Calculate IRR (Internal Rate of Return)
const calculateIRR = (cashFlows: number[], initialInvestment: number): number => {
  // Simple approximation of IRR using iteration
  const maxIterations = 1000;
  const tolerance = 0.000001;
  
  let guess = 0.1; // 10% initial guess
  let step = 0.1;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = -initialInvestment;
    for (let year = 0; year < cashFlows.length; year++) {
      npv += cashFlows[year] / Math.pow(1 + guess, year + 1);
    }
    
    if (Math.abs(npv) < tolerance) {
      return guess * 100; // Convert to percentage
    }
    
    // Adjust guess using binary search approach
    if (npv > 0) {
      guess += step;
    } else {
      guess -= step;
      step /= 2;
    }
  }
  
  return guess * 100; // Return best approximation after max iterations
};

// Find payback year (year when cumulative cash flow becomes positive)
const findPaybackYear = (cumulativeCashFlows: number[]): number => {
  for (let i = 0; i < cumulativeCashFlows.length; i++) {
    if (cumulativeCashFlows[i] >= 0) {
      return i + 1;
    }
  }
  return -1; // No payback within the analysis period
};

// Perform the complete financial calculation
export const performFinancialCalculation = (
  systemData: SystemData,
  costData: CostData,
  tariffData: TariffData,
  financialData: FinancialData
): CalculationResults => {
  // Calculate initial investment
  const initialInvestment = costData.capexTotal || 
    (costData.capexPerWp * systemData.power * 1000); // Convert kWp to Wp

  const years: YearlyResult[] = [];
  let cumulativeCashFlow = -initialInvestment;
  let cumulativeDiscountedCashFlow = -initialInvestment;
  const cashFlows: number[] = [];

  let totalRevenue = 0;
  let totalOperationalCosts = 0;
  let totalTaxes = 0;

  // Calculate yearly results
  for (let year = 1; year <= financialData.projectYears; year++) {
    const generation = calculateDegradedGeneration(
      systemData.annualGeneration,
      financialData.annualDegradation,
      year
    );
    
    const revenue = calculateRevenue(
      generation,
      tariffData.energyTariff,
      tariffData.tusd,
      systemData.contractedDemand,
      tariffData.tusdgDemand,
      tariffData.tusdcDemand
    );
    
    const omCost = calculateOMCost(initialInvestment, costData.omPercent);
    const insuranceCost = calculateInsuranceCost(initialInvestment, costData.insurancePercent);
    const admCost = calculateAdmCost(revenue, costData.admPercent);
    const rentCost = calculateRent(costData.rent, financialData.adjustmentRate, year);
    const inverterCost = calculateInverterCost(initialInvestment, costData.inverterReplacePercent, year);
    
    const taxes = calculateTaxes(
      revenue,
      tariffData.icmsPercent,
      tariffData.pisCofinsPercent
    );
    
    const depreciation = initialInvestment / financialData.depreciationYears;
    const taxBenefit = calculateDepreciationBenefit(
      initialInvestment,
      financialData.depreciationYears,
      year
    );
    
    const netCashFlow = revenue - omCost - insuranceCost - admCost - rentCost - 
      inverterCost - taxes.icms - taxes.pisCofins + taxBenefit;
    
    cumulativeCashFlow += netCashFlow;
    
    const discountedCashFlow = netCashFlow / Math.pow(1 + financialData.discountRate / 100, year);
    cumulativeDiscountedCashFlow += discountedCashFlow;
    
    cashFlows.push(netCashFlow);
    
    totalRevenue += revenue;
    totalOperationalCosts += (omCost + insuranceCost + admCost + rentCost + inverterCost);
    totalTaxes += (taxes.icms + taxes.pisCofins);
    
    years.push({
      year,
      generation,
      revenue,
      omCost,
      insuranceCost,
      admCost,
      rentCost,
      inverterCost,
      taxesIcms: taxes.icms,
      taxesPisCofins: taxes.pisCofins,
      depreciation,
      taxBenefit,
      netCashFlow,
      cumulativeCashFlow,
      discountedCashFlow,
      cumulativeDiscountedCashFlow,
    });
  }

  const npv = calculateNPV(cashFlows, financialData.discountRate, initialInvestment);
  const irr = calculateIRR(cashFlows, initialInvestment);
  
  const paybackYear = findPaybackYear(years.map(y => y.cumulativeCashFlow));
  const discountedPaybackYear = findPaybackYear(years.map(y => y.cumulativeDiscountedCashFlow));

  return {
    years,
    npv,
    irr,
    paybackYear,
    discountedPaybackYear,
    initialInvestment,
    totalRevenue,
    totalOperationalCosts,
    totalTaxes,
  };
};
