import type { User, AnalysisResult } from '../types';
import { db } from '../firebaseConfig';
// Fix: Update Firebase imports to v8 namespaced API.
import firebase from 'firebase/app';
import 'firebase/firestore';

class AnalysisService {
  
  private getAnalysesCollectionRef(user: User) {
      // Fix: Use v8 chained method for collection reference.
      return db.collection('users').doc(user.uid).collection('analyses');
  }

  async getAnalysesForUser(user: User): Promise<AnalysisResult[]> {
    const analysesCol = this.getAnalysesCollectionRef(user);
    // Fix: Use v8 chained method for query and .get() to fetch.
    const q = analysesCol.orderBy('savedAt', 'desc');
    const querySnapshot = await q.get();
    
    const analyses: AnalysisResult[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        analyses.push({
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to ISO string for consistency
            savedAt: data.savedAt?.toDate().toISOString() || new Date().toISOString(),
        } as AnalysisResult);
    });
    return analyses;
  }

  async saveAnalysis(user: User, analysis: Omit<AnalysisResult, 'id' | 'savedAt'>): Promise<AnalysisResult> {
    const analysesCol = this.getAnalysesCollectionRef(user);
    
    const docToSave = {
        ...analysis,
        // Fix: Use v8 FieldValue for serverTimestamp.
        savedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    
    // Fix: Use v8 .add() method to save document.
    const docRef = await analysesCol.add(docToSave);

    // Return the saved analysis with its new ID
    return {
        ...analysis,
        id: docRef.id,
        savedAt: new Date().toISOString(), // Use client-side date for immediate feedback
    };
  }
  
  async deleteAnalysis(user: User, analysisId: string): Promise<void> {
    // Fix: Use v8 chained methods to get doc reference.
    const docRef = db.collection('users').doc(user.uid).collection('analyses').doc(analysisId);
    // Fix: Use v8 .delete() method.
    await docRef.delete();
  }
}

export const analysisService = new AnalysisService();
