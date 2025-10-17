import { GoogleGenAI, Type } from "@google/genai";
import type { UserInput, AnalysisResult } from '../src/types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scoreDetailSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "A numerical score from 1 to 10 (inclusive)." },
        summary: { type: Type.STRING, description: "A brief, one-sentence summary explaining the score." }
    },
    required: ['score', 'summary']
};

const amenitySchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['Grocery', 'Park', 'Hospital', 'Transit', 'Restaurant', 'Cafe'] },
        lat: { type: Type.NUMBER, description: "Latitude coordinate" },
        lon: { type: Type.NUMBER, description: "Longitude coordinate" }
    },
    required: ['name', 'type', 'lat', 'lon']
};

const schoolSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        rating: { type: Type.NUMBER, description: "A score out of 10, e.g., 8.5" },
        type: { type: Type.STRING, enum: ['Elementary', 'Middle', 'High'] },
        distance: { type: Type.STRING, description: "Estimated distance from the target postal code, e.g. '1.2 km'." },
        address: { type: Type.STRING, description: "The full street address of the school." },
        city: { type: Type.STRING, description: "The city the school is located in." }
    },
    required: ['name', 'rating', 'type', 'distance', 'address', 'city']
};


const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        personalBuyingReadinessScore: {
            type: Type.NUMBER,
            description: "An overall score from 1 to 10 indicating the user's readiness to buy, considering their finances and market conditions."
        },
        affordability: {
            type: Type.OBJECT,
            properties: {
                maxAffordableHomePrice: { type: Type.NUMBER, description: "The maximum home price the user can comfortably afford." },
                monthlyPITH: { type: Type.NUMBER, description: "The estimated monthly cost for Principal, Interest, Taxes, and Heating." },
                tdsRatio: { type: Type.NUMBER, description: "The user's Total Debt Service (TDS) ratio as a percentage. Calculated as (monthly housing cost + other monthly debt) / gross monthly income." },
                recommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of 2-3 specific, actionable recommendations to improve their affordability."
                },
                 priceToIncomeRatio: {
                    type: Type.OBJECT,
                    description: "A comparison of the user's home price-to-income ratio against the city average.",
                    properties: {
                        user: { type: Type.NUMBER, description: "The user's ratio (target home price / annual income)." },
                        cityAverage: { type: Type.NUMBER, description: "The average ratio for the specified city." },
                        summary: { type: Type.STRING, description: "A one-sentence summary comparing the user's ratio to the city average and what it implies." }
                    },
                    required: ['user', 'cityAverage', 'summary']
                }
            },
            required: ['maxAffordableHomePrice', 'monthlyPITH', 'tdsRatio', 'recommendations', 'priceToIncomeRatio']
        },
        marketAnalysis: {
            type: Type.OBJECT,
            properties: {
                dataSource: { type: Type.STRING, description: "The primary sources for the market data provided, e.g., 'Local MLS Data, Federal Reserve Economic Data'." },
                averageHomePrice: {
                    type: Type.ARRAY,
                    description: "Historical and forecasted average home prices for the last 4 and next 2 quarters. The last 2 data points are forecasts. Format is 'YYYY QX'.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            quarter: { type: Type.STRING },
                            price: { type: Type.NUMBER }
                        },
                        required: ['quarter', 'price']
                    }
                },
                marketHealthIndex: { type: Type.NUMBER, description: "A score from 1 to 10 indicating market health (e.g., buyer's vs. seller's market)." },
                forecastSummary: { type: Type.STRING, description: "A 1-2 sentence summary of the market forecast." },
                interestRateForecast: {
                    type: Type.ARRAY,
                    description: "Forecasted mortgage interest rates for the next 4 quarters. Format is 'YYYY QX'.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            quarter: { type: Type.STRING },
                            rate: { type: Type.NUMBER, description: "Interest rate as a percentage." }
                        },
                        required: ['quarter', 'rate']
                    }
                },
                inventoryLevels: {
                     type: Type.ARRAY,
                    description: "Historical and forecasted housing inventory levels for the last 4 and next 2 quarters. Format is 'YYYY QX'.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            quarter: { type: Type.STRING },
                            level: { type: Type.NUMBER, description: "Number of active listings." }
                        },
                        required: ['quarter', 'level']
                    }
                }
            },
            required: ['dataSource', 'averageHomePrice', 'marketHealthIndex', 'forecastSummary', 'interestRateForecast', 'inventoryLevels']
        },
        locationAnalysis: {
            type: Type.OBJECT,
            properties: {
                 dataSources: {
                    type: Type.OBJECT,
                    description: "The primary sources for the location data.",
                    properties: {
                        scores: { type: Type.STRING, description: "e.g., 'U.S. Census Bureau, Local Crime Statistics'" },
                        schools: { type: Type.STRING, description: "e.g., 'GreatSchools.org, Provincial Education Rankings'" },
                        amenities: { type: Type.STRING, description: "e.g., 'Google Maps API, OpenStreetMap'" }
                    },
                    required: ['scores', 'schools', 'amenities']
                },
                scores: {
                    type: Type.OBJECT,
                    properties: {
                        affordability: scoreDetailSchema,
                        jobMarket: scoreDetailSchema,
                        safety: scoreDetailSchema,
                        schools: scoreDetailSchema,
                        amenities: scoreDetailSchema
                    },
                    required: ['affordability', 'jobMarket', 'safety', 'schools', 'amenities']
                },
                overallSummary: { type: Type.STRING, description: "A 2-3 sentence summary of the location's pros and cons for the user." },
                overallLocationScore: { type: Type.NUMBER, description: "A single, weighted score from 1-10 representing the location's overall quality based on the individual scores." },
                commuteAnalysis: {
                    type: Type.OBJECT,
                    description: "An analysis of the user's potential commute. Only include if a work address is provided.",
                    properties: {
                        time: { type: Type.NUMBER, description: "The estimated average commute time in minutes." },
                        score: { type: Type.NUMBER, description: "A score from 1-10 for the commute, where 1 is very bad and 10 is excellent." },
                        summary: { type: Type.STRING, description: "A one-sentence summary of the commute situation." }
                    },
                    required: ['time', 'score', 'summary']
                },
                neighborhoodCoords: {
                    type: Type.OBJECT,
                    description: "The central geographic coordinates of the target neighborhood.",
                    properties: {
                        lat: { type: Type.NUMBER },
                        lon: { type: Type.NUMBER }
                    },
                    required: ['lat', 'lon']
                },
                amenities: {
                    type: Type.ARRAY,
                    description: "A list of up to 5 key nearby amenities.",
                    items: amenitySchema
                },
                topSchools: {
                    type: Type.ARRAY,
                    description: "A list of 3-4 top-rated schools in the vicinity.",
                    items: schoolSchema
                }
            },
            required: ['dataSources', 'scores', 'overallSummary', 'overallLocationScore', 'neighborhoodCoords', 'amenities', 'topSchools']
        },
        totalCostOfOwnership: {
            type: Type.OBJECT,
            properties: {
                totalMonthlyCost: { type: Type.NUMBER, description: "Total estimated monthly cost of homeownership." },
                principalAndInterest: { type: Type.NUMBER, description: "Estimated monthly mortgage principal and interest." },
                estimatedTaxes: { type: Type.NUMBER, description: "Estimated monthly property taxes." },
                estimatedInsurance: { type: Type.NUMBER, description: "Estimated monthly homeowner's insurance." },
                estimatedUtilities: { type: Type.NUMBER, description: "Estimated monthly utilities (water, gas, electric)." },
                estimatedMaintenance: { type: Type.NUMBER, description: "Estimated monthly savings for maintenance (typically 1% of home value per year / 12)." }
            },
            required: ['totalMonthlyCost', 'principalAndInterest', 'estimatedTaxes', 'estimatedInsurance', 'estimatedUtilities', 'estimatedMaintenance']
        },
        financialAdvice: {
            type: Type.OBJECT,
            properties: {
                overallRecommendation: { type: Type.STRING, description: "A clear, direct recommendation, e.g., 'A Good Time to Buy', 'Proceed with Caution', or 'Strengthen Finances First'." },
                pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 key reasons why buying now could be a good idea for the user." },
                cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 key risks or downsides for the user to consider." },
                actionableSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 concrete, actionable next steps for the user." },
                chartInsights: {
                    type: Type.OBJECT,
                    description: "Brief, one-sentence, data-driven insights for each major chart, explaining its implication for the user.",
                    properties: {
                        readinessGauge: { type: Type.STRING, description: "Insight for the Personal Buying Readiness gauge." },
                        ownershipCost: { type: Type.STRING, description: "Insight for the Estimated Monthly Cost chart." },
                        locationRadar: { type: Type.STRING, description: "Insight for the Location Attractiveness radar chart." },
                        homePriceForecast: { type: Type.STRING, description: "Insight for the Average Home Price Forecast chart." },
                        interestRateForecast: { type: Type.STRING, description: "Insight for the Interest Rate Forecast chart." },
                        inventoryLevels: { type: Type.STRING, description: "Insight for the Housing Inventory Levels chart." }
                    },
                    required: ['readinessGauge', 'ownershipCost', 'locationRadar', 'homePriceForecast', 'interestRateForecast', 'inventoryLevels']
                }
            },
            required: ['overallRecommendation', 'pros', 'cons', 'actionableSteps', 'chartInsights']
        },
        breakEvenAnalysis: {
            type: Type.OBJECT,
            description: "An analysis of the buy vs. rent break-even point.",
            properties: {
                breakEvenPoint: { type: Type.NUMBER, description: "The number of years it takes for buying to become more financially advantageous than renting." },
                summary: { type: Type.STRING, description: "A concise, 1-2 sentence summary explaining the break-even point to the user." },
                assumptions: {
                    type: Type.OBJECT,
                    description: "The assumptions used in the break-even calculation.",
                    properties: {
                        estimatedRent: { type: Type.NUMBER, description: "Estimated monthly rent for a comparable property in the area." },
                        appreciationRate: { type: Type.NUMBER, description: "Assumed annual home appreciation rate as a percentage." },
                        rentIncreaseRate: { type: Type.NUMBER, description: "Assumed annual rent increase rate as a percentage." },
                        buyingCosts: { type: Type.NUMBER, description: "One-time buying costs (closing costs, etc.) as a percentage of the home price." },
                        sellingCosts: { type: Type.NUMBER, description: "One-time selling costs (realtor fees, etc.) as a percentage of the home price." }
                    },
                    required: ['estimatedRent', 'appreciationRate', 'rentIncreaseRate', 'buyingCosts', 'sellingCosts']
                }
            },
            required: ['breakEvenPoint', 'summary', 'assumptions']
        },
        methodology: {
            type: Type.OBJECT,
            description: "Brief, high-level explanations of how key calculations are derived.",
            properties: {
                readinessScore: { type: Type.STRING, description: "Explanation for the Personal Buying Readiness Score." },
                affordability: { type: Type.STRING, description: "Explanation for the affordability and max home price calculation." },
                totalCostOfOwnership: { type: Type.STRING, description: "Explanation for how Total Cost of Ownership is estimated." },
                breakEvenAnalysis: { type: Type.STRING, description: "Explanation for the Buy vs. Rent Break-Even analysis methodology." }
            },
            required: ['readinessScore', 'affordability', 'totalCostOfOwnership', 'breakEvenAnalysis']
        }
    },
    required: [
        'personalBuyingReadinessScore',
        'affordability',
        'marketAnalysis',
        'locationAnalysis',
        'totalCostOfOwnership',
        'financialAdvice',
        'breakEvenAnalysis',
        'methodology'
    ]
};

