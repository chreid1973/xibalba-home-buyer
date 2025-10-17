# Cary's Foundational Frame (CFF) Protocol

**Version:** 1.2.0
**Status:** ACTIVE
**Trigger Hashtag:** `#caryff`

---

## Core Principle
**"#lift_from_the_bottom to #build_the_top."** This principle mandates that all work must be built upon a foundation of clear planning and validation before execution begins.

## The Simulated SDLC Phases

Our workflow is a hybrid of waterfall planning and agile execution, divided into four distinct phases.

### Phase 1: High-Level Planning (Waterfall)
- **Objective:** Define the long-term project vision.
- **Artifact:** `ROADMAP.md`
- **Process:** We collaboratively define and update the major epics for the project in the roadmap document.

### Phase 2: Sprint Planning & Validation
- **Objective:** Ensure every task is fully understood and planned before any code is written. **This is a mandatory gate.**
- **Process:**
  1.  A new task is initiated with a formal **Docket** (e.g., `#PROJSCOUT-12`).
  2.  My first response will be a **"Plan of Action"**. This plan will detail my interpretation of the requirements, proposed file changes, and an impact analysis.
  3.  The plan may contain **"Prompt Bugs"** (clarifying questions) if the docket is ambiguous.
  4.  **I will not proceed to Phase 3 until you provide explicit approval of the plan.**

### Phase 3: Sprint Execution (Agile)
- **Objective:** Implement the validated plan with speed, precision, and comprehensive documentation.
- **Process:** Upon receiving your approval, I will execute the plan and deliver the following in a single response:
  1.  **The Code Implementation:** Delivered in the standard `<changes>` XML block.
  2.  **The Bug Report (`.md`):** If the docket was a `#bug`, a formal report is created in `dockets/`, complete with "fractal linking" to related artifacts.
  3.  **The QA Report (`.qa.md`):** For any code change, a QA report is created in `dockets/`, including a confidence level and validation against our `dockets/STANDARDS.md`.

### Phase 4: Project Evolution & Automation
- **Objective:** Leverage our structured history to enable advanced capabilities like automated production of similar ("white-label") products.
- **Process:** Our rich, interconnected set of artifacts serves as a blueprint for future projects, allowing for rapid, template-based development.

## Hashtag Glossary

- **`#caryff`**: Invokes this entire protocol.
- **`#nochange`**: For discussion only; no code will be changed.
- **`#checkpoint [desc]`**: Saves the current state of all files.
- **`#delete [file_path]`**: Deletes a file.

## Docket Types
- **`#feature`**: A request for a new capability.
- **`#bug`**: A report of something working incorrectly.
- **`#refactor`**: A request for non-functional code improvements.
- **`#ui`**: A request focused purely on visual design changes.
- **`#spike`**: A task to resolve uncertainty. Must be sub-categorized:
    - **`#research-spike`**: A time-boxed task to investigate a problem and produce a research document or proof-of-concept. Does not stop other sprint work.
    - **`#blocker-spike`**: A critical issue that halts all other sprint work until it is resolved.
