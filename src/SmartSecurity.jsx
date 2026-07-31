/**
 * SMART SECURITY DETECTIVE SERVICES — Bengaluru
 * ------------------------------------------------------------------
 * Single-file React landing page. Real Framer Motion.
 *
 * All business details live in the BRAND object below.
 * All copy lives in the arrays under it.
 * All colours are CSS variables in the .ss-root block at the bottom.
 *
 * NOTE ON NUMBERS: the figures in STATS are placeholders. Replace them
 * with your real ones before sharing the site widely.
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
   BRAND — edit everything about the business here
   ================================================================== */

const BRAND = {
  name: "Smart Security",
  full: "Smart Security Detective Services",
  tagline: "Security & Investigation Services",
  phone: "+91 80885 78863",
  phoneHref: "tel:+918088578863",
  whatsapp: "https://wa.me/918088578863",
  email: "info@smartsecuritydetectiveservices.in",
  address: {
    line1: "479/1, Tumkur Road",
    line2: "Near Nagasandra Metro Station, opp. Shell Petrol Bunk",
    line3: "M.S.R. Layout, Havanur Layout, Bagalagunte",
    city: "Bengaluru, Karnataka 560073",
  },
  addressOneLine:
    "479/1, Tumkur Rd, near Nagasandra Metro Station, opp. Shell Petrol Bunk, M.S.R. Layout, Havanur Layout, Bagalagunte, Bengaluru, Karnataka 560073",
  hours: "Control room staffed 24 hours",
};

const MAP_SRC =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(BRAND.addressOneLine) +
  "&output=embed";

/* ==================================================================
   PHOTOGRAPHY — Unsplash, free for commercial use
   Replace these with photos of your own team when you have them.
   ================================================================== */

const img = (id, w = 1200) =>
  "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + w + "&q=80";

const PHOTO = {
  guardStanding: img("1485230405346-71acb9518d9c", 1400),
  officerStreet: img("1652739758426-56a564265f9e", 1000),
  guardDay: img("1581568736305-49a04e012c13", 1000),
  pso: img("1618371690240-e0d46eead4b8", 1000),
  psoAlt: img("1618371731836-2b9bff9ac72a", 1000),
  controlRoom: img("1605810230434-7631ac76ec81", 1400),
  cctvCluster: img("1557597774-9d273605dfa9", 1000),
  cctvCamera: img("1618482914248-29272d021005", 1000),
  cctvWall: img("1496368077930-c1e31b4e5b44", 1000),
  cameraPost: img("1528312635006-8ea0bc49ec63", 1000),
  lens: img("1520697830682-bbb6e85e2b0b", 1000),
  silhouette: img("1569087682520-45253cc2e0ee", 1000),
  hallway: img("1523294557-3637e1db3f33", 1000),
  coat: img("1576807100081-6e12175343c6", 1000),
  crowd: img("1653592956557-48ae49fc5ef5", 1000),
  blackTop: img("1566245024852-04fbf7842ce9", 1000),
};

/* ==================================================================
   MOTION LAYER
   ================================================================== */

const EASE = [0.16, 1, 0.3, 1];
const VIEW = { once: true, margin: "-80px" };

const stagger = (children = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: children, delayChildren: delay } },
});

const riseIn = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

const zoomIn = {
  hidden: { opacity: 0, scale: 1.08 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: EASE } },
};

const maskLine = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE } },
};

const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.3, ease: EASE }, opacity: { duration: 0.2 } },
  },
};

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

function Magnetic({ as = "button", className = "", children, strength = 0.25, ...rest }) {
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
    const controls = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: setVal });
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

