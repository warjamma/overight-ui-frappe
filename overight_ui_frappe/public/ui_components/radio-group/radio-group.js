/**
 * OV Radio Group Web Component
 * Chuyển đổi từ radio-group.tsx (Radix UI RadioGroup)
 *
 * Usage HTML (RadioGroupOption style):
 *   <div class="ov-radio-group" role="radiogroup" data-radio-group>
 *     <button class="ov-radio-option" role="radio" aria-checked="false" data-value="option1">
 *       <span class="ov-radio-option-indicator">
 *         <span class="ov-radio-option-dot"></span>
 *       </span>
 *       <span>Option 1</span>
 *     </button>
 *     <button class="ov-radio-option" role="radio" aria-checked="false" data-value="option2">
 *       <span class="ov-radio-option-indicator">
 *         <span class="ov-radio-option-dot"></span>
 *       </span>
 *       <span>Option 2</span>
 *     </button>
 *   </div>
 *
 * Events:
 *   'ov:change' on the group element with detail.value
 */

const OvRadioGroup = {
  init(container = null) {
    const elements = container
      ? container.querySelectorAll('[data-radio-group]')
      : document.querySelectorAll('[data-radio-group]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(groupEl) {
    const items = groupEl.querySelectorAll('.ov-radio-option, .ov-radio-item');

    items.forEach(item => {
      item.addEventListener('click', () => {
        if (item.disabled || item.hasAttribute('disabled')) return;
        this._selectItem(groupEl, item);
      });

      item.addEventListener('keydown', (e) => {
        const allItems = Array.from(items);
        const idx = allItems.indexOf(item);
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (idx + 1) % allItems.length;
          this._selectItem(groupEl, allItems[next]);
          allItems[next].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (idx - 1 + allItems.length) % allItems.length;
          this._selectItem(groupEl, allItems[prev]);
          allItems[prev].focus();
        }
      });
    });
  },

  _selectItem(groupEl, selectedItem) {
    const items = groupEl.querySelectorAll('.ov-radio-option, .ov-radio-item');
    items.forEach(item => {
      delete item.dataset.state;
      item.setAttribute('aria-checked', 'false');
      item.setAttribute('tabindex', '-1');
    });
    selectedItem.dataset.state = 'checked';
    selectedItem.setAttribute('aria-checked', 'true');
    selectedItem.setAttribute('tabindex', '0');
    groupEl.dataset.value = selectedItem.dataset.value || '';

    groupEl.dispatchEvent(new CustomEvent('ov:change', {
      bubbles: true,
      detail: { value: selectedItem.dataset.value || selectedItem.textContent.trim() }
    }));
  },

  getValue(groupEl) {
    return groupEl.dataset.value || '';
  },

  setValue(groupEl, value) {
    const item = groupEl.querySelector(`[data-value="${value}"]`);
    if (item) this._selectItem(groupEl, item);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OvRadioGroup.init();
});

if (typeof window !== 'undefined') {
  window.OvRadioGroup = OvRadioGroup;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvRadioGroup };
}
