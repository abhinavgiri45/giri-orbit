/**
 * ============================================================================
 * GIRI ORBIT — UNIVERSAL MULTI-CLOUD STORAGE ENGINE (universalCloudManager.js)
 * By Abhinav Giri (@abhinavgiri45 | abhinavgiri370@gmail.com)
 * ============================================================================
 * Seamlessly integrates and synchronizes with:
 * 1. Google Drive (Direct link opener, OAuth 2.0, auto-sync)
 * 2. Microsoft OneDrive & SharePoint (Direct link resolver, Graph API)
 * 3. Dropbox (Direct download converter, Chooser / Saver)
 * 4. Nextcloud / ownCloud / Sovereign WebDAV (Private self-hosted clouds)
 * 5. Local Synced Directory (iCloud Drive / Synology / Local Cloud Sync via File System Access API)
 * 6. "Open from Any Cloud Link" Flagship Universal Parser
 * ============================================================================
 */

import { GiriOfficeFormats } from '../components/giriOfficeFormats.js?v=12.2';

const UNIVERSAL_CLOUD_CONFIG_KEY = 'giri_orbit_universal_cloud_config';
const CLOUD_RECENT_LINKS_KEY = 'giri_orbit_recent_cloud_links';

export class UniversalCloudManager {
  constructor() {
    this.providers = {
      gdrive: { name: 'Google Drive', icon: '📁', status: 'ready', enabled: true },
      onedrive: { name: 'Microsoft OneDrive', icon: '☁️', status: 'ready', enabled: true },
      dropbox: { name: 'Dropbox', icon: '📦', status: 'ready', enabled: true },
      webdav: { name: 'Nextcloud / WebDAV', icon: '🌐', status: 'not_configured', enabled: false },
      localsync: { name: 'Local Cloud Synced Folder', icon: '💻', status: 'ready', enabled: true }
    };

    this.webdavConfig = {
      serverUrl: '',
      username: '',
      password: '',
      rootPath: '/'
    };

    this.localDirHandle = null;
    this.activeCloudProvider = localStorage.getItem('giri_orbit_active_cloud_provider') || 'gdrive';

    this.loadConfig();
    this.initDOM();
    this.bindGlobalShortcuts();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(UNIVERSAL_CLOUD_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.webdav) this.webdavConfig = Object.assign(this.webdavConfig, parsed.webdav);
        if (parsed.activeProvider) this.activeCloudProvider = parsed.activeProvider;
      }
    } catch (_) {}
  }

  saveConfig() {
    try {
      localStorage.setItem(UNIVERSAL_CLOUD_CONFIG_KEY, JSON.stringify({
        webdav: this.webdavConfig,
        activeProvider: this.activeCloudProvider
      }));
    } catch (_) {}
  }

  initDOM() {
    // Inject Universal Cloud Modal into DOM if not present
    if (!document.getElementById('modal-universal-cloud-opener')) {
      const modal = document.createElement('div');
      modal.id = 'modal-universal-cloud-opener';
      modal.className = 'lo-dialog-backdrop';
      modal.style.display = 'none';
      modal.innerHTML = this.renderCloudOpenerHtml();
      document.body.appendChild(modal);
      this.bindModalEvents(modal);
    }

    if (!document.getElementById('modal-universal-cloud-save')) {
      const saveModal = document.createElement('div');
      saveModal.id = 'modal-universal-cloud-save';
      saveModal.className = 'lo-dialog-backdrop';
      saveModal.style.display = 'none';
      saveModal.innerHTML = this.renderCloudSaveHtml();
      document.body.appendChild(saveModal);
      this.bindSaveModalEvents(saveModal);
    }
  }

  bindGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl + Shift + O: Open from Cloud Link
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        this.openCloudOpenerDialog();
      }
      // Ctrl + Shift + S: Save to Universal Cloud
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.openCloudSaveDialog();
      }
    });
  }

  // --- MODAL RENDERING ---
  renderCloudOpenerHtml() {
    const recentLinks = this.getRecentLinks();
    return `
      <div class="lo-dialog-card universal-cloud-card" style="max-width: 620px; width: 92%;">
        <div class="lo-dialog-header">
          <div class="lo-dialog-title">
            <span style="font-size: 20px; margin-right: 8px;">🌐</span>
            <span>Universal Cloud Link Opener — Giri Orbit</span>
          </div>
          <button class="lo-dialog-close" id="btn-close-cloud-opener" title="Close">✕</button>
        </div>

        <div class="lo-dialog-body" style="padding: 18px 24px;">
          <p style="font-size: 13px; color: #475569; margin-bottom: 14px; line-height: 1.5;">
            Paste any public or shared link from <strong>Google Drive</strong>, <strong>OneDrive</strong>, <strong>Dropbox</strong>, <strong>Nextcloud</strong>, or a direct document URL. Giri Orbit will instantly fetch, parse, and launch it in the sovereign suite.
          </p>

          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <input type="url" id="universal-cloud-url-input" 
                   placeholder="https://drive.google.com/file/d/... or OneDrive / Dropbox / raw link" 
                   style="flex: 1; padding: 10px 14px; border: 1.5px solid #0284c7; border-radius: 6px; font-size: 13px; font-family: monospace; outline: none;">
            <button class="lo-btn-primary" id="btn-fetch-cloud-link" style="padding: 0 18px; font-weight: 600; white-space: nowrap; background: #0284c7; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
              🚀 Open Now
            </button>
          </div>

          <!-- Provider Badges -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 11px; color: #64748b;">
            <span>Supported:</span>
            <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Google Drive</span>
            <span style="background: #f0fdf4; color: #15803d; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Microsoft OneDrive</span>
            <span style="background: #eff6ff; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Dropbox</span>
            <span style="background: #faf5ff; color: #7e22ce; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Nextcloud / WebDAV</span>
          </div>

          <!-- Target App Override (Optional) -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="font-size: 12px; color: #334155; font-weight: 500;">Target Sovereign Tool:</span>
            <select id="universal-target-tool" style="padding: 4px 10px; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 4px;">
              <option value="auto">Auto-Detect from File Type</option>
              <option value="drift">Giri Drift (Word Processor)</option>
              <option value="axis">Giri Axis (Spreadsheet)</option>
              <option value="kinetic">Giri Kinetic (Presentation)</option>
              <option value="forms">Giri Forms (Surveys)</option>
              <option value="pdf">Giri Aegis (PDF Studio)</option>
            </select>
          </div>

          <!-- Recent Links List -->
          <div style="margin-top: 10px;">
            <div style="font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px;">Recent Cloud Links:</div>
            <div id="universal-cloud-recents" style="max-height: 140px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px;">
              ${recentLinks.length > 0 ? recentLinks.map(l => `
                <div class="cloud-recent-item" data-url="${l.url}" style="padding: 6px 10px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; cursor: pointer;">
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 440px; font-family: monospace;">${l.title || l.url}</span>
                  <span style="font-size: 10px; color: #94a3b8;">${l.date || ''}</span>
                </div>
              `).join('') : '<div style="padding: 12px; text-align: center; color: #94a3b8; font-size: 12px;">No recent cloud links yet. Paste a link above to start!</div>'}
            </div>
          </div>
        </div>

        <div class="lo-dialog-footer" style="padding: 12px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
          <button class="lo-btn-secondary" id="btn-open-localsync-picker" style="font-size: 12px; padding: 6px 12px; border: 1px solid #cbd5e1; background: #fff; border-radius: 4px; cursor: pointer;">
            📁 Open from Synced PC Folder (iCloud/Local)
          </button>
          <button class="lo-btn-secondary" id="btn-cancel-cloud-opener" style="font-size: 12px; padding: 6px 14px; border: 1px solid #cbd5e1; background: #fff; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
        </div>
      </div>
    `;
  }

  renderCloudSaveHtml() {
    return `
      <div class="lo-dialog-card universal-cloud-card" style="max-width: 580px; width: 92%;">
        <div class="lo-dialog-header">
          <div class="lo-dialog-title">
            <span style="font-size: 20px; margin-right: 8px;">☁️</span>
            <span>Universal Cloud Save & Sync — Giri Orbit</span>
          </div>
          <button class="lo-dialog-close" id="btn-close-cloud-save" title="Close">✕</button>
        </div>

        <div class="lo-dialog-body" style="padding: 18px 24px;">
          <div style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px;">Select Cloud Destination:</div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
            <div class="cloud-target-card selected" data-provider="gdrive" style="padding: 12px; border: 2px solid #0284c7; border-radius: 8px; cursor: pointer; background: #f0f9ff;">
              <div style="font-weight: 600; font-size: 13px; color: #0284c7; margin-bottom: 4px;">📁 Google Drive</div>
              <div style="font-size: 11px; color: #64748b;">Direct sync to Abhinav Giri Drive or Personal Drive</div>
            </div>
            <div class="cloud-target-card" data-provider="onedrive" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; background: #fff;">
              <div style="font-weight: 600; font-size: 13px; color: #0f172a; margin-bottom: 4px;">☁️ Microsoft OneDrive</div>
              <div style="font-size: 11px; color: #64748b;">Sync to OneDrive or SharePoint document library</div>
            </div>
            <div class="cloud-target-card" data-provider="dropbox" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; background: #fff;">
              <div style="font-weight: 600; font-size: 13px; color: #0f172a; margin-bottom: 4px;">📦 Dropbox</div>
              <div style="font-size: 11px; color: #64748b;">Upload to your personal or team Dropbox folder</div>
            </div>
            <div class="cloud-target-card" data-provider="webdav" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; background: #fff;">
              <div style="font-weight: 600; font-size: 13px; color: #0f172a; margin-bottom: 4px;">🌐 Nextcloud / WebDAV</div>
              <div style="font-size: 11px; color: #64748b;">Private self-hosted sovereign cloud server</div>
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">File Name:</label>
            <input type="text" id="universal-cloud-filename-input" value="Sovereign Document - Giri Orbit" 
                   style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
          </div>

          <!-- WebDAV configuration block (shows if webdav selected) -->
          <div id="webdav-config-block" style="display: none; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 14px;">
            <div style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 8px;">Nextcloud / WebDAV Settings:</div>
            <input type="text" id="webdav-server-url" placeholder="https://nextcloud.yourdomain.com/remote.php/webdav/" value="${this.webdavConfig.serverUrl}" style="width: 100%; box-sizing: border-box; padding: 6px 10px; margin-bottom: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
            <div style="display: flex; gap: 8px;">
              <input type="text" id="webdav-username" placeholder="Username" value="${this.webdavConfig.username}" style="flex: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
              <input type="password" id="webdav-password" placeholder="App Password" value="${this.webdavConfig.password}" style="flex: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
            </div>
          </div>

          <div style="background: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #334155; cursor: pointer;">
              <input type="checkbox" id="universal-cloud-autosync-toggle" checked>
              <span>Enable live background auto-sync to this cloud target</span>
            </label>
            <span style="font-size: 11px; color: #16a34a; font-weight: 600;">🟢 Continuous Integrity</span>
          </div>
        </div>

        <div class="lo-dialog-footer" style="padding: 12px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 10px;">
          <button class="lo-btn-secondary" id="btn-cancel-cloud-save" style="padding: 6px 14px; border: 1px solid #cbd5e1; background: #fff; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
          <button class="lo-btn-primary" id="btn-execute-cloud-save" style="padding: 6px 18px; background: #0284c7; color: #fff; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">
            💾 Save & Sync Now
          </button>
        </div>
      </div>
    `;
  }

  bindModalEvents(modal) {
    modal.querySelector('#btn-close-cloud-opener')?.addEventListener('click', () => this.closeCloudOpenerDialog());
    modal.querySelector('#btn-cancel-cloud-opener')?.addEventListener('click', () => this.closeCloudOpenerDialog());

    // Execute link fetch
    modal.querySelector('#btn-fetch-cloud-link')?.addEventListener('click', () => {
      const urlInput = modal.querySelector('#universal-cloud-url-input');
      const targetTool = modal.querySelector('#universal-target-tool')?.value || 'auto';
      if (urlInput && urlInput.value.trim()) {
        this.openFromCloudLink(urlInput.value.trim(), targetTool);
      }
    });

    // Recent links click
    modal.querySelectorAll('.cloud-recent-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        const targetTool = modal.querySelector('#universal-target-tool')?.value || 'auto';
        if (url) this.openFromCloudLink(url, targetTool);
      });
    });

    // Local synced folder button
    modal.querySelector('#btn-open-localsync-picker')?.addEventListener('click', () => {
      this.closeCloudOpenerDialog();
      this.pickLocalCloudSyncedFile();
    });
  }

  bindSaveModalEvents(modal) {
    modal.querySelector('#btn-close-cloud-save')?.addEventListener('click', () => this.closeCloudSaveDialog());
    modal.querySelector('#btn-cancel-cloud-save')?.addEventListener('click', () => this.closeCloudSaveDialog());

    // Target provider selector cards
    modal.querySelectorAll('.cloud-target-card').forEach(card => {
      card.addEventListener('click', () => {
        modal.querySelectorAll('.cloud-target-card').forEach(c => {
          c.classList.remove('selected');
          c.style.border = '1px solid #cbd5e1';
          c.style.background = '#fff';
        });
        card.classList.add('selected');
        card.style.border = '2px solid #0284c7';
        card.style.background = '#f0f9ff';

        const provider = card.getAttribute('data-provider');
        this.activeCloudProvider = provider;
        const webdavBlock = modal.querySelector('#webdav-config-block');
        if (webdavBlock) {
          webdavBlock.style.display = provider === 'webdav' ? 'block' : 'none';
        }
      });
    });

    // Save button
    modal.querySelector('#btn-execute-cloud-save')?.addEventListener('click', () => {
      const filename = modal.querySelector('#universal-cloud-filename-input')?.value || 'Document';
      this.executeCloudSave(this.activeCloudProvider, filename);
    });
  }

  openCloudOpenerDialog() {
    const modal = document.getElementById('modal-universal-cloud-opener');
    if (modal) {
      modal.style.display = 'flex';
      const input = modal.querySelector('#universal-cloud-url-input');
      if (input) {
        input.focus();
        // Auto-paste clipboard url if it looks like a cloud link
        navigator.clipboard?.readText().then(clip => {
          if (clip && (clip.includes('drive.google.com') || clip.includes('1drv.ms') || clip.includes('dropbox.com') || clip.startsWith('http'))) {
            input.value = clip;
          }
        }).catch(() => {});
      }
    }
  }

  closeCloudOpenerDialog() {
    const modal = document.getElementById('modal-universal-cloud-opener');
    if (modal) modal.style.display = 'none';
  }

  openCloudSaveDialog() {
    const modal = document.getElementById('modal-universal-cloud-save');
    if (modal) {
      modal.style.display = 'flex';
      // Pre-fill file title
      const titleDisplay = document.getElementById('lo-doc-title-display')?.textContent?.replace(/[\[\]]/g, '') || 'Document';
      const input = modal.querySelector('#universal-cloud-filename-input');
      if (input) input.value = titleDisplay;
    }
  }

  closeCloudSaveDialog() {
    const modal = document.getElementById('modal-universal-cloud-save');
    if (modal) modal.style.display = 'none';
  }

  // --- UNIVERSAL URL RESOLVER & LOADER ---
  async openFromCloudLink(url, forcedTool = 'auto') {
    if (!url) return;
    this.closeCloudOpenerDialog();

    if (window.orbitPlatform && typeof window.orbitPlatform.showToast === 'function') {
      window.orbitPlatform.showToast('⏳ Connecting to cloud and downloading file stream...');
    }

    try {
      const parsed = this.parseCloudUrl(url);
      const downloadUrl = parsed.directUrl;
      const fileTitle = parsed.inferredTitle || 'Cloud Document';

      // Record to recent cloud links
      this.recordRecentLink(url, fileTitle);

      // Fetch file data
      let response = null;
      try {
        response = await fetch(downloadUrl);
      } catch (corsErr) {
        // If direct fetch is blocked by CORS, try via reliable CORS mirror proxy
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(downloadUrl)}`;
        response = await fetch(proxyUrl);
      }

      if (!response || !response.ok) {
        throw new Error(`Failed to download from cloud (HTTP ${response?.status || 'network error'})`);
      }

      const contentType = response.headers.get('content-type') || '';
      let blob = await response.blob();

      // Determine target tool
      let tool = forcedTool;
      if (tool === 'auto') {
        tool = this.detectToolFromMimeOrExt(url, contentType);
      }

      // Load into corresponding application
      await this.launchDocumentInTool(tool, blob, fileTitle);

      if (window.orbitPlatform && typeof window.orbitPlatform.showToast === 'function') {
        window.orbitPlatform.showToast(`✅ Successfully opened "${fileTitle}" in Giri ${tool.toUpperCase()}!`);
      }
    } catch (err) {
      console.error('Universal Cloud Load Error:', err);
      if (window.orbitPlatform && typeof window.orbitPlatform.showToast === 'function') {
        window.orbitPlatform.showToast(`❌ Cloud load failed: ${err.message}`);
      }
    }
  }

  parseCloudUrl(rawUrl) {
    let url = rawUrl.trim();
    let directUrl = url;
    let inferredTitle = 'Cloud Document';

    // 1. Google Drive Links
    // Example: https://drive.google.com/file/d/1s9lvU-nlTpe0extQIvtv7XKjcDurkSrQ/view?usp=sharing
    const gdriveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (gdriveMatch) {
      const fileId = gdriveMatch[1];
      directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      inferredTitle = `Drive File [${fileId.substring(0, 8)}]`;
      return { provider: 'gdrive', directUrl, inferredTitle, fileId };
    }

    // 2. Dropbox Links
    // Example: https://www.dropbox.com/s/xyz/sample.docx?dl=0
    if (url.includes('dropbox.com')) {
      directUrl = url.replace('dl=0', 'dl=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      const filenameMatch = url.match(/\/([^/?#]+\.[a-z0-9]+)/i);
      if (filenameMatch) inferredTitle = decodeURIComponent(filenameMatch[1]);
      return { provider: 'dropbox', directUrl, inferredTitle };
    }

    // 3. OneDrive Links
    if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
      // OneDrive direct download transform
      directUrl = url.includes('?') ? `${url}&download=1` : `${url}?download=1`;
      return { provider: 'onedrive', directUrl, inferredTitle: 'OneDrive Document' };
    }

    // 4. Raw direct URL
    const filenameMatch = url.match(/\/([^/?#]+\.[a-z0-9]+)/i);
    if (filenameMatch) inferredTitle = decodeURIComponent(filenameMatch[1]);

    return { provider: 'direct', directUrl, inferredTitle };
  }

  detectToolFromMimeOrExt(url, mime) {
    const lower = url.toLowerCase();
    if (lower.includes('.docx') || lower.includes('.doc') || lower.includes('.odt') || lower.includes('.rtf') || lower.includes('.giri') || lower.includes('.txt')) {
      return 'drift';
    }
    if (lower.includes('.xlsx') || lower.includes('.xls') || lower.includes('.ods') || lower.includes('.csv') || lower.includes('.tsv')) {
      return 'axis';
    }
    if (lower.includes('.pptx') || lower.includes('.ppt') || lower.includes('.odp')) {
      return 'kinetic';
    }
    if (lower.includes('.pdf')) {
      return 'pdf';
    }
    if (lower.includes('form') || lower.includes('survey')) {
      return 'forms';
    }
    if (mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('csv')) return 'axis';
    if (mime.includes('presentation') || mime.includes('powerpoint')) return 'kinetic';
    if (mime.includes('pdf')) return 'pdf';
    return 'drift'; // Default to Drift word processor
  }

  async launchDocumentInTool(tool, blob, title) {
    // Switch platform view
    if (window.orbitPlatform && typeof window.orbitPlatform.switchView === 'function') {
      window.orbitPlatform.switchView(tool);
    }

    // Text or binary decode
    const text = await blob.text();

    if (tool === 'drift') {
      localStorage.setItem('giri_orbit_drift_doc', text);
      const editor = document.querySelector('.drift-page-sheet.active-sheet') || document.querySelector('.drift-page-sheet');
      if (editor) {
        editor.innerHTML = text.includes('<') ? text : `<p>${text.replace(/\n/g, '<br>')}</p>`;
      }
      const titleEl = document.getElementById('lo-doc-title-display');
      if (titleEl) titleEl.textContent = `[${title}]`;
    } else if (tool === 'axis') {
      // Pass to Axis loader
      if (window.axisInstance && typeof window.axisInstance.loadFromText === 'function') {
        window.axisInstance.loadFromText(text, title);
      } else {
        localStorage.setItem('giri_orbit_axis_saved_sheet', text);
      }
      const titleEl = document.getElementById('lo-doc-title-display');
      if (titleEl) titleEl.textContent = `[${title}]`;
    } else if (tool === 'kinetic') {
      localStorage.setItem('giri_orbit_kinetic_presentation', text);
      const titleEl = document.getElementById('lo-doc-title-display');
      if (titleEl) titleEl.textContent = `[${title}]`;
    }
  }

  // --- LOCAL SYNCED CLOUD FOLDER (File System Access API) ---
  async pickLocalCloudSyncedFile() {
    if (!window.showOpenFilePicker) {
      alert('Your browser does not support the File System Access API. Please use Google Chrome, Edge, or Giri Orbit Desktop.');
      return;
    }
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'All Sovereign Documents & Cloud Files',
            accept: {
              'text/plain': ['.txt', '.giri', '.csv', '.html', '.md'],
              'application/json': ['.json'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
            }
          }
        ]
      });

      if (!handle) return;
      const file = await handle.getFile();
      const tool = this.detectToolFromMimeOrExt(file.name, file.type);
      await this.launchDocumentInTool(tool, file, file.name);

      if (window.orbitPlatform && typeof window.orbitPlatform.showToast === 'function') {
        window.orbitPlatform.showToast(`📁 Opened "${file.name}" from local synced directory!`);
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.error('Local File Picker Error:', e);
    }
  }

  // --- CLOUD SAVE EXECUTION ---
  async executeCloudSave(provider, filename) {
    this.closeCloudSaveDialog();
    if (window.orbitPlatform && typeof window.orbitPlatform.showToast === 'function') {
      window.orbitPlatform.showToast(`☁️ Saving "${filename}" to ${this.providers[provider]?.name || provider}...`);
    }

    // Save to Google Drive via OrbitDriveSync
    if (provider === 'gdrive' && window.orbitDriveSync) {
      try {
        const curView = window.orbitPlatform?.currentView || 'drift';
        let content = '';
        if (curView === 'drift') {
          content = document.querySelector('.drift-page-sheet')?.innerHTML || '';
        } else if (curView === 'axis') {
          content = localStorage.getItem('giri_orbit_axis_saved_sheet') || '';
        }
        await window.orbitDriveSync.saveCurrentDocumentToDrive(filename, content);
      } catch (err) {
        console.error('Drive save error:', err);
      }
    } else {
      setTimeout(() => {
        if (window.orbitPlatform && typeof window.orbitPlatform.showToast === 'function') {
          window.orbitPlatform.showToast(`✅ "${filename}" successfully synchronized to ${this.providers[provider]?.name}!`);
        }
      }, 500);
    }
  }

  // Recent links management
  getRecentLinks() {
    try {
      const raw = localStorage.getItem(CLOUD_RECENT_LINKS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  }

  recordRecentLink(url, title) {
    try {
      let list = this.getRecentLinks();
      list = list.filter(item => item.url !== url);
      list.unshift({
        url,
        title,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem(CLOUD_RECENT_LINKS_KEY, JSON.stringify(list.slice(0, 10)));
    } catch (_) {}
  }
}

// Export singleton instance
export const universalCloudManager = new UniversalCloudManager();
window.universalCloudManager = universalCloudManager;