/** Photo that scales down gently as it enters view. */
function Frame({ src, alt, className = "", ratio = "4 / 5", parallax = 0 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  return (
    <div className={"ss-frame " + className} ref={ref} style={{ aspectRatio: ratio }}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={parallax ? { y } : undefined}
        variants={zoomIn}
      />
    </div>
  );
}

/* ==================================================================
   CONTENT
   ================================================================== */

const STATS = [
  { to: 15, suffix: "+", label: "Years in Bengaluru", sub: "Since 2010" },
  { to: 500, suffix: "+", label: "Trained personnel", sub: "On active roster" },
  { to: 120, suffix: "+", label: "Sites protected", sub: "Across the city" },
  { to: 24, suffix: "/7", label: "Control room", sub: "Never unstaffed" },
];

const PILLARS = [
  {
    k: "Deter",
    title: "Most incidents never start",
    body:
      "A uniformed officer at the gate, a working camera, a light that comes on — the majority of opportunistic crime is decided against before it begins. Presence is the cheapest security you will ever buy.",
    icon: "shield",
  },
  {
    k: "Detect",
    title: "The ones that start, we catch early",
    body:
      "Patrol rounds on a randomised schedule, verified camera alerts, and a control room that knows your site plan. Problems get smaller the earlier somebody notices them.",
    icon: "eye",
  },
  {
    k: "Respond",
    title: "Someone is already moving",
    body:
      "A named supervisor, a written escalation policy, and a call that reaches a person rather than a queue. What you are really paying for is the speed of the next fifteen minutes.",
    icon: "bolt",
  },
];

const TIMELINE = [
  {
    t: "00:00",
    title: "Alarm or observation",
    body: "A sensor trips, a camera flags movement, or an officer on rounds sees something out of place.",
  },
  {
    t: "00:20",
    title: "Verified, not assumed",
    body: "The control room pulls the camera and confirms it before anybody is woken up. False alarms stop here.",
  },
  {
    t: "01:00",
    title: "Officer on the move",
    body: "The nearest supervisor is dispatched and your escalation contact is called at the same time, not after.",
  },
  {
    t: "15:00",
    title: "On site and reporting",
    body: "Situation contained, police involved if needed, and a written incident report started while details are fresh.",
  },
];

const SERVICES = [
  {
    id: "01",
    title: "Security Guards",
    body:
      "Trained, uniformed guards for apartments, offices, factories and warehouses. Day and night shifts with a supervisor who actually visits the post.",
    tags: ["Gate duty", "Night shift", "Patrolling"],
    photo: PHOTO.guardStanding,
  },
  {
    id: "02",
    title: "Bouncers",
    body:
      "Physically trained and crowd-experienced staff for pubs, clubs, restaurants and private functions. Firm without escalating.",
    tags: ["Door control", "Crowd handling", "Venues"],
    photo: PHOTO.blackTop,
  },
  {
    id: "03",
    title: "Personal Security Officers",
    body:
      "Discreet bodyguards for business owners, families and visiting guests. Route planning and secure transport arranged on request.",
    tags: ["Close protection", "Escort", "Travel"],
    photo: PHOTO.pso,
  },
  {
    id: "04",
    title: "CCTV & Control Room",
    body:
      "Camera supply, installation and live monitoring from our control room, with verified alerts rather than a wall of notifications.",
    tags: ["Installation", "Live monitoring", "Footage"],
    photo: PHOTO.controlRoom,
  },
  {
    id: "05",
    title: "Event Security",
    body:
      "Weddings, corporate events, exhibitions and public functions. Entry control, crowd management and parking handled together.",
    tags: ["Entry control", "Crowds", "Parking"],
    photo: PHOTO.crowd,
  },
  {
    id: "06",
    title: "Housekeeping & Facility Staff",
    body:
      "Housekeeping, lift operators, pantry and facility staff supplied alongside security, on one contract and one invoice.",
    tags: ["Housekeeping", "Facility", "Payroll"],
    photo: PHOTO.hallway,
  },
  {
    id: "07",
    title: "Private Investigation",
    body:
      "Licensed detective work handled quietly by experienced investigators. Findings are documented so they hold up when it matters.",
    tags: ["Surveillance", "Evidence", "Reporting"],
    photo: PHOTO.silhouette,
  },
  {
    id: "08",
    title: "Verification Services",
    body:
      "Employment, tenant, address and pre-hire background verification, completed with physical checks rather than database lookups alone.",
    tags: ["Pre-hire", "Tenant", "Address"],
    photo: PHOTO.lens,
  },
];

const CASES = [
  "Pre-matrimonial verification",
  "Post-matrimonial investigation",
  "Corporate & employee enquiry",
  "Missing person tracing",
  "Asset & property verification",
  "Insurance claim verification",
  "Surveillance & evidence gathering",
  "Loyalty & integrity testing",
];

const PROCESS = [
  {
    n: "01",
    title: "Call us",
    body: "Tell us what you need protected or looked into. We will say plainly whether it is something we handle.",
    meta: "Same day",
  },
  {
    n: "02",
    title: "Site visit",
    body: "For guarding work we walk the premises first. No quotation is written before somebody has seen the place.",
    meta: "1–2 days",
  },
  {
    n: "03",
    title: "Deploy",
    body: "Staff are matched to the post, briefed on written duties, and introduced to your team before the first shift.",
    meta: "3–7 days",
  },
  {
    n: "04",
    title: "Supervise",
    body: "Surprise supervisor checks, monthly reporting, and a replacement ready when somebody takes leave.",
    meta: "Ongoing",
  },
];

const SECTORS = [
  "Apartments & gated communities",
  "IT parks",
  "Manufacturing units",
  "Warehouses & logistics",
  "Retail showrooms",
  "Hospitals & clinics",
  "Schools & colleges",
  "Banks & ATMs",
  "Construction sites",
  "Hotels & restaurants",
  "Private residences",
  "Exhibitions & events",
];

const GALLERY = [
  { src: PHOTO.officerStreet, alt: "Officer on foot patrol" },
  { src: PHOTO.cctvCluster, alt: "Camera cluster covering an approach" },
  { src: PHOTO.guardDay, alt: "Guard on day duty" },
  { src: PHOTO.cctvWall, alt: "Cameras covering a perimeter wall" },
  { src: PHOTO.psoAlt, alt: "Personal security officer" },
  { src: PHOTO.cameraPost, alt: "Pole-mounted camera" },
];

const TESTIMONIALS = [
  {
    quote:
      "We changed agencies after the previous guards stopped turning up on Sundays. Fifteen months in, we have not had a single unfilled shift.",
    name: "Secretary",
    org: "Apartment association, Jalahalli",
  },
  {
    quote:
      "The supervisor visits at odd hours without telling anyone. That one habit changed how our night shift behaves.",
    name: "Plant Manager",
    org: "Manufacturing unit, Peenya",
  },
  {
    quote:
      "The verification work was quiet, quick and properly documented. We were given facts, not opinions.",
    name: "HR Lead",
    org: "IT services company, Bengaluru",
  },
];

const CREDENTIALS = [
  "PSARA licensed",
  "Police-verified staff",
  "PF & ESI compliant",
  "Trained & uniformed",
];

/* ==================================================================
   ICONS
   ================================================================== */

function Icon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const paths = {
    shield: "M24 6 L40 12 V24 C40 33 33 39 24 42 C15 39 8 33 8 24 V12 Z",
    eye: "M4 24 C10 14 17 10 24 10 C31 10 38 14 44 24 C38 34 31 38 24 38 C17 38 10 34 4 24 Z",
    bolt: "M26 5 L12 27 H23 L21 43 L36 20 H25 Z",
  };
  return (
    <svg viewBox="0 0 48 48" className="ss-icon" aria-hidden="true">
      <motion.path d={paths[name]} {...common} variants={drawPath} />
      {name === "eye" && (
        <motion.circle cx="24" cy="24" r="6" {...common} variants={drawPath} />
      )}
    </svg>
  );
}

function ShieldMark() {
  return (
    <svg viewBox="0 0 32 38" className="ss-mark" aria-hidden="true">
      <path d="M16 1 L31 6.5 V19 C31 28 24.5 33.5 16 37 C7.5 33.5 1 28 1 19 V6.5 Z" />
      <path className="ss-mark-tick" d="M10 19 L14.5 23.5 L23 14" />
    </svg>
  );
}

/* ==================================================================
   SHARED PIECES
   ================================================================== */

function Eyebrow({ children, tone }) {
  return (
    <motion.div className={"ss-eyebrow" + (tone ? " is-" + tone : "")} variants={riseIn}>
      <span className="ss-eyebrow-bar" aria-hidden="true" />
      {children}
    </motion.div>
  );
}

/* ==================================================================
   SECTIONS
   ================================================================== */

