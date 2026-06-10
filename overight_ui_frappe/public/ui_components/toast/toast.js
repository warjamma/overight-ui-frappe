/**
 * OV Toast Web Component
 * Chuyển đổi từ toast.tsx (Radix UI Toast)
 *
 * Usage (programmatic - recommended for Frappe):
 *   OvToast.show({ title: 'Thành công', description: 'Đã lưu thành công!' });
 *   OvToast.show({ title: 'Lỗi', description: 'Có lỗi xảy ra', duration: 5000 });
 *   OvToast.show({ title: 'Thông báo', duration: 0 }); // no auto-close
 *
 * Options:
 *   title:       (string)  - Tiêu đề toast
 *   description: (string)  - Mô tả (optional)
 *   duration:    (number)  - ms trước khi tự đóng, 0 = không tự đóng (default: 4000)
 *   action:      (string)  - Text của action button (optional)
 *   onAction:    (fn)      - Callback khi click action button
 */

const OvToast = {
  _viewport: null,
  _toasts: new Map(),

  _getViewport() {
    if (!this._viewport) {
      this._viewport = document.createElement('div');
      this._viewport.className = 'ov-toast-viewport';
      this._viewport.setAttribute('aria-live', 'polite');
      this._viewport.setAttribute('aria-atomic', 'false');
      document.body.appendChild(this._viewport);
    }
    return this._viewport;
  },

  show(options = {}) {
    const {
      title = '',
      description = '',
      duration = 4000,
      action = null,
      onAction = null,
    } = options;

    const viewport = this._getViewport();
    const id = 'ov-toast-' + Date.now();

    const toast = document.createElement('div');
    toast.className = 'ov-toast';
    toast.id = id;
    toast.setAttribute('role', 'status');

    // Body (title + description)
    const body = document.createElement('div');
    body.className = 'ov-toast-body';

    if (title) {
      const titleEl = document.createElement('p');
      titleEl.className = 'ov-toast-title';
      titleEl.textContent = title;
      body.appendChild(titleEl);
    }

    if (description) {
      const descEl = document.createElement('p');
      descEl.className = 'ov-toast-description';
      descEl.textContent = description;
      body.appendChild(descEl);
    }

    toast.appendChild(body);

    // Action button (optional)
    if (action) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'ov-button ov-button--sm ov-button--orange';
      actionBtn.textContent = action;
      actionBtn.addEventListener('click', () => {
        if (onAction) onAction();
        this.dismiss(id);
      });
      toast.appendChild(actionBtn);
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ov-toast-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    closeBtn.addEventListener('click', () => this.dismiss(id));
    toast.appendChild(closeBtn);

    viewport.appendChild(toast);

    // Auto dismiss
    let timer = null;
    if (duration > 0) {
      timer = setTimeout(() => this.dismiss(id), duration);
    }

    this._toasts.set(id, { el: toast, timer });
    return id;
  },

  dismiss(id) {
    const toastData = this._toasts.get(id);
    if (!toastData) return;

    clearTimeout(toastData.timer);
    toastData.el.classList.add('ov-toast-exit');

    setTimeout(() => {
      toastData.el.remove();
      this._toasts.delete(id);
    }, 200);
  },

  dismissAll() {
    this._toasts.forEach((_, id) => this.dismiss(id));
  }
};

// Export
if (typeof window !== 'undefined') {
  window.OvToast = OvToast;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvToast };
}
