/**
 * OV Switch Web Component
 * Chuyển đổi từ switch.tsx (Radix UI Switch)
 *
 * Usage HTML:
 *   <button class="ov-switch" role="switch" aria-checked="false" data-switch>
 *     <span class="ov-switch-thumb"></span>
 *   </button>
 *
 * Usage JS:
 *   OvSwitch.init();
 *   OvSwitch.setValue(el, true);   // turn on
 *   OvSwitch.getValue(el);         // returns boolean
 *
 * Events:
 *   'ov:change' event is dispatched on the switch element with detail.checked
 */

const OvSwitch = {
  init(container = null) {
    const elements = container
      ? container.querySelectorAll('[data-switch]')
      : document.querySelectorAll('[data-switch]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(switchEl) {
    // Set initial state
    const initialChecked = switchEl.getAttribute('aria-checked') === 'true';
    this._setState(switchEl, initialChecked, false);

    switchEl.addEventListener('click', () => {
      if (switchEl.disabled || switchEl.hasAttribute('disabled')) return;
      const current = switchEl.dataset.state === 'checked';
      this.setValue(switchEl, !current);
    });

    switchEl.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        switchEl.click();
      }
    });
  },

  setValue(switchEl, checked) {
    this._setState(switchEl, checked, true);
  },

  getValue(switchEl) {
    return switchEl.dataset.state === 'checked';
  },

  _setState(switchEl, checked, emit = true) {
    switchEl.dataset.state = checked ? 'checked' : 'unchecked';
    switchEl.setAttribute('aria-checked', String(checked));

    // Update visual styles
    if (checked) {
      switchEl.style.backgroundColor = '#f85c1e';
    } else {
      switchEl.style.backgroundColor = '#ffffff';
    }

    if (emit) {
      switchEl.dispatchEvent(new CustomEvent('ov:change', {
        bubbles: true,
        detail: { checked }
      }));
    }
  }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  OvSwitch.init();
});

if (typeof window !== 'undefined') {
  window.OvSwitch = OvSwitch;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvSwitch };
}
