# Methodology

## The product question

The avoidable gap is a bounded counterfactual, not a company score:

> Given a reported environmental burden, what reduction could a currently implementable technology achieve while delivering equivalent service?

The answer is only useful when the denominator, technology comparison, coverage assumption, and exclusions are visible together.

## Core calculation

```text
Avoidable CO₂e / year
  = reported annual source emissions
  × eligible share
  × adoption share
  × (1 − alternative intensity ÷ current intensity)
  − additional burdens caused elsewhere
```

```text
Improvement gap (%)
  = potentially preventable CO₂e
  ÷ same activity baseline
  × 100
```

The current UI shows the gross modeled result where added burdens are not yet quantified. It names those exclusions instead of implying that the result is a net, verified reduction. The unit is always **tCO₂e/year** for a rankable case.

The equivalent form for a case with a known annual activity volume is:

```text
annual activity volume
  × (current technology emissions intensity − alternative technology emissions intensity)
```

The two forms are interchangeable when the source emissions and intensity denominator describe the same activity, period, and boundary.

## Two evidence states

### Scale scenarios

Walmart and ExxonMobil have a reported annual source that can be paired with a deployment sensitivity. The displayed annual result is conditional. For example, the default 50% setting means “if 50% of the source is eligible and converted,” not “50% of the company has converted.” These are the only two cases currently admitted to the comparable annual ranking.

### Benchmark blocks

Microsoft, UPS, and Delta have study-matched technology comparisons, but the research does not establish the remaining company activity that can adopt the alternative. Their numbers remain visible as technology signals, but the app intentionally displays **Pending — company denominator needed** instead of converting them into false company-wide annual totals. They are useful for screening and project discovery; they are not currently rankable.

## Claim types kept separate

- **Reported fact:** a company or study’s published measure.
- **Derived quantity:** arithmetic using reported inputs.
- **Assumption:** an explicit scenario choice, such as 25%, 50%, or 100% coverage.
- **Achieved improvement:** a historical result that may already be in the baseline.
- **Technical potential:** what the alternative could do under matching conditions.
- **Funding impact:** the incremental outcome caused by new capital versus a without-funding case.
- **Modeled societal damage:** an externality valuation proxy, not revenue or repayment cashflow.

## Annualization gate

A case enters the comparable ranking only if all of the following are present:

1. A company-reported annual emissions source tied to the activity being changed.
2. A current-technology baseline intensity or a defensible source-emissions total.
3. An alternative-technology intensity under equivalent service conditions.
4. An explicit eligible-and-adopted share.
5. A compatible period, unit, geography, and lifecycle/accounting boundary.

If any item is missing, the case is an evidence-queue item. Its study result can guide diligence, but it must not be expressed as an annual company opportunity or compared in the ranking.

## Climate valuation guardrail

The prototype uses a fixed reference of **$255.12 per tCO₂e in 2024 USD** only in the impact-thesis framing. It is a screening proxy for modeled future societal damage. It is not company liability, an observed cost, a project cash saving, or money available to repay an investor.

## What the prototype does not claim

- It does not rank companies by total sustainability performance.
- It does not multiply a process percentage by a company’s full footprint.
- It does not claim that technology availability proves universal feasibility.
- It does not claim that an existing or committed project is additional to new funding.
- It does not add normalized benchmarks to company-scale totals.
- It does not treat missing eligibility data as zero opportunity.

## What a fundable case still needs

The next step for any case is asset-level validation: a named site or asset, measured baseline, technology design, net lifecycle effect, installed cost, operating cashflows, implementation timing, and a counterfactual that shows what would happen without the proposed capital.
