# Agent guide — portfolio website

This document helps coding agents work effectively in this repository.
Agents must follow the conventions and workflows defined in this file when making changes. 

## What this is

A single-page style personal portfolio built with **React 18** and **Vite 5**. It is deployed to **GitHub Pages** at `https://ishayu1.github.io/portfolio_website/` (see `package.json` `homepage`).

## Tech stack

| Area | Choice |
|------|--------|
| UI | React (JSX), **Tailwind CSS** |
| Motion | **Framer Motion** (`motion.*`, `whileInView`, variants) |
| Icons | **react-icons** (e.g. `react-icons/fa`) |
| Routing | **react-router-dom v6** with **`HashRouter`** |
| Build | Vite + `@vitejs/plugin-react` |
| Lint | ESLint 9 flat config (`eslint.config.js`) |

## Commands

From the repo root:

- **Dev server:** `npm run dev`
- **Production build:** `npm run build` (output: `dist/`)
- **Preview build:** `npm run preview`
- **Lint:** `npm run lint`
- **Deploy to GitHub Pages:** `npm run deploy` (uses `gh-pages`, runs `predeploy` → build first)

## Agent workflow for implementing issues

When implementing a task or issue, follow this workflow:

1. **Create a new branch from `main`**

   ```bash
   git checkout main
   git pull
   git checkout -b feature/<short-description>
   ```

2. **Implement** the requested changes in the appropriate files.

3. **Run lint**

   ```bash
   npm run lint
   ```

4. **Build** the project to ensure it compiles

   ```bash
   npm run build
   ```

5. **Commit** changes

   ```bash
   git add .
   git commit -m "Implement <feature description>"
   ```

6. **Push** the branch

   ```bash
   git push origin feature/<short-description>
   ```

