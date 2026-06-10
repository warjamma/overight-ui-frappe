/**
 * OV Slider Web Component
 * Chuyển đổi từ slider.tsx (Radix UI Slider)
 *
 * Usage HTML:
 *   <div class="ov-slider" data-slider data-min="0" data-max="100" data-step="1" data-value="30">
 *     <div class="ov-slider-track">
 *       <div class="ov-slider-range"></div>
 *     </div>
 *     <div class="ov-slider-thumb" tabindex="0" role="slider"
 *          aria-valuemin="0" aria-valuemax="100" aria-valuenow="30"></div>
 *   </div>
 *
 * JS Usage:
 *   OvSlider.init();
 *   OvSlider.getValue(sliderEl);       // returns number
 *   OvSlider.setValue(sliderEl, 50);   // set value
 *
 * Events:
 *   'ov:change' on sliderEl with detail.value (number)
 */

const OvSlider = {
  init(container = null) {
    const elements = container
      ? container.querySelectorAll('[data-slider]')
      : document.querySelectorAll('[data-slider]');

    elements.forEach(el => this._initOne(el));
  },

  _initOne(sliderEl) {
    const track = sliderEl.querySelector('.ov-slider-track');
    const range = sliderEl.querySelector('.ov-slider-range');
    const thumb = sliderEl.querySelector('.ov-slider-thumb');

    if (!track || !thumb) return;

    const min = parseFloat(sliderEl.dataset.min || '0');
    const max = parseFloat(sliderEl.dataset.max || '100');
    const step = parseFloat(sliderEl.dataset.step || '1');
    let value = parseFloat(sliderEl.dataset.value || String((min + max) / 2));

    const updateVisuals = (val) => {
      const pct = ((val - min) / (max - min)) * 100;
      thumb.style.left = `${pct}%`;
      if (range) range.style.width = `${pct}%`;
      thumb.setAttribute('aria-valuenow', String(val));
    };

    updateVisuals(value);

    // Mouse drag on track
    const onTrackClick = (e) => {
      if (sliderEl.hasAttribute('disabled')) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const rawVal = min + pct * (max - min);
      value = Math.round(rawVal / step) * step;
      value = Math.max(min, Math.min(max, value));
      updateVisuals(value);
      sliderEl.dataset.value = String(value);
      sliderEl.dispatchEvent(new CustomEvent('ov:change', { bubbles: true, detail: { value } }));
    };

    track.addEventListener('click', onTrackClick);

    // Thumb drag
    let dragging = false;
    thumb.addEventListener('mousedown', (e) => {
      dragging = true;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      onTrackClick(e);
    });

    document.addEventListener('mouseup', () => {
      dragging = false;
    });

    // Touch support
    thumb.addEventListener('touchstart', (e) => {
      dragging = true;
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const touch = e.touches[0];
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
      const rawVal = min + pct * (max - min);
      value = Math.round(rawVal / step) * step;
      value = Math.max(min, Math.min(max, value));
      updateVisuals(value);
      sliderEl.dataset.value = String(value);
    }, { passive: true });

    document.addEventListener('touchend', () => { dragging = false; });

    // Keyboard
    thumb.addEventListener('keydown', (e) => {
      let newVal = value;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') newVal = Math.min(max, value + step);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') newVal = Math.max(min, value - step);
      else if (e.key === 'Home') newVal = min;
      else if (e.key === 'End') newVal = max;
      else return;

      e.preventDefault();
      value = newVal;
      updateVisuals(value);
      sliderEl.dataset.value = String(value);
      sliderEl.dispatchEvent(new CustomEvent('ov:change', { bubbles: true, detail: { value } }));
    });
  },

  getValue(sliderEl) {
    return parseFloat(sliderEl.dataset.value || '0');
  },

  setValue(sliderEl, value) {
    sliderEl.dataset.value = String(value);
    const min = parseFloat(sliderEl.dataset.min || '0');
    const max = parseFloat(sliderEl.dataset.max || '100');
    const thumb = sliderEl.querySelector('.ov-slider-thumb');
    const range = sliderEl.querySelector('.ov-slider-range');
    const pct = ((value - min) / (max - min)) * 100;
    if (thumb) {
      thumb.style.left = `${pct}%`;
      thumb.setAttribute('aria-valuenow', String(value));
    }
    if (range) range.style.width = `${pct}%`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OvSlider.init();
});

if (typeof window !== 'undefined') {
  window.OvSlider = OvSlider;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvSlider };
}
