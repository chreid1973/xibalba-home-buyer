# Bug Report: #PROJSCOUT-40

**Timestamp:** N/A (Proactively Identified)
**Status:** CLOSED
**Severity:** CRITICAL - Blocker

---

### Title
Critical Error: Invalid or Placeholder Firebase API Key Causes Fatal Application Crash

### Description
The application fails to load or function correctly if the Firebase credentials in `src/firebaseConfig.ts` are invalid, placeholders, or if the Firebase backend is unreachable. The application crashes with errors like `auth/invalid-api-key` or `app-compat/no-app`, rendering it completely unusable. This represents a critical single point of failure.

### Steps to Reproduce
1.  Run the application with placeholder or invalid Firebase credentials in `src/firebaseConfig.ts`.
2.  Load the application in a browser.
3.  **Expected Result:** The application should either load with a clear error message or remain functional in an offline/simulated mode.
4.  **Actual Result:** The application crashes with a fatal JavaScript error in the console, resulting in a blank or broken UI.

### Root Cause Analysis
The root cause is a fragile initialization architecture. The application's core services directly attempted to connect to Firebase on startup. When this connection failed, the error was unhandled in a way that would allow the application to continue, causing a full system crash. The application had no fallback mechanism and was entirely dependent on a perfect external configuration.

### Resolution
A comprehensive "Dual-Mode" architecture has been implemented to make the application resilient and antifragile.
1.  **Resilient Initialization:** The `firebaseConfig.ts` file now wraps the Firebase initialization in a `try...catch` block. It exports a boolean flag, `isFirebaseConnected`, to indicate the outcome without crashing the app.
2.  **Dual-Mode Services:** Both `authService.ts` and `analysisService.ts` have been re-architected. They now contain two complete implementations: one for the live Firebase SDK and a second that uses `localStorage` as a fallback simulation.
3.  **Conditional Export:** Based on the `isFirebaseConnected` flag, the services conditionally export the appropriate implementation. If Firebase is live, the app uses the live services. If it fails, the app seamlessly falls back to the simulation services.

This ensures a functional user experience under all configuration scenarios, which is a core requirement for a "#100s" product. The application no longer crashes due to this issue.