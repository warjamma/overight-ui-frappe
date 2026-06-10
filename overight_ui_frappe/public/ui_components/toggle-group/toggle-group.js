/**
 * OV Toggle Group Web Component
 * Chuyển đổi từ toggle-group.tsx (Radix UI ToggleGroup)
 *
 * Usage HTML:
 *   <div class="ov-toggle-group" role="group" data-toggle-group data-type="single">
 *     <button class="ov-toggle-group-item" data-value="bold">Bold</button>
 *     <button class="ov-toggle-group-item" data-value="italic">Italic</button>
 *     <button class="ov-toggle-group-item" data-value="underline">Underline</button>
 *   </div>
 *
 * Attributes:
 *   data-type="single"   - only one can be active
 *   data-type="multiple" - multiple can be active
 *
 * Events:
 *   'ov:change' with detail.value (string for single, array for multiple)
 */

const OvToggleGroup = {
  init(container = null) {
    const elements = container
      ? container.querySelectorAll('[data-toggle-group]')
      : document.querySelectorAll('[data-toggle-group]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(groupEl) {
    const type = groupEl.dataset.type || 'single';
    const items = groupEl.querySelectorAll('.ov-toggle-group-item');

    items.forEach(item => {
      item.addEventListener('click', () => {
        if (type === 'single') {
          const isOn = item.dataset.state === 'on';
          items.forEach(i => delete i.dataset.state);
          if (!isOn) item.dataset.state = 'on';
        } else {
          item.dataset.state = item.dataset.state === 'on' ? undefined : 'on';
        }

        const activeItems = Array.from(items).filter(i => i.dataset.state === 'on');
        const values = activeItems.map(i => i.dataset.value || i.textContent.trim());

        groupEl.dispatchEvent(new CustomEvent('ov:change', {
          bubbles: true,
          detail: { value: type === 'single' ? values[0] || null : values }
        }));
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OvToggleGroup.init();
});

if (typeof window !== 'undefined') {
  window.OvToggleGroup = OvToggleGroup;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvToggleGroup };
}
