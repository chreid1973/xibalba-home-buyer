import React, { useState } from 'react';
// FIX: Corrected import path
import type { UserInput } from '../src/types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    income: 100000,
    downPayment: 50000,
    creditScore: 'Good (660-719)',
    monthlyDebt: 500,
    postalCode: '90210',
    city: 'Beverly Hills',
    loanType: '30-Year Fixed',
    targetHomePrice: 650000,
    workAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['income', 'downPayment', 'monthlyDebt', 'targetHomePrice'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
    
  const inputStyle = "w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors";
  const labelStyle = "block text-sm font-medium text-slate-300 mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-purple-500/10 p-8 rounded-xl shadow-2xl w-full max-w-4xl mx-auto backdrop-blur-lg animate-fade-in">
      <h3 className="text-3xl font-bold text-white text-center mb-2">Let's Find Your Home</h3>
      <p className="text-center text-slate-400 mb-8">Enter your details to get a personalized AI analysis.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Info */}
        <div>
          <label htmlFor="income" className={labelStyle}>Annual Gross Income ($)</label>
          <input type="number" id="income" name="income" value={formData.income} onChange={handleChange} className={inputStyle} placeholder="e.g., 100000" required />
        </div>
        <div>
          <label htmlFor="downPayment" className={labelStyle}>Down Payment ($)</label>
          <input type="number" id="downPayment" name="downPayment" value={formData.downPayment} onChange={handleChange} className={inputStyle} placeholder="e.g., 50000" required />
        </div>
        <div>
          <label htmlFor="creditScore" className={labelStyle}>Estimated Credit Score</label>
          <select id="creditScore" name="creditScore" value={formData.creditScore} onChange={handleChange} className={inputStyle} required>
            <option>Excellent (780+)</option>
            <option>Very Good (720-779)</option>
            <option>Good (660-719)</option>
            <option>Fair (620-659)</option>
            <option>Poor (&lt;620)</option>
          </select>
        </div>
        <div>
          <label htmlFor="monthlyDebt" className={labelStyle}>Total Monthly Debt Payments ($)</label>
          <input type="number" id="monthlyDebt" name="monthlyDebt" value={formData.monthlyDebt} onChange={handleChange} className={inputStyle} placeholder="Car loans, student loans, etc." required />
        </div>

        {/* Property Info */}
        <div className="md:col-span-2"><hr className="border-slate-700 my-2"/></div>
        
        <div>
          <label htmlFor="targetHomePrice" className={labelStyle}>Target Home Price ($)</label>
          <input type="number" id="targetHomePrice" name="targetHomePrice" value={formData.targetHomePrice} onChange={handleChange} className={inputStyle} placeholder="e.g., 650000" required />
        </div>
        <div>
          <label htmlFor="loanType" className={labelStyle}>Desired Loan Type</label>
          <select id="loanType" name="loanType" value={formData.loanType} onChange={handleChange} className={inputStyle} required>
            <option>30-Year Fixed</option>
            <option>15-Year Fixed</option>
            <option>ARM</option>
          </select>
        </div>
         <div>
          <label htmlFor="city" className={labelStyle}>Target City</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={inputStyle} placeholder="e.g., San Francisco" required />
        </div>
        <div>
          <label htmlFor="postalCode" className={labelStyle}>Target Postal Code</label>
          <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} className={inputStyle} placeholder="e.g., 94105" required />
        </div>
        <div className="md:col-span-2">
            <label htmlFor="workAddress" className={labelStyle}>Work Address (Optional)</label>
            <input type="text" id="workAddress" name="workAddress" value={formData.workAddress || ''} onChange={handleChange} className={inputStyle} placeholder="For commute analysis, e.g., 1600 Amphitheatre Parkway, Mountain View" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-400/40 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none">
          {isLoading ? 'Analyzing...' : 'Generate Analysis'}
        </button>
      </div>
    </form>
  );
};

export default InputForm;