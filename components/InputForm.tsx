import React, { useState } from 'react';
import { UserInput } from '../src/types';

interface InputFormProps {
  onAnalysis: (input: UserInput) => void;
  loading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalysis, loading }) => {
  const [propertyPrice, setPropertyPrice] = useState('500000');
  const [downPayment, setDownPayment] = useState('100000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [annualIncome, setAnnualIncome] = useState('120000');
  const [monthlyDebts, setMonthlyDebts] = useState('500');
  const [propertyLocation, setPropertyLocation] = useState('Austin, TX');
  const [workLocation, setWorkLocation] = useState('Downtown Austin, TX');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalysis({
      propertyPrice: parseFloat(propertyPrice),
      downPayment: parseFloat(downPayment),
      interestRate: parseFloat(interestRate),
      loanTerm: parseInt(loanTerm),
      annualIncome: parseFloat(annualIncome),
      monthlyDebts: parseFloat(monthlyDebts),
      propertyLocation,
      workLocation,
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-lg shadow-2xl">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Info */}
          <div className="col-span-1 md:col-span-2 text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2 mb-2">Property & Loan</div>
          <div>
            <label htmlFor="propertyPrice" className="block text-sm font-medium text-slate-300">Property Price ($)</label>
            <input type="number" id="propertyPrice" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-3" required />
          </div>
          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-slate-300">Down Payment ($)</label>
            <input type="number" id="downPayment" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-3" required />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-slate-300">Interest Rate (%)</label>
            <input type="number" step="0.01" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-3" required />
          </div>
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-slate-300">Loan Term (Years)</label>
            <input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-3" required />
          </div>

          {/* Personal Finance */}
          <div className="col-span-1 md:col-span-2 text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2 mb-2 mt-4">Personal Finances</div>
          <div>
            <label htmlFor="annualIncome" className="block text-sm font-medium text-slate-300">Gross Annual Income ($)</label>
            <input type="number" id="annualIncome" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-3" required />
          </div>
          <div>
            <label htmlFor="monthlyDebts" className="block text-sm font-medium text-slate-300">Monthly Debts ($)</label>
            <input type="number" id="monthlyDebts" value={monthlyDebts} onChange={(e) => setMonthlyDebts(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-3" required />
          </div>

          {/* Location */}
          <div className="col-span-1 md:col-span-2 text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2 mb-2 mt-4">Location</div>
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="propertyLocation" className="block text-sm font-medium text-slate-300">Property Location (City, State)</label>
            <input type="text" id="propertyLocation" value={propertyLocation} onChange={(e) => setPropertyLocation(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-3" required />
          </div>
           <div className="col-span-1 md:col-span-2">
            <label htmlFor="workLocation" className="block text-sm font-medium text-slate-300">Work Location (for commute analysis)</label>
            <input type="text" id="workLocation" value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-3" required />
          </div>
        </div>

        <div className="mt-8 text-center">
          <button type="submit" disabled={loading} className="w-full md:w-auto inline-flex justify-center items-center py-3 px-12 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200">
            {loading ? 'Analyzing...' : 'Analyze Deal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
