/**
 * OV Popover Web Component
 * Chuyển đổi từ popover.tsx (Radix UI Popover)
 *
 * Usage HTML:
 *   <div class="ov-popover" data-popover>
 *     <button data-popover-trigger>Open Popover</button>
 *     <div class="ov-popover-content" data-align="center">
 *       <p>Popover content here</p>
 *     </div>
 *   </div>
 *
 * Events:
 *   'ov:open'  - when popover opens
 *   'ov:close' - when popover closes
 */

const OvPopover = {
  init(container = null) {
    const elements = container
      ? container.querySelectorAll('[data-popover]')
      : document.querySelectorAll('[data-popover]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(popoverEl) {
    const trigger = popoverEl.querySelector('[data-popover-trigger]');
    const content = popoverEl.querySelector('.ov-popover-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = content.dataset.state === 'open';
      // Close all other popovers
      document.querySelectorAll('.ov-popover-content[data-state="open"]').forEach(c => {
        c.dataset.state = 'closed';
      });

      if (!isOpen) {
        content.dataset.state = 'open';
        popoverEl.dispatchEvent(new CustomEvent('ov:open', { bubbles: true }));
      } else {
        content.dataset.state = 'closed';
        popoverEl.dispatchEvent(new CustomEvent('ov:close', { bubbles: true }));
      }
    });

    document.addEventListener('click', (e) => {
      if (!popoverEl.contains(e.target)) {
        if (content.dataset.state === 'open') {
          content.dataset.state = 'closed';
          popoverEl.dispatchEvent(new CustomEvent('ov:close', { bubbles: true }));
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && content.dataset.state === 'open') {
        content.dataset.state = 'closed';
        trigger.focus();
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OvPopover.init();
});

if (typeof window !== 'undefined') {
  window.OvPopover = OvPopover;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvPopover };
}
