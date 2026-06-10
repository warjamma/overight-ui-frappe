/**
 * OV Collapsible Web Component
 * Chuyển đổi từ collapsible.tsx (Radix UI Collapsible)
 *
 * Usage HTML:
 *   <div class="ov-collapsible" data-collapsible data-open>
 *     <button data-collapsible-trigger>Toggle</button>
 *     <div class="ov-collapsible-content">
 *       Hidden content here
 *     </div>
 *   </div>
 */

const OvCollapsible = {
  init(container = null) {
    const elements = container
      ? container.querySelectorAll('[data-collapsible]')
      : document.querySelectorAll('[data-collapsible]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(el) {
    const trigger = el.querySelector('[data-collapsible-trigger]');
    const content = el.querySelector('.ov-collapsible-content');
    if (!trigger || !content) return;

    // Set initial state
    const isOpen = el.hasAttribute('data-open');
    content.dataset.state = isOpen ? 'open' : 'closed';

    trigger.addEventListener('click', () => {
      const open = content.dataset.state === 'open';
      content.dataset.state = open ? 'closed' : 'open';
      el.dispatchEvent(new CustomEvent('ov:change', {
        bubbles: true,
        detail: { open: !open }
      }));
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OvCollapsible.init();
});

if (typeof window !== 'undefined') {
  window.OvCollapsible = OvCollapsible;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvCollapsible };
}
