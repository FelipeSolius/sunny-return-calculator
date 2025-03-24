
import { CalculationResults, YearlyResult } from './calculationUtils';

// Function to format currency values
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Function to format percentage values
const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Function to format decimal numbers
const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

// Generate Excel-compatible CSV content
export const generateCSV = (results: CalculationResults): string => {
  const headers = [
    'Ano',
    'Geração (MWh)',
    'Receita (R$)',
    'Custos O&M (R$)',
    'Seguros (R$)',
    'Custos ADM (R$)',
    'Aluguel (R$)',
    'Custos Inversores (R$)',
    'ICMS (R$)',
    'PIS/COFINS (R$)',
    'Depreciação (R$)',
    'Benefício Fiscal (R$)',
    'Fluxo de Caixa (R$)',
    'Fluxo Acumulado (R$)',
    'Fluxo Descontado (R$)',
    'Fluxo Descontado Acumulado (R$)'
  ].join(';');

  const rows = results.years.map((year: YearlyResult) => {
    return [
      year.year,
      formatNumber(year.generation),
      formatNumber(year.revenue),
      formatNumber(year.omCost),
      formatNumber(year.insuranceCost),
      formatNumber(year.admCost),
      formatNumber(year.rentCost),
      formatNumber(year.inverterCost),
      formatNumber(year.taxesIcms),
      formatNumber(year.taxesPisCofins),
      formatNumber(year.depreciation),
      formatNumber(year.taxBenefit),
      formatNumber(year.netCashFlow),
      formatNumber(year.cumulativeCashFlow),
      formatNumber(year.discountedCashFlow),
      formatNumber(year.cumulativeDiscountedCashFlow)
    ].join(';');
  });

  // Add summary information
  const summary = [
    '',
    'Resumo do Projeto',
    `Investimento Inicial;${formatCurrency(results.initialInvestment)}`,
    `VPL;${formatCurrency(results.npv)}`,
    `TIR;${formatPercentage(results.irr)}`,
    `Payback Simples;${results.paybackYear} anos`,
    `Payback Descontado;${results.discountedPaybackYear} anos`,
    `Receita Total;${formatCurrency(results.totalRevenue)}`,
    `Custos Operacionais Totais;${formatCurrency(results.totalOperationalCosts)}`,
    `Impostos Totais;${formatCurrency(results.totalTaxes)}`
  ];

  return [...summary, '', headers, ...rows].join('\n');
};

// Function to download CSV file
export const downloadCSV = (results: CalculationResults, filename: string = 'analise-financeira.csv'): void => {
  const csvContent = generateCSV(results);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Generate PDF-compatible table structure
export const generatePDFData = (results: CalculationResults) => {
  return {
    title: 'Análise Financeira - Geração Distribuída',
    summary: {
      initialInvestment: formatCurrency(results.initialInvestment),
      npv: formatCurrency(results.npv),
      irr: formatPercentage(results.irr),
      payback: `${results.paybackYear} anos`,
      discountedPayback: `${results.discountedPaybackYear} anos`
    },
    cashFlow: results.years.map(year => ({
      year: year.year,
      generation: formatNumber(year.generation),
      revenue: formatCurrency(year.revenue),
      costs: formatCurrency(year.omCost + year.insuranceCost + year.admCost + year.rentCost),
      taxes: formatCurrency(year.taxesIcms + year.taxesPisCofins),
      netCashFlow: formatCurrency(year.netCashFlow),
      cumulativeCashFlow: formatCurrency(year.cumulativeCashFlow)
    }))
  };
};