7. **Open a pull request** (requires [GitHub CLI](https://cli.github.com/) `gh`, logged in)

   ```bash
   gh pr create --base main --head feature/<short-description> --fill
   ```

Replace `<short-description>` and `<feature description>` with a concise, accurate summary of the work.

## Repository layout

```
src/
  main.jsx          # Entry: StrictMode, global CSS import, mount App
  App.jsx           # HashRouter, layout shell, routes
  index.css         # Tailwind directives + global styles
  constants/
    index.js        # Copy + structured data (hero, about text, experiences, projects, contact)
  components/       # One component per file, default export
  assets/           # Images (e.g. assets/projects/* for project thumbnails)
index.html
vite.config.js
tailwind.config.js
postcss.config.js
```

## Routing and deployment constraints

- **`HashRouter`** is used so client-side routes work on GitHub Pages without server rewrite rules. Paths look like `/#/` and `/#/CounterGame`.
- **`vite.config.js`** sets `base: "/portfolio_website/"`. This must stay aligned with the GitHub repo name / `homepage` path. Local `npm run dev` still works; asset URLs are built with this base for production.

## App structure (`App.jsx`)

- **Global shell:** Dark neutral background (`neutral-950`), radial gradient overlay, `container mx-auto px-8`, `NavBar` on every route.
- **Route `/`:** `Hero` → `Experiences` → `Projects` → `Technologies`, plus a `Link` to `/CounterGame`.
- **Route `/CounterGame`:** Renders `CounterGame` only (still inside the same shell / `NavBar`).

### Navigation and in-page sections

- **`NavBar`** is **`sticky top-0 z-50`** (same spacing **`mt-4 sm:mt-6 md:mt-8`**—no extra chrome). While the window **`scroll`** fires, the bar **`translate-y` / `opacity`** hides; after **`~220ms`** idle it shows again. Near the top (**`scrollY < 8`**) it stays visible. **Mobile menu open:** bar stays visible. **`MainApp`** uses **`overflow-x-clip`** for sticky. Sections use **`scroll-mt-*`** for in-page targets.
- **`NavBar`** is **responsive**: from the **`md` breakpoint (768px)** up, it matches the horizontal layout (brand + section links + **Contact** + social icons). Below **`md`**, the hamburger reveals an **inline dropdown** in normal document flow (not a full-screen overlay): it sits **under the top row**, separated by **`border-neutral-900`**, with the same **neutral / cyan** treatment and a **subtle violet radial** wash matching `App.jsx`—**no modal backdrop**. **`FaBars`** / **`FaTimes`** toggle; **Escape**, **click outside** the `<nav>`, and route changes close the menu.
- On **`/contact`**, the bar is **home-only**: **IG** and **social icons** only (no section links, no **Contact** link, no hamburger; socials stay visible on narrow viewports).
- **IG** links to `/` and runs **`smoothScrollToTop`** (`src/utils/smoothScroll.js`): on **`/`** it scrolls the window to the top; from other routes it **`navigate("/")`** then scrolls to top after paint. Section links **Experiences**, **Projects**, **Technologies** use **`smoothScrollToElement`** on the home route. From other routes, section links **`navigate("/", { state: { scrollTo: id } })`** and **`HomeScrollToSection`** in `App.jsx` scroll after the home view mounts.
- Sections expose ids: `#hero`, `#experiences`, `#projects`, `#technologies` on the corresponding components.

## Content and data

- **Editable copy and lists** live in `src/constants/index.js`: `HERO_CONTENT`, `ABOUT_TEXT`, `EXPERIENCES`, `PROJECTS`, `CONTACT`.
- **New project thumbnails:** Add files under `src/assets/projects/`, import them at the top of `constants/index.js`, and reference the imported binding in `PROJECTS[].image`.
- Components import constants with paths like `from "../constants"` (index resolves automatically).

## UI conventions

- Prefer **Tailwind** utility classes; palette leans **neutral** grays with **cyan** accents (`text-cyan-400`, `selection:bg-cyan-300`, etc.).
- Section separation often uses `border-b border-neutral-900`.
- Scroll-triggered sections use Framer Motion **`whileInView`** with `viewport={{ once: true }}` for enter animations.
- **Contact** (`Contact.jsx`, route `/contact`): **`contact-wrapper`** defines **`auto` / `1fr`** columns; **`.contact-blurb`** sits in **column 2** with the fields. **`contact-form`** spans both columns and uses **`grid-template-columns: subgrid`** so labels and **Submit** share the same column tracks. **`gap: 1em`** between rows; **`font: inherit`** + **`box-sizing: border-box`** on **`input`** and **`textarea`**.

## Conventions for changes

- Match existing **import style** (e.g. default component imports, relative paths from `components/`).
- Keep **scope focused**; this is a small app—avoid large refactors unless requested.
- For changes intended to ship via PR, follow **[Agent workflow for implementing issues](#agent-workflow-for-implementing-issues)** (lint + build before commit).
- If adding routes, use **`Link`** / **`Route`** consistent with `HashRouter` and existing path strings (e.g. `/CounterGame`).

## Known quirks (useful for agents)

- **`About` is not mounted** in `App.jsx`. The component still exists in `src/components/About.jsx` if you want an About section on the home route.
- **`package.json` includes a dependency `"i"`** that appears unrelated to the app; treat as suspicious if auditing dependencies.

## Files agents touch most often

| Task | Primary files |
|------|----------------|
| Hero / headline copy | `constants/index.js`, `Hero.jsx` |
| Work history | `constants/index.js` (`EXPERIENCES`), `Experiences.jsx` |
| Project cards | `constants/index.js` (`PROJECTS`), `Projects.jsx`, `assets/projects/*` |
| Tech stack section | `Technologies.jsx`, any constants if added |
| New page / game | `App.jsx` (`Routes`), new component under `components/` |
| Contact form (Lab 2 grid / subgrid) | `Contact.jsx`, `index.css` (`.contact-form`) |
| Deploy / base URL | `vite.config.js`, `package.json` `homepage` |


