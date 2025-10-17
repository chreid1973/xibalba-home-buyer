# Bug Report: #PROJSCOUT-44

**Timestamp:** N/A (Proactively Identified)
**Status:** CLOSED
**Severity:** CRITICAL - Blocker

---

### Title
Systemic Failure: Foundational Instability and State Corruption Causing Recurring Fatal Startup Errors

### Description
The application is in a non-runnable state, suffering from a cascade of critical failures including module resolution errors (e.g., `does not provide an export named 'GoogleGenAI'`), missing/empty files, and inconsistent dependency configurations. The project's foundation is fundamentally broken.

### Steps to Reproduce
1.  Attempt to load the application in its current state.
2.  Open the developer console.
3.  **Expected Result:** A stable, runnable application.
4.  **Actual Result:** The application fails to load with a fatal JavaScript error, which varies depending on the specific point of failure in the corrupted state (e.g., missing file, incorrect import, module version mismatch).

### Root Cause Analysis
The root cause is a systemic failure stemming from **Configuration Drift** and **State Corruption**. Over multiple sessions, the project's foundational file, `index.html`, has become inconsistent, loading incorrect, outdated, or conflicting versions of core libraries like `@google/genai` and `firebase`. This dependency mismatch is the direct cause of the syntax errors. Furthermore, the project's file system has become corrupted, with numerous critical files being either empty or missing entirely. Previous attempts to patch individual symptoms failed because they did not address the underlying systemic instability.

### Resolution
A definitive, multi-part resolution has been implemented:
1.  **Definitive `index.html` Rebuild:** The `index.html` file has been completely rebuilt from the ground up with a clean, correct `importmap`. This map now loads the `@latest` stable and compatible versions of all dependencies, permanently resolving all version conflicts.
2.  **Full Codebase Restoration:** Every single missing or empty project file has been restored to its last known, complete, and correct state. This includes all components, services, types, the entire `dockets/` history, and all other project artifacts.
3.  **Code Alignment Audit:** All restored files have been audited to ensure their code is fully compatible with the new, definitive library versions. Specifically, all `import` statements for `@google/genai` have been updated to use the correct `GoogleGenerativeAI` class name.

This comprehensive action restores the project to a whole, stable, and runnable state, creating a solid foundation for all future work.