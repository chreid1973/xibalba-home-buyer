import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { UserInput, AnalysisResult, LocationAnalysis, MarketData, PersonalizedAdvice } from '../types';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return aiClient;
}

const model = "gemini-2.5-flash";

const scoreWithExplanationSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: 'A score from 1 to 10.' },
        explanation: { type: Type.STRING, description: 'A brief, one-sentence explanation justifying the score, referencing the data considered.' }
    },
    required: ['score', 'explanation']
};

const marketDataSchema = {
    type: Type.OBJECT,
    properties: {
        mortgageRates: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { month: { type: Type.STRING }, rate: { type: Type.NUMBER } }, required: ['month', 'rate'] } },
        employmentRates: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { month: { type: Type.STRING }, rate: { type: Type.NUMBER } }, required: ['month', 'rate'] } },
        yoyPriceChange: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { year: { type: Type.STRING }, change: { type: Type.NUMBER } }, required: ['year', 'change'] } },
        averageHomePrice: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { quarter: { type: Type.STRING }, price: { type: Type.NUMBER } }, required: ['quarter', 'price'] } }
    },
    required: ['mortgageRates', 'employmentRates', 'yoyPriceChange', 'averageHomePrice']
};

const totalCostOfOwnershipSchema = {
    type: Type.OBJECT,
    properties: {
        estimatedInsurance: { type: Type.NUMBER, description: "Plausible estimated monthly home insurance cost based on home price and location." },
        estimatedUtilities: { type: Type.NUMBER, description: "Plausible estimated monthly utilities (hydro, water, gas) cost based on location." },
        estimatedMaintenance: { type: Type.NUMBER, description: "Estimated monthly savings for maintenance (typically 1% of home value annually, divided by 12)." },
        totalMonthlyCost: { type: Type.NUMBER, description: "The sum of PITH (from pre-calculated metrics), insurance, utilities, and maintenance." }
    },
    required: ['estimatedInsurance', 'estimatedUtilities', 'estimatedMaintenance', 'totalMonthlyCost']
}

const personalizedAdviceSchema = {
    type: Type.OBJECT,
    properties: {
        recommendation: { type: Type.STRING, description: 'A clear recommendation: "Good Time to Buy", "Proceed with Caution", or "Consider Waiting".' },
        score: { type: Type.INTEGER, description: 'A score from 1 to 10 indicating the user\'s personal buying readiness (1=very bad, 10=excellent).' },
        summary: { type: Type.STRING, description: 'A concise summary of the reasoning behind the recommendation, combining user finances and market data.' },
        pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of positive factors for the user to buy now.' },
        cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of negative factors or risks for the user.' },
        nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Actionable next steps for the user.' },
        totalCostOfOwnership: totalCostOfOwnershipSchema,
        estimatedMonthlyHousingCost: { type: Type.NUMBER, description: "The pre-calculated estimated monthly housing cost (PITH)." }
    },
    required: ['recommendation', 'score', 'summary', 'pros', 'cons', 'nextSteps', 'totalCostOfOwnership', 'estimatedMonthlyHousingCost']
};


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    marketData: marketDataSchema,
    personalizedAdvice: personalizedAdviceSchema,
    locationAnalysis: {
      type: Type.OBJECT,
      properties: {
        keyMetrics: {
          type: Type.OBJECT,
          properties: {
            population: { type: Type.STRING, description: 'Estimated population of the area, e.g., "approx. 15,000".' },
            medianIncome: { type: Type.STRING, description: 'Estimated median household income, e.g., "approx. $95,000".' },
            dominantAgeGroup: { type: Type.STRING, description: 'The most prevalent age group, e.g., "25-40".' }
          },
          required: ['population', 'medianIncome', 'dominantAgeGroup']
        },
        neighborhoodVibe: { type: Type.STRING, description: 'A qualitative description of the area\'s atmosphere and character.' },
        goodFor: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of ideal resident profiles (e.g., "Young Professionals", "Families with Children").' },
        scores: {
          type: Type.OBJECT,
          properties: {
            affordability: scoreWithExplanationSchema,
            jobMarket: scoreWithExplanationSchema,
            safety: scoreWithExplanationSchema,
            schools: scoreWithExplanationSchema,
            amenities: scoreWithExplanationSchema,
          },
          required: ['affordability', 'jobMarket', 'safety', 'schools', 'amenities']
        }
      },
      required: ['keyMetrics', 'neighborhoodVibe', 'goodFor', 'scores']
    }
  },
  required: ['personalizedAdvice', 'locationAnalysis', 'marketData']
};

