/**
 * OV Select Web Component
 * Chuyển đổi từ select.tsx (Radix UI Select)
 *
 * Usage HTML:
 *   <div class="ov-select" data-select>
 *     <button class="ov-select-trigger" aria-haspopup="listbox">
 *       <span class="ov-select-value">Chọn một giá trị</span>
 *       <svg class="ov-select-trigger-icon" ...>chevron-down</svg>
 *     </button>
 *     <div class="ov-select-content" role="listbox">
 *       <div class="ov-select-viewport">
 *         <div class="ov-select-item" data-value="option1" role="option">Option 1</div>
 *         <div class="ov-select-item" data-value="option2" role="option">Option 2</div>
 *       </div>
 *     </div>
 *   </div>
 *
 * JS Usage:
 *   OvSelect.init();
 *   OvSelect.getValue(selectEl); // returns selected value string
 *   OvSelect.setValue(selectEl, 'option2'); // set value programmatically
 *
 * Events:
 *   'ov:change' on the select element with detail.value and detail.label
 */

const OvSelect = {
  init(container = null) {
    const root = container || document;

    // Transform native selects matching target names/ids/classes
    root.querySelectorAll('select.form-control, select[data-fieldname], select[data-fieldtype="Select"]').forEach(selectEl => {
      this.transform(selectEl);
    });

    const elements = container
      ? container.querySelectorAll('[data-select]')
      : document.querySelectorAll('[data-select]');

    elements.forEach(el => this._initOne(el));
  },

  transform(selectEl) {
    if (selectEl.dataset.ovSelectTransformed === 'true') {
      const container = selectEl.nextSibling;
      if (container && container.classList.contains('ov-select')) {
        const items = container.querySelectorAll('.ov-select-item');
        let needsRebuild = items.length !== selectEl.options.length;
        if (!needsRebuild) {
          for (let k = 0; k < items.length; k++) {
            if (items[k].dataset.value !== selectEl.options[k].value || 
                items[k].textContent.trim() !== selectEl.options[k].textContent.trim()) {
              needsRebuild = true;
              break;
            }
          }
        }
        if (needsRebuild) {
          const viewport = container.querySelector('.ov-select-viewport');
          if (viewport) {
            viewport.innerHTML = '';
            Array.from(selectEl.options).forEach(opt => {
              const item = document.createElement('div');
              item.className = 'ov-select-item';
              item.setAttribute('role', 'option');
              item.dataset.value = opt.value;
              item.textContent = opt.textContent.trim();
              if (opt.selected) {
                item.dataset.state = 'checked';
                item.setAttribute('aria-selected', 'true');
              }
              viewport.appendChild(item);
            });
          }
        }
        const selectedOpt = selectEl.options[selectEl.selectedIndex];
        const valueDisplay = container.querySelector('.ov-select-value');
        if (valueDisplay && selectedOpt) {
          valueDisplay.textContent = selectedOpt.textContent.trim();
        }
      }
      return;
    }

    if (selectEl.style.display === 'none' || selectEl.classList.contains('ov-select-hidden')) return;

    selectEl.dataset.ovSelectTransformed = 'true';
    selectEl.classList.add('ov-select-hidden');
    selectEl.style.display = 'none';

    // Create container
    const container = document.createElement('div');
    container.className = 'ov-select';
    container.setAttribute('data-select', '');

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ov-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'ov-select-value';

    const selectedOpt = selectEl.options[selectEl.selectedIndex] || selectEl.options[0];
    valueDisplay.textContent = selectedOpt ? selectedOpt.textContent.trim() : 'Select option';

    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('class', 'ov-select-trigger-icon');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('fill', 'none');
    iconSvg.setAttribute('stroke', 'currentColor');
    iconSvg.setAttribute('stroke-width', '2');
    iconSvg.setAttribute('stroke-linecap', 'round');
    iconSvg.setAttribute('stroke-linejoin', 'round');
    iconSvg.innerHTML = '<path d="m6 9 6 6 6-6"/>';

    trigger.appendChild(valueDisplay);
    trigger.appendChild(iconSvg);
    container.appendChild(trigger);

    // Create content
    const content = document.createElement('div');
    content.className = 'ov-select-content';
    content.setAttribute('role', 'listbox');
    content.dataset.state = 'closed';

    const viewport = document.createElement('div');
    viewport.className = 'ov-select-viewport';

    Array.from(selectEl.options).forEach(opt => {
      const item = document.createElement('div');
      item.className = 'ov-select-item';
      item.setAttribute('role', 'option');
      item.dataset.value = opt.value;
      item.textContent = opt.textContent.trim();

      if (opt.selected) {
        item.dataset.state = 'checked';
        item.setAttribute('aria-selected', 'true');
      }

      viewport.appendChild(item);
    });

    content.appendChild(viewport);
    container.appendChild(content);

    // Insert custom select after native select
    selectEl.parentNode.insertBefore(container, selectEl.nextSibling);

    // Sync Custom -> Native
    container.addEventListener('ov:change', (e) => {
      const newVal = e.detail.value;
      if (selectEl.value !== newVal) {
        selectEl.value = newVal;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Sync Native -> Custom
    selectEl.addEventListener('change', () => {
      const currentVal = selectEl.value;
      this.setValue(container, currentVal);
    });
  },

  _initOne(selectEl) {
    if (selectEl.dataset.ovSelectInitialized === 'true') return;
    selectEl.dataset.ovSelectInitialized = 'true';

    const trigger = selectEl.querySelector('.ov-select-trigger');
    const content = selectEl.querySelector('.ov-select-content');
    const valueDisplay = selectEl.querySelector('.ov-select-value');

    if (!trigger || !content) return;

    // Open/close on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = content.dataset.state === 'open';
      // Close all other open selects
      document.querySelectorAll('.ov-select-content[data-state="open"]').forEach(c => {
        c.dataset.state = 'closed';
        const cTrigger = c.closest('[data-select]').querySelector('.ov-select-trigger');
        if (cTrigger) cTrigger.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        content.dataset.state = 'open';
        trigger.setAttribute('aria-expanded', 'true');
        this._positionContent(selectEl, trigger, content);
      }
    });

    // Select item (via Event Delegation on content viewport)
    content.addEventListener('click', (e) => {
      const item = e.target.closest('.ov-select-item');
      if (!item) return;

      const value = item.dataset.value || item.textContent.trim();
      const label = item.textContent.trim();

      // Update selected state
      content.querySelectorAll('.ov-select-item').forEach(i => {
        delete i.dataset.state;
        i.removeAttribute('aria-selected');
      });
      item.dataset.state = 'checked';
      item.setAttribute('aria-selected', 'true');

      // Update display
      if (valueDisplay) valueDisplay.textContent = label;
      selectEl.dataset.value = value;

      // Close
      content.dataset.state = 'closed';
      trigger.setAttribute('aria-expanded', 'false');

      // Emit change event
      selectEl.dispatchEvent(new CustomEvent('ov:change', {
        bubbles: true,
        detail: { value, label }
      }));
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        content.dataset.state = 'open';
        trigger.setAttribute('aria-expanded', 'true');
        const firstItem = content.querySelector('.ov-select-item');
        if (firstItem) firstItem.focus();
      }
    });
  },

  _positionContent(selectEl, trigger, content) {
    // Make content visible to measure
    content.style.display = 'block';
    const triggerRect = trigger.getBoundingClientRect();
    const contentHeight = content.offsetHeight;
    
    // Clear inline display style immediately after measuring so CSS data-state controls the display state
    content.style.display = '';

    const viewportHeight = window.innerHeight;

    // Position below by default
    if (triggerRect.bottom + contentHeight > viewportHeight) {
      content.style.bottom = `${trigger.offsetHeight}px`;
      content.style.top = 'auto';
    } else {
      content.style.top = `${trigger.offsetHeight}px`;
      content.style.bottom = 'auto';
    }
  },

  getValue(selectEl) {
    return selectEl.dataset.value || '';
  },

  setValue(selectEl, value) {
    const items = selectEl.querySelectorAll('.ov-select-item');
    const valueDisplay = selectEl.querySelector('.ov-select-value');

    items.forEach(item => {
      const itemValue = item.dataset.value || item.textContent.trim();
      if (itemValue === value) {
        item.dataset.state = 'checked';
        item.setAttribute('aria-selected', 'true');
        if (valueDisplay) valueDisplay.textContent = item.textContent.trim();
      } else {
        delete item.dataset.state;
        item.removeAttribute('aria-selected');
      }
    });
    selectEl.dataset.value = value;
  }
};

// Global click handler for closing dropdowns when clicking outside
if (typeof window !== 'undefined' && !window.OvSelectGlobalInitialized) {
  window.OvSelectGlobalInitialized = true;
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.ov-select-content[data-state="open"]').forEach(content => {
      const selectEl = content.closest('[data-select]');
      if (selectEl && !selectEl.contains(e.target)) {
        content.dataset.state = 'closed';
        const trigger = selectEl.querySelector('.ov-select-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  OvSelect.init();
});

if (typeof window !== 'undefined') {
  window.OvSelect = OvSelect;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvSelect };
}
