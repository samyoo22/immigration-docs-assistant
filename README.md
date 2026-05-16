# VisaTodo

[www.visatodo.com](https://www.visatodo.com)

VisaTodo is a friendly, plain-language workspace that turns confusing immigration and visa paperwork into clear summaries, tasks, and deadlines.

## What It Does

International students, immigrants, and visa applicants often receive long emails, notices, and instructions full of legal or bureaucratic language. VisaTodo helps users understand what matters, what to do next, and what deadlines to watch.

Core flow:

1.  Upload or paste a visa-related document.
2.  Get a plain-language explanation.
3.  Review key dates and required actions.
4.  Save action items into a visa to-do list.
5.  Track progress and important deadlines.

VisaTodo is not a law firm and does not provide legal advice. It helps users understand documents, organize tasks, and prepare better questions for qualified professionals.

## Features

*   **Document Explainer:** Upload or paste visa-related instructions and get a plain-language summary.
*   **Smart To-Do List:** Turn confusing requirements into clear tasks, statuses, priorities, and reminders.
*   **Visa Path Dashboard:** Track the current visa situation, upcoming tasks, recent documents, and important deadlines.
*   **Questions & Resources:** Prepare questions for a DSO, attorney, employer, or school official, with links to official resources.
*   **Privacy-Conscious Input:** Reminds users not to paste passport numbers, SSNs, SEVIS IDs, or other highly sensitive details.

## Domain Setup

The production domain is:

```txt
https://www.visatodo.com
```

This repo includes:

*   `public/CNAME` for GitHub Pages custom domain support.
*   `public/robots.txt` with the production sitemap URL.
*   `public/sitemap.xml` pointing to `https://www.visatodo.com/`.
*   `index.html` canonical, Open Graph, Twitter, description, and theme metadata for `www.visatodo.com`.

For DNS, point `www.visatodo.com` to the hosting provider used for the deployed app. If using GitHub Pages, configure the custom domain in repository Pages settings and set the DNS CNAME record for `www` to the GitHub Pages target.

## Tech Stack

*   **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons.
*   **AI:** OpenAI Responses API via serverless functions.
*   **PDF Text Extraction:** `pdfjs-dist`.

## Running Locally

1.  Install dependencies:

```bash
npm install
```

2.  Add an OpenAI API key to the local environment. Copy the example file:

```bash
cp .env.example .env
```

Then edit `.env`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

3.  Start the dev server:

```bash
npm run dev
```

4.  Build for production:

```bash
npm run build
```

## API Key Configuration

The browser app does not call OpenAI directly. It calls local/serverless endpoints under `/api/*`, and those server-side handlers read `OPENAI_API_KEY`.

For local development, use `.env`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

For deployment, add these environment variables in your hosting provider:

```txt
OPENAI_API_KEY
OPENAI_MODEL
```

`OPENAI_MODEL` is optional and defaults to `gpt-4.1-mini`.

The API key should only exist in server or hosting environment variables. Do not expose it with a `VITE_` prefix or place it in client-side code.

## Deployment Note

The `/api/*` endpoints use Vercel-style serverless functions in the `api/` directory. Static-only hosting such as GitHub Pages will serve the frontend, but it will not run the AI API routes. For the OpenAI-backed version, deploy to a host that supports serverless functions, such as Vercel, or adapt the handlers to your backend provider.

## Safety

*   **Not legal advice:** VisaTodo is educational and organizational software, not a substitute for a qualified immigration attorney.
*   **Verify official sources:** Confirm critical deadlines and forms with [USCIS.gov](https://www.uscis.gov), a school DSO, an employer contact, or another qualified professional.
*   **AI limitations:** AI-generated summaries may miss context or misunderstand ambiguous documents.
*   **Sensitive data:** Do not paste full SSNs, passport numbers, SEVIS IDs, A-Numbers, or other highly sensitive identifiers.
