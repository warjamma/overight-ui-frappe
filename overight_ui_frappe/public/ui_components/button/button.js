/**
 * OV Button Web Component
 * Chuyển đổi từ button.tsx (Radix UI Button + cva variants)
 *
 * Usage:
 *   <ov-button variant="black" size="default">Click me</ov-button>
 *   <ov-button variant="orange" size="sm" full-width>Submit</ov-button>
 *   <ov-button variant="link">View details</ov-button>
 *
 * Attributes:
 *   variant: "black" | "white" | "orange" | "blue" | "red" | "ghost" | "link"  (default: "black")
 *   size:    "default" | "sm" | "lg" | "icon" | "icon-sm"                       (default: "default")
 *   full-width: (boolean attribute) — makes button full width
 *   disabled:   (boolean attribute) — disables button
 *   type:    "button" | "submit" | "reset"                                       (default: "button")
 *
 * Events:
 *   click  — standard DOM click event
 */
class OvButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'full-width', 'disabled', 'type'];
  }

  constructor() {
    super();
    this._button = null;
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    if (this._button) {
      this._updateAttributes();
    }
  }

  _render() {
    // Lấy nội dung slot ban đầu
    const slotContent = this.innerHTML;
    this.innerHTML = '';

    const shadow = this.attachShadow({ mode: 'open' });

    // Inject CSS link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = this._resolveCSSPath();
    shadow.appendChild(link);

    // Tạo button element
    this._button = document.createElement('button');
    this._button.innerHTML = slotContent || '<slot></slot>';

    // Nếu không dùng Shadow DOM slot thì dùng innerHTML trực tiếp
    const slot = document.createElement('slot');
    this._button.appendChild(slot);

    this._updateAttributes();
    shadow.appendChild(this._button);

    // Forward click event
    this._button.addEventListener('click', (e) => {
      if (!this.hasAttribute('disabled')) {
        this.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      }
    });
  }

  _updateAttributes() {
    const btn = this._button;
    if (!btn) return;

    const variant = this.getAttribute('variant') || 'black';
    const size = this.getAttribute('size') || 'default';
    const fullWidth = this.hasAttribute('full-width');
    const disabled = this.hasAttribute('disabled');
    const type = this.getAttribute('type') || 'button';

    // Reset classes
    btn.className = 'ov-button';
    btn.dataset.slot = 'button';

    // Apply variant
    btn.dataset.variant = variant;

    // Apply size
    btn.dataset.size = size;

    if (fullWidth) btn.dataset.fullWidth = 'true';
    else delete btn.dataset.fullWidth;

    btn.disabled = disabled;
    btn.type = type;

    // Apply inline styles từ variant + size
    this._applyVariantStyles(btn, variant, size, fullWidth);
  }

  _applyVariantStyles(btn, variant, size, fullWidth) {
    // Base styles
    btn.style.cssText = `
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 8px;
      border-width: 1.5px;
      border-style: solid;
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.5;
      transition: background-color 0.15s, border-color 0.15s, color 0.15s, text-decoration 0.15s;
      outline: none;
      user-select: none;
      cursor: pointer;
      text-decoration: none;
      box-sizing: border-box;
      font-family: inherit;
    `;

    if (btn.disabled) {
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.3';
    }

    // Variant colors
    const variants = {
      black: {
        borderColor: 'var(--ov-primary, #111827)',
        backgroundColor: 'var(--ov-primary, #111827)',
        color: 'var(--ov-primary-foreground, #ffffff)',
      },
      white: {
        borderColor: 'var(--ov-primary, #111827)',
        backgroundColor: 'var(--ov-background, #ffffff)',
        color: 'var(--ov-primary, #111827)',
      },
      orange: {
        borderColor: 'var(--ov-accent, #f85c1e)',
        backgroundColor: 'var(--ov-accent, #f85c1e)',
        color: 'var(--ov-accent-foreground, #ffffff)',
      },
      blue: {
        borderColor: 'transparent',
        backgroundColor: 'var(--ov-info, #3b82f6)',
        color: 'var(--ov-info-foreground, #ffffff)',
      },
      red: {
        borderColor: 'var(--ov-destructive, #ef4444)',
        backgroundColor: 'var(--ov-destructive, #ef4444)',
        color: 'var(--ov-destructive-foreground, #ffffff)',
      },
      ghost: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: 'var(--ov-foreground, #111827)',
      },
      link: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: 'var(--ov-accent, #f85c1e)',
        height: 'auto',
        padding: '0',
        textDecoration: 'none',
      },
    };

    const v = variants[variant] || variants.black;
    Object.assign(btn.style, v);

    // Size
    const sizes = {
      default: { height: '50px', paddingLeft: '24px', paddingRight: '24px' },
      sm: { height: '36px', paddingLeft: '16px', paddingRight: '16px', fontSize: '0.875rem' },
      lg: { height: '56px', paddingLeft: '32px', paddingRight: '32px' },
      icon: { width: '50px', height: '50px', padding: '0' },
      'icon-sm': { width: '36px', height: '36px', padding: '0' },
    };

    const s = sizes[size] || sizes.default;
    if (variant !== 'link') {
      Object.assign(btn.style, s);
    }

    if (fullWidth) {
      btn.style.width = '100%';
    }
  }

  _resolveCSSPath() {
    // Tìm đường dẫn CSS tương đối với script hiện tại
    const scripts = document.querySelectorAll('script[src*="button.js"]');
    if (scripts.length > 0) {
      const src = scripts[scripts.length - 1].src;
      return src.replace('button.js', 'button.css');
    }
    return '/assets/overight_ui_frappe/ui_components/button/button.css';
  }
}

// Đăng ký Web Component
if (!customElements.get('ov-button')) {
  customElements.define('ov-button', OvButton);
}

// Export cho module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OvButton };
}
