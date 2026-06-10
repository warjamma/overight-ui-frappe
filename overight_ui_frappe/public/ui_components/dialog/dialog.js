/**
 * OV Dialog Web Component
 * Chuyển đổi từ dialog.tsx (Radix UI Dialog)
 *
 * Usage HTML:
 *   <div class="ov-dialog-overlay ov-hidden" id="my-dialog-overlay"></div>
 *   <div class="ov-dialog-content ov-hidden" id="my-dialog" role="dialog" aria-modal="true">
 *     <button class="ov-dialog-close" aria-label="Close">
 *       <svg>...</svg>
 *     </button>
 *     <div class="ov-dialog-header">
 *       <h2 class="ov-dialog-title">Title</h2>
 *       <p class="ov-dialog-description">Description</p>
 *     </div>
 *     <div class="ov-dialog-footer">
 *       <button class="ov-button" data-dialog-close>Cancel</button>
 *       <button class="ov-button ov-button--orange" data-dialog-action>Confirm</button>
 *     </div>
 *   </div>
 *
 * JS Usage:
 *   OvDialog.open('my-dialog');
 *   OvDialog.close('my-dialog');
 *
 *   // Hoặc dùng trong Frappe:
 *   const dialog = new OvDialogBuilder({
 *     title: 'Xác nhận',
 *     description: 'Bạn có chắc muốn xóa không?',
 *     onConfirm: () => { ... },
 *     onCancel: () => { ... }
 *   });
 *   dialog.show();
 */

const OvDialog = {
  _instances: new Map(),

  /**
   * Mở dialog theo ID
   * @param {string} dialogId
   */
  open(dialogId) {
    const content = document.getElementById(dialogId);
    if (!content) return;

    const overlayId = content.dataset.overlay || dialogId + '-overlay';
    const overlay = document.getElementById(overlayId);

    if (overlay) {
      overlay.classList.remove('ov-hidden');
      requestAnimationFrame(() => {
        overlay.dataset.state = 'open';
      });
    }

    content.classList.remove('ov-hidden');
    requestAnimationFrame(() => {
      content.dataset.state = 'open';
    });

    // Focus trap
    this._trapFocus(content);

    // Close on overlay click
    if (overlay) {
      overlay._closeHandler = () => this.close(dialogId);
      overlay.addEventListener('click', overlay._closeHandler);
    }

    // Close on Escape
    this._escHandler = (e) => {
      if (e.key === 'Escape') this.close(dialogId);
    };
    document.addEventListener('keydown', this._escHandler);

    // Wire up close buttons inside dialog
    content.querySelectorAll('[data-dialog-close]').forEach(btn => {
      btn.addEventListener('click', () => this.close(dialogId));
    });

    // Wire up ov-dialog-close button
    const closeBtn = content.querySelector('.ov-dialog-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close(dialogId));
    }
  },

  /**
   * Đóng dialog theo ID
   * @param {string} dialogId
   */
  close(dialogId) {
    const content = document.getElementById(dialogId);
    if (!content) return;

    const overlayId = content.dataset.overlay || dialogId + '-overlay';
    const overlay = document.getElementById(overlayId);

    content.dataset.state = 'closed';
    if (overlay) {
      overlay.dataset.state = 'closed';
      overlay.removeEventListener('click', overlay._closeHandler);
    }

    // Animate out then hide
    setTimeout(() => {
      content.classList.add('ov-hidden');
      if (overlay) overlay.classList.add('ov-hidden');
    }, 200);

    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
    }
  },

  /**
   * Trap focus inside dialog element
   */
  _trapFocus(element) {
    const focusable = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    focusable[0].focus();
  }
};

/**
 * Builder class để tạo dialog programmatically (như Frappe dialog)
 */
class OvDialogBuilder {
  constructor(options = {}) {
    this.title = options.title || '';
    this.description = options.description || '';
    this.confirmText = options.confirmText || 'Xác nhận';
    this.cancelText = options.cancelText || 'Hủy';
    this.confirmVariant = options.confirmVariant || 'orange';
    this.onConfirm = options.onConfirm || null;
    this.onCancel = options.onCancel || null;
    this.showCloseButton = options.showCloseButton !== false;
    this._id = 'ov-dialog-' + Date.now();
    this._el = null;
    this._overlay = null;
  }

  _createElements() {
    // Overlay
    this._overlay = document.createElement('div');
    this._overlay.className = 'ov-dialog-overlay';
    this._overlay.id = this._id + '-overlay';

    // Content
    this._el = document.createElement('div');
    this._el.className = 'ov-dialog-content';
    this._el.id = this._id;
    this._el.setAttribute('role', 'dialog');
    this._el.setAttribute('aria-modal', 'true');
    this._el.setAttribute('aria-labelledby', this._id + '-title');
    this._el.dataset.overlay = this._id + '-overlay';

    // Close button
    if (this.showCloseButton) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'ov-dialog-close';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      closeBtn.addEventListener('click', () => this.hide());
      this._el.appendChild(closeBtn);
    }

    // Header
    if (this.title || this.description) {
      const header = document.createElement('div');
      header.className = 'ov-dialog-header';

      if (this.title) {
        const title = document.createElement('h2');
        title.className = 'ov-dialog-title';
        title.id = this._id + '-title';
        title.textContent = this.title;
        header.appendChild(title);
      }

      if (this.description) {
        const desc = document.createElement('p');
        desc.className = 'ov-dialog-description';
        desc.textContent = this.description;
        header.appendChild(desc);
      }

      this._el.appendChild(header);
    }

    // Footer (action buttons)
    const footer = document.createElement('div');
    footer.className = 'ov-dialog-footer';

    if (this.cancelText) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'ov-button ov-button--white';
      cancelBtn.textContent = this.cancelText;
      cancelBtn.addEventListener('click', () => {
        if (this.onCancel) this.onCancel();
        this.hide();
      });
      footer.appendChild(cancelBtn);
    }

    if (this.confirmText) {
      const confirmBtn = document.createElement('button');
      confirmBtn.className = `ov-button ov-button--${this.confirmVariant}`;
      confirmBtn.textContent = this.confirmText;
      confirmBtn.addEventListener('click', () => {
        if (this.onConfirm) this.onConfirm();
      });
      footer.appendChild(confirmBtn);
    }

    this._el.appendChild(footer);

    // Append to body
    document.body.appendChild(this._overlay);
    document.body.appendChild(this._el);
  }

  show() {
    if (!this._el) this._createElements();
    OvDialog.open(this._id);
  }

  hide() {
    OvDialog.close(this._id);
  }

  destroy() {
    this.hide();
    setTimeout(() => {
      if (this._overlay) this._overlay.remove();
      if (this._el) this._el.remove();
    }, 300);
  }
}

// Export
if (typeof window !== 'undefined') {
  window.OvDialog = OvDialog;
  window.OvDialogBuilder = OvDialogBuilder;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvDialog, OvDialogBuilder };
}
