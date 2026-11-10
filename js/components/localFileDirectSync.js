/**
 * ============================================================================
 * GIRI ORBIT — LOCAL FILE DIRECT SYNC ENGINE (localFileDirectSync.js)
 * By Abhinav Giri (@abhinavgiri45)
 * ============================================================================
 * Sovereign Direct-to-Disk Read/Write via File System Access API & LaunchQueue.
 * Eliminates re-downloads, re-uploads, and server roundtrips.
 * Supports all tools: Drift, Axis, Kinetic, Aegis (PDF), Forms, Designer, Lists, Quiz.
 */

class LocalFileDirectSyncEngine {
  constructor() {
    this.activeHandles = {
      drift: null,
      axis: null,
      kinetic: null,
      pdf: null,
      forms: null,
      designer: null,
      lists: null,
      quiz: null
    };

    this.activeFileNames = {
      drift: null,
      axis: null,
      kinetic: null,
      pdf: null,
      forms: null,
      designer: null,
      lists: null,
      quiz: null
    };

    this.listeners = new Set();
    this.autoSaveDebounceTimers = {};
  }

  isSupported() {
    return typeof window !== 'undefined' && 'showSaveFilePicker' in window;
  }

  getActiveHandle(tool) {
    return this.activeHandles[tool] || null;
  }

  getActiveFileName(tool) {
    return this.activeFileNames[tool] || null;
  }

  setExternalHandle(tool, handle, fileName) {
    this.activeHandles[tool] = handle;
    this.activeFileNames[tool] = fileName || handle?.name || 'document';
    this._notifyChange(tool);
  }

  clearHandle(tool) {
    this.activeHandles[tool] = null;
    this.activeFileNames[tool] = null;
    this._notifyChange(tool);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notifyChange(tool) {
    this.listeners.forEach(fn => {
      try {
        fn(tool, this.activeFileNames[tool], this.activeHandles[tool]);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }

  /**
   * Automatic background write-through to disk file handle when handle is active
   */
  queueAutoSave(tool, content) {
    const handle = this.activeHandles[tool];
    if (!handle) return false;

    clearTimeout(this.autoSaveDebounceTimers[tool]);
    this.autoSaveDebounceTimers[tool] = setTimeout(async () => {
      try {
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        if (window.orbitPlatform) {
          window.orbitPlatform.showToast(`💾 Auto-saved directly to Explorer: ${this.activeFileNames[tool]}`);
        }
      } catch (e) {
        console.warn('Auto-save direct to handle skipped or permissions expired:', e);
      }
    }, 1500);
    return true;
  }

  /**
   * Save content directly to local disk.
   * If a file handle is already linked, writes directly without prompts.
   * If forcePicker is true or no handle exists, prompts native OS save picker.
   */
  async saveToDevice({
    tool,
    content,
    suggestedName = 'document',
    extension = 'gdrift',
    mimeType = 'text/plain',
    forcePicker = false
  }) {
    let handle = forcePicker ? null : this.activeHandles[tool];

    if (!handle) {
      if (!this.isSupported()) {
        this._fallbackDownload(content, `${suggestedName}.${extension}`, mimeType);
        if (window.orbitPlatform) {
          window.orbitPlatform.showToast(`Downloaded "${suggestedName}.${extension}" (Direct sync requires Chromium browser)`);
        }
        return { success: true, mode: 'download', name: `${suggestedName}.${extension}` };
      }

      const options = {
        suggestedName: suggestedName.endsWith(`.${extension}`) ? suggestedName : `${suggestedName}.${extension}`,
        types: [
          {
            description: `${tool.toUpperCase()} Document (*.${extension})`,
            accept: {
              [mimeType]: [`.${extension}`]
            }
          }
        ]
      };

      try {
        handle = await window.showSaveFilePicker(options);
        this.activeHandles[tool] = handle;
        this.activeFileNames[tool] = handle.name;
        this._notifyChange(tool);
      } catch (err) {
        if (err.name === 'AbortError') {
          return { success: false, aborted: true };
        }
        console.warn('showSaveFilePicker error:', err);
        this._fallbackDownload(content, `${suggestedName}.${extension}`, mimeType);
        return { success: true, mode: 'download', name: `${suggestedName}.${extension}` };
      }
    }

    try {
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();

      const fileName = handle.name;
      this.activeFileNames[tool] = fileName;
      this._notifyChange(tool);

      if (window.orbitPlatform) {
        window.orbitPlatform.showToast(`✓ Saved directly to disk: ${fileName}`);
      }

      return { success: true, mode: 'direct', name: fileName, handle };
    } catch (err) {
      console.error('Error writing directly to handle:', err);
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        this.clearHandle(tool);
        return this.saveToDevice({
          tool,
          content,
          suggestedName,
          extension,
          mimeType,
          forcePicker: true
        });
      }
      throw err;
    }
  }

  /**
   * Open a file directly from local disk and retain handle for subsequent direct saves.
   */
  async openFromDevice({ tool, acceptTypes = {} }) {
    if (!this.isSupported()) {
      return new Promise((resolve) => {
        let input = document.getElementById(`giri-file-picker-fallback-${tool}`);
        if (!input) {
          input = document.createElement('input');
          input.type = 'file';
          input.id = `giri-file-picker-fallback-${tool}`;
          input.style.display = 'none';
          document.body.appendChild(input);
        }
        const extList = [];
        Object.values(acceptTypes).forEach(extensions => {
          if (Array.isArray(extensions)) extList.push(...extensions);
        });
        input.accept = extList.join(',') || '*/*';
        input.onchange = (e) => {
          const file = e.target.files?.[0];
          if (!file) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const content = ev.target?.result;
            this.activeHandles[tool] = null;
            this.activeFileNames[tool] = file.name;
            this._notifyChange(tool);
            if (window.orbitPlatform) {
              window.orbitPlatform.showToast(`✓ Opened "${file.name}"`);
            }
            resolve({
              handle: null,
              name: file.name,
              content,
              file
            });
          };
          reader.onerror = () => resolve(null);
          reader.readAsText(file);
          input.value = '';
        };
        input.click();
      });
    }

    try {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: `${tool.toUpperCase()} Files`,
            accept: acceptTypes
          }
        ]
      });

      if (!handle) return null;

      const file = await handle.getFile();
      const content = await file.text();

      this.activeHandles[tool] = handle;
      this.activeFileNames[tool] = handle.name;
      this._notifyChange(tool);

      if (window.orbitPlatform) {
        window.orbitPlatform.showToast(`✓ Opened "${handle.name}" (Direct Disk Sync Active)`);
      }

      return {
        handle,
        name: handle.name,
        content,
        file
      };
    } catch (err) {
      if (err.name === 'AbortError') return null;
      console.error('openFromDevice error:', err);
      return null;
    }
  }

  _fallbackDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const localSync = new LocalFileDirectSyncEngine();
if (typeof window !== 'undefined') {
  window.localSync = localSync;
}
