/**
 * OV Tooltip Web Component
 * Chuyển đổi từ tooltip.tsx (Radix UI Tooltip)
 *
 * Usage HTML (CSS-only):
 *   <div class="ov-tooltip-wrapper">
 *     <button>Hover me</button>
 *     <div class="ov-tooltip-content">Tooltip text</div>
 *   </div>
 *
 * Usage JS (programmatic - adds delay support):
 *   OvTooltip.init();
 *
 * Options via data attributes on wrapper:
 *   data-delay-show="500"   - ms delay before showing
 *   data-delay-hide="0"     - ms delay before hiding
 *   data-side="top|bottom|left|right" - position
 */

const OvTooltip = {
  _hoverTimer: null,
  _hideTimer: null,

  init(container = null) {
    const elements = container
      ? container.querySelectorAll('[data-tooltip]')
      : document.querySelectorAll('[data-tooltip]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(wrapperEl) {
    const content = wrapperEl.querySelector('.ov-tooltip-content');
    if (!content) return;

    const delayShow = parseInt(wrapperEl.dataset.delayShow || '300');
    const delayHide = parseInt(wrapperEl.dataset.delayHide || '100');
    const side = wrapperEl.dataset.side || 'top';
    content.dataset.side = side;

    wrapperEl.addEventListener('mouseenter', () => {
      clearTimeout(this._hideTimer);
      this._hoverTimer = setTimeout(() => {
        content.style.opacity = '1';
        content.style.pointerEvents = 'auto';
        content.dataset.state = 'delayed-open';
      }, delayShow);
    });

    wrapperEl.addEventListener('mouseleave', () => {
      clearTimeout(this._hoverTimer);
      this._hideTimer = setTimeout(() => {
        content.style.opacity = '0';
        content.style.pointerEvents = 'none';
        delete content.dataset.state;
      }, delayHide);
    });

    // Focus-based tooltip (accessibility)
    const trigger = wrapperEl.querySelector('button, a, [tabindex]');
    if (trigger) {
      trigger.addEventListener('focus', () => {
        content.style.opacity = '1';
        content.dataset.state = 'instant-open';
      });
      trigger.addEventListener('blur', () => {
        content.style.opacity = '0';
        delete content.dataset.state;
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OvTooltip.init();
});

if (typeof window !== 'undefined') {
  window.OvTooltip = OvTooltip;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvTooltip };
}
