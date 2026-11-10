/**
 * ============================================================================
 * GIRI ORBIT — SESSION RESUME & STATE HANDOFF MANAGER (sessionResumeManager.js)
 * By Abhinav Giri (@abhinavgiri45)
 * ============================================================================
 * Enables "Pick up from where you left off" across both local devices (Windows,
 * Android, Web) and Cloud storage (Google Drive, OneDrive, Dropbox, WebDAV).
 *
 * Core Capabilities:
 * 1. Persistent Sovereign Device Fingerprint (private machine ID & friendly name).
 * 2. Continuous State Capture (active tool, document ID, cursor/selection,
 *    active cell, slide index, scroll position, and scratch drafts).
 * 3. Fluent "Pick Up Where You Left Off" Banner with 1-click restore.
 * 4. Cloud Handoff Metadata: Seamlessly resume on PC where you left off on phone/cloud.
 * 5. Multi-Device Presence Awareness with zero telemetry.
 */

export class SessionResumeManager {
  constructor() {
    this.storageKey = 'giri_orbit_session_state_v1';
    this.deviceKey = 'giri_orbit_device_identity_v1';
    this.cloudHandoffKey = '_giriCloudHandoff';
    this.autoResumeEnabled = true;
    this.deviceIdentity = this._initDeviceIdentity();
    this.activeSession = this.loadLocalSession();
    this.bannerEl = null;

    this._bindLifecycleEvents();
  }

  // --- 1. SOVEREIGN DEVICE IDENTITY ---
  _initDeviceIdentity() {
    try {
      const saved = localStorage.getItem(this.deviceKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_) {}

    // Generate unique local device ID
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(4)))
      .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    const userAgent = navigator.userAgent || '';
    let osName = 'Windows PC';
    if (/android/i.test(userAgent)) osName = 'Android Mobile';
    else if (/iphone|ipad|ipod/i.test(userAgent)) osName = 'iOS Device';
    else if (/mac/i.test(userAgent)) osName = 'MacBook / macOS';
    else if (/linux/i.test(userAgent)) osName = 'Linux Workstation';

    let formFactor = 'Desktop Workstation';
    if (/mobile|android|iphone/i.test(userAgent)) formFactor = 'Mobile Device';
    else if (/tablet|ipad/i.test(userAgent)) formFactor = 'Tablet';

    const identity = {
      id: `DEV-${osName.split(' ')[0].toUpperCase()}-${randomHex}`,
      name: `${osName} (${formFactor})`,
      os: osName,
      formFactor: formFactor,
      registeredAt: new Date().toISOString(),
      author: (typeof localStorage !== 'undefined' && localStorage.getItem('giri_user_name')) || (window.driveSyncManager?.googleUser?.name) || `${osName} User`
    };

    try {
      localStorage.setItem(this.deviceKey, JSON.stringify(identity));
    } catch (_) {}

