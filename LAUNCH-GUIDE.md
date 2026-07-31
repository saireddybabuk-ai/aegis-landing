# Launch Guide — Aegis Landing Page

From a zip file on your computer to a live website, entirely in your browser.
No Node.js, no terminal, no risk to any project already on your machine.

**Time:** about 10 minutes, most of it waiting for GitHub.

---

## Before you start

You need two things:

- A GitHub account (you have one: `saireddybabuk-ai`)
- The `aegis-landing.zip` file, unzipped

### Unzip it properly

Right-click the zip → **Extract All** → **Extract**.

Do **not** double-click the zip and drag files out of the preview window.
Windows lets you browse inside a zip without unpacking it, and files dragged
from that view often arrive incomplete. This is the single most common cause
of a broken upload.

After extracting, open the folder. You should see:

```
.github          (a folder — may look faded or be hidden, see Step 3)
src              (a folder)
aegis.html
package.json
vite.config.js
README.md
LAUNCH-GUIDE.md
START-HERE.bat
.gitignore
```

**If you see a single folder called `aegis-landing` instead** — Windows nested
it. Open that folder; the real files are inside. Work from there.

### Turn on hidden files

You'll need this in Step 3, so do it now.

In File Explorer: **View** → **Show** → tick **Hidden items**.
(On Windows 10: **View** tab → tick **Hidden items**.)

The `.github` and `.gitignore` entries should now be clearly visible. Files
starting with a dot are hidden by default on Windows, and this is why they
sometimes silently fail to upload.

---

## Step 1 — Create the repository

Go to **github.com** and sign in.

1. Click the **+** in the top-right corner → **New repository**
2. Fill it in:

| Field | Value | Why |
|---|---|---|
| Repository name | `aegis-landing` | Becomes part of your URL |
| Description | *(optional)* | — |
| Visibility | **Public** | GitHub Pages needs this on the free plan |
| Add a README file | **leave unticked** | An empty repo makes uploading cleaner |
| .gitignore | **None** | One is already included |
| License | **None** | — |

3. Click **Create repository**

**What you should see:** a mostly empty page headed "Quick setup — if you've
done this kind of thing before", with a grey box of git commands. Ignore the
commands.

> **Name it exactly `aegis-landing`.** The build reads the repository name to
> work out where your assets live. A different name still works — the code
> adapts automatically — but the guide's URLs won't match what you see.

---

## Step 2 — Upload the files

On that same page, find the line reading *"…or upload an existing file"* and
click **uploading an existing file**.

1. Open your extracted folder in File Explorer, in a window beside the browser
2. Press **Ctrl+A** to select everything
3. Drag the selection into the browser's dashed upload area

**Important:** drag the *contents* — the individual files and folders. Not the
`aegis-landing` folder itself. If you drag the wrapper folder, everything ends
up one level too deep and the build won't find `package.json`.

4. Wait for the file list to finish appearing
5. Scroll down, type a commit message like `Add Aegis landing page`
6. Click **Commit changes**

**What you should see:** the repository page now lists your files. Confirm that
`package.json`, `aegis.html`, `vite.config.js` and the `src` folder are all
there at the top level.

---

## Step 3 — Check the `.github` folder made it

This is the step that decides whether anything happens automatically.

Look at the file list. **Do you see a folder named `.github`?**

### If yes

Click into it. You should find `workflows` → `deploy.yml`. Skip ahead to Step 4.

### If no — create it by hand

Windows hides dot-folders, and drag-and-drop skips them often enough that this
is worth expecting rather than treating as a failure.

1. On the repo page click **Add file** → **Create new file**
2. In the filename box type exactly:

   ```
   .github/workflows/deploy.yml
   ```

   Type the slashes. GitHub converts each one into a folder as you type — you'll
   watch the breadcrumb build itself above the box.

3. Open `.github/workflows/deploy.yml` from your extracted folder in Notepad
4. Copy everything, paste it into the big editing box on GitHub
5. Scroll down, click **Commit new file**

**What you should see:** the repo now has a `.github` folder alongside `src`.

> **Why this file matters:** it tells GitHub to install Node, build the site on
> its own servers, and publish the result. Without it, GitHub just stores your
> source code and nothing is ever built.

---

## Step 4 — Switch Pages on

1. Click **Settings** (top of the repo, right-hand side)
2. In the left sidebar, click **Pages**
3. Under **Build and deployment**, find the **Source** dropdown
4. Change it from *Deploy from a branch* to **GitHub Actions**

There's no Save button — it applies immediately.

**What you should see:** the box changes to suggest workflows, and the "Deploy
from a branch" options disappear.

> **Get this one right.** *Deploy from a branch* publishes your raw source files,
> so visitors get a blank page — the browser can't run `.jsx` files directly.
> **GitHub Actions** runs the build first and publishes the finished result.
> Choosing the wrong option here is the most common reason a React site on Pages
> comes up blank.

---

## Step 5 — Watch the build

1. Click the **Actions** tab at the top of the repo