function createPrompt(data: UserInput): string {
    const workAddressInfo = data.workAddress ? `- Work Address: ${data.workAddress}` : '';

    return `
    As an expert Property Scout AI, analyze the following user profile and provide a comprehensive, data-driven home buying analysis.
    The user wants to buy a home with a target price of $${data.targetHomePrice} in ${data.city} (postal code: ${data.postalCode}).

    User's Financial Profile:
    - Annual Gross Income: $${data.income}
    - Down Payment Saved: $${data.downPayment}
    - Estimated Credit Score Category: ${data.creditScore}
    - Monthly Debt Payments: $${data.monthlyDebt}
    - Desired Loan Type: ${data.loanType}
    ${workAddressInfo}

    Your tasks are:
    1.  **Assess Affordability:** Based on their credit score category, calculate their max affordable price, Total Debt Service (TDS) ratio ((monthly housing cost + other monthly debt) / gross monthly income), and estimated monthly costs. Also, calculate the user's home price-to-income ratio (target home price / annual income) and compare it to the average ratio for ${data.city}. Provide recommendations.
    2.  **Analyze the Local Market:** Research the real estate market for ${data.city}. Provide historical and forecasted data for home prices, interest rates, and inventory. A seller's market is a higher health index, a buyer's is lower. **Cite your primary data sources** (e.g., 'Local MLS Data, Federal Reserve Economic Data').
    3.  **Evaluate the Location:** Score the area based on key factors like affordability, job market, safety, schools, and local amenities. Calculate a single, weighted 'overallLocationScore' from 1-10 based on these individual scores. ${data.workAddress ? `Also, analyze the commute from the target postal code to the work address, providing an estimated time, a score, and a summary.` : ''} **Additionally, provide hyper-local insights and cite your sources for each category:**
        - Find the central latitude and longitude for the neighborhood of postal code ${data.postalCode}.
        - Identify up to 5 key amenities (like grocery stores, parks, hospitals, transit stops) within a short distance. Provide their name, type, and geographic coordinates.
        - List 3-4 of the best schools nearby. Provide their name, type (Elementary, etc.), a rating out of 10, their approximate distance from the neighborhood, and their full street address and city. **Explicitly state the source of your school ratings** (e.g., 'GreatSchools.org', 'Provincial Education Rankings').
    4.  **Calculate Total Cost of Ownership (TCO):** Break down all estimated monthly costs.
    5.  **Calculate Buy vs. Rent Break-Even Point:** Determine the number of years it will take for the financial benefits of owning this home to outweigh the costs of renting a comparable property. To do this, you must make reasonable, localized assumptions for: estimated monthly rent for a comparable property, annual home appreciation rate, annual rent increase rate, one-time buying costs (as a % of home price), and one-time selling costs (as a % of home price). Return the break-even point in years, a summary, and all the assumptions you used.
    6.  **Provide a Readiness Score and Financial Advice:** Give an overall readiness score from 1-10. Offer a clear recommendation, outline pros and cons, and list actionable next steps.
    7.  **Generate Chart Insights:** For each major data visualization, provide a concise, one-sentence summary that explains what the data means for the user specifically.
    8.  **Explain Methodology:** In the 'methodology' object, provide brief, high-level explanations for how you derive your key calculations (Readiness Score, Affordability, TCO, Break-Even). This is for user transparency.

    Return your complete analysis as a single JSON object that conforms to the provided schema. Ensure all numerical values are numbers, not strings.
    Base your analysis on current, realistic market data, interest rates, and local conditions for ${data.city}.
  `;
}

export async function getAIAnalysis(userInput: UserInput): Promise<AnalysisResult> {
  try {
    const prompt = createPrompt(userInput);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    const jsonString = result.text;
    // We explicitly cast here after parsing, trusting the API conforms to the schema.
    const partialResult = JSON.parse(jsonString) as Omit<AnalysisResult, 'id' | 'savedAt' | 'userInput'>;
    
    // Combine the AI result with the user input and temporary IDs
    const analysisResult: AnalysisResult = {
      ...partialResult,
      userInput: userInput,
      id: '', // Will be assigned on save
      savedAt: '', // Will be assigned on save
    };
    
    return analysisResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching AI analysis.");
  }
}