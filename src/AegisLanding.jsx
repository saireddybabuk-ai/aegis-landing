/**
 * AEGIS PROTECTIVE GROUP — Premium security agency landing page
 * ------------------------------------------------------------------
 * Single-file React component. Real Framer Motion.
 *
 * Install:
 *   npm i framer-motion
 *
 * Use:
 *   import AegisLanding from "./AegisLanding";
 *   export default function App() { return <AegisLanding />; }
 *
 * Styling is self-contained (injected <style> block, all classes prefixed
 * `ag-`), so it drops into Vite, CRA or Next.js ("use client") with no
 * Tailwind or CSS setup.
 *
 * SWAPPING THE MOTION LAYER
 *   Every animation is driven by the variants + helpers in the
 *   "MOTION LAYER" block below. Replace that block with CSS/IntersectionObserver
 *   equivalents and the markup underneath stays byte-for-byte identical.
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  MotionConfig,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  animate,
} from "framer-motion";

/* ==================================================================
   MOTION LAYER — all animation config lives here
   ================================================================== */

const EASE = [0.16, 1, 0.3, 1];

const stagger = (children = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: children, delayChildren: delay } },
});

const riseIn = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

const maskLine = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1, ease: EASE } },
};

const scaleLine = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: EASE } },
};

/** Shared viewport config so every section triggers at the same point. */
const VIEW = { once: true, margin: "-90px" };

