# Bug Report: #PROJSCOUT-31

**Timestamp:** N/A (Proactively Identified)
**Status:** CLOSED
**Severity:** Medium

---

### Title
Incorrect Data Coupling: Analysis Generation includes Persistence-Specific Fields

### Description
The `getAIAnalysis` function in `geminiService.ts` was incorrectly adding placeholder fields (`id: ''`, `savedAt: ''`) to the `AnalysisResult` object it created. These fields are specific to data persistence and should not be present on a newly generated, unsaved analysis.

### Steps to Reproduce
1.  Generate a new analysis.
2.  Inspect the `analysisResult` object in the application's state before it is saved.
3.  **Expected Result:** The object should conform to the `AnalysisResult` type but should not contain `id` or `savedAt` properties.
4.  **Actual Result:** The object contains `id` and `savedAt` properties with empty string values. This violates the principle of separation of concerns and leads to a confusing data model where it's difficult to distinguish a new analysis from a saved one.

### Root Cause Analysis
The logic in `geminiService.ts` was adding the placeholder fields to satisfy a previously strict `AnalysisResult` type definition. This mixed the concerns of the AI generation service with those of the data persistence service.

### Resolution
The `getAIAnalysis` function has been refactored to no longer add the `id` and `savedAt` fields. The `AnalysisResult` type definition in `src/types.ts` has been updated to make these fields optional (`id?: string`, `savedAt?: string`). The `analysisService` is now solely responsible for managing these fields when an analysis is saved to the database. This correctly decouples the two services and clarifies the data model.