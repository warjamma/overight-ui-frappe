/**
 * OV Context Menu Web Component
 * Chuyển đổi từ context-menu.tsx (Radix UI ContextMenu)
 *
 * Usage HTML:
 *   <div data-context-menu data-target="#my-content-area">
 *     <div class="ov-context-menu-content" id="ctx-menu">
 *       <div class="ov-context-menu-item" data-value="cut">Cut</div>
 *       <div class="ov-context-menu-item" data-value="copy">Copy</div>
 *       <div class="ov-context-menu-separator"></div>
 *       <div class="ov-context-menu-item" data-value="paste">Paste</div>
 *     </div>
 *   </div>
 *
 *   <!-- Or attach to specific element: -->
 *   <div id="my-table" data-contextmenu-for="ctx-menu">...</div>
 *
 * Events:
 *   'ov:select' on the context menu element with detail.value
 */

const OvContextMenu = {
  _current: null,

  init() {
    // Auto-attach context menus to elements with data-contextmenu-for
    document.querySelectorAll('[data-contextmenu-for]').forEach(el => {
      const menuId = el.dataset.contextmenuFor;
      const menu = document.getElementById(menuId);
      if (!menu) return;

      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this._show(menu, e.clientX, e.clientY);
      });
    });

    // Wire up items in all context menus
    document.querySelectorAll('.ov-context-menu-content').forEach(menu => {
      menu.querySelectorAll('.ov-context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
          const value = item.dataset.value || item.textContent.trim();
          this._hide(menu);
          menu.dispatchEvent(new CustomEvent('ov:select', {
            bubbles: true,
            detail: { value, element: item }
          }));
        });
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this._current && !this._current.contains(e.target)) {
        this._hide(this._current);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._current) {
        this._hide(this._current);
      }
    });
  },

  _show(menu, x, y) {
    if (this._current && this._current !== menu) {
      this._hide(this._current);
    }
    menu.style.position = 'fixed';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.dataset.state = 'open';
    this._current = menu;

    // Adjust if off screen
    requestAnimationFrame(() => {
      const rect = menu.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        menu.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        menu.style.top = `${y - rect.height}px`;
      }
    });
  },

  _hide(menu) {
    menu.dataset.state = 'closed';
    this._current = null;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OvContextMenu.init();
});

if (typeof window !== 'undefined') {
  window.OvContextMenu = OvContextMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvContextMenu };
}
