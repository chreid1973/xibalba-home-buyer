import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';
import type { AnalysisResult } from '../types';

const getAnalysesCollection = (userId: string) => collection(db, 'users', userId, 'analyses');

export const saveAnalysis = async (userId: string, analysis: Omit<AnalysisResult, 'id' | 'savedAt'>): Promise<AnalysisResult> => {
  const docRef = await addDoc(getAnalysesCollection(userId), {
      ...analysis,
      savedAt: serverTimestamp()
  });
  return { ...analysis, id: docRef.id, savedAt: new Date().toISOString() };
};

export const getSavedAnalyses = async (userId: string): Promise<AnalysisResult[]> => {
    const q = query(getAnalysesCollection(userId), orderBy('savedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const savedAtTimestamp = data.savedAt as Timestamp;
        return {
            ...data,
            id: doc.id,
            savedAt: savedAtTimestamp?.toDate ? savedAtTimestamp.toDate().toISOString() : new Date().toISOString(),
        } as AnalysisResult;
    });
};

export const deleteAnalysis = async (userId: string, analysisId: string): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'analyses', analysisId);
  await deleteDoc(docRef);
};
