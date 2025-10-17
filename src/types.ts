export interface UserInput {
  income: number;
  downPayment: number;
  creditScore: string; // Changed from number to string for categories
  monthlyDebt: number;
  postalCode: string;
  city: string;
  loanType: '30-Year Fixed' | '15-Year Fixed' | 'ARM';
  targetHomePrice: number;
  workAddress?: string;
}

export interface AffordabilityAnalysis {
  maxAffordableHomePrice: number;
  monthlyPITH: number; // Principal, Interest, Taxes, Heating
  tdsRatio: number; // Total Debt Service Ratio
  recommendations: string[];
  priceToIncomeRatio: {
    user: number;
    cityAverage: number;
    summary: string;
  };
}

export interface MarketDataPoint {
  quarter: string;
  price: number;
}
export interface MarketData {
  averageHomePrice: MarketDataPoint[];
  marketHealthIndex: number;
  forecastSummary: string;
  interestRateForecast: { quarter: string; rate: number }[];
  inventoryLevels: { quarter: string; level: number }[];
}

interface ScoreDetail {
  score: number;
  summary: string;
}

export interface Amenity {
  name: string;
  type: 'Grocery' | 'Park' | 'Hospital' | 'Transit' | 'Restaurant' | 'Cafe';
  lat: number;
  lon: number;
}

export interface School {
  name: string;
  rating: number; // A score out of 10
  type: 'Elementary' | 'Middle' | 'High';
  distance: string; // e.g., "1.2 km"
}

export interface LocationAnalysis {
  scores: {
    affordability: ScoreDetail;
    jobMarket: ScoreDetail;
    safety: ScoreDetail;
    schools: ScoreDetail;
    amenities: ScoreDetail;
  };
  overallSummary: string;
  commuteAnalysis?: {
    time: number;
    score: number;
    summary: string;
  };
  neighborhoodCoords: {
      lat: number;
      lon: number;
  };
  amenities: Amenity[];
  topSchools: School[];
}

export interface TotalCostOfOwnership {
  totalMonthlyCost: number;
  principalAndInterest: number;
  estimatedTaxes: number;
  estimatedInsurance: number;
  estimatedUtilities: number;
  estimatedMaintenance: number;
}

export interface FinancialAdvice {
  overallRecommendation: string;
  pros: string[];
  cons: string[];
  actionableSteps: string[];
  chartInsights: {
    readinessGauge: string;
    ownershipCost: string;
    locationRadar: string;
    homePriceForecast: string;
    interestRateForecast: string;
    inventoryLevels: string;
  };
}

export interface AnalysisResult {
  personalBuyingReadinessScore: number;
  affordability: AffordabilityAnalysis;
  marketAnalysis: MarketData;
  locationAnalysis: LocationAnalysis;
  totalCostOfOwnership: TotalCostOfOwnership;
  financialAdvice: FinancialAdvice;
}