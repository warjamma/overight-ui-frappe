/**
 * OV Accordion Web Component
 * Chuyển đổi từ accordion.tsx (Radix UI Accordion)
 *
 * Usage HTML:
 *   <div class="ov-accordion" data-accordion data-type="single" data-collapsible>
 *     <div class="ov-accordion-item">
 *       <h3 class="ov-accordion-header">
 *         <button class="ov-accordion-trigger">
 *           Item 1
 *           <svg class="ov-accordion-icon" ...>chevron-down</svg>
 *         </button>
 *       </h3>
 *       <div class="ov-accordion-content">
 *         <div class="ov-accordion-content-inner">Content here</div>
 *       </div>
 *     </div>
 *   </div>
 *
 * Attributes on [data-accordion]:
 *   data-type="single"   — chỉ 1 item mở (default)
 *   data-type="multiple" — nhiều items có thể mở cùng lúc
 *   data-collapsible     — (boolean) cho phép đóng item đang active (single mode)
 */

const OvAccordion = {
  init(container = null) {
    const elements = container
      ? [container]
      : document.querySelectorAll('[data-accordion]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(accordionEl) {
    const type = accordionEl.dataset.type || 'single';
    const collapsible = accordionEl.hasAttribute('data-collapsible');
    const triggers = accordionEl.querySelectorAll('.ov-accordion-trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.ov-accordion-item');
        const content = item.querySelector('.ov-accordion-content');
        const isOpen = trigger.dataset.state === 'open';

        if (type === 'single') {
          // Close all others
          triggers.forEach(t => {
            if (t !== trigger) {
              t.dataset.state = 'closed';
              const c = t.closest('.ov-accordion-item').querySelector('.ov-accordion-content');
              if (c) c.dataset.state = 'closed';
            }
          });
        }

        // Toggle current
        if (isOpen && collapsible) {
          trigger.dataset.state = 'closed';
          if (content) content.dataset.state = 'closed';
        } else if (!isOpen) {
          trigger.dataset.state = 'open';
          if (content) content.dataset.state = 'open';
        }
      });

      // Keyboard
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });
    });
  }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  OvAccordion.init();
});

if (typeof window !== 'undefined') {
  window.OvAccordion = OvAccordion;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvAccordion };
}
