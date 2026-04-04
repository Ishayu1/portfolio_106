# Skills — implementing new features

Use this checklist when adding or changing product behavior. For stack details, file layout, and deployment rules, read **`AGENTS.md`** first.

**Every new feature must be responsive** from narrow phones through large desktops. See **[Responsive design (required)](#responsive-design-required)** below.

## Before you code

1. Confirm the feature scope (what ships on `/`, new route, constants-only change, etc.).
2. Identify files using the “Files agents touch most often” table in `AGENTS.md`.
3. Plan layout for **small viewports first**, then layer **`sm:` / `md:` / `lg:` / `xl:`** as needed (mobile-first Tailwind).
4. Start from an up-to-date **`main`** and use a **feature branch** (never commit directly to `main` for feature work).

## Git workflow (required)

Run from the repository root. Replace placeholders with a short, accurate slug and message.

```bash
git checkout main
git pull
git checkout -b feature/<short-description>
```

After implementing:

```bash
npm run lint
npm run build
git add .
git commit -m "Implement <feature description>"
git push -u origin feature/<short-description>
```

Open a pull request (requires [GitHub CLI](https://cli.github.com/) authenticated to this repo):

```bash
gh pr create --base main --head feature/<short-description> --fill
```

If `gh` is unavailable, push the branch and open a PR manually in the GitHub UI against **`main`**.

## Publish to GitHub Pages (after the feature is on `main`)

Pushing to **`main`** does **not** update the live site by itself. This repo publishes the **built** app from **`dist/`** to the **`gh-pages`** branch via the **`gh-pages`** package (`package.json` → `deploy`).

After the PR is **merged** (or your changes are otherwise on **`main`**):

```bash
git checkout main
git pull origin main
npm ci
npm run build
npm run deploy
```

- **`npm run build`** — confirms the production bundle succeeds before publish (same as CI-style gate).
- **`npm run deploy`** — runs **`predeploy`** (which runs **`npm run build`** again), then pushes **`dist/`** to **`gh-pages`**. GitHub Pages then serves the new build (usually within a minute or two).

**Requirements:** Node dependencies installed, **git** with permission to push to this repo, and typically **HTTPS auth** or **SSH** to GitHub so `gh-pages` can update the remote branch. If deploy fails with a permissions error, sign in to GitHub CLI (`gh auth login`) or configure SSH keys.

For day-to-day workflow: **feature branch → PR → merge to `main` → pull `main` locally → `npm run build` → `npm run deploy`**.

## Responsive design (required)

New UI must work at **all common widths** without horizontal overflow, clipped text, or controls that are unusable on touch.

### Tailwind breakpoints (default)

| Prefix | Min width | Typical use |
|--------|-----------|----------------|
| *(none)* | 0 | Base styles — phones, default layout |
| `sm:` | 640px | Larger phones, small tablets |
| `md:` | 768px | Tablets, small laptops |
| `lg:` | 1024px | Desktop — side-by-side sections, nav density |
| `xl:` | 1280px | Wide desktop — max widths, large type |

Prefer **mobile-first** classes: set the default for small screens, then override with `sm:`, `md:`, `lg:` as the layout grows.

### Layout and spacing

- Use **fluid spacing**: e.g. `px-4 sm:px-6 lg:px-8`, `gap-4 md:gap-8`, not fixed large padding on mobile.
- Constrain wide content with **`max-w-*`** and **`min-w-0`** on flex/grid children so text wraps instead of forcing overflow.
- Replace **`position: absolute`** footers or overlays that can cover content on small screens with **normal flow** or responsive positioning unless the issue requires otherwise.
- Images: **`max-w-full h-auto`**, optional **`object-cover`**, and sensible **`max-w-*`** so they scale down on narrow viewports.

### Typography and touch targets

- Scale headings and key UI copy: e.g. `text-2xl sm:text-3xl md:text-4xl` instead of a single huge size everywhere.
- Avoid **`whitespace-nowrap`** on long titles unless you also allow wrap on small screens (`whitespace-normal sm:whitespace-nowrap`).
- Buttons and links: ensure adequate **tap size** and stacking (`flex-col sm:flex-row`, full-width buttons on mobile when helpful).

### Framer Motion

- **Resting state** on full-width columns should use **`x: 0` / `y: 0`** (no permanent translate that mimics misalignment on mobile).
- Prefer subtle **`initial`** values; heavy offsets can fight centered mobile layouts.

### Verify before merge

Manually check (or use devtools device mode) at least:

- **~375px** width (small phone)
- **768px** (tablet)
- **1024px+** (desktop)

Confirm: no horizontal scroll, readable text, interactive elements reachable, and section order still makes sense.

## Feature patterns (this repo)

### New home-page section

1. Add a component under `src/components/<Name>.jsx` (default export, match existing JSX + Tailwind style).
2. Import it in `src/App.jsx` and render it in the `/` route fragment in the order you want (see `AGENTS.md` for current order).
3. Apply **[Responsive design (required)](#responsive-design-required)** — responsive spacing, type, stacking vs row layout at `lg:` where appropriate.
4. Prefer **Framer Motion** `whileInView` with `viewport={{ once: true }}` if other sections animate on scroll.

### New route (e.g. mini-app or page)

1. Add a `Route` in `src/App.jsx` next to `/CounterGame`.
2. Use **`Link`** for navigation; paths must work with **`HashRouter`** (e.g. `/MyPage`, not hash literals in `to=`).
3. Keep the shared shell (`NavBar`, background) unless the issue says otherwise.
4. Treat forms, games, and dense UI as **responsive**: stack fields on small screens, limit `max-w-*` for readability, full-width primary actions on mobile if needed.

### New project card

1. Add image under `src/assets/projects/`.
2. Import the asset in `src/constants/index.js` and append an object to **`PROJECTS`** (title, image, description, technologies, optional `link`).
3. In **`Projects.jsx`**, keep thumbnails **responsive** (`max-w-full`, bounded `max-w-*`, `h-auto`) so cards do not overflow on small screens.

### Copy / data only

1. Edit `src/constants/index.js` (`HERO_CONTENT`, `EXPERIENCES`, `PROJECTS`, etc.).
2. No new component needed unless layout must change.

### Styling and motion

- Use **Tailwind** utilities; keep the neutral + cyan palette unless the issue specifies otherwise.
- Avoid leaving **permanent** `x` / `y` offsets in `whileInView` or `animate` final states on full-width mobile columns (use **`x: 0` / `y: 0`** at rest).

## Quality gate (before push)

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] **Responsive:** checked at **~375px**, **~768px**, and **desktop** — no horizontal overflow; type, spacing, and layout behave as intended (see [Responsive design (required)](#responsive-design-required))
- [ ] Commit message describes the user-visible change

## After merge

Merging to **`main`** updates source only. To refresh **https://ishayu1.github.io/portfolio_website/**, follow **[Publish to GitHub Pages (after the feature is on `main`)](#publish-to-github-pages-after-the-feature-is-on-main)** — run **`npm run build`** and **`npm run deploy`** from an up-to-date **`main`** checkout.
