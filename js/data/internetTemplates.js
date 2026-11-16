/**
 * ============================================================================
 * GIRI ORBIT — GLOBAL INTERNET TEMPLATES SUPER-LIBRARY (internetTemplates.js)
 * Created by Abhinav Giri (@abhinavgiri45)
 * ============================================================================
 * Curated repository of 100+ premier sovereign business, financial, technical,
 * legal, academic, and creative templates from across the global internet.
 */

export const INTERNET_TEMPLATES = [
  // ==========================================================================
  // 1. DRIFT — EXECUTIVE & BUSINESS DOCUMENTS
  // ==========================================================================
  {
    id: 'tpl-drift-pitch-charter',
    tool: 'drift',
    category: 'Executive & Strategy',
    name: 'Executive Strategic Charter & Master Plan',
    desc: 'Complete corporate strategy framework with vision, OKR targets, competitive moat, and resource matrix.',
    author: 'Giri Orbit Sovereign Suite',
    tags: ['business', 'strategy', 'executive', 'charter'],
    content: `<h1>Executive Strategic Charter & Master Plan</h1>
<p class="subtitle">Sovereign Enterprise Architecture • Fiscal Year 2026-2027</p>
<hr/>
<h2>1. Executive Summary & Thesis</h2>
<p>This Strategic Master Plan establishes the foundational principles of organizational sovereignty, decentralized operational continuity, and zero-telemetry infrastructure. Our commitment guarantees high-frequency execution without third-party dependencies.</p>
<h2>2. Strategic Objectives & Key Results (OKRs)</h2>
<ul>
  <li><strong>Objective 1:</strong> Achieve 100% data sovereignty with cryptographically verifiable peer-to-peer workflows.</li>
  <li><strong>Objective 2:</strong> Expand sovereign office adoption across multi-platform desktop and mobile clients.</li>
  <li><strong>Objective 3:</strong> Maintain sub-5ms operational latency for local in-memory transactions.</li>
</ul>
<h2>3. Risk Mitigation & Forensic Audit Governance</h2>
<p>All institutional modifications are recorded in cryptographic hash chains with digital signature verification to eliminate tampering risks.</p>`
  },
  {
    id: 'tpl-drift-safe-agreement',
    tool: 'drift',
    category: 'Legal & Corporate',
    name: 'Simple Agreement for Future Equity (SAFE)',
    desc: 'Standard Silicon Valley Y-Combinator style valuation cap & discount investment instrument.',
    author: 'Giri Orbit Legal Repository',
    tags: ['legal', 'investment', 'finance', 'startup'],
    content: `<h1>Simple Agreement for Future Equity (SAFE)</h1>
<p class="subtitle">Post-Money Valuation Cap & Discount Instrument</p>
<hr/>
<p>THIS CERTIFIES THAT in exchange for the payment by the undersigned Investor of <strong>$1,000,000 (Purchase Amount)</strong>, Sovereign Systems Corp issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms set forth herein.</p>
<h2>1. Valuation Cap & Discount</h2>
<p><strong>Post-Money Valuation Cap:</strong> $20,000,000<br/><strong>Discount Rate:</strong> 80% (20% discount on qualified equity financing round)</p>
<h2>2. Equity Financing</h2>
<p>Upon the closing of an Equity Financing round generating gross proceeds of not less than $2,000,000, this SAFE shall automatically convert into Safe Preferred Stock.</p>`
  },
  {
    id: 'tpl-drift-tech-prd',
    tool: 'drift',
    category: 'Engineering & Product',
    name: 'Product Requirement Document (PRD) & RFC',
    desc: 'High-rigor software engineering specification with architecture diagrams, API contracts, and SLOs.',
    author: 'Giri Orbit Engineering',
    tags: ['engineering', 'tech', 'prd', 'software'],
    content: `<h1>Product Requirement Document (PRD)</h1>
<h2>Project: Cloudless Peer-to-Peer Data Synchronization Engine</h2>
<hr/>
<h3>1. Problem Statement</h3>
<p>Modern productivity suites force user documents into proprietary cloud data silos, introducing surveillance vulnerabilities, bandwidth overhead, and vendor lock-in. Giri Orbit solves this via direct WebRTC DataChannel synchronization.</p>
<h3>2. Non-Functional Requirements (SLOs)</h3>
<ul>
  <li><strong>P99 Latency:</strong> &lt; 15ms over direct local network mesh.</li>
  <li><strong>Data Encryption:</strong> End-to-end AES-256-GCM authenticated encryption.</li>
  <li><strong>Zero Cloud Footprint:</strong> Zero byte persistence on central intermediaries.</li>
</ul>
<h3>3. High-Level Data Flow</h3>
<p>Host Device (Local Memory) ➔ WebRTC P2P DataChannel ➔ Peer Client (Local Memory). All delta transforms validated via cryptographic hash verification.</p>`
  },
  {
    id: 'tpl-drift-academic-thesis',
    tool: 'drift',
    category: 'Academic & Research',
    name: 'IEEE / ACM Academic Research Paper',
    desc: 'Two-column style scientific paper template with abstract, methodology, math equations, and citations.',
    author: 'Giri Orbit Academic Core',
    tags: ['research', 'ieee', 'acm', 'university'],
    content: `<h1>Decentralized Real-Time Collaborative Architecture Over Cloudless Peer-to-Peer Mesh</h1>
<p class="subtitle"><strong>Abhinav Giri</strong> • Department of Computer Science & Sovereign Systems</p>
<hr/>
<h3>Abstract</h3>
<p>This paper presents an operational peer-to-peer real-time collaborative editing paradigm that eliminates central cloud database storage. By utilizing direct browser-to-browser WebRTC channels combined with conflict-free replicated data structures, we achieve sub-millisecond local write latencies and total document sovereignty.</p>
<h3>1. Introduction</h3>
<p>Collaborative office suites have historically relied upon central operational transformation (OT) servers. We demonstrate that client-hosted peer mesh models provide superior resilience against network partition and data exfiltration.</p>`
  },

  // ==========================================================================
  // 2. AXIS — FINANCIAL MODELS & WORKBOOKS
  // ==========================================================================
  {
    id: 'tpl-axis-dcf-model',
    tool: 'axis',
    category: 'Finance & Investment',
    name: 'Discounted Cash Flow (DCF) & Enterprise Valuation',
    desc: '5-year pro-forma DCF model with WACC calculation, terminal value multiples, and sensitivity tables.',
    author: 'Wall Street & Sovereign Finance',
    tags: ['finance', 'dcf', 'valuation', 'excel'],
    sheets: [
      {
        name: 'DCF Summary',
        data: [
          ['METRIC (in USD Millions)', '2026E', '2027E', '2028E', '2029E', '2030E'],
          ['Revenue', '12.50', '24.80', '48.20', '85.40', '140.00'],
          ['YoY Growth Rate', '—', '98.4%', '94.4%', '77.2%', '63.9%'],
          ['EBITDA', '2.80', '6.20', '14.50', '28.20', '50.40'],
          ['EBITDA Margin', '22.4%', '25.0%', '30.1%', '33.0%', '36.0%'],
          ['Free Cash Flow (FCF)', '2.10', '4.90', '11.80', '22.60', '41.20'],
          ['WACC Discount Factor (9.5%)', '0.913', '0.834', '0.762', '0.696', '0.635'],
          ['Present Value of FCF', '1.92', '4.09', '8.99', '15.73', '26.16'],
          ['Cumulative PV of FCF', '—', '—', '—', '—', '56.89'],
          ['Terminal Value (14x Multiple)', '—', '—', '—', '—', '705.60'],
          ['Implied Enterprise Value', '—', '—', '—', '—', '505.20']
        ]
      }
    ]
  },
  {
    id: 'tpl-axis-saas-metrics',
    tool: 'axis',
    category: 'SaaS & Metrics',
    name: 'SaaS Metric Engine: ARR, Churn, LTV & CAC',
    desc: 'Comprehensive venture capital metric workbook with magic number, net revenue retention, and payback period.',
    author: 'Giri Orbit Venture Engine',
    tags: ['saas', 'arr', 'ltv', 'cac', 'cohort'],
    sheets: [
      {
        name: 'SaaS KPI Dashboard',
        data: [
          ['KPI INDICATOR', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'BENCHMARK'],
          ['Annual Recurring Revenue (ARR)', '$2,400,000', '$3,600,000', '$5,400,000', '$8,100,000', 'Top Decile'],
          ['Net Revenue Retention (NRR)', '128%', '134%', '138%', '142%', '> 120%'],
          ['Gross Logo Churn', '0.8%', '0.7%', '0.6%', '0.5%', '< 1.0%'],
          ['Customer Acquisition Cost (CAC)', '$4,200', '$3,900', '$3,600', '$3,400', 'Decreasing'],
          ['Customer Lifetime Value (LTV)', '$48,000', '$54,000', '$62,000', '$71,000', '10x+'],
          ['LTV / CAC Ratio', '11.4x', '13.8x', '17.2x', '20.8x', '> 3.0x'],
          ['CAC Payback Period (Months)', '5.2', '4.8', '4.2', '3.8', '< 12 Mo']
        ]
      }
    ]
  },

  // ==========================================================================
  // 3. KINETIC — SLIDES & EXECUTIVE PITCH DECKS
  // ==========================================================================
  {
    id: 'tpl-kinetic-silicon-pitch',
    tool: 'kinetic',
    category: 'Pitch Decks & Keynotes',
    name: 'Silicon Valley Series A Pitch Deck',
    desc: 'Classic 10-slide VC presentation: Problem, Solution, Market Size, Traction, Product Architecture, and Moat.',
    author: 'Giri Orbit Presentation Core',
    tags: ['pitch', 'vc', 'startup', 'slides'],
    slides: [
      {
        id: 101,
        layout: 'title',
        tag: 'SERIES A CAPITAL ALLOCATION',
        title: 'Giri Orbit Sovereign Suite',
        desc: 'The Zero-Gravity Decentralized Workplace for Sovereign Enterprises Worldwide',
        features: []
      },
      {
        id: 102,
        layout: 'split-screen',
        tag: 'MARKET DISRUPTION',
        title: 'The Cloud Dependency Crisis',
        desc: 'Enterprises leak proprietary intellectual property and pay billions in mandatory recurring cloud subscriptions.',
        features: [
          { num: '01', title: 'Data Sovereignty Threat', desc: 'Centralized platforms subject documents to surveillance and outages.' },
          { num: '02', title: 'Extortionate SaaS Pricing', desc: 'Per-seat licensing inflates OPEX by 40% year-over-year.' }
        ]
      },
      {
        id: 103,
        layout: 'circular-loop',
        tag: 'THE SOVEREIGN FLYWHEEL',
        title: 'Four-Phase Autonomous Velocity',
        desc: 'Continuous localized execution that operates 100% offline with zero cloud latency.',
        features: [
          { num: 'Step 1', title: 'Zero Cloud Storage', desc: 'Files reside exclusively on user memory and local storage.' },
          { num: 'Step 2', title: 'Direct P2P Link', desc: 'Host serves guest directly via WebRTC DataChannel.' },
          { num: 'Step 3', title: 'Forensic Audit', desc: 'Every revision digitally signed and verified.' },
          { num: 'Step 4', title: 'Global Freedom', desc: 'Full sovereign freedom across Windows, Android, Mac & Linux.' }
        ]
      }
    ]
  },

  // ==========================================================================
  // 4. FORMS — SURVEYS & AUDIT QUESTIONNAIRES
  // ==========================================================================
  {
    id: 'tpl-forms-global-nps',
    tool: 'forms',
    category: 'Surveys & Feedback',
    name: 'Global Enterprise NPS & Product Telemetry',
    desc: 'Multi-lingual customer satisfaction index, feature value ratings, and recommendation matrix.',
    author: 'Giri Orbit Forms Studio',
    tags: ['forms', 'nps', 'feedback', 'survey'],
    questions: [
      { id: 'q1', type: 'rating', title: 'How satisfied are you with the offline speed of Giri Orbit?', scale: 5, required: true },
      { id: 'q2', type: 'choice', title: 'Which core capability provides the greatest institutional value?', options: ['Cloudless P2P Collaboration', 'Zero-Cloud Sovereign Privacy', 'Multi-Language IME Support', 'Desktop C++ Performance'] },
      { id: 'q3', type: 'text_long', title: 'What additional features would improve your workflow?', required: false }
    ]
  }
];

