# Contributing

Thanks for helping improve the avoidable-gap portfolio.

## Before changing a case

- Read [docs/METHODOLOGY.md](docs/METHODOLOGY.md).
- Read the relevant entry in [docs/RESEARCH_REGISTER.md](docs/RESEARCH_REGISTER.md).
- Confirm that the source still exists and that its period, units, boundary, and locator are unchanged.

## Research review checklist

- Is the baseline a reported fact or an analyst-derived quantity?
- Does the alternative deliver comparable service under the stated conditions?
- Is the coverage share measured, committed, or only a sensitivity assumption?
- Are existing installations and committed projects excluded from a new-funding claim?
- Are added energy, equipment, leakage, end-of-life, or rebound effects material and visible?
- Is the result a company-scale scenario or a normalized process benchmark?
- Does the formula reproduce the displayed result?

## Code review checklist

```bash
npm install
npm run build
```

Then check the portfolio, all three navigation views, the scale-scenario controls, source links, and the mobile layout. Keep the UI concise: the detail panel should make the evidence easier to inspect, not add more unsupported precision.

## Pull requests

Describe:

1. What changed in the evidence or interface.
2. Which sources and locators support the change.
3. Whether the change affects a company total, a normalized benchmark, or only presentation.
4. The build command and any browser checks performed.
