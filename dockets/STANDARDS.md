# Property Scout: Project Standards & Practices (v1.1.0)

This document contains the official policies and procedures for the Property Scout project, as defined within Cary's Foundational Frame. All code changes will be validated against these standards.

---

### Principle of Proactive Intelligence (AIX)
This principle defines our unique advantage: the deep integration of a powerful AI with the user interface. Our goal is to create an experience that feels like a conversation with a trusted expert.

1.  **AIX-01: The Principle of Anticipation.** The application must not only answer the user's explicit question but also anticipate their *next logical question* and provide clear pathways to explore it.
2.  **AIX-02: The Principle of Just-in-Time Context.** The AI must never present data without context. Every key number or verdict must be immediately followed by a concise, human-readable insight that answers "So what does this mean for me?"

### Principle of Delightful Interaction (UIX)
This principle governs our philosophy for user interface design, moving our goal from merely "functional" to "delightful and intuitive."

1.  **UIX-01: The Principle of Meaningful Motion.** Animations must have a purpose beyond aesthetics. They must guide the user's attention, provide feedback on an action, or reveal information gracefully. Gratuitous, distracting animations are a violation.
2.  **UIX-02: The Principle of Tactile Feedback.** Interactive elements should provide subtle, satisfying visual or state feedback on hover, click, and focus. The application should feel "alive" and responsive to the user's presence.

### UI & UX Policies

1.  **ICON-01: No Emoticons:** All user-facing icons must be professional SVG components. Emoticons are strictly prohibited.
2.  **UX-01: Interactive Tooltips:** All non-obvious interactive elements, charts, or data points must have an accompanying `InfoTooltip` or `Citation` component to ensure user clarity.
3.  **UX-02: Dynamic Loading States:** All data-loading states must use an active, dynamic animation (e.g., "Live Data Feed"). Static spinners or skeletons that appear "stalled" are not permitted.
4.  **UI-01: Adherence to "Futuristic Aurora" Theme:** All new components must conform to the established color palette, typography, and design language of the "Futuristic Aurora" theme.

### Code Architecture Policies

1.  **ARC-01: Type Safety:** All new components must use TypeScript and have clearly defined `Props` and `State` interfaces. The `any` type should be avoided wherever possible.
2.  **ARC-02: Centralized Services:** All external API calls must be managed through the `src/services/` directory. Components should not make direct API calls.
3.  **ARC-03: Code Commenting for Automation:** Proactive comments (`// REFACTOR:`, `// TODO:`) should be used to flag opportunities for future dockets.