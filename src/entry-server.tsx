// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="h-full">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#0b0b0b" />
          <meta name="color-scheme" content="dark" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
