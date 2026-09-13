'use client';

import { useEffect, useMemo, useState } from 'react';

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
    metricStatus: 'rankable',
    confidence: 'High technical signal',
    activity: 'Refrigerant leakage',
    existing: 'Onsite refrigerant leaks from the cooling systems that keep stores and distribution centers cold.',
    baseline: '4.08m tCO₂e / year',
    baselineLabel: 'FY2026 onsite refrigerants',
    technology: 'Lower-impact CO₂ refrigeration',
    techReason: 'A paired supermarket study observed 191 tCO₂e versus 0.1 tCO₂e at equal leaked mass when comparing HFC and CO₂ systems.',
    defaultCoverage: 50,
    annualSource: 'Reported onsite refrigerant emissions',
    currentIntensity: '1.00 × current refrigerant burden',
    alternativeIntensity: '0.00052 × current burden on converted source',
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
    metricStatus: 'rankable',
    confidence: 'Conditional source pool',
    activity: 'Upstream tank methane',
    existing: 'Methane can escape from upstream storage tanks before it is captured, sold or combusted.',
    baseline: '≈203k tCO₂e / year',
    baselineLabel: 'Inferred tank-source pool',
    technology: 'Vapor recovery units',
    techReason: 'EPA guidance gives a 95% control factor for suitable vapor-recovery sources. Recovered methane is assumed to be burned, so its resulting CO₂ remains in the calculation.',
    defaultCoverage: 50,
    annualSource: 'Derived upstream tank methane source pool',
    currentIntensity: '29.8 tCO₂e / tCH₄',
    alternativeIntensity: '2.75 tCO₂e / tCH₄ after combustion',
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
    metricStatus: 'needs-denominator',
    confidence: 'Study-matched',
    activity: 'Data-center cooling',
    existing: 'Cooling loads grow with compute density; conventional cooling can carry avoidable energy and lifecycle impact.',
    baseline: '1,000 tCO₂e',
    baselineLabel: 'Matched lifecycle baseline',
    technology: 'Direct-to-chip cold plates',
    techReason: 'A Nature lifecycle study models 15% lower climate impact for equivalent virtual-core service with cold-plate cooling under its stated assumptions.',
    defaultCoverage: 100,
    benchmarkResult: '150 tCO₂e / 1,000 baseline tonnes',
    annualizationGap: 'Microsoft’s eligible cooling-service volume is not disclosed.',
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
    metricStatus: 'needs-denominator',
    confidence: 'External fleet analogue',
    activity: 'Urban delivery electrification',
    existing: 'Diesel delivery vehicles burn fuel on repetitive urban routes where depot charging and electric drivetrains are increasingly deployable.',
    baseline: '1,414.93 gCO₂e / mile',
    baselineLabel: 'Matched diesel well-to-wheels',
    technology: 'Battery-electric delivery trucks',
    techReason: 'An NREL field evaluation measured 759.06 gCO₂e/mile for an electric delivery fleet versus 1,414.93 for diesel under its historical local-grid assumptions.',
    defaultCoverage: 100,
    benchmarkResult: '464 tCO₂e / 1,000 baseline tonnes',
    annualizationGap: 'UPS’s still-diesel, route-matched eligible miles are not disclosed.',
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
    metricStatus: 'needs-denominator',
    confidence: 'Low-end study case',
    activity: 'Aircraft gate power + cooling',
    existing: 'Aircraft can burn fuel at the gate for electricity and cooling while waiting for a ground connection.',
    baseline: '1,000 tCO₂e',
    baselineLabel: 'Matched gate lifecycle baseline',
    technology: 'Electric ground power + preconditioned air',
    techReason: 'A gate-electrification lifecycle study compares partly electrified current practice with electric power and cooling throughout, finding a 63–97% reduction range.',
    defaultCoverage: 100,
    benchmarkResult: '630 tCO₂e / 1,000 baseline tonnes',
    annualizationGap: 'Delta’s remaining eligible gate-turnaround volume is not disclosed.',
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
  return <div className="brand"><span className="brand-mark" /><span>the gap<span className="brand-dot">.</span></span></div>;
}