If a run is already going, you'll see **Deploy to GitHub Pages** with a spinning
amber dot. If the list is empty, the workflow arrived after your last commit —
click **Deploy to GitHub Pages** in the left sidebar, then **Run workflow** →
**Run workflow**.

2. Click the run to open it. Two jobs appear: **build**, then **deploy**
3. Click **build** to watch the steps tick off

Roughly 60–90 seconds. The `Install dependencies` step is the slow one.

**What you should see:** green ticks on both jobs. In the `deploy` job the URL
is printed:

```
https://saireddybabuk-ai.github.io/aegis-landing/
```

> **First deploy takes longer to go live.** The workflow may finish while the
> URL still shows 404 for another minute or two while GitHub's CDN catches up.
> Wait, then hard-refresh with **Ctrl+F5**.

---

## Step 6 — Open your site

Visit the URL from Step 5.

**Working correctly means:**

- Dark page, gold accents, the headline animating in line by line
- The console panel on the right showing a live UTC clock, seconds ticking
- Scroll down: the four stat numbers count up as they enter view
- Keep scrolling: a gold line draws itself down the process timeline
- The sectors band scrolls sideways continuously
- Narrow the window: layout collapses to one column, a hamburger menu appears

If all of that works, you're done.

---

## Making changes later

### Small edits

Click any file → pencil icon → edit → **Commit changes**. A new build starts
automatically; refresh in about 90 seconds.

The content lives at the top of `src/AegisLanding.jsx`:

| To change | Edit |
|---|---|
| Service cards | `SERVICES` array |
| Process steps | `PROCESS` array |
| Industries in the marquee | `SECTORS` array |
| Quotes | `TESTIMONIALS` array |
| The four numbers | `STATS` array |
| Colours | `.ag-root` variables near the bottom |
| Phone, email, address | `Contact` and `Nav` components |
| Browser tab title | `aegis.html` |

### Bigger edits

While viewing the repo, press **`.`** (the full-stop key). A complete VS Code
opens in your browser — no install. Edit, then use the Source Control panel on
the left to commit.

### Preview before committing

**Code** → **Codespaces** → **Create codespace on main**. In its terminal:

```bash
npm install
npm run dev
```

A "port 5173" popup appears — click **Open in Browser** for a live preview with
instant reload. Free tier covers around 60 hours a month. **Stop the codespace
when finished**, or idle time keeps counting.

---

## If something goes wrong

### The Actions tab is empty and no build ever runs

`.github/workflows/deploy.yml` didn't upload. Go back to **Step 3** and create
it manually.

### The build fails with a red X

Click the failed run, then the failed step, and read the last few lines.

- **`Cannot find module` or `ENOENT: package.json`** — files were uploaded
  inside a wrapper folder. Check that `package.json` sits at the top level of
  the repo, not inside `aegis-landing/`. If it's nested, delete the repo and
  redo Step 2, dragging the *contents*.
- **`Missing script: build`** — a wrong or partial `package.json`. Open it on
  GitHub; it should say `"name": "aegis-landing"` and list a `build` script.

### The page is blank and white

Press **F12** → **Console** tab.

- **404s on a `.js` file** — Pages Source is set to *Deploy from a branch*.
  Go back to **Step 4** and set it to **GitHub Actions**.
- **No errors, just empty** — the deploy is still propagating. Wait two minutes,
  then **Ctrl+F5**.

### 404 page instead of the site

Confirm the URL ends with a trailing slash:
`https://saireddybabuk-ai.github.io/aegis-landing/`

Then check **Settings → Pages** shows a green "Your site is live at…" banner.
If it doesn't, the deploy job hasn't finished successfully yet.

### Fonts look wrong, everything is plain

Google Fonts is being blocked, usually by an ad-blocker or a network filter.
The layout still works; only the typefaces fall back. Try another network or
disable the blocker for that page.

### Animations don't play

Check whether **Reduce motion** is enabled in your OS accessibility settings.
The page intentionally respects that setting.

---

## Adding your own domain later

1. **Settings → Pages → Custom domain**, enter your domain, **Save**
2. At your registrar, add the DNS records GitHub shows you
3. Wait for DNS to propagate, then tick **Enforce HTTPS**
4. **Settings → Secrets and variables → Actions → Variables → New variable**
   Name `CUSTOM_DOMAIN`, value `true`
5. **Actions → Deploy to GitHub Pages → Run workflow**

Step 4 matters. Pages serves a custom domain from the root, not from a
`/aegis-landing/` subfolder, and that variable tells the build to adjust. Skip
it and the site loads blank on the new domain.

---

## Quick reference

| | |
|---|---|
| Repo | `github.com/saireddybabuk-ai/aegis-landing` |
| Live URL | `saireddybabuk-ai.github.io/aegis-landing/` |
| Build logs | **Actions** tab |
| Pages settings | **Settings → Pages** |
| Browser editor | press **`.`** on the repo page |
| Build time | 60–90 seconds per commit |
