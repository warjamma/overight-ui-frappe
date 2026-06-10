/**
 * OV Alert Dialog Web Component
 * Chuyển đổi từ alert-dialog.tsx (Radix UI AlertDialog)
 *
 * Sử dụng dialog.js làm base, thêm Action (red) và Cancel (white) buttons
 *
 * Usage (programmatic - recommended):
 *   OvAlertDialog.confirm({
 *     title: 'Xóa dữ liệu',
 *     description: 'Bạn có chắc muốn xóa không? Hành động này không thể hoàn tác.',
 *     onConfirm: () => { ... do delete ... },
 *   });
 *
 * Usage (HTML):
 *   <!-- Trigger -->
 *   <button data-alert-dialog-trigger="confirm-dialog">Delete</button>
 *   
 *   <!-- Dialog -->
 *   <div class="ov-dialog-overlay ov-hidden" id="confirm-dialog-overlay"></div>
 *   <div class="ov-dialog-content ov-hidden" id="confirm-dialog">
 *     <div class="ov-dialog-header">
 *       <h2 class="ov-dialog-title">Xóa dữ liệu</h2>
 *       <p class="ov-dialog-description">Hành động này không thể hoàn tác.</p>
 *     </div>
 *     <div class="ov-dialog-footer">
 *       <button class="ov-alert-dialog-cancel" data-dialog-close>Hủy</button>
 *       <button class="ov-alert-dialog-action" id="confirm-action">Xóa</button>
 *     </div>
 *   </div>
 */

const OvAlertDialog = {
  /**
   * Tạo và hiển thị confirm dialog theo kiểu frappe
   */
  confirm(options = {}) {
    const {
      title = 'Xác nhận',
      description = 'Bạn có chắc chắn muốn thực hiện hành động này?',
      confirmText = 'Xác nhận',
      cancelText = 'Hủy',
      onConfirm = null,
      onCancel = null,
    } = options;

    const id = 'ov-alert-dialog-' + Date.now();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'ov-dialog-overlay';
    overlay.id = id + '-overlay';

    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'ov-dialog-content';
    dialog.id = id;
    dialog.setAttribute('role', 'alertdialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.dataset.overlay = id + '-overlay';

    // Header
    const header = document.createElement('div');
    header.className = 'ov-dialog-header';

    const titleEl = document.createElement('h2');
    titleEl.className = 'ov-dialog-title';
    titleEl.textContent = title;

    const descEl = document.createElement('p');
    descEl.className = 'ov-dialog-description';
    descEl.textContent = description;

    header.appendChild(titleEl);
    header.appendChild(descEl);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'ov-dialog-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'ov-alert-dialog-cancel';
    cancelBtn.textContent = cancelText;
    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      cleanup();
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'ov-alert-dialog-action';
    confirmBtn.textContent = confirmText;
    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      cleanup();
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    dialog.appendChild(header);
    dialog.appendChild(footer);

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    // Show
    requestAnimationFrame(() => {
      overlay.dataset.state = 'open';
      dialog.dataset.state = 'open';
    });

    // Overlay click to close
    overlay.addEventListener('click', cleanup);

    // Escape to close
    const escHandler = (e) => {
      if (e.key === 'Escape') cleanup();
    };
    document.addEventListener('keydown', escHandler);

    // Focus confirm button
    setTimeout(() => confirmBtn.focus(), 50);

    function cleanup() {
      overlay.dataset.state = 'closed';
      dialog.dataset.state = 'closed';
      document.removeEventListener('keydown', escHandler);
      setTimeout(() => {
        overlay.remove();
        dialog.remove();
      }, 250);
    }

    return { close: cleanup };
  }
};

// Wire up HTML triggers automatically
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-alert-dialog-trigger]').forEach(trigger => {
    const targetId = trigger.dataset.alertDialogTrigger;
    trigger.addEventListener('click', () => {
      const overlay = document.getElementById(targetId + '-overlay');
      const content = document.getElementById(targetId);
      if (overlay) {
        overlay.classList.remove('ov-hidden');
        requestAnimationFrame(() => overlay.dataset.state = 'open');
      }
      if (content) {
        content.classList.remove('ov-hidden');
        requestAnimationFrame(() => content.dataset.state = 'open');
      }
    });
  });
});

// Export
if (typeof window !== 'undefined') {
  window.OvAlertDialog = OvAlertDialog;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvAlertDialog };
}
