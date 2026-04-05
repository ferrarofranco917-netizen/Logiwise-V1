# HOTFIX STEP W — i18n load fallback

- added inline fallback bootstrap for `window.KedrixOneI18N`
- added cache-busting query strings for `style.css`, `js/i18n.js`, and `js/app.js`
- hardened `js/app.js` initialization so the app does not crash if the full i18n asset fails temporarily
- bumped service worker cache key for safer refresh cycles
