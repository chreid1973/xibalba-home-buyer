export interface UserInput {
  income: number;
  downPayment: number;
  creditScore: string;
  monthlyDebt: number;
  postalCode: string;
  city: string;
  loanType: string;
  targetHomePrice: number;
  workAddress?: string;
}

interface ScoreDetail {
  score: number;
  summary: string;
}

interface Amenity {
  name: string;
  type: 'Grocery' | 'Park' | 'Hospital' | 'Transit' | 'Restaurant' | 'Cafe';
  lat: number;
  lon: number;
}

interface School {
  name: string;
  rating: number;
  type: 'Elementary' | 'Middle' | 'High';
  distance: string;
  address: string;
  city: string;
}

export interface AnalysisResult {
  id?: string;
  savedAt?: string;
  userInput: UserInput;

  personalBuyingReadinessScore: number;

  affordability: {
    maxAffordableHomePrice: number;
    monthlyPITH: number;
    tdsRatio: number;
    recommendations: string[];
    priceToIncomeRatio: {
      user: number;
      cityAverage: number;
      summary: string;
    };
  };

  marketAnalysis: {
    dataSource: string;
    averageHomePrice: { quarter: string; price: number }[];
    marketHealthIndex: number;
    forecastSummary: string;
    interestRateForecast: { quarter: string; rate: number }[];
    inventoryLevels: { quarter: string; level: number }[];
  };

  locationAnalysis: {
    dataSources: {
      scores: string;
      schools: string;
      amenities: string;
    };
    scores: {
      affordability: ScoreDetail;
      jobMarket: ScoreDetail;
      safety: ScoreDetail;
      schools: ScoreDetail;
      amenities: ScoreDetail;
    };
    overallSummary: string;
    overallLocationScore: number;
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
  };

  totalCostOfOwnership: {
    totalMonthlyCost: number;
    principalAndInterest: number;
    estimatedTaxes: number;
    estimatedInsurance: number;
    estimatedUtilities: number;
    estimatedMaintenance: number;
  };

  financialAdvice: {
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
  };
  
  breakEvenAnalysis: {
    breakEvenPoint: number;
    summary: string;
    assumptions: {
      estimatedRent: number;
      appreciationRate: number;
      rentIncreaseRate: number;
      buyingCosts: number;
      sellingCosts: number;
    };
  };
  
  methodology: {
      readinessScore: string;
      affordability: string;
      totalCostOfOwnership: string;
      breakEvenAnalysis: string;
  };
}