interface PrecomputedFinancials {
    estimatedMonthlyHousingCost: number;
    tdsRatio: number;
}

const calculateMonthlyMortgage = (principal: number, annualRate: number, years: number): number => {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
  if (denominator === 0) return 0;
  const payment = principal * (numerator / denominator);
  return isNaN(payment) || !isFinite(payment) ? 0 : payment;
};

const precomputeFinancials = (userInput: UserInput): PrecomputedFinancials => {
    const assumedMortgageRateForCalc = 5.5; 
    const homePriceForCalc = userInput.targetHomePrice;
    const loanPrincipal = Math.max(0, homePriceForCalc - userInput.downPayment);
    const amortizationYears = 25;

    const monthlyMortgagePayment = calculateMonthlyMortgage(loanPrincipal, assumedMortgageRateForCalc, amortizationYears);
    const monthlyPropertyTax = (homePriceForCalc * 0.01) / 12; 
    const monthlyHeating = 150; 

    const totalMonthlyHousingCost = monthlyMortgagePayment + monthlyPropertyTax + monthlyHeating;
    const grossMonthlyIncome = userInput.income / 12;
    const totalMonthlyDebt = totalMonthlyHousingCost + userInput.monthlyDebt;
    const tdsRatio = grossMonthlyIncome > 0 ? (totalMonthlyDebt / grossMonthlyIncome) * 100 : 0;
    
    return {
        estimatedMonthlyHousingCost: totalMonthlyHousingCost,
        tdsRatio: tdsRatio,
    };
}


const generateMainPrompt = (userInput: UserInput, financials: PrecomputedFinancials): string => {
  return `
    You are an expert Canadian real estate market data generator and financial analyst. Your task is to provide a comprehensive analysis for a potential homebuyer based on their financial profile and desired location.

    **Context: User and Location**
    - Desired Location: **${userInput.city}**, postal code **${userInput.postalCode}**
    - User's Financial Profile & Pre-Calculated Metrics:
        - Annual Gross Income: $${userInput.income.toLocaleString()}
        - Target Home Price: $${userInput.targetHomePrice.toLocaleString()}
        - Down Payment Saved: $${userInput.downPayment.toLocaleString()}
        - Existing Monthly Debt Payments: $${userInput.monthlyDebt.toLocaleString()}
        - Credit Score: ${userInput.creditScore}
        - **Calculated Total Debt Service (TDS) Ratio:** ${financials.tdsRatio.toFixed(2)}% (Note: Lenders typically look for under 44%)
        - **Estimated Monthly Housing Cost (PITH - Principal, Interest, Taxes, Heat):** $${financials.estimatedMonthlyHousingCost.toFixed(2)}

    **Analysis Requirements:**
    Based on all the provided context, generate the following analysis components:

    1.  **Market Data:** Generate plausible, localized market data reflecting recent trends for the specified location.
        - \`mortgageRates\`: Data for the last 6 months.
        - \`employmentRates\`: Data for the last 6 months.
        - \`yoyPriceChange\`: Data for the last 5 years.
        - \`averageHomePrice\`: Data for the last 4 quarters.

    2.  **Location Analysis:** Provide a detailed analysis of the area.
        - \`keyMetrics\`: Population, median household income, dominant age group.
        - \`neighborhoodVibe\`: A qualitative description of the area's character.
        - \`goodFor\`: A list of ideal resident profiles (e.g., "Young Professionals").
        - \`scores\`: Scores from 1-10 (with brief explanations) for Affordability, Job Market, Safety, Schools, and Amenities.

    3.  **Personalized Financial Advice:** Synthesize the user's financials with the market data.
        - \`recommendation\`: A clear verdict: "Good Time to Buy", "Proceed with Caution", or "Consider Waiting".
        - \`score\`: A personal buying readiness score from 1 to 10.
        - \`summary\`: A concise summary of the reasoning.
        - \`pros\` & \`cons\`: A list of positive and negative factors for the user.
        - \`nextSteps\`: Actionable next steps.
        - \`totalCostOfOwnership\`: Plausible monthly estimates for home insurance, utilities, and a maintenance fund, and the total monthly cost.
        - **CRITICAL:** You MUST use the provided PITH value of **$${financials.estimatedMonthlyHousingCost.toFixed(2)}** in your calculations and ensure it is present in the final JSON response under 'personalizedAdvice.estimatedMonthlyHousingCost'.
  `;
};

