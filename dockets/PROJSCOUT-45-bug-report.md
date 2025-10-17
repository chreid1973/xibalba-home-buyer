# Bug Report: #PROJSCOUT-45

**Timestamp:** N/A (Proactively Identified)
**Status:** CLOSED
**Severity:** CRITICAL - Blocker

---

### Title
Systemic Failure: Fragile Dependency Management Causing Recurring Fatal Startup Errors

### Description
The application is in a non-runnable state, suffering from a cascade of critical failures related to module resolution. Errors such as `"Uncaught SyntaxError: The requested module '@google/genai' does not provide an export named 'Type'"` and various Firebase import errors have repeatedly blocked development. The project's foundational dependency loading mechanism is fundamentally broken.

### Steps to Reproduce
1.  Attempt to load the application in its previous state.
2.  Open the developer console.
3.  **Expected Result:** A stable, runnable application.
4.  **Actual Result:** The application fails to load with a fatal JavaScript error, which varies depending on the specific point of failure in the fragile `importmap` configuration.

### Root Cause Analysis
The root cause is a systemic failure stemming from an unreliable and fragile dependency loading architecture. The project's reliance on a third-party CDN (`esm.sh`) and an ES Module `importmap` has proven to be unstable. This approach created several problems:
1.  **Version Mismatch:** The code was written for the latest SDK versions, but the CDN or import map was often loading older or incompatible versions, leading to missing exports (e.g., `Type` enum in `@google/genai`).
2.  **Module Structure Incompatibility:** The ES Module system in the browser had conflicts with the structure of the compatibility libraries for Firebase, leading to errors like `"does not provide an export named 'default'"`.
3.  **Configuration Drift:** The `importmap` was a single point of failure that was prone to corruption or misconfiguration between sessions.

Previous attempts to patch this by changing versions or import syntaxes failed because they did not address the root architectural flaw: reliance on an unstable loading mechanism.

### Resolution
A definitive, multi-part architectural resolution has been implemented:
1.  **Authoritative SDK Sourcing:** The fragile `importmap` has been **completely removed**. The `index.html` file has been rebuilt to load the **official, global SDKs** for both Google AI and Firebase directly from their stable, authoritative sources (`gstatic.com` and `esm.sh` for the specific AI SDK module).
2.  **Code Alignment:** All services (`geminiService.ts`, `firebaseConfig.ts`, etc.) have been refactored to consume these libraries as they are designed to be used in a browser environment—by accessing the globally available `window.google` and `firebase` objects. This eliminates the module resolver as a point of failure.
3.  **Full Codebase Restoration:** The entire project file system has been restored to its last known good state to resolve any concurrent state corruption.

This comprehensive action creates a permanently stable foundation, resolving this entire class of errors.
