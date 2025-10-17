/**
 * Calculates the monthly mortgage payment.
 * @param principal The total loan amount.
 * @param annualInterestRate The annual interest rate (e.g., 5.5 for 5.5%).
 * @param loanTermInYears The length of the loan in years.
 * @returns The monthly mortgage payment amount.
 */
export function calculateMonthlyMortgage(principal: number, annualInterestRate: number, loanTermInYears: number): number {
  if (principal <= 0 || annualInterestRate < 0 || loanTermInYears <= 0) {
    return 0;
  }

  // Convert annual rate to a monthly decimal rate
  const monthlyInterestRate = annualInterestRate / 100 / 12;

  // Total number of payments
  const numberOfPayments = loanTermInYears * 12;

  // Handle zero interest rate case
  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments;
  }

  const monthlyPayment = principal *
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyPayment;
}

/**
 * Generates an amortization schedule.
 * @param principal The total loan amount.
 * @param annualInterestRate The annual interest rate.
 * @param loanTermInYears The length of the loan in years.
 * @returns An array of objects representing the schedule for each year.
 */
export function generateAmortizationSchedule(principal: number, annualInterestRate: number, loanTermInYears: number) {
    const monthlyPayment = calculateMonthlyMortgage(principal, annualInterestRate, loanTermInYears);
    if (monthlyPayment <= 0) return [];

    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loanTermInYears * 12;
    let remainingBalance = principal;
    const schedule = [];
    let totalInterestPaid = 0;

    for (let month = 1; month <= numberOfPayments; month++) {
        const interestForMonth = remainingBalance * monthlyInterestRate;
        totalInterestPaid += interestForMonth;
        const principalForMonth = monthlyPayment - interestForMonth;
        remainingBalance -= principalForMonth;

        if (month % 12 === 0 || month === numberOfPayments) {
            schedule.push({
                year: Math.ceil(month / 12),
                principalPaid: principal - remainingBalance,
                interestPaid: totalInterestPaid,
                remainingBalance: Math.max(0, remainingBalance),
            });
        }
    }
    return schedule;
}
