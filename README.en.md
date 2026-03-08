# NON EE PR Progress Dashboard

> [中文 README](./README.md)

Fetches data from publicly shared Google Sheets, processes it, and displays a visual dashboard for NON EE category Canadian PR application progress.

**Live site**: [nonee-pr-progress-tracker.vercel.app](https://nonee-pr-progress-tracker.vercel.app)

---

## Features

- **Progress cards**: Latest frontier submission dates for AOR / Final Decision / Portal 1 / Portal 2 / eCOPR / PR Card
- **PR Flowchart**: Embedded interactive flowchart (hover over nodes for descriptions)
- **PR Process Steps**: Community-sourced step-by-step process guide
- **Return Reasons**: Historical return reasons with frequency counts
- **Abbreviation Reference**: Full names for common immigration abbreviations
- **Language toggle**: Switch between Chinese and English — preference is saved automatically

---

## Data Updates

Data is sourced from publicly shared Google Sheets. A GitHub Actions workflow runs automatically every day at **8:00 AM Vancouver time (PST)**, fetches the latest data, commits the result back to the repository, and Vercel redeploys automatically.

You can also trigger a manual run from the [Actions page](https://github.com/frankwang0909/nonee-pr-progress-tracker/actions).

---

## Running Locally

```bash
# Fetch and process data
npm run fetch

# Start local dev server
npm run start
```

Then open `http://localhost:4173`.

---

## Project Structure

```
├── index.html                  # Main page
├── contribute.html             # Data sources page
├── app.js                      # Frontend logic + i18n
├── styles.css                  # Styles
├── scripts/
│   ├── fetch-and-clean.mjs     # Data fetch and processing script
│   └── serve.mjs               # Local dev server
├── data/
│   ├── dashboard-summary.json  # Final output (served as static file)
│   ├── raw/                    # Raw fetched data (gitignored)
│   └── clean/                  # Intermediate processed data (gitignored)
├── .github/workflows/
│   └── daily-fetch.yml         # Daily scheduled fetch Action
└── vercel.json                 # Vercel deployment config
```

---

## Contributing Data

You can add or correct records in the shared Google Sheet for the corresponding month. Click "Contribute Data / View All Sources" on the site to see the full list of data sources.
