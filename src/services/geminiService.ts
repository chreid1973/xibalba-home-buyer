import { GoogleGenAI } from "@google/genai";
import { UserInput, AnalysisResult, GroundingChunk } from "../types";

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set.");
}
// Always use `new GoogleGenAI({apiKey: process.env.API_KEY});`.
const ai = new GoogleGenAI({ apiKey });

function createPrompt(input: UserInput): string {
  return `
    Analyze the following real estate investment scenario and provide a detailed breakdown in JSON format.
    The user is considering buying a property and wants to know if it's a good financial decision.

    User's Financial Profile:
    - Annual Income: $${input.annualIncome}
    - Monthly Debts (excluding new mortgage): $${input.monthlyDebts}

    Property Details:
    - Price: $${input.propertyPrice}
    - Location: ${input.propertyLocation}
    - Down Payment: $${input.downPayment}

    Loan Details:
    - Interest Rate: ${input.interestRate}%
    - Loan Term: ${input.loanTerm} years

    Other Considerations:
    - User's Work Location: ${input.workLocation}

    Your analysis must cover the following areas:
    1.  **Verdict**: A clear decision ('good', 'borderline', 'bad'), a summary, and a list of pros and cons.
    2.  **Market Analysis**: Current market trend ('up', 'down', 'stable'), a sentiment score (0-100), and a brief narrative for ${input.propertyLocation}. Use real-time data to inform this.
    3.  **Affordability**: Calculate the monthly mortgage payment, debt-to-income ratio (including the new mortgage), and an overall affordability score (0-100). Provide a narrative explaining the findings.
    4.  **Total Ownership Cost**: Estimate monthly costs including Principal & Interest, Property Tax, Home Insurance, and Maintenance.
    5.  **Break-Even Point**: Estimate how many years it will take to break even on the investment compared to renting.
    6.  **Commute Analysis**: Analyze the commute from ${input.propertyLocation} to ${input.workLocation}.
    7.  **Location Score**: Provide scores (0-10) for schools, crime, and amenities in ${input.propertyLocation} and an overall score.

    Provide the output strictly as a JSON object. Do not include any markdown formatting like \`\`\`json or any other text outside the JSON object.
    `;
}

export async function getAnalysis(
  input: UserInput
): Promise<{ analysis: AnalysisResult; citations: GroundingChunk[] }> {
  try {
    const prompt = createPrompt(input);

    // Using `ai.models.generateContent` as per guidelines for a complex text task.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        // Using googleSearch tool for up-to-date information as per guidelines.
        tools: [{ googleSearch: {} }],
      },
    });

    // Per guidelines, when using `googleSearch`, the response must be parsed from text.
    // Correct way to get text, as per guidelines
    const text = response.text;
    let analysis: AnalysisResult;
    try {
        // The model can sometimes wrap the JSON in markdown, so we clean it.
        const cleanedText = text.replace(/^```json\s*|```\s*$/g, '').trim();
        analysis = JSON.parse(cleanedText);
    } catch(e) {
        console.error("Failed to parse Gemini response as JSON:", text);
        throw new Error("The model returned an invalid data format. Please try again.");
    }
    
    // As per guidelines, extract URLs from groundingChunks
    const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { analysis, citations };

  } catch (error) {
    console.error("Error fetching analysis from Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided API key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to get analysis from Gemini.");
  }
}
