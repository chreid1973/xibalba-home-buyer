# Bug Report: #PROJSCOUT-36

**Timestamp:** N/A (Proactively Identified)
**Status:** CLOSED
**Severity:** CRITICAL - Blocker

---

### Title
Critical Error: Invalid Firebase API Key Causes "auth/api-key-not-valid"

### Description
The application fails to initialize Firebase services, resulting in a fatal console error: `Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`. This error completely blocks all authentication and data persistence features, rendering the application non-functional for logged-in users.

### Steps to Reproduce
1.  Run the application without replacing the placeholder Firebase credentials in `src/firebaseConfig.ts`.
2.  Open the developer console.
3.  Attempt to sign up or log in.
4.  **Expected Result:** A user session should be created.
5.  **Actual Result:** A fatal JavaScript error is thrown in the console, and the authentication action fails.

### Root Cause Analysis
The root cause is that the `firebaseConfig` object in `src/firebaseConfig.ts` is initialized with placeholder credentials (e.g., `apiKey: "AIzaSyC...your-api-key"`). When the Firebase SDK attempts to use these credentials to connect to Google's services, the authentication request is rejected because the API key is not valid for any real Firebase project. The application did not have a mechanism to check for this state, leading to a crash.

### Resolution
A two-part resolution has been implemented to make the application more robust:
1.  **Configuration Validation:** A check was added to `src/firebaseConfig.ts`. It now inspects the `apiKey` before initializing Firebase. If the key is still a placeholder, it throws a specific, developer-friendly error message.
2.  **Graceful Error Handling:** The main `App.tsx` component now wraps the Firebase initialization logic in a `try...catch` block. If the specific configuration error is caught, it sets an error state and renders a full-screen, user-friendly error message that explains the problem and tells the user exactly how to fix it, preventing a white screen or application crash.
