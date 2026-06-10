/**
 * OV Tabs Web Component
 * Chuyển đổi từ tabs.tsx (Radix UI Tabs)
 *
 * Usage HTML:
 *   <div class="ov-tabs" data-tabs>
 *     <div class="ov-tabs-list" role="tablist">
 *       <button class="ov-tabs-trigger" role="tab" data-tab-target="tab1" data-state="active">Tab 1</button>
 *       <button class="ov-tabs-trigger" role="tab" data-tab-target="tab2">Tab 2</button>
 *       <button class="ov-tabs-trigger" role="tab" data-tab-target="tab3">Tab 3</button>
 *     </div>
 *     <div class="ov-tabs-content" id="tab1" role="tabpanel" data-state="active">Content 1</div>
 *     <div class="ov-tabs-content" id="tab2" role="tabpanel">Content 2</div>
 *     <div class="ov-tabs-content" id="tab3" role="tabpanel">Content 3</div>
 *   </div>
 *
 * JS Usage:
 *   OvTabs.init();          // Auto-init all [data-tabs] elements
 *   OvTabs.init(element);   // Init specific element
 *   OvTabs.setActive(tabsEl, 'tab2');  // Programmatically change tab
 */

const OvTabs = {
  /**
   * Initialize tabs component
   * @param {HTMLElement|null} container - If null, init all [data-tabs] on page
   */
  init(container = null) {
    const elements = container
      ? [container]
      : document.querySelectorAll('[data-tabs]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(tabsEl) {
    const triggers = tabsEl.querySelectorAll('.ov-tabs-trigger');
    const contents = tabsEl.querySelectorAll('.ov-tabs-content');

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => {
        this.setActiveByIndex(tabsEl, index);
      });

      // Keyboard navigation
      trigger.addEventListener('keydown', (e) => {
        const all = Array.from(triggers);
        const idx = all.indexOf(trigger);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (idx + 1) % all.length;
          this.setActiveByIndex(tabsEl, next);
          all[next].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (idx - 1 + all.length) % all.length;
          this.setActiveByIndex(tabsEl, prev);
          all[prev].focus();
        }
      });
    });
  },

  setActiveByIndex(tabsEl, index) {
    const triggers = tabsEl.querySelectorAll('.ov-tabs-trigger');
    const contents = tabsEl.querySelectorAll('.ov-tabs-content');

    triggers.forEach((t, i) => {
      if (i === index) {
        t.dataset.state = 'active';
        t.setAttribute('aria-selected', 'true');
        t.setAttribute('tabindex', '0');
      } else {
        t.dataset.state = 'inactive';
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      }
    });

    contents.forEach((c, i) => {
      if (i === index) {
        c.dataset.state = 'active';
      } else {
        c.dataset.state = 'inactive';
      }
    });
  },

  setActive(tabsEl, tabId) {
    const triggers = tabsEl.querySelectorAll('.ov-tabs-trigger');
    const targetTrigger = Array.from(triggers).find(t => t.dataset.tabTarget === tabId);
    if (targetTrigger) {
      const idx = Array.from(triggers).indexOf(targetTrigger);
      this.setActiveByIndex(tabsEl, idx);
    }
  }
};

// Auto-init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  OvTabs.init();
});

// Export
if (typeof window !== 'undefined') {
  window.OvTabs = OvTabs;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvTabs };
}