const sanitizeAnalysisResult = (parsedResult: any): AnalysisResult => {
    // FIX: Handle cases where the AI returns null or non-object responses, preventing a crash.
    const safeParsedResult = (typeof parsedResult === 'object' && parsedResult !== null) ? parsedResult : {};

    const defaultScore = { score: 0, explanation: 'Data not available.' };
    const defaultScores = {
        affordability: defaultScore,
        jobMarket: defaultScore,
        safety: defaultScore,
        schools: defaultScore,
        amenities: defaultScore,
    };
    const defaultKeyMetrics = { population: 'N/A', medianIncome: 'N/A', dominantAgeGroup: 'N/A' };
    const defaultTotalCostOfOwnership = { estimatedInsurance: 0, estimatedUtilities: 0, estimatedMaintenance: 0, totalMonthlyCost: 0 };

    // Use spread syntax to safely merge parsed data over a complete default structure.
    const result: AnalysisResult = {
        personalizedAdvice: {
            recommendation: 'Consider Waiting',
            score: 0,
            summary: 'Could not generate personalized advice.',
            pros: [],
            cons: [],
            nextSteps: [],
            totalCostOfOwnership: defaultTotalCostOfOwnership,
            estimatedMonthlyHousingCost: 0,
            ...(safeParsedResult.personalizedAdvice || {})
        },
        locationAnalysis: {
            keyMetrics: defaultKeyMetrics,
            neighborhoodVibe: 'N/A',
            goodFor: [],
            scores: defaultScores,
            ...(safeParsedResult.locationAnalysis || {})
        },
        marketData: {
            mortgageRates: [],
            employmentRates: [],
            yoyPriceChange: [],
            averageHomePrice: [],
            ...(safeParsedResult.marketData || {})
        }
    };

    // Deep sanitize nested objects to ensure all keys exist.
    result.personalizedAdvice.totalCostOfOwnership = { ...defaultTotalCostOfOwnership, ...(result.personalizedAdvice.totalCostOfOwnership || {}) };
    result.locationAnalysis.scores = { ...defaultScores, ...(result.locationAnalysis.scores || {}) };
    result.locationAnalysis.keyMetrics = { ...defaultKeyMetrics, ...(result.locationAnalysis.keyMetrics || {}) };
    
    // Deep sanitize market data arrays to prevent charting library crashes.
    const sanitizeChartData = (data: any[], keyName: string, valueName: string) => {
        if (!Array.isArray(data)) return [];
        return data
            .map(item => {
                if (typeof item !== 'object' || item === null) return null;
                const value = parseFloat(item[valueName]);
                // Exclude items with non-numeric or missing values
                if (isNaN(value)) return null; 
                return {
                    [keyName]: String(item[keyName] || 'N/A'),
                    [valueName]: value,
                };
            })
            .filter((item): item is { [key: string]: string | number } => item !== null) as any;
    };
    
    result.marketData.mortgageRates = sanitizeChartData(result.marketData.mortgageRates, 'month', 'rate');
    result.marketData.employmentRates = sanitizeChartData(result.marketData.employmentRates, 'month', 'rate');
    result.marketData.yoyPriceChange = sanitizeChartData(result.marketData.yoyPriceChange, 'year', 'change');
    result.marketData.averageHomePrice = sanitizeChartData(result.marketData.averageHomePrice, 'quarter', 'price');

    return result;
}


export const getHousingAdvice = async (userInput: UserInput): Promise<AnalysisResult> => {
  const ai = getAiClient();
  const precomputedData = precomputeFinancials(userInput);
  const prompt = generateMainPrompt(userInput, precomputedData);
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4,
      },
    });

    // The AI can sometimes wrap its response in markdown, even when asked for JSON.
    // This new logic robustly extracts the JSON string.
    let jsonText = (response?.text ?? '').trim();
    const markdownMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
        jsonText = markdownMatch[1];
    }

    if (!jsonText) {
        throw new Error("AI returned an empty response.");
    }
    
    const parsedResult = JSON.parse(jsonText);
    
    // Sanitize the result to ensure a stable data structure and prevent crashes.
    return sanitizeAnalysisResult(parsedResult);

  } catch (error) {
    console.error("Error calling Gemini API for main analysis:", error);
    // Check if it's a parsing error to provide a more specific message.
    if (error instanceof SyntaxError) {
       throw new Error("The AI returned a malformed analysis. Please try again.");
    }
    throw new Error("Failed to get analysis from AI service.");
  }
};

