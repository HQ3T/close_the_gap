# Methodology

## The product question

The avoidable gap is a bounded counterfactual, not a company score:

> Given a reported environmental burden, what reduction could a currently implementable technology achieve while delivering equivalent service?

The answer is only useful when the denominator, technology comparison, coverage assumption, and exclusions are visible together.

## Core calculation

```text
Potentially preventable CO₂e
  = activity baseline
  × eligible-and-converted share
  × reduction on converted activity
  − additional burdens caused elsewhere
```

```text
Improvement gap (%)
  = potentially preventable CO₂e
  ÷ same activity baseline
  × 100
```

The current UI shows the gross modeled result where added burdens are not yet quantified. It names those exclusions instead of implying that the result is a net, verified reduction.

## Two evidence states

### Scale scenarios

Walmart and ExxonMobil have a reported source that can be paired with a deployment sensitivity. The displayed annual result is conditional. For example, the default 50% setting means “if 50% of the source is eligible and converted,” not “50% of the company has converted.”

### Benchmark blocks

Microsoft, UPS, and Delta have study-matched technology comparisons, but the research does not establish the remaining company activity that can adopt the alternative. Their numbers are normalized to a study unit. They are useful for screening and project discovery; they are not company-wide annual totals.

## Claim types kept separate

- **Reported fact:** a company or study’s published measure.
- **Derived quantity:** arithmetic using reported inputs.
- **Assumption:** an explicit scenario choice, such as 25%, 50%, or 100% coverage.
- **Achieved improvement:** a historical result that may already be in the baseline.
- **Technical potential:** what the alternative could do under matching conditions.
- **Funding impact:** the incremental outcome caused by new capital versus a without-funding case.
- **Modeled societal damage:** an externality valuation proxy, not revenue or repayment cashflow.

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
