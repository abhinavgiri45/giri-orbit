/**
 * GIRI QUIZ — EXECUTIVE ASSESSMENT & EXAM ENGINE (quiz.js)
 * Sovereign Scored Assessment Studio with Live Timer & Automated Grading
 * Competing directly with Microsoft Forms Quiz & Google Forms Quiz
 * Part of the Giri Orbit Sovereign Office Suite
 * Made by Abhinav Giri (@abhinavgiri45)
 */

export function renderQuizApp(container, onUpdate = null, startInEditor = true) {
  let quizData = loadQuizData();
  let activeTab = 'questions'; // 'questions', 'gradebook'
  let isTakeQuizMode = false;
  let quizTimerSeconds = 0;
  let timerInterval = null;
  let userExamAnswers = {};
  let examResult = null;

  const QUIZ_TEMPLATES = [
    {
      id: 'arch-cert',
      name: 'Enterprise Architecture Certification',
      category: 'certification',
      desc: 'Rigorous 5-question test on sovereign in-memory structures and native offline performance.',
      themeColor: '#0284c7',
      passingScorePercent: 70,
      timeLimitMinutes: 10,
      questions: [
        { id: 'qz_1', type: 'single_choice', title: 'What is the primary benefit of Giri Orbit's sovereign local architecture?', points: 20, options: ['Requires constant high-bandwidth internet connectivity', '100% offline execution with zero forced telemetry and zero data leaks', 'Uploads user documents to external marketing servers', 'Requires monthly subscription license verification'], correctIndex: 1, explanation: 'Giri Orbit operates 100% in-memory and local NVMe storage with zero forced telemetry.' },
        { id: 'qz_2', type: 'single_choice', title: 'Which file format enables true universal independence across Word, Excel, and Presentation suites?', points: 20, options: ['.proprietary-lockin', 'Open standard .docx, .xlsx, .pptx and .giri sovereign codecs', '.bin blob only', 'Raw print spooler'], correctIndex: 1, explanation: 'Universal open standards and .giri sovereign formats preserve complete user ownership.' },
        { id: 'qz_3', type: 'single_choice', title: 'What is the maximum recommended RAM for large financial matrix calculations in Giri Axis?', points: 20, options: ['128 MB', '4 GB minimum (8 GB for multi-million cell enterprise matrices)', '64 KB', '1 MB'], correctIndex: 1, explanation: 'Axis utilizes modern NVMe vector paging to calculate formulas at native 60fps speeds.' },
        { id: 'qz_4', type: 'single_choice', title: 'In a sovereign security posture, where should sensitive cryptographic keys remain?', points: 20, options: ['Public Pastebin', 'Exclusively on user device hardware keystore / local TPM', 'Shared in marketing analytics cookies', 'Emailed to third parties'], correctIndex: 1, explanation: 'Zero-knowledge sovereignty guarantees cryptographic keys never depart local silicon.' },
        { id: 'qz_5', type: 'single_choice', title: 'Who is the author and creator of the Giri Orbit Sovereign Suite?', points: 20, options: ['Anonymous open proxy', 'Abhinav Giri (@abhinavgiri45)', 'External advertising conglomerate', 'Cloud telemetry bot'], correctIndex: 1, explanation: 'Giri Orbit is engineered and created by Abhinav Giri (@abhinavgiri45).' }
      ]
    },
    {
      id: 'sec-compliance',
      name: 'Data Privacy & Security Compliance',
      category: 'compliance',
      desc: 'Corporate security standards, zero-trust data protection, and digital signature compliance.',
      themeColor: '#2563eb',
      passingScorePercent: 80,
      timeLimitMinutes: 8,
      questions: [
        { id: 'qz_1', type: 'single_choice', title: 'When should an employee transmit company confidential matrices to unsecured cloud services?', points: 25, options: ['Whenever convenient', 'Never — always use sovereign encrypted offline tools', 'Every Friday', 'When working remotely'], correctIndex: 1, explanation: 'Enterprise policy strictly forbids unencrypted transmission of confidential assets.' },
        { id: 'qz_2', type: 'single_choice', title: 'What does a digital Authenticode cryptographic signature verify?', points: 25, options: ['Executable has zero bytes', 'Software origin is certified and code has not been tampered with', 'Computer needs more storage', 'Screen brightness level'], correctIndex: 1, explanation: 'Authenticode signatures cryptographically prove publisher identity and binary integrity.' },
        { id: 'qz_3', type: 'single_choice', title: 'What is the fastest way to verify offline data safety?', points: 25, options: ['Disconnect network interface and verify full suite operation', 'Click marketing banners', 'Download third-party extensions', 'Leave computer unlocked'], correctIndex: 25, options: ['Disconnect network interface and verify 100% full suite operation', 'Click banners', 'Install toolbars', 'None'], correctIndex: 0, explanation: 'Giri Orbit runs seamlessly with zero network connectivity.' },
        { id: 'qz_4', type: 'single_choice', title: 'What is the penalty for violating enterprise data sovereignty?', points: 25, options: ['No penalty', 'Immediate regulatory compliance audit and security escalation', 'A bonus', 'Free coffee'], correctIndex: 1, explanation: 'Non-compliance exposes organizations to severe governance penalties.' }
      ]
    }
,
    {
      id: 'iso-soc2',
      name: 'ISO 27001 / SOC-2 Cybersecurity Certification',
      category: 'compliance',
      desc: 'Industry benchmark certification testing cryptographic ciphers, key management, and zero-leak access controls.',
      themeColor: '#10b981',
      passingScorePercent: 75,
      timeLimitMinutes: 12,
      questions: [
        { id: 'qz_1', type: 'single_choice', title: 'Which authenticated symmetric encryption cipher is mandated for enterprise data at rest?', points: 25, options: ['DES 56-bit', 'RC4 stream cipher', 'AES-256-GCM (Galois/Counter Mode)', 'Plain Base64 encoding'], correctIndex: 2, explanation: 'AES-256-GCM provides both mathematical confidentiality and tamper-proof authentication.' },
        { id: 'qz_2', type: 'single_choice', title: 'Why is PBKDF2 with 100,000+ iterations utilized during key derivation?', points: 25, options: ['It slows down brute-force and GPU dictionary attacks', 'It compresses the file size', 'It sends telemetry to the cloud', 'It converts text to ASCII'], correctIndex: 0, explanation: 'High-iteration PBKDF2 creates severe computational hardness against brute-force attacks.' },
        { id: 'qz_3', type: 'single_choice', title: 'What is the required procedure for in-memory plaintext buffers upon document close?', points: 25, options: ['Leave in memory cache indefinitely', 'Zeroize and overwrite with cryptographically secure random values', 'Write to temp text file on desktop', 'Print to paper'], correctIndex: 1, explanation: 'RAM zeroization prevents cold-boot memory dumps and process memory snooping.' },
        { id: 'qz_4', type: 'single_choice', title: 'In an air-gapped high-security facility, how does Giri Orbit function?', points: 25, options: ['Fails to start', '100% full functionality with zero degradation because all runtimes and fonts are local', 'Requires phone tethering', 'Prompts for online login'], correctIndex: 1, explanation: 'Giri Orbit is engineered from the ground up for total air-gapped sovereign execution.' }
      ]
    },
    {
      id: 'fullstack-arch',
      name: 'Full-Stack Performance & Concurrency Exam',
      category: 'engineering',
      desc: 'Advanced technical assessment covering browser event loops, requestAnimationFrame batching, and Web Workers.',
      themeColor: '#8b5cf6',
      passingScorePercent: 80,
      timeLimitMinutes: 15,
      questions: [
        { id: 'qz_1', type: 'single_choice', title: 'How does Giri Orbit guarantee 60 FPS under a 1-million click synthetic flood?', points: 25, options: ['Drops all user input', 'Batches and merges rapid events into microtasks scheduled via requestAnimationFrame', 'Locks the computer screen', 'Spawns 10,000 popups'], correctIndex: 1, explanation: 'Backpressure throttling merges high-frequency bursts without overflowing call stacks.' },
        { id: 'qz_2', type: 'single_choice', title: 'Which API enables direct-to-disk file saving without repeated download prompts?', points: 25, options: ['Flash Player', 'File System Access API (showSaveFilePicker / FileSystemFileHandle)', 'XMLHttpRequest sync mode', 'ActiveX Object'], correctIndex: 1, explanation: 'File System Access API provides native read/write file handle streams on modern browsers.' },
        { id: 'qz_3', type: 'single_choice', title: 'Why does Giri Orbit execute heavy trigonometric calculations in Web Workers?', points: 25, options: ['To waste CPU cycles', 'To keep the main UI thread 100% responsive and stutter-free', 'To bypass browser security', 'To play audio'], correctIndex: 1, explanation: 'Web Workers offload intensive computation from the main rendering thread.' },
        { id: 'qz_4', type: 'single_choice', title: 'What is the role of a Service Worker in a sovereign offline office suite?', points: 25, options: ['Mine cryptocurrency', 'Intercept network requests and serve cached assets instantaneously via Stale-While-Revalidate', 'Display banner advertisements', 'Send daily user emails'], correctIndex: 1, explanation: 'Service Workers enable instant load times and offline execution from local CacheStorage.' }
      ]
    }
  ];

  if (startInEditor) {
    mountEditor();
  } else {
    mountHub();
  }

  function loadQuizData() {
    try {
      const saved = localStorage.getItem('orbit_quiz_active_doc');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load quiz data:', e);
    }
    return {
      id: 'quiz_' + Date.now(),
      title: 'Enterprise Architecture & Sovereign Systems Certification Quiz',
      description: 'Test your understanding of high-velocity native offline architectures, sovereign in-memory data structures, and mathematical matrix engines.',
      timeLimitMinutes: 10,
      passingScorePercent: 70,
      themeColor: '#0284c7',
      questions: [
        {
          id: 'qz_1',
          type: 'single_choice',
          title: 'What is the primary benefit of Giri Orbit's sovereign local architecture?',
          points: 5,
          options: [
            'Requires constant high-bandwidth internet connectivity',
            '100% offline execution with zero forced telemetry and zero data leaks',
            'Uploads documents to third-party ad networks',
            'Cannot operate without a cloud account'
          ],
          correctIndex: 1,
          explanation: 'Giri Orbit operates in local device memory with zero telemetry, ensuring total confidentiality.'
        },
        {
          id: 'qz_2',
          type: 'single_choice',
          title: 'Which cryptographic standard is used for offline Authenticode signing of Giri Orbit desktop executables?',
          points: 5,
          options: [
            'ROT13 cipher',
            'SHA-256 with RSA-4096 Authenticode Code Signing Certificate',
            'Plain text MD5 hash',
            'No cryptographic signature'
          ],
          correctIndex: 1,
          explanation: 'All Windows desktop binaries are signed with an authentic DigiCert timestamped certificate.'
        },
        {
          id: 'qz_3',
          type: 'single_choice',
          title: 'In Giri Axis, what is the key advantage of the in-memory financial calculation matrix?',
          points: 5,
          options: [
            'Formula calculations occur in microsecond cycles with zero round-trip API delays',
            'Limits workbooks to 10 rows',
            'Deletes data when you save',
            'Only supports basic addition'
          ],
          correctIndex: 0,
          explanation: 'In-memory execution executes complex mathematical models and lookups at 60 FPS.'
        }
      ],
      results: [
        {
          id: 'res_1',
          studentName: 'Alex Morgan',
          completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          scorePercent: 100,
          pointsEarned: 15,
          totalPoints: 15,
          passed: true
        },
        {
          id: 'res_2',
          studentName: 'Jordan Vance',
          completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          scorePercent: 67,
          pointsEarned: 10,
          totalPoints: 15,
          passed: false
        }
      ]
    };
  }

  function saveQuizData() {
    try {
      localStorage.setItem('orbit_quiz_active_doc', JSON.stringify(quizData));
      if (onUpdate) onUpdate(quizData);
    } catch (e) {
      console.warn('Failed to save quiz data:', e);
    }
  }

  // =========================================================================
  // VIEW 1: START INTERFACE / QUIZ HUB
  // =========================================================================
  function mountHub() {
    container.innerHTML = `
      <div class="drift-hub-shell" id="quiz-hub-shell" style="min-height:100vh; background:#0f172a; color:#f8fafc; font-family:'Segoe UI',system-ui,sans-serif; overflow-y:auto;">
        <!-- Top App Brand Bar in Hub Mode -->
        <div class="drift-hub-top-bar" style="height:54px; background:#1e293b; border-bottom:1px solid #334155; display:flex; align-items:center; justify-content:space-between; padding:0 24px;">
          <div class="drift-hub-brand-left" style="display:flex; align-items:center; gap:12px;">
            <img src="assets/quiz-logo.png" alt="Giri Quiz" style="width:28px; height:28px; object-fit:contain; border-radius:6px; filter:drop-shadow(0 2px 6px rgba(2,132,199,0.5));">
            <div class="tool-hub-brand-dropdown-wrap">
              <button class="tool-hub-brand-btn" style="display:flex; align-items:center; gap:6px; background:transparent; border:none; cursor:pointer; padding:4px 6px; border-radius:4px;" title="Switch Suite Tool">
                <span style="color:#ffffff; font-weight:700; font-size:14.5px;">Giri Quiz</span>
                <span style="color:#94a3b8; font-size:11px;">▾</span>
              </button>
            </div>
            <nav class="drift-hub-nav-links" style="display:flex; gap:18px; margin-left:14px; font-size:12.5px; color:#cbd5e1;">
              <span class="drift-hub-nav-link" id="quiz-nav-blank" style="cursor:pointer; font-weight:600;">Create Blank</span>
              <span class="drift-hub-nav-link" id="quiz-nav-templates" style="cursor:pointer;">Certifications</span>
              <span class="drift-hub-nav-link" id="quiz-nav-hub" style="cursor:pointer; color:#38bdf8;">← Suite Hub</span>
            </nav>
          </div>

          <div class="tool-hub-top-right" style="display:flex; align-items:center; gap:12px;">
            <div class="tool-hub-suite-links" style="display:flex; gap:14px; font-size:12px; color:#94a3b8;">
              <a href="#hub" style="color:#94a3b8; text-decoration:none;">Hub</a>
              <a href="#drift" style="color:#94a3b8; text-decoration:none;">Drift</a>
              <a href="#axis" style="color:#94a3b8; text-decoration:none;">Axis</a>
              <a href="#kinetic" style="color:#94a3b8; text-decoration:none;">Kinetic</a>
              <a href="#forms" style="color:#94a3b8; text-decoration:none;">Forms</a>
              <a href="#quiz" style="color:#38bdf8; text-decoration:none; font-weight:700;">Quiz</a>
              <a href="#lists" style="color:#94a3b8; text-decoration:none;">Lists</a>
              <a href="#designer" style="color:#94a3b8; text-decoration:none;">Designer</a>
            </div>
          </div>
        </div>

        <!-- Sleek Dark Hero Banner -->
        <section class="drift-hub-hero" style="max-width:1300px; margin:0 auto; padding:40px 32px 32px; display:grid; grid-template-columns:1.2fr 0.8fr; gap:40px; align-items:center;">
          <div class="drift-hero-left">
            <div style="margin-bottom:14px;">
              <img src="assets/quiz-logo.png" alt="Quiz" style="height:42px; object-fit:contain; display:block; filter:drop-shadow(0 4px 12px rgba(2,132,199,0.6));">
            </div>
            <h1 class="drift-hero-title" style="font-size:32px; font-weight:800; color:#ffffff; margin:0 0 10px 0; letter-spacing:-0.02em;">Welcome to Giri Quiz</h1>
            <p class="drift-hero-subtitle" style="font-size:14px; color:#94a3b8; line-height:1.6; margin:0 0 22px 0;">
              Sovereign interactive exam studio, automated grading matrix, and instant certification. Zero database tracking, instant local persistence.
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
              <button class="btn-drift-create-blank" id="btn-quiz-create-blank" style="background:#0284c7; color:#ffffff; border:none; padding:10px 20px; border-radius:8px; font-weight:700; font-size:13px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 4px 14px rgba(2,132,199,0.4);">
                <span>+ Create blank quiz</span>
              </button>
              <button class="btn-drift-upload-file" id="btn-quiz-quick-cert" style="background:#1e293b; color:#cbd5e1; border:1px solid #334155; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">
                <span>🎓 Use Architecture Certification</span>
              </button>
              <button class="btn-drift-new-template-cta" id="btn-quiz-export-axis" style="background:#1e293b; color:#38bdf8; border:1px solid #0369a1; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">
                <span>📊 Export Gradebook to Axis</span>
              </button>
            </div>
          </div>

          <!-- 3D Modern Quiz Illustration -->
          <div class="drift-hero-visual" style="display:flex; justify-content:center;">
            <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:280px; filter:drop-shadow(0 10px 25px rgba(0,0,0,0.5));">
              <rect x="25" y="20" width="230" height="145" rx="10" fill="#1e293b" stroke="#334155" stroke-width="2"/>
              <rect x="45" y="38" width="130" height="10" rx="3" fill="#0284c7"/>
              <rect x="45" y="56" width="180" height="6" rx="2" fill="#475569"/>
              <!-- Question options -->
              <circle cx="52" cy="76" r="6" stroke="#0284c7" stroke-width="2" fill="none"/>
              <rect x="66" y="73" width="100" height="6" rx="2" fill="#94a3b8"/>
              <circle cx="52" cy="96" r="6" stroke="#10b981" stroke-width="2" fill="#10b981"/>
              <rect x="66" y="93" width="120" height="6" rx="2" fill="#ffffff"/>
              <circle cx="52" cy="116" r="6" stroke="#475569" stroke-width="2" fill="none"/>
              <rect x="66" y="113" width="90" height="6" rx="2" fill="#94a3b8"/>
              <!-- Gold badge on right -->
              <circle cx="215" cy="85" r="22" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="2"/>
              <text x="215" y="91" text-anchor="middle" font-size="14" font-weight="bold" fill="#f59e0b">A+</text>
              <rect x="45" y="136" width="80" height="18" rx="4" fill="#0284c7"/>
              <rect x="55" y="142" width="60" height="5" rx="2" fill="#ffffff"/>
            </svg>
          </div>
        </section>

        <!-- Bottom Pick up Where You Left Off Bar -->
        <div style="max-width:1300px; margin:0 auto 36px; padding:0 32px;">
          <div style="background:#1e293b; border:1px solid #334155; border-radius:12px; padding:14px 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; box-shadow:0 4px 15px rgba(0,0,0,0.25);">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:36px; height:36px; border-radius:8px; background:rgba(2,132,199,0.2); border:1px solid #0284c7; display:flex; align-items:center; justify-content:center; color:#38bdf8; font-weight:800; font-size:16px;">Q</div>
              <div>
                <strong style="color:#ffffff; font-size:13.5px; display:block;">Pick up where you left off in Quiz</strong>
                <span style="color:#94a3b8; font-size:12px;">• ${escapeHtml(quizData.title)} — ${quizData.questions.length} questions • ${quizData.passingScorePercent}% pass grade</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <button id="btn-quiz-reset-draft" style="background:#334155; color:#cbd5e1; border:none; padding:7px 14px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
                🗑 Delete Draft
              </button>
              <button id="btn-quiz-resume-work" style="background:#0284c7; color:#ffffff; border:none; padding:8px 18px; border-radius:6px; font-size:12.5px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                <span>▶ Resume Work →</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Template Gallery Carousel -->
        <section style="max-width:1300px; margin:0 auto; padding:0 32px 48px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;">
            <h2 style="font-size:18px; font-weight:700; color:#ffffff; margin:0;">Standard Exam & Certification Templates</h2>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:18px;">
            ${QUIZ_TEMPLATES.map(tpl => `
              <div class="quiz-tpl-card" data-id="${tpl.id}" style="background:#1e293b; border:1px solid #334155; border-radius:12px; padding:18px; cursor:pointer; transition:all 0.2s; display:flex; flex-direction:column; justify-content:space-between;" onmouseover="this.style.borderColor='${tpl.themeColor}'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#334155'; this.style.transform='none';">
                <div>
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(2,132,199,0.2); color:#38bdf8; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; margin-bottom:12px;">Q</div>
                  <strong style="color:#ffffff; font-size:14.5px; display:block; margin-bottom:6px;">${escapeHtml(tpl.name)}</strong>
                  <p style="font-size:12px; color:#94a3b8; margin:0 0 14px 0; line-height:1.5;">${escapeHtml(tpl.desc)}</p>
                </div>
                <div style="font-size:11px; color:#38bdf8; font-weight:600;">
                  ${tpl.questions.length} Scored Questions • ${tpl.timeLimitMinutes}m Timer • Use →
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    // Bind Hub Events
    container.querySelector('#btn-quiz-create-blank')?.addEventListener('click', () => {
      quizData = {
        id: 'quiz_' + Date.now(),
        title: 'Untitled Quiz Assessment',
        description: 'Provide assessment instructions for candidates.',
        timeLimitMinutes: 15,
        passingScorePercent: 75,
        themeColor: '#0284c7',
        questions: [
          { id: 'qz_1', type: 'single_choice', title: 'Sample Question 1', points: 10, options: ['Option A (Correct)', 'Option B', 'Option C'], correctIndex: 0, explanation: 'Explanation for correct answer.' }
        ],
        results: []
      };
      saveQuizData();
      mountEditor();
    });

    container.querySelector('#quiz-nav-blank')?.addEventListener('click', () => { mountEditor(); });
    container.querySelector('#quiz-nav-hub')?.addEventListener('click', () => {
      if (window.orbitPlatform) window.orbitPlatform.navigateTo('launcher');
    });
    container.querySelector('#btn-quiz-resume-work')?.addEventListener('click', () => { mountEditor(); });
    container.querySelector('#btn-quiz-quick-cert')?.addEventListener('click', () => { applyTemplate(QUIZ_TEMPLATES[0]); });
    container.querySelector('#btn-quiz-export-axis')?.addEventListener('click', () => { exportGradebookToAxis(); });

    container.querySelector('#btn-quiz-reset-draft')?.addEventListener('click', () => {
      if (confirm('Reset quiz draft to default certification quiz?')) {
        localStorage.removeItem('orbit_quiz_active_doc');
        quizData = loadQuizData();
        mountHub();
      }
    });

    container.querySelectorAll('.quiz-tpl-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const tpl = QUIZ_TEMPLATES.find(t => t.id === id);
        if (tpl) applyTemplate(tpl);
      });
    });

    function applyTemplate(tpl) {
      quizData = {
        id: 'quiz_' + Date.now(),
        title: tpl.name,
        description: tpl.desc,
        timeLimitMinutes: tpl.timeLimitMinutes,
        passingScorePercent: tpl.passingScorePercent,
        themeColor: tpl.themeColor || '#0284c7',
        questions: JSON.parse(JSON.stringify(tpl.questions)),
        results: []
      };
      saveQuizData();
      mountEditor();
    }
  }

  // =========================================================================
  // VIEW 2: FULL-FEATURED QUIZ BUILDER & GRADING EDITOR
  // =========================================================================
  function mountEditor() {
    renderShell();
  }

  function renderShell() {
    const totalPts = getTotalPoints();

    container.innerHTML = `
      <div class="giri-quiz-root" id="giri-quiz-root" style="display:flex; flex-direction:column; width:100%; height:100%; background:#f8fafc; font-family:'Segoe UI',system-ui,sans-serif; color:#0f172a; overflow:hidden;">
        <!-- Top Application Header Bar -->
        <header class="quiz-app-header" style="height:56px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 20px; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.02); z-index:10;">
          <div style="display:flex; align-items:center; gap:14px;">
            <button id="quiz-btn-back-hub" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; padding:6px 10px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px; margin-right:4px;" title="Back to Quiz Start Hub"><span>← Start</span></button><img src="assets/quiz-logo.png" alt="Quiz" style="width:32px; height:32px; object-fit:contain; border-radius:6px; filter:drop-shadow(0 2px 5px rgba(2,132,199,0.4));">
            <div>
              <input type="text" id="quiz-doc-title-input" value="${escapeHtml(quizData.title)}" style="font-weight:700; font-size:15px; color:#0f172a; border:1px solid transparent; border-radius:4px; padding:3px 8px; width:340px; background:transparent; transition:all 0.15s;" onfocus="this.style.borderColor='#0284c7'; this.style.background='#ffffff';" onblur="this.style.borderColor='transparent'; this.style.background='transparent';" title="Click to rename quiz">
              <div style="font-size:11px; color:#64748b; padding-left:8px;">Giri Quiz • Sovereign Assessment & Grading Engine</div>
            </div>
          </div>

          <!-- Central Tabs -->
          <div style="display:flex; align-items:center; background:#f1f5f9; padding:3px; border-radius:8px; border:1px solid #e2e8f0;">
            <button id="quiz-tab-questions" class="quiz-nav-tab ${activeTab === 'questions' ? 'active' : ''}" style="border:none; padding:6px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; background:${activeTab === 'questions' ? '#ffffff' : 'transparent'}; color:${activeTab === 'questions' ? quizData.themeColor : '#64748b'}; box-shadow:${activeTab === 'questions' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'};">
              Questions
            </button>
            <button id="quiz-tab-gradebook" class="quiz-nav-tab ${activeTab === 'gradebook' ? 'active' : ''}" style="border:none; padding:6px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:6px; background:${activeTab === 'gradebook' ? '#ffffff' : 'transparent'}; color:${activeTab === 'gradebook' ? quizData.themeColor : '#64748b'}; box-shadow:${activeTab === 'gradebook' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'};">
              <span>Gradebook</span>
              <span style="background:${quizData.themeColor}; color:#ffffff; font-size:11px; font-weight:700; border-radius:10px; padding:1px 7px;">${quizData.submissions.length}</span>
            </button>
          </div>

          <!-- Right Action Bar -->
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="fluent-top-action-pill" id="quiz-btn-universal-cloud" onclick="window.universalCloudManager?.openCloudOpenerDialog(); return false;" title="Universal Multi-Cloud (Google Drive, OneDrive, Dropbox, Nextcloud)" style="background:rgba(2,132,199,0.12); border:1px solid #bae6fd; color:#0284c7; font-weight:700; font-size:12px; padding:5px 10px; border-radius:6px; cursor:pointer;">
              <span>🌐 Cloud</span>
            </button>
            <button class="fluent-top-action-pill giri-hindi-toggle-pill" id="btn-quiz-hindi-ime" onclick="window.hindiInputTools?.toggleHindiIME(); return false;" title="Google Input Tools Hindi Transliteration (Ctrl+G)" style="background:rgba(22,163,74,0.12); border:1px solid #bbf7d0; color:#16a34a; font-weight:700; font-size:12px; padding:5px 10px; border-radius:6px; cursor:pointer;">
              <span class="gh-flag">🇮🇳</span> <span class="gh-label">हिन्दी</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-quiz-devanagari-kbd" onclick="window.hindiInputTools?.toggleVirtualKeyboard(); return false;" title="Devanagari InScript Virtual Keyboard" style="background:#f1f5f9; border:1px solid #cbd5e1; padding:5px 8px; border-radius:6px; cursor:pointer;">
              <span>⌨️</span>
            </button>

            <div style="background:#f0f9ff; border:1px solid #bae6fd; color:#0369a1; font-size:12px; font-weight:700; padding:5px 12px; border-radius:20px; display:flex; align-items:center; gap:6px;">
              <span>🏆 Total:</span>
              <span id="quiz-header-total-points">${totalPts} Points</span>
            </div>

            <!-- Take Quiz Button -->
            <button id="quiz-btn-take-exam" style="background:${isTakeQuizMode ? '#e11d48' : quizData.themeColor}; border:none; color:#ffffff; font-size:13px; font-weight:700; padding:6px 16px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 4px rgba(2,132,199,0.3); transition:all 0.15s;">
              <span>${isTakeQuizMode ? '⏹️ Exit Exam' : '▶️ Take Quiz'}</span>
            </button>

            <!-- Export to Axis Button -->
            <button id="quiz-btn-export-axis" style="background:#f0fdf4; border:1px solid #86efac; color:#166534; font-size:13px; font-weight:600; padding:6px 14px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px;" title="Export gradebook to Giri Axis Spreadsheet">
              <span>📊 Export Gradebook</span>
            </button>
          </div>
        </header>

        <!-- Main Body Scroll Area -->
        <main class="quiz-body-scroll" style="flex:1; overflow-y:auto; overflow-x:hidden; padding:28px 16px; display:flex; justify-content:center;">
          <div style="width:100%; max-width:760px; display:flex; flex-direction:column; gap:20px;" id="quiz-main-content">
            <!-- Dynamically populated -->
          </div>
        </main>
      </div>
    `;

    bindHeaderEvents();
    renderMainContent();
  }

  function bindHeaderEvents() {
    const root = container.querySelector('#giri-quiz-root');
    if (!root) return;

    root.querySelector('#quiz-doc-title-input')?.addEventListener('input', (e) => {
      quizData.title = e.target.value;
      saveQuizData();
    });

    root.querySelector('#quiz-tab-questions')?.addEventListener('click', () => {
      activeTab = 'questions';
      isTakeQuizMode = false;
      renderShell();
    });

    root.querySelector('#quiz-tab-gradebook')?.addEventListener('click', () => {
      activeTab = 'gradebook';
      isTakeQuizMode = false;
      renderShell();
    });

    root.querySelector('#quiz-btn-take-exam')?.addEventListener('click', () => {
      isTakeQuizMode = !isTakeQuizMode;
      if (isTakeQuizMode) {
        startQuizExam();
      } else {
        clearInterval(timerInterval);
        renderShell();
      }
    });

    root.querySelector('#quiz-btn-export-axis')?.addEventListener('click', () => {
      exportGradebookToAxis();
    });
  }

  function renderMainContent() {
    const contentEl = container.querySelector('#quiz-main-content');
    if (!contentEl) return;

    if (isTakeQuizMode) {
      if (examResult) {
        renderExamResult(contentEl);
      } else {
        renderExamLive(contentEl);
      }
    } else if (activeTab === 'questions') {
      renderQuestionsEditor(contentEl);
    } else if (activeTab === 'gradebook') {
      renderGradebook(contentEl);
    }
  }

  /* =========================================================================
   * QUESTIONS BUILDER & POINT CONFIGURATOR
   * ========================================================================= */
  function renderQuestionsEditor(el) {
    el.innerHTML = `
      <!-- Header Banner Card -->
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="height:10px; background:${quizData.themeColor}; width:100%;"></div>
        <div style="padding:24px 28px;">
          <input type="text" id="quiz-header-title" value="${escapeHtml(quizData.title)}" style="font-size:22px; font-weight:800; color:#0f172a; width:100%; border:none; border-bottom:1px solid transparent; padding:4px 0; outline:none;" placeholder="Quiz Title">
          <textarea id="quiz-header-desc" rows="2" style="font-size:14px; color:#475569; width:100%; border:none; border-bottom:1px solid transparent; padding:6px 0; margin-top:8px; outline:none; resize:none; font-family:inherit;" placeholder="Assessment instructions...">${escapeHtml(quizData.description)}</textarea>

          <div style="display:flex; align-items:center; gap:24px; margin-top:16px; padding-top:14px; border-top:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:13px; font-weight:700; color:#475569;">⏱️ Time Limit:</span>
              <select id="quiz-time-limit-select" style="padding:4px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:13px; font-weight:600; color:#0f172a;">
                <option value="5" ${quizData.timeLimitMinutes === 5 ? 'selected' : ''}>5 Minutes</option>
                <option value="10" ${quizData.timeLimitMinutes === 10 ? 'selected' : ''}>10 Minutes</option>
                <option value="15" ${quizData.timeLimitMinutes === 15 ? 'selected' : ''}>15 Minutes</option>
                <option value="30" ${quizData.timeLimitMinutes === 30 ? 'selected' : ''}>30 Minutes</option>
                <option value="0" ${quizData.timeLimitMinutes === 0 ? 'selected' : ''}>No Time Limit</option>
              </select>
            </div>

            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:13px; font-weight:700; color:#475569;">🎯 Passing Score:</span>
              <select id="quiz-pass-score-select" style="padding:4px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:13px; font-weight:600; color:#0f172a;">
                <option value="60" ${quizData.passingScorePercent === 60 ? 'selected' : ''}>60%</option>
                <option value="70" ${quizData.passingScorePercent === 70 ? 'selected' : ''}>70%</option>
                <option value="80" ${quizData.passingScorePercent === 80 ? 'selected' : ''}>80%</option>
                <option value="90" ${quizData.passingScorePercent === 90 ? 'selected' : ''}>90%</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Question List -->
      <div id="quiz-questions-list" style="display:flex; flex-direction:column; gap:16px;">
        ${quizData.questions.map((q, idx) => renderQuizQuestionEditorHtml(q, idx)).join('')}
      </div>

      <!-- Add Question Button -->
      <div style="display:flex; justify-content:center; padding:12px 0 32px 0;">
        <button id="quiz-btn-add-question" style="background:#ffffff; border:1px dashed #cbd5e1; color:#0284c7; font-weight:700; font-size:14px; padding:12px 24px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 1px 3px rgba(0,0,0,0.02); transition:all 0.2s;" onmouseover="this.style.borderColor='#0284c7'; this.style.background='#f0f9ff';" onmouseout="this.style.borderColor='#cbd5e1'; this.style.background='#ffffff';">
          <span style="font-size:18px;">➕</span> <span>Add Assessment Question</span>
        </button>
      </div>
    `;

    bindQuestionsEditorEvents(el);
  }

  function renderQuizQuestionEditorHtml(q, idx) {
    return `
      <div class="quiz-question-card" data-qid="${q.id}" style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:22px 26px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:10px; flex:1;">
            <span style="font-weight:800; color:#0284c7; font-size:15px;">Q${idx + 1}.</span>
            <input type="text" class="qz-title-input" value="${escapeHtml(q.title)}" style="font-size:15px; font-weight:700; color:#0f172a; width:100%; border:none; border-bottom:1px solid #e2e8f0; padding:6px 0; outline:none;" placeholder="Question statement...">
          </div>

          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:12px; font-weight:700; color:#64748b;">Points:</span>
            <input type="number" class="qz-points-input" min="1" max="100" value="${q.points || 5}" style="width:52px; padding:4px 6px; border-radius:6px; border:1px solid #cbd5e1; font-weight:700; color:#0284c7; text-align:center;">
          </div>
        </div>

        <!-- Options with Correct Answer Selector -->
        <div style="margin-bottom:16px; display:flex; flex-direction:column; gap:8px;">
          <div style="font-size:12px; color:#64748b; font-weight:600; margin-bottom:2px;">Select the radio checkmark next to the correct answer:</div>
          ${(q.options || []).map((opt, oIdx) => {
            const isCorrect = q.correctAnswer === oIdx;
            return `
              <div style="display:flex; align-items:center; gap:10px; background:${isCorrect ? '#f0fdf4' : '#ffffff'}; border:1px solid ${isCorrect ? '#86efac' : '#e2e8f0'}; border-radius:8px; padding:6px 12px;">
                <button type="button" class="qz-btn-toggle-correct" data-oidx="${oIdx}" style="background:${isCorrect ? '#16a34a' : 'transparent'}; border:2px solid ${isCorrect ? '#16a34a' : '#cbd5e1'}; width:20px; height:20px; border-radius:50%; color:#ffffff; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="${isCorrect ? 'Correct Answer' : 'Click to mark as correct'}">
                  ${isCorrect ? '✓' : ''}
                </button>
                <input type="text" class="qz-opt-text" data-oidx="${oIdx}" value="${escapeHtml(opt)}" style="flex:1; border:none; background:transparent; font-size:13px; color:#1e293b; outline:none;" placeholder="Option text...">
                ${q.options.length > 2 ? `<button class="qz-btn-del-opt" data-oidx="${oIdx}" style="background:transparent; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">×</button>` : ''}
              </div>
            `;
          }).join('')}
          <button class="qz-btn-add-opt" style="align-self:flex-start; background:transparent; border:none; color:#0284c7; font-size:13px; font-weight:700; cursor:pointer; padding:4px 0;">+ Add Choice Option</button>
        </div>

        <!-- Explanation / Feedback Box -->
        <div style="background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0; padding:10px 14px; margin-bottom:12px;">
          <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:4px;">💡 Answer Explanation (Shown to user after submission):</div>
          <input type="text" class="qz-explanation-input" value="${escapeHtml(q.explanation || '')}" placeholder="Explain why this answer is correct..." style="width:100%; border:none; background:transparent; font-size:13px; color:#334155; outline:none;">
        </div>

        <!-- Footer Card Tools -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:12px;">
          <div style="display:flex; gap:6px;">
            <button class="qz-btn-move-up" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; width:28px; height:28px; cursor:pointer; font-size:12px;">⬆️</button>
            <button class="qz-btn-move-down" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; width:28px; height:28px; cursor:pointer; font-size:12px;">⬇️</button>
          </div>
          <div style="display:flex; gap:12px;">
            <button class="qz-btn-duplicate" style="background:transparent; border:none; color:#64748b; font-size:13px; font-weight:600; cursor:pointer;">📋 Duplicate</button>
            <button class="qz-btn-delete" style="background:transparent; border:none; color:#ef4444; font-size:13px; font-weight:600; cursor:pointer;">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `;
  }

  function bindQuestionsEditorEvents(el) {
    el.querySelector('#quiz-header-title')?.addEventListener('input', (e) => {
      quizData.title = e.target.value;
      const topTitle = container.querySelector('#quiz-doc-title-input');
      if (topTitle) topTitle.value = e.target.value;
      saveQuizData();
    });

    el.querySelector('#quiz-header-desc')?.addEventListener('input', (e) => {
      quizData.description = e.target.value;
      saveQuizData();
    });

    el.querySelector('#quiz-time-limit-select')?.addEventListener('change', (e) => {
      quizData.timeLimitMinutes = parseInt(e.target.value, 10);
      saveQuizData();
    });

    el.querySelector('#quiz-pass-score-select')?.addEventListener('change', (e) => {
      quizData.passingScorePercent = parseInt(e.target.value, 10);
      saveQuizData();
    });

    el.querySelector('#quiz-btn-add-question')?.addEventListener('click', () => {
      quizData.questions.push({
        id: 'qz_' + Date.now(),
        type: 'single_choice',
        title: 'New Assessment Question',
        points: 5,
        options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
        correctAnswer: 0,
        explanation: 'Explanation for correct choice.'
      });
      saveQuizData();
      renderQuestionsEditor(el);
      updateTotalPointsHeader();
    });

    // Card-level interactions
    el.querySelectorAll('.quiz-question-card').forEach(card => {
      const qid = card.dataset.qid;
      const q = quizData.questions.find(item => item.id === qid);
      if (!q) return;

      card.querySelector('.qz-title-input')?.addEventListener('input', (e) => {
        q.title = e.target.value;
        saveQuizData();
      });

      card.querySelector('.qz-points-input')?.addEventListener('input', (e) => {
        q.points = parseInt(e.target.value, 10) || 1;
        saveQuizData();
        updateTotalPointsHeader();
      });

      card.querySelector('.qz-explanation-input')?.addEventListener('input', (e) => {
        q.explanation = e.target.value;
        saveQuizData();
      });

      // Toggle correct answer
      card.querySelectorAll('.qz-btn-toggle-correct').forEach(btn => {
        btn.addEventListener('click', () => {
          q.correctAnswer = parseInt(btn.dataset.oidx, 10);
          saveQuizData();
          renderQuestionsEditor(el);
        });
      });

      // Option text input
      card.querySelectorAll('.qz-opt-text').forEach(input => {
        input.addEventListener('input', (e) => {
          const oidx = parseInt(e.target.dataset.oidx, 10);
          if (q.options && q.options[oidx] !== undefined) {
            q.options[oidx] = e.target.value;
            saveQuizData();
          }
        });
      });

      // Add option
      card.querySelector('.qz-btn-add-opt')?.addEventListener('click', () => {
        if (!q.options) q.options = [];
        q.options.push(`Choice ${q.options.length + 1}`);
        saveQuizData();
        renderQuestionsEditor(el);
      });

      // Delete option
      card.querySelectorAll('.qz-btn-del-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          const oidx = parseInt(btn.dataset.oidx, 10);
          if (q.options && q.options.length > 2) {
            q.options.splice(oidx, 1);
            if (q.correctAnswer >= q.options.length) q.correctAnswer = 0;
            saveQuizData();
            renderQuestionsEditor(el);
          }
        });
      });

      // Duplicate question
      card.querySelector('.qz-btn-duplicate')?.addEventListener('click', () => {
        const idx = quizData.questions.findIndex(item => item.id === qid);
        const clone = JSON.parse(JSON.stringify(q));
        clone.id = 'qz_' + Date.now();
        clone.title += ' (Copy)';
        quizData.questions.splice(idx + 1, 0, clone);
        saveQuizData();
        renderQuestionsEditor(el);
        updateTotalPointsHeader();
      });

      // Delete question
      card.querySelector('.qz-btn-delete')?.addEventListener('click', () => {
        quizData.questions = quizData.questions.filter(item => item.id !== qid);
        saveQuizData();
        renderQuestionsEditor(el);
        updateTotalPointsHeader();
      });

      // Move Up
      card.querySelector('.qz-btn-move-up')?.addEventListener('click', () => {
        const idx = quizData.questions.findIndex(item => item.id === qid);
        if (idx > 0) {
          const temp = quizData.questions[idx];
          quizData.questions[idx] = quizData.questions[idx - 1];
          quizData.questions[idx - 1] = temp;
          saveQuizData();
          renderQuestionsEditor(el);
        }
      });

      // Move Down
      card.querySelector('.qz-btn-move-down')?.addEventListener('click', () => {
        const idx = quizData.questions.findIndex(item => item.id === qid);
        if (idx < quizData.questions.length - 1) {
          const temp = quizData.questions[idx];
          quizData.questions[idx] = quizData.questions[idx + 1];
          quizData.questions[idx + 1] = temp;
          saveQuizData();
          renderQuestionsEditor(el);
        }
      });
    });
  }

  function updateTotalPointsHeader() {
    const el = container.querySelector('#quiz-header-total-points');
    if (el) el.textContent = `${getTotalPoints()} Points`;
  }

  /* =========================================================================
   * LIVE EXAM MODE & COUNTDOWN TIMER
   * ========================================================================= */
  function startQuizExam() {
    userExamAnswers = {};
    examResult = null;
    quizTimerSeconds = (quizData.timeLimitMinutes || 10) * 60;

    clearInterval(timerInterval);
    if (quizData.timeLimitMinutes > 0) {
      timerInterval = setInterval(() => {
        quizTimerSeconds--;
        updateTimerDisplay();
        if (quizTimerSeconds <= 0) {
          clearInterval(timerInterval);
          finishExam();
        }
      }, 1000);
    }

    renderShell();
  }

  function updateTimerDisplay() {
    const timerEl = container.querySelector('#quiz-exam-timer-val');
    if (!timerEl) return;
    const mins = Math.floor(quizTimerSeconds / 60);
    const secs = quizTimerSeconds % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (quizTimerSeconds < 60) {
      timerEl.style.color = '#e11d48';
    }
  }

  function renderExamLive(el) {
    const mins = Math.floor(quizTimerSeconds / 60);
    const secs = quizTimerSeconds % 60;

    el.innerHTML = `
      <!-- Active Timer & Exam Banner -->
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px 28px; box-shadow:0 2px 6px rgba(0,0,0,0.03); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="font-size:18px; font-weight:800; color:#0f172a; margin:0 0 4px 0;">${escapeHtml(quizData.title)}</h2>
          <div style="font-size:13px; color:#64748b;">${quizData.questions.length} Questions • ${getTotalPoints()} Total Points • Passing Score: ${quizData.passingScorePercent}%</div>
        </div>

        ${quizData.timeLimitMinutes > 0 ? `
          <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:10px; padding:8px 18px; text-align:center;">
            <div style="font-size:11px; font-weight:700; color:#e11d48; text-transform:uppercase;">Time Remaining</div>
            <div id="quiz-exam-timer-val" style="font-size:22px; font-weight:800; color:#be123c; font-family:monospace;">${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}</div>
          </div>
        ` : `
          <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:8px 18px; font-size:13px; font-weight:700; color:#166534;">
            No Time Limit
          </div>
        `}
      </div>

      <!-- Candidate Name Field -->
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:18px 24px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <label style="font-size:13px; font-weight:700; color:#475569; display:block; margin-bottom:6px;">Your Name or Candidate ID:</label>
        <input type="text" id="quiz-exam-candidate-name" value="Sovereign Executive" style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:8px 12px; font-size:14px; outline:none;">
      </div>

      <!-- Exam Questions -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${quizData.questions.map((q, idx) => `
          <div class="exam-q-card" style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:22px 26px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
              <div style="font-size:15px; font-weight:700; color:#0f172a;">${idx + 1}. ${escapeHtml(q.title)}</div>
              <span style="font-size:12px; font-weight:700; color:#0284c7; background:#f0f9ff; border:1px solid #bae6fd; padding:3px 8px; border-radius:6px; white-space:nowrap;">${q.points} Pts</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              ${(q.options || []).map((opt, oIdx) => `
                <label style="display:flex; align-items:center; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; font-size:14px; color:#334155; cursor:pointer; transition:all 0.15s;" onmouseover="this.style.background='#f1f5f9';" onmouseout="this.style.background='#f8fafc';">
                  <input type="radio" name="exam_ans_${q.id}" value="${oIdx}" style="accent-color:#0284c7; cursor:pointer;">
                  <span>${escapeHtml(opt)}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Submit Exam Button -->
      <div style="padding:16px 0 32px 0; display:flex; justify-content:center;">
        <button id="quiz-btn-submit-exam" style="background:#16a34a; color:#ffffff; font-weight:800; font-size:16px; padding:12px 36px; border-radius:8px; border:none; cursor:pointer; box-shadow:0 3px 8px rgba(22,163,74,0.3); transition:all 0.15s;">
          ✅ Submit Assessment & View Results
        </button>
      </div>
    `;

    // Handle submit
    el.querySelector('#quiz-btn-submit-exam')?.addEventListener('click', () => {
      finishExam();
    });
  }

  function finishExam() {
    clearInterval(timerInterval);

    // Collect candidate answers
    const contentEl = container.querySelector('#quiz-main-content');
    quizData.questions.forEach(q => {
      const selected = contentEl.querySelector(`input[name="exam_ans_${q.id}"]:checked`);
      if (selected) {
        userExamAnswers[q.id] = parseInt(selected.value, 10);
      } else {
        userExamAnswers[q.id] = null;
      }
    });

    const candidateName = contentEl.querySelector('#quiz-exam-candidate-name')?.value || 'Anonymous Candidate';

    // Calculate score
    let earnedPoints = 0;
    const totalPoints = getTotalPoints();

    quizData.questions.forEach(q => {
      if (userExamAnswers[q.id] === q.correctAnswer) {
        earnedPoints += (Number(q.points) || 0);
      }
    });

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = percentage >= quizData.passingScorePercent;

    examResult = {
      earnedPoints,
      totalPoints,
      percentage,
      passed,
      candidateName,
      answers: { ...userExamAnswers }
    };

    // Save to submissions
    quizData.submissions.push({
      id: 'sub_' + Date.now(),
      studentName: candidateName,
      submittedAt: new Date().toISOString(),
      score: earnedPoints,
      totalPoints,
      percentage,
      passed
    });
    saveQuizData();

    renderShell();
  }

  function renderExamResult(el) {
    if (!examResult) return;

    el.innerHTML = `
      <!-- Scorecard Banner -->
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); text-align:center; padding:36px 28px;">
        <div style="font-size:52px; margin-bottom:8px;">${examResult.passed ? '🎉' : '📚'}</div>
        <h1 style="font-size:26px; font-weight:800; color:#0f172a; margin:0 0 6px 0;">
          ${examResult.passed ? 'Congratulations! You Passed!' : 'Assessment Complete — Review Required'}
        </h1>
        <p style="font-size:14px; color:#64748b; margin:0 0 20px 0;">Candidate: <strong>${escapeHtml(examResult.candidateName)}</strong></p>

        <div style="display:inline-flex; align-items:center; gap:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px 28px; margin-bottom:20px;">
          <div>
            <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Score</div>
            <div style="font-size:36px; font-weight:800; color:${examResult.passed ? '#16a34a' : '#e11d48'};">${examResult.percentage}%</div>
          </div>
          <div style="width:1px; height:40px; background:#cbd5e1;"></div>
          <div>
            <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Points</div>
            <div style="font-size:36px; font-weight:800; color:#0f172a;">${examResult.earnedPoints} / ${examResult.totalPoints}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:12px;">
          <button id="quiz-btn-retake" style="background:${quizData.themeColor}; color:#ffffff; font-weight:700; font-size:14px; padding:10px 24px; border-radius:8px; border:none; cursor:pointer;">
            🔄 Retake Quiz
          </button>
          <button id="quiz-btn-back-editor" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; font-weight:600; font-size:14px; padding:10px 20px; border-radius:8px; cursor:pointer;">
            ✏️ Back to Editor
          </button>
        </div>
      </div>

      <!-- Detailed Review per question -->
      <h3 style="font-size:17px; font-weight:800; color:#0f172a; margin:16px 0 0 0;">Question Breakdown & Rationale Review</h3>
      <div style="display:flex; flex-direction:column; gap:14px;">
        ${quizData.questions.map((q, idx) => {
          const userAns = examResult.answers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          return `
            <div style="background:#ffffff; border-radius:12px; border:1px solid ${isCorrect ? '#86efac' : '#fca5a5'}; padding:20px 24px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div style="font-weight:700; font-size:15px; color:#0f172a;">${idx + 1}. ${escapeHtml(q.title)}</div>
                <span style="font-size:12px; font-weight:700; padding:3px 10px; border-radius:6px; background:${isCorrect ? '#f0fdf4' : '#fff1f2'}; color:${isCorrect ? '#166534' : '#be123c'};">
                  ${isCorrect ? `+${q.points} Pts (Correct)` : `0 / ${q.points} Pts (Incorrect)`}
                </span>
              </div>

              <div style="font-size:13px; color:#475569; margin-bottom:8px;">
                Your Answer: <strong style="color:${isCorrect ? '#166534' : '#be123c'};">${userAns !== null && q.options[userAns] ? escapeHtml(q.options[userAns]) : 'None selected'}</strong>
              </div>

              ${!isCorrect ? `
                <div style="font-size:13px; color:#166534; font-weight:600; margin-bottom:8px;">
                  Correct Answer: <span>${escapeHtml(q.options[q.correctAnswer])}</span>
                </div>
              ` : ''}

              ${q.explanation ? `
                <div style="background:#f8fafc; border-left:3px solid #0284c7; padding:8px 12px; font-size:12px; color:#475569; border-radius:0 6px 6px 0;">
                  💡 <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    el.querySelector('#quiz-btn-retake')?.addEventListener('click', () => {
      startQuizExam();
    });

    el.querySelector('#quiz-btn-back-editor')?.addEventListener('click', () => {
      isTakeQuizMode = false;
      examResult = null;
      renderShell();
    });
  }

  /* =========================================================================
   * GRADEBOOK & PERFORMANCE MATRIX
   * ========================================================================= */
  function renderGradebook(el) {
    const subs = quizData.submissions;
    const totalSubs = subs.length;
    let avgScore = 0;
    let passCount = 0;

    if (totalSubs > 0) {
      const sumPct = subs.reduce((sum, s) => sum + s.percentage, 0);
      avgScore = Math.round(sumPct / totalSubs);
      passCount = subs.filter(s => s.passed).length;
    }
    const passRate = totalSubs > 0 ? Math.round((passCount / totalSubs) * 100) : 0;

    el.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Candidates Assessed</div>
          <div style="font-size:32px; font-weight:800; color:#0f172a; margin-top:4px;">${totalSubs}</div>
          <div style="font-size:12px; color:#16a34a; font-weight:600; margin-top:4px;">Local In-Memory Gradebook</div>
        </div>

        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Average Score</div>
          <div style="font-size:32px; font-weight:800; color:#0284c7; margin-top:4px;">${avgScore}%</div>
          <div style="font-size:12px; color:#64748b; margin-top:4px;">Passing threshold: ${quizData.passingScorePercent}%</div>
        </div>

        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Pass Rate</div>
          <div style="font-size:32px; font-weight:800; color:#16a34a; margin-top:4px;">${passRate}%</div>
          <div style="font-size:12px; color:#64748b; margin-top:4px;">${passCount} passed out of ${totalSubs}</div>
        </div>
      </div>

      <!-- Submissions Table -->
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">Candidate Exam Registry</h3>
          <button id="gb-btn-clear" style="background:#fff1f2; border:1px solid #fecdd3; color:#e11d48; font-size:12px; font-weight:600; padding:5px 12px; border-radius:6px; cursor:pointer;">Clear Gradebook</button>
        </div>

        ${totalSubs === 0 ? `
          <div style="text-align:center; padding:32px; color:#64748b;">No candidate submissions yet. Click "Take Quiz" to run an assessment.</div>
        ` : `
          <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead>
              <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0;">
                <th style="padding:10px 12px; color:#475569; font-weight:700;">Candidate Name</th>
                <th style="padding:10px 12px; color:#475569; font-weight:700;">Submitted Time</th>
                <th style="padding:10px 12px; color:#475569; font-weight:700;">Points Earned</th>
                <th style="padding:10px 12px; color:#475569; font-weight:700;">Score %</th>
                <th style="padding:10px 12px; color:#475569; font-weight:700;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${subs.map(s => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 12px; font-weight:700; color:#1e293b;">${escapeHtml(s.studentName)}</td>
                  <td style="padding:10px 12px; color:#64748b;">${new Date(s.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style="padding:10px 12px; color:#0f172a; font-weight:600;">${s.score} / ${s.totalPoints}</td>
                  <td style="padding:10px 12px; font-weight:800; color:${s.passed ? '#16a34a' : '#e11d48'};">${s.percentage}%</td>
                  <td style="padding:10px 12px;">
                    <span style="font-size:11px; font-weight:700; padding:2px 8px; border-radius:12px; background:${s.passed ? '#f0fdf4' : '#fff1f2'}; color:${s.passed ? '#166534' : '#be123c'};">
                      ${s.passed ? 'PASSED' : 'NEEDS RETAKE'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    `;

    el.querySelector('#gb-btn-clear')?.addEventListener('click', () => {
      if (confirm('Clear all gradebook submissions?')) {
        quizData.submissions = [];
        saveQuizData();
        renderGradebook(el);
      }
    });
  }

  function exportGradebookToAxis() {
    if (quizData.submissions.length === 0) {
      alert('No gradebook submissions yet!');
      return;
    }
    const headers = ['Candidate ID', 'Candidate Name', 'Timestamp', 'Score Points', 'Total Points', 'Percentage', 'Status'];
    const rows = quizData.submissions.map(s => [
      s.id,
      `"${s.studentName.replace(/"/g, '""')}"`,
      s.submittedAt,
      s.score,
      s.totalPoints,
      `${s.percentage}%`,
      s.passed ? 'PASSED' : 'FAILED'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Gradebook.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.orbitPlatform && typeof window.orbitPlatform.triggerToast === 'function') {
      window.orbitPlatform.triggerToast('Exported Gradebook to CSV (Giri Axis Ready)', 'green');
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
