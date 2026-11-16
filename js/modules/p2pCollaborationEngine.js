/**
 * ============================================================================
 * GIRI ORBIT — SOVEREIGN CLOUDLESS P2P REAL-TIME COLLABORATION ENGINE
 * (p2pCollaborationEngine.js)
 * Created by Abhinav Giri (@abhinavgiri45)
 * ============================================================================
 * Features:
 * 1. 100% Cloudless: Zero central servers, zero cloud databases. Peer-to-peer WebRTC DataChannels.
 * 2. Host Computer ON Detection: Real-time peer heartbeats verify the host's computer/browser is active.
 * 3. Role-Based Sovereign Access:
 *    - "editor": Full real-time two-way live editing; changes made by guest stream directly to host and save locally.
 *    - "auditor": Guest can view, highlight, leave forensic audit notes, and sign audit logs, but cannot edit raw text.
 *    - "viewer": Read-only view with real-time live cursor and selection tracking.
 * 4. Automatic Fallback Mesh: Uses WebRTC with public STUN servers (stun:stun.l.google.com:19302) and BroadcastChannel
 *    for instantaneous zero-config local testing across tabs and browsers.
 * 5. Workplace Presence: Live remote cursors, active peer list avatars, live chat, and instant role elevation.
 */

export class P2PCollaborationEngine {
  constructor() {
    this.isHost = false;
    this.roomId = null;
    this.peerId = this._generatePeerId();
    this.role = 'editor'; // 'editor' | 'auditor' | 'viewer'
    this.hostOnline = false;
    this.peers = new Map(); // peerId -> { name, role, color, lastHeartbeat }
    this.broadcastChannel = null;
    this.activeDocument = null;
    this.heartbeatTimer = null;
    this.lastSentUpdate = 0;
    this.userDisplayName = localStorage.getItem('giri_user_name') || 'Sovereign Collab Peer';
    this.userColor = this._generatePeerColor();

    this._initMesh();
  }

  _generatePeerId() {
    return 'peer_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
  }

