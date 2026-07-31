# Aegis Protective Group — Landing Page

Dark-theme security agency landing page. React + Vite + Framer Motion.

**No `index.html` in this project.** The entry file is `aegis.html`, so this
folder can sit beside another project without a filename clash. Vite handles
both ends: the dev server serves `aegis.html` at the root URL, and the build
renames the output to `index.html` inside `dist/` so hosts can find it.

**Nothing to configure for GitHub Pages.** The base path is worked out
automatically from the repo name at build time. There is no line to uncomment
and no line to remember to put back.

```
aegis-landing/
├── .github/workflows/deploy.yml   ← builds and publishes on every push
├── aegis.html                     ← entry (not index.html)
├── vite.config.js
├── package.json
├── START-HERE.bat                 ← Windows local launcher (optional)
└── src/
    ├── main.jsx
    └── AegisLanding.jsx
```

---

# Option A — Do everything in GitHub (no local setup)

Recommended if you don't want to install Node or risk touching another project.
GitHub builds the site for you on its own servers.

### 1. Create the repository

On github.com click **New repository**.

- Name: `aegis-landing`
- **Public** — Pages needs this on the free plan
- Do **not** tick "Add a README" — an empty repo makes the upload cleaner

### 2. Upload the files

On the empty repo page, click **uploading an existing file**.

Unzip the download first, then drag the **contents** of the `aegis-landing`
folder into the browser — the files themselves, not the folder wrapping them.

Commit at the bottom of the page.

**If `.github` doesn't upload** — Windows sometimes hides folders beginning with
a dot, and drag-and-drop can skip them. Create it by hand instead:

1. **Add file → Create new file**
2. In the filename box type: `.github/workflows/deploy.yml`
   (typing the slashes creates the folders)
3. Paste the contents of `deploy.yml` from the download
4. Commit

### 3. Turn on Pages

**Settings → Pages → Build and deployment → Source**, choose
**GitHub Actions**. Not "Deploy from a branch" — Actions.

### 4. Watch it build

Open the **Actions** tab. A run called *Deploy to GitHub Pages* starts on its
own. It takes about a minute. Green tick means done, and the URL appears in the
`deploy` step:

```
https://saireddybabuk-ai.github.io/aegis-landing/
```

From then on, every edit you commit rebuilds and republishes automatically.

### 5. Editing afterwards

Click any file in GitHub, hit the pencil icon, edit, commit. The site rebuilds.

For anything more than a one-line change, press **`.`** (full stop) while
viewing the repo. That opens github.dev, a full VS Code editor in your browser,
with no install. Edit, then commit from the Source Control panel on the left.

To actually run and preview it in the browser, use **Code → Codespaces → Create
codespace on main**, then run `npm install` and `npm run dev` in its terminal.
Free tier covers roughly 60 hours a month.

---

# Option B — Run it locally

Only if you want to. It needs Node.js 18+ from nodejs.org.

**Put this project in its own empty folder.** Never merge it into an existing
one — two Vite projects in a single directory will fight over `package.json`,
`node_modules` and the build output.

**Windows:** double-click `START-HERE.bat`. It pins the working directory to
its own location, checks Node, installs on first run, and starts the server.

Or manually:

```bash
npm install
npm run dev        # http://localhost:5173
```

Check the production build too, since dev and production differ:

```bash
npm run build
npm run preview    # http://localhost:4173
```

**What to look for:** hero animation runs, stat counters count up on scroll,
the timeline rail fills as you scroll the process section, the marquee loops,
and the mobile menu works when you narrow the window.

---

# Other hosts

Neither needs any config change — the base path resolves to `/` off Actions.

- **Vercel:** vercel.com → Add New → Project → import the repo. Preset **Vite**,
  build `npm run build`, output `dist`.
- **Netlify:** app.netlify.com → Import an existing project. Build
  `npm run build`, publish directory `dist`.

---

# Editing the content

Everything sits at the top of `src/AegisLanding.jsx`:

| What | Where |
|---|---|
| Services | `SERVICES` array |
| Process steps | `PROCESS` array |
| Industries marquee | `SECTORS` array |
| Testimonials | `TESTIMONIALS` array |
| Stat counters | `STATS` array |
| Colours | `.ag-root` CSS variables near the bottom |
| Fonts | the `@import` line at the top of the CSS block |

Phone, email and address are in the `Contact` and `Nav` components.
Page title and meta description are in `aegis.html`.

---

# Making the contact form send

It validates and confirms, but sends nothing yet. The `submit()` function in the
`Contact` component is the only place to change.

- **Formspree** — create a form, POST the `form` state to your endpoint.
- **Your own API** — `fetch("/api/contact", { method: "POST", body: JSON.stringify(form) })`

Netlify Forms won't work without switching to a real `<form>` element.

---

# Troubleshooting

### `npm error Missing script: "dev"`

npm found a `package.json`, but not this one — you're in another project's
folder. (If none existed at all, npm would throw `ENOENT` instead.)

```bash
npm run     # lists the scripts npm actually found
cd          # prints the current folder
dir
```

You should see `package.json`, `aegis.html`, `vite.config.js` and `src` side by
side. Two usual causes: extracted into an existing project, or Windows
double-nested it as `aegis-landing\aegis-landing` — in which case `cd` in once
more.

### Deployed page is blank

Open DevTools → Console. 404s on the `.js` file mean the base path is wrong.
Check that Pages **Source** is set to **GitHub Actions**, not "Deploy from a
branch" — that mismatch is the common cause now that the path is automatic.

### Custom domain added, site breaks

Add a repository variable `CUSTOM_DOMAIN` set to `true`
(**Settings → Secrets and variables → Actions → Variables**), then re-run the
workflow. Assets will then be served from the domain root.

### Animations don't run

Check whether "Reduce motion" is on in your OS accessibility settings. The page
deliberately honours it via `<MotionConfig reducedMotion="user">`.

---

# Using Next.js instead

Copy `src/AegisLanding.jsx` into your app and add `"use client"` as the very
first line. Framer Motion needs the client boundary. Drop `aegis.html` and
`vite.config.js`.
