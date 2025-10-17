// This file can contain financial calculation helper functions if needed.
// For example, a function to calculate mortgage payments.

export function calculateMonthlyMortgage(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) {
    return 0;
  }
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = years * 12;
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
  const monthlyPayment = principal * (numerator / denominator);
  return monthlyPayment;
}
