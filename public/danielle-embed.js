/**
 * Danielle — CoachEasy AI Support Widget (Embed Loader)
 *
 * This is a placeholder / loader script for the coacheasy.com embed.
 *
 * To generate the production bundle:
 *   Option A (esbuild — recommended):
 *     npx esbuild components/DanielleWidget.tsx --bundle \
 *       --outfile=public/danielle-embed.js \
 *       --define:process.env.NODE_ENV=\"production\" \
 *       --format=iife --global-name=DanielleWidget \
 *       --external:react --external:react-dom
 *     Then include React + ReactDOM on the host page, or bundle them in.
 *
 *   Option B (Next.js build):
 *     npx next build && npx next export
 *     Reference the compiled chunk from the _next/static output.
 *
 * Usage on coacheasy.com:
 *   <script src="https://[your-domain]/danielle-embed.js" defer></script>
 *   <div id="danielle-widget"></div>
 *
 * The bundled script will auto-initialize by calling:
 *   DanielleWidget.initDanielle()
 */

(function () {
  // Auto-init when the DOM is ready
  if (typeof window !== "undefined" && typeof window.DanielleWidget !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        window.DanielleWidget.initDanielle();
      });
    } else {
      window.DanielleWidget.initDanielle();
    }
  }
})();
