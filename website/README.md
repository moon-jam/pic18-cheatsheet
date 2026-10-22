# Qwik City App ⚡️

- [Qwik Docs](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.dev/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `pnpm qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.dev/qwikcity/guides/static-site-generation/).

```shell
pnpm qwik add # or `pnpm qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `pnpm start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
pnpm preview # or `pnpm preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
pnpm build # or `pnpm build`
```

## Static Site Generator (Node.js)

Be sure to configure your server to serve very long cache headers for the `build/**/*.js` files.

Typically you'd set the `Cache-Control` header for those files to `public, max-age=31536000, immutable`.

```shell
pnpm build.server
```

## Offline browsing

The generated site has no required external assets or backend. After installing
dependencies and building while online, keep the complete `dist` directory:

```shell
pnpm build
pnpm purify
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4173/`. All cheatsheet pages can then be browsed without an
internet connection. Official documentation and GitHub links still require one.
The hosted site has no service worker or complete offline cache; visiting it once
does not guarantee that every page will be available after disconnecting.

## Complete print / PDF reference

Choose **Print / PDF** on the homepage, then use the browser's Print command
(Ctrl+P or Cmd+P) to print or save as PDF. The `/print/` page starts with the
homepage index and includes every instruction, register, and documented assembler
directive. Index links jump to the corresponding details; **Back to index**
returns to the same index entry. These internal links are retained when saved as
PDF, so the complete file can be browsed offline.

Print styles use a white background, page numbers, wrapped examples, and repeated
table headers. A4 is the default; Letter can be selected in the print dialog.
Use the default scale and turn off the browser's headers and footers. External
Microchip source links still require an internet connection.

## Search

Search on the homepage or in the sidebar filters names, operands, addresses,
and descriptions immediately. Matching text is highlighted with a subtle orange
background. Multiple words must all match. Clear the field or
press Escape to restore the full list. Search uses the entries already in the
page and works offline with the complete static build.

The homepage remembers its search and scroll position for the current browser
tab. Returning through the homepage link or the browser's Back button restores
that view. Explicit links to a homepage section still jump to that section.

After building and purifying, run `pnpm test:reference` to check the published
search enhancement, matching behavior, and complete print view.
