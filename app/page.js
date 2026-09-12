'use client';

import { useMemo, useState } from 'react';

const valuation = 255.12;

const cases = [
  {
    id: 'walmart',
    mark: '✳',
    name: 'Walmart',
    ticker: 'WMT',
    sector: 'Retail',
    hue: 'blue',
    type: 'Scale scenario',
    confidence: 'High technical signal',
    activity: 'Refrigerant leakage',
    existing: 'Onsite refrigerant leaks from the cooling systems that keep stores and distribution centers cold.',
    baseline: '4.08m tCO₂e / year',
    baselineLabel: 'FY2026 onsite refrigerants',
    technology: 'Lower-impact CO₂ refrigeration',
    techReason: 'A paired supermarket study observed 191 tCO₂e versus 0.1 tCO₂e at equal leaked mass when comparing HFC and CO₂ systems.',
    defaultCoverage: 50,
    reduction: 99.95,
    result: (coverage) => 4080000 * (coverage / 100) * (1 - 0.1 / 191),
    resultUnit: 'tCO₂e / year',
    formula: '4,080,000 × eligible share × (1 − 0.1 ÷ 191)',
    boundary: 'Direct refrigerant emissions only. Energy, equipment manufacture and lifecycle effects are excluded.',
    next: 'Map refrigerant type, charge, leak rate and replacement timing across a target store cohort.',
    sources: [
      ['Walmart ESG Report · p. 31', 'https://corporate.walmart.com/content/dam/corporate/documents/esgreport/2026/FY2026-Walmart-ESG-Report.pdf'],
      ['DOE / Navigant supermarket study · pp. 19–20', 'https://www.energy.gov/sites/prod/files/2015/02/f19/Hannaford%20Study%20Report%201-22-2015_CLEAN.pdf'],
    ],
    caveats: ['Coverage is an assumption about emissions, not a store-count share.', 'The external comparison is not a measured Walmart result.', 'Net savings require energy and lifecycle effects to be added.'],
  },
  {
    id: 'exxon',
    mark: 'exxon',
    name: 'ExxonMobil',
    ticker: 'XOM',
    sector: 'Energy',
    hue: 'red',
    type: 'Scale scenario',
    confidence: 'Conditional source pool',
    activity: 'Upstream tank methane',
    existing: 'Methane can escape from upstream storage tanks before it is captured, sold or combusted.',
    baseline: '≈203k tCO₂e / year',
    baselineLabel: 'Inferred tank-source pool',
    technology: 'Vapor recovery units',
    techReason: 'EPA guidance gives a 95% control factor for suitable vapor-recovery sources. Recovered methane is assumed to be burned, so its resulting CO₂ remains in the calculation.',
    defaultCoverage: 50,
    reduction: 86.23,
    result: (coverage) => 6816 * (coverage / 100) * 0.95 * (29.8 - 2.75),
    resultUnit: 'tCO₂e / year',
    formula: '(142,000 × 96% × 5%) × eligible share × 95% × (29.8 − 2.75)',
    boundary: 'Tank methane after recovered-gas combustion. Compression power, downstream leakage and other lifecycle effects are excluded.',
    next: 'Replace rounded source shares with a named inventory of untreated tanks and metered methane measurements.',
    sources: [
      ['ExxonMobil Metrics & Data · 2025 table', 'https://corporate.exxonmobil.com/publications/metrics-and-data'],
      ['US EPA · Vapor Recovery Units', 'https://www.epa.gov/natural-gas-star-program/vapor-recovery-units'],
      ['IPCC AR6 · methane GWP100', 'https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_Chapter07.pdf'],
    ],
    caveats: ['The source pool is inferred from rounded company-reported shares.', 'The 25–100% cases are sensitivities, not probabilities.', 'This does not assume recovered gas displaces new production.'],
  },
  {
    id: 'microsoft',
    mark: '▦',
    name: 'Microsoft',
    ticker: 'MSFT',
    sector: 'Technology',
    hue: 'green',
    type: 'Benchmark block',
    confidence: 'Study-matched',
    activity: 'Data-center cooling',
    existing: 'Cooling loads grow with compute density; conventional cooling can carry avoidable energy and lifecycle impact.',
    baseline: '1,000 tCO₂e',
    baselineLabel: 'Matched lifecycle baseline',
    technology: 'Direct-to-chip cold plates',
    techReason: 'A Nature lifecycle study models 15% lower climate impact for equivalent virtual-core service with cold-plate cooling under its stated assumptions.',
    defaultCoverage: 100,
    reduction: 15,
    result: () => 150,
    resultUnit: 'tCO₂e / 1,000 baseline tonnes',
    formula: '1,000 matched baseline tonnes × 15% = 150 tonnes',
    boundary: 'Study-matched annualized virtual-core service. This is not a multiplier for Microsoft’s total footprint.',
    next: 'Identify unconverted compute cohorts and measure the site-specific energy, water and refrigerant tradeoffs.',
    sources: [
      ['Microsoft Environmental Data Fact Sheet · Table 1A', 'https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/msc/documents/presentations/CSR/2026-Microsoft-Environmental-Data-Fact-Sheet-PDF.pdf'],
      ['Nature · lifecycle cooling study', 'https://www.nature.com/articles/s41586-025-08832-3'],
      ['Microsoft · zero-water cooling design', 'https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/12/09/sustainable-by-design-next-generation-datacenters-consume-zero-water-for-cooling/'],
    ],
    caveats: ['15% is a process comparison, not a company-scale opportunity.', 'The study uses a 2021 US grid and specified asset-life assumptions.', 'Mechanical cooling can raise power use; site-level net impact needs measurement.'],
  },
  {
    id: 'ups',
    mark: 'ups',
    name: 'UPS',
    ticker: 'UPS',
    sector: 'Logistics',
    hue: 'gold',
    type: 'Benchmark block',
    confidence: 'External fleet analogue',
    activity: 'Urban delivery electrification',
    existing: 'Diesel delivery vehicles burn fuel on repetitive urban routes where depot charging and electric drivetrains are increasingly deployable.',
    baseline: '1,414.93 gCO₂e / mile',
    baselineLabel: 'Matched diesel well-to-wheels',
    technology: 'Battery-electric delivery trucks',
    techReason: 'An NREL field evaluation measured 759.06 gCO₂e/mile for an electric delivery fleet versus 1,414.93 for diesel under its historical local-grid assumptions.',
    defaultCoverage: 100,
    reduction: 46.35,
    result: () => 463.54,
    resultUnit: 'tCO₂e / 1,000 baseline tonnes',
    formula: '1,000 × (1 − 759.06 ÷ 1,414.93) = 463.54 tonnes',
    boundary: 'Historical delivery-fleet operating lifecycle. Vehicle and battery manufacture are excluded; no UPS total is estimated.',
    next: 'Screen still-diesel routes for payload, range, depot power and a current-grid emissions factor.',
    sources: [
      ['UPS 2025 GRI · emissions inventory', 'https://about.ups.com/content/dam/upsstories/images/our-impact/reporting/2025-ups-gri.pdf'],
      ['NREL · field evaluation of electric delivery trucks', 'https://www.nrel.gov/docs/fy17osti/66382.pdf'],
      ['UPS · delivering for our planet', 'https://about.ups.com/ca/en/our-impact/ups-sustainability-and-community-impact-report/delivering-for-our-planet.html'],
    ],
    caveats: ['The study concerns Frito-Lay Class 6 trucks, not measured UPS vehicles.', 'Historical local-grid performance is not universal.', 'Recalculate with today’s vehicle efficiency and electricity supply.'],
  },
  {
    id: 'delta',
    mark: 'Δ',
    name: 'Delta Air Lines',
    ticker: 'DAL',
    sector: 'Airlines',
    hue: 'rose',
    type: 'Benchmark block',
    confidence: 'Low-end study case',
    activity: 'Aircraft gate power + cooling',
    existing: 'Aircraft can burn fuel at the gate for electricity and cooling while waiting for a ground connection.',
    baseline: '1,000 tCO₂e',
    baselineLabel: 'Matched gate lifecycle baseline',
    technology: 'Electric ground power + preconditioned air',
    techReason: 'A gate-electrification lifecycle study compares partly electrified current practice with electric power and cooling throughout, finding a 63–97% reduction range.',
    defaultCoverage: 100,
    reduction: 63,
    result: () => 630,
    resultUnit: 'tCO₂e / 1,000 baseline tonnes',
    formula: '1,000 matching baseline tonnes × 63% = 630 tonnes',
    boundary: 'Equivalent gate service; energy lifecycle included and end-of-life excluded. The denominator is partly electrified current practice.',
    next: 'Use gate-level APU logs, power availability, turnaround time and grid capacity to size an investable cohort.',
    sources: [
      ['Delta 2025 GHG emissions data', 'https://esghub.delta.com/content/esg/en/2025/ghg-emissions-data.html'],
      ['Berkeley / author methods + gate study appendix', 'https://escholarship.org/content/qt08w701t9/qt08w701t9.pdf'],
      ['FAA · gate-electrification funding guidance', 'https://www.faa.gov/airports/aip/guidance_letters/R-PGL-25-02-AIP-Discretionary-Set-Aside'],
    ],
    caveats: ['63% is the low endpoint of a study range, not a guaranteed Delta result.', 'It is not 63% of airline emissions.', 'Existing installations and committed upgrades must be excluded from new-funding impact.'],
  },
];

function formatNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(value < 100000 ? 1 : 0)}k`;
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

function Logo() {
  return <div className="brand"><span className="brand-mark"/><span>the gap<span className="brand-dot">.</span></span></div>;
}

function Badge({ children, tone = 'neutral' }) { return <span className={`badge ${tone}`}>{children}</span>; }

function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar">
      <Logo />
      <p className="tagline">Potential, made visible.</p>
      <nav className="side-nav" aria-label="Primary navigation">
        <button className={view === 'portfolio' ? 'active' : ''} onClick={() => setView('portfolio')}><span>01</span>Portfolio</button>
        <button className={view === 'method' ? 'active' : ''} onClick={() => setView('method')}><span>02</span>Method</button>
        <button className={view === 'thesis' ? 'active' : ''} onClick={() => setView('thesis')}><span>03</span>Impact thesis</button>
      </nav>
      <div className="sidebar-foot">
        <Badge tone="live"><span className="status-dot"/> Research prototype</Badge>
        <p>5 cases<br/>2 scale scenarios<br/>3 benchmark blocks</p>
        <div className="side-rule"/>
        <p className="side-note">Public evidence · snapshot 13 Sep 2026</p>
      </div>
    </aside>
  );
}

function Header({ view }) {
  const label = view === 'portfolio' ? 'Opportunity portfolio' : view === 'method' ? 'How we measure' : 'From gap to action';
  return <header className="topbar"><div className="crumb"><span className="crumb-dot"/> S&amp;P 500 research pilot <span className="slash">/</span> {label}</div><div className="evidence-pill"><span className="status-dot"/> Evidence snapshot · Sep 2026</div></header>;
}

function Portfolio({ selectedId, setSelectedId }) {
  const [filter, setFilter] = useState('all');
  const [coverage, setCoverage] = useState(50);
  const selected = cases.find((item) => item.id === selectedId) || cases[0];
  const visibleCases = useMemo(() => cases.filter((item) => filter === 'all' || (filter === 'scale' ? item.type === 'Scale scenario' : item.type === 'Benchmark block')), [filter]);
  const selectedCoverage = selected.type === 'Scale scenario' ? coverage : 100;
  const selectedResult = selected.result(selectedCoverage);

  return (
    <>
      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line"/> Impact portfolio / v1.0</div>
        <h1>Damage we could<br/><em>leave behind.</em></h1>
        <p className="hero-copy">A focused portfolio of emissions that current technology could potentially prevent — with the evidence, boundary and remaining unknowns left in the open.</p>
        <div className="hero-actions"><button className="primary" onClick={() => document.getElementById('case-list')?.scrollIntoView({ behavior: 'smooth' })}>Explore the cases <Arrow/></button><div className="hero-annotation"><span>01</span> select a burden<br/><span>02</span> test the alternative<br/><span>03</span> price the gap</div></div>
      </section>

      <section className="mission-strip"><div><span className="eyebrow">Our mission</span><h2>Make the environmental gap investable.</h2></div><p>We turn a company’s reported burden into a specific, testable question: what could change if an available technology delivered the same service with less climate impact?</p><div className="strip-metric"><strong>5</strong><span>portfolio<br/>cases</span></div></section>

      <section className="stats-grid">
        <div className="stat-card"><span className="stat-label">Case mix</span><strong>02 <small>scale scenarios</small></strong><p>Company-scale sensitivities where a reported source and deployment assumption are available.</p></div>
        <div className="stat-card"><span className="stat-label">Case mix</span><strong>03 <small>benchmark blocks</small></strong><p>Normalized study units that show the technology gap without inventing a fleet denominator.</p></div>
        <div className="stat-card dark"><span className="stat-label">The rule</span><strong>Unknown ≠ zero</strong><p>Every gap keeps its coverage, boundary and next evidence request attached.</p><span className="ring"/></div>
      </section>

      <div className="section-head" id="case-list"><div><div className="eyebrow">The portfolio</div><h2>Five ways to close a gap</h2><p>Open a case to see the existing burden, the current alternative and the exact calculation.</p></div><div className="filter-tabs" role="tablist" aria-label="Filter cases">{[['all','All cases'],['scale','Scale scenarios'],['benchmark','Benchmarks']].map(([id, label]) => <button key={id} className={filter === id ? 'selected' : ''} onClick={() => setFilter(id)}>{label}</button>)}</div></div>

      <section className="portfolio-layout">
        <div className="case-list">
          {visibleCases.map((item, index) => <CaseCard key={item.id} item={item} index={index} selected={item.id === selected.id} onClick={() => setSelectedId(item.id)}/>) }
          <div className="list-note"><span>i</span><p>Percentages describe each case’s own activity boundary. Normalized blocks are not whole-company totals and cases should not be added together.</p></div>
        </div>
        <CaseDetail item={selected} coverage={selectedCoverage} setCoverage={setCoverage} result={selectedResult}/>
      </section>
    </>
  );
}

function CaseCard({ item, index, selected, onClick }) {
  const displayed = item.type === 'Scale scenario' ? `${item.defaultCoverage}%` : `${item.reduction}%`;
  const result = item.result(item.defaultCoverage);
  return <button className={`case-card ${selected ? 'selected' : ''}`} onClick={onClick}><div className={`company-mark ${item.hue}`}>{item.mark}</div><div className="case-main"><div className="case-top"><span className="case-index">0{index + 1}</span><Badge tone={item.type === 'Scale scenario' ? 'orange' : 'neutral'}>{item.type}</Badge></div><h3>{item.name}</h3><p className="case-meta">{item.ticker} · {item.sector}</p><p className="case-activity">{item.activity}</p></div><div className="case-result"><span className="result-label">{item.type === 'Scale scenario' ? 'At 50% coverage' : 'Gap signal'}</span><strong>{item.type === 'Scale scenario' ? formatNumber(result) : displayed}<small>{item.type === 'Scale scenario' ? ' tCO₂e / yr' : ' reduction'}</small></strong><span className="case-arrow"><Arrow/></span></div></button>;
}

function CaseDetail({ item, coverage, setCoverage, result }) {
  const isScale = item.type === 'Scale scenario';
  const percent = isScale ? item.reduction * coverage / 100 : item.reduction;
  return <article className="detail-card" aria-live="polite"><div className="detail-head"><div className={`company-mark ${item.hue}`}>{item.mark}</div><div><div className="eyebrow">{item.sector} · {item.ticker}</div><h2>{item.name}</h2></div><Badge tone={isScale ? 'orange' : 'neutral'}>{item.confidence}</Badge></div><div className="detail-intro"><span>Case focus</span><strong>{item.activity}</strong><p>{item.existing}</p></div><div className="gap-panel"><div className="gap-title"><span>Potentially preventable</span><span>{isScale ? `${coverage}% source coverage` : 'matched study unit'}</span></div><div className="gap-number"><strong>{formatNumber(result)}</strong><span>{item.resultUnit}</span></div><div className="gap-bar"><span style={{ width: `${Math.min(percent, 100)}%` }}/></div><div className="gap-foot"><span>{percent.toFixed(percent % 1 ? 1 : 0)}% improvement gap</span><span>{item.baseline}</span></div>{isScale && <div className="coverage"><div className="coverage-label">Test the deployment assumption</div><div className="coverage-options">{[25,50,100].map((value) => <button key={value} className={coverage === value ? 'selected' : ''} onClick={() => setCoverage(value)}>{value}%</button>)}</div></div>}</div><div className="detail-sections"><div><span className="mini-label">01 · Existing burden</span><p>{item.baselineLabel}</p><strong>{item.baseline}</strong></div><div><span className="mini-label">02 · Available alternative</span><p>{item.technology}</p><strong className="tech-text">{item.techReason}</strong></div></div><div className="calculation"><div className="calc-head"><span>03 · How the gap is quantified</span><Badge tone="formula">Formula</Badge></div><code>{item.formula}</code><p>Boundary: {item.boundary}</p></div><div className="detail-next"><span className="mini-label">Next proof point</span><p>{item.next}</p></div><div className="sources"><div className="sources-head"><span className="mini-label">Evidence trail</span><span>{item.sources.length} sources</span></div>{item.sources.map(([label, url]) => <a href={url} target="_blank" rel="noreferrer" key={url}>{label}<Arrow/></a>)}</div><details className="caveat"><summary>Show limits &amp; assumptions <span>+</span></summary><ul>{item.caveats.map((caveat) => <li key={caveat}>{caveat}</li>)}</ul></details></article>;
}

function Method() {
  return <><section className="hero compact-hero"><div className="eyebrow"><span className="eyebrow-line"/> The method</div><h1>Keep the claim<br/><em>inside the evidence.</em></h1><p className="hero-copy">The gap is not a green score. It is a bounded counterfactual: a reported burden, a currently implementable alternative, and a transparent assumption about where it can apply.</p></section><section className="method-intro"><div className="formula-large">Potentially preventable CO₂e<br/><strong>= baseline × coverage × reduction</strong></div><div><div className="eyebrow">The four-part test</div><h2>Every case must earn its number.</h2><p>We keep physical emissions, modeled societal damage and investment cashflows separate. The portfolio is a decision surface for finding projects to validate — not a ranking of companies.</p></div></section><section className="method-grid">{[['01','Baseline','Start with the company or study’s original year, units and boundary. Missing data stays missing.'],['02','Alternative','Name a technology that already exists and preserves the service being delivered.'],['03','Coverage','Show how much of the source is actually eligible and converted. A 50% scenario is an assumption, not a forecast.'],['04','Boundary','Subtract material added burdens and keep excluded lifecycle effects visible. Never hide them in a percentage.']].map(([number, title, body]) => <div className="method-card" key={number}><span className="step-no">{number}</span><h3>{title}</h3><p>{body}</p></div>)}</section><section className="guardrail"><div><div className="eyebrow">What this prevents</div><h2>A persuasive number<br/>from becoming a false one.</h2></div><div className="guardrail-list"><p><span>×</span> No process percentage is multiplied by a company’s entire footprint.</p><p><span>×</span> No “avoided damage” is presented as investable cashflow.</p><p><span>×</span> No committed or existing project is counted as new funding impact.</p></div></section></>;
}

function Thesis() {
  return <><section className="hero compact-hero"><div className="eyebrow"><span className="eyebrow-line"/> From gap to action</div><h1>Fund the proof,<br/><em>then the rollout.</em></h1><p className="hero-copy">The portfolio is a sourcing layer for environmental projects. The investable product is not the percentage; it is the verified asset, contracted savings and additionality behind it.</p></section><section className="thesis-callout"><div className="callout-big">The opportunity<br/><em>is the next proof point.</em></div><p>Start with cases where a source, technology and measurement plan are all visible. Use capital to move from technical potential to a named asset that can repay it.</p></section><section className="thesis-steps">{[['01','Screen','Find a reported burden with a credible current alternative.'],['02','Underwrite','Validate the exact asset, net lifecycle effect, capital need and without-funding case.'],['03','Measure','Contract for metered physical outcomes and publish what did not work.']].map(([number,title,body]) => <div className="thesis-step" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>)}</section><section className="portfolio-note"><div className="eyebrow">Investment guardrail</div><h2>Environmental value is not repayment.</h2><p>The $255.12/tCO₂e reference used in the portfolio is a screening proxy for modeled future societal damage. It is not company liability, revenue, or cash available to repay capital. Any impact vehicle still needs a separate cashflow model.</p><div className="note-stat"><strong>${valuation.toFixed(2)}</strong><span>per modeled tCO₂e<br/>2024 USD · screening only</span></div></section></>;
}

export default function Page() {
  const [view, setView] = useState('portfolio');
  const [selectedId, setSelectedId] = useState('walmart');
  return <div className="app-shell"><Sidebar view={view} setView={setView}/><main className="main"><Header view={view}/><div className="content">{view === 'portfolio' ? <Portfolio selectedId={selectedId} setSelectedId={setSelectedId}/> : view === 'method' ? <Method/> : <Thesis/>}<footer><span>the gap. © 2026 · evidence-led sustainability prototype</span><span>Available technology · explicit assumptions · visible uncertainty</span></footer></div></main></div>;
}
