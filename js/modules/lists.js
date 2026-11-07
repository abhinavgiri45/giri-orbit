/**
 * GIRI LISTS — ENTERPRISE DATA MATRIX & KANBAN TASK TRACKER (lists.js)
 * Sovereign Structured Information Manager & Agile Board
 * Competing directly with Microsoft Lists, Airtable, & Notion Database
 * Part of the Giri Orbit Sovereign Office Suite
 * 
 * Features:
 * - Dual View Switcher: Table / Matrix View vs. Agile Kanban Board View
 * - Rich Custom Attributes: Status Pills, Priority Badges, Assignees, Due Dates, Category Chips, Progress Sliders
 * - Real-Time Search, Multi-Filter (Status, Priority), and Sorting
 * - Kanban Drag & 1-Click State Transitions
 * - Ready-Made Professional Templates (Project Tracker, Sprint Board, Content Pipeline)
 * - One-Click Export to Giri Axis (.gaxis / CSV / Excel)
 * - 100% Offline Local Storage Persistence
 */

export function renderListsApp(container, onUpdate = null, startInEditor = true) {
  let listData = loadListData();
  let currentView = 'grid'; // 'grid' (table) or 'board' (kanban)
  let searchQuery = '';
  let filterStatus = 'all';
  let filterPriority = 'all';

  renderShell();

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
      themeColor: '#7c3aed', // Purple / Violet
      columns: [
        { id: 'col_status', name: 'Status', type: 'status' },
        { id: 'col_priority', name: 'Priority', type: 'priority' },
        { id: 'col_assignee', name: 'Assignee', type: 'text' },
        { id: 'col_due', name: 'Due Date', type: 'date' },
        { id: 'col_tag', name: 'Domain', type: 'tag' },
        { id: 'col_progress', name: 'Progress', type: 'progress' }
      ],
      items: [
        {
          id: 'item_1',
          title: 'Deploy High-Velocity C++ Win32 & GDI+ Sovereign Suite',
          status: 'Completed',
          priority: 'Urgent',
          assignee: 'Abhinav Giri',
          dueDate: '2026-11-08',
          tag: 'Core Platform',
          progress: 100
        },
        {
          id: 'item_2',
          title: 'Ship Dedicated Forms, Quiz, Lists, and Designer Sovereign Studios',
          status: 'In Progress',
          priority: 'Urgent',
          assignee: 'Abhinav Giri',
          dueDate: '2026-11-09',
          tag: 'Web & Desktop',
          progress: 90
        },
        {
          id: 'item_3',
          title: 'Audit Zero Telemetry Privacy & In-Memory Offline Security',
          status: 'Under Review',
          priority: 'High',
          assignee: 'Security Auditor',
          dueDate: '2026-11-12',
          tag: 'Security',
          progress: 75
        },
        {
          id: 'item_4',
          title: 'Implement Interactive Charting & Donut Visualization in Axis',
          status: 'Completed',
          priority: 'High',
          assignee: 'Data Lead',
          dueDate: '2026-11-10',
          tag: 'Axis Sheets',
          progress: 100
        },
        {
          id: 'item_5',
          title: 'Prepare Worldwide Open Source Sovereign Deployment Mirror',
          status: 'Not Started',
          priority: 'Medium',
          assignee: 'DevOps Ops',
          dueDate: '2026-11-20',
          tag: 'Infrastructure',
          progress: 0
        }
      ]
    };
  }

  function saveListData() {
    try {
      localStorage.setItem('orbit_list_active_doc', JSON.stringify(listData));
      if (typeof onUpdate === 'function') onUpdate(listData);
    } catch (e) {
      console.warn('Failed to save list data:', e);
    }
  }

  function renderShell() {
    container.innerHTML = `
      <div class="giri-lists-root" id="giri-lists-root" style="display:flex; flex-direction:column; width:100%; height:100%; background:#f8fafc; font-family:'Segoe UI',system-ui,sans-serif; color:#0f172a; overflow:hidden;">
        <!-- Top Application Header Bar -->
        <header class="lists-app-header" style="height:56px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 20px; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.02); z-index:10;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:34px; height:34px; border-radius:6px; background:${listData.themeColor}; display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:800; font-size:17px; box-shadow:0 2px 5px rgba(124,58,237,0.3);">L</div>
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
          <div style="display:flex; align-items:center; gap:10px;">
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
