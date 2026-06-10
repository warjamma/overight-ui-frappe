/**
 * OV UI Theme Adapter & Bridge
 * Shifted to pure CSS native style mapping to ensure 100% stability,
 * eliminating the heavy MutationObserver cycles and runtime browser hangs.
 */

(function () {
    // Runtime config preservation for compatibility
    window.OvThemeConfig = {
        active: true,
        primaryButtonVariant: 'orange',
        secondaryButtonVariant: 'white',
        buttonSize: 'sm',
        inputStyle: true,
        checkboxStyle: true,
        selectStyle: true,
        
        refresh() {
            if (window.OvSelect && typeof window.OvSelect.init === 'function') {
                window.OvSelect.init(document);
            }
        }
    };

    // Run initially for select elements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.OvThemeConfig.selectStyle && window.OvSelect && typeof window.OvSelect.init === 'function') {
                window.OvSelect.init(document);
            }
        });
    } else {
        if (window.OvThemeConfig.selectStyle && window.OvSelect && typeof window.OvSelect.init === 'function') {
            window.OvSelect.init(document);
        }
    }

    // Listen to route changes in Frappe Desk
    $(document).on('page-change', () => {
        if (window.OvThemeConfig.selectStyle && window.OvSelect && typeof window.OvSelect.init === 'function') {
            window.OvSelect.init(document);
        }
    });

    // Monitor dynamic nodes (highly targeted only to select tags to prevent infinite loops)
    const observer = new MutationObserver((mutations) => {
        if (!window.OvThemeConfig || !window.OvThemeConfig.active || !window.OvThemeConfig.selectStyle) return;
        
        let shouldInit = false;
        for (let i = 0; i < mutations.length; i++) {
            const addedNodes = mutations[i].addedNodes;
            for (let j = 0; j < addedNodes.length; j++) {
                const node = addedNodes[j];
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'SELECT' || node.querySelector('select')) {
                        shouldInit = true;
                        break;
                    }
                }
            }
            if (shouldInit) break;
        }
        
        if (shouldInit) {
            observer.disconnect();
            if (window.OvSelect && typeof window.OvSelect.init === 'function') {
                window.OvSelect.init(document);
            }
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
