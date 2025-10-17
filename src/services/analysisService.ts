
import type { User, AnalysisResult } from '../types';

const ANALYSES_KEY = 'property_scout_analyses';

class AnalysisService {
  private getAnalyses(): Record<string, AnalysisResult[]> {
    const analyses = localStorage.getItem(ANALYSES_KEY);
    return analyses ? JSON.parse(analyses) : {};
  }

  private saveAllAnalyses(allAnalyses: Record<string, AnalysisResult[]>): void {
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(allAnalyses));
  }

  async getAnalysesForUser(user: User): Promise<AnalysisResult[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allAnalyses = this.getAnalyses();
        resolve(allAnalyses[user.email] || []);
      }, 300);
    });
  }

  async saveAnalysis(user: User, analysis: AnalysisResult): Promise<AnalysisResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allAnalyses = this.getAnalyses();
        const userAnalyses = allAnalyses[user.email] || [];
        
        const newAnalysis = {
            ...analysis,
            id: new Date().toISOString(), // Assign a unique ID on save
            savedAt: new Date().toISOString(),
        };

        userAnalyses.unshift(newAnalysis); // Add to the beginning of the list
        allAnalyses[user.email] = userAnalyses;
        this.saveAllAnalyses(allAnalyses);
        resolve(newAnalysis);
      }, 500);
    });
  }
  
  async deleteAnalysis(user: User, analysisId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allAnalyses = this.getAnalyses();
        let userAnalyses = allAnalyses[user.email] || [];
        userAnalyses = userAnalyses.filter(a => a.id !== analysisId);
        allAnalyses[user.email] = userAnalyses;
        this.saveAllAnalyses(allAnalyses);
        resolve();
      }, 300);
    });
  }
}

export const analysisService = new AnalysisService();
