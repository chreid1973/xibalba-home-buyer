import React, { useState } from 'react';
import type { UserInput } from '../types';

interface InputFormProps {
  onAnalyze: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    income: 80000,
    downPayment: 50000,
    creditScore: 'Good (720-799)',
    monthlyDebt: 500,
    postalCode: 'M5V 2T6',
    city: 'Toronto',
    loanType: '30-Year Fixed',
    targetHomePrice: 450000,
    workAddress: '123 Main St, Toronto',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name.match(/income|downPayment|monthlyDebt|targetHomePrice/) ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };
  
  return (
    <div className="bg-black/20 border border-purple-500/20 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Your Financial Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="income" className="block text-sm font-medium text-slate-300">Annual Gross Income ($)</label>
          <input type="number" name="income" id="income" value={formData.income} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition" placeholder="e.g., 80000" />
          <p className="text-xs text-slate-400 mt-1">(Your total yearly income before any taxes or deductions)</p>
        </div>
        <div>
          <label htmlFor="targetHomePrice" className="block text-sm font-medium text-slate-300">Target Home Price ($)</label>
          <input type="number" name="targetHomePrice" id="targetHomePrice" value={formData.targetHomePrice} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition" placeholder="e.g., 450000" />
          <p className="text-xs text-slate-400 mt-1">(The price of the home you are aiming to buy)</p>
        </div>
        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-slate-300">Down Payment Saved ($)</label>
          <input type="number" name="downPayment" id="downPayment" value={formData.downPayment} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition" placeholder="e.g., 50000" />
          <p className="text-xs text-slate-400 mt-1">(The total amount of money you have saved to put towards the home purchase)</p>
        </div>
        <div>
          <label htmlFor="monthlyDebt" className="block text-sm font-medium text-slate-300">Monthly Debt Payments ($)</label>
          <input type="number" name="monthlyDebt" id="monthlyDebt" value={formData.monthlyDebt} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition" placeholder="e.g., 500 (car, loans, etc)" />
          <p className="text-xs text-slate-400 mt-1">(The sum of all your monthly debt payments, e.g., car loan, student loans, credit card bills)</p>
        </div>
        <div>
          <label htmlFor="creditScore" className="block text-sm font-medium text-slate-300">Estimated Credit Score</label>
          <select name="creditScore" id="creditScore" value={formData.creditScore} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition">
            <option>Excellent (800+)</option>
            <option>Good (720-799)</option>
            <option>Fair (650-719)</option>
            <option>Poor (&lt;650)</option>
          </select>
          <p className="text-xs text-slate-400 mt-1">(Select the range that best describes your credit score. A higher score helps get better loan rates)</p>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-300">Desired City/Town</label>
           <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition" placeholder="e.g., Toronto" />
           <p className="text-xs text-slate-400 mt-1">(The name of the city, town, or municipality)</p>
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-slate-300">Desired Postal Code</label>
           <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition" placeholder="e.g., M5V 2T6" />
           <p className="text-xs text-slate-400 mt-1">(The 6-character postal code of the specific area you're interested in)</p>
        </div>
         <div>
          <label htmlFor="workAddress" className="block text-sm font-medium text-slate-300">Work Address (Optional)</label>
           <input type="text" name="workAddress" id="workAddress" value={formData.workAddress} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition" placeholder="e.g., 123 Main St, Toronto" />
           <p className="text-xs text-slate-400 mt-1">(Providing this helps us analyze your potential commute)</p>
        </div>
        <div>
          <label htmlFor="loanType" className="block text-sm font-medium text-slate-300">Loan Type</label>
          <select name="loanType" id="loanType" value={formData.loanType} onChange={handleChange} className="mt-1 block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-0 focus:border-purple-500 transition">
            <option>30-Year Fixed</option>
            <option>15-Year Fixed</option>
            <option>ARM</option>
          </select>
          <p className="text-xs text-slate-400 mt-1">(The type of mortgage you are considering. 'Fixed' means the interest rate stays the same)</p>
        </div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg shadow-purple-500/20 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 disabled:bg-slate-500 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105">
          {isLoading ? (
            <div className="flex items-center">
               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </div>
          ) : 'Get AI Advice'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;