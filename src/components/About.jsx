import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import useMediaQuery from "../hooks/useMediaQuery";

const LOGO = "/images/opt/lg-5.png";
const STORY = ["about_1", "about_2", "about_3"];
const STAGGER = 150;

const POINTER_QUERY =
  "(min-width: 960px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const pad = (value) => String(value).padStart(2, "0");

// Ring geometry shares one 400×400 viewBox centred on (200, 200);
// `pathLength="360"` lets dash patterns be written in degrees.
function SealDefs() {
  return (
    <svg className="about-seal__defs" width="0" height="0" focusable="false">
      <defs>
        <linearGradient id="about-seal-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--c-teal-500)" />
          <stop offset="0.5" stopColor="var(--c-blue-500)" />
          <stop offset="1" stopColor="var(--c-purple-500)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function OuterRing() {
  return (
    <svg className="about-seal__svg about-seal__svg--outer" viewBox="0 0 400 400" focusable="false">
      <circle cx="200" cy="200" r="197" className="about-seal__line" />
      <circle cx="200" cy="200" r="189" pathLength="360" className="about-seal__ticks" />
      <circle cx="200" cy="200" r="188" pathLength="360" className="about-seal__ticks about-seal__ticks--major" />
    </svg>
  );
}

function MiddleRing() {
  return (
    <svg className="about-seal__svg about-seal__svg--middle" viewBox="0 0 400 400" focusable="false">
      <circle cx="200" cy="200" r="170" pathLength="360" className="about-seal__line about-seal__line--arcs" />
      <circle cx="364.2" cy="156" r="2.6" className="about-seal__node about-seal__node--teal" />
      <circle cx="244" cy="364.2" r="2.2" className="about-seal__node about-seal__node--blue" />
      <circle cx="35.8" cy="244" r="2.2" className="about-seal__node about-seal__node--purple" />
    </svg>
  );
}

function InnerRing() {
  return (
    <svg className="about-seal__svg about-seal__svg--inner" viewBox="0 0 400 400" focusable="false">
      <circle cx="200" cy="200" r="150" pathLength="360" className="about-seal__dots" />
    </svg>
  );
}

function LightTrace() {
  return (
    <svg className="about-seal__svg about-seal__svg--trace" viewBox="0 0 400 400" focusable="false">
      <circle cx="200" cy="200" r="150" pathLength="360" className="about-seal__trace about-seal__trace--tail" />
      <circle cx="200" cy="200" r="150" pathLength="360" className="about-seal__trace about-seal__trace--body" />
      <circle cx="200" cy="200" r="150" pathLength="360" className="about-seal__trace about-seal__trace--halo" />
      <circle cx="200" cy="200" r="150" pathLength="360" className="about-seal__trace about-seal__trace--head" />
    </svg>
  );
}

export default function About() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const pointer = useMediaQuery(POINTER_QUERY);

  // Steps that enter the viewport together are staggered in document order,
  // so the desktop composition plays as one sequence while tall mobile steps
  // never wait on ones the reader has not reached yet.
  useEffect(() => {
    const section = sectionRef.current;
    const steps = Array.from(section.querySelectorAll("[data-about-step]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      section.setAttribute("data-active", "");
      steps.forEach((el) => el.setAttribute("data-in", ""));
      return undefined;
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target)
          .sort((a, b) => steps.indexOf(a) - steps.indexOf(b))
          .forEach((el, i) => {
            el.style.setProperty("--about-delay", `${i * STAGGER}ms`);
            el.setAttribute("data-in", "");
            reveal.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    steps.forEach((el) => reveal.observe(el));

    const activity = new IntersectionObserver(
      ([entry]) => section.toggleAttribute("data-active", entry.isIntersecting),
      { rootMargin: "160px 0px" }
    );
    activity.observe(section);

    return () => {
      reveal.disconnect();
      activity.disconnect();
    };
  }, []);

  // Eased pointer position (-1…1) exposed as --px / --py; every depth layer
  // derives its own offset from these in CSS.
  useEffect(() => {
    const section = sectionRef.current;
    if (!pointer) return undefined;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    let last = 0;

    const tick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const k = 1 - Math.exp(-dt * 3);
      x += (targetX - x) * k;
      y += (targetY - y) * k;
      section.style.setProperty("--px", x.toFixed(4));
      section.style.setProperty("--py", y.toFixed(4));
      if (Math.abs(targetX - x) > 0.0005 || Math.abs(targetY - y) > 0.0005) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        last = 0;
      }
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = section.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      start();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      section.style.removeProperty("--px");
      section.style.removeProperty("--py");
    };
  }, [pointer]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section about"
      aria-labelledby="about-title"
    >
      <div className="about__watermark" data-depth="-0.07" aria-hidden="true">
        <img src={LOGO} alt="" width="256" height="263" loading="lazy" decoding="async" />
      </div>

      <div className="container about__grid">
        <header className="about__head" data-about-step>
          <span className="accent-bar" aria-hidden="true" />
          <h2 id="about-title" className="section-title">
            {t("about")}
          </h2>
        </header>

        <div className="about-seal" data-about-step aria-hidden="true">
          <SealDefs />
          <div className="about-seal__stage">
            <div className="about-seal__layer about-seal__layer--glow">
              <span className="about-seal__glow" />
            </div>
            <div className="about-seal__layer about-seal__layer--outer">
              <OuterRing />
            </div>
            <div className="about-seal__layer about-seal__layer--middle">
              <MiddleRing />
            </div>
            <div className="about-seal__layer about-seal__layer--inner">
              <InnerRing />
              <LightTrace />
            </div>
            <div className="about-seal__layer about-seal__layer--core">
              <span className="about-seal__core">
                <img src={LOGO} alt="" width="256" height="263" loading="lazy" decoding="async" />
              </span>
            </div>
          </div>
        </div>

        <div className="about-story" data-about-step>
          <div className="about-story__layers">
            <span className="about-story__rail" aria-hidden="true" />
            {STORY.map((key, index) => (
              <div
                key={key}
                className={`about-story__layer about-story__layer--${index + 1}`}
                data-about-step
              >
                <span className="about-story__node" aria-hidden="true" />
                <span className="about-story__index" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <p className={index === 0 ? "about-story__text about-story__text--lead" : "about-story__text"}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