/** Section wrapper: orchestrates staggered children on scroll. */
function Reveal({ children, className, gap = 0.08, delay = 0, as = "div", ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Cursor-following button. Falls back to a static button when motion is reduced. */
function Magnetic({ as = "button", className = "", children, strength = 0.28, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

  const onMove = useCallback(
    (e) => {
      if (reduce || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x.set((e.clientX - r.left - r.width / 2) * strength);
      y.set((e.clientY - r.top - r.height / 2) * strength);
    },
    [reduce, strength, x, y]
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const Tag = as === "a" ? motion.a : motion.button;
  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Counts up once, when scrolled into view. */
function Counter({ to, decimals = 0, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, VIEW);
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.7,
      ease: EASE,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ==================================================================
   CONTENT
   ================================================================== */

const SERVICES = [
  {
    id: "S-01",
    title: "Executive Protection",
    body:
      "Close protection details for principals, families and visiting delegations. Advance work, route planning and secure transport, staffed by officers with military or federal backgrounds.",
    tags: ["Advance teams", "Secure transport", "Residential posts"],
  },
  {
    id: "S-02",
    title: "Corporate Site Security",
    body:
      "Uniformed and plain-clothes officers for headquarters, campuses and data centres. Access control, lobby operations, patrols and incident reporting under written post orders.",
    tags: ["Access control", "Patrols", "Post orders"],
  },
  {
    id: "S-03",
    title: "Event & Venue Security",
    body:
      "Crowd management, credentialing, bag screening and stage-front control for audiences from 200 to 40,000. Licensed medics and evacuation planning included on request.",
    tags: ["Credentialing", "Screening", "Egress planning"],
  },
  {
    id: "S-04",
    title: "Remote Monitoring",
    body:
      "Live camera and alarm monitoring from our command centre, with voice-down intervention and verified dispatch. Averaged 4.2 minutes from alarm to officer on site last year.",
    tags: ["CCTV", "Voice-down", "Verified dispatch"],
  },
  {
    id: "S-05",
    title: "Risk & Threat Assessment",
    body:
      "Physical penetration testing, travel risk briefs and threat assessments on named individuals. Findings arrive as a ranked remediation plan, not a list of observations.",
    tags: ["Pen testing", "Travel briefs", "Remediation"],
  },
  {
    id: "S-06",
    title: "Cyber & Information Security",
    body:
      "Where physical and digital access meet: badge systems, IoT cameras, building management. We test the seams most security programmes leave unowned.",
    tags: ["Badge systems", "IoT audit", "Insider risk"],
  },
];

const PROCESS = [
  {
    n: "01",
    title: "Consult",
    body:
      "A duty officer takes the brief and walks your site or reviews your footprint. No proposal is written until we have seen the problem.",
    meta: "1–2 days",
  },
  {
    n: "02",
    title: "Assess",
    body:
      "We map exposure across access points, routines and people, then rank it by what an attacker would actually reach for first.",
    meta: "5–10 days",
  },
  {
    n: "03",
    title: "Deploy",
    body:
      "Officers are matched to the post, briefed on written orders and introduced to your team before their first shift, not on it.",
    meta: "2 weeks",
  },
  {
    n: "04",
    title: "Review",
    body:
      "Monthly incident reporting, quarterly posture review, and unannounced supervisor checks on every post we staff.",
    meta: "Ongoing",
  },
];

const SECTORS = [
  "Data centres",
  "Family offices",
  "Pharmaceutical",
  "Retail flagship",
  "Film production",
  "Diplomatic missions",
  "Logistics hubs",
  "Higher education",
  "Healthcare",
  "Live events",
  "Private aviation",
  "Fine art storage",
];

const TESTIMONIALS = [
  {
    quote:
      "We moved three sites to Aegis after a break-in the incumbent never reported. The difference showed up in the first month's paperwork, before it showed up anywhere else.",
    name: "Head of Corporate Security",
    org: "Pharmaceutical manufacturer, 4 sites",
  },
  {
    quote:
      "Their advance team found a service corridor our own walkthrough missed. That corridor is how someone would have got to the stage.",
    name: "Production Director",
    org: "Touring live events",
  },
  {
    quote:
      "The officers know our staff by name and our escalation policy by heart. That sounds small until the night it isn't.",
    name: "Facilities Lead",
    org: "Regional data centre operator",
  },
];

const STATS = [
  { to: 16, suffix: "", label: "Years operating", sub: "Founded 2009" },
  { to: 480, suffix: "+", label: "Officers on roster", sub: "All licensed" },
  { to: 4.2, decimals: 1, suffix: " min", label: "Alarm to on-site", sub: "2024 average" },
  { to: 97, suffix: "%", label: "Client retention", sub: "Rolling 3-year" },
];

/* ==================================================================
   SMALL PIECES
   ================================================================== */

/** Log-style section eyebrow — the page's recurring structural device. */
function Eyebrow({ index, children, code }) {
  return (
    <motion.div className="ag-eyebrow" variants={riseIn}>
      <span className="ag-eyebrow-idx">[ {index} ]</span>
      <span className="ag-eyebrow-txt">{children}</span>
      {code && <span className="ag-eyebrow-code">{code}</span>}
    </motion.div>
  );
}

/** The signature element: a live watch-desk console. */
function WatchConsole() {
  const [now, setNow] = useState(() => new Date());
  const [feed, setFeed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFeed((f) => (f + 1) % 4), 3200);
    return () => clearInterval(t);
  }, []);

  const utc = now.toISOString().slice(11, 19);

  const lines = [
    ["NORTH SECTOR", "SECURE"],
    ["EAST GATE", "SECURE"],
    ["LOADING BAY", "PATROL"],
    ["ROOF ACCESS", "SECURE"],
  ];

  return (
    <div className="ag-console">
      <div className="ag-console-sweep" aria-hidden="true" />
      <div className="ag-console-head">
        <span className="ag-live">
          <span className="ag-live-dot" /> COMMAND CENTRE
        </span>
        <span className="ag-console-clock">{utc} UTC</span>
      </div>

      <div className="ag-console-body">
        {lines.map(([zone, state], i) => (
          <div className="ag-console-row" key={zone}>
            <span className="ag-console-zone">{zone}</span>
            <span className="ag-console-dots" aria-hidden="true" />
            <span
              className={
                "ag-console-state" + (i === feed ? " is-active" : "")
              }
            >
              {i === feed ? "CHECKING" : state}
            </span>
          </div>
        ))}
      </div>

      <div className="ag-console-foot">
        <span>OPEN INCIDENTS</span>
        <span className="ag-console-num">00</span>
      </div>
    </div>
  );
}

/* ==================================================================
   SECTIONS
   ================================================================== */

function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  const links = [
    ["Services", "#services"],
    ["Standards", "#standards"],
    ["Process", "#process"],
    ["Clients", "#clients"],
  ];

  return (
    <motion.header
      className={"ag-nav" + (solid ? " is-solid" : "")}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
    >
      <div className="ag-nav-inner">
        <a className="ag-brand" href="#top">
          <span className="ag-brand-mark" aria-hidden="true" />
          <span className="ag-brand-text">
            AEGIS<span className="ag-brand-sub">PROTECTIVE GROUP</span>
          </span>
        </a>

        <nav className="ag-nav-links" aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="ag-nav-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="ag-nav-right">
          <a className="ag-nav-phone" href="tel:+18005550142">
            24/7 · +1 800 555 0142
          </a>
          <Magnetic as="a" href="#contact" className="ag-btn ag-btn-primary ag-btn-sm">
            Request consultation
          </Magnetic>
          <button
            className="ag-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={open ? "is-open" : ""} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ag-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="ag-mobile-cta">
              Request consultation
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const consoleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const headline = ["Protection for people", "and places that cannot", "absorb an incident."];

  return (
    <section className="ag-hero" ref={ref} id="top">
      <motion.div className="ag-hero-grid" style={{ y: gridY }} aria-hidden="true" />
      <div className="ag-hero-glow" aria-hidden="true" />
      <div className="ag-noise" aria-hidden="true" />

      <div className="ag-shell ag-hero-shell">
        <motion.div className="ag-hero-copy" style={{ y: copyY, opacity: fade }}>
          <motion.div
            className="ag-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
          >
            <span className="ag-eyebrow-idx">[ 00 ]</span>
            <span className="ag-eyebrow-txt">Licensed private security</span>
            <span className="ag-eyebrow-code">LIC. PSA-4471</span>
          </motion.div>

          <h1 className="ag-h1">
            {headline.map((line, i) => (
              <span className="ag-mask" key={line}>
                <motion.span
                  className="ag-mask-inner"
                  variants={maskLine}
                  initial="hidden"
                  animate="show"
                  transition={{ duration: 1, ease: EASE, delay: 0.45 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="ag-lede"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
          >
            Officers, executive protection details and a 24-hour command centre —
            operating across fourteen metros since 2009. Every post runs on written
            orders and a named supervisor.
          </motion.p>

          <motion.div
            className="ag-hero-actions"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.98 }}
          >
            <Magnetic as="a" href="#contact" className="ag-btn ag-btn-primary">
              Request consultation
            </Magnetic>
            <Magnetic as="a" href="#services" className="ag-btn ag-btn-ghost">
              See capabilities
            </Magnetic>
          </motion.div>

          <motion.ul
            className="ag-credentials"
            variants={stagger(0.09, 1.15)}
            initial="hidden"
            animate="show"
          >
            {[
              "State licensed & bonded",
              "$10M general liability",
              "SIA / ASIS certified staff",
              "Officers vetted to 7 years",
            ].map((c) => (
              <motion.li key={c} variants={riseIn}>
                {c}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="ag-hero-console"
          style={{ y: consoleY, opacity: fade }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
        >
          <WatchConsole />
        </motion.div>
      </div>

      <motion.div
        className="ag-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{ opacity: fade }}
        aria-hidden="true"
      >
        <span>SCROLL</span>
        <span className="ag-scroll-rail">
          <motion.span
            className="ag-scroll-dot"
            animate={{ y: [0, 22, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

function Stats() {
  return (
    <Reveal className="ag-stats" gap={0.1}>
      <div className="ag-shell ag-stats-grid">
        {STATS.map((s) => (
          <motion.div className="ag-stat" key={s.label} variants={riseIn}>
            <div className="ag-stat-num">
              <Counter to={s.to} decimals={s.decimals || 0} suffix={s.suffix || ""} />
            </div>
            <div className="ag-stat-label">{s.label}</div>
            <div className="ag-stat-sub">{s.sub}</div>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}

function Services() {
  return (
    <section className="ag-section" id="services">
      <div className="ag-shell">
        <Reveal className="ag-head">
          <Eyebrow index="01" code="SVC/2026">
            Capabilities
          </Eyebrow>
          <motion.h2 className="ag-h2" variants={riseIn}>
            Six services. One chain of command.
          </motion.h2>
          <motion.p className="ag-sub" variants={riseIn}>
            Most clients start with one post and expand. Everything below runs
            through the same command centre, the same reporting format and the
            same supervisor on call.
          </motion.p>
          <motion.div className="ag-rule" variants={scaleLine} />
        </Reveal>

        <Reveal className="ag-cards" gap={0.09}>
          {SERVICES.map((s) => (
            <motion.article className="ag-card" key={s.id} variants={riseIn}>
              <div className="ag-card-glow" aria-hidden="true" />
              <div className="ag-card-top">
                <span className="ag-card-id">{s.id}</span>
                <span className="ag-card-arrow" aria-hidden="true">
                  →
                </span>
              </div>
              <h3 className="ag-card-title">{s.title}</h3>
              <p className="ag-card-body">{s.body}</p>
              <ul className="ag-card-tags">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Standards() {
  const points = [
    {
      k: "Vetting",
      t: "We turn away nine of every ten applicants",
      b: "Seven-year background check, drug screen, psychometric review and a live scenario assessment. References are called, not collected.",
    },
    {
      k: "Command",
      t: "A duty officer answers, not a queue",
      b: "Our centre is staffed around the clock by people who hold your site plan and escalation policy. Average pick-up is under twelve seconds.",
    },
    {
      k: "Compliance",
      t: "Every shift is documented and auditable",
      b: "Post orders, patrol logs, incident reports and licence records are exportable at any time. Insurers and auditors ask us once.",
    },
  ];

  return (
    <section className="ag-section ag-standards" id="standards">
      <div className="ag-shell ag-split">
        <Reveal className="ag-split-left">
          <Eyebrow index="02" code="STD/A">
            Standards
          </Eyebrow>
          <motion.h2 className="ag-h2" variants={riseIn}>
            The difference is what happens on an ordinary Tuesday.
          </motion.h2>
          <motion.p className="ag-sub" variants={riseIn}>
            Any provider can perform on the night of an incident. The value is in
            the eleven months where nothing happens and the standard holds
            anyway.
          </motion.p>

          <motion.div className="ag-badge" variants={riseIn}>
            <div className="ag-badge-ring" aria-hidden="true" />
            <div className="ag-badge-body">
              <span className="ag-badge-k">Licence</span>
              <span className="ag-badge-v">PSA-4471</span>
              <span className="ag-badge-k">Renewed</span>
              <span className="ag-badge-v">Jan 2026</span>
            </div>
          </motion.div>
        </Reveal>

        <Reveal className="ag-split-right" gap={0.12}>
          {points.map((p, i) => (
            <motion.div className="ag-point" key={p.k} variants={riseIn}>
              <div className="ag-point-k">{p.k}</div>
              <h3 className="ag-point-t">{p.t}</h3>
              <p className="ag-point-b">{p.b}</p>
              {i < points.length - 1 && <div className="ag-point-rule" />}
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section className="ag-section" id="process">
      <div className="ag-shell">
        <Reveal className="ag-head">
          <Eyebrow index="03" code="OPS/SEQ">
            Engagement
          </Eyebrow>
          <motion.h2 className="ag-h2" variants={riseIn}>
            Four steps from first call to standing post.
          </motion.h2>
          <motion.div className="ag-rule" variants={scaleLine} />
        </Reveal>

        <div className="ag-process" ref={ref}>
          <div className="ag-process-rail" aria-hidden="true">
            <motion.div
              className="ag-process-fill"
              style={{ scaleY, transformOrigin: "top" }}
            />
          </div>

          <Reveal className="ag-process-steps" gap={0.14}>
            {PROCESS.map((s) => (
              <motion.div className="ag-step" key={s.n} variants={riseIn}>
                <div className="ag-step-node" aria-hidden="true" />
                <div className="ag-step-n">{s.n}</div>
                <div className="ag-step-main">
                  <h3 className="ag-step-t">{s.title}</h3>
                  <p className="ag-step-b">{s.body}</p>
                </div>
                <div className="ag-step-meta">{s.meta}</div>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Sectors() {
  const reduce = useReducedMotion();
  const row = [...SECTORS, ...SECTORS];

  return (
    <section className="ag-marquee-wrap" aria-label="Sectors served">
      <div className="ag-shell">
        <Reveal>
          <Eyebrow index="04" code="MKT">
            Sectors served
          </Eyebrow>
        </Reveal>
      </div>

      <div className="ag-marquee">
        <motion.div
          className="ag-marquee-track"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          {row.map((s, i) => (
            <span className="ag-marquee-item" key={s + i}>
              {s}
              <span className="ag-marquee-sep" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </motion.div>
        <div className="ag-marquee-mask" aria-hidden="true" />
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="ag-section" id="clients">
      <div className="ag-shell">
        <Reveal className="ag-head">
          <Eyebrow index="05" code="REF">
            Client references
          </Eyebrow>
          <motion.h2 className="ag-h2" variants={riseIn}>
            Named references available on request.
          </motion.h2>
          <motion.div className="ag-rule" variants={scaleLine} />
        </Reveal>

        <Reveal className="ag-quotes" gap={0.1}>
          {TESTIMONIALS.map((t) => (
            <motion.figure className="ag-quote" key={t.org} variants={riseIn}>
              <div className="ag-quote-mark" aria-hidden="true">
                ”
              </div>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="ag-quote-name">{t.name}</span>
                <span className="ag-quote-org">{t.org}</span>
              </figcaption>
            </motion.figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", org: "", email: "", service: "", msg: "" });
  const [state, setState] = useState("idle"); // idle | error | sent
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setState("error");
      return;
    }
    setState("sent");
  };

  return (
    <section className="ag-section ag-contact" id="contact">
      <div className="ag-shell ag-contact-grid">
        <Reveal className="ag-contact-left">
          <Eyebrow index="06" code="REQ">
            Start a brief
          </Eyebrow>
          <motion.h2 className="ag-h2" variants={riseIn}>
            Tell us what you need protected.
          </motion.h2>
          <motion.p className="ag-sub" variants={riseIn}>
            A duty officer reads every request. Expect a reply within one
            business day, or call the line below at any hour.
          </motion.p>

          <motion.div className="ag-contact-lines" variants={riseIn}>
            <a href="tel:+18005550142">
              <span>24-hour line</span>
              <strong>+1 800 555 0142</strong>
            </a>
            <a href="mailto:watch@aegisprotective.com">
              <span>Watch desk</span>
              <strong>watch@aegisprotective.com</strong>
            </a>
            <div>
              <span>Head office</span>
              <strong>1400 Harbour Row, Suite 900</strong>
            </div>
          </motion.div>
        </Reveal>

        <Reveal className="ag-form" gap={0.06}>
          <motion.div className="ag-field" variants={riseIn}>
            <label htmlFor="ag-name">Name</label>
            <input id="ag-name" value={form.name} onChange={set("name")} placeholder="Full name" />
          </motion.div>

          <motion.div className="ag-field" variants={riseIn}>
            <label htmlFor="ag-org">Organisation</label>
            <input id="ag-org" value={form.org} onChange={set("org")} placeholder="Company or estate" />
          </motion.div>

          <motion.div className="ag-field" variants={riseIn}>
            <label htmlFor="ag-email">Email</label>
            <input id="ag-email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" />
          </motion.div>

          <motion.div className="ag-field" variants={riseIn}>
            <label htmlFor="ag-service">Service</label>
            <select id="ag-service" value={form.service} onChange={set("service")}>
              <option value="">Select a service</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
              <option value="Other">Something else</option>
            </select>
          </motion.div>

          <motion.div className="ag-field ag-field-full" variants={riseIn}>
            <label htmlFor="ag-msg">What are you protecting?</label>
            <textarea
              id="ag-msg"
              rows={4}
              value={form.msg}
              onChange={set("msg")}
              placeholder="Sites, headcount, hours of cover, and anything that has already gone wrong."
            />
          </motion.div>

          <motion.div className="ag-form-foot" variants={riseIn}>
            <Magnetic className="ag-btn ag-btn-primary" onClick={submit} type="button">
              Request consultation
            </Magnetic>
            <AnimatePresence mode="wait">
              {state === "error" && (
                <motion.p
                  className="ag-form-msg is-error"
                  key="err"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Add your name and email so we can reply.
                </motion.p>
              )}
              {state === "sent" && (
                <motion.p
                  className="ag-form-msg is-ok"
                  key="ok"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Request sent. A duty officer replies within one business day.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ag-footer">
      <div className="ag-shell">
        <div className="ag-footer-top">
          <div className="ag-footer-brand">
            <span className="ag-brand-mark" aria-hidden="true" />
            <span className="ag-brand-text">
              AEGIS<span className="ag-brand-sub">PROTECTIVE GROUP</span>
            </span>
            <p>
              Licensed private security operating across fourteen metros.
              Command centre staffed 24 hours, every day of the year.
            </p>
          </div>

          <div className="ag-footer-cols">
            <div>
              <h4>Services</h4>
              {SERVICES.slice(0, 4).map((s) => (
                <a key={s.id} href="#services">
                  {s.title}
                </a>
              ))}
            </div>
            <div>
              <h4>Company</h4>
              <a href="#standards">Standards</a>
              <a href="#process">Process</a>
              <a href="#clients">Clients</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <h4>Licensing</h4>
              <span>PSA-4471 · State</span>
              <span>ASIS member since 2011</span>
              <span>$10M liability cover</span>
              <span>ISO 18788 aligned</span>
            </div>
          </div>
        </div>

        <div className="ag-footer-bottom">
          <span>© 2026 Aegis Protective Group</span>
          <span className="ag-footer-live">
            <span className="ag-live-dot" /> Command centre online
          </span>
          <span>Privacy · Terms · Modern slavery statement</span>
        </div>
      </div>
    </footer>
  );
}

/* ==================================================================
   ROOT
   ================================================================== */

export default function AegisLanding() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="ag-root">
        <style>{CSS}</style>
        <motion.div className="ag-progress" style={{ scaleX: progress }} aria-hidden="true" />
        <Nav />
        <main>
          <Hero />
          <Stats />
          <Services />
          <Standards />
          <Process />
          <Sectors />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

/* ==================================================================
   STYLES
   ================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.ag-root {
  --void:#0A0B0D;
  --carbon:#101216;
  --steel:#171B22;
  --line:rgba(236,234,229,.10);
  --line-2:rgba(236,234,229,.18);
  --brass:#C8A24A;
  --brass-soft:rgba(200,162,74,.14);
  --bone:#ECEAE5;
  --haze:#8A919F;
  --live:#7FA872;

  --display:'Archivo',system-ui,sans-serif;
  --body:'Instrument Sans',system-ui,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace;

  background:var(--void);
  color:var(--bone);
  font-family:var(--body);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.ag-root *,.ag-root *::before,.ag-root *::after{box-sizing:border-box;}
.ag-root h1,.ag-root h2,.ag-root h3,.ag-root h4,.ag-root p,.ag-root figure,
.ag-root blockquote,.ag-root ul,.ag-root ol{margin:0;padding:0;}
.ag-root ul,.ag-root ol{list-style:none;}
.ag-root a{color:inherit;text-decoration:none;}
.ag-root :focus-visible{outline:2px solid var(--brass);outline-offset:3px;border-radius:2px;}

.ag-shell{width:100%;max-width:1240px;margin:0 auto;padding:0 32px;}
.ag-section{position:relative;padding:132px 0;}

/* progress */
.ag-progress{position:fixed;top:0;left:0;right:0;height:2px;background:var(--brass);
  transform-origin:0%;z-index:120;}

/* ---------- typography ---------- */
.ag-h1{font-family:var(--display);font-weight:700;font-size:clamp(2.6rem,6.1vw,5rem);
  line-height:1.02;letter-spacing:-.035em;margin:26px 0 0;}
.ag-h2{font-family:var(--display);font-weight:700;font-size:clamp(1.9rem,3.5vw,3rem);
  line-height:1.08;letter-spacing:-.03em;margin-top:18px;max-width:16ch;}
.ag-sub{color:var(--haze);font-size:1.02rem;line-height:1.65;max-width:56ch;margin-top:18px;}
.ag-lede{color:var(--haze);font-size:1.08rem;line-height:1.68;max-width:52ch;margin-top:26px;}
.ag-mask{display:block;overflow:hidden;}
.ag-mask-inner{display:block;}

.ag-eyebrow{display:flex;align-items:center;gap:12px;font-family:var(--mono);
  font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:var(--haze);}
.ag-eyebrow-idx{color:var(--brass);}
.ag-eyebrow-code{margin-left:auto;opacity:.45;}
.ag-head .ag-eyebrow{max-width:none;}
.ag-head{max-width:820px;}
.ag-rule{height:1px;background:linear-gradient(90deg,var(--line-2),transparent);
  margin-top:44px;transform-origin:left;}

/* ---------- buttons ---------- */
.ag-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;
  font-family:var(--mono);font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;
  padding:16px 26px;border-radius:2px;cursor:pointer;border:1px solid transparent;
  transition:background .3s ease,color .3s ease,border-color .3s ease;}
.ag-btn-sm{padding:11px 18px;font-size:.66rem;}
.ag-btn-primary{background:var(--brass);color:#0A0B0D;font-weight:500;}
.ag-btn-primary:hover{background:#DDBB63;}
.ag-btn-ghost{border-color:var(--line-2);color:var(--bone);background:transparent;}
.ag-btn-ghost:hover{border-color:var(--brass);color:var(--brass);}

/* ---------- nav ---------- */
.ag-nav{position:fixed;top:0;left:0;right:0;z-index:110;transition:background .4s ease,
  border-color .4s ease,backdrop-filter .4s ease;border-bottom:1px solid transparent;}
.ag-nav.is-solid{background:rgba(10,11,13,.78);backdrop-filter:blur(14px);border-color:var(--line);}
.ag-nav-inner{max-width:1240px;margin:0 auto;padding:16px 32px;display:flex;align-items:center;gap:32px;}
.ag-brand{display:flex;align-items:center;gap:12px;}
.ag-brand-mark{width:22px;height:26px;background:var(--brass);flex:none;
  clip-path:polygon(50% 0,100% 22%,100% 62%,50% 100%,0 62%,0 22%);}
.ag-brand-text{font-family:var(--display);font-weight:800;font-size:1.02rem;
  letter-spacing:.14em;line-height:1;display:flex;flex-direction:column;gap:4px;}
.ag-brand-sub{font-family:var(--mono);font-weight:400;font-size:.52rem;
  letter-spacing:.28em;color:var(--haze);}
.ag-nav-links{display:flex;gap:30px;margin-left:auto;}
.ag-nav-link{font-size:.86rem;color:var(--haze);transition:color .25s ease;position:relative;}
.ag-nav-link:hover{color:var(--bone);}
.ag-nav-right{display:flex;align-items:center;gap:18px;}
.ag-nav-phone{font-family:var(--mono);font-size:.68rem;letter-spacing:.1em;color:var(--haze);}
.ag-nav-phone:hover{color:var(--brass);}
.ag-burger{display:none;width:38px;height:38px;background:none;border:1px solid var(--line);
  border-radius:2px;cursor:pointer;position:relative;}
.ag-burger span{position:absolute;inset:0;margin:auto;width:16px;height:1px;background:var(--bone);}
.ag-burger span::before,.ag-burger span::after{content:'';position:absolute;left:0;width:16px;
  height:1px;background:var(--bone);transition:transform .3s ease;}
.ag-burger span::before{top:-5px;}
.ag-burger span::after{top:5px;}
.ag-burger span.is-open{background:transparent;}
.ag-burger span.is-open::before{transform:translateY(5px) rotate(45deg);}
.ag-burger span.is-open::after{transform:translateY(-5px) rotate(-45deg);}
.ag-mobile{overflow:hidden;background:rgba(10,11,13,.96);border-top:1px solid var(--line);
  display:flex;flex-direction:column;}
.ag-mobile a{padding:16px 32px;border-bottom:1px solid var(--line);font-size:.94rem;}
.ag-mobile-cta{color:var(--brass);font-family:var(--mono);font-size:.74rem;letter-spacing:.14em;
  text-transform:uppercase;}

/* ---------- hero ---------- */
.ag-hero{position:relative;min-height:100svh;display:flex;align-items:center;
  padding:150px 0 90px;overflow:hidden;}
.ag-hero-grid{position:absolute;inset:-20% 0 -20%;
  background-image:linear-gradient(rgba(236,234,229,.045) 1px,transparent 1px),
    linear-gradient(90deg,rgba(236,234,229,.045) 1px,transparent 1px);
  background-size:78px 78px;
  -webkit-mask-image:radial-gradient(ellipse 90% 65% at 30% 40%,#000 10%,transparent 78%);
  mask-image:radial-gradient(ellipse 90% 65% at 30% 40%,#000 10%,transparent 78%);}
.ag-hero-glow{position:absolute;top:-14%;left:14%;width:820px;height:820px;
  background:radial-gradient(circle,rgba(200,162,74,.13),transparent 62%);
  filter:blur(24px);pointer-events:none;}
.ag-noise{position:absolute;inset:0;opacity:.045;pointer-events:none;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");}
.ag-hero-shell{position:relative;display:grid;grid-template-columns:1.35fr .85fr;gap:70px;align-items:center;}
.ag-hero-actions{display:flex;flex-wrap:wrap;gap:14px;margin-top:36px;}
.ag-credentials{display:flex;flex-wrap:wrap;gap:10px 26px;margin-top:46px;
  font-family:var(--mono);font-size:.68rem;letter-spacing:.1em;color:var(--haze);
  text-transform:uppercase;}
.ag-credentials li{display:flex;align-items:center;gap:9px;}
.ag-credentials li::before{content:'';width:5px;height:5px;background:var(--brass);
  transform:rotate(45deg);flex:none;}

.ag-scroll-hint{position:absolute;bottom:34px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:12px;font-family:var(--mono);
  font-size:.58rem;letter-spacing:.3em;color:var(--haze);}
.ag-scroll-rail{width:1px;height:44px;background:var(--line-2);position:relative;}
.ag-scroll-dot{position:absolute;top:0;left:-2px;width:5px;height:5px;
  border-radius:50%;background:var(--brass);}

/* ---------- watch console (signature) ---------- */
.ag-console{position:relative;background:linear-gradient(160deg,var(--carbon),#0C0E12);
  border:1px solid var(--line-2);border-radius:3px;padding:22px;overflow:hidden;
  box-shadow:0 40px 90px -40px rgba(0,0,0,.9);}
.ag-console-sweep{position:absolute;top:0;left:0;right:0;height:130px;
  background:linear-gradient(180deg,rgba(200,162,74,.14),transparent);
  animation:ag-sweep 5.5s ease-in-out infinite;}
@keyframes ag-sweep{0%{transform:translateY(-130px);}60%{transform:translateY(320px);}100%{transform:translateY(320px);}}
.ag-console-head{display:flex;justify-content:space-between;align-items:center;
  padding-bottom:16px;border-bottom:1px solid var(--line);font-family:var(--mono);
  font-size:.62rem;letter-spacing:.2em;color:var(--haze);position:relative;}
.ag-live{display:flex;align-items:center;gap:8px;color:var(--bone);}
.ag-live-dot{width:6px;height:6px;border-radius:50%;background:var(--live);
  box-shadow:0 0 0 0 rgba(127,168,114,.55);animation:ag-pulse 2.4s ease-out infinite;}
@keyframes ag-pulse{0%{box-shadow:0 0 0 0 rgba(127,168,114,.5);}70%{box-shadow:0 0 0 9px rgba(127,168,114,0);}100%{box-shadow:0 0 0 0 rgba(127,168,114,0);}}
.ag-console-clock{color:var(--brass);}
.ag-console-body{padding:16px 0;position:relative;}
.ag-console-row{display:flex;align-items:center;gap:10px;padding:9px 0;
  font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;}
.ag-console-zone{color:var(--bone);opacity:.8;}
.ag-console-dots{flex:1;border-bottom:1px dashed var(--line-2);}
.ag-console-state{color:var(--live);}
.ag-console-state.is-active{color:var(--brass);}
.ag-console-foot{display:flex;justify-content:space-between;align-items:baseline;
  padding-top:16px;border-top:1px solid var(--line);font-family:var(--mono);
  font-size:.62rem;letter-spacing:.2em;color:var(--haze);position:relative;}
.ag-console-num{font-family:var(--display);font-size:1.5rem;letter-spacing:-.02em;color:var(--bone);}

/* ---------- stats ---------- */
.ag-stats{border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  background:linear-gradient(180deg,rgba(16,18,22,.6),transparent);}
.ag-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);}
.ag-stat{padding:52px 34px;border-right:1px solid var(--line);}
.ag-stat:first-child{padding-left:0;}
.ag-stat:last-child{border-right:0;}
.ag-stat-num{font-family:var(--display);font-weight:700;font-size:clamp(2.2rem,4vw,3.2rem);
  letter-spacing:-.04em;color:var(--bone);line-height:1;}
.ag-stat-label{margin-top:14px;font-size:.9rem;color:var(--bone);}
.ag-stat-sub{margin-top:6px;font-family:var(--mono);font-size:.62rem;letter-spacing:.16em;
  text-transform:uppercase;color:var(--haze);}

/* ---------- service cards ---------- */
.ag-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:56px;
  background:var(--line);border:1px solid var(--line);}
.ag-card{position:relative;background:var(--void);padding:38px 32px 34px;overflow:hidden;
  transition:background .4s ease;}
.ag-card:hover{background:var(--carbon);}
.ag-card-glow{position:absolute;top:-40%;left:-20%;width:340px;height:340px;
  background:radial-gradient(circle,rgba(200,162,74,.16),transparent 65%);
  opacity:0;transition:opacity .5s ease;pointer-events:none;}
.ag-card:hover .ag-card-glow{opacity:1;}
.ag-card-top{display:flex;justify-content:space-between;align-items:center;
  font-family:var(--mono);font-size:.64rem;letter-spacing:.2em;color:var(--haze);
  position:relative;}
.ag-card-id{color:var(--brass);}
.ag-card-arrow{transform:translateX(-6px);opacity:0;transition:all .4s ease;}
.ag-card:hover .ag-card-arrow{transform:translateX(0);opacity:1;color:var(--brass);}
.ag-card-title{position:relative;font-family:var(--display);font-weight:600;font-size:1.28rem;
  letter-spacing:-.02em;margin-top:28px;}
.ag-card-body{position:relative;color:var(--haze);font-size:.93rem;line-height:1.62;margin-top:14px;}
.ag-card-tags{position:relative;display:flex;flex-wrap:wrap;gap:7px;margin-top:24px;}
.ag-card-tags li{font-family:var(--mono);font-size:.6rem;letter-spacing:.12em;
  text-transform:uppercase;color:var(--haze);border:1px solid var(--line);
  padding:5px 9px;border-radius:2px;}

/* ---------- standards ---------- */
.ag-standards{background:linear-gradient(180deg,transparent,rgba(16,18,22,.75),transparent);}
.ag-split{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;}
.ag-split-left{position:sticky;top:120px;}
.ag-badge{display:flex;align-items:center;gap:22px;margin-top:48px;padding:22px 26px;
  border:1px solid var(--line);border-radius:3px;background:var(--carbon);width:fit-content;}
.ag-badge-ring{width:52px;height:52px;flex:none;border-radius:50%;
  border:1px solid var(--brass);position:relative;}
.ag-badge-ring::after{content:'';position:absolute;inset:9px;border-radius:50%;
  border:1px dashed rgba(200,162,74,.5);animation:ag-spin 22s linear infinite;}
@keyframes ag-spin{to{transform:rotate(360deg);}}
.ag-badge-body{display:grid;grid-template-columns:auto auto;gap:5px 20px;
  font-family:var(--mono);font-size:.64rem;letter-spacing:.14em;}
.ag-badge-k{color:var(--haze);text-transform:uppercase;}
.ag-badge-v{color:var(--brass);}
.ag-point{padding-bottom:36px;}
.ag-point-k{font-family:var(--mono);font-size:.62rem;letter-spacing:.24em;
  text-transform:uppercase;color:var(--brass);}
.ag-point-t{font-family:var(--display);font-weight:600;font-size:1.42rem;
  letter-spacing:-.025em;margin-top:14px;line-height:1.24;}
.ag-point-b{color:var(--haze);font-size:.96rem;line-height:1.66;margin-top:12px;max-width:46ch;}
.ag-point-rule{height:1px;background:var(--line);margin-top:36px;}

/* ---------- process ---------- */
.ag-process{position:relative;margin-top:60px;padding-left:56px;}
.ag-process-rail{position:absolute;left:13px;top:12px;bottom:70px;width:1px;background:var(--line);}
.ag-process-fill{position:absolute;inset:0;background:var(--brass);}
.ag-step{position:relative;display:grid;grid-template-columns:64px 1fr 120px;gap:28px;
  align-items:start;padding:32px 0;border-bottom:1px solid var(--line);}
.ag-step:last-child{border-bottom:0;}
.ag-step-node{position:absolute;left:-49px;top:40px;width:9px;height:9px;
  background:var(--void);border:1px solid var(--brass);transform:rotate(45deg);}
.ag-step-n{font-family:var(--mono);font-size:.78rem;letter-spacing:.14em;color:var(--brass);
  padding-top:5px;}
.ag-step-t{font-family:var(--display);font-weight:600;font-size:1.5rem;letter-spacing:-.025em;}
.ag-step-b{color:var(--haze);font-size:.96rem;line-height:1.64;margin-top:10px;max-width:52ch;}
.ag-step-meta{font-family:var(--mono);font-size:.64rem;letter-spacing:.16em;
  text-transform:uppercase;color:var(--haze);text-align:right;padding-top:8px;}

/* ---------- marquee ---------- */
.ag-marquee-wrap{padding:70px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  background:var(--carbon);}
.ag-marquee{position:relative;margin-top:34px;overflow:hidden;}
.ag-marquee-track{display:flex;width:max-content;}
.ag-marquee-item{display:flex;align-items:center;gap:38px;padding-right:38px;
  font-family:var(--display);font-weight:600;font-size:clamp(1.5rem,3vw,2.4rem);
  letter-spacing:-.03em;color:var(--bone);opacity:.55;white-space:nowrap;}
.ag-marquee-sep{color:var(--brass);font-size:.7rem;opacity:.8;}
.ag-marquee-mask{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(90deg,var(--carbon),transparent 12%,transparent 88%,var(--carbon));}

/* ---------- quotes ---------- */
.ag-quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:56px;}
.ag-quote{position:relative;border:1px solid var(--line);border-radius:3px;padding:34px 30px;
  background:linear-gradient(180deg,var(--carbon),transparent);transition:border-color .4s ease;}
.ag-quote:hover{border-color:var(--line-2);}
.ag-quote-mark{font-family:var(--display);font-size:3.2rem;line-height:.6;color:var(--brass);
  opacity:.5;}
.ag-quote blockquote{font-size:1rem;line-height:1.66;color:var(--bone);margin-top:18px;}
.ag-quote figcaption{margin-top:26px;padding-top:18px;border-top:1px solid var(--line);
  display:flex;flex-direction:column;gap:5px;}
.ag-quote-name{font-size:.9rem;}
.ag-quote-org{font-family:var(--mono);font-size:.62rem;letter-spacing:.14em;
  text-transform:uppercase;color:var(--haze);}

/* ---------- contact ---------- */
.ag-contact{background:linear-gradient(180deg,transparent,rgba(16,18,22,.8));}
.ag-contact-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:80px;align-items:start;}
.ag-contact-lines{margin-top:46px;display:flex;flex-direction:column;
  border-top:1px solid var(--line);}
.ag-contact-lines a,.ag-contact-lines div{display:flex;justify-content:space-between;
  align-items:baseline;gap:20px;padding:18px 0;border-bottom:1px solid var(--line);
  transition:color .3s ease;}
.ag-contact-lines a:hover{color:var(--brass);}
.ag-contact-lines span{font-family:var(--mono);font-size:.62rem;letter-spacing:.18em;
  text-transform:uppercase;color:var(--haze);}
.ag-contact-lines strong{font-weight:500;font-size:1rem;}
.ag-form{display:grid;grid-template-columns:1fr 1fr;gap:20px;
  border:1px solid var(--line);border-radius:3px;padding:38px;background:var(--carbon);}
.ag-field{display:flex;flex-direction:column;gap:9px;}
.ag-field-full{grid-column:1/-1;}
.ag-field label{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--haze);}
.ag-field input,.ag-field select,.ag-field textarea{width:100%;background:var(--void);
  border:1px solid var(--line);border-radius:2px;color:var(--bone);font-family:var(--body);
  font-size:.94rem;padding:13px 14px;transition:border-color .3s ease;resize:vertical;}
.ag-field input::placeholder,.ag-field textarea::placeholder{color:rgba(138,145,159,.55);}
.ag-field input:focus,.ag-field select:focus,.ag-field textarea:focus{border-color:var(--brass);outline:none;}
.ag-form-foot{grid-column:1/-1;display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:6px;}
.ag-form-msg{font-family:var(--mono);font-size:.66rem;letter-spacing:.1em;}
.ag-form-msg.is-error{color:#D98A6A;}
.ag-form-msg.is-ok{color:var(--live);}

/* ---------- footer ---------- */
.ag-footer{border-top:1px solid var(--line);padding:76px 0 34px;background:var(--void);}
.ag-footer-top{display:grid;grid-template-columns:1.1fr 1.4fr;gap:70px;
  padding-bottom:56px;border-bottom:1px solid var(--line);}
.ag-footer-brand{display:flex;flex-direction:column;gap:16px;}
.ag-footer-brand .ag-brand-mark{margin-bottom:4px;}
.ag-footer-brand p{color:var(--haze);font-size:.92rem;line-height:1.66;max-width:40ch;}
.ag-footer-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:34px;}
.ag-footer-cols h4{font-family:var(--mono);font-size:.6rem;letter-spacing:.22em;
  text-transform:uppercase;color:var(--brass);margin-bottom:18px;font-weight:500;}
.ag-footer-cols a,.ag-footer-cols span{display:block;color:var(--haze);font-size:.9rem;
  padding:6px 0;transition:color .25s ease;}
.ag-footer-cols a:hover{color:var(--bone);}
.ag-footer-bottom{display:flex;justify-content:space-between;align-items:center;gap:20px;
  flex-wrap:wrap;padding-top:26px;font-family:var(--mono);font-size:.6rem;
  letter-spacing:.14em;text-transform:uppercase;color:var(--haze);}
.ag-footer-live{display:flex;align-items:center;gap:9px;}

/* ---------- responsive ---------- */
@media (max-width:1080px){
  .ag-hero-shell{grid-template-columns:1fr;gap:52px;}
  .ag-hero-console{max-width:440px;}
  .ag-cards{grid-template-columns:repeat(2,1fr);}
  .ag-quotes{grid-template-columns:1fr;}
  .ag-split,.ag-contact-grid{grid-template-columns:1fr;gap:52px;}
  .ag-split-left{position:static;}
  .ag-footer-top{grid-template-columns:1fr;gap:46px;}
  .ag-nav-links,.ag-nav-phone{display:none;}
  .ag-burger{display:block;}
}
@media (max-width:760px){
  .ag-shell{padding:0 20px;}
  .ag-section{padding:88px 0;}
  .ag-nav-inner{padding:14px 20px;}
  .ag-nav-right .ag-btn{display:none;}
  .ag-stats-grid{grid-template-columns:1fr 1fr;}
  .ag-stat{padding:32px 22px;border-bottom:1px solid var(--line);}
  .ag-stat:nth-child(2n){border-right:0;}
  .ag-stat:first-child{padding-left:22px;}
  .ag-cards{grid-template-columns:1fr;}
  .ag-form{grid-template-columns:1fr;padding:26px;}
  .ag-process{padding-left:34px;}
  .ag-process-rail{left:5px;}
  .ag-step{grid-template-columns:44px 1fr;gap:16px;}
  .ag-step-node{left:-33px;top:38px;}
  .ag-step-meta{grid-column:2;text-align:left;padding-top:12px;}
  .ag-scroll-hint{display:none;}
  .ag-h2{max-width:none;}
}

@media (prefers-reduced-motion:reduce){
  .ag-root *,.ag-root *::before,.ag-root *::after{
    animation-duration:.001ms !important;animation-iteration-count:1 !important;
    transition-duration:.001ms !important;}
}
`;