export const getUpdatedPersonalizedAdvice = async (userInput: UserInput, locationAnalysis: LocationAnalysis, marketData: MarketData): Promise<PersonalizedAdvice> => {
    const ai = getAiClient();
    const financials = precomputeFinancials(userInput);
    
    // Defensive checks for market data to prevent crashes
    const latestMortgageRate = marketData.mortgageRates?.length > 0 ? `${marketData.mortgageRates[marketData.mortgageRates.length - 1].rate}%` : 'N/A';
    const latestHomePrice = marketData.averageHomePrice?.length > 0 ? `$${marketData.averageHomePrice[marketData.averageHomePrice.length-1].price.toLocaleString()}`: 'N/A';

    const prompt = `
        You are an expert Canadian real estate financial analyst. Your task is to regenerate ONLY the 'personalizedAdvice' portion of a financial report.
        You will be given existing market and location data, and a user's UPDATED financial profile.
        Your new analysis must be consistent with the provided context.

        **Existing Location Analysis Context:**
        - Location: ${userInput.city}
        - Affordability Score: ${locationAnalysis.scores?.affordability?.score}/10
        - Job Market Score: ${locationAnalysis.scores?.jobMarket?.score}/10
        
        **Existing Market Data Context:**
        - Current Mortgage Rate Trend: ${latestMortgageRate}
        - Recent Average Home Price: ${latestHomePrice}

        **User's UPDATED Financial Profile & Pre-Calculated Metrics:**
        - Annual Gross Income: $${userInput.income.toLocaleString()}
        - Target Home Price: $${userInput.targetHomePrice.toLocaleString()}
        - Down Payment Saved: $${userInput.downPayment.toLocaleString()}
        - Existing Monthly Debt Payments: $${userInput.monthlyDebt.toLocaleString()}
        - Credit Score: ${userInput.creditScore}
        - **Calculated Total Debt Service (TDS) Ratio:** ${financials.tdsRatio.toFixed(2)}%
        - **Estimated Monthly Housing Cost (PITH):** $${financials.estimatedMonthlyHousingCost.toFixed(2)}

        **Instructions:**
        1.  Analyze the user's updated financials, especially the new TDS ratio and down payment situation.
        2.  Re-estimate the Total Cost of Ownership.
        3.  Synthesize a new recommendation ('Good Time to Buy', etc.), personal readiness score, summary, pros, cons, and next steps based on the new numbers and the existing context.
        4.  **CRITICAL:** You MUST include the provided 'Estimated Monthly Housing Cost (PITH)' value of ${financials.estimatedMonthlyHousingCost.toFixed(2)} in your response under the 'personalizedAdvice.estimatedMonthlyHousingCost' field.

        **Final Output:**
        Respond ONLY with a single JSON object that conforms to the provided 'personalizedAdvice' schema.
    `;
    
     try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: personalizedAdviceSchema,
            },
        });
        
        // Robustly strip markdown and parse the JSON response.
        let jsonText = (response?.text ?? '').trim();
        const markdownMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (markdownMatch && markdownMatch[1]) {
            jsonText = markdownMatch[1];
        }

        if (!jsonText) {
            throw new Error("AI returned an empty response for the update.");
        }
        
        const parsedAdvice = JSON.parse(jsonText);

        // Sanitize the updated advice to prevent crashes from incomplete data.
        const defaultTotalCostOfOwnership = { estimatedInsurance: 0, estimatedUtilities: 0, estimatedMaintenance: 0, totalMonthlyCost: 0 };
        const sanitizedAdvice: PersonalizedAdvice = {
            recommendation: 'Consider Waiting',
            score: 0,
            summary: 'Could not generate personalized advice.',
            pros: [],
            cons: [],
            nextSteps: [],
            totalCostOfOwnership: { ...defaultTotalCostOfOwnership },
            estimatedMonthlyHousingCost: 0,
            ...(parsedAdvice && typeof parsedAdvice === 'object' ? parsedAdvice : {})
        };
        sanitizedAdvice.totalCostOfOwnership = { ...defaultTotalCostOfOwnership, ...(sanitizedAdvice.totalCostOfOwnership || {}) };
        
        return sanitizedAdvice;
    } catch (error) {
        console.error("Error calling Gemini API for updated advice:", error);
        throw new Error("Failed to get updated analysis from AI service.");
    }
}


export const startChatSession = async (initialAnalysis: AnalysisResult): Promise<Chat> => {
    const ai = getAiClient();
    const chat = ai.chats.create({
        model,
        config: {
            systemInstruction: `You are a helpful AI assistant for a homebuyer. The user has just received the following detailed financial and location analysis. Your role is to answer follow-up questions about this analysis. Base your answers on this context. Do not invent new data.

            **ANALYSIS CONTEXT:**
            ${JSON.stringify(initialAnalysis, null, 2)}
            `
        }
    });
    return chat;
}