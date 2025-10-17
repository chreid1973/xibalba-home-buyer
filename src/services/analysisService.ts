import { db, serverTimestamp } from '../firebaseConfig';
import type { AnalysisResult } from '../types';

const saveAnalysis = async (userId: string, analysis: Omit<AnalysisResult, 'id' | 'savedAt'>): Promise<string> => {
  const docRef = await db.collection('users').doc(userId).collection('analyses').add({
    ...analysis,
    savedAt: serverTimestamp(),
  });
  return docRef.id;
};

const getAnalyses = async (userId: string): Promise<AnalysisResult[]> => {
  const snapshot = await db.collection('users').doc(userId).collection('analyses').orderBy('savedAt', 'desc').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    // Ensure savedAt is converted to a string format if it exists
    const savedAt = data.savedAt?.toDate ? data.savedAt.toDate().toISOString() : new Date().toISOString();
    return {
      ...(data as Omit<AnalysisResult, 'id' | 'savedAt'>),
      id: doc.id,
      savedAt: savedAt,
    };
  });
};


const deleteAnalysis = async (userId: string, analysisId: string): Promise<void> => {
  if (!userId || !analysisId) {
    throw new Error("User ID and Analysis ID are required to delete.");
  }
  await db.collection('users').doc(userId).collection('analyses').doc(analysisId).delete();
};

export const analysisService = {
  saveAnalysis,
  getAnalyses,
  deleteAnalysis,
};