    return identity;
  }

  getDeviceIdentity() {
    return this.deviceIdentity;
  }

  setDeviceName(customName) {
    if (!customName || !customName.trim()) return;
    this.deviceIdentity.name = customName.trim();
    try {
      localStorage.setItem(this.deviceKey, JSON.stringify(this.deviceIdentity));
    } catch (_) {}
  }

  // --- 2. CONTINUOUS STATE CAPTURE ---
  _bindLifecycleEvents() {
    // Capture state on beforeunload / visibility change
    window.addEventListener('beforeunload', () => this.captureCurrentState());
    window.addEventListener('pagehide', () => this.captureCurrentState());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.captureCurrentState();
      }
    });

    // Debounced automatic capture every 10 seconds while active
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.captureCurrentState(true); // silent background update
      }
    }, 10000);
  }

  /**
   * Capture exact current editor coordinates
   */
  captureCurrentState(silent = false) {
    if (!window.orbitPlatform) return null;

    const currentTool = window.orbitPlatform.currentView || 'hub';
    if (currentTool === 'hub' || currentTool === 'launcher') {
      return null;
    }

    let docTitle = 'Untitled Document';
    let docId = 'doc_' + currentTool;
    let cursor = null;
    let scrollY = window.scrollY || 0;
    let extraMeta = {};

    // Tool-specific coordinates
    if (currentTool === 'drift') {
      const editor = document.getElementById('drift-editor') || document.querySelector('.drift-document-canvas') || document.querySelector('.lo-editor-content');
      const titleEl = document.getElementById('drift-doc-title') || document.getElementById('lo-doc-title-display');
      if (titleEl) docTitle = titleEl.value || titleEl.textContent || docTitle;
      
      if (editor) {
        scrollY = editor.scrollTop || 0;
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          cursor = {
            offset: sel.focusOffset,
            nodeTextSnippet: sel.focusNode ? (sel.focusNode.textContent || '').substring(0, 40) : ''
          };
        }
      }
    } else if (currentTool === 'axis') {
      const activeCellEl = document.getElementById('lo-calc-name-box') || document.getElementById('axis-active-cell');
      cursor = {
        cell: activeCellEl ? activeCellEl.value : 'A1'
      };
      const titleEl = document.getElementById('axis-doc-title') || document.getElementById('lo-doc-title-display');
      if (titleEl) docTitle = titleEl.value || titleEl.textContent || 'Giri Axis Spreadsheet';
    } else if (currentTool === 'kinetic') {
      const activeSlideEl = document.querySelector('.lo-slide-thumb-card.active') || document.querySelector('.kinetic-slide-card.active');
      const slideIdx = activeSlideEl ? parseInt(activeSlideEl.dataset.slideIdx || '0', 10) : 0;
      cursor = {
        slideIndex: slideIdx,
        slideNumber: slideIdx + 1
      };
      const titleEl = document.getElementById('kinetic-doc-title') || document.getElementById('lo-doc-title-display');
      if (titleEl) docTitle = titleEl.value || titleEl.textContent || 'Giri Kinetic Presentation';
    } else if (currentTool === 'forms') {
      const titleEl = document.getElementById('forms-doc-title');
      if (titleEl) docTitle = titleEl.value || 'Giri Form Survey';
      cursor = { mode: 'form-builder' };
    } else if (currentTool === 'designer') {
      const titleEl = document.getElementById('designer-doc-title');
      if (titleEl) docTitle = titleEl.value || 'Giri Graphic Canvas';
      cursor = { mode: 'vector-canvas' };
    } else if (currentTool === 'lists') {
      const titleEl = document.getElementById('lists-doc-title');
      if (titleEl) docTitle = titleEl.value || 'Giri Tasks & Kanban';
      cursor = { mode: 'kanban' };
    } else if (currentTool === 'quiz') {
      const titleEl = document.getElementById('quiz-doc-title');
      if (titleEl) docTitle = titleEl.value || 'Giri Certification Exam';
      cursor = { mode: 'assessment' };
    }

    const session = {
      tool: currentTool,
      docId: docId,
      docTitle: docTitle.replace(/^[\[\s]+|[\]\s]+$/g, ''),
      cursor: cursor,
      scrollY: scrollY,
      device: this.deviceIdentity,
      timestamp: Date.now(),
      isoTime: new Date().toISOString(),
      version: '14.8.0'
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
      this.activeSession = session;
    } catch (_) {}

    return session;
  }

  loadLocalSession() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return null;
  }

  // --- 3. CLOUD SESSION HANDOFF METADATA ---
  /**
   * Attaches sovereign resume metadata to a document before saving to cloud.
   */
  injectCloudHandoffMetadata(documentPayload) {
    const currentState = this.captureCurrentState(true) || {
      tool: window.orbitPlatform?.currentView || 'drift',
      docTitle: 'Sovereign Cloud Document',
      device: this.deviceIdentity,
      timestamp: Date.now()
    };

    if (typeof documentPayload === 'object' && documentPayload !== null) {
      documentPayload._giriCloudHandoff = {
        lastDevice: this.deviceIdentity,
        lastTool: currentState.tool,
        docTitle: currentState.docTitle,
        cursor: currentState.cursor,
        scrollY: currentState.scrollY,
        lastSavedAt: new Date().toISOString(),
        summary: `Saved on ${this.deviceIdentity.name} at ${new Date().toLocaleTimeString()}`
      };
      return documentPayload;
    }
    return documentPayload;
  }

  /**
   * Evaluates cloud metadata when opening a file from cloud storage.
   */
  evaluateCloudHandoff(cloudDoc) {
    if (!cloudDoc || typeof cloudDoc !== 'object' || !cloudDoc._giriCloudHandoff) {
      return null;
    }

    const handoff = cloudDoc._giriCloudHandoff;
    const isOtherDevice = handoff.lastDevice && handoff.lastDevice.id !== this.deviceIdentity.id;

    return {
      isOtherDevice: isOtherDevice,
      sourceDevice: handoff.lastDevice?.name || 'Another Sovereign Device',
      tool: handoff.lastTool || 'drift',
      docTitle: handoff.docTitle || 'Cloud Document',
      cursor: handoff.cursor,
      scrollY: handoff.scrollY || 0,
      lastSavedAt: handoff.lastSavedAt,
      summary: handoff.summary
    };
  }

  // --- 4. PICK UP WHERE YOU LEFT OFF BANNER & RESTORAL ---
  /**
   * Inspects previous session upon application start and presents
   * the resumption prompt if an active document was left in progress.
   */
  checkAndPromptResume(options = {}) {
    const session = this.loadLocalSession();
    if (!session || !session.tool || session.tool === 'hub' || session.tool === 'launcher') {
      return;
    }

    // If less than 7 days old, prompt resume
    const ageMs = Date.now() - (session.timestamp || 0);
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (ageMs > maxAgeMs) return;

    const timeAgoStr = this._formatTimeAgo(session.timestamp);
    const cursorDesc = this._formatCursorDesc(session);

    this.showResumeBanner({
      tool: session.tool,
      docTitle: session.docTitle || 'Document',
      timeAgo: timeAgoStr,
      cursorDesc: cursorDesc,
      device: session.device?.name || 'This Computer',
      onConfirm: () => {
        this.resumeSession(session);
      },
      onDismiss: () => {
        this.dismissBanner();
      }
    });
  }

  _formatTimeAgo(timestamp) {
    if (!timestamp) return 'recently';
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  }

  _formatCursorDesc(session) {
    if (!session.cursor) return '';
    if (session.cursor.cell) return `at cell ${session.cursor.cell}`;
    if (session.cursor.slideNumber) return `at Slide ${session.cursor.slideNumber}`;
    if (session.cursor.nodeTextSnippet) return `near "${session.cursor.nodeTextSnippet}"`;
    return '';
  }

  /**
   * Mount interactive Fluent Pick-Up banner at the top of workspace
   */
  showResumeBanner({ tool, docTitle, timeAgo, cursorDesc, device, isCloud = false, onConfirm, onDismiss }) {
    this.dismissBanner();

    const banner = document.createElement('div');
    banner.id = 'giri-resume-banner';
    banner.className = 'giri-resume-banner';
    banner.innerHTML = `
      <div class="giri-resume-inner">
        <div class="giri-resume-icon-badge ${isCloud ? 'cloud' : 'local'}">
          ${isCloud ? '☁️' : '📌'}
        </div>
        <div class="giri-resume-text-group">
          <div class="giri-resume-title">
            <strong>Pick up where you left off</strong>
            <span class="giri-resume-chip">${tool.toUpperCase()}</span>
            <span class="giri-resume-time">${timeAgo}</span>
          </div>
          <div class="giri-resume-desc">
            "${docTitle}" ${cursorDesc ? `— ${cursorDesc}` : ''}
            <span class="giri-resume-device">(${device})</span>
          </div>
        </div>
        <div class="giri-resume-actions">
          <button class="giri-resume-btn-confirm" id="btn-resume-session-action">
            ▶ Resume Now
          </button>
          <button class="giri-resume-btn-dismiss" id="btn-resume-session-dismiss" title="Dismiss">
            ✕
          </button>
        </div>
      </div>
    `;

    document.body.prepend(banner);
    this.bannerEl = banner;

    banner.querySelector('#btn-resume-session-action')?.addEventListener('click', () => {
      this.dismissBanner();
      if (onConfirm) onConfirm();
    });

    banner.querySelector('#btn-resume-session-dismiss')?.addEventListener('click', () => {
      this.dismissBanner();
      if (onDismiss) onDismiss();
    });

    // Auto-fade dismiss after 30 seconds if unclicked
    setTimeout(() => {
      if (this.bannerEl === banner) {
        this.dismissBanner();
      }
    }, 30000);
  }

  dismissBanner() {
    if (this.bannerEl) {
      this.bannerEl.classList.add('fading');
      setTimeout(() => {
        this.bannerEl?.remove();
        this.bannerEl = null;
      }, 300);
    }
  }

  /**
   * Perform actual restoral into application view
   */
  resumeSession(session) {
    if (!session || !session.tool) return;

    if (window.orbitPlatform) {
      window.orbitPlatform.switchView(session.tool);
      
      // Allow DOM to settle, then restore scroll and focus
      setTimeout(() => {
        if (session.tool === 'drift') {
          const editor = document.getElementById('drift-editor') || document.querySelector('.drift-document-canvas') || document.querySelector('.lo-editor-content');
          if (editor && session.scrollY) {
            editor.scrollTop = session.scrollY;
          }
        } else if (session.tool === 'axis') {
          if (session.cursor?.cell) {
            const nameBox = document.getElementById('lo-calc-name-box') || document.getElementById('axis-active-cell');
            if (nameBox) {
              nameBox.value = session.cursor.cell;
              nameBox.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        } else if (session.tool === 'kinetic') {
          if (session.cursor?.slideIndex !== undefined) {
            const slideThumb = document.querySelector(`.lo-slide-thumb-card[data-slide-idx="${session.cursor.slideIndex}"]`);
            if (slideThumb) slideThumb.click();
          }
        }

        window.orbitPlatform.showToast(`📌 Resumed ${session.docTitle} (${session.cursor?.cell || session.cursor?.slideNumber ? this._formatCursorDesc(session) : 'from previous session'})`);
      }, 250);
    }
  }
}

export const sessionResumeManager = new SessionResumeManager();
if (typeof window !== 'undefined') {
  window.sessionResumeManager = sessionResumeManager;
}
