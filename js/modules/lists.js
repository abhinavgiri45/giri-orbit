/**
 * GIRI LISTS — ENTERPRISE DATA MATRIX & KANBAN TASK TRACKER (lists.js)
 * Sovereign Structured Information Manager & Agile Board
 * Competing directly with Microsoft Lists, Airtable, & Notion Database
 * Part of the Giri Orbit Sovereign Office Suite
 * Made by Abhinav Giri (@abhinavgiri45)
 */

export function renderListsApp(container, onUpdate = null, startInEditor = false) {
  let listData = loadListData();
  let currentView = 'grid'; // 'grid' (table) or 'board' (kanban)
  let searchQuery = '';
  let filterStatus = 'all';
  let filterPriority = 'all';

  const LISTS_TEMPLATES = [
    {
      id: 'sprint-board',
      name: 'Agile Sprint Matrix & Roadmap',
      category: 'agile',
      desc: 'Complete sprint board with backlog, active engineering tasks, code review, and delivered milestones.',
      themeColor: '#7c3aed',
      items: [
        { id: 'item_1', title: 'Compile Native C++ Win32 & GDI+ Sovereign Suite', status: 'Completed', priority: 'Urgent', assignee: 'Abhinav Giri', dueDate: '2026-11-08', tag: 'Core Engineering', progress: 100 },
        { id: 'item_2', title: 'Synchronize 4.00 GB Enterprise Offline Matrix with Google Drive', status: 'Completed', priority: 'Urgent', assignee: 'DevOps Lead', dueDate: '2026-11-08', tag: 'Infrastructure', progress: 100 },
        { id: 'item_3', title: 'Enhance Ribbon Toolbar Controls across Drift, Axis, and Kinetic', status: 'In Progress', priority: 'High', assignee: 'Frontend Architect', dueDate: '2026-11-12', tag: 'User Interface', progress: 85 },
        { id: 'item_4', title: 'Authenticode Code Signing Timestamp Verification via DigiCert', status: 'Completed', priority: 'High', assignee: 'Security Lead', dueDate: '2026-11-07', tag: 'Security', progress: 100 },
        { id: 'item_5', title: 'Implement Full Offline Devanagari Hindi Font Rendering', status: 'Completed', priority: 'Normal', assignee: 'Typography Specialist', dueDate: '2026-11-06', tag: 'Typography', progress: 100 }
      ]
    },
    {
      id: 'it-inventory',
      name: 'Enterprise IT Asset Tracker',
      category: 'operations',
      desc: 'Hardware device allocations, serial numbers, warranty expirations, and department assignees.',
      themeColor: '#2563eb',
      items: [
        { id: 'item_1', title: 'Workstation ThinkPad P1 Gen 7 (RTX 4080)', status: 'In Progress', priority: 'High', assignee: 'Principal Engineer', dueDate: '2026-12-01', tag: 'Workstation', progress: 60 },
        { id: 'item_2', title: 'Dell UltraSharp 32 4K Thunderbolt Hub', status: 'Completed', priority: 'Normal', assignee: 'Lead Designer', dueDate: '2026-11-01', tag: 'Peripherals', progress: 100 },
        { id: 'item_3', title: 'YubiKey 5C NFC Enterprise Cryptographic Keys', status: 'Completed', priority: 'Urgent', assignee: 'Security Team', dueDate: '2026-10-15', tag: 'Security', progress: 100 }
      ]
    }
  ];

  if (startInEditor) {
    mountEditor();
  } else {
    mountHub();
  }

  function loadListData() {
    try {
      const saved = localStorage.getItem('orbit_list_active_doc');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load list data:', e);
    }
    return {
      id: 'list_' + Date.now(),
      title: 'Enterprise Q4 Product Roadmap & Sprint Matrix',
      themeColor: '#7c3aed',
      columns: [
        { id: 'col_status', name: 'Status', type: 'status' },
        { id: 'col_priority', name: 'Priority', type: 'priority' },
        { id: 'col_assignee', name: 'Assignee', type: 'text' },
        { id: 'col_due', name: 'Due Date', type: 'date' },
        { id: 'col_tag', name: 'Domain', type: 'tag' },
        { id: 'col_progress', name: 'Progress', type: 'progress' }
      ],
      items: [
        { id: 'item_1', title: 'Deploy High-Velocity C++ Win32 & GDI+ Sovereign Suite', status: 'Completed', priority: 'Urgent', assignee: 'Abhinav Giri', dueDate: '2026-11-08', tag: 'Core Architecture', progress: 100 },
        { id: 'item_2', title: 'Integrate 4.00 GB Enterprise Offline Suite on Google Drive', status: 'Completed', priority: 'Urgent', assignee: 'Abhinav Giri', dueDate: '2026-11-08', tag: 'Cloud Delivery', progress: 100 },
        { id: 'item_3', title: 'Overhaul PC Version Start Interfaces with High-Res Tool Icons', status: 'In Progress', priority: 'High', assignee: 'Lead UI Architect', dueDate: '2026-11-09', tag: 'UI/UX', progress: 90 },
        { id: 'item_4', title: 'Implement Full LibreOffice / MS Office Ribbon Switcher Parity', status: 'In Progress', priority: 'High', assignee: 'Desktop Specialist', dueDate: '2026-11-10', tag: 'Suite Parity', progress: 85 }
      ]
    };
  }

  function saveListData() {
    try {
      localStorage.setItem('orbit_list_active_doc', JSON.stringify(listData));
      if (onUpdate) onUpdate(listData);
    } catch (e) {
      console.warn('Failed to save list data:', e);
    }
  }

  // =========================================================================
  // VIEW 1: START INTERFACE / LISTS HUB
  // =========================================================================
  function mountHub() {
    container.innerHTML = `
      <div class="drift-hub-shell" id="lists-hub-shell" style="min-height:100vh; background:#0f172a; color:#f8fafc; font-family:'Segoe UI',system-ui,sans-serif; overflow-y:auto;">
        <!-- Top App Brand Bar in Hub Mode -->
        <div class="drift-hub-top-bar" style="height:54px; background:#1e293b; border-bottom:1px solid #334155; display:flex; align-items:center; justify-content:space-between; padding:0 24px;">
          <div class="drift-hub-brand-left" style="display:flex; align-items:center; gap:12px;">
            <img src="assets/lists-logo.png" alt="Giri Lists" style="width:28px; height:28px; object-fit:contain; border-radius:6px; filter:drop-shadow(0 2px 6px rgba(124,58,237,0.5));">
            <div class="tool-hub-brand-dropdown-wrap">
              <button class="tool-hub-brand-btn" style="display:flex; align-items:center; gap:6px; background:transparent; border:none; cursor:pointer; padding:4px 6px; border-radius:4px;" title="Switch Suite Tool">
                <span style="color:#ffffff; font-weight:700; font-size:14.5px;">Giri Lists</span>
                <span style="color:#94a3b8; font-size:11px;">▾</span>
              </button>
            </div>
            <nav class="drift-hub-nav-links" style="display:flex; gap:18px; margin-left:14px; font-size:12.5px; color:#cbd5e1;">
              <span class="drift-hub-nav-link" id="lists-nav-blank" style="cursor:pointer; font-weight:600;">Create Blank Board</span>
              <span class="drift-hub-nav-link" id="lists-nav-templates" style="cursor:pointer;">Roadmaps</span>
              <span class="drift-hub-nav-link" id="lists-nav-hub" style="cursor:pointer; color:#38bdf8;">← Suite Hub</span>
            </nav>
          </div>

          <div class="tool-hub-top-right" style="display:flex; align-items:center; gap:12px;">
            <div class="tool-hub-suite-links" style="display:flex; gap:14px; font-size:12px; color:#94a3b8;">
              <a href="#hub" style="color:#94a3b8; text-decoration:none;">Hub</a>
              <a href="#drift" style="color:#94a3b8; text-decoration:none;">Drift</a>
              <a href="#axis" style="color:#94a3b8; text-decoration:none;">Axis</a>
              <a href="#kinetic" style="color:#94a3b8; text-decoration:none;">Kinetic</a>
              <a href="#forms" style="color:#94a3b8; text-decoration:none;">Forms</a>
              <a href="#quiz" style="color:#94a3b8; text-decoration:none;">Quiz</a>
              <a href="#lists" style="color:#a855f7; text-decoration:none; font-weight:700;">Lists</a>
              <a href="#designer" style="color:#94a3b8; text-decoration:none;">Designer</a>
            </div>
          </div>
        </div>

        <!-- Sleek Dark Hero Banner -->
        <section class="drift-hub-hero" style="max-width:1300px; margin:0 auto; padding:40px 32px 32px; display:grid; grid-template-columns:1.2fr 0.8fr; gap:40px; align-items:center;">
          <div class="drift-hero-left">
            <div style="margin-bottom:14px;">
              <img src="assets/lists-logo.png" alt="Lists" style="height:42px; object-fit:contain; display:block; filter:drop-shadow(0 4px 12px rgba(124,58,237,0.6));">
            </div>
            <h1 class="drift-hero-title" style="font-size:32px; font-weight:800; color:#ffffff; margin:0 0 10px 0; letter-spacing:-0.02em;">Welcome to Giri Lists</h1>
            <p class="drift-hero-subtitle" style="font-size:14px; color:#94a3b8; line-height:1.6; margin:0 0 22px 0;">
              Sovereign agile task matrix, kanban workflow orchestrator, and milestone tracker. Zero database tracking, instant local persistence.
            </p>

            <div class="follow-journey-wrap" style="margin-bottom:24px; display:flex; flex-direction:row; flex-wrap:wrap; gap:14px; align-items:center;">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="follow-journey-label" style="font-size:10px; font-weight:700; color:#64748b; letter-spacing:0.06em;">OFFICIAL PORTAL</span>
                <a href="https://github.com/abhinavgiri45/giri-orbit" target="_blank" rel="noopener" class="giri-corp-card giri-corp-card-dark" style="display:flex; align-items:center; gap:10px; background:#1e293b; border:1px solid #334155; padding:6px 14px; border-radius:10px; text-decoration:none;">
                  <img src="assets/orbit-master-512.png" alt="Abhinav Giri" style="width:26px; height:26px; border-radius:50%;">
                  <div>
                    <strong style="font-size:12px; color:#ffffff; display:block;">Abhinav Giri</strong>
                    <span style="font-size:10.5px; color:#38bdf8;">github.com/abhinavgiri45/giri-orbit →</span>
                  </div>
                </a>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="follow-journey-label" style="font-size:10px; font-weight:700; color:#64748b; letter-spacing:0.06em;">FOLLOW THE JOURNEY</span>
                <a href="https://www.instagram.com/abhinavgiri45/" target="_blank" rel="noopener" class="giri-instagram-card giri-instagram-card-dark" style="display:flex; align-items:center; gap:10px; background:#1e293b; border:1px solid #334155; padding:6px 14px; border-radius:10px; text-decoration:none;">
                  <div style="width:26px; height:26px; border-radius:6px; background:linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:13px;">📸</div>
                  <div>
                    <strong style="font-size:12px; color:#ffffff; display:block;">@abhinavgiri45</strong>
                    <span style="font-size:10.5px; color:#94a3b8;">Connect on Instagram →</span>
                  </div>
                </a>
              </div>
            </div>

            <div class="drift-hero-actions" style="display:flex; flex-wrap:wrap; gap:12px;">
              <button class="btn-drift-create-blank" id="btn-lists-create-blank" style="background:#7c3aed; color:#ffffff; border:none; padding:10px 20px; border-radius:8px; font-weight:700; font-size:13px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 4px 14px rgba(124,58,237,0.4);">
                <span>+ Create blank board</span>
              </button>
              <button class="btn-drift-upload-file" id="btn-lists-quick-sprint" style="background:#1e293b; color:#cbd5e1; border:1px solid #334155; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">
                <span>📋 Use Sprint Board</span>
              </button>
              <button class="btn-drift-new-template-cta" id="btn-lists-export-axis" style="background:#1e293b; color:#c084fc; border:1px solid #581c87; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">
                <span>📊 Export to Axis Matrix</span>
              </button>
            </div>
          </div>

          <!-- 3D Modern Kanban Illustration -->
          <div class="drift-hero-visual" style="display:flex; justify-content:center;">
            <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:280px; filter:drop-shadow(0 10px 25px rgba(0,0,0,0.5));">
              <rect x="20" y="20" width="240" height="145" rx="10" fill="#1e293b" stroke="#334155" stroke-width="2"/>
              <!-- Column 1: Backlog -->
              <rect x="30" y="32" width="65" height="120" rx="6" fill="#0f172a"/>
              <rect x="36" y="40" width="40" height="6" rx="2" fill="#64748b"/>
              <rect x="36" y="52" width="53" height="26" rx="4" fill="#1e293b" stroke="#334155"/>
              <rect x="40" y="58" width="45" height="4" rx="1.5" fill="#e2e8f0"/>
              <rect x="40" y="66" width="22" height="4" rx="1.5" fill="#f59e0b"/>
              <!-- Column 2: In Progress -->
              <rect x="107" y="32" width="65" height="120" rx="6" fill="#0f172a"/>
              <rect x="113" y="40" width="45" height="6" rx="2" fill="#7c3aed"/>
              <rect x="113" y="52" width="53" height="34" rx="4" fill="#1e293b" stroke="#7c3aed"/>
              <rect x="117" y="58" width="45" height="4" rx="1.5" fill="#ffffff"/>
              <rect x="117" y="66" width="30" height="4" rx="1.5" fill="#ef4444"/>
              <rect x="117" y="74" width="40" height="3" rx="1.5" fill="#a855f7"/>
              <!-- Column 3: Done -->
              <rect x="184" y="32" width="65" height="120" rx="6" fill="#0f172a"/>
              <rect x="190" y="40" width="35" height="6" rx="2" fill="#10b981"/>
              <rect x="190" y="52" width="53" height="26" rx="4" fill="#1e293b" stroke="#059669"/>
              <rect x="194" y="58" width="45" height="4" rx="1.5" fill="#cbd5e1"/>
              <rect x="194" y="66" width="20" height="4" rx="1.5" fill="#10b981"/>
            </svg>
          </div>
        </section>

        <!-- Bottom Pick up Where You Left Off Bar -->
        <div style="max-width:1300px; margin:0 auto 36px; padding:0 32px;">
          <div style="background:#1e293b; border:1px solid #334155; border-radius:12px; padding:14px 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; box-shadow:0 4px 15px rgba(0,0,0,0.25);">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:36px; height:36px; border-radius:8px; background:rgba(124,58,237,0.2); border:1px solid #7c3aed; display:flex; align-items:center; justify-content:center; color:#c084fc; font-weight:800; font-size:16px;">L</div>
              <div>
                <strong style="color:#ffffff; font-size:13.5px; display:block;">Pick up where you left off in Lists</strong>
                <span style="color:#94a3b8; font-size:12px;">• ${escapeHtml(listData.title)} — ${listData.items.length} items • ${listData.columns.length} matrix columns</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <button id="btn-lists-reset-draft" style="background:#334155; color:#cbd5e1; border:none; padding:7px 14px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
                🗑 Delete Draft
              </button>
              <button id="btn-lists-resume-work" style="background:#7c3aed; color:#ffffff; border:none; padding:8px 18px; border-radius:6px; font-size:12.5px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                <span>▶ Resume Work →</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Template Gallery Carousel -->
        <section style="max-width:1300px; margin:0 auto; padding:0 32px 48px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;">
            <h2 style="font-size:18px; font-weight:700; color:#ffffff; margin:0;">Enterprise List & Kanban Templates</h2>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:18px;">
            ${LISTS_TEMPLATES.map(tpl => `
              <div class="lists-tpl-card" data-id="${tpl.id}" style="background:#1e293b; border:1px solid #334155; border-radius:12px; padding:18px; cursor:pointer; transition:all 0.2s; display:flex; flex-direction:column; justify-content:space-between;" onmouseover="this.style.borderColor='${tpl.themeColor}'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#334155'; this.style.transform='none';">
                <div>
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(124,58,237,0.2); color:#c084fc; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; margin-bottom:12px;">L</div>
                  <strong style="color:#ffffff; font-size:14.5px; display:block; margin-bottom:6px;">${escapeHtml(tpl.name)}</strong>
                  <p style="font-size:12px; color:#94a3b8; margin:0 0 14px 0; line-height:1.5;">${escapeHtml(tpl.desc)}</p>
                </div>
                <div style="font-size:11px; color:#c084fc; font-weight:600;">
                  ${tpl.items.length} Pre-configured Items • Use Template →
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    // Bind Hub Events
    container.querySelector('#btn-lists-create-blank')?.addEventListener('click', () => {
      listData = {
        id: 'list_' + Date.now(),
        title: 'Untitled Task Matrix',
        themeColor: '#7c3aed',
        columns: [
          { id: 'col_status', name: 'Status', type: 'status' },
          { id: 'col_priority', name: 'Priority', type: 'priority' },
          { id: 'col_assignee', name: 'Assignee', type: 'text' },
          { id: 'col_due', name: 'Due Date', type: 'date' }
        ],
        items: [
          { id: 'item_1', title: 'Example Task 1', status: 'To Do', priority: 'High', assignee: 'Me', dueDate: '2026-11-15', tag: 'Project', progress: 0 }
        ]
      };
      saveListData();
      mountEditor();
    });

    container.querySelector('#lists-nav-blank')?.addEventListener('click', () => { mountEditor(); });
    container.querySelector('#lists-nav-hub')?.addEventListener('click', () => {
      if (window.orbitPlatform) window.orbitPlatform.navigateTo('launcher');
    });
    container.querySelector('#btn-lists-resume-work')?.addEventListener('click', () => { mountEditor(); });
    container.querySelector('#btn-lists-quick-sprint')?.addEventListener('click', () => { applyTemplate(LISTS_TEMPLATES[0]); });
    container.querySelector('#btn-lists-export-axis')?.addEventListener('click', () => { exportListToAxis(); });

    container.querySelector('#btn-lists-reset-draft')?.addEventListener('click', () => {
      if (confirm('Reset lists draft to clean sprint matrix?')) {
        localStorage.removeItem('orbit_list_active_doc');
        listData = loadListData();
        mountHub();
      }
    });

    container.querySelectorAll('.lists-tpl-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const tpl = LISTS_TEMPLATES.find(t => t.id === id);
        if (tpl) applyTemplate(tpl);
      });
    });

    function applyTemplate(tpl) {
      listData = {
        id: 'list_' + Date.now(),
        title: tpl.name,
        themeColor: tpl.themeColor || '#7c3aed',
        columns: [
          { id: 'col_status', name: 'Status', type: 'status' },
          { id: 'col_priority', name: 'Priority', type: 'priority' },
          { id: 'col_assignee', name: 'Assignee', type: 'text' },
          { id: 'col_due', name: 'Due Date', type: 'date' },
          { id: 'col_tag', name: 'Domain', type: 'tag' },
          { id: 'col_progress', name: 'Progress', type: 'progress' }
        ],
        items: JSON.parse(JSON.stringify(tpl.items))
      };
      saveListData();
      mountEditor();
    }
  }

  // =========================================================================
  // VIEW 2: FULL-FEATURED LIST & KANBAN EDITOR
  // =========================================================================
  function mountEditor() {
    renderShell();
  }

  function renderShell() {
    container.innerHTML = `
      <div class="giri-lists-root" id="giri-lists-root" style="display:flex; flex-direction:column; width:100%; height:100%; background:#f8fafc; font-family:'Segoe UI',system-ui,sans-serif; color:#0f172a; overflow:hidden;">
        <!-- Top Application Header Bar -->
        <header class="lists-app-header" style="height:56px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 20px; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.02); z-index:10;">
          <div style="display:flex; align-items:center; gap:14px;">
            <button id="lists-btn-back-hub" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; padding:6px 10px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px; margin-right:4px;" title="Back to Lists Start Hub"><span>← Start</span></button><img src="assets/lists-logo.png" alt="Lists" style="width:32px; height:32px; object-fit:contain; border-radius:6px; filter:drop-shadow(0 2px 5px rgba(124,58,237,0.4));">
            <div>
              <input type="text" id="lists-doc-title-input" value="${escapeHtml(listData.title)}" style="font-weight:700; font-size:15px; color:#0f172a; border:1px solid transparent; border-radius:4px; padding:3px 8px; width:340px; background:transparent; transition:all 0.15s;" onfocus="this.style.borderColor='#7c3aed'; this.style.background='#ffffff';" onblur="this.style.borderColor='transparent'; this.style.background='transparent';" title="Click to rename list">
              <div style="font-size:11px; color:#64748b; padding-left:8px;">Giri Lists • Sovereign Data Matrix & Agile Tracker</div>
            </div>
          </div>

          <!-- View Switcher (Grid vs Board) -->
          <div style="display:flex; align-items:center; background:#f1f5f9; padding:3px; border-radius:8px; border:1px solid #e2e8f0;">
            <button id="lists-view-grid" class="lists-view-btn ${currentView === 'grid' ? 'active' : ''}" style="border:none; padding:6px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; background:${currentView === 'grid' ? '#ffffff' : 'transparent'}; color:${currentView === 'grid' ? listData.themeColor : '#64748b'}; box-shadow:${currentView === 'grid' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'};">
              <span>🗂️</span> <span>Grid View</span>
            </button>
            <button id="lists-view-board" class="lists-view-btn ${currentView === 'board' ? 'active' : ''}" style="border:none; padding:6px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; background:${currentView === 'board' ? '#ffffff' : 'transparent'}; color:${currentView === 'board' ? listData.themeColor : '#64748b'}; box-shadow:${currentView === 'board' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'};">
              <span>📋</span> <span>Kanban Board</span>
            </button>
          </div>

          <!-- Right Action Bar -->
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="fluent-top-action-pill" id="lists-btn-universal-cloud" onclick="window.universalCloudManager?.openCloudOpenerDialog(); return false;" title="Universal Multi-Cloud (Google Drive, OneDrive, Dropbox, Nextcloud)" style="background:rgba(2,132,199,0.12); border:1px solid #bae6fd; color:#0284c7; font-weight:700; font-size:12px; padding:5px 10px; border-radius:6px; cursor:pointer;">
              <span>🌐 Cloud</span>
            </button>
            <button class="fluent-top-action-pill giri-hindi-toggle-pill" id="btn-lists-hindi-ime" onclick="window.hindiInputTools?.toggleHindiIME(); return false;" title="Google Input Tools Hindi Transliteration (Ctrl+G)" style="background:rgba(22,163,74,0.12); border:1px solid #bbf7d0; color:#16a34a; font-weight:700; font-size:12px; padding:5px 10px; border-radius:6px; cursor:pointer;">
              <span class="gh-flag">🇮🇳</span> <span class="gh-label">हिन्दी</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-lists-devanagari-kbd" onclick="window.hindiInputTools?.toggleVirtualKeyboard(); return false;" title="Devanagari InScript Virtual Keyboard" style="background:#f1f5f9; border:1px solid #cbd5e1; padding:5px 8px; border-radius:6px; cursor:pointer;">
              <span>⌨️</span>
            </button>
            <button id="lists-btn-new-item" style="background:${listData.themeColor}; color:#ffffff; font-weight:700; font-size:13px; padding:6px 16px; border-radius:6px; border:none; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 4px rgba(124,58,237,0.3); transition:all 0.15s;">
              <span>➕</span> <span>New Item</span>
            </button>

            <!-- Export to Axis -->
            <button id="lists-btn-export-axis" style="background:#f0fdf4; border:1px solid #86efac; color:#166534; font-size:13px; font-weight:600; padding:6px 14px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px;" title="Export list to Giri Axis Spreadsheet">
              <span>📊 Export to Axis</span>
            </button>
          </div>
        </header>

        <!-- Search & Filter Ribbon -->
        <div class="lists-filter-ribbon" style="height:48px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 24px; flex-shrink:0;">
          <div style="display:flex; align-items:center; gap:12px; flex:1;">
            <!-- Search Box -->
            <div style="position:relative; width:260px;">
              <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:13px;">🔍</span>
              <input type="text" id="lists-search-input" value="${escapeHtml(searchQuery)}" placeholder="Filter tasks by keyword..." style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:6px 10px 6px 30px; font-size:13px; outline:none; background:#f8fafc;" onfocus="this.style.borderColor='#7c3aed'; this.style.background='#ffffff';" onblur="this.style.borderColor='#cbd5e1'; this.style.background='#f8fafc';">
            </div>

            <!-- Status Filter -->
            <select id="lists-filter-status" style="padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; font-size:13px; font-weight:600; color:#475569; cursor:pointer; outline:none;">
              <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>Status: All</option>
              <option value="Not Started" ${filterStatus === 'Not Started' ? 'selected' : ''}>Not Started</option>
              <option value="In Progress" ${filterStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Under Review" ${filterStatus === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Completed" ${filterStatus === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>

            <!-- Priority Filter -->
            <select id="lists-filter-priority" style="padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; font-size:13px; font-weight:600; color:#475569; cursor:pointer; outline:none;">
              <option value="all" ${filterPriority === 'all' ? 'selected' : ''}>Priority: All</option>
              <option value="Urgent" ${filterPriority === 'Urgent' ? 'selected' : ''}>Urgent</option>
              <option value="High" ${filterPriority === 'High' ? 'selected' : ''}>High</option>
              <option value="Medium" ${filterPriority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="Low" ${filterPriority === 'Low' ? 'selected' : ''}>Low</option>
            </select>
          </div>

          <!-- Total count indicator -->
          <div style="font-size:13px; font-weight:600; color:#64748b;" id="lists-total-indicator">
            ${getFilteredItems().length} of ${listData.items.length} items
          </div>
        </div>

        <!-- Main Workspace View Container -->
        <main class="lists-view-container" id="lists-view-container" style="flex:1; overflow:auto; padding:20px 24px;">
          <!-- Dynamically populated based on currentView -->
        </main>
      </div>
    `;

    bindHeaderAndFilterEvents();
    renderActiveView();
  }

  function getFilteredItems() {
    return listData.items.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesAssignee = (item.assignee || '').toLowerCase().includes(q);
        const matchesTag = (item.tag || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesAssignee && !matchesTag) return false;
      }
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
      return true;
    });
  }

  function bindHeaderAndFilterEvents() {
    const root = container.querySelector('#giri-lists-root');
    if (!root) return;

    root.querySelector('#lists-doc-title-input')?.addEventListener('input', (e) => {
      listData.title = e.target.value;
      saveListData();
    });

    root.querySelector('#lists-view-grid')?.addEventListener('click', () => {
      currentView = 'grid';
      renderShell();
    });

    root.querySelector('#lists-view-board')?.addEventListener('click', () => {
      currentView = 'board';
      renderShell();
    });

    root.querySelector('#lists-btn-new-item')?.addEventListener('click', () => {
      promptAddNewItem();
    });

    root.querySelector('#lists-btn-export-axis')?.addEventListener('click', () => {
      exportListToAxis();
    });

    root.querySelector('#lists-search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderActiveView();
      updateCountIndicator();
    });

    root.querySelector('#lists-filter-status')?.addEventListener('change', (e) => {
      filterStatus = e.target.value;
      renderActiveView();
      updateCountIndicator();
    });

    root.querySelector('#lists-filter-priority')?.addEventListener('change', (e) => {
      filterPriority = e.target.value;
      renderActiveView();
      updateCountIndicator();
    });
  }

  function updateCountIndicator() {
    const el = container.querySelector('#lists-total-indicator');
    if (el) el.textContent = `${getFilteredItems().length} of ${listData.items.length} items`;
  }

  function renderActiveView() {
    const viewContainer = container.querySelector('#lists-view-container');
    if (!viewContainer) return;

    if (currentView === 'grid') {
      renderGridView(viewContainer);
    } else {
      renderBoardView(viewContainer);
    }
  }

  /* =========================================================================
   * GRID / TABLE MATRIX VIEW
   * ========================================================================= */
  function renderGridView(el) {
    const items = getFilteredItems();

    el.innerHTML = `
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
          <thead>
            <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; color:#475569; font-weight:700;">
              <th style="padding:12px 16px; width:40px;">#</th>
              <th style="padding:12px 16px; min-width:280px;">Task / Title</th>
              <th style="padding:12px 16px; width:140px;">Status</th>
              <th style="padding:12px 16px; width:120px;">Priority</th>
              <th style="padding:12px 16px; width:140px;">Assignee</th>
              <th style="padding:12px 16px; width:120px;">Due Date</th>
              <th style="padding:12px 16px; width:130px;">Domain</th>
              <th style="padding:12px 16px; width:140px;">Progress</th>
              <th style="padding:12px 16px; width:60px; text-align:center;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${items.length === 0 ? `
              <tr>
                <td colspan="9" style="text-align:center; padding:40px; color:#94a3b8;">
                  No items match the current search or filters. Click "New Item" to add one!
                </td>
              </tr>
            ` : items.map((item, idx) => `
              <tr class="lists-row" data-itemid="${item.id}" style="border-bottom:1px solid #f1f5f9; transition:background 0.1s;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='#ffffff';">
                <td style="padding:12px 16px; color:#94a3b8; font-weight:600;">${idx + 1}</td>
                
                <!-- Title (Inline Editable) -->
                <td style="padding:12px 16px;">
                  <input type="text" class="row-title-input" value="${escapeHtml(item.title)}" style="width:100%; border:none; background:transparent; font-weight:700; color:#1e293b; font-size:13px; outline:none;" onfocus="this.style.borderBottom='1px solid #7c3aed';" onblur="this.style.borderBottom='none';">
                </td>

                <!-- Status Pill Dropdown -->
                <td style="padding:12px 16px;">
                  <select class="row-status-select" style="${getStatusStyle(item.status)}; border-radius:12px; border:1px solid transparent; padding:3px 10px; font-size:12px; font-weight:700; cursor:pointer; outline:none;">
                    <option value="Not Started" ${item.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                    <option value="In Progress" ${item.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Under Review" ${item.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                    <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
                  </select>
                </td>

                <!-- Priority Badge Dropdown -->
                <td style="padding:12px 16px;">
                  <select class="row-priority-select" style="${getPriorityStyle(item.priority)}; border-radius:6px; border:1px solid transparent; padding:3px 8px; font-size:11px; font-weight:700; cursor:pointer; outline:none;">
                    <option value="Urgent" ${item.priority === 'Urgent' ? 'selected' : ''}>🔥 Urgent</option>
                    <option value="High" ${item.priority === 'High' ? 'selected' : ''}>⚡ High</option>
                    <option value="Medium" ${item.priority === 'Medium' ? 'selected' : ''}>🔹 Medium</option>
                    <option value="Low" ${item.priority === 'Low' ? 'selected' : ''}>☕ Low</option>
                  </select>
                </td>

                <!-- Assignee -->
                <td style="padding:12px 16px;">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <div style="width:24px; height:24px; border-radius:50%; background:#e0e7ff; color:#4338ca; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center;">
                      ${(item.assignee || 'U').charAt(0).toUpperCase()}
                    </div>
                    <input type="text" class="row-assignee-input" value="${escapeHtml(item.assignee || '')}" style="width:90px; border:none; background:transparent; font-size:12px; color:#334155; outline:none;" placeholder="Unassigned">
                  </div>
                </td>

                <!-- Due Date -->
                <td style="padding:12px 16px;">
                  <input type="date" class="row-due-input" value="${item.dueDate || ''}" style="border:1px solid transparent; background:transparent; font-size:12px; color:#475569; outline:none; cursor:pointer;">
                </td>

                <!-- Domain Tag -->
                <td style="padding:12px 16px;">
                  <span style="background:#f1f5f9; color:#475569; font-size:11px; font-weight:600; padding:2px 8px; border-radius:4px; border:1px solid #e2e8f0;">
                    ${escapeHtml(item.tag || 'General')}
                  </span>
                </td>

                <!-- Progress Bar & Slider -->
                <td style="padding:12px 16px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="flex:1; height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden;">
                      <div style="width:${item.progress || 0}%; height:100%; background:${item.progress === 100 ? '#16a34a' : listData.themeColor}; border-radius:3px;"></div>
                    </div>
                    <span style="font-size:11px; font-weight:700; color:#64748b; width:30px;">${item.progress || 0}%</span>
                  </div>
                </td>

                <!-- Delete Action -->
                <td style="padding:12px 16px; text-align:center;">
                  <button class="row-btn-delete" title="Delete Task" style="background:transparent; border:none; color:#cbd5e1; cursor:pointer; font-size:16px; transition:color 0.15s;" onmouseover="this.style.color='#ef4444';" onmouseout="this.style.color='#cbd5e1';">×</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Add Item Row Trigger -->
        <div style="padding:10px 16px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex;">
          <button id="grid-btn-quick-add" style="background:transparent; border:none; color:${listData.themeColor}; font-weight:700; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px;">
            <span>➕</span> <span>Add new row</span>
          </button>
        </div>
      </div>
    `;

    bindGridRowEvents(el);
  }

  function getStatusStyle(status) {
    if (status === 'Completed') return 'background:#f0fdf4; color:#166534;';
    if (status === 'In Progress') return 'background:#eff6ff; color:#1e40af;';
    if (status === 'Under Review') return 'background:#fffbeb; color:#b45309;';
    return 'background:#f1f5f9; color:#475569;';
  }

  function getPriorityStyle(priority) {
    if (priority === 'Urgent') return 'background:#fff1f2; color:#be123c; border-color:#fecdd3;';
    if (priority === 'High') return 'background:#fff7ed; color:#c2410c; border-color:#ffedd5;';
    if (priority === 'Medium') return 'background:#eff6ff; color:#1d4ed8; border-color:#dbeafe;';
    return 'background:#f8fafc; color:#64748b; border-color:#e2e8f0;';
  }

  function bindGridRowEvents(el) {
    el.querySelector('#grid-btn-quick-add')?.addEventListener('click', () => {
      promptAddNewItem();
    });

    el.querySelectorAll('.lists-row').forEach(row => {
      const id = row.dataset.itemid;
      const item = listData.items.find(i => i.id === id);
      if (!item) return;

      row.querySelector('.row-title-input')?.addEventListener('input', (e) => {
        item.title = e.target.value;
        saveListData();
      });

      row.querySelector('.row-status-select')?.addEventListener('change', (e) => {
        item.status = e.target.value;
        if (item.status === 'Completed') item.progress = 100;
        else if (item.status === 'Not Started') item.progress = 0;
        saveListData();
        renderGridView(el);
      });

      row.querySelector('.row-priority-select')?.addEventListener('change', (e) => {
        item.priority = e.target.value;
        saveListData();
        renderGridView(el);
      });

      row.querySelector('.row-assignee-input')?.addEventListener('input', (e) => {
        item.assignee = e.target.value;
        saveListData();
      });

      row.querySelector('.row-due-input')?.addEventListener('change', (e) => {
        item.dueDate = e.target.value;
        saveListData();
      });

      row.querySelector('.row-btn-delete')?.addEventListener('click', () => {
        listData.items = listData.items.filter(i => i.id !== id);
        saveListData();
        renderGridView(el);
        updateCountIndicator();
      });
    });
  }

  /* =========================================================================
   * KANBAN BOARD VIEW
   * ========================================================================= */
  function renderBoardView(el) {
    const columns = [
      { key: 'Not Started', label: 'To Do', color: '#64748b' },
      { key: 'In Progress', label: 'In Progress', color: '#2563eb' },
      { key: 'Under Review', label: 'Under Review', color: '#d97706' },
      { key: 'Completed', label: 'Done', color: '#16a34a' }
    ];

    const filtered = getFilteredItems();

    el.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(4, minmax(260px, 1fr)); gap:18px; align-items:start;">
        ${columns.map(col => {
          const colItems = filtered.filter(i => i.status === col.key);
          return `
            <div class="kanban-column" data-status="${col.key}" style="background:#f1f5f9; border-radius:12px; border:1px solid #e2e8f0; display:flex; flex-direction:column; min-height:480px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
              <!-- Column Header -->
              <div style="padding:14px 16px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:8px; height:8px; border-radius:50%; background:${col.color};"></div>
                  <span style="font-size:14px; font-weight:800; color:#1e293b;">${col.label}</span>
                </div>
                <span style="font-size:12px; font-weight:700; color:#64748b; background:#ffffff; border-radius:10px; padding:2px 8px; border:1px solid #e2e8f0;">${colItems.length}</span>
              </div>

              <!-- Cards Container -->
              <div class="kanban-cards-area" style="padding:12px; display:flex; flex-direction:column; gap:10px; flex:1;">
                ${colItems.map(item => `
                  <div class="kanban-card" data-itemid="${item.id}" style="background:#ffffff; border-radius:8px; border:1px solid #e2e8f0; padding:14px; box-shadow:0 2px 5px rgba(0,0,0,0.03); display:flex; flex-direction:column; gap:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="${getPriorityStyle(item.priority)}; border-radius:4px; padding:2px 6px; font-size:10px; font-weight:700;">${item.priority}</span>
                      <span style="font-size:11px; color:#94a3b8; font-weight:600;">${item.dueDate || 'No date'}</span>
                    </div>

                    <div style="font-size:13px; font-weight:700; color:#0f172a; line-height:1.4;">${escapeHtml(item.title)}</div>

                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f8fafc; padding-top:8px;">
                      <div style="display:flex; align-items:center; gap:6px;">
                        <div style="width:20px; height:20px; border-radius:50%; background:#e0e7ff; color:#4338ca; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center;">
                          ${(item.assignee || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span style="font-size:11px; color:#64748b;">${escapeHtml(item.assignee || 'Unassigned')}</span>
                      </div>

                      <!-- 1-Click State Move Arrows -->
                      <div style="display:flex; gap:4px;">
                        ${col.key !== 'Not Started' ? `<button class="kb-btn-prev" data-id="${item.id}" title="Move back" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; width:22px; height:22px; font-size:11px; cursor:pointer; color:#64748b;">◀</button>` : ''}
                        ${col.key !== 'Completed' ? `<button class="kb-btn-next" data-id="${item.id}" title="Advance forward" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; width:22px; height:22px; font-size:11px; cursor:pointer; color:#64748b;">▶</button>` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Quick Add Button inside column -->
              <div style="padding:10px 12px; border-top:1px solid #e2e8f0;">
                <button class="kb-btn-add-in-col" data-status="${col.key}" style="width:100%; background:#ffffff; border:1px dashed #cbd5e1; border-radius:6px; padding:6px; font-size:12px; font-weight:700; color:#64748b; cursor:pointer;" onmouseover="this.style.borderColor='${listData.themeColor}'; this.style.color='${listData.themeColor}';" onmouseout="this.style.borderColor='#cbd5e1'; this.style.color='#64748b';">
                  + Add Card
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    bindBoardEvents(el);
  }

  function bindBoardEvents(el) {
    const colOrder = ['Not Started', 'In Progress', 'Under Review', 'Completed'];

    el.querySelectorAll('.kb-btn-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = listData.items.find(i => i.id === id);
        if (!item) return;
        const curIdx = colOrder.indexOf(item.status);
        if (curIdx > 0) {
          item.status = colOrder[curIdx - 1];
          saveListData();
          renderBoardView(el);
        }
      });
    });

    el.querySelectorAll('.kb-btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = listData.items.find(i => i.id === id);
        if (!item) return;
        const curIdx = colOrder.indexOf(item.status);
        if (curIdx < colOrder.length - 1) {
          item.status = colOrder[curIdx + 1];
          if (item.status === 'Completed') item.progress = 100;
          saveListData();
          renderBoardView(el);
        }
      });
    });

    el.querySelectorAll('.kb-btn-add-in-col').forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.status;
        promptAddNewItem(status);
      });
    });
  }

  /* =========================================================================
   * ITEM CREATION & EXPORT
   * ========================================================================= */
  function promptAddNewItem(defaultStatus = 'Not Started') {
    const title = prompt('Enter Task / Item Name:', 'New Enterprise Work Item');
    if (!title || !title.trim()) return;

    const newItem = {
      id: 'item_' + Date.now(),
      title: title.trim(),
      status: defaultStatus,
      priority: 'Medium',
      assignee: 'Abhinav Giri',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      tag: 'General',
      progress: 0
    };

    listData.items.push(newItem);
    saveListData();
    renderActiveView();
    updateCountIndicator();
  }

  function exportListToAxis() {
    if (listData.items.length === 0) {
      alert('No items to export!');
      return;
    }

    const headers = ['Task ID', 'Title', 'Status', 'Priority', 'Assignee', 'Due Date', 'Domain', 'Progress'];
    const rows = listData.items.map(item => [
      item.id,
      `"${item.title.replace(/"/g, '""')}"`,
      item.status,
      item.priority,
      `"${(item.assignee || '').replace(/"/g, '""')}"`,
      item.dueDate || '',
      `"${(item.tag || '').replace(/"/g, '""')}"`,
      `${item.progress || 0}%`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_List.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.orbitPlatform && typeof window.orbitPlatform.triggerToast === 'function') {
      window.orbitPlatform.triggerToast('Exported Lists Matrix to CSV (Giri Axis Ready)', 'green');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