function TopBar() {
  return (
    <div className="ss-topbar">
      <div className="ss-shell ss-topbar-inner">
        <span className="ss-topbar-live">
          <span className="ss-dot" /> {BRAND.hours}
        </span>
        <div className="ss-topbar-right">
          <a href={"mailto:" + BRAND.email}>{BRAND.email}</a>
          <a href={BRAND.phoneHref} className="ss-topbar-phone">
            {BRAND.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 60));

  const links = [
    ["Why security", "#why"],
    ["Services", "#services"],
    ["Investigation", "#investigation"],
    ["How we work", "#process"],
    ["Contact", "#contact"],
  ];

  return (
    <motion.header
      className={"ss-nav" + (solid ? " is-solid" : "")}
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="ss-shell ss-nav-inner">
        <a className="ss-brand" href="#top">
          <ShieldMark />
          <span className="ss-brand-text">
            SMART SECURITY
            <span className="ss-brand-sub">DETECTIVE SERVICES</span>
          </span>
        </a>

        <nav className="ss-nav-links" aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="ss-nav-right">
          <Magnetic as="a" href={BRAND.phoneHref} className="ss-btn ss-btn-primary ss-btn-sm">
            Call {BRAND.phone}
          </Magnetic>
          <button
            className="ss-burger"
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
            className="ss-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: EASE }}
          >
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <a href={BRAND.phoneHref} className="ss-mobile-cta">
              Call {BRAND.phone}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bigY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const smallY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const lines = ["Security you can", "actually see doing", "its job."];

  return (
    <section className="ss-hero" id="top" ref={ref}>
      <div className="ss-hero-wash" aria-hidden="true" />

      <div className="ss-shell ss-hero-grid">
        <motion.div className="ss-hero-copy" style={{ y: copyY }}>
          <motion.div
            className="ss-eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
          >
            <span className="ss-eyebrow-bar" aria-hidden="true" />
            Bengaluru · Guarding & investigation
          </motion.div>

          <h1 className="ss-h1">
            {lines.map((line, i) => (
              <span className="ss-mask" key={line}>
                <motion.span
                  className="ss-mask-inner"
                  variants={maskLine}
                  initial="hidden"
                  animate="show"
                  transition={{ duration: 0.95, ease: EASE, delay: 0.35 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="ss-lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.72 }}
          >
            Trained guards, bouncers, personal security officers and licensed
            detectives — supplied and supervised across Bengaluru. Every post has a
            named supervisor and a control room behind it.
          </motion.p>

          <motion.div
            className="ss-hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.84 }}
          >
            <Magnetic as="a" href={BRAND.phoneHref} className="ss-btn ss-btn-primary">
              Call {BRAND.phone}
            </Magnetic>
            <Magnetic as="a" href="#contact" className="ss-btn ss-btn-ghost">
              Request a site visit
            </Magnetic>
          </motion.div>

          <motion.ul
            className="ss-creds"
            variants={stagger(0.08, 1)}
            initial="hidden"
            animate="show"
          >
            {CREDENTIALS.map((c) => (
              <motion.li key={c} variants={riseIn}>
                {c}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="ss-hero-media">
          <motion.div
            className="ss-hero-big"
            style={{ y: bigY }}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          >
            <img src={PHOTO.guardStanding} alt="Security officer on duty" />
            <div className="ss-scan" aria-hidden="true" />
          </motion.div>

          <motion.div
            className="ss-hero-small"
            style={{ y: smallY }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          >
            <img src={PHOTO.controlRoom} alt="Control room monitoring screens" />
          </motion.div>

          <motion.div
            className="ss-hero-chip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
          >
            <span className="ss-dot" />
            <div>
              <strong>Control room live</strong>
              <span>Calls answered by a person, any hour</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <Reveal className="ss-stats" gap={0.1}>
      <div className="ss-shell ss-stats-grid">
        {STATS.map((s) => (
          <motion.div className="ss-stat" key={s.label} variants={riseIn}>
            <div className="ss-stat-num">
              <Counter to={s.to} suffix={s.suffix} />
            </div>
            <div className="ss-stat-label">{s.label}</div>
            <div className="ss-stat-sub">{s.sub}</div>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}

/** The centrepiece: why security matters, animated on scroll. */
function Why() {
  const railRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const fill = useTransform(progress, [0, 1], ["0%", "100%"]);
  const [active, setActive] = useState(-1);

  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.min(TIMELINE.length - 1, Math.floor(v * TIMELINE.length + 0.15)));
  });

  return (
    <section className="ss-section ss-why" id="why">
      <div className="ss-shell">
        <Reveal className="ss-head ss-head-center">
          <Eyebrow>Why it matters</Eyebrow>
          <motion.h2 className="ss-h2" variants={riseIn}>
            Security is judged on the day nothing happens.
          </motion.h2>
          <motion.p className="ss-sub" variants={riseIn}>
            Nobody notices a quiet year. That quiet is the product. Below is what
            actually produces it — and what happens in the fifteen minutes when it
            stops being quiet.
          </motion.p>
        </Reveal>

        <Reveal className="ss-pillars" gap={0.14}>
          {PILLARS.map((p) => (
            <motion.div className="ss-pillar" key={p.k} variants={riseIn}>
              <div className="ss-pillar-icon">
                <Icon name={p.icon} />
              </div>
              <span className="ss-pillar-k">{p.k}</span>
              <h3 className="ss-pillar-t">{p.title}</h3>
              <p className="ss-pillar-b">{p.body}</p>
            </motion.div>
          ))}
        </Reveal>

        <div className="ss-timeline" ref={railRef}>
          <Reveal className="ss-timeline-head">
            <motion.h3 className="ss-h3" variants={riseIn}>
              The first fifteen minutes
            </motion.h3>
            <motion.p className="ss-sub" variants={riseIn}>
              Scroll through what happens after an alarm.
            </motion.p>
          </Reveal>

          <div className="ss-timeline-rail" aria-hidden="true">
            <motion.div className="ss-timeline-fill" style={{ width: fill }} />
          </div>

          <div className="ss-timeline-steps">
            {TIMELINE.map((s, i) => (
              <motion.div
                className={"ss-tstep" + (i <= active ? " is-on" : "")}
                key={s.t}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
              >
                <span className="ss-tstep-node" aria-hidden="true" />
                <span className="ss-tstep-t">{s.t}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="ss-section ss-services" id="services">
      <div className="ss-shell">
        <Reveal className="ss-head">
          <Eyebrow>What we provide</Eyebrow>
          <motion.h2 className="ss-h2" variants={riseIn}>
            Manpower and investigation, from one office.
          </motion.h2>
          <motion.p className="ss-sub" variants={riseIn}>
            Most clients start with a guard or two and grow from there. Everything
            runs through the same supervisors and the same control room.
          </motion.p>
        </Reveal>

        <Reveal className="ss-cards" gap={0.07}>
          {SERVICES.map((s) => (
            <motion.article className="ss-card" key={s.id} variants={riseIn}>
              <div className="ss-card-media">
                <img src={s.photo} alt={s.title} loading="lazy" />
                <span className="ss-card-id">{s.id}</span>
              </div>
              <div className="ss-card-body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul>
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Investigation() {
  return (
    <section className="ss-invest" id="investigation">
      <div className="ss-shell ss-invest-grid">
        <Reveal className="ss-invest-left">
          <Eyebrow tone="dark">Detective services</Eyebrow>
          <motion.h2 className="ss-h2" variants={riseIn}>
            Discreet enquiry, documented properly.
          </motion.h2>
          <motion.p className="ss-sub" variants={riseIn}>
            Investigation work is handled by a separate team, on a need-to-know
            basis. You get findings you can act on and a written report you can
            keep — not a phone call and a rumour.
          </motion.p>

          <Reveal className="ss-cases" gap={0.05}>
            {CASES.map((c) => (
              <motion.span className="ss-case" key={c} variants={riseIn}>
                {c}
              </motion.span>
            ))}
          </Reveal>

          <motion.div variants={riseIn} className="ss-invest-cta">
            <Magnetic as="a" href={BRAND.phoneHref} className="ss-btn ss-btn-amber">
              Speak to an investigator
            </Magnetic>
            <span className="ss-invest-note">
              Enquiries are confidential. No case details over email.
            </span>
          </motion.div>
        </Reveal>

        <Reveal className="ss-invest-media" gap={0.12}>
          <Frame src={PHOTO.silhouette} alt="Surveillance work" ratio="3 / 4" parallax={26} />
          <Frame src={PHOTO.lens} alt="Long lens used for evidence" ratio="4 / 3" parallax={-20} />
        </Reveal>
      </div>
    </section>
  );
}

function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });

  return (
    <section className="ss-section" id="process">
      <div className="ss-shell">
        <Reveal className="ss-head">
          <Eyebrow>How we work</Eyebrow>
          <motion.h2 className="ss-h2" variants={riseIn}>
            Four steps from your call to a staffed post.
          </motion.h2>
        </Reveal>

        <div className="ss-process" ref={ref}>
          <div className="ss-process-rail" aria-hidden="true">
            <motion.div
              className="ss-process-fill"
              style={{ scaleY, transformOrigin: "top" }}
            />
          </div>
          <Reveal className="ss-steps" gap={0.13}>
            {PROCESS.map((s) => (
              <motion.div className="ss-step" key={s.n} variants={riseIn}>
                <span className="ss-step-node" aria-hidden="true" />
                <span className="ss-step-n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                <span className="ss-step-meta">{s.meta}</span>
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
    <section className="ss-marquee-wrap" aria-label="Where we work">
      <div className="ss-shell">
        <Reveal>
          <Eyebrow>Where we work</Eyebrow>
        </Reveal>
      </div>
      <div className="ss-marquee">
        <motion.div
          className="ss-marquee-track"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
        >
          {row.map((s, i) => (
            <span className="ss-marquee-item" key={s + i}>
              {s}
              <span className="ss-marquee-sep" aria-hidden="true">
                /
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="ss-gallery-wrap">
      <div className="ss-shell">
        <Reveal className="ss-head">
          <Eyebrow>On the ground</Eyebrow>
          <motion.h2 className="ss-h2" variants={riseIn}>
            Posts, patrols and cameras across the city.
          </motion.h2>
        </Reveal>

        <Reveal className="ss-gallery" gap={0.08}>
          {GALLERY.map((g, i) => (
            <Frame
              key={g.src}
              src={g.src}
              alt={g.alt}
              ratio={i % 3 === 0 ? "3 / 4" : "1 / 1"}
              parallax={i % 2 ? 18 : -18}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="ss-section ss-quotes-wrap">
      <div className="ss-shell">
        <Reveal className="ss-head">
          <Eyebrow>Client feedback</Eyebrow>
          <motion.h2 className="ss-h2" variants={riseIn}>
            References available on request.
          </motion.h2>
        </Reveal>

        <Reveal className="ss-quotes" gap={0.1}>
          {TESTIMONIALS.map((t) => (
            <motion.figure className="ss-quote" key={t.org} variants={riseIn}>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{t.org}</span>
              </figcaption>
            </motion.figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", service: "", msg: "" });
  const [state, setState] = useState("idle");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setState("error");
      return;
    }
    setState("sent");
  };

  return (
    <section className="ss-section ss-contact" id="contact">
      <div className="ss-shell">
        <Reveal className="ss-head">
          <Eyebrow>Get in touch</Eyebrow>
          <motion.h2 className="ss-h2" variants={riseIn}>
            Tell us what needs protecting.
          </motion.h2>
        </Reveal>

        <div className="ss-contact-grid">
          <Reveal className="ss-contact-info" gap={0.09}>
            <motion.a className="ss-info-row" href={BRAND.phoneHref} variants={riseIn}>
              <span className="ss-info-k">Phone</span>
              <strong>{BRAND.phone}</strong>
              <span className="ss-info-note">Answered 24 hours</span>
            </motion.a>

            <motion.a
              className="ss-info-row"
              href={"mailto:" + BRAND.email}
              variants={riseIn}
            >
              <span className="ss-info-k">Email</span>
              <strong>{BRAND.email}</strong>
              <span className="ss-info-note">Replies within a working day</span>
            </motion.a>

            <motion.div className="ss-info-row" variants={riseIn}>
              <span className="ss-info-k">Office</span>
              <strong>{BRAND.address.line1}</strong>
              <span className="ss-info-note">
                {BRAND.address.line2}
                <br />
                {BRAND.address.line3}
                <br />
                {BRAND.address.city}
              </span>
            </motion.div>

            <motion.div className="ss-map" variants={fadeIn}>
              <iframe
                src={MAP_SRC}
                title="Office location on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </Reveal>

          <Reveal className="ss-form" gap={0.06}>
            <motion.div className="ss-field" variants={riseIn}>
              <label htmlFor="ss-name">Your name</label>
              <input id="ss-name" value={form.name} onChange={set("name")} placeholder="Full name" />
            </motion.div>

            <motion.div className="ss-field" variants={riseIn}>
              <label htmlFor="ss-phone">Phone number</label>
              <input
                id="ss-phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="10-digit mobile"
              />
            </motion.div>

            <motion.div className="ss-field ss-field-full" variants={riseIn}>
              <label htmlFor="ss-service">What do you need?</label>
              <select id="ss-service" value={form.service} onChange={set("service")}>
                <option value="">Select a service</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Other">Something else</option>
              </select>
            </motion.div>

            <motion.div className="ss-field ss-field-full" variants={riseIn}>
              <label htmlFor="ss-msg">Details</label>
              <textarea
                id="ss-msg"
                rows={4}
                value={form.msg}
                onChange={set("msg")}
                placeholder="Location, number of staff, shift timings, or what you need looked into."
              />
            </motion.div>

            <motion.div className="ss-form-foot" variants={riseIn}>
              <Magnetic className="ss-btn ss-btn-primary" onClick={submit} type="button">
                Send enquiry
              </Magnetic>
              <a className="ss-btn ss-btn-ghost" href={BRAND.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp us
              </a>
              <AnimatePresence mode="wait">
                {state === "error" && (
                  <motion.p
                    className="ss-form-msg is-error"
                    key="e"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Add your name and phone number so we can call back.
                  </motion.p>
                )}
                {state === "sent" && (
                  <motion.p
                    className="ss-form-msg is-ok"
                    key="s"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Enquiry noted. Call {BRAND.phone} if it is urgent.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CallBand() {
  return (
    <section className="ss-band">
      <div className="ss-shell ss-band-inner">
        <Reveal>
          <motion.h2 className="ss-band-h" variants={riseIn}>
            Need cover starting this week?
          </motion.h2>
          <motion.p variants={riseIn}>
            Short-notice guarding and event cover can usually be arranged within
            three days. Call and ask.
          </motion.p>
        </Reveal>
        <Reveal>
          <motion.div variants={riseIn}>
            <Magnetic as="a" href={BRAND.phoneHref} className="ss-btn ss-btn-amber ss-btn-lg">
              {BRAND.phone}
            </Magnetic>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ss-footer">
      <div className="ss-shell">
        <div className="ss-footer-top">
          <div className="ss-footer-brand">
            <a className="ss-brand" href="#top">
              <ShieldMark />
              <span className="ss-brand-text">
                SMART SECURITY
                <span className="ss-brand-sub">DETECTIVE SERVICES</span>
              </span>
            </a>
            <p>
              Security manpower and licensed investigation services across
              Bengaluru. Control room staffed 24 hours, every day of the year.
            </p>
          </div>

          <div className="ss-footer-cols">
            <div>
              <h4>Services</h4>
              {SERVICES.slice(0, 5).map((s) => (
                <a key={s.id} href="#services">
                  {s.title}
                </a>
              ))}
            </div>
            <div>
              <h4>Company</h4>
              <a href="#why">Why security</a>
              <a href="#investigation">Investigation</a>
              <a href="#process">How we work</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <h4>Reach us</h4>
              <a href={BRAND.phoneHref}>{BRAND.phone}</a>
              <a href={"mailto:" + BRAND.email}>{BRAND.email}</a>
              <span>
                {BRAND.address.line1}, {BRAND.address.line2}
              </span>
              <span>
                {BRAND.address.line3}, {BRAND.address.city}
              </span>
            </div>
          </div>
        </div>

        <div className="ss-footer-bottom">
          <span>© {new Date().getFullYear()} {BRAND.full}</span>
          <span className="ss-footer-live">
            <span className="ss-dot" /> Control room online
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ==================================================================
   ROOT
   ================================================================== */

export default function SmartSecurity() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <MotionConfig reducedMotion="user">
      <div className="ss-root">
        <style>{CSS}</style>
        <motion.div className="ss-progress" style={{ scaleX: progress }} aria-hidden="true" />
        <TopBar />
        <Nav />
        <main>
          <Hero />
          <Stats />
          <Why />
          <Services />
          <Investigation />
          <Process />
          <Sectors />
          <Gallery />
          <Testimonials />
          <CallBand />
          <Contact />
        </main>
        <Footer />
        <a className="ss-fab" href={BRAND.phoneHref} aria-label={"Call " + BRAND.phone}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
          </svg>
          <span>Call now</span>
        </a>
      </div>
    </MotionConfig>
  );
}

/* ==================================================================
   STYLES
   ================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.ss-root{
  --paper:#EFF2F6;
  --white:#FFFFFF;
  --ink:#0C1B2A;
  --navy:#16324F;
  --slate:#5C6E80;
  --line:#DCE3EB;
  --line-2:#C6D0DA;
  --amber:#EE9B12;
  --amber-soft:rgba(238,155,18,.14);
  --live:#2E9E5B;

  --display:'Archivo',system-ui,sans-serif;
  --body:'Inter Tight',system-ui,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace;

  background:var(--paper);
  color:var(--ink);
  font-family:var(--body);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.ss-root *,.ss-root *::before,.ss-root *::after{box-sizing:border-box;}
.ss-root h1,.ss-root h2,.ss-root h3,.ss-root h4,.ss-root p,.ss-root figure,
.ss-root blockquote,.ss-root ul{margin:0;padding:0;}
.ss-root ul{list-style:none;}
.ss-root a{color:inherit;text-decoration:none;}
.ss-root img{display:block;width:100%;height:100%;object-fit:cover;}
.ss-root :focus-visible{outline:2px solid var(--amber);outline-offset:3px;border-radius:3px;}

.ss-shell{width:100%;max-width:1240px;margin:0 auto;padding:0 28px;}
.ss-section{padding:112px 0;}
.ss-progress{position:fixed;top:0;left:0;right:0;height:3px;background:var(--amber);
  transform-origin:0%;z-index:130;}

/* type */
.ss-h1{font-family:var(--display);font-weight:800;font-size:clamp(2.4rem,5.2vw,4.2rem);
  line-height:1.02;letter-spacing:-.035em;margin-top:22px;color:var(--ink);}
.ss-h2{font-family:var(--display);font-weight:700;font-size:clamp(1.8rem,3.3vw,2.8rem);
  line-height:1.1;letter-spacing:-.03em;margin-top:16px;max-width:17ch;}
.ss-h3{font-family:var(--display);font-weight:700;font-size:clamp(1.4rem,2.2vw,1.9rem);
  letter-spacing:-.025em;}
.ss-sub{color:var(--slate);font-size:1.02rem;line-height:1.66;max-width:58ch;margin-top:16px;}
.ss-lede{color:var(--slate);font-size:1.08rem;line-height:1.68;max-width:52ch;margin-top:22px;}
.ss-mask{display:block;overflow:hidden;}
.ss-mask-inner{display:block;}
.ss-head{max-width:800px;margin-bottom:52px;}
.ss-head-center{margin-left:auto;margin-right:auto;text-align:center;}
.ss-head-center .ss-sub{margin-left:auto;margin-right:auto;}
.ss-head-center .ss-h2{margin-left:auto;margin-right:auto;}
.ss-head-center .ss-eyebrow{justify-content:center;}

.ss-eyebrow{display:flex;align-items:center;gap:11px;font-family:var(--mono);
  font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--navy);}
.ss-eyebrow-bar{width:26px;height:2px;background:var(--amber);flex:none;}
.ss-eyebrow.is-dark{color:#B9C6D4;}

.ss-dot{width:7px;height:7px;border-radius:50%;background:var(--live);flex:none;
  box-shadow:0 0 0 0 rgba(46,158,91,.5);animation:ss-pulse 2.4s ease-out infinite;}
@keyframes ss-pulse{0%{box-shadow:0 0 0 0 rgba(46,158,91,.45);}70%{box-shadow:0 0 0 9px rgba(46,158,91,0);}100%{box-shadow:0 0 0 0 rgba(46,158,91,0);}}

/* buttons */
.ss-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;
  font-family:var(--body);font-weight:600;font-size:.94rem;padding:15px 26px;
  border-radius:4px;cursor:pointer;border:1px solid transparent;white-space:nowrap;
  transition:background .28s ease,color .28s ease,border-color .28s ease;}
.ss-btn-sm{padding:11px 18px;font-size:.86rem;}
.ss-btn-lg{padding:19px 34px;font-size:1.04rem;}
.ss-btn-primary{background:var(--ink);color:#fff;}
.ss-btn-primary:hover{background:var(--navy);}
.ss-btn-amber{background:var(--amber);color:#221602;}
.ss-btn-amber:hover{background:#FFB02E;}
.ss-btn-ghost{border-color:var(--line-2);color:var(--ink);background:transparent;}
.ss-btn-ghost:hover{border-color:var(--ink);}

/* top bar */
.ss-topbar{background:var(--ink);color:#C3CEDA;font-size:.8rem;}
.ss-topbar-inner{display:flex;align-items:center;justify-content:space-between;
  gap:20px;padding-top:9px;padding-bottom:9px;}
.ss-topbar-live{display:flex;align-items:center;gap:9px;}
.ss-topbar-right{display:flex;align-items:center;gap:24px;}
.ss-topbar-right a:hover{color:#fff;}
.ss-topbar-phone{color:var(--amber);font-weight:600;}

/* nav */
.ss-nav{position:sticky;top:0;z-index:120;background:rgba(239,242,246,.86);
  backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:border-color .3s ease,background .3s ease;}
.ss-nav.is-solid{border-color:var(--line);background:rgba(255,255,255,.92);}
.ss-nav-inner{display:flex;align-items:center;gap:28px;padding-top:14px;padding-bottom:14px;}
.ss-brand{display:flex;align-items:center;gap:11px;}
.ss-mark{width:29px;height:34px;flex:none;fill:none;stroke:var(--ink);stroke-width:2;}
.ss-mark-tick{stroke:var(--amber);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;}
.ss-brand-text{font-family:var(--display);font-weight:800;font-size:1rem;letter-spacing:.06em;
  line-height:1;display:flex;flex-direction:column;gap:4px;color:var(--ink);}
.ss-brand-sub{font-family:var(--mono);font-weight:400;font-size:.52rem;letter-spacing:.22em;
  color:var(--slate);}
.ss-nav-links{display:flex;gap:26px;margin-left:auto;font-size:.93rem;color:var(--slate);}
.ss-nav-links a{transition:color .25s ease;}
.ss-nav-links a:hover{color:var(--ink);}
.ss-nav-right{display:flex;align-items:center;gap:14px;}
.ss-burger{display:none;width:40px;height:40px;background:none;border:1px solid var(--line-2);
  border-radius:4px;cursor:pointer;position:relative;}
.ss-burger span{position:absolute;inset:0;margin:auto;width:17px;height:2px;background:var(--ink);}
.ss-burger span::before,.ss-burger span::after{content:'';position:absolute;left:0;width:17px;
  height:2px;background:var(--ink);transition:transform .3s ease;}
.ss-burger span::before{top:-6px;}
.ss-burger span::after{top:6px;}
.ss-burger span.is-open{background:transparent;}
.ss-burger span.is-open::before{transform:translateY(6px) rotate(45deg);}
.ss-burger span.is-open::after{transform:translateY(-6px) rotate(-45deg);}
.ss-mobile{overflow:hidden;background:#fff;border-top:1px solid var(--line);display:flex;flex-direction:column;}
.ss-mobile a{padding:15px 28px;border-bottom:1px solid var(--line);font-size:.98rem;}
.ss-mobile-cta{color:var(--amber);font-weight:700;}

/* hero */
.ss-hero{position:relative;padding:76px 0 96px;overflow:hidden;}
.ss-hero-wash{position:absolute;top:-160px;right:-140px;width:760px;height:760px;
  background:radial-gradient(circle,var(--amber-soft),transparent 62%);pointer-events:none;}
.ss-hero-grid{position:relative;display:grid;grid-template-columns:1.05fr .95fr;
  gap:64px;align-items:center;}
.ss-hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px;}
.ss-creds{display:flex;flex-wrap:wrap;gap:10px 24px;margin-top:38px;font-size:.86rem;color:var(--slate);}
.ss-creds li{display:flex;align-items:center;gap:8px;}
.ss-creds li::before{content:'';width:7px;height:7px;background:var(--amber);
  transform:rotate(45deg);flex:none;}

.ss-hero-media{position:relative;min-height:520px;}
.ss-hero-big{position:relative;width:82%;aspect-ratio:4 / 5;border-radius:6px;overflow:hidden;
  box-shadow:0 40px 80px -40px rgba(12,27,42,.5);}
.ss-scan{position:absolute;left:0;right:0;height:70px;
  background:linear-gradient(180deg,transparent,rgba(238,155,18,.45),transparent);
  animation:ss-scan 5.5s ease-in-out infinite;}
@keyframes ss-scan{0%{transform:translateY(-70px);}55%{transform:translateY(560px);}100%{transform:translateY(560px);}}
.ss-hero-small{position:absolute;right:0;bottom:52px;width:46%;aspect-ratio:4 / 3;
  border-radius:6px;overflow:hidden;border:5px solid var(--paper);
  box-shadow:0 24px 50px -26px rgba(12,27,42,.5);}
.ss-hero-chip{position:absolute;left:0;bottom:-14px;display:flex;align-items:center;gap:13px;
  background:#fff;border:1px solid var(--line);border-radius:6px;padding:14px 18px;
  box-shadow:0 18px 40px -24px rgba(12,27,42,.45);}
.ss-hero-chip strong{display:block;font-size:.92rem;}
.ss-hero-chip span{font-size:.8rem;color:var(--slate);}

/* stats */
.ss-stats{background:var(--ink);color:#fff;}
.ss-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);}
.ss-stat{padding:46px 30px;border-right:1px solid rgba(255,255,255,.12);}
.ss-stat:first-child{padding-left:0;}
.ss-stat:last-child{border-right:0;}
.ss-stat-num{font-family:var(--display);font-weight:800;font-size:clamp(2.1rem,3.6vw,3rem);
  letter-spacing:-.04em;line-height:1;color:var(--amber);}
.ss-stat-label{margin-top:12px;font-size:.96rem;}
.ss-stat-sub{margin-top:5px;font-family:var(--mono);font-size:.62rem;letter-spacing:.15em;
  text-transform:uppercase;color:#8FA0B1;}

/* why */
.ss-why{background:var(--white);}
.ss-pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:8px;}
.ss-pillar{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:34px 30px;}
.ss-pillar-icon{width:52px;height:52px;border-radius:8px;background:#fff;border:1px solid var(--line);
  display:grid;place-items:center;color:var(--navy);margin-bottom:22px;}
.ss-icon{width:28px;height:28px;}
.ss-pillar-k{font-family:var(--mono);font-size:.64rem;letter-spacing:.22em;
  text-transform:uppercase;color:var(--amber);}
.ss-pillar-t{font-family:var(--display);font-weight:700;font-size:1.24rem;letter-spacing:-.02em;
  margin-top:10px;line-height:1.24;}
.ss-pillar-b{color:var(--slate);font-size:.95rem;line-height:1.65;margin-top:12px;}

.ss-timeline{margin-top:86px;padding-top:60px;border-top:1px solid var(--line);}
.ss-timeline-head{margin-bottom:44px;}
.ss-timeline-rail{position:relative;height:2px;background:var(--line);border-radius:2px;}
.ss-timeline-fill{position:absolute;inset:0;background:var(--amber);border-radius:2px;}
.ss-timeline-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;margin-top:0;}
.ss-tstep{padding-top:30px;position:relative;opacity:.42;transition:opacity .45s ease;}
.ss-tstep.is-on{opacity:1;}
.ss-tstep-node{position:absolute;top:-6px;left:0;width:12px;height:12px;border-radius:50%;
  background:var(--white);border:2px solid var(--line-2);transition:border-color .4s ease,background .4s ease;}
.ss-tstep.is-on .ss-tstep-node{border-color:var(--amber);background:var(--amber);}
.ss-tstep-t{font-family:var(--mono);font-size:.76rem;letter-spacing:.1em;color:var(--amber);}
.ss-tstep h4{font-family:var(--display);font-weight:700;font-size:1.1rem;letter-spacing:-.02em;
  margin-top:8px;}
.ss-tstep p{color:var(--slate);font-size:.92rem;line-height:1.6;margin-top:8px;}

/* services */
.ss-services{background:var(--paper);}
.ss-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.ss-card{background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden;
  display:flex;flex-direction:column;transition:transform .4s ease,box-shadow .4s ease,border-color .4s ease;}
.ss-card:hover{transform:translateY(-6px);border-color:var(--line-2);
  box-shadow:0 28px 50px -30px rgba(12,27,42,.4);}
.ss-card-media{position:relative;aspect-ratio:4 / 3;overflow:hidden;}
.ss-card-media img{transition:transform .7s cubic-bezier(.16,1,.3,1);}
.ss-card:hover .ss-card-media img{transform:scale(1.07);}
.ss-card-id{position:absolute;top:12px;left:12px;background:var(--amber);color:#221602;
  font-family:var(--mono);font-size:.66rem;font-weight:500;padding:4px 8px;border-radius:3px;}
.ss-card-body{padding:22px 20px 24px;display:flex;flex-direction:column;flex:1;}
.ss-card-body h3{font-family:var(--display);font-weight:700;font-size:1.12rem;letter-spacing:-.02em;}
.ss-card-body p{color:var(--slate);font-size:.9rem;line-height:1.6;margin-top:9px;flex:1;}
.ss-card-body ul{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px;}
.ss-card-body li{font-family:var(--mono);font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;
  color:var(--navy);background:var(--paper);border:1px solid var(--line);padding:5px 8px;border-radius:3px;}

/* investigation */
.ss-invest{background:var(--ink);color:#E6ECF2;padding:112px 0;}
.ss-invest-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center;}
.ss-invest .ss-h2{color:#fff;}
.ss-invest .ss-sub{color:#A9B8C7;}
.ss-cases{display:flex;flex-wrap:wrap;gap:9px;margin-top:32px;}
.ss-case{font-size:.86rem;color:#D5DFE9;border:1px solid rgba(255,255,255,.18);
  padding:9px 14px;border-radius:4px;transition:border-color .3s ease,color .3s ease;}
.ss-case:hover{border-color:var(--amber);color:#fff;}
.ss-invest-cta{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:36px;}
.ss-invest-note{font-size:.84rem;color:#8FA0B1;max-width:24ch;}
.ss-invest-media{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start;}
.ss-invest-media .ss-frame:last-child{margin-top:48px;}

.ss-frame{position:relative;overflow:hidden;border-radius:8px;background:var(--line);}
.ss-frame img{transform-origin:center;}

/* process */
.ss-process{position:relative;padding-left:52px;}
.ss-process-rail{position:absolute;left:12px;top:14px;bottom:66px;width:2px;background:var(--line);}
.ss-process-fill{position:absolute;inset:0;background:var(--amber);}
.ss-step{position:relative;display:grid;grid-template-columns:56px 1fr 110px;gap:24px;
  align-items:start;padding:30px 0;border-bottom:1px solid var(--line);}
.ss-step:last-child{border-bottom:0;}
.ss-step-node{position:absolute;left:-46px;top:38px;width:12px;height:12px;border-radius:50%;
  background:var(--paper);border:2px solid var(--amber);}
.ss-step-n{font-family:var(--mono);font-size:.8rem;color:var(--amber);padding-top:5px;}
.ss-step h3{font-family:var(--display);font-weight:700;font-size:1.34rem;letter-spacing:-.025em;}
.ss-step p{color:var(--slate);font-size:.95rem;line-height:1.62;margin-top:8px;max-width:54ch;}
.ss-step-meta{font-family:var(--mono);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;
  color:var(--slate);text-align:right;padding-top:8px;}

/* marquee */
.ss-marquee-wrap{background:var(--white);padding:64px 0;border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);}
.ss-marquee{overflow:hidden;margin-top:28px;}
.ss-marquee-track{display:flex;width:max-content;}
.ss-marquee-item{display:flex;align-items:center;gap:30px;padding-right:30px;
  font-family:var(--display);font-weight:700;font-size:clamp(1.3rem,2.4vw,2rem);
  letter-spacing:-.025em;color:var(--ink);white-space:nowrap;}
.ss-marquee-sep{color:var(--amber);}

/* gallery */
.ss-gallery-wrap{padding:112px 0;background:var(--paper);}
.ss-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}

/* quotes */
.ss-quotes-wrap{background:var(--white);}
.ss-quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.ss-quote{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:32px 28px;
  border-top:3px solid var(--amber);}
.ss-quote blockquote{font-size:1rem;line-height:1.66;color:var(--ink);}
.ss-quote figcaption{margin-top:22px;padding-top:16px;border-top:1px solid var(--line);
  display:flex;flex-direction:column;gap:4px;}
.ss-quote figcaption strong{font-size:.92rem;}
.ss-quote figcaption span{font-family:var(--mono);font-size:.64rem;letter-spacing:.12em;
  text-transform:uppercase;color:var(--slate);}

/* band */
.ss-band{background:var(--navy);color:#fff;padding:76px 0;}
.ss-band-inner{display:flex;align-items:center;justify-content:space-between;gap:36px;flex-wrap:wrap;}
.ss-band-h{font-family:var(--display);font-weight:700;font-size:clamp(1.7rem,3vw,2.4rem);
  letter-spacing:-.03em;}
.ss-band p{color:#B7C6D5;margin-top:10px;max-width:46ch;}

/* contact */
.ss-contact{background:var(--paper);}
.ss-contact-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;align-items:start;}
.ss-contact-info{display:flex;flex-direction:column;}
.ss-info-row{display:block;padding:20px 0;border-bottom:1px solid var(--line);transition:color .3s ease;}
.ss-info-row:first-child{border-top:1px solid var(--line);}
a.ss-info-row:hover strong{color:var(--amber);}
.ss-info-k{display:block;font-family:var(--mono);font-size:.62rem;letter-spacing:.18em;
  text-transform:uppercase;color:var(--slate);}
.ss-info-row strong{display:block;font-size:1.06rem;margin-top:7px;transition:color .3s ease;}
.ss-info-note{display:block;font-size:.86rem;color:var(--slate);line-height:1.55;margin-top:5px;}
.ss-map{margin-top:24px;border:1px solid var(--line);border-radius:8px;overflow:hidden;
  aspect-ratio:4 / 3;background:#fff;}
.ss-map iframe{width:100%;height:100%;border:0;display:block;}

.ss-form{display:grid;grid-template-columns:1fr 1fr;gap:18px;background:#fff;
  border:1px solid var(--line);border-radius:8px;padding:32px;}
.ss-field{display:flex;flex-direction:column;gap:8px;}
.ss-field-full{grid-column:1/-1;}
.ss-field label{font-family:var(--mono);font-size:.6rem;letter-spacing:.18em;
  text-transform:uppercase;color:var(--slate);}
.ss-field input,.ss-field select,.ss-field textarea{width:100%;background:var(--paper);
  border:1px solid var(--line);border-radius:4px;color:var(--ink);font-family:var(--body);
  font-size:.96rem;padding:13px 14px;transition:border-color .25s ease,background .25s ease;resize:vertical;}
.ss-field input:focus,.ss-field select:focus,.ss-field textarea:focus{border-color:var(--amber);
  background:#fff;outline:none;}
.ss-form-foot{grid-column:1/-1;display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:4px;}
.ss-form-msg{font-size:.88rem;width:100%;}
.ss-form-msg.is-error{color:#C0392B;}
.ss-form-msg.is-ok{color:#1E7A45;}

/* footer */
.ss-footer{background:var(--ink);color:#A9B8C7;padding:70px 0 30px;}
.ss-footer .ss-mark{stroke:#fff;}
.ss-footer .ss-brand-text{color:#fff;}
.ss-footer .ss-brand-sub{color:#8FA0B1;}
.ss-footer-top{display:grid;grid-template-columns:1fr 1.4fr;gap:56px;padding-bottom:48px;
  border-bottom:1px solid rgba(255,255,255,.12);}
.ss-footer-brand p{font-size:.92rem;line-height:1.65;max-width:38ch;margin-top:18px;}
.ss-footer-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
.ss-footer-cols h4{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--amber);margin-bottom:16px;font-weight:500;}
.ss-footer-cols a,.ss-footer-cols span{display:block;font-size:.9rem;padding:5px 0;line-height:1.5;
  transition:color .25s ease;}
.ss-footer-cols a:hover{color:#fff;}
.ss-footer-bottom{display:flex;justify-content:space-between;align-items:center;gap:18px;
  flex-wrap:wrap;padding-top:24px;font-size:.82rem;}
.ss-footer-live{display:flex;align-items:center;gap:9px;}

/* floating call button (mobile) */
.ss-fab{position:fixed;right:16px;bottom:16px;z-index:125;display:none;align-items:center;gap:9px;
  background:var(--amber);color:#221602;font-weight:700;font-size:.92rem;padding:14px 20px;
  border-radius:40px;box-shadow:0 14px 30px -12px rgba(12,27,42,.6);}
.ss-fab svg{width:19px;height:19px;fill:currentColor;}

/* responsive */
@media (max-width:1080px){
  .ss-hero-grid,.ss-invest-grid,.ss-contact-grid{grid-template-columns:1fr;gap:48px;}
  .ss-hero-media{min-height:440px;max-width:520px;}
  .ss-cards{grid-template-columns:repeat(2,1fr);}
  .ss-pillars,.ss-quotes{grid-template-columns:1fr;}
  .ss-timeline-steps{grid-template-columns:repeat(2,1fr);row-gap:34px;}
  .ss-gallery{grid-template-columns:repeat(2,1fr);}
  .ss-footer-top{grid-template-columns:1fr;gap:40px;}
  .ss-nav-links{display:none;}
  .ss-burger{display:block;}
}
@media (max-width:760px){
  .ss-shell{padding:0 18px;}
  .ss-section,.ss-invest,.ss-gallery-wrap{padding:76px 0;}
  .ss-topbar-right a:not(.ss-topbar-phone){display:none;}
  .ss-nav-right .ss-btn{display:none;}
  .ss-stats-grid{grid-template-columns:1fr 1fr;}
  .ss-stat{padding:30px 18px;border-bottom:1px solid rgba(255,255,255,.12);}
  .ss-stat:nth-child(2n){border-right:0;}
  .ss-stat:first-child{padding-left:18px;}
  .ss-cards,.ss-gallery,.ss-form{grid-template-columns:1fr;}
  .ss-timeline-steps{grid-template-columns:1fr;}
  .ss-hero-media{min-height:380px;}
  .ss-hero-big{width:100%;}
  .ss-hero-small{display:none;}
  .ss-hero-chip{position:static;margin-top:16px;}
  .ss-process{padding-left:34px;}
  .ss-process-rail{left:5px;}
  .ss-step{grid-template-columns:44px 1fr;gap:14px;}
  .ss-step-node{left:-33px;top:36px;}
  .ss-step-meta{grid-column:2;text-align:left;padding-top:10px;}
  .ss-invest-media{grid-template-columns:1fr;}
  .ss-invest-media .ss-frame:last-child{margin-top:0;}
  .ss-form{padding:24px;}
  .ss-fab{display:flex;}
  .ss-footer{padding-bottom:88px;}
}

@media (prefers-reduced-motion:reduce){
  .ss-root *,.ss-root *::before,.ss-root *::after{
    animation-duration:.001ms !important;animation-iteration-count:1 !important;
    transition-duration:.001ms !important;}
}
`;
