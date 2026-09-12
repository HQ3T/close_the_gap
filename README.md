# The avoidable gap

An evidence-led Next.js prototype for presenting potentially preventable CO₂e emissions as a focused impact portfolio.

> What environmental burden is associated with a company, what available technology could reduce it while delivering the same service, and what would need to be proven before funding it?

## What is in the prototype

The app presents five S&P 500 company cases in a compact portfolio:

| Evidence state | Companies | What the number means |
| --- | --- | --- |
| Scale scenario | Walmart, ExxonMobil | A reported source is combined with an explicit eligible-and-converted coverage assumption. |
| Benchmark block | Microsoft, UPS, Delta Air Lines | A matched external study quantifies a process gap, but public data does not support a company-wide denominator. |

Each case keeps six things together: the existing burden, the alternative technology, the quantified gap, the formula, the accounting boundary, and the next evidence request. Source links are shown directly in the case detail panel.

This is a research and investment-sourcing prototype, not an ESG ranking, an emissions audit, a forecast, or an investment recommendation. Normalized benchmark blocks must not be added to company totals.

## Run locally

Requirements: Node.js 18.18+ (Node 20+ recommended).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm run start
```

The app is Vercel-ready and has no API keys or server-side data dependencies. Deploy the project root as a standard Next.js application. No Vercel project or automatic GitHub-to-Vercel integration is configured in this repository.

## Project structure

```text
app/
  page.js        # UI, case data, calculations and interactions
  globals.css    # visual system and responsive layout
  layout.js      # metadata and root layout
docs/
  METHODOLOGY.md       # definitions, formula and guardrails
  RESEARCH_REGISTER.md # source register and case-level calculation notes
next.config.mjs
package.json
```

## Research and data provenance

The case inputs and source locators are based on the public evidence reviewed in the provided reference project and its audited research dossiers. The snapshot date shown in the UI is 13 September 2026. Source availability, company disclosures, and index membership should be re-checked before publication or investment use.

The primary evidence types are:

- Company sustainability and emissions disclosures for the baseline.
- Government or peer-reviewed research for the technology comparison.
- Explicit analyst assumptions for eligible-and-converted coverage.

The full rationale is in [docs/RESEARCH_REGISTER.md](docs/RESEARCH_REGISTER.md). The method and limitations are in [docs/METHODOLOGY.md](docs/METHODOLOGY.md).

## Collaboration workflow

1. Start with the research register and methodology note.
2. Change one case’s facts, formula, or boundary at a time.
3. Preserve source URLs and page/table locators when updating evidence.
4. Run `npm run build` before opening a pull request.
5. Keep technology potential, financing additionality, and repayment cashflow as separate claims.

See [CONTRIBUTING.md](CONTRIBUTING.md) for a short review checklist.
