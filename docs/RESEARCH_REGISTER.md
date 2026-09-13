# Research register

Snapshot: **13 September 2026**. The entries below are the compact source-to-number register for the five cases shown in the app.

## Portfolio overview

| Company | Existing case | Alternative | Avoidable CO₂e/year | Status |
| --- | --- | --- | --- | --- |
| Walmart (WMT) | 4.08m tCO₂e/year onsite refrigerants | Lower-impact CO₂ refrigeration | 2.04m tCO₂e/year at 50% source coverage | Conditional scale scenario |
| ExxonMobil (XOM) | ≈203k tCO₂e/year inferred tank methane source pool | Vapor recovery units | 87.6k tCO₂e/year at 50% eligible coverage | Conditional scale scenario |
| Microsoft (MSFT) | 1,000 matched baseline lifecycle tonnes | Direct-to-chip cold plates | Pending — company cooling-service denominator needed | Evidence queue |
| UPS (UPS) | 1,414.93 gCO₂e/mile diesel benchmark | Battery-electric delivery trucks | Pending — route-matched annual miles needed | Evidence queue |
| Delta Air Lines (DAL) | 1,000 matched gate lifecycle tonnes | Electric ground power + preconditioned air | Pending — eligible annual gate throughput needed | Evidence queue |

Only the Walmart and ExxonMobil rows currently qualify for the comparable annual ranking. The other three retain their normalized study signals in the app so they can guide diligence without being mistaken for company-scale annual opportunities.

## Walmart — refrigerant leakage

**Baseline.** Walmart reports 4.08 million tCO₂e of onsite refrigerant emissions in FY2026.

**Technology evidence.** The DOE/Navigant paired-supermarket study reports 191 tCO₂e versus 0.1 tCO₂e of direct refrigerant impact at equal leaked mass when comparing HFC and CO₂ systems. That is a direct refrigerant comparison, not a measured Walmart fleet factor; the study’s whole-store result is materially different.

**Calculation.**

```text
4,080,000 × eligible-and-converted share × (1 − 0.1 ÷ 191)
```

At 50% coverage: approximately 2.04m tCO₂e/year. The direct result excludes energy, equipment manufacture, and other lifecycle effects.

**Sources.** [Walmart ESG Report, p. 31](https://corporate.walmart.com/content/dam/corporate/documents/esgreport/2026/FY2026-Walmart-ESG-Report.pdf) · [DOE/Navigant supermarket study, pp. 19–20](https://www.energy.gov/sites/prod/files/2015/02/f19/Hannaford%20Study%20Report%201-22-2015_CLEAN.pdf)

## ExxonMobil — upstream tank methane

**Baseline.** The source pool is derived from 142,000 tonnes CH₄ reported by ExxonMobil, multiplied by the reported 96% upstream and 5% tank shares: approximately 6,816 tonnes CH₄. Applying methane GWP100 of 29.8 gives approximately 203,117 tCO₂e before intervention.

**Technology evidence.** EPA guidance gives a 95% control factor for suitable vapor-recovery sources. Recovered methane is assumed to be burned, so 2.75 tCO₂ is subtracted per tonne CH₄ recovered rather than treating recovery as zero-emission.

**Calculation.**

```text
(142,000 × 96% × 5%) × eligible share × 95% × (29.8 − 2.75)
```

At 50% coverage: approximately 87,600 tCO₂e/year. Compression power, downstream leakage, and other lifecycle effects are excluded.

**Sources.** [ExxonMobil Metrics & Data, 2025 table](https://corporate.exxonmobil.com/publications/metrics-and-data) · [US EPA Vapor Recovery Units](https://www.epa.gov/natural-gas-star-program/vapor-recovery-units) · [IPCC AR6, methane GWP100](https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_Chapter07.pdf)

## Microsoft — data-center cooling

**Baseline.** Normalize to 1,000 matching lifecycle tonnes of equivalent virtual-core service.

**Technology evidence.** The Nature lifecycle assessment reports at least 15% lower greenhouse-gas impact for cold-plate cooling relative to air-cooled data centers under the study’s assumptions.

**Calculation.**

```text
1,000 matched baseline tonnes × 15% = 150 tonnes
```

This is not a multiplier for Microsoft’s total footprint. The remaining eligible compute cohort and site-level tradeoffs still need measurement.

**Sources.** [Microsoft Environmental Data Fact Sheet, Table 1A](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/msc/documents/presentations/CSR/2026-Microsoft-Environmental-Data-Fact-Sheet-PDF.pdf) · [Nature lifecycle cooling study](https://www.nature.com/articles/s41586-025-08832-3) · [Microsoft zero-water cooling design](https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/12/09/sustainable-by-design-next-generation-datacenters-consume-zero-water-for-cooling/)

## UPS — urban delivery electrification

**Baseline and technology evidence.** The NREL field evaluation reports 1,414.93 gCO₂e/mile for diesel and 759.06 gCO₂e/mile for electric delivery trucks under historical local-grid assumptions. The study concerns Frito-Lay Class 6 vehicles, not measured UPS vehicles.

**Calculation.**

```text
1,000 × (1 − 759.06 ÷ 1,414.93) = 463.54 tonnes
```

The result is a normalized operating-lifecycle benchmark. Vehicle and battery manufacture are excluded; UPS’s remaining eligible routes are unknown.

**Sources.** [UPS 2025 GRI emissions inventory](https://about.ups.com/content/dam/upsstories/images/our-impact/reporting/2025-ups-gri.pdf) · [NREL field evaluation of medium-duty electric delivery vehicles](https://www.nrel.gov/docs/fy17osti/66382.pdf) · [UPS delivering for our planet](https://about.ups.com/ca/en/our-impact/ups-sustainability-and-community-impact-report/delivering-for-our-planet.html)

## Delta Air Lines — gate power and cooling

**Baseline and technology evidence.** The Berkeley gate-electrification lifecycle study compares partly electrified current practice with electric ground power and electric preconditioned air throughout. It reports a 63–97% lifecycle reduction range; the app uses the 63% low endpoint.

**Calculation.**

```text
1,000 matching baseline tonnes × 63% = 630 tonnes
```

The denominator is partly electrified current practice, not a wholly fossil baseline. The result is not 63% of Delta’s airline emissions. Gate-level logs, equipment availability, electricity use, and grid capacity are needed before a company-scale project can be sized.

**Sources.** [Delta 2025 GHG emissions data](https://esghub.delta.com/content/esg/en/2025/ghg-emissions-data.html) · [Berkeley gate-electrification methods and appendix](https://escholarship.org/content/qt08w701t9/qt08w701t9.pdf) · [FAA gate-electrification funding guidance](https://www.faa.gov/airports/aip/guidance_letters/R-PGL-25-02-AIP-Discretionary-Set-Aside)

## Update policy

If a source, number, or boundary changes:

1. Update this register and the corresponding case data in `app/page.js` together.
2. Preserve the old interpretation in the pull request description if the meaning changed.
3. Re-run `npm run build` and manually check the affected detail view.
4. Do not silently convert a normalized benchmark into a company-scale estimate.
