// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

/**
 * Tiny synchronous script injected before the body renders. Reads the saved
 * theme (or falls back to system preference) and sets `data-theme` on the
 * <html> element BEFORE first paint — so dark-mode users never see a flash
 * of light content. Kept under 400 bytes minified to avoid measurably
 * blocking parse.
 */
const themeBootScript = `
(function(){try{
  var s=localStorage.getItem('fi-theme');
  var t=(s==='light'||s==='dark')?s
    :(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',t);
}catch(e){}})();
`.replace(/\s+/g, " ").trim();

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="h-full">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#0b0b0b" />
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          {/* eslint-disable-next-line solid/no-innerhtml */}
          <script innerHTML={themeBootScript} />
          {assets}
        </head>
        <body class="min-h-full bg-bg text-fg antialiased">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
