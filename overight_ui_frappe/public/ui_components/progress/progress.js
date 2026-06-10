/**
 * OV Progress Web Component
 * Chuyển đổi từ progress.tsx (Radix UI Progress)
 *
 * Usage HTML:
 *   <div class="ov-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="30">
 *     <div class="ov-progress-indicator"></div>
 *   </div>
 *
 * JS Usage:
 *   OvProgress.setValue(el, 75);   // set to 75%
 *   OvProgress.getValue(el);       // returns number 0-100
 */

const OvProgress = {
  setValue(progressEl, value) {
    const clamped = Math.max(0, Math.min(100, value));
    const indicator = progressEl.querySelector('.ov-progress-indicator');
    if (indicator) {
      indicator.style.transform = `translateX(-${100 - clamped}%)`;
    }
    progressEl.setAttribute('aria-valuenow', String(clamped));
    progressEl.dataset.value = String(clamped);
  },

  getValue(progressEl) {
    return parseFloat(progressEl.getAttribute('aria-valuenow') || '0');
  },

  /**
   * Animate progress from current to target value
   */
  animateTo(progressEl, targetValue, duration = 500) {
    const start = this.getValue(progressEl);
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (targetValue - start) * eased;
      this.setValue(progressEl, current);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
};

if (typeof window !== 'undefined') {
  window.OvProgress = OvProgress;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvProgress };
}
