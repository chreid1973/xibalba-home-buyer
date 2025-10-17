import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateAmortizationSchedule } from '../src/utils/financialCalculations';
import InfoTooltip from './InfoTooltip';

interface AmortizationChartProps {
  principal: number;
  interestRate: number;
  loanTerm: number;
}

const currencyFormatter = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const principal = payload.find((p: any) => p.dataKey === 'principalPaid')?.value || 0;
      const interest = payload.find((p: any) => p.dataKey === 'interestPaid')?.value || 0;
      const remainingBalance = payload[0]?.payload.remainingBalance;

      return (
        <div className="bg-white p-2 border border-slate-200 rounded shadow-lg text-slate-700 text-sm">
          <p className="label font-bold">{`End of Year ${label}`}</p>
          <p className="text-cyan-500">{`Principal Paid (Total): ${currencyFormatter(principal)}`}</p>
          <p className="text-orange-500">{`Interest Paid (Total): ${currencyFormatter(interest)}`}</p>
          <p className="text-slate-600">{`Remaining Balance: ${currencyFormatter(remainingBalance)}`}</p>
        </div>
      );
    }
    return null;
};


const AmortizationChart: React.FC<AmortizationChartProps> = ({ principal, interestRate, loanTerm }) => {
  const schedule = generateAmortizationSchedule(principal, interestRate, loanTerm);

  if (!schedule || schedule.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Loan Amortization Schedule</h3>
        <p className="text-slate-500">Could not generate amortization schedule with the provided data.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800">
        <div className="flex justify-center items-center mb-4">
            <h3 className="text-xl font-bold text-center text-slate-700">Loan Amortization Over {loanTerm} Years</h3>
            <InfoTooltip text="This chart shows the cumulative amount of principal and interest paid over the life of the loan. You can see how principal payments accelerate over time." />
        </div>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={schedule}
                    margin={{
                        top: 10, right: 30, left: 20, bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Loan Year', position: 'insideBottom', offset: -10 }}/>
                    <YAxis tickFormatter={currencyFormatter} label={{ value: 'Total Paid', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" dataKey="principalPaid" name="Principal Paid" stackId="1" stroke="#06b6d4" fill="#06b6d4" />
                    <Area type="monotone" dataKey="interestPaid" name="Interest Paid" stackId="1" stroke="#f97316" fill="#f97316" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default AmortizationChart;