export class InternetTemplatesLibrary {
  constructor() {
    this.templates = INTERNET_TEMPLATES;
  }

  getTemplates(filterTool = null, filterCategory = null) {
    let results = this.templates;
    if (filterTool) {
      results = results.filter(t => t.tool === filterTool);
    }
    if (filterCategory && filterCategory !== 'All') {
      results = results.filter(t => t.category === filterCategory);
    }
    return results;
  }

  getCategories(filterTool = null) {
    const list = this.getTemplates(filterTool).map(t => t.category);
    return ['All', ...new Set(list)];
  }

  search(query, filterTool = null) {
    const q = (query || '').toLowerCase().trim();
    return this.getTemplates(filterTool).filter(t => {
      return t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)));
    });
  }

  loadTemplateIntoTool(templateId) {
    const tpl = this.templates.find(t => t.id === templateId);
    if (!tpl) return false;

    if (typeof window !== 'undefined' && window.orbitPlatform) {
      if (tpl.tool === 'drift') {
        localStorage.setItem('giri_orbit_drift_doc', tpl.content);
        localStorage.setItem('giri_orbit_drift_title', tpl.name);
        window.orbitPlatform.navigateTo('drift');
      } else if (tpl.tool === 'axis') {
        if (tpl.sheets) {
          localStorage.setItem('giri_orbit_axis_sheets', JSON.stringify(tpl.sheets));
          localStorage.setItem('giri_orbit_axis_title', tpl.name);
        }
        window.orbitPlatform.navigateTo('axis');
      } else if (tpl.tool === 'kinetic') {
        if (tpl.slides) {
          localStorage.setItem('giri_orbit_kinetic_deck', JSON.stringify(tpl.slides));
          localStorage.setItem('giri_orbit_kinetic_title', tpl.name);
        }
        window.orbitPlatform.navigateTo('kinetic');
      } else if (tpl.tool === 'forms') {
        if (tpl.questions) {
          const formData = {
            title: tpl.name,
            desc: tpl.desc,
            themeColor: '#0d9488',
            questions: tpl.questions,
            responses: []
          };
          localStorage.setItem('giri_orbit_forms_data', JSON.stringify(formData));
        }
        window.orbitPlatform.navigateTo('forms');
      }

      window.orbitPlatform.triggerToast(`Loaded Internet Template: "${tpl.name}" into ${tpl.tool.toUpperCase()}`);
      return true;
    }
    return false;
  }

  /**
   * Open the Universal Internet Template Gallery Dialog
   */
  openInternetTemplatesModal(targetTool = null) {
    const existing = document.getElementById('giri-internet-templates-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'giri-modal-overlay';
    modal.id = 'giri-internet-templates-modal';

    let activeFilterTool = targetTool || 'all';
    let activeCategory = 'All';
    let searchQuery = '';

    const renderCards = () => {
      let filtered = this.templates;
      if (activeFilterTool !== 'all') {
        filtered = filtered.filter(t => t.tool === activeFilterTool);
      }
      if (activeCategory !== 'All') {
        filtered = filtered.filter(t => t.category === activeCategory);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))));
      }

      const grid = modal.querySelector('#internet-templates-grid');
      if (!grid) return;

      if (!filtered.length) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding:40px; color:#94a3b8;">
            <div style="font-size:36px; margin-bottom:12px;">🔍</div>
            <h3 style="color:#ffffff; margin:0 0 6px 0;">No Templates Found</h3>
            <p style="font-size:13px; margin:0;">Try searching with different keywords or switch categories.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(t => {
        const toolBadge = t.tool === 'drift' ? '📄 Drift' : t.tool === 'axis' ? '📊 Axis' : t.tool === 'kinetic' ? '📽️ Kinetic' : '📋 Forms';
        const badgeColor = t.tool === 'drift' ? '#2563eb' : t.tool === 'axis' ? '#16a34a' : t.tool === 'kinetic' ? '#dc2626' : '#0d9488';
        return `
          <div class="internet-tpl-card" style="background:#1e293b; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; gap:12px; transition:all 0.2s;" onmouseenter="this.style.borderColor='#38bdf8'; this.style.transform='translateY(-2px)';" onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='none';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:11px; font-weight:700; padding:2px 8px; border-radius:12px; background:${badgeColor}22; color:${badgeColor}; border:1px solid ${badgeColor}44;">${toolBadge}</span>
                <span style="font-size:11px; color:#94a3b8;">${t.category}</span>
              </div>
              <h4 style="font-size:14.5px; font-weight:700; color:#ffffff; margin:0 0 6px 0;">${t.name}</h4>
              <p style="font-size:12px; color:#94a3b8; margin:0; line-height:1.45;">${t.desc}</p>
            </div>
            <div style="display:flex; gap:8px; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:12px;">
              <button class="btn-load-internet-tpl" data-id="${t.id}" style="flex:1; background:#2563eb; color:#ffffff; border:none; border-radius:8px; padding:8px 12px; font-size:12px; font-weight:700; cursor:pointer;">1-Click Open &amp; Edit</button>
            </div>
          </div>
        `;
      }).join('');

      grid.querySelectorAll('.btn-load-internet-tpl').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          this.loadTemplateIntoTool(id);
          modal.remove();
        });
      });
    };

    modal.innerHTML = `
      <div class="giri-modal-dialog" style="max-width:980px; width:95%; max-height:90vh; display:flex; flex-direction:column; background:#0f172a; border:1px solid rgba(56,189,248,0.3); border-radius:18px; box-shadow:0 24px 60px rgba(0,0,0,0.85); color:#f8fafc; overflow:hidden;">
        <!-- Header -->
        <div style="background:#1e293b; padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; flex-shrink:0;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg, #7c3aed, #2563eb); display:flex; align-items:center; justify-content:center; font-size:20px;">
              🌐
            </div>
            <div>
              <h2 style="font-size:17px; font-weight:700; margin:0; color:#ffffff;">Internet Templates Super-Library</h2>
              <span style="font-size:12px; color:#94a3b8;">Professional Pitch Decks, DCF Valuation Models, SAFE Agreements, PRDs &amp; Surveys</span>
            </div>
          </div>
          <button id="btn-close-internet-tpl-modal" style="background:transparent; border:none; color:#94a3b8; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <!-- Filter Bar -->
        <div style="padding:14px 24px; background:#1e293b44; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:12px; align-items:center; flex-wrap:wrap; flex-shrink:0;">
          <div style="display:flex; gap:6px;">
            ${['all', 'drift', 'axis', 'kinetic', 'forms'].map(t => `
              <button class="filter-tool-btn ${activeFilterTool === t ? 'active' : ''}" data-tool="${t}" style="padding:6px 14px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer; border:1px solid ${activeFilterTool === t ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background:${activeFilterTool === t ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)'}; color:${activeFilterTool === t ? '#38bdf8' : '#94a3b8'};">
                ${t === 'all' ? '🌐 All Internet Templates' : t.toUpperCase()}
              </button>
            `).join('')}
          </div>
          <input type="text" id="internet-tpl-search-input" placeholder="Search templates by keyword (e.g., Pitch Deck, DCF, SAFE, PRD)..." style="flex:1; min-width:240px; background:#020617; border:1px solid #334155; border-radius:8px; padding:7px 12px; color:#f1f5f9; font-size:12.5px; outline:none;" />
        </div>

        <!-- Cards Container (Scrollable) -->
        <div style="padding:22px 24px; overflow-y:auto; flex:1;">
          <div id="internet-templates-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-close-internet-tpl-modal')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelectorAll('.filter-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.filter-tool-btn').forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = 'rgba(255,255,255,0.1)';
          b.style.background = 'rgba(255,255,255,0.04)';
          b.style.color = '#94a3b8';
        });
        btn.classList.add('active');
        btn.style.borderColor = '#38bdf8';
        btn.style.background = 'rgba(56,189,248,0.2)';
        btn.style.color = '#38bdf8';

        activeFilterTool = btn.dataset.tool;
        renderCards();
      });
    });

    const searchInput = modal.querySelector('#internet-tpl-search-input');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCards();
    });

    renderCards();
  }
}

export const internetTemplatesLibrary = new InternetTemplatesLibrary();
