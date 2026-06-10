/**
 * OV Dropdown Menu Web Component
 * Chuyển đổi từ dropdown-menu.tsx (Radix UI DropdownMenu)
 *
 * Usage HTML:
 *   <div class="ov-dropdown-menu" data-dropdown>
 *     <button class="ov-button" data-dropdown-trigger>Options ▾</button>
 *     <div class="ov-dropdown-menu-content" data-align="end">
 *       <div class="ov-dropdown-menu-item" data-value="edit">Edit</div>
 *       <div class="ov-dropdown-menu-item" data-value="copy">Copy</div>
 *       <div class="ov-dropdown-menu-separator"></div>
 *       <div class="ov-dropdown-menu-item" data-variant="destructive" data-value="delete">Delete</div>
 *     </div>
 *   </div>
 *
 * Events:
 *   'ov:select' on the dropdown element with detail.value
 */

const OvDropdownMenu = {
  init(container = null) {
    const elements = container
      ? container.querySelectorAll('[data-dropdown]')
      : document.querySelectorAll('[data-dropdown]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(dropdownEl) {
    const trigger = dropdownEl.querySelector('[data-dropdown-trigger]');
    const content = dropdownEl.querySelector('.ov-dropdown-menu-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = content.dataset.state === 'open';
      // Close all other dropdowns
      document.querySelectorAll('.ov-dropdown-menu-content[data-state="open"]').forEach(c => {
        c.dataset.state = 'closed';
      });
      content.dataset.state = isOpen ? 'closed' : 'open';
    });

    // Items
    content.querySelectorAll('.ov-dropdown-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const value = item.dataset.value || item.textContent.trim();
        content.dataset.state = 'closed';
        dropdownEl.dispatchEvent(new CustomEvent('ov:select', {
          bubbles: true,
          detail: { value, element: item }
        }));
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!dropdownEl.contains(e.target)) {
        content.dataset.state = 'closed';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') content.dataset.state = 'closed';
    });
  }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  OvDropdownMenu.init();
});

if (typeof window !== 'undefined') {
  window.OvDropdownMenu = OvDropdownMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvDropdownMenu };
}