function Badge({ children, tone = 'neutral' }) { return <span className={`badge ${tone}`}>{children}</span>; }

function Navbar({ view, setView, theme, onToggleTheme }) {
  const label = view === 'portfolio' ? 'Opportunity portfolio' : view === 'method' ? 'How we measure' : 'From gap to action';
  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <div className="navbar-brand-group">
          <Logo />
          <span className="nav-divider" aria-hidden="true" />
          <span className="nav-tagline">Potential, made visible.</span>
        </div>

        <nav className="navbar-nav" aria-label="Primary navigation">
          <button
            className={view === 'portfolio' ? 'active' : ''}
            onClick={() => setView('portfolio')}
            aria-current={view === 'portfolio' ? 'page' : undefined}
          >
            <span>01</span>Portfolio
          </button>
          <button
            className={view === 'method' ? 'active' : ''}
            onClick={() => setView('method')}
            aria-current={view === 'method' ? 'page' : undefined}
          >
            <span>02</span>Method
          </button>
          <button
            className={view === 'billion' ? 'active' : ''}
            onClick={() => setView('billion')}
            aria-current={view === 'billion' ? 'page' : undefined}
          >
            <span>03</span>The $1bn question
          </button>
        </nav>

        <div className="navbar-meta">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <svg className="theme-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="theme-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span className="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <Badge tone="live"><span className="status-dot" /> Research prototype</Badge>
          <div className="evidence-pill"><span className="status-dot" /> Evidence snapshot · Sep 2026</div>
        </div>
      </div>

      <div className="subbar">
        <div className="subbar-inner">
          <div className="crumb">
            <span className="crumb-dot" /> S&amp;P 500 research pilot <span className="slash">/</span> {view === 'portfolio' ? 'Opportunity portfolio' : view === 'method' ? 'How we measure' : 'Capital & impact'}
          </div>
          <div className="subbar-stats">
            <span>5 cases · 2 scale scenarios · 3 benchmark blocks</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Portfolio({ selectedId, setSelectedId }) {
  const [filter, setFilter] = useState('all');
  const [coverage, setCoverage] = useState(50);
  const selected = cases.find((item) => item.id === selectedId) || cases[0];
  const visibleCases = useMemo(() => cases.filter((item) => filter === 'all' || (filter === 'rankable' ? item.metricStatus === 'rankable' : item.metricStatus === 'needs-denominator')), [filter]);
  const selectedCoverage = selected.type === 'Scale scenario' ? coverage : 100;
  const selectedResult = selected.result(selectedCoverage);

  return (
    <>
      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> Impact portfolio / v1.0</div>
        <h1>Damage we could<br /><em>leave behind.</em></h1>


        <p className="hero-copy">
          A focused research portfolio built around one strictly comparable metric: <strong>avoidable CO₂e per year</strong>.
        </p>



        <div className="hero-actions">
          <button className="primary" onClick={() => document.getElementById('case-list')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore the cases <Arrow />
          </button>

          <div className="hero-stepper" aria-label="Method sequence">
            <div className="step-card">
              <span className="step-num">01</span>
              <span className="step-label">Select burden</span>
            </div>
            <span className="step-arrow" aria-hidden="true">→</span>
            <div className="step-card">
              <span className="step-num">02</span>
              <span className="step-label">Test alternative</span>
            </div>
            <span className="step-arrow" aria-hidden="true">→</span>
            <div className="step-card highlighted">
              <div className="step-highlight-tag">Valuation payoff</div>
              <div className="step-highlight-main">
                <span className="step-num">03</span>
                <strong>Price the gap</strong>
              </div>
              <span className="step-badge">${valuation.toFixed(2)} / tCO₂e</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-strip">
        <div>
          <span className="eyebrow">Our mission</span>
          <h2>Make the environmental gap investable.</h2>
        </div>
        <div className="mission-copy">
          <p>
            We turn reported company emissions into a transparent, testable question:
            <strong> what if an available technology delivered the same service with less climate impact?</strong>
          </p>
        </div>
        <div className="strip-metric">
          <strong>2/5</strong>
          <span>annual<br />metric ready</span>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Comparable ranking</span>
          <strong>02 <small>annual metrics</small></strong>
          <p>Company-specific annual source emissions are available for an apples-to-apples comparison.</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">Evidence queue</span>
          <strong>03 <small>need denominators</small></strong>
          <p>Technology signals are measured, but the corporate activity volume remains undisclosed.</p>
        </div>
        <div className="stat-card dark">
          <span className="stat-label">The rule</span>
          <strong>Unknown ≠ zero</strong>
          <p>No annual CO₂e number is assigned until the source denominator can be defended.</p>
          <span className="ring" />
        </div>
      </section>

      <div className="section-head" id="case-list">
        <div>
          <div className="eyebrow">The portfolio</div>
          <h2>Five ways to close a gap</h2>
          <p>Open a case to see the annual metric gate, evidence, and exact calculation.</p>
        </div>
        <div className="filter-tabs" role="tablist" aria-label="Filter cases">
          {[['all', 'All cases'], ['rankable', 'Annual metric'], ['queue', 'Evidence queue']].map(([id, label]) => (
            <button key={id} className={filter === id ? 'selected' : ''} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>
      </div>

      <section className="portfolio-layout">
        <div className="case-list">
          {visibleCases.map((item, index) => (
            <CaseCard key={item.id} item={item} index={index} selected={item.id === selected.id} onClick={() => setSelectedId(item.id)} />
          ))}
          <div className="list-note">
            <span>i</span>
            <p>Percentages describe each case’s activity boundary. Normalized blocks are not whole-company totals and cases should not be summed.</p>
          </div>
        </div>
        <CaseDetail item={selected} coverage={selectedCoverage} setCoverage={setCoverage} result={selectedResult} />
      </section>
    </>
  );
}

function CaseCard({ item, index, selected, onClick }) {
  const result = item.result(item.defaultCoverage);
  return (
    <button className={`case-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className={`company-mark ${item.hue}`}>{item.mark}</div>
      <div className="case-main">
        <div className="case-top">
          <span className="case-index">0{index + 1}</span>
          <Badge tone={item.metricStatus === 'rankable' ? 'orange' : 'neutral'}>
            {item.metricStatus === 'rankable' ? 'Annual metric' : 'Evidence queue'}
          </Badge>
        </div>
        <h3>{item.name}</h3>
        <p className="case-meta">{item.ticker} · {item.sector}</p>
        <p className="case-activity">{item.activity}</p>
      </div>
      <div className="case-result">
        <span className="result-label">{item.metricStatus === 'rankable' ? 'At 50% coverage' : 'Annual metric'}</span>
        <strong>{item.metricStatus === 'rankable' ? formatNumber(result) : 'Pending'}<small>{item.metricStatus === 'rankable' ? ' tCO₂e / yr' : ' denominator'}</small></strong>
        <span className="case-arrow"><Arrow /></span>
      </div>
    </button>
  );
}

function CaseDetail({ item, coverage, setCoverage, result }) {
  const isScale = item.type === 'Scale scenario';
  const percent = isScale ? item.reduction * coverage / 100 : item.reduction;
  const annualMetric = item.metricStatus === 'rankable';
  return (
    <article className="detail-card" aria-live="polite">
      <div className="detail-head">
        <div className={`company-mark ${item.hue}`}>{item.mark}</div>
        <div>
          <div className="eyebrow">{item.sector} · {item.ticker}</div>
          <h2>{item.name}</h2>
        </div>
        <Badge tone={annualMetric ? 'orange' : 'neutral'}>
          {annualMetric ? 'Comparable annual metric' : 'Needs annual denominator'}
        </Badge>
      </div>

      <div className="detail-intro">
        <span className="mini-label">Case focus</span>
        <strong>{item.activity}</strong>
        <p className="detail-desc">{item.existing}</p>
      </div>

      <div className={`gap-panel ${annualMetric ? '' : 'pending-panel'}`}>
        <div className="gap-title">
          <span>{annualMetric ? 'Avoidable CO₂e / year' : 'Annual metric status'}</span>
          <span>{annualMetric ? `${coverage}% source coverage` : 'Not ranked yet'}</span>
        </div>
        <div className="gap-number">
          <strong>{annualMetric ? formatNumber(result) : 'Pending'}</strong>
          <span>{annualMetric ? 'tCO₂e / year' : 'company denominator needed'}</span>
        </div>
        {annualMetric ? (
          <>
            <div className="gap-bar"><span style={{ width: `${Math.min(percent, 100)}%` }} /></div>
            <div className="gap-foot">
              <span>{percent.toFixed(percent % 1 ? 1 : 0)}% improvement gap</span>
              <span>Baseline: {item.baseline}</span>
            </div>
          </>
        ) : (
          <div className="benchmark-signal">
            <span>Technology signal</span>
            <strong>{item.benchmarkResult}</strong>
            <p>{item.annualizationGap}</p>
          </div>
        )}
        {isScale && (
          <div className="coverage">
            <div className="coverage-label">Test the deployment assumption:</div>
            <div className="coverage-options">
              {[25, 50, 100].map((value) => (
                <button key={value} className={coverage === value ? 'selected' : ''} onClick={() => setCoverage(value)}>
                  {value}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="detail-sections">
        <div className="detail-box">
          <span className="mini-label">01 · Existing burden</span>
          <p className="box-sub">{item.baselineLabel}</p>
          <strong className="box-highlight">{item.baseline}</strong>
        </div>
        <div className="detail-box">
          <span className="mini-label">02 · Available alternative</span>
          <p className="box-sub">{item.technology}</p>
          <strong className="box-highlight tech-text">{item.techReason}</strong>
        </div>
      </div>

      <div className="calculation">
        <div className="calc-head">
          <span className="mini-label">03 · Standardized annual method</span>
          <Badge tone="formula">{annualMetric ? 'Formula' : 'Gate'}</Badge>
        </div>
        <code>{annualMetric ? 'reported annual source × eligible share × adoption × (1 − alternative intensity ÷ current intensity)' : 'annual activity volume × (current intensity − alternative intensity)'}</code>
        <div className="calc-details">
          <p><strong>Applied:</strong> {annualMetric ? item.formula : `Annual metric intentionally not assigned. ${item.annualizationGap}`}</p>
          <p><strong>Boundary:</strong> {item.boundary}</p>
        </div>
      </div>

      <div className="detail-next">
        <span className="mini-label">Next proof point</span>
        <p>{item.next}</p>
      </div>

      <div className="sources">
        <div className="sources-head">
          <span className="mini-label">Evidence trail</span>
          <span>{item.sources.length} sources</span>
        </div>
        {item.sources.map(([label, url]) => (
          <a href={url} target="_blank" rel="noreferrer" key={url}>
            {label}
            <Arrow />
          </a>
        ))}
      </div>

      <details className="caveat">
        <summary>Show limits &amp; assumptions <span>+</span></summary>
        <ul>
          {item.caveats.map((caveat) => (
            <li key={caveat}>{caveat}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

function Method() {
  return (
    <>
      <section className="hero compact-hero">
        <div className="eyebrow"><span className="eyebrow-line" /> The method</div>
        <h1>Keep the claim<br /><em>inside the evidence.</em></h1>
        <p className="hero-copy">
          The gap is not an arbitrary rating. It is one strictly audited metric: the company’s reported source emissions translated through an alternative technology intensity and explicit coverage.
        </p>
      </section>

      <section className="method-intro">
        <div className="formula-large">
          Avoidable CO₂e / year<br />
          <strong>= source × coverage × (1 − alternative ÷ current)</strong>
        </div>
        <div>
          <div className="eyebrow">The annualization gate</div>
          <h2>Every case must earn its denominator.</h2>
          <p>We only rank a case when a company-specific annual source is available. If activity volume is undisclosed, the case remains in the evidence queue until verified.</p>
        </div>
      </section>

      <section className="method-grid">
        {[
          ['01', 'Company source', 'Start with a reported annual emissions source tied directly to the activity being changed. Never use total corporate footprint as a proxy.'],
          ['02', 'Alternative intensity', 'Identify a proven commercial technology that delivers identical service and calculate emissions per matching unit.'],
          ['03', 'Coverage', 'Model only newly converted, eligible equipment. Treat coverage as a tested parameter, never an unverified assumption.'],
          ['04', 'Net boundary', 'Subtract added burdens and display excluded lifecycle effects prominently. All gross results are explicitly labeled.']
        ].map(([number, title, body]) => (
          <div className="method-card" key={number}>
            <span className="step-no">{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </section>

      <section className="guardrail">
        <div>
          <div className="eyebrow">Methodology guardrails</div>
          <h2>Preventing persuasion<br />from becoming distortion.</h2>
        </div>
        <div className="guardrail-list">
          <p><span>×</span> No process percentage is multiplied against a whole company footprint.</p>
          <p><span>×</span> No case enters the ranking without a verified annual denominator.</p>
          <p><span>×</span> No avoided damage estimate is presented as guaranteed cashflow.</p>
        </div>
      </section>
    </>
  );
}

const investableProjects = [
  {
    id: 'walmart',
    name: 'Walmart',
    ticker: 'WMT',
    sector: 'Retail',
    hue: 'blue',
    mark: '✳',
    opportunity: 'Finance refrigeration replacement and installation capacity.',
    hasCase: true,
  },
  {
    id: 'exxon',
    name: 'ExxonMobil',
    ticker: 'XOM',
    sector: 'Energy',
    hue: 'red',
    mark: 'exxon',
    opportunity: 'Finance eligible vapor recovery equipment with measured leak reduction.',
    hasCase: true,
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    ticker: 'MSFT',
    sector: 'Technology',
    hue: 'green',
    mark: '▦',
    opportunity: 'Identify suitable unconverted compute cohorts, then assess retrofit finance.',
    hasCase: true,
  },
  {
    id: 'nucor',
    name: 'Nucor',
    ticker: 'NUE',
    sector: 'Steel',
    hue: 'gold',
    mark: 'N',
    opportunity: 'Find comparable unoptimized furnaces and verify metered savings.',
    hasCase: false,
  },
  {
    id: 'jpmorgan',
    name: 'JPMorgan Chase',
    ticker: 'JPM',
    sector: 'Financial services',
    hue: 'blue',
    mark: 'JPM',
    opportunity: 'Originate asset-specific loans with measurable physical improvements and contracted repayment.',
    hasCase: false,
  },
  {
    id: 'ups',
    name: 'UPS',
    ticker: 'UPS',
    sector: 'Logistics',
    hue: 'gold',
    mark: 'ups',
    opportunity: 'Identify still-diesel routes with suitable payload, range and depot power, then assess vehicle and charging finance.',
    hasCase: true,
  },
  {
    id: 'delta',
    name: 'Delta Air Lines',
    ticker: 'DAL',
    sector: 'Airlines',
    hue: 'rose',
    mark: 'Δ',
    opportunity: 'Finance additional gate power, cooling and reliable connection where fuel savings cover electricity, upkeep and capital.',
    hasCase: true,
  },
  {
    id: 'duke',
    name: 'Duke Energy',
    ticker: 'DUK',
    sector: 'Utilities',
    hue: 'green',
    mark: 'D',
    opportunity: 'Screen untreated scheduled blowdowns for recovery equipment and service contracts.',
    hasCase: false,
  },
];

function BillionDollarQuestion({ onSelectCase }) {
  return (
    <>
      <section className="hero compact-hero">
        <div className="eyebrow"><span className="eyebrow-line" /> The billion-dollar question</div>
        <h1>Fund the change.<br /><em>Bring the capital back.</em></h1>
        <p className="hero-copy">
          The score is a starting point for finding projects. The investment decision asks which improvements our funding can enable—and how the principal can be repaid.
        </p>
      </section>

      <section className="mandate-card">
        <div className="mandate-inner">
          <div className="mandate-badge"><span className="status-dot" /> The mandate</div>
          <div className="mandate-head">$1,000,000,000</div>
          <p className="mandate-copy">
            Prioritize measurable additional impact while seeking to recover principal. No allocation is invented here: project costs, deployment constraints and repayable cashflows still need underwriting.
          </p>
        </div>
      </section>

      <div className="mandate-steps-grid">
        {[
          ['01', 'Find a shared problem', 'Aggregate intervention types, not overlapping company inventories. Refrigerant replacement, methane recovery and industrial controls each point to different deployment needs.'],
          ['02', 'Finance the bottleneck', 'Equipment loans, retrofit finance and installation capacity may deploy established technology. Startup equity adds technology, execution and capital-loss risk; it does not promise principal recovery.'],
          ['03', 'Verify impact and repayment', 'Confirm asset eligibility, lifecycle savings, incremental adoption, implementation cost, savings or contracted revenue, and repayment timing before committing capital.']
        ].map(([num, title, body]) => (
          <div className="step-panel" key={num}>
            <span className="step-panel-num">{num}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>

      <section className="investable-section">
        <div className="investable-header">
          <span className="eyebrow">Project conversion</span>
          <h2>From an opportunity to an investable project</h2>
        </div>

        <div className="investable-list">
          {investableProjects.map((proj) => (
            <div
              key={proj.id}
              className={`investable-row ${proj.hasCase ? 'clickable' : ''}`}
              onClick={() => {
                if (proj.hasCase) {
                  onSelectCase(proj.id);
                }
              }}
              role={proj.hasCase ? 'button' : undefined}
              tabIndex={proj.hasCase ? 0 : undefined}
              title={proj.hasCase ? `Open ${proj.name} case in portfolio` : `${proj.name} research summary`}
            >
              <div className="investable-row-left">
                <div className={`company-mark ${proj.hue}`}>{proj.mark}</div>
                <div className="investable-row-info">
                  <div className="investable-title-line">
                    <strong>{proj.name}</strong>
                    <span className="investable-tag">{proj.ticker} · {proj.sector}</span>
                    {proj.hasCase && <span className="portfolio-pill">Explore case</span>}
                  </div>
                  <p className="investable-opportunity">{proj.opportunity}</p>
                </div>
              </div>
              <div className="investable-row-right">
                <span className="investable-arrow"><Arrow /></span>
              </div>
            </div>
          ))}
        </div>

        <div className="notice-banner">
          <div className="notice-icon">⚠</div>
          <div className="notice-content">
            <strong>Underwriting rule</strong>
            <p>
              Avoided societal damage is not cashflow. A project can have substantial environmental value and still lack a way to repay a loan. Impact per dollar, additionality and capital recovery must each be assessed separately.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Page() {
  const [view, setView] = useState('portfolio');
  const [selectedId, setSelectedId] = useState('walmart');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gap-theme');
      if (saved === 'dark') {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        // Unconditional default to Light Mode
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('gap-theme', next);
    } catch { }
  };

  return (
    <div className="site-shell" data-theme={theme}>
      <Navbar view={view} setView={setView} theme={theme} onToggleTheme={handleToggleTheme} />
      <main className="main-content">
        <div className="content-container">
          {view === 'portfolio' ? (
            <Portfolio selectedId={selectedId} setSelectedId={setSelectedId} />
          ) : view === 'method' ? (
            <Method />
          ) : (
            <BillionDollarQuestion onSelectCase={(id) => { setSelectedId(id); setView('portfolio'); }} />
          )}
        </div>
        <footer className="site-footer">
          <div className="footer-top">
            <div className="footer-brand-col">
              <Logo />
              <p className="footer-desc">
                A transparent, evidence-led research portfolio of CO₂e reduction opportunities across S&amp;P 500 corporations.
              </p>
            </div>
            <div className="footer-status-col">
              <div className="footer-status-pills">
                <Badge tone="live"><span className="status-dot" /> Research prototype</Badge>
                <div className="evidence-pill"><span className="status-dot" /> Snapshot · 13 Sep 2026</div>
              </div>
              <p className="footer-case-summary">5 cases · 2 scale scenarios · 3 benchmark blocks</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>the gap. © 2026 · evidence-led sustainability prototype</span>
            <span>Available technology · explicit assumptions · visible uncertainty</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
