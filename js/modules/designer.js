/**
 * GIRI DESIGNER — VECTOR GRAPHICS & CREATIVE BANNER COMPOSER (designer.js)
 * Sovereign Visual Design Studio & Social Asset Generator
 * Giri Orbit Designer Creative Vector Studio
 * Part of the Giri Orbit Sovereign Office Suite
 * Made by Abhinav Giri (@abhinavgiri45)
 */

export function renderDesignerApp(container, onUpdate = null, startInEditor = true) {
  let designData = loadDesignData();
  let selectedElementId = null;
  let activeSidebarTab = 'templates'; // 'templates', 'shapes', 'text', 'background'
  let canvasScale = 0.5; // Display scale factor for large preset dimensions

  const DESIGN_TEMPLATES = [
    {
      id: 'keynote-banner',
      name: 'Executive Keynote Announcement',
      category: 'social',
      preset: 'landscape',
      width: 1200,
      height: 630,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
      desc: 'High-impact 1200x630 banner for keynote presentations and social broadcasts.',
      elements: [
        { id: 'el_1', type: 'shape_rect', x: 80, y: 60, width: 1040, height: 510, fill: 'rgba(255, 255, 255, 0.03)', stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2, rx: 16 },
        { id: 'el_2', type: 'text', x: 120, y: 150, text: 'GIRI ORBIT SOVEREIGN SUITE', fontSize: 20, fill: '#38bdf8', fontFamily: 'Segoe UI', fontWeight: 'bold', letterSpacing: '0.15em' },
        { id: 'el_3', type: 'text', x: 120, y: 220, text: 'The Zero-Gravity Enterprise Office', fontSize: 48, fill: '#ffffff', fontFamily: 'Segoe UI', fontWeight: '800' },
        { id: 'el_4', type: 'text', x: 120, y: 310, text: '100% Offline Standalone Performance with Native C++ & In-Memory Speed', fontSize: 22, fill: '#94a3b8', fontFamily: 'Segoe UI', fontWeight: 'normal' },
        { id: 'el_5', type: 'shape_circle', x: 950, y: 180, width: 180, height: 180, fill: 'radial-gradient(circle, #db2777 0%, #7c3aed 100%)', opacity: 0.7 }
      ]
    },
    {
      id: 'tech-summit',
      name: 'Global Tech Summit Poster',
      category: 'poster',
      preset: 'square',
      width: 1080,
      height: 1080,
      background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
      desc: 'Square 1080x1080 modern tech event graphic with glowing geometric typography.',
      elements: [
        { id: 'el_1', type: 'shape_rect', x: 60, y: 60, width: 960, height: 960, fill: 'transparent', stroke: '#38bdf8', strokeWidth: 3, rx: 20 },
        { id: 'el_2', type: 'text', x: 120, y: 200, text: 'SUMMIT 2026', fontSize: 32, fill: '#a855f7', fontFamily: 'Segoe UI', fontWeight: 'bold' },
        { id: 'el_3', type: 'text', x: 120, y: 300, text: 'Sovereign Digital Infrastructure', fontSize: 56, fill: '#ffffff', fontFamily: 'Segoe UI', fontWeight: '900' },
        { id: 'el_4', type: 'text', x: 120, y: 460, text: 'Keynote Speaker: Abhinav Giri (@abhinavgiri45)', fontSize: 26, fill: '#38bdf8', fontFamily: 'Segoe UI', fontWeight: '600' }
      ]
    },
    {
      id: 'linkedin-hero',
      name: 'LinkedIn Business Profile Hero',
      category: 'social',
      preset: 'landscape',
      width: 1584,
      height: 396,
      background: 'linear-gradient(90deg, #0f172a 0%, #0369a1 100%)',
      desc: 'Standard 1584x396 executive banner for LinkedIn profiles and enterprise company pages.',
      elements: [
        { id: 'el_1', type: 'shape_rect', x: 40, y: 30, width: 1504, height: 336, fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(56,189,248,0.3)', strokeWidth: 1.5, rx: 12 },
        { id: 'el_2', type: 'text', x: 100, y: 150, text: 'ABHINAV GIRI // ENTERPRISE ARCHITECTURE', fontSize: 22, fill: '#38bdf8', fontFamily: 'Segoe UI', fontWeight: 'bold' },
        { id: 'el_3', type: 'text', x: 100, y: 230, text: 'Building the Sovereign Desktop Workspace & High-Velocity Silicon Runtimes', fontSize: 34, fill: '#ffffff', fontFamily: 'Segoe UI', fontWeight: '800' }
      ]
    },
    {
      id: 'youtube-titlecard',
      name: 'YouTube 4K Broadcast Titlecard',
      category: 'social',
      preset: 'landscape',
      width: 1280,
      height: 720,
      background: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)',
      desc: 'Crisp 1280x720 video thumbnail with high-contrast typography and red accent pill.',
      elements: [
        { id: 'el_1', type: 'shape_rect', x: 60, y: 60, width: 1160, height: 600, fill: 'transparent', stroke: '#ef4444', strokeWidth: 4, rx: 24 },
        { id: 'el_2', type: 'shape_rect', x: 100, y: 120, width: 220, height: 48, fill: '#ef4444', stroke: 'none', strokeWidth: 0, rx: 8 },
        { id: 'el_3', type: 'text', x: 130, y: 152, text: 'OFFICIAL RELEASE', fontSize: 18, fill: '#ffffff', fontFamily: 'Segoe UI', fontWeight: 'bold' },
        { id: 'el_4', type: 'text', x: 100, y: 280, text: 'NEXT-GEN OFFICE SUITE', fontSize: 62, fill: '#ffffff', fontFamily: 'Segoe UI', fontWeight: '900' },
        { id: 'el_5', type: 'text', x: 100, y: 380, text: 'Zero Cloud. Zero Lag. Total Sovereignty.', fontSize: 30, fill: '#38bdf8', fontFamily: 'Segoe UI', fontWeight: '700' }
      ]
    },
    {
      id: 'infographic-flow',
      name: 'System Architecture Infographic',
      category: 'poster',
      preset: 'portrait',
      width: 800,
      height: 1200,
      background: 'linear-gradient(180deg, #090d16 0%, #111827 100%)',
      desc: 'Tall 800x1200 vertical infographic layout for diagrams, engineering pipelines, and workflows.',
      elements: [
        { id: 'el_1', type: 'text', x: 60, y: 100, text: 'SYSTEM ARCHITECTURE', fontSize: 18, fill: '#10b981', fontFamily: 'Segoe UI', fontWeight: 'bold' },
        { id: 'el_2', type: 'text', x: 60, y: 160, text: 'Client-Silicon In-Memory Pipeline', fontSize: 36, fill: '#ffffff', fontFamily: 'Segoe UI', fontWeight: '800' },
        { id: 'el_3', type: 'shape_rect', x: 60, y: 240, width: 680, height: 220, fill: 'rgba(16, 185, 129, 0.08)', stroke: '#10b981', strokeWidth: 2, rx: 16 },
        { id: 'el_4', type: 'text', x: 100, y: 300, text: 'Tier 1: Web Crypto Hardware Acceleration', fontSize: 24, fill: '#34d399', fontFamily: 'Segoe UI', fontWeight: 'bold' },
        { id: 'el_5', type: 'text', x: 100, y: 360, text: 'AES-256-GCM authenticated cipher with 100k PBKDF2 iterations.', fontSize: 16, fill: '#94a3b8', fontFamily: 'Segoe UI', fontWeight: 'normal' }
      ]
    },
    {
      id: 'sovereign-certificate',
      name: 'Certificate of Sovereign Excellence',
      category: 'poster',
      preset: 'landscape',
      width: 1920,
      height: 1080,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      desc: 'Prestige 1920x1080 landscape certificate with ornate gold borders and formal seal.',
      elements: [
        { id: 'el_1', type: 'shape_rect', x: 100, y: 80, width: 1720, height: 920, fill: 'transparent', stroke: '#eab308', strokeWidth: 5, rx: 12 },
        { id: 'el_2', type: 'text', x: 580, y: 260, text: 'CERTIFICATE OF EXCELLENCE', fontSize: 52, fill: '#facc15', fontFamily: 'Times New Roman', fontWeight: 'bold' },
        { id: 'el_3', type: 'text', x: 680, y: 360, text: 'THIS FORMAL ACCREDITATION IS AWARDED TO', fontSize: 18, fill: '#94a3b8', fontFamily: 'Segoe UI', fontWeight: 'bold' },
        { id: 'el_4', type: 'text', x: 740, y: 480, text: 'ABHINAV GIRI', fontSize: 64, fill: '#ffffff', fontFamily: 'Times New Roman', fontWeight: 'bold' },
        { id: 'el_5', type: 'text', x: 620, y: 600, text: 'For Outstanding Contributions to Sovereign Software Architecture', fontSize: 22, fill: '#38bdf8', fontFamily: 'Segoe UI', fontWeight: 'normal' }
      ]
    }
  ];

  if (startInEditor) {
    mountEditor();
  } else {
    mountHub();
  }

  function loadDesignData() {
    try {
      const saved = localStorage.getItem('orbit_designer_active_doc');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load designer data:', e);
    }
    return {
      id: 'design_' + Date.now(),
      title: 'Executive Keynote Announcement Banner',
      preset: 'landscape',
      width: 1200,
      height: 630,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
      elements: [
        { id: 'el_1', type: 'shape_rect', x: 100, y: 80, width: 1000, height: 470, fill: 'rgba(255, 255, 255, 0.03)', stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2, rx: 16 },
        { id: 'el_2', type: 'text', x: 140, y: 160, text: 'SOVEREIGN PRODUCTIVITY', fontSize: 18, fill: '#db2777', fontFamily: 'Segoe UI', fontWeight: 'bold', letterSpacing: '0.12em' },
        { id: 'el_3', type: 'text', x: 140, y: 230, text: 'Giri Orbit Studio Suite v14.4', fontSize: 44, fill: '#ffffff', fontFamily: 'Segoe UI', fontWeight: '800' },
        { id: 'el_4', type: 'text', x: 140, y: 310, text: 'Complete Offline Enterprise Suite • Author: Abhinav Giri (@abhinavgiri45)', fontSize: 20, fill: '#94a3b8', fontFamily: 'Segoe UI', fontWeight: 'normal' },
        { id: 'el_5', type: 'shape_circle', x: 920, y: 200, width: 160, height: 160, fill: '#ec4899', opacity: 0.6 }
      ]
    };
  }

  function saveDesignData() {
    try {
      localStorage.setItem('orbit_designer_active_doc', JSON.stringify(designData));
      if (onUpdate) onUpdate(designData);
    } catch (e) {
      console.warn('Failed to save design data:', e);
    }
  }

  // =========================================================================
  // VIEW 1: START INTERFACE / DESIGNER HUB
  // =========================================================================
  function mountHub() {
    container.innerHTML = `
      <div class="drift-hub-shell" id="designer-hub-shell" style="min-height:100vh; background:#0f172a; color:#f8fafc; font-family:'Segoe UI',system-ui,sans-serif; overflow-y:auto;">
        <!-- Top App Brand Bar in Hub Mode -->
        <div class="drift-hub-top-bar" style="height:54px; background:#1e293b; border-bottom:1px solid #334155; display:flex; align-items:center; justify-content:space-between; padding:0 24px;">
          <div class="drift-hub-brand-left" style="display:flex; align-items:center; gap:12px;">
            <img src="assets/designer-logo.png" alt="Giri Designer" style="width:28px; height:28px; object-fit:contain; border-radius:6px; filter:drop-shadow(0 2px 6px rgba(219,39,119,0.5));">
            <div class="tool-hub-brand-dropdown-wrap">
              <button class="tool-hub-brand-btn" style="display:flex; align-items:center; gap:6px; background:transparent; border:none; cursor:pointer; padding:4px 6px; border-radius:4px;" title="Switch Suite Tool">
                <span style="color:#ffffff; font-weight:700; font-size:14.5px;">Giri Designer</span>
                <span style="color:#94a3b8; font-size:11px;">▾</span>
              </button>
            </div>
            <nav class="drift-hub-nav-links" style="display:flex; gap:18px; margin-left:14px; font-size:12.5px; color:#cbd5e1;">
              <span class="drift-hub-nav-link" id="designer-nav-blank" style="cursor:pointer; font-weight:600;">Create Blank Canvas</span>
              <span class="drift-hub-nav-link" id="designer-nav-templates" style="cursor:pointer;">Presets</span>
              <span class="drift-hub-nav-link" id="designer-nav-hub" style="cursor:pointer; color:#38bdf8;">← Suite Hub</span>
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
              <a href="#lists" style="color:#94a3b8; text-decoration:none;">Lists</a>
              <a href="#designer" style="color:#f472b6; text-decoration:none; font-weight:700;">Designer</a>
            </div>
          </div>
        </div>

        <!-- Sleek Dark Hero Banner -->
        <section class="drift-hub-hero" style="max-width:1300px; margin:0 auto; padding:40px 32px 32px; display:grid; grid-template-columns:1.2fr 0.8fr; gap:40px; align-items:center;">
          <div class="drift-hero-left">
            <div style="margin-bottom:14px;">
              <img src="assets/designer-logo.png" alt="Designer" style="height:42px; object-fit:contain; display:block; filter:drop-shadow(0 4px 12px rgba(219,39,119,0.6));">
            </div>
            <h1 class="drift-hero-title" style="font-size:32px; font-weight:800; color:#ffffff; margin:0 0 10px 0; letter-spacing:-0.02em;">Welcome to Giri Designer</h1>
            <p class="drift-hero-subtitle" style="font-size:14px; color:#94a3b8; line-height:1.6; margin:0 0 22px 0;">
              Sovereign vector graphic studio, social keynote banner composer, and creative canvas. Zero database tracking, instant local persistence.
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
              <button class="btn-drift-create-blank" id="btn-designer-create-blank" style="background:#db2777; color:#ffffff; border:none; padding:10px 20px; border-radius:8px; font-weight:700; font-size:13px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 4px 14px rgba(219,39,119,0.4);">
                <span>+ Create blank canvas</span>
              </button>
              <button class="btn-drift-upload-file" id="btn-designer-quick-keynote" style="background:#1e293b; color:#cbd5e1; border:1px solid #334155; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">
                <span>🎨 Use Keynote Banner Preset</span>
              </button>
              <button class="btn-drift-new-template-cta" id="btn-designer-quick-png" style="background:#1e293b; color:#f472b6; border:1px solid #831843; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">
                <span>🖼️ High-Res PNG Export</span>
              </button>
            </div>
          </div>

          <!-- 3D Modern Designer Illustration -->
          <div class="drift-hero-visual" style="display:flex; justify-content:center;">
            <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:280px; filter:drop-shadow(0 10px 25px rgba(0,0,0,0.5));">
              <rect x="25" y="20" width="230" height="145" rx="10" fill="#1e293b" stroke="#334155" stroke-width="2"/>
              <!-- Canvas Artboard inside -->
              <rect x="45" y="35" width="190" height="115" rx="6" fill="#0f172a" stroke="#db2777" stroke-width="1.5"/>
              <rect x="60" y="50" width="80" height="50" rx="4" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899"/>
              <circle cx="180" cy="75" r="24" fill="#a855f7" fill-opacity="0.3" stroke="#a855f7"/>
              <rect x="60" y="115" width="110" height="8" rx="2" fill="#ffffff"/>
              <rect x="60" y="128" width="60" height="5" rx="2" fill="#38bdf8"/>
              <!-- Pen tool cursor -->
              <polygon points="195,115 210,135 200,140 188,125" fill="#f59e0b"/>
            </svg>
          </div>
        </section>

        <!-- Bottom Pick up Where You Left Off Bar -->
        <div style="max-width:1300px; margin:0 auto 36px; padding:0 32px;">
          <div style="background:#1e293b; border:1px solid #334155; border-radius:12px; padding:14px 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; box-shadow:0 4px 15px rgba(0,0,0,0.25);">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:36px; height:36px; border-radius:8px; background:rgba(219,39,119,0.2); border:1px solid #db2777; display:flex; align-items:center; justify-content:center; color:#f472b6; font-weight:800; font-size:16px;">D</div>
              <div>
                <strong style="color:#ffffff; font-size:13.5px; display:block;">Pick up where you left off in Designer</strong>
                <span style="color:#94a3b8; font-size:12px;">• ${escapeHtml(designData.title)} — ${designData.width} × ${designData.height} px • ${designData.elements.length} layer elements</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <button id="btn-designer-reset-draft" style="background:#334155; color:#cbd5e1; border:none; padding:7px 14px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
                🗑 Delete Draft
              </button>
              <button id="btn-designer-resume-work" style="background:#db2777; color:#ffffff; border:none; padding:8px 18px; border-radius:6px; font-size:12.5px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                <span>▶ Resume Work →</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Template Gallery Carousel -->
        <section style="max-width:1300px; margin:0 auto; padding:0 32px 48px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;">
            <h2 style="font-size:18px; font-weight:700; color:#ffffff; margin:0;">Creative Vector Canvas Presets</h2>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:18px;">
            ${DESIGN_TEMPLATES.map(tpl => `
              <div class="designer-tpl-card" data-id="${tpl.id}" style="background:#1e293b; border:1px solid #334155; border-radius:12px; padding:18px; cursor:pointer; transition:all 0.2s; display:flex; flex-direction:column; justify-content:space-between;" onmouseover="this.style.borderColor='#db2777'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#334155'; this.style.transform='none';">
                <div>
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(219,39,119,0.2); color:#f472b6; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; margin-bottom:12px;">D</div>
                  <strong style="color:#ffffff; font-size:14.5px; display:block; margin-bottom:6px;">${escapeHtml(tpl.name)}</strong>
                  <p style="font-size:12px; color:#94a3b8; margin:0 0 14px 0; line-height:1.5;">${escapeHtml(tpl.desc)}</p>
                </div>
                <div style="font-size:11px; color:#f472b6; font-weight:600;">
                  ${tpl.width} × ${tpl.height} px • Use Preset →
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    // Bind Hub Events
    container.querySelector('#btn-designer-create-blank')?.addEventListener('click', () => {
      designData = {
        id: 'design_' + Date.now(),
        title: 'Untitled Design Canvas',
        preset: 'landscape',
        width: 1200,
        height: 630,
        background: '#0f172a',
        elements: [
          { id: 'el_1', type: 'text', x: 200, y: 250, text: 'Click to Edit Headline', fontSize: 36, fill: '#ffffff', fontFamily: 'Segoe UI', fontWeight: 'bold' }
        ]
      };
      saveDesignData();
      mountEditor();
    });

    container.querySelector('#designer-nav-blank')?.addEventListener('click', () => { mountEditor(); });
    container.querySelector('#designer-nav-hub')?.addEventListener('click', () => {
      if (window.orbitPlatform) window.orbitPlatform.navigateTo('launcher');
    });
    container.querySelector('#btn-designer-resume-work')?.addEventListener('click', () => { mountEditor(); });
    container.querySelector('#btn-designer-quick-keynote')?.addEventListener('click', () => { applyTemplate(DESIGN_TEMPLATES[0]); });
    container.querySelector('#btn-designer-quick-png')?.addEventListener('click', () => { exportCanvasToPng(); });

    container.querySelector('#btn-designer-reset-draft')?.addEventListener('click', () => {
      if (confirm('Reset designer draft to clean blank canvas?')) {
        localStorage.removeItem('orbit_designer_active_doc');
        designData = loadDesignData();
        mountHub();
      }
    });

    container.querySelectorAll('.designer-tpl-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const tpl = DESIGN_TEMPLATES.find(t => t.id === id);
        if (tpl) applyTemplate(tpl);
      });
    });

    function applyTemplate(tpl) {
      designData = {
        id: 'design_' + Date.now(),
        title: tpl.name,
        preset: tpl.preset,
        width: tpl.width,
        height: tpl.height,
        background: tpl.background,
        elements: JSON.parse(JSON.stringify(tpl.elements))
      };
      saveDesignData();
      mountEditor();
    }
  }

  // =========================================================================
  // VIEW 2: FULL-FEATURED CANVAS & VECTOR EDITOR
  // =========================================================================
  function mountEditor() {
    renderShell();
  }

  function renderShell() {
    container.innerHTML = `
      <div class="giri-designer-root" id="giri-designer-root" style="display:flex; flex-direction:column; width:100%; height:100%; background:#0f172a; font-family:'Segoe UI',system-ui,sans-serif; color:#f8fafc; overflow:hidden;">
        <!-- Top Application Header Bar -->
        <header class="designer-app-header" style="height:56px; background:#1e293b; border-bottom:1px solid #334155; display:flex; align-items:center; justify-content:space-between; padding:0 20px; flex-shrink:0; z-index:10;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:34px; height:34px; border-radius:6px; background:#db2777; display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:800; font-size:17px; box-shadow:0 2px 5px rgba(219,39,119,0.4);">G</div>
            <div>
              <input type="text" id="designer-doc-title-input" value="${escapeHtml(designData.title)}" style="font-weight:700; font-size:15px; color:#f8fafc; border:1px solid transparent; border-radius:4px; padding:3px 8px; width:340px; background:transparent; transition:all 0.15s;" onfocus="this.style.borderColor='#ec4899'; this.style.background='#0f172a';" onblur="this.style.borderColor='transparent'; this.style.background='transparent';" title="Click to rename design">
              <div style="font-size:11px; color:#94a3b8; padding-left:8px;">Giri Designer • Sovereign Visual & Graphic Studio</div>
            </div>
          </div>

          <!-- Dimension Preset Selector -->
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; font-weight:700; color:#94a3b8;">Preset:</span>
            <select id="designer-preset-select" style="background:#0f172a; border:1px solid #475569; color:#f8fafc; padding:5px 12px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; outline:none;">
              <option value="landscape" ${designData.preset === 'landscape' ? 'selected' : ''}>Landscape Banner (1200 × 630)</option>
              <option value="square" ${designData.preset === 'square' ? 'selected' : ''}>Square Social Post (1080 × 1080)</option>
              <option value="banner" ${designData.preset === 'banner' ? 'selected' : ''}>Widescreen HD (1920 × 1080)</option>
              <option value="story" ${designData.preset === 'story' ? 'selected' : ''}>Story / Reel (1080 × 1920)</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="fluent-top-action-pill" id="designer-btn-universal-cloud" onclick="window.universalCloudManager?.openCloudOpenerDialog(); return false;" title="Universal Multi-Cloud (Google Drive, OneDrive, Dropbox, Nextcloud)" style="background:rgba(2,132,199,0.18); border:1px solid rgba(2,132,199,0.4); color:#38bdf8; font-weight:700; font-size:12px; padding:6px 12px; border-radius:6px; cursor:pointer;">
              <span>🌐 Cloud</span>
            </button>
            <button class="fluent-top-action-pill giri-hindi-toggle-pill" id="btn-designer-hindi-ime" onclick="window.hindiInputTools?.toggleHindiIME(); return false;" title="Google Input Tools Hindi Transliteration (Ctrl+G)" style="background:rgba(22,163,74,0.18); border:1px solid rgba(22,163,74,0.4); color:#4ade80; font-weight:700; font-size:12px; padding:6px 12px; border-radius:6px; cursor:pointer;">
              <span class="gh-flag">🇮🇳</span> <span class="gh-label">हिन्दी</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-designer-devanagari-kbd" onclick="window.hindiInputTools?.toggleVirtualKeyboard(); return false;" title="Devanagari InScript Virtual Keyboard" style="background:#334155; border:1px solid #475569; color:#f8fafc; padding:6px 10px; border-radius:6px; cursor:pointer;">
              <span>⌨️</span>
            </button>
            <button id="designer-btn-export-png" style="background:#db2777; color:#ffffff; font-weight:700; font-size:13px; padding:6px 18px; border-radius:6px; border:none; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 4px rgba(219,39,119,0.3); transition:all 0.15s;">
              <span>💾</span> <span>Export PNG</span>
            </button>
            <button id="designer-btn-export-svg" style="background:#334155; border:1px solid #475569; color:#f8fafc; font-size:13px; font-weight:600; padding:6px 14px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              <span>📐 Export SVG</span>
            </button>
          </div>
        </header>

        <!-- Main Body: Left Sidebar + Center Stage Canvas -->
        <div style="display:flex; flex:1; min-height:0; overflow:hidden;">
          <!-- Left Sidebar Panel -->
          <aside style="width:300px; background:#1e293b; border-right:1px solid #334155; display:flex; flex-direction:column; flex-shrink:0;">
            <!-- Sidebar Navigation Tabs -->
            <div style="display:flex; border-bottom:1px solid #334155;">
              <button class="des-side-tab ${activeSidebarTab === 'templates' ? 'active' : ''}" data-tab="templates" style="flex:1; padding:12px 0; border:none; background:${activeSidebarTab === 'templates' ? '#0f172a' : 'transparent'}; color:${activeSidebarTab === 'templates' ? '#ec4899' : '#94a3b8'}; font-weight:700; font-size:12px; cursor:pointer; border-bottom:${activeSidebarTab === 'templates' ? '2px solid #ec4899' : 'none'};">
                Templates
              </button>
              <button class="des-side-tab ${activeSidebarTab === 'shapes' ? 'active' : ''}" data-tab="shapes" style="flex:1; padding:12px 0; border:none; background:${activeSidebarTab === 'shapes' ? '#0f172a' : 'transparent'}; color:${activeSidebarTab === 'shapes' ? '#ec4899' : '#94a3b8'}; font-weight:700; font-size:12px; cursor:pointer; border-bottom:${activeSidebarTab === 'shapes' ? '2px solid #ec4899' : 'none'};">
                Shapes
              </button>
              <button class="des-side-tab ${activeSidebarTab === 'text' ? 'active' : ''}" data-tab="text" style="flex:1; padding:12px 0; border:none; background:${activeSidebarTab === 'text' ? '#0f172a' : 'transparent'}; color:${activeSidebarTab === 'text' ? '#ec4899' : '#94a3b8'}; font-weight:700; font-size:12px; cursor:pointer; border-bottom:${activeSidebarTab === 'text' ? '2px solid #ec4899' : 'none'};">
                Text
              </button>
              <button class="des-side-tab ${activeSidebarTab === 'background' ? 'active' : ''}" data-tab="background" style="flex:1; padding:12px 0; border:none; background:${activeSidebarTab === 'background' ? '#0f172a' : 'transparent'}; color:${activeSidebarTab === 'background' ? '#ec4899' : '#94a3b8'}; font-weight:700; font-size:12px; cursor:pointer; border-bottom:${activeSidebarTab === 'background' ? '2px solid #ec4899' : 'none'};">
                Background
              </button>
            </div>

            <!-- Tab Content -->
            <div id="designer-sidebar-content" style="flex:1; overflow-y:auto; padding:16px;">
              <!-- Populated by renderSidebarContent() -->
            </div>
          </aside>

          <!-- Center Stage Area -->
          <main style="flex:1; background:#0b0f19; overflow:auto; display:flex; align-items:center; justify-content:center; padding:32px; position:relative;" id="designer-stage-wrapper">
            <div id="designer-canvas-container" style="position:relative; width:${designData.width * canvasScale}px; height:${designData.height * canvasScale}px; background:${designData.background}; border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,0.6); overflow:hidden; user-select:none;">
              <!-- Elements rendered dynamically -->
            </div>
          </main>
        </div>
      </div>
    `;

    bindHeaderEvents();
    renderSidebarContent();
    renderCanvasElements();
  }

  function bindHeaderEvents() {
    const root = container.querySelector('#giri-designer-root');
    if (!root) return;

    root.querySelector('#designer-doc-title-input')?.addEventListener('input', (e) => {
      designData.title = e.target.value;
      saveDesignData();
    });

    root.querySelector('#designer-preset-select')?.addEventListener('change', (e) => {
      const val = e.target.value;
      designData.preset = val;
      if (val === 'landscape') { designData.width = 1200; designData.height = 630; canvasScale = 0.55; }
      else if (val === 'square') { designData.width = 1080; designData.height = 1080; canvasScale = 0.45; }
      else if (val === 'banner') { designData.width = 1920; designData.height = 1080; canvasScale = 0.4; }
      else if (val === 'story') { designData.width = 1080; designData.height = 1920; canvasScale = 0.35; }
      saveDesignData();
      renderShell();
    });

    root.querySelectorAll('.des-side-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSidebarTab = btn.dataset.tab;
        renderShell();
      });
    });

    root.querySelector('#designer-btn-export-png')?.addEventListener('click', () => {
      exportCanvasToPng();
    });

    root.querySelector('#designer-btn-export-svg')?.addEventListener('click', () => {
      exportCanvasToSvg();
    });
  }

  /* =========================================================================
   * SIDEBAR TOOLS & PRESETS
   * ========================================================================= */
  function renderSidebarContent() {
    const el = container.querySelector('#designer-sidebar-content');
    if (!el) return;

    if (activeSidebarTab === 'templates') {
      const templates = [
        {
          name: 'Executive Keynote',
          bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
          title: 'The Sovereign Future\nof Office Computing',
          badge: 'GIRI ORBIT 2026'
        },
        {
          name: 'Cyberpunk Neon Launch',
          bg: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          title: 'Unstoppable Speed.\nZero Telemetry.',
          badge: 'ENTERPRISE ARCHITECTURE'
        },
        {
          name: 'Emerald Minimalist',
          bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          title: 'Sovereign Precision\nin Financial Matrices',
          badge: 'GIRI AXIS FORMULAS'
        },
        {
          name: 'Sunset Gradient',
          bg: 'linear-gradient(135deg, #831843 0%, #3b0764 100%)',
          title: 'Creative Freedom\nWithout Subscriptions',
          badge: 'DESIGNER STUDIO'
        }
      ];

      el.innerHTML = `
        <div style="font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Pre-Made Design Templates</div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${templates.map((tpl, idx) => `
            <div class="des-template-card" data-tidx="${idx}" style="background:${tpl.bg}; border:1px solid #334155; border-radius:10px; padding:14px; cursor:pointer; transition:transform 0.15s, border-color 0.15s;" onmouseover="this.style.transform='scale(1.02)'; this.style.borderColor='#ec4899';" onmouseout="this.style.transform='scale(1)'; this.style.borderColor='#334155';">
              <span style="background:rgba(255,255,255,0.15); color:#ffffff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px;">${tpl.badge}</span>
              <div style="font-size:13px; font-weight:800; color:#ffffff; margin-top:6px; line-height:1.3;">${tpl.title.replace('\n', ' ')}</div>
              <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">${tpl.name}</div>
            </div>
          `).join('')}
        </div>
      `;

      el.querySelectorAll('.des-template-card').forEach(card => {
        card.addEventListener('click', () => {
          const tidx = parseInt(card.dataset.tidx, 10);
          const tpl = templates[tidx];
          designData.background = tpl.bg;
          if (designData.elements[2]) designData.elements[2].text = tpl.title;
          if (designData.elements[1]) designData.elements[1].text = tpl.badge;
          saveDesignData();
          renderShell();
        });
      });

    } else if (activeSidebarTab === 'shapes') {
      el.innerHTML = `
        <div style="font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Add Geometric Elements</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <button class="des-add-shape" data-type="rect" style="background:#0f172a; border:1px solid #334155; border-radius:8px; padding:14px 10px; color:#f8fafc; font-size:12px; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px;">
            <div style="width:28px; height:20px; background:#ec4899; border-radius:3px;"></div>
            <span>Rectangle</span>
          </button>
          <button class="des-add-shape" data-type="circle" style="background:#0f172a; border:1px solid #334155; border-radius:8px; padding:14px 10px; color:#f8fafc; font-size:12px; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px;">
            <div style="width:24px; height:24px; background:#8b5cf6; border-radius:50%;"></div>
            <span>Circle</span>
          </button>
          <button class="des-add-shape" data-type="badge" style="background:#0f172a; border:1px solid #334155; border-radius:8px; padding:14px 10px; color:#f8fafc; font-size:12px; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px;">
            <div style="width:36px; height:14px; background:#db2777; border-radius:7px;"></div>
            <span>Badge Pill</span>
          </button>
          <button class="des-add-shape" data-type="divider" style="background:#0f172a; border:1px solid #334155; border-radius:8px; padding:14px 10px; color:#f8fafc; font-size:12px; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px;">
            <div style="width:36px; height:3px; background:#38bdf8; border-radius:2px;"></div>
            <span>Accent Line</span>
          </button>
        </div>
      `;

      el.querySelectorAll('.des-add-shape').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.dataset.type;
          let newEl = null;
          if (type === 'rect') {
            newEl = { id: 'el_' + Date.now(), type: 'shape_rect', x: 200, y: 200, width: 240, height: 160, fill: '#ec4899', stroke: '#ffffff', strokeWidth: 1, borderRadius: 12 };
          } else if (type === 'circle') {
            newEl = { id: 'el_' + Date.now(), type: 'shape_circle', x: 300, y: 200, width: 160, height: 160, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 1 };
          } else if (type === 'badge') {
            newEl = { id: 'el_' + Date.now(), type: 'badge', x: 200, y: 200, width: 180, height: 36, text: 'FEATURED 2026', fill: '#0d9488', color: '#ffffff', fontSize: 12, fontWeight: '800', borderRadius: 18 };
          } else if (type === 'divider') {
            newEl = { id: 'el_' + Date.now(), type: 'shape_rect', x: 150, y: 250, width: 400, height: 4, fill: '#38bdf8', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 };
          }
          if (newEl) {
            designData.elements.push(newEl);
            selectedElementId = newEl.id;
            saveDesignData();
            renderCanvasElements();
          }
        });
      });

    } else if (activeSidebarTab === 'text') {
      el.innerHTML = `
        <div style="font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Add Typography</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="des-add-text" data-level="h1" style="background:#0f172a; border:1px solid #334155; border-radius:8px; padding:12px 14px; text-align:left; cursor:pointer;">
            <div style="font-size:20px; font-weight:900; color:#ffffff;">Add a Heading</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Large bold impact title (48px)</div>
          </button>
          <button class="des-add-text" data-level="h2" style="background:#0f172a; border:1px solid #334155; border-radius:8px; padding:12px 14px; text-align:left; cursor:pointer;">
            <div style="font-size:16px; font-weight:700; color:#cbd5e1;">Add a Subheading</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Supporting narrative (24px)</div>
          </button>
          <button class="des-add-text" data-level="body" style="background:#0f172a; border:1px solid #334155; border-radius:8px; padding:12px 14px; text-align:left; cursor:pointer;">
            <div style="font-size:13px; font-weight:400; color:#94a3b8;">Add a little bit of body text</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Paragraph detail text (16px)</div>
          </button>
        </div>
      `;

      el.querySelectorAll('.des-add-text').forEach(btn => {
        btn.addEventListener('click', () => {
          const level = btn.dataset.level;
          let newEl = null;
          if (level === 'h1') {
            newEl = { id: 'el_' + Date.now(), type: 'text', x: 150, y: 150, width: 600, height: 80, text: 'Heading Text Title', fontSize: 44, fontWeight: '900', color: '#ffffff', fontFamily: 'Segoe UI' };
          } else if (level === 'h2') {
            newEl = { id: 'el_' + Date.now(), type: 'text', x: 150, y: 220, width: 500, height: 50, text: 'Supporting Subheading Idea', fontSize: 24, fontWeight: '700', color: '#cbd5e1', fontFamily: 'Segoe UI' };
          } else {
            newEl = { id: 'el_' + Date.now(), type: 'text', x: 150, y: 280, width: 450, height: 50, text: 'Body copy describing your sovereign value proposition in complete detail.', fontSize: 16, fontWeight: '400', color: '#94a3b8', fontFamily: 'Segoe UI' };
          }
          if (newEl) {
            designData.elements.push(newEl);
            selectedElementId = newEl.id;
            saveDesignData();
            renderCanvasElements();
          }
        });
      });

    } else if (activeSidebarTab === 'background') {
      const gradients = [
        'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
        'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
        'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
        'linear-gradient(135deg, #831843 0%, #3b0764 100%)',
        'linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)',
        'linear-gradient(135deg, #701a75 0%, #4a044e 100%)',
        '#0f172a',
        '#ffffff'
      ];

      el.innerHTML = `
        <div style="font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:12px;">Background Gradients & Colors</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          ${gradients.map((g, idx) => `
            <div class="des-bg-choice" data-bg="${escapeHtml(g)}" style="height:60px; background:${g}; border-radius:8px; border:2px solid #334155; cursor:pointer;" title="Click to apply background"></div>
          `).join('')}
        </div>
      `;

      el.querySelectorAll('.des-bg-choice').forEach(card => {
        card.addEventListener('click', () => {
          designData.background = card.dataset.bg;
          saveDesignData();
          const canvas = container.querySelector('#designer-canvas-container');
          if (canvas) canvas.style.background = designData.background;
        });
      });
    }
  }

  /* =========================================================================
   * CANVAS STAGE RENDERING & DRAG MANIPULATION
   * ========================================================================= */
  function renderCanvasElements() {
    const canvas = container.querySelector('#designer-canvas-container');
    if (!canvas) return;

    canvas.innerHTML = '';

    designData.elements.forEach(item => {
      const elDiv = document.createElement('div');
      elDiv.className = `designer-canvas-element ${item.id === selectedElementId ? 'selected' : ''}`;
      elDiv.dataset.elid = item.id;
      elDiv.style.cssText = `
        position: absolute;
        left: ${item.x * canvasScale}px;
        top: ${item.y * canvasScale}px;
        width: ${item.width * canvasScale}px;
        height: ${item.height * canvasScale}px;
        cursor: move;
        box-sizing: border-box;
        outline: ${item.id === selectedElementId ? '2px dashed #ec4899' : 'none'};
      `;

      if (item.type === 'shape_rect') {
        elDiv.style.background = item.fill || '#ec4899';
        if (item.stroke && item.strokeWidth) {
          elDiv.style.border = `${item.strokeWidth * canvasScale}px solid ${item.stroke}`;
        }
        if (item.borderRadius) {
          elDiv.style.borderRadius = `${item.borderRadius * canvasScale}px`;
        }
      } else if (item.type === 'shape_circle') {
        elDiv.style.background = item.fill || '#8b5cf6';
        elDiv.style.borderRadius = '50%';
        if (item.opacity) elDiv.style.opacity = item.opacity;
      } else if (item.type === 'badge') {
        elDiv.style.background = item.fill || '#db2777';
        elDiv.style.color = item.color || '#ffffff';
        elDiv.style.borderRadius = `${(item.borderRadius || 18) * canvasScale}px`;
        elDiv.style.display = 'flex';
        elDiv.style.alignItems = 'center';
        elDiv.style.justifyContent = 'center';
        elDiv.style.fontWeight = item.fontWeight || '800';
        elDiv.style.fontSize = `${(item.fontSize || 12) * canvasScale}px`;
        elDiv.style.letterSpacing = '1px';
        elDiv.textContent = item.text || 'BADGE';
      } else if (item.type === 'text') {
        elDiv.style.color = item.color || '#ffffff';
        elDiv.style.fontSize = `${(item.fontSize || 24) * canvasScale}px`;
        elDiv.style.fontWeight = item.fontWeight || '700';
        elDiv.style.fontFamily = item.fontFamily || 'Segoe UI';
        elDiv.style.lineHeight = item.lineHeight || 1.2;
        elDiv.style.whiteSpace = 'pre-wrap';
        elDiv.textContent = item.text || 'Text element';
      }

      bindElementDrag(elDiv, item);
      canvas.appendChild(elDiv);
    });
  }

  function bindElementDrag(domEl, item) {
    domEl.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      selectedElementId = item.id;
      renderCanvasElements();

      const startX = e.clientX;
      const startY = e.clientY;
      const initialItemX = item.x;
      const initialItemY = item.y;

      function onMouseMove(moveEvent) {
        const dx = (moveEvent.clientX - startX) / canvasScale;
        const dy = (moveEvent.clientY - startY) / canvasScale;
        item.x = Math.round(initialItemX + dx);
        item.y = Math.round(initialItemY + dy);
        domEl.style.left = `${item.x * canvasScale}px`;
        domEl.style.top = `${item.y * canvasScale}px`;
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        saveDesignData();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // Double-click text to inline edit
    domEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (item.type === 'text' || item.type === 'badge') {
        const newText = prompt('Edit Text Content:', item.text);
        if (newText !== null) {
          item.text = newText;
          saveDesignData();
          renderCanvasElements();
        }
      }
    });
  }

  /* =========================================================================
   * HIGH-RESOLUTION EXPORT (PNG & SVG)
   * ========================================================================= */
  function exportCanvasToPng() {
    const offscreen = document.createElement('canvas');
    offscreen.width = designData.width;
    offscreen.height = designData.height;
    const ctx = offscreen.getContext('2d');

    // Fill background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, designData.width, designData.height);

    // Render elements
    designData.elements.forEach(item => {
      if (item.type === 'shape_rect') {
        ctx.fillStyle = item.fill.includes('rgba') ? item.fill : item.fill;
        ctx.fillRect(item.x, item.y, item.width, item.height);
      } else if (item.type === 'shape_circle') {
        ctx.fillStyle = item.fill || '#ec4899';
        ctx.beginPath();
        ctx.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type === 'badge') {
        ctx.fillStyle = item.fill || '#db2777';
        ctx.beginPath();
        ctx.roundRect(item.x, item.y, item.width, item.height, item.borderRadius || 18);
        ctx.fill();
        ctx.fillStyle = item.color || '#ffffff';
        ctx.font = `bold ${item.fontSize || 12}px Segoe UI, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, item.x + item.width / 2, item.y + item.height / 2);
      } else if (item.type === 'text') {
        ctx.fillStyle = item.color || '#ffffff';
        ctx.font = `${item.fontWeight || '700'} ${item.fontSize || 24}px ${item.fontFamily || 'Segoe UI'}, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const lines = (item.text || '').split('\n');
        lines.forEach((line, lIdx) => {
          ctx.fillText(line, item.x, item.y + lIdx * ((item.fontSize || 24) * (item.lineHeight || 1.2)));
        });
      }
    });

    // Download PNG
    const url = offscreen.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${designData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (window.orbitPlatform && typeof window.orbitPlatform.triggerToast === 'function') {
      window.orbitPlatform.triggerToast('Exported High-Resolution Graphic to PNG', 'pink');
    }
  }

  function exportCanvasToSvg() {
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${designData.width} ${designData.height}" width="${designData.width}" height="${designData.height}">\n`;
    svgContent += `  <rect width="100%" height="100%" fill="#0f172a"/>\n`;

    designData.elements.forEach(item => {
      if (item.type === 'shape_rect') {
        svgContent += `  <rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" fill="${item.fill}" rx="${item.borderRadius || 0}"/>\n`;
      } else if (item.type === 'shape_circle') {
        svgContent += `  <circle cx="${item.x + item.width / 2}" cy="${item.y + item.height / 2}" r="${item.width / 2}" fill="${item.fill}"/>\n`;
      } else if (item.type === 'badge') {
        svgContent += `  <rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" fill="${item.fill}" rx="${item.borderRadius || 18}"/>\n`;
        svgContent += `  <text x="${item.x + item.width / 2}" y="${item.y + item.height / 2}" fill="${item.color || '#fff'}" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="${item.fontSize || 12}" text-anchor="middle" dominant-baseline="middle">${escapeHtml(item.text)}</text>\n`;
      } else if (item.type === 'text') {
        const lines = (item.text || '').split('\n');
        lines.forEach((line, lIdx) => {
          svgContent += `  <text x="${item.x}" y="${item.y + (lIdx + 1) * (item.fontSize || 24)}" fill="${item.color || '#fff'}" font-family="${item.fontFamily || 'Segoe UI'}" font-weight="${item.fontWeight || 'bold'}" font-size="${item.fontSize || 24}">${escapeHtml(line)}</text>\n`;
        });
      }
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${designData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
