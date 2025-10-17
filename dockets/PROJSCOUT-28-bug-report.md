# Bug Report: #PROJSCOUT-28

**Timestamp:** N/A (Proactively Identified)
**Status:** CLOSED
**Severity:** CRITICAL - Blocker

---

### Title
Critical Error: Firebase SDK Version Conflict Causes "Component auth has not been registered yet"

### Description
The application fails to load immediately upon startup with a fatal error in the browser console: `Uncaught Error: Component auth has not been registered yet`. This error completely blocks the application from rendering and prevents any user interaction. It is a critical blocker for all development.

### Steps to Reproduce
1.  Load the application in a web browser.
2.  Open the developer console.
3.  **Expected Result:** The application's "Hero" screen should render correctly, allowing the user to start an analysis.
4.  **Actual Result:** A blank screen is rendered, and a fatal JavaScript error is thrown in the console, halting all script execution.

### Root Cause Analysis
The root cause is a version mismatch in the Firebase SDKs being imported via the `importmap` in `index.html`. The `firebase/app` and `firebase/auth` modules were correctly pinned to version `^10.12.3`. However, a conflicting generic import for `firebase/` was also present, pointing to a newer, incompatible version (`^12.4.0`). This caused the Firebase `auth` component to be loaded from a different version than the core `app` component it was trying to register with, leading to the initialization failure.

### Resolution
The `index.html` file was modified to resolve the version conflict. The incorrect, generic `firebase/` import was removed. The `firebase/firestore` SDK was then added explicitly, ensuring it was pinned to the same version (`^10.12.3`) as the other modules. This guarantees that all Firebase components loaded by the application are from the same, compatible SDK version, resolving the registration error.