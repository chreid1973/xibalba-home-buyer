# Live Backend Architecture Plan

**Docket:** #PROJSCOUT-24
**Type:** #blocker-spike Artifact
**Status:** COMPLETE

---

## 1. Overview

This document provides the complete architectural blueprint for migrating the Property Scout application from its current prototype state (using `localStorage` for persistence) to a scalable, production-ready live backend.

The chosen technology stack is **Google Firebase**, which provides two key services:
1.  **Firebase Authentication:** For secure user management.
2.  **Cloud Firestore:** For a scalable, real-time NoSQL database.

This migration is the primary task of the **`v4.0: Live Platform Infrastructure`** epic.

---

## 2. Component 1: User Authentication

### 2.1. Technology: Firebase Authentication

We will replace our simulated `authService` with Firebase Authentication.

- **Why:** It is an industry-standard, secure, and highly scalable solution that handles all the complexities of user management (sign-up, login, password reset, session management) out of the box. Its integration is straightforward via the Firebase Web SDK.

### 2.2. Implementation Plan

The `src/services/authService.ts` file will be refactored to interact with the Firebase SDK.

**Required Changes:**

1.  **Initialization:** The service will initialize the Firebase app with project credentials (to be stored in a `.env` file).
2.  **`signup(email, password)`:** This method will be rewritten to call `createUserWithEmailAndPassword(auth, email, password)`.
3.  **`login(email, password)`:** This method will be rewritten to call `signInWithEmailAndPassword(auth, email, password)`.
4.  **`logout()`:** This method will call `signOut(auth)`.
5.  **`getCurrentUser()`:** This will be replaced by an auth state listener, `onAuthStateChanged(auth, user => ...)`. The `App.tsx` component will use this listener to get the real-time authentication state, which is a more robust pattern than our current `useEffect` check.

---

## 3. Component 2: Data Persistence

### 3.1. Technology: Cloud Firestore

We will replace our simulated `analysisService` with Cloud Firestore.

- **Why:** Firestore is a highly scalable NoSQL database with a powerful security model and real-time capabilities. Its security rules allow us to easily enforce a critical requirement: users can only access their own data.

### 3.2. Database Schema

Our data will be structured in a top-level `users` collection.

```
/users/{userId}/analyses/{analysisId}
```

- **`users` (Collection):** Each document in this collection represents a user. The document ID will be the `uid` provided by Firebase Authentication.
  - `{userId}` (Document):
    - `email`: The user's email address.
    - `createdAt`: Timestamp of account creation.
    - **`analyses` (Sub-collection):** Each document in this sub-collection represents a saved analysis belonging to that user.
      - `{analysisId}` (Document):
        - Contains all the fields from our `AnalysisResult` type (e.g., `userInput`, `readinessScore`, `savedAt`, etc.).

### 3.3. Firestore Security Rules

The following security rules will be deployed to our Firestore instance. They are the cornerstone of our data security model.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read and write to their own user document.
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Users can only read, create, and delete their own analyses.
      match /analyses/{analysisId} {
        allow read, create, delete: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 3.4. Implementation Plan

The `src/services/analysisService.ts` file will be refactored to interact with the Firestore SDK.

**Required Changes:**

1.  **`getAnalysesForUser(user)`:** This method will be rewritten to query the `/users/{user.uid}/analyses` collection and return the documents, ordered by `savedAt` descending.
2.  **`saveAnalysis(user, analysis)`:** This method will call `addDoc()` to create a new document in the `/users/{user.uid}/analyses` sub-collection.
3.  **`deleteAnalysis(user, analysisId)`:** This method will call `deleteDoc()` on the specific document reference in the user's `analyses` sub-collection.