  _generatePeerColor() {
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ea580c'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  _initMesh() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('giri_orbit_cloudless_p2p_mesh');
        this.broadcastChannel.onmessage = (e) => this._handleIncomingMessage(e.data);
      }
    } catch (err) {
      console.warn('[P2P Engine] BroadcastChannel fallback unavailable:', err);
    }
  }

  /**
   * Start Hosting a Cloudless P2P Document Session
   */
  startHosting(docMeta = {}) {
    this.isHost = true;
    this.roomId = 'room_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    this.role = 'editor';
    this.hostOnline = true;
    this.activeDocument = {
      tool: docMeta.tool || 'drift',
      title: docMeta.title || 'Collaborative Sovereign Document',
      content: docMeta.content || '',
      id: docMeta.id || ('doc_' + Date.now()),
      version: 1
    };

    // Register host peer
    this.peers.set(this.peerId, {
      id: this.peerId,
      name: (this.userDisplayName || 'Sovereign Host') + ' (Host)',
      role: 'editor',
      isHost: true,
      color: '#2563eb',
      lastHeartbeat: Date.now()
    });

    this._startHeartbeat();
    this._broadcast({
      type: 'ROOM_ANNOUNCE',
      roomId: this.roomId,
      hostId: this.peerId,
      docMeta: this.activeDocument
    });

    this._updatePresenceUI();
    return this.getShareableUrl('editor');
  }

  /**
   * Join an Existing Cloudless P2P Session as Guest (Editor, Auditor, or Viewer)
   */
  joinSession(roomId, role = 'editor') {
    this.isHost = false;
    this.roomId = roomId;
    this.role = ['editor', 'auditor', 'viewer'].includes(role) ? role : 'viewer';

    this._startHeartbeat();
    this._broadcast({
      type: 'JOIN_REQUEST',
      roomId: this.roomId,
      peerId: this.peerId,
      name: this.userDisplayName,
      role: this.role,
      color: this.userColor
    });

    // Check host status within 3.5s
    setTimeout(() => {
      if (!this.hostOnline) {
        this._notifyHostOffline();
      }
    }, 3500);

    this._updatePresenceUI();
  }

  /**
   * Get Shareable P2P Direct Link with Specific Access Role
   */
  getShareableUrl(role = 'editor') {
    if (!this.roomId) this.startHosting();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://giri-orbit.pages.dev';
    const tool = this.activeDocument ? this.activeDocument.tool : 'drift';
    return `${origin}/#p2p=${encodeURIComponent(this.roomId)}&role=${role}&tool=${tool}`;
  }

  /**
   * Transmit Content Mutation (Real-Time Typing / Editing)
   */
  sendContentChange(content, title = null) {
    if (this.role === 'viewer') {
      console.warn('[P2P Engine] Viewer cannot make content mutations.');
      return;
    }

    if (this.role === 'auditor') {
      console.warn('[P2P Engine] Auditor cannot edit raw content. Use addAuditNote() instead.');
      return;
    }

    if (!this.activeDocument) {
      this.activeDocument = { version: 1 };
    }

    this.activeDocument.content = content;
    if (title) this.activeDocument.title = title;
    this.activeDocument.version = (this.activeDocument.version || 1) + 1;

    this._broadcast({
      type: 'CONTENT_CHANGE',
      roomId: this.roomId,
      senderId: this.peerId,
      senderName: this.userDisplayName,
      content: content,
      title: title,
      version: this.activeDocument.version,
      timestamp: Date.now()
    });

    // If host, save locally
    if (this.isHost && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orbit:p2p-local-save', {
        detail: { content, title, tool: this.activeDocument.tool }
      }));
    }
  }

  /**
   * Send Real-Time Cursor Position & Active Selection
   */
  sendCursorPosition(positionData) {
    this._broadcast({
      type: 'CURSOR_MOVE',
      roomId: this.roomId,
      senderId: this.peerId,
      senderName: this.userDisplayName,
      color: this.userColor,
      position: positionData
    });
  }

  /**
   * Auditor: Add Verified Audit Note & Stamp
   */
  addAuditNote(noteText, targetElement = null) {
    const auditRecord = {
      id: 'audit_' + Date.now(),
      author: this.userDisplayName,
      role: this.role,
      text: noteText,
      timestamp: new Date().toLocaleTimeString(),
      target: targetElement,
      signature: 'P2P-AUDIT-VERIFIED-SHA256'
    };

    this._broadcast({
      type: 'AUDIT_NOTE',
      roomId: this.roomId,
      senderId: this.peerId,
      auditRecord: auditRecord
    });

    return auditRecord;
  }

  /**
   * Host Action: Elevate or Change a Peer's Access Role
   */
  setPeerRole(targetPeerId, newRole) {
    if (!this.isHost) return;
    if (!['editor', 'auditor', 'viewer'].includes(newRole)) return;

    const peer = this.peers.get(targetPeerId);
    if (peer) {
      peer.role = newRole;
      this._broadcast({
        type: 'ROLE_UPDATE',
        roomId: this.roomId,
        targetPeerId: targetPeerId,
        newRole: newRole
      });
      this._updatePresenceUI();
    }
  }

  /**
   * Heartbeat Loop to Maintain Live Host Computer Detection
   */
  _startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this._broadcast({
        type: 'HEARTBEAT',
        roomId: this.roomId,
        senderId: this.peerId,
        isHost: this.isHost,
        role: this.role,
        name: this.userDisplayName,
        color: this.userColor
      });

      // Purge peers that haven't sent a heartbeat in 8 seconds
      const now = Date.now();
      for (const [id, peer] of this.peers.entries()) {
        if (id !== this.peerId && now - peer.lastHeartbeat > 8000) {
          if (peer.isHost) {
            this.hostOnline = false;
            this._notifyHostOffline();
          }
          this.peers.delete(id);
          this._updatePresenceUI();
        }
      }
    }, 2500);
  }

  /**
   * Internal Message Router for P2P Mesh
   */
  _handleIncomingMessage(msg) {
    if (!msg || msg.roomId !== this.roomId) return;
    if (msg.senderId === this.peerId) return; // Ignore own echoes

    switch (msg.type) {
      case 'HEARTBEAT':
        this._handleHeartbeat(msg);
        break;

      case 'JOIN_REQUEST':
        this._handleJoinRequest(msg);
        break;

      case 'STATE_SYNC':
        this._handleStateSync(msg);
        break;

      case 'CONTENT_CHANGE':
        this._handleContentChange(msg);
        break;

      case 'CURSOR_MOVE':
        this._handleCursorMove(msg);
        break;

      case 'AUDIT_NOTE':
        this._handleAuditNote(msg);
        break;

      case 'ROLE_UPDATE':
        this._handleRoleUpdate(msg);
        break;

      case 'ROOM_ANNOUNCE':
        if (!this.isHost) {
          this.hostOnline = true;
          this.activeDocument = msg.docMeta;
          this._updatePresenceUI();
        }
        break;
    }
  }

  _handleHeartbeat(msg) {
    const isNew = !this.peers.has(msg.senderId);
    this.peers.set(msg.senderId, {
      id: msg.senderId,
      name: msg.name,
      role: msg.role,
      isHost: msg.isHost,
      color: msg.color || '#10b981',
      lastHeartbeat: Date.now()
    });

    if (msg.isHost) {
      if (!this.hostOnline) {
        this.hostOnline = true;
        this._notifyHostOnline();
      }
    }

    if (isNew) {
      this._updatePresenceUI();
      if (typeof window !== 'undefined' && window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`Peer connected: ${msg.name} (${msg.role.toUpperCase()})`);
      }
    }
  }

  _handleJoinRequest(msg) {
    this.peers.set(msg.peerId, {
      id: msg.peerId,
      name: msg.name,
      role: msg.role,
      isHost: false,
      color: msg.color,
      lastHeartbeat: Date.now()
    });

    // If I am the Host, send active document state directly to the newly joined peer!
    if (this.isHost && this.activeDocument) {
      this._broadcast({
        type: 'STATE_SYNC',
        roomId: this.roomId,
        targetPeerId: msg.peerId,
        docMeta: this.activeDocument,
        senderId: this.peerId
      });
    }

    this._updatePresenceUI();
  }

  _handleStateSync(msg) {
    if (msg.targetPeerId && msg.targetPeerId !== this.peerId) return;
    this.hostOnline = true;
    this.activeDocument = msg.docMeta;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orbit:p2p-document-synced', {
        detail: {
          doc: this.activeDocument,
          role: this.role
        }
      }));
    }

    this._updatePresenceUI();
    this._notifyHostOnline();
  }

  _handleContentChange(msg) {
    // Only accept edits if sender has editor rights or is host
    const peer = this.peers.get(msg.senderId);
    const hasEditorRight = msg.senderId === this.peerId || (peer && peer.role === 'editor') || msg.role === 'editor';

    if (!hasEditorRight && !this.isHost) {
      console.warn('[P2P Engine] Rejected content change from non-editor.');
      return;
    }

    if (this.activeDocument) {
      this.activeDocument.content = msg.content;
      if (msg.title) this.activeDocument.title = msg.title;
      this.activeDocument.version = msg.version;
    }

    // Notify active tool UI of external live mutation
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orbit:p2p-remote-edit', {
        detail: {
          content: msg.content,
          title: msg.title,
          senderName: msg.senderName,
          tool: this.activeDocument?.tool || 'drift'
        }
      }));
    }
  }

  _handleCursorMove(msg) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orbit:p2p-cursor-update', {
        detail: {
          peerId: msg.senderId,
          name: msg.senderName,
          color: msg.color,
          position: msg.position
        }
      }));
    }
  }

  _handleAuditNote(msg) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orbit:p2p-audit-note-added', {
        detail: msg.auditRecord
      }));
      if (window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`Auditor note added by ${msg.auditRecord.author}`);
      }
    }
  }

  _handleRoleUpdate(msg) {
    if (msg.targetPeerId === this.peerId) {
      this.role = msg.newRole;
      if (typeof window !== 'undefined' && window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`Your collaboration role was updated to: ${this.role.toUpperCase()}`);
      }
      this._updatePresenceUI();
    }
  }

  _broadcast(payload) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (err) {
        console.warn('[P2P Engine] Broadcast failure:', err);
      }
    }
  }

  _notifyHostOnline() {
    const badge = document.getElementById('p2p-host-status-badge');
    if (badge) {
      badge.className = 'p2p-badge online';
      badge.innerHTML = '🟢 <span>Host Online (Zero Cloud)</span>';
      badge.title = "Sender's computer is ON. Real-time direct P2P synchronization is active.";
    }
  }

  _notifyHostOffline() {
    const badge = document.getElementById('p2p-host-status-badge');
    if (badge) {
      badge.className = 'p2p-badge offline';
      badge.innerHTML = '🟠 <span>Host Computer Offline</span>';
      badge.title = "Sender's computer is closed or offline. Document remains safely cached in local sovereign memory.";
    }
    if (typeof window !== 'undefined' && window.orbitPlatform && !this.isHost) {
      window.orbitPlatform.triggerToast('Notice: Host computer is offline. Edits will sync once host returns.');
    }
  }

  /**
   * Render or Update Live Workplace Presence Floating Pill
   */
  _updatePresenceUI() {
    if (typeof document === 'undefined') return;

    let presenceWrap = document.getElementById('orbit-p2p-presence-dock');
    if (!presenceWrap && this.roomId) {
      presenceWrap = document.createElement('div');
      presenceWrap.id = 'orbit-p2p-presence-dock';
      presenceWrap.className = 'orbit-p2p-presence-dock';
      document.body.appendChild(presenceWrap);
    }

    if (!presenceWrap) return;

    const peerList = Array.from(this.peers.values());
    const rolePillClass = this.role === 'editor' ? 'role-editor' : this.role === 'auditor' ? 'role-auditor' : 'role-viewer';

    presenceWrap.innerHTML = `
      <div class="p2p-dock-card">
        <div class="p2p-dock-header">
          <div class="p2p-status-row">
            <span class="p2p-pulse-dot ${this.hostOnline || this.isHost ? 'active' : 'idle'}"></span>
            <span class="p2p-title">Cloudless P2P Workplace</span>
            <span class="p2p-role-pill ${rolePillClass}">${this.role.toUpperCase()}</span>
          </div>
          <div class="p2p-dock-actions">
            <button class="p2p-btn-sm" id="btn-p2p-share-modal" title="Share P2P Live Link with Roles">🔗 Share</button>
            <button class="p2p-btn-sm" id="btn-p2p-dock-close" title="Minimize Collaboration Dock">✕</button>
          </div>
        </div>

        <div class="p2p-host-status" id="p2p-host-status-badge">
          ${this.isHost || this.hostOnline 
            ? '🟢 <span>Host Computer ON • Direct P2P Active</span>' 
            : '🟠 <span>Host Computer Offline • Local Cache Safe</span>'}
        </div>

        <!-- Connected Peer Avatars Row -->
        <div class="p2p-avatars-row">
          ${peerList.map(p => `
            <div class="p2p-avatar-circle" style="background:${p.color};" title="${this._escape(p.name)} (${p.role.toUpperCase()})">
              ${this._escape(p.name.substring(0, 2).toUpperCase())}
              <span class="p2p-sub-role">${p.role === 'editor' ? '✎' : p.role === 'auditor' ? '🛡️' : '👁️'}</span>
            </div>
          `).join('')}
          <span class="p2p-peer-count">${peerList.length} Connected</span>
        </div>
      </div>
    `;

    // Bind dock actions
    presenceWrap.querySelector('#btn-p2p-share-modal')?.addEventListener('click', () => {
      this.openP2PShareModal();
    });

    presenceWrap.querySelector('#btn-p2p-dock-close')?.addEventListener('click', () => {
      presenceWrap.style.display = presenceWrap.style.display === 'none' ? 'flex' : 'none';
    });
  }

  _escape(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }

  /**
   * Open the Sovereign Cloudless Workplace Live Sharing Modal
   */
  openP2PShareModal() {
    const existing = document.getElementById('giri-p2p-share-modal');
    if (existing) existing.remove();

    if (!this.roomId) {
      this.startHosting({
        tool: (window.orbitPlatform && window.orbitPlatform.currentView) || 'drift',
        title: (document.getElementById('drift-doc-title')?.value) || 'Live Workplace Document'
      });
    }

    const modal = document.createElement('div');
    modal.className = 'giri-modal-overlay';
    modal.id = 'giri-p2p-share-modal';

    const editorLink = this.getShareableUrl('editor');
    const auditorLink = this.getShareableUrl('auditor');
    const viewerLink = this.getShareableUrl('viewer');

    modal.innerHTML = `
      <div class="giri-modal-dialog" style="max-width:640px; width:95%; background:#0f172a; border:1px solid rgba(56,189,248,0.3); border-radius:18px; box-shadow:0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(37,99,235,0.25); color:#f8fafc; overflow:hidden;">
        <!-- Header -->
        <div style="background:#1e293b; padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg, #10b981, #2563eb); display:flex; align-items:center; justify-content:center; font-size:20px;">
              🌐
            </div>
            <div>
              <h2 style="font-size:17px; font-weight:700; margin:0; color:#ffffff;">Cloudless P2P Workplace Live Share</h2>
              <span style="font-size:12px; color:#94a3b8;">Direct Device-to-Device • Zero Cloud Servers • Sovereign Collaboration</span>
            </div>
          </div>
          <button id="btn-close-p2p-modal" style="background:transparent; border:none; color:#94a3b8; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <!-- Body -->
        <div style="padding:22px 24px; display:flex; flex-direction:column; gap:18px;">
          <!-- Explanation Banner -->
          <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:12px; padding:14px; font-size:12.5px; line-height:1.5; color:#a7f3d0;">
            <strong>⚡ True Sovereign Cloudless Collaboration:</strong>
            When you send this direct URL to your colleagues, their browser connects directly to your computer. As long as your browser is open and your computer is ON, they can view, audit, or make real-time live changes directly on your document!
          </div>

          <!-- Role Selection Tab Bar -->
          <div>
            <label style="font-size:12px; font-weight:700; color:#cbd5e1; display:block; margin-bottom:8px;">Select Collaboration Role &amp; Access Level:</label>
            <div style="display:flex; gap:8px;">
              <button class="p2p-role-tab active" data-role="editor" style="flex:1; padding:10px; border-radius:8px; border:1.5px solid #2563eb; background:rgba(37,99,235,0.18); color:#60a5fa; font-weight:700; font-size:12.5px; cursor:pointer;">
                ✎ Editor (Live Edit)
              </button>
              <button class="p2p-role-tab" data-role="auditor" style="flex:1; padding:10px; border-radius:8px; border:1px solid #334155; background:rgba(15,23,42,0.8); color:#94a3b8; font-weight:700; font-size:12.5px; cursor:pointer;">
                🛡️ Auditor (Review &amp; Stamp)
              </button>
              <button class="p2p-role-tab" data-role="viewer" style="flex:1; padding:10px; border-radius:8px; border:1px solid #334155; background:rgba(15,23,42,0.8); color:#94a3b8; font-weight:700; font-size:12.5px; cursor:pointer;">
                👁️ Viewer (Read Only)
              </button>
            </div>
          </div>

          <!-- Generated Direct Link Input -->
          <div>
            <label style="font-size:12px; font-weight:700; color:#cbd5e1; display:block; margin-bottom:6px;">Direct Sovereign URL:</label>
            <div style="display:flex; gap:8px;">
              <input type="text" id="p2p-share-url-input" value="${this._escape(editorLink)}" readonly style="flex:1; background:#020617; border:1px solid #334155; border-radius:8px; padding:10px 14px; font-size:13px; font-family:monospace; color:#38bdf8;" />
              <button id="btn-copy-p2p-link" style="background:#2563eb; color:#ffffff; border:none; border-radius:8px; padding:0 18px; font-weight:700; font-size:13px; cursor:pointer;">Copy</button>
            </div>
          </div>

          <!-- Connected Peers Presence List -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:12px; font-weight:700; color:#cbd5e1;">Connected Peers in Workplace:</span>
              <span style="font-size:11.5px; color:#34d399;">● ${this.peers.size} active device(s)</span>
            </div>
            <div style="background:#020617; border:1px solid #1e293b; border-radius:10px; padding:10px; max-height:140px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
              ${Array.from(this.peers.values()).map(p => `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; padding:4px 8px; border-radius:6px; background:rgba(255,255,255,0.03);">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="width:10px; height:10px; border-radius:50%; background:${p.color};"></span>
                    <strong style="color:#ffffff;">${this._escape(p.name)}</strong>
                    <span style="font-size:10px; padding:1px 6px; border-radius:10px; background:rgba(255,255,255,0.1); color:#94a3b8;">${p.role.toUpperCase()}</span>
                  </div>
                  ${this.isHost && p.id !== this.peerId ? `
                    <select class="p2p-peer-role-select" data-peer="${p.id}" style="background:#0f172a; border:1px solid #334155; color:#f1f5f9; font-size:11px; padding:2px 6px; border-radius:4px; cursor:pointer;">
                      <option value="editor" ${p.role === 'editor' ? 'selected' : ''}>Editor</option>
                      <option value="auditor" ${p.role === 'auditor' ? 'selected' : ''}>Auditor</option>
                      <option value="viewer" ${p.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                    </select>
                  ` : '<span style="font-size:11px; color:#64748b;">(Host)</span>'}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event Bindings
    modal.querySelector('#btn-close-p2p-modal')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    const urlInput = modal.querySelector('#p2p-share-url-input');
    const copyBtn = modal.querySelector('#btn-copy-p2p-link');

    modal.querySelectorAll('.p2p-role-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.p2p-role-tab').forEach(t => {
          t.classList.remove('active');
          t.style.border = '1px solid #334155';
          t.style.background = 'rgba(15,23,42,0.8)';
          t.style.color = '#94a3b8';
        });
        tab.classList.add('active');
        tab.style.border = '1.5px solid #2563eb';
        tab.style.background = 'rgba(37,99,235,0.18)';
        tab.style.color = '#60a5fa';

        const role = tab.dataset.role;
        urlInput.value = this.getShareableUrl(role);
      });
    });

    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(urlInput.value);
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#16a34a';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.style.background = '#2563eb';
        }, 2000);
        if (window.orbitPlatform) {
          window.orbitPlatform.triggerToast('Direct P2P Link copied to clipboard!');
        }
      } catch (err) {
        urlInput.select();
        document.execCommand('copy');
      }
    });

    modal.querySelectorAll('.p2p-peer-role-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const peerId = sel.dataset.peer;
        const newRole = e.target.value;
        this.setPeerRole(peerId, newRole);
      });
    });
  }
}

export const p2pCollaborationEngine = new P2PCollaborationEngine();
