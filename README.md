# Immigration Docs Assistant

Your friendly, plain-language guide to understanding U.S. visa documents and getting things done.

## Overview

International students and immigrants often struggle with complex, legalistic English instructions from USCIS, schools, or government bodies. Misunderstanding a deadline or requirement can lead to serious visa status issues.

**Immigration Docs Assistant** solves this by using advanced AI to:
1.  **Translate & Simplify:** Turn dense legalese into plain Korean (and simple English).
2.  **Actionable Checklists:** Extract concrete "To-Do" items so you know exactly what to step is next.
3.  **Safety First:** Highlight key terms and remind users to check official sources, without pretending to be a lawyer.

This tool is designed primarily for **F-1 International Students** (Pre-arrival, Current, OPT) but is built to scale for other visa types.

## Features

*   **Plain-Language Explanations:** Instantly summarizes emails and PDF text into easy-to-read Korean bullets and simple English notes.
*   **Smart Checklist Generation:** Automatically creates a structured list of tasks (e.g., "File I-765", "Contact DSO") that you can check off.
*   **Interactive Workspace:** Toggle items as "To Do", "In Progress", or "Done".
*   **Safety & Resources Panel:** defines difficult terms (e.g., "Grace Period", "RFE") and links to official .gov resources.
*   **Privacy-Conscious:** No database storage of your text; data is processed in-session only.

## How it Works

1.  **Select Context:** The user selects their situation (e.g., "F-1 OPT Application").
2.  **Input:** The user pastes the text of an email or document (ensuring no sensitive PII is included).
3.  **AI Analysis:** The app sends the text to **Gemini 3 Pro** (via Google GenAI SDK) with a strict system prompt to explain, categorize, and extract tasks securely.
4.  **Structured Output:** Gemini returns a JSON object containing the summary, checklist items, and safety terms, which the React frontend renders into an interactive UI.

## Tech Stack

*   **Frontend:** React 19 (via CDN imports), Tailwind CSS, Lucide React icons.
*   **AI Model:** Google Gemini 3 Pro (via `@google/genai` SDK).
*   **Build/Run Environment:** Google AI Studio Vibe Coding (Standard HTML/JS/CSS module structure).
*   **Language:** TypeScript.

## Getting Started

### Prerequisites
*   A Google Cloud Project with the **Gemini API** enabled.
*   An API Key from Google AI Studio.

### Running Locally / in Vibe Coding
1.  Ensure your environment has the `API_KEY` environment variable set.
2.  The application uses standard ES modules and React via CDN, so no complex build step (like Webpack/Vite) is strictly required for the Vibe environment, though it mimics a React project structure.
3.  Open `index.html` via a local server or the Vibe Coding preview to see the app.

## Project Structure

*   `App.tsx`: Main application controller (Routing between Landing and Workspace).
*   `components/`: UI building blocks.
    *   `LandingScreen.tsx`: The welcoming entry page.
    *   `WorkspaceScreen.tsx`: The main split-view for analysis.
    *   `InputSection.tsx`: Text area for pasting documents.
    *   `ExplanationPanel.tsx`: Renders the AI summary.
    *   `ChecklistPanel.tsx`: Renders the interactive to-do list.
    *   `SafetyPanel.tsx`: Shows glossary and official links.
*   `services/geminiService.ts`: Handles communication with the Google GenAI SDK.
*   `types.ts`: TypeScript interfaces for the application state and data models.
*   `data/`: Static data (e.g., sample text).

## Safety and Limitations

*   **NOT LEGAL ADVICE:** This tool is for educational purposes only. It is not a substitute for a qualified immigration attorney.
*   **Official Sources:** Always verify critical dates and forms with [USCIS.gov](https://www.uscis.gov) or your school's International Student Office (DSO).
*   **AI Limitations:** While Gemini 3 Pro is powerful, it can occasionally misinterpret ambiguous text. The app encourages "conservative" interpretation and warns users about uncertainties.
*   **Data Privacy:** Do not paste full Social Security Numbers, Passport Numbers, or A-Numbers into the tool.

## Roadmap / Future Work

*   **Multi-language Support:** Add support for Chinese, Hindi, and Spanish.
*   **PDF Upload:** Allow direct PDF parsing instead of copy-pasting text.
*   **Timeline View:** Visualize deadlines on a calendar.
*   **More Visa Types:** Support H-1B, J-1, and O-1 visa contexts.

## License

MIT License. See repository for details.
