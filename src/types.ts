export interface ScoreWithExplanation {
  score: number;
  explanation: string;
}

export interface LocationAnalysis {
  keyMetrics: {
    population: string;
    medianIncome: string;
    dominantAgeGroup: string;
  };
  neighborhoodVibe: string;
  goodFor: string[];
  scores: {
    affordability: ScoreWithExplanation;
    jobMarket: ScoreWithExplanation;
    safety: ScoreWithExplanation;
    schools: ScoreWithExplanation;
    amenities: ScoreWithExplanation;
  };
}

export interface TotalCostOfOwnership {
  estimatedInsurance: number;
  estimatedUtilities: number;
  estimatedMaintenance: number;
  totalMonthlyCost: number;
}

export interface PersonalizedAdvice {
  recommendation: 'Good Time to Buy' | 'Proceed with Caution' | 'Consider Waiting';
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  nextSteps: string[];
  totalCostOfOwnership: TotalCostOfOwnership;
  estimatedMonthlyHousingCost: number;
}

export interface MarketData {
  mortgageRates: { month: string; rate: number }[];
  employmentRates: { month: string; rate: number }[];
  yoyPriceChange: { year: string; change: number }[];
  averageHomePrice: { quarter: string; price: number }[];
}

export interface AnalysisResult {
  personalizedAdvice: PersonalizedAdvice;
  locationAnalysis: LocationAnalysis;
  marketData: MarketData;
}

export interface UserInput {
  income: number;
  downPayment: number;
  creditScore: number;
  monthlyDebt: number;
  postalCode: string;
  city: string;
  loanType: string;
  targetHomePrice: number;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}