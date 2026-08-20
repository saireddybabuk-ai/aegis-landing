# Smart Security Detective Services — Website

React + Vite + Framer Motion. Light theme, real photography, scroll-driven motion.

```
aegis-landing/
├── .github/workflows/deploy.yml   ← builds and publishes on every push
├── aegis.html                     ← entry file (never appears in your URL)
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    └── SmartSecurity.jsx          ← the whole site
```

---

## Updating your live GitHub site

Your repo currently has the old `src/AegisLanding.jsx`. Three changes on
github.com, no local setup:

**1. Add the new component**

**Add file → Upload files**, drag in `src/SmartSecurity.jsx`. It must land inside
the `src` folder — click into `src` first, then Upload files. Commit.

**2. Point the app at it**

Open `src/main.jsx` → pencil icon → replace the contents with:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import SmartSecurity from "./SmartSecurity.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SmartSecurity />
  </React.StrictMode>
);
```

Commit.

**3. Replace the page metadata**

Open `aegis.html` → pencil → paste in the new version from this download. It sets
the browser tab title, the Google description, and business schema for search
results. Commit.

**4. Delete the old file**

Open `src/AegisLanding.jsx` → the **⋯** menu top-right → **Delete file** → commit.
The build fails if this is left behind and still imported anywhere.

The Actions tab rebuilds automatically after the last commit. Give it 90 seconds.

> **Simpler alternative:** delete the repository and re-upload everything from
> this download, then redo Pages → Source → GitHub Actions. Faster if the steps
> above go wrong, but you lose the commit history.

---

## Your details — all in one place

Everything about the business sits in the `BRAND` object at the very top of
`src/SmartSecurity.jsx`:

```js
const BRAND = {
  phone: "+91 99728 10990",       // used everywhere on the site
  email: "info@smartsecuritydetectiveservices.in",
  founder: { name: "Shantha Rao Gujju", ... },
  address: { ... },
};
```

Change it there and it updates in the header, hero, contact section, footer,
floating call button, and the Google Map — all at once.

---

## Editing content

| To change | Edit this in `src/SmartSecurity.jsx` |
|---|---|
| Phone, email, address, WhatsApp | `BRAND` |
| The four big numbers | `STATS` |
| Deter / Detect / Respond panels | `PILLARS` |
| The animated 15-minute timeline | `TIMELINE` |
| The eight service cards | `SERVICES` |
| Detective case types | `CASES` |
| How-we-work steps | `PROCESS` |
| Scrolling industries band | `SECTORS` |
| Photo strip | `GALLERY` |
| Founder message | `FOUNDER_WORDS` |
| Founder's four commitments | `COMMITMENTS` |
| Licence badges under the hero | `CREDENTIALS` |
| Colours | `.ss-root` variables in the CSS block at the bottom |

### The founder section

`FOUNDER_WORDS` holds three first-person paragraphs. They describe how the firm
operates and what it commits to — deliberately, rather than making claims about
past experience, because those should be in your own words. Rewrite them freely.

`COMMITMENTS` holds the four promises shown beside the message.

**To add a photo of Mr Gujju:** create a `public/photos/` folder in the repo,
upload the image, then in `BRAND.founder` change `photo: null` to
`photo: "/photos/founder.jpg"`. Until then a monogram card shows instead — which
looks deliberate, not broken. A portrait-orientation photo works best.

### The logo

The seal is drawn as SVG inside the `SealLogo` component, so it stays sharp at
every size and loads instantly. The navigation and footer use
`withText={false}`, which drops the circular lettering that would be unreadable
at 42px. The full seal appears beside the founder portrait.

To adjust the gold, edit the two `linearGradient` blocks in that component.

### One thing to check

The `STATS` figures are conservative and checkable — 24/7, 8 services, 100%
police-verified, established 2026. If you want to show roster size or number of
sites once you have them, put your real numbers there.

---

## Photographs

The site currently uses free Unsplash stock photos (commercial use permitted, no
attribution required). They are defined in the `PHOTO` object near the top.

**Photos of your own guards, uniforms, vehicles and control room will convert far
better than stock.** When you have them:

1. Create a `public/photos/` folder in the repo and upload your images there
2. In `PHOTO`, replace `img("1485230405346-...")` with `"/photos/your-file.jpg"`

Landscape shots around 1200px wide, under 300KB each, keep the site fast.

---

## Making the enquiry form send

Right now the form validates and confirms on screen, but nothing is emailed. The
phone number, WhatsApp button and email link all work — most enquiries will come
through those.

To make the form deliver, sign up at **formspree.io**, create a form, and change
the `submit()` function inside the `Contact` component to POST the `form` state
to your endpoint. It is the only place that needs changing.

---

## Running it locally (optional)

Needs Node.js 18+. Keep this project in its own empty folder.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run preview    # http://localhost:4173
```

---

## Troubleshooting

**Build fails after the update** — the old `src/AegisLanding.jsx` is probably
still there, or `main.jsx` still imports it. Check step 4 above.

**Blank page after deploy** — confirm **Settings → Pages → Source** is set to
**GitHub Actions**, not "Deploy from a branch".

**Photos don't appear** — an ad-blocker or network filter is blocking
`images.unsplash.com`. Uploading your own photos removes this dependency entirely.

**Map doesn't load** — some corporate networks block Google Maps embeds. It will
work for normal visitors.

**Animations don't run** — "Reduce motion" is on in your OS accessibility
settings. The site deliberately respects that.

---

## What's animated

- Hero headline reveals line by line from behind a mask
- Hero photos drift at different speeds as you scroll, with a scanning sweep
- Stat numbers count up when they enter view
- Deter / Detect / Respond icons draw themselves stroke by stroke
- The 15-minute response timeline fills and lights up each stage as you scroll
- Service cards lift and their photos zoom on hover
- The how-we-work rail draws downward on scroll
- Industries band scrolls continuously
- Gallery photos move at opposing parallax speeds
- Call buttons pull gently toward the cursor
- Progress bar across the top

All of it is disabled automatically for visitors who have reduced motion enabled.
