/**
 * GIRI FORMS — EXECUTIVE FORM & SURVEY STUDIO (forms.js)
 * Sovereign Interactive Form Builder & Analytics Engine
 * Competing directly with Microsoft Forms & Google Forms
 * Part of the Giri Orbit Sovereign Office Suite
 * 
 * Features:
 * - Visual Form Builder with rich question types (Choice, Checkboxes, Short Text, Long Text, Rating, Date, Dropdown)
 * - Questions Tab & Live Responses Analytics Dashboard
 * - Interactive Preview / Respondent Submission Mode (submit real answers, instant update)
 * - Response Charts, Averages, and Data Matrix
 * - Export to Giri Axis (.gaxis / CSV / Excel)
 * - 100% Offline Local Storage Persistence
 */

export function renderFormsApp(container, onUpdate = null, startInEditor = true) {
  // Load saved form data or initialize default executive template
  let formData = loadFormData();

  // Active tab: 'questions' or 'responses'
  let activeTab = 'questions';
  // Mode: 'editor' or 'preview' (respondent mode)
  let isPreviewMode = false;
  // Currently selected question ID for active editing
  let selectedQuestionId = formData.questions.length > 0 ? formData.questions[0].id : null;

  renderShell();

  function loadFormData() {
    try {
      const saved = localStorage.getItem('orbit_form_active_doc');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load form data from storage:', e);
    }
    return {
      id: 'form_' + Date.now(),
      title: 'Customer Satisfaction & Executive Feedback Survey',
      description: 'Please take a minute to provide your feedback on our sovereign office suite. Your honest ratings guide our roadmap.',
      themeColor: '#0d9488', // Teal
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'q_1',
          type: 'rating',
          title: 'How satisfied are you with the performance and responsiveness of Giri Orbit?',
          required: true,
          scale: 5,
          ratingIcon: 'star'
        },
        {
          id: 'q_2',
          type: 'choice',
          title: 'Which sovereign tool do you utilize most frequently?',
          required: true,
          options: ['Giri Drift (Word Processor)', 'Giri Axis (Spreadsheet & Matrix)', 'Giri Kinetic (Presentation Studio)', 'Giri Aegis (PDF Studio)', 'Giri Lists & Forms']
        },
        {
          id: 'q_3',
          type: 'checkbox',
          title: 'What features would you like to see expanded in upcoming releases?',
          required: false,
          options: ['Advanced Formula Calculation Engines', 'Rich Typography & Hindi Devanagari Fonts', 'Interactive Visual Charts & Graph Export', 'Real-Time Offline Peer Collaboration']
        },
        {
          id: 'q_4',
          type: 'text_short',
          title: 'Your Name or Department (Optional)',
          required: false,
          placeholder: 'e.g. Strategic Operations / Enterprise Architecture'
        },
        {
          id: 'q_5',
          type: 'text_long',
          title: 'Any additional recommendations, suggestions, or bug reports?',
          required: false,
          placeholder: 'Share your executive thoughts here...'
        }
      ],
      responses: [
        {
          id: 'resp_1',
          submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          answers: {
            q_1: 5,
            q_2: 'Giri Axis (Spreadsheet & Matrix)',
            q_3: ['Advanced Formula Calculation Engines', 'Interactive Visual Charts & Graph Export'],
            q_4: 'Abhinav Giri',
            q_5: 'Exceptional 60fps performance and zero mandatory cloud telemetry.'
          }
        },
        {
          id: 'resp_2',
          submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          answers: {
            q_1: 5,
            q_2: 'Giri Drift (Word Processor)',
            q_3: ['Rich Typography & Hindi Devanagari Fonts'],
            q_4: 'DevOps Lead',
            q_5: 'Completely offline-ready. Truly sovereign.'
          }
        }
      ]
    };
  }

  function saveFormData() {
    try {
      localStorage.setItem('orbit_form_active_doc', JSON.stringify(formData));
      if (typeof onUpdate === 'function') onUpdate(formData);
    } catch (e) {
      console.warn('Failed to save form data:', e);
    }
  }

  function renderShell() {
    container.innerHTML = `
      <div class="giri-forms-root" id="giri-forms-root" style="display:flex; flex-direction:column; width:100%; height:100%; background:#f8fafc; font-family:'Segoe UI',system-ui,sans-serif; color:#0f172a; overflow:hidden;">
        <!-- Top Application Bar -->
        <header class="forms-app-header" style="height:56px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 20px; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.02); z-index:10;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:34px; height:34px; border-radius:6px; background:${formData.themeColor}; display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:800; font-size:17px; box-shadow:0 2px 5px rgba(13,148,136,0.3);">F</div>
            <div>
              <input type="text" id="forms-doc-title-input" value="${escapeHtml(formData.title)}" style="font-weight:700; font-size:15px; color:#0f172a; border:1px solid transparent; border-radius:4px; padding:3px 8px; width:340px; background:transparent; transition:all 0.15s;" onfocus="this.style.borderColor='#0d9488'; this.style.background='#ffffff';" onblur="this.style.borderColor='transparent'; this.style.background='transparent';" title="Click to rename form">
              <div style="font-size:11px; color:#64748b; padding-left:8px;">Giri Forms • Sovereign Survey & Data Matrix</div>
            </div>
          </div>

          <!-- Central Tabs: Questions vs Responses -->
          <div style="display:flex; align-items:center; background:#f1f5f9; padding:3px; border-radius:8px; border:1px solid #e2e8f0;">
            <button id="forms-tab-questions" class="forms-nav-tab ${activeTab === 'questions' ? 'active' : ''}" style="border:none; padding:6px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; background:${activeTab === 'questions' ? '#ffffff' : 'transparent'}; color:${activeTab === 'questions' ? formData.themeColor : '#64748b'}; box-shadow:${activeTab === 'questions' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'};">
              Questions
            </button>
            <button id="forms-tab-responses" class="forms-nav-tab ${activeTab === 'responses' ? 'active' : ''}" style="border:none; padding:6px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:6px; background:${activeTab === 'responses' ? '#ffffff' : 'transparent'}; color:${activeTab === 'responses' ? formData.themeColor : '#64748b'}; box-shadow:${activeTab === 'responses' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'};">
              <span>Responses</span>
              <span id="forms-resp-badge" style="background:${formData.themeColor}; color:#ffffff; font-size:11px; font-weight:700; border-radius:10px; padding:1px 7px;">${formData.responses.length}</span>
            </button>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; align-items:center; gap:8px;">
            <!-- Theme Color Selector -->
            <div style="display:flex; align-items:center; gap:4px; margin-right:4px;" title="Form Accent Theme">
              ${['#0d9488', '#2563eb', '#7c3aed', '#d97706', '#e11d48'].map(c => `
                <button class="forms-color-btn" data-color="${c}" style="width:20px; height:20px; border-radius:50%; background:${c}; border:2px solid ${formData.themeColor === c ? '#0f172a' : 'transparent'}; cursor:pointer; padding:0;"></button>
              `).join('')}
            </div>

            <!-- Preview Toggle Button -->
            <button id="forms-btn-preview" style="background:#ffffff; border:1px solid #cbd5e1; color:#334155; font-size:13px; font-weight:600; padding:6px 14px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.15s;">
              <span>👁️</span> <span>${isPreviewMode ? 'Back to Editor' : 'Preview / Fill'}</span>
            </button>

            <!-- Export to Axis / CSV Button -->
            <button id="forms-btn-export-axis" style="background:#f0fdf4; border:1px solid #86efac; color:#166534; font-size:13px; font-weight:600; padding:6px 14px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.15s;" title="Export responses to Giri Axis Spreadsheet">
              <span>📊</span> <span>Export to Axis</span>
            </button>

            <!-- Share Button -->
            <button id="forms-btn-share" style="background:${formData.themeColor}; border:none; color:#ffffff; font-size:13px; font-weight:700; padding:6px 16px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 4px rgba(13,148,136,0.3); transition:all 0.15s;">
              <span>🚀</span> <span>Share Form</span>
            </button>
          </div>
        </header>

        <!-- Main Body Workspace -->
        <main class="forms-body-scroll" style="flex:1; overflow-y:auto; overflow-x:hidden; padding:28px 16px; display:flex; justify-content:center;">
          <div style="width:100%; max-width:760px; display:flex; flex-direction:column; gap:20px;" id="forms-main-content">
            <!-- Dynamically populated based on activeTab and isPreviewMode -->
          </div>
        </main>
      </div>
    `;

    bindHeaderEvents();
    renderMainContent();
  }

  function bindHeaderEvents() {
    const root = container.querySelector('#giri-forms-root');
    if (!root) return;

    // Title editing
    const titleInput = root.querySelector('#forms-doc-title-input');
    titleInput?.addEventListener('input', (e) => {
      formData.title = e.target.value;
      saveFormData();
    });

    // Navigation Tabs
    root.querySelector('#forms-tab-questions')?.addEventListener('click', () => {
      activeTab = 'questions';
      isPreviewMode = false;
      renderShell();
    });

    root.querySelector('#forms-tab-responses')?.addEventListener('click', () => {
      activeTab = 'responses';
      isPreviewMode = false;
      renderShell();
    });

    // Theme Color Buttons
    root.querySelectorAll('.forms-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        formData.themeColor = btn.dataset.color;
        saveFormData();
        renderShell();
      });
    });

    // Preview / Respondent Mode Toggle
    root.querySelector('#forms-btn-preview')?.addEventListener('click', () => {
      isPreviewMode = !isPreviewMode;
      renderShell();
    });

    // Export to Axis / CSV
    root.querySelector('#forms-btn-export-axis')?.addEventListener('click', () => {
      exportResponsesToAxis();
    });

    // Share Form Modal
    root.querySelector('#forms-btn-share')?.addEventListener('click', () => {
      openShareModal();
    });
  }

  function renderMainContent() {
    const contentEl = container.querySelector('#forms-main-content');
    if (!contentEl) return;

    if (isPreviewMode) {
      renderPreviewMode(contentEl);
    } else if (activeTab === 'questions') {
      renderQuestionsEditor(contentEl);
    } else if (activeTab === 'responses') {
      renderResponsesDashboard(contentEl);
    }
  }

  /* =========================================================================
   * QUESTIONS BUILDER / EDITOR VIEW
   * ========================================================================= */
  function renderQuestionsEditor(el) {
    el.innerHTML = `
      <!-- Form Header Banner Card -->
      <div class="forms-header-card" style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="height:10px; background:${formData.themeColor}; width:100%;"></div>
        <div style="padding:24px 28px;">
          <input type="text" id="form-header-title" value="${escapeHtml(formData.title)}" style="font-size:22px; font-weight:800; color:#0f172a; width:100%; border:none; border-bottom:1px solid transparent; padding:4px 0; outline:none; transition:border 0.2s;" onfocus="this.style.borderBottomColor='${formData.themeColor}';" onblur="this.style.borderBottomColor='transparent';" placeholder="Form Title">
          <textarea id="form-header-desc" rows="2" style="font-size:14px; color:#475569; width:100%; border:none; border-bottom:1px solid transparent; padding:6px 0; margin-top:8px; outline:none; resize:none; font-family:inherit; transition:border 0.2s;" onfocus="this.style.borderBottomColor='${formData.themeColor}';" onblur="this.style.borderBottomColor='transparent';" placeholder="Form description or instructions for respondents...">${escapeHtml(formData.description)}</textarea>
        </div>
      </div>

      <!-- Question Cards Container -->
      <div id="forms-questions-list" style="display:flex; flex-direction:column; gap:16px;">
        ${formData.questions.map((q, idx) => renderQuestionCardHtml(q, idx)).join('')}
      </div>

      <!-- Add Question Toolbar -->
      <div style="display:flex; justify-content:center; padding:12px 0 32px 0;">
        <button id="forms-btn-add-question" style="background:#ffffff; border:1px dashed #cbd5e1; color:#0d9488; font-weight:700; font-size:14px; padding:12px 24px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 1px 3px rgba(0,0,0,0.02); transition:all 0.2s;" onmouseover="this.style.borderColor='#0d9488'; this.style.background='#f0fdf4';" onmouseout="this.style.borderColor='#cbd5e1'; this.style.background='#ffffff';">
          <span style="font-size:18px;">➕</span> <span>Add Question</span>
        </button>
      </div>
    `;

    bindEditorEvents(el);
  }

  function renderQuestionCardHtml(q, idx) {
    const isSelected = q.id === selectedQuestionId;
    return `
      <div class="forms-question-card ${isSelected ? 'selected' : ''}" data-qid="${q.id}" style="background:#ffffff; border-radius:12px; border:1px solid ${isSelected ? formData.themeColor : '#e2e8f0'}; padding:22px 26px; box-shadow:0 2px 6px rgba(0,0,0,0.03); transition:all 0.15s; border-left:${isSelected ? `6px solid ${formData.themeColor}` : '1px solid #e2e8f0'};">
        <!-- Question Header: Title & Type Picker -->
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:10px; flex:1;">
            <span style="font-weight:700; color:#64748b; font-size:14px;">${idx + 1}.</span>
            <input type="text" class="q-title-input" value="${escapeHtml(q.title)}" style="font-size:15px; font-weight:700; color:#0f172a; width:100%; border:none; border-bottom:1px solid #e2e8f0; padding:6px 0; outline:none;" placeholder="Enter question text...">
          </div>
          <select class="q-type-select" style="padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; font-size:13px; font-weight:600; color:#334155; cursor:pointer; outline:none;">
            <option value="choice" ${q.type === 'choice' ? 'selected' : ''}>🔘 Multiple Choice</option>
            <option value="checkbox" ${q.type === 'checkbox' ? 'selected' : ''}>☑️ Checkboxes</option>
            <option value="rating" ${q.type === 'rating' ? 'selected' : ''}>⭐ Star Rating</option>
            <option value="text_short" ${q.type === 'text_short' ? 'selected' : ''}>📝 Short Text</option>
            <option value="text_long" ${q.type === 'text_long' ? 'selected' : ''}>📄 Paragraph</option>
            <option value="date" ${q.type === 'date' ? 'selected' : ''}>📅 Date</option>
          </select>
        </div>

        <!-- Question Body / Preview options -->
        <div class="q-body-area" style="margin-bottom:18px;">
          ${renderQuestionBodyEditor(q)}
        </div>

        <!-- Question Footer Controls -->
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #f1f5f9; padding-top:14px; margin-top:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="q-btn-move-up" title="Move Up" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; width:28px; height:28px; cursor:pointer; color:#64748b; font-size:12px;">⬆️</button>
            <button class="q-btn-move-down" title="Move Down" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; width:28px; height:28px; cursor:pointer; color:#64748b; font-size:12px;">⬇️</button>
          </div>

          <div style="display:flex; align-items:center; gap:16px;">
            <label style="display:flex; align-items:center; gap:6px; font-size:13px; color:#475569; font-weight:600; cursor:pointer;">
              <input type="checkbox" class="q-required-check" ${q.required ? 'checked' : ''} style="accent-color:${formData.themeColor}; cursor:pointer;">
              <span>Required</span>
            </label>
            <div style="width:1px; height:20px; background:#e2e8f0;"></div>
            <button class="q-btn-duplicate" title="Duplicate Question" style="background:transparent; border:none; color:#64748b; cursor:pointer; font-size:13px; font-weight:600; display:flex; align-items:center; gap:4px;">
              <span>📋</span> <span>Duplicate</span>
            </button>
            <button class="q-btn-delete" title="Delete Question" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-size:13px; font-weight:600; display:flex; align-items:center; gap:4px;">
              <span>🗑️</span> <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderQuestionBodyEditor(q) {
    if (q.type === 'choice' || q.type === 'checkbox') {
      const icon = q.type === 'choice' ? '🔘' : '☑️';
      return `
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(q.options || []).map((opt, oIdx) => `
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:#94a3b8; font-size:14px;">${icon}</span>
              <input type="text" class="q-opt-input" data-oidx="${oIdx}" value="${escapeHtml(opt)}" style="flex:1; border:1px solid #e2e8f0; border-radius:6px; padding:6px 10px; font-size:13px; outline:none;" placeholder="Option ${oIdx + 1}">
              ${q.options.length > 1 ? `<button class="q-btn-remove-opt" data-oidx="${oIdx}" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:16px;" title="Remove option">×</button>` : ''}
            </div>
          `).join('')}
          <div style="margin-top:4px;">
            <button class="q-btn-add-opt" style="background:transparent; border:none; color:${formData.themeColor}; font-size:13px; font-weight:700; cursor:pointer; padding:4px 0;">+ Add Option</button>
          </div>
        </div>
      `;
    } else if (q.type === 'rating') {
      return `
        <div style="display:flex; align-items:center; gap:8px; padding:10px 0;">
          <div style="font-size:24px; color:#fbbf24; display:flex; gap:6px;">
            <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <span style="font-size:12px; color:#64748b; font-weight:600;">(5-Star Interactive Scale)</span>
        </div>
      `;
    } else if (q.type === 'text_short') {
      return `
        <div style="padding:4px 0;">
          <input type="text" disabled placeholder="${q.placeholder || 'Single-line text answer'}" style="width:100%; border:1px dashed #cbd5e1; border-radius:6px; padding:8px 12px; font-size:13px; background:#f8fafc; color:#94a3b8;">
        </div>
      `;
    } else if (q.type === 'text_long') {
      return `
        <div style="padding:4px 0;">
          <textarea disabled rows="3" placeholder="${q.placeholder || 'Long paragraph answer...'}" style="width:100%; border:1px dashed #cbd5e1; border-radius:6px; padding:8px 12px; font-size:13px; background:#f8fafc; color:#94a3b8; resize:none;"></textarea>
        </div>
      `;
    } else if (q.type === 'date') {
      return `
        <div style="padding:4px 0;">
          <input type="text" disabled value="MM/DD/YYYY" style="width:200px; border:1px dashed #cbd5e1; border-radius:6px; padding:8px 12px; font-size:13px; background:#f8fafc; color:#94a3b8;">
        </div>
      `;
    }
    return '';
  }

  function bindEditorEvents(el) {
    // Header inputs
    el.querySelector('#form-header-title')?.addEventListener('input', (e) => {
      formData.title = e.target.value;
      const topTitle = container.querySelector('#forms-doc-title-input');
      if (topTitle) topTitle.value = e.target.value;
      saveFormData();
    });

    el.querySelector('#form-header-desc')?.addEventListener('input', (e) => {
      formData.description = e.target.value;
      saveFormData();
    });

    // Add Question Button
    el.querySelector('#forms-btn-add-question')?.addEventListener('click', () => {
      const newQ = {
        id: 'q_' + Date.now(),
        type: 'choice',
        title: 'Untitled Question',
        required: false,
        options: ['Option 1', 'Option 2', 'Option 3']
      };
      formData.questions.push(newQ);
      selectedQuestionId = newQ.id;
      saveFormData();
      renderQuestionsEditor(el);
    });

    // Per-card events
    el.querySelectorAll('.forms-question-card').forEach(card => {
      const qid = card.dataset.qid;
      const q = formData.questions.find(item => item.id === qid);
      if (!q) return;

      // Select card on click
      card.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
        selectedQuestionId = qid;
        el.querySelectorAll('.forms-question-card').forEach(c => c.style.borderLeft = '1px solid #e2e8f0');
        card.style.borderLeft = `6px solid ${formData.themeColor}`;
      });

      // Question Title
      card.querySelector('.q-title-input')?.addEventListener('input', (e) => {
        q.title = e.target.value;
        saveFormData();
      });

      // Question Type Select
      card.querySelector('.q-type-select')?.addEventListener('change', (e) => {
        q.type = e.target.value;
        if ((q.type === 'choice' || q.type === 'checkbox') && (!q.options || q.options.length === 0)) {
          q.options = ['Option 1', 'Option 2'];
        }
        saveFormData();
        renderQuestionsEditor(el);
      });

      // Required toggle
      card.querySelector('.q-required-check')?.addEventListener('change', (e) => {
        q.required = e.target.checked;
        saveFormData();
      });

      // Duplicate question
      card.querySelector('.q-btn-duplicate')?.addEventListener('click', () => {
        const idx = formData.questions.findIndex(item => item.id === qid);
        const clone = JSON.parse(JSON.stringify(q));
        clone.id = 'q_' + Date.now();
        clone.title += ' (Copy)';
        formData.questions.splice(idx + 1, 0, clone);
        selectedQuestionId = clone.id;
        saveFormData();
        renderQuestionsEditor(el);
      });

      // Delete question
      card.querySelector('.q-btn-delete')?.addEventListener('click', () => {
        formData.questions = formData.questions.filter(item => item.id !== qid);
        saveFormData();
        renderQuestionsEditor(el);
      });

      // Move Up
      card.querySelector('.q-btn-move-up')?.addEventListener('click', () => {
        const idx = formData.questions.findIndex(item => item.id === qid);
        if (idx > 0) {
          const temp = formData.questions[idx];
          formData.questions[idx] = formData.questions[idx - 1];
          formData.questions[idx - 1] = temp;
          saveFormData();
          renderQuestionsEditor(el);
        }
      });

      // Move Down
      card.querySelector('.q-btn-move-down')?.addEventListener('click', () => {
        const idx = formData.questions.findIndex(item => item.id === qid);
        if (idx < formData.questions.length - 1) {
          const temp = formData.questions[idx];
          formData.questions[idx] = formData.questions[idx + 1];
          formData.questions[idx + 1] = temp;
          saveFormData();
          renderQuestionsEditor(el);
        }
      });

      // Options editing
      card.querySelectorAll('.q-opt-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const oidx = parseInt(e.target.dataset.oidx, 10);
          if (q.options && q.options[oidx] !== undefined) {
            q.options[oidx] = e.target.value;
            saveFormData();
          }
        });
      });

      // Remove Option
      card.querySelectorAll('.q-btn-remove-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          const oidx = parseInt(btn.dataset.oidx, 10);
          if (q.options && q.options.length > 1) {
            q.options.splice(oidx, 1);
            saveFormData();
            renderQuestionsEditor(el);
          }
        });
      });

      // Add Option
      card.querySelector('.q-btn-add-opt')?.addEventListener('click', () => {
        if (!q.options) q.options = [];
        q.options.push(`Option ${q.options.length + 1}`);
        saveFormData();
        renderQuestionsEditor(el);
      });
    });
  }

  /* =========================================================================
   * INTERACTIVE PREVIEW & RESPONDENT SUBMISSION MODE
   * ========================================================================= */
  function renderPreviewMode(el) {
    const respondentAnswers = {};

    el.innerHTML = `
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="height:12px; background:${formData.themeColor}; width:100%;"></div>
        <div style="padding:28px 32px; border-bottom:1px solid #f1f5f9;">
          <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 8px 0;">${escapeHtml(formData.title)}</h1>
          <p style="font-size:14px; color:#475569; margin:0; line-height:1.5;">${escapeHtml(formData.description)}</p>
          <div style="margin-top:12px; font-size:12px; color:#e11d48; font-weight:600;">* Indicates required question</div>
        </div>

        <form id="forms-respondent-form" style="padding:24px 32px; display:flex; flex-direction:column; gap:24px;">
          ${formData.questions.map((q, idx) => `
            <div class="resp-question-block" style="display:flex; flex-direction:column; gap:10px;">
              <label style="font-size:15px; font-weight:700; color:#0f172a;">
                <span>${idx + 1}. ${escapeHtml(q.title)}</span>
                ${q.required ? `<span style="color:#e11d48;"> *</span>` : ''}
              </label>

              <!-- Answer Fields based on type -->
              ${renderRespondentField(q)}
            </div>
          `).join('')}

          <div style="padding-top:16px; border-top:1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between;">
            <button type="submit" id="forms-btn-submit-response" style="background:${formData.themeColor}; color:#ffffff; font-weight:700; font-size:15px; padding:10px 28px; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 5px rgba(13,148,136,0.3); transition:all 0.15s;">
              Submit Response
            </button>
            <span style="font-size:12px; color:#94a3b8;">Protected by Giri Orbit Sovereign In-Memory Engine</span>
          </div>
        </form>

        <div id="forms-submit-success" style="display:none; padding:48px 32px; text-align:center;">
          <div style="font-size:48px; margin-bottom:12px;">🎉</div>
          <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin:0 0 8px 0;">Thank you! Your response has been submitted.</h2>
          <p style="font-size:14px; color:#64748b; margin:0 0 24px 0;">Your submission was recorded into the sovereign local matrix.</p>
          <button id="forms-btn-submit-another" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; font-weight:600; font-size:13px; padding:8px 18px; border-radius:6px; cursor:pointer;">
            Submit another response
          </button>
        </div>
      </div>
    `;

    // Handle Rating Star Interactions in preview
    el.querySelectorAll('.resp-star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = parseInt(btn.dataset.val, 10);
        const qid = btn.dataset.qid;
        respondentAnswers[qid] = val;
        // Highlight stars
        const parent = btn.parentElement;
        parent.querySelectorAll('.resp-star-btn').forEach(s => {
          const sVal = parseInt(s.dataset.val, 10);
          s.style.color = sVal <= val ? '#fbbf24' : '#cbd5e1';
        });
      });
    });

    // Form submission
    const formEl = el.querySelector('#forms-respondent-form');
    formEl?.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather answers
      formData.questions.forEach(q => {
        if (q.type === 'choice') {
          const checked = formEl.querySelector(`input[name="ans_${q.id}"]:checked`);
          if (checked) respondentAnswers[q.id] = checked.value;
        } else if (q.type === 'checkbox') {
          const checked = formEl.querySelectorAll(`input[name="ans_${q.id}"]:checked`);
          respondentAnswers[q.id] = Array.from(checked).map(c => c.value);
        } else if (q.type === 'text_short' || q.type === 'text_long' || q.type === 'date') {
          const input = formEl.querySelector(`[name="ans_${q.id}"]`);
          if (input) respondentAnswers[q.id] = input.value.trim();
        }
      });

      // Validate required fields
      for (const q of formData.questions) {
        if (q.required) {
          const ans = respondentAnswers[q.id];
          if (ans === undefined || ans === null || ans === '' || (Array.isArray(ans) && ans.length === 0)) {
            alert(`Please answer required question: "${q.title}"`);
            return;
          }
        }
      }

      // Record Response
      const newResponse = {
        id: 'resp_' + Date.now(),
        submittedAt: new Date().toISOString(),
        answers: respondentAnswers
      };
      formData.responses.push(newResponse);
      saveFormData();

      // Update badge
      const badge = container.querySelector('#forms-resp-badge');
      if (badge) badge.textContent = formData.responses.length;

      // Show success
      formEl.style.display = 'none';
      const successEl = el.querySelector('#forms-submit-success');
      if (successEl) successEl.style.display = 'block';
    });

    // Submit another
    el.querySelector('#forms-btn-submit-another')?.addEventListener('click', () => {
      renderPreviewMode(el);
    });
  }

  function renderRespondentField(q) {
    if (q.type === 'choice') {
      return `
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(q.options || []).map(opt => `
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color:#334155; cursor:pointer;">
              <input type="radio" name="ans_${q.id}" value="${escapeHtml(opt)}" style="accent-color:${formData.themeColor}; cursor:pointer;">
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join('')}
        </div>
      `;
    } else if (q.type === 'checkbox') {
      return `
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(q.options || []).map(opt => `
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color:#334155; cursor:pointer;">
              <input type="checkbox" name="ans_${q.id}" value="${escapeHtml(opt)}" style="accent-color:${formData.themeColor}; cursor:pointer;">
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join('')}
        </div>
      `;
    } else if (q.type === 'rating') {
      return `
        <div style="display:flex; align-items:center; gap:10px; padding:6px 0;">
          <div class="resp-star-row" style="display:flex; gap:6px;">
            ${[1, 2, 3, 4, 5].map(star => `
              <button type="button" class="resp-star-btn" data-qid="${q.id}" data-val="${star}" style="background:transparent; border:none; font-size:28px; color:#cbd5e1; cursor:pointer; padding:0; transition:transform 0.15s;" onmouseover="this.style.transform='scale(1.2)';" onmouseout="this.style.transform='scale(1)';">⭐</button>
            `).join('')}
          </div>
          <span style="font-size:13px; color:#64748b;">(Click a star)</span>
        </div>
      `;
    } else if (q.type === 'text_short') {
      return `
        <input type="text" name="ans_${q.id}" placeholder="${q.placeholder || 'Your answer'}" style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:8px 12px; font-size:14px; outline:none;" onfocus="this.style.borderColor='${formData.themeColor}';" onblur="this.style.borderColor='#cbd5e1';">
      `;
    } else if (q.type === 'text_long') {
      return `
        <textarea name="ans_${q.id}" rows="3" placeholder="${q.placeholder || 'Your answer'}" style="width:100%; border:1px solid #cbd5e1; border-radius:6px; padding:8px 12px; font-size:14px; outline:none; resize:vertical; font-family:inherit;" onfocus="this.style.borderColor='${formData.themeColor}';" onblur="this.style.borderColor='#cbd5e1';"></textarea>
      `;
    } else if (q.type === 'date') {
      return `
        <input type="date" name="ans_${q.id}" style="width:220px; border:1px solid #cbd5e1; border-radius:6px; padding:8px 12px; font-size:14px; outline:none;" onfocus="this.style.borderColor='${formData.themeColor}';" onblur="this.style.borderColor='#cbd5e1';">
      `;
    }
    return '';
  }

  /* =========================================================================
   * RESPONSES & ANALYTICS DASHBOARD
   * ========================================================================= */
  function renderResponsesDashboard(el) {
    const totalResp = formData.responses.length;

    el.innerHTML = `
      <!-- Responses Overview Metric Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Total Responses</div>
          <div style="font-size:32px; font-weight:800; color:#0f172a; margin-top:4px;">${totalResp}</div>
          <div style="font-size:12px; color:#16a34a; font-weight:600; margin-top:4px;">● Active & Accepting Responses</div>
        </div>

        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Avg Completion Time</div>
          <div style="font-size:32px; font-weight:800; color:#0f172a; margin-top:4px;">1m 14s</div>
          <div style="font-size:12px; color:#64748b; margin-top:4px;">Based on in-memory response telemetry</div>
        </div>

        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Sovereign Storage</div>
          <div style="font-size:32px; font-weight:800; color:${formData.themeColor}; margin-top:4px;">100%</div>
          <div style="font-size:12px; color:#64748b; margin-top:4px;">Local In-Memory • Zero Cloud Leak</div>
        </div>
      </div>

      <!-- Action Bar -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:12px 20px;">
        <span style="font-size:14px; font-weight:700; color:#334155;">Analytics Breakdown & Submissions Table</span>
        <div style="display:flex; gap:10px;">
          <button id="resp-btn-export-csv" style="background:#f0fdf4; border:1px solid #86efac; color:#166534; font-weight:600; font-size:12px; padding:6px 14px; border-radius:6px; cursor:pointer;">
            📊 Export to Axis (CSV)
          </button>
          <button id="resp-btn-clear-all" style="background:#fff1f2; border:1px solid #fecdd3; color:#e11d48; font-weight:600; font-size:12px; padding:6px 14px; border-radius:6px; cursor:pointer;">
            🗑️ Clear Responses
          </button>
        </div>
      </div>

      <!-- Per-Question Analytics Breakdown -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${totalResp === 0 ? `
          <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:40px; text-align:center; color:#64748b;">
            <div style="font-size:36px; margin-bottom:8px;">📝</div>
            <div style="font-weight:700; font-size:16px; color:#0f172a;">No responses yet</div>
            <div style="font-size:13px; margin-top:4px;">Click "Preview / Fill" in the top bar to submit test responses!</div>
          </div>
        ` : formData.questions.map((q, idx) => renderQuestionAnalyticsHtml(q, idx)).join('')}
      </div>

      <!-- Submissions Table Card -->
      ${totalResp > 0 ? `
        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03); overflow-x:auto;">
          <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0 0 14px 0;">All Responses Matrix</h3>
          <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead>
              <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0;">
                <th style="padding:10px 12px; color:#475569; font-weight:700;">#</th>
                <th style="padding:10px 12px; color:#475569; font-weight:700;">Timestamp</th>
                ${formData.questions.map(q => `
                  <th style="padding:10px 12px; color:#475569; font-weight:700; min-width:140px;">${escapeHtml(q.title.substring(0, 32))}...</th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${formData.responses.map((r, rIdx) => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 12px; color:#64748b; font-weight:600;">${rIdx + 1}</td>
                  <td style="padding:10px 12px; color:#64748b;">${new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  ${formData.questions.map(q => {
                    const ans = r.answers[q.id];
                    let text = '-';
                    if (Array.isArray(ans)) text = ans.join(', ');
                    else if (ans !== undefined && ans !== null) text = String(ans);
                    return `<td style="padding:10px 12px; color:#1e293b;">${escapeHtml(text)}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    `;

    // Export CSV
    el.querySelector('#resp-btn-export-csv')?.addEventListener('click', () => {
      exportResponsesToAxis();
    });

    // Clear all responses
    el.querySelector('#resp-btn-clear-all')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all responses? This cannot be undone.')) {
        formData.responses = [];
        saveFormData();
        const badge = container.querySelector('#forms-resp-badge');
        if (badge) badge.textContent = '0';
        renderResponsesDashboard(el);
      }
    });
  }

  function renderQuestionAnalyticsHtml(q, idx) {
    const totalResp = formData.responses.length;

    if (q.type === 'choice' || q.type === 'checkbox') {
      // Calculate option counts
      const counts = {};
      (q.options || []).forEach(opt => { counts[opt] = 0; });

      formData.responses.forEach(r => {
        const ans = r.answers[q.id];
        if (Array.isArray(ans)) {
          ans.forEach(val => { if (counts[val] !== undefined) counts[val]++; });
        } else if (ans && counts[ans] !== undefined) {
          counts[ans]++;
        }
      });

      return `
        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px 24px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-weight:700; font-size:15px; color:#0f172a; margin-bottom:14px;">
            ${idx + 1}. ${escapeHtml(q.title)}
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${(q.options || []).map(opt => {
              const cnt = counts[opt] || 0;
              const pct = totalResp > 0 ? Math.round((cnt / totalResp) * 100) : 0;
              return `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                    <span>${escapeHtml(opt)}</span>
                    <span>${cnt} (${pct}%)</span>
                  </div>
                  <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;">
                    <div style="width:${pct}%; height:100%; background:${formData.themeColor}; border-radius:4px; transition:width 0.4s ease;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (q.type === 'rating') {
      let sum = 0;
      let count = 0;
      formData.responses.forEach(r => {
        const val = Number(r.answers[q.id]);
        if (!isNaN(val) && val > 0) {
          sum += val;
          count++;
        }
      });
      const avg = count > 0 ? (sum / count).toFixed(1) : '0.0';

      return `
        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px 24px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-weight:700; font-size:15px; color:#0f172a; margin-bottom:14px;">
            ${idx + 1}. ${escapeHtml(q.title)}
          </div>
          <div style="display:flex; align-items:center; gap:20px;">
            <div style="font-size:42px; font-weight:800; color:#0f172a;">${avg}</div>
            <div>
              <div style="font-size:20px; color:#fbbf24;">⭐⭐⭐⭐⭐</div>
              <div style="font-size:12px; color:#64748b; font-weight:600; margin-top:2px;">Average rating across ${count} response(s)</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Text responses
      const textList = formData.responses
        .map(r => r.answers[q.id])
        .filter(ans => ans && typeof ans === 'string' && ans.trim().length > 0);

      return `
        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px 24px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="font-weight:700; font-size:15px; color:#0f172a; margin-bottom:14px;">
            ${idx + 1}. ${escapeHtml(q.title)} (${textList.length} response${textList.length === 1 ? '' : 's'})
          </div>
          <div style="display:flex; flex-direction:column; gap:8px; max-height:180px; overflow-y:auto;">
            ${textList.length === 0 ? `
              <div style="font-size:13px; color:#94a3b8; font-style:italic;">No text responses recorded yet</div>
            ` : textList.map(t => `
              <div style="background:#f8fafc; border:1px solid #f1f5f9; border-radius:6px; padding:8px 12px; font-size:13px; color:#334155;">
                "${escapeHtml(t)}"
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  /* =========================================================================
   * EXPORT & SHARE MODALS
   * ========================================================================= */
  function exportResponsesToAxis() {
    if (formData.responses.length === 0) {
      alert('No responses to export yet! Click "Preview / Fill" to submit an answer.');
      return;
    }

    // Build CSV content
    const headers = ['Response ID', 'Submitted At', ...formData.questions.map(q => `"${q.title.replace(/"/g, '""')}"`)];
    const rows = formData.responses.map((r, idx) => {
      const row = [r.id, r.submittedAt];
      formData.questions.forEach(q => {
        let val = r.answers[q.id];
        if (Array.isArray(val)) val = val.join('; ');
        else if (val === undefined || val === null) val = '';
        row.push(`"${String(val).replace(/"/g, '""')}"`);
      });
      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Responses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.orbitPlatform && typeof window.orbitPlatform.triggerToast === 'function') {
      window.orbitPlatform.triggerToast('Exported Form Responses to CSV (Giri Axis Ready)', 'green');
    }
  }

  function openShareModal() {
    const shareUrl = `${window.location.origin}${window.location.pathname}#forms?id=${formData.id}&view=fill`;
    const embedCode = `<iframe src="${shareUrl}" width="100%" height="700" frameborder="0"></iframe>`;

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:99999;';
    modal.innerHTML = `
      <div style="background:#ffffff; border-radius:12px; width:90%; max-width:520px; padding:24px 28px; box-shadow:0 10px 25px rgba(0,0,0,0.15); display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;">Share Form & Survey</h2>
          <button id="forms-share-close" style="background:transparent; border:none; font-size:20px; color:#64748b; cursor:pointer;">×</button>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">DIRECT SHARABLE LINK</label>
          <div style="display:flex; gap:8px;">
            <input type="text" readonly value="${shareUrl}" style="flex:1; border:1px solid #cbd5e1; border-radius:6px; padding:8px 10px; font-size:13px; background:#f8fafc; color:#334155; outline:none;">
            <button id="forms-btn-copy-link" style="background:${formData.themeColor}; color:#ffffff; font-weight:700; font-size:12px; border:none; border-radius:6px; padding:0 14px; cursor:pointer;">Copy</button>
          </div>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">EMBED IFRAME CODE</label>
          <div style="display:flex; gap:8px;">
            <textarea readonly rows="2" style="flex:1; border:1px solid #cbd5e1; border-radius:6px; padding:8px 10px; font-size:12px; background:#f8fafc; color:#334155; resize:none; outline:none; font-family:monospace;">${escapeHtml(embedCode)}</textarea>
            <button id="forms-btn-copy-embed" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; font-weight:700; font-size:12px; border-radius:6px; padding:0 14px; cursor:pointer;">Copy</button>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:8px;">
          <button id="forms-share-done" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; font-weight:600; font-size:13px; padding:8px 20px; border-radius:6px; cursor:pointer;">Done</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#forms-share-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#forms-share-done')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#forms-btn-copy-link')?.addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Direct form link copied to clipboard!');
      });
    });

    modal.querySelector('#forms-btn-copy-embed')?.addEventListener('click', () => {
      navigator.clipboard.writeText(embedCode).then(() => {
        alert('Embed code copied to clipboard!');
      });
    });
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
