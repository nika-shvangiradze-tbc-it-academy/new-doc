import React, { useCallback, useEffect, useRef, useState } from "react";
import Team from "./Team";
import Documents from "./Documents";
import Information from "./Information";
import Exam from "./Exam";
import About from "./About";
import Prepare from "./Prepare";
import Documentation from "./Documentation";
import Gallery from "./Gallery";
import Aurora from "./Aurora";
import { ServiceFocusContext } from "./serviceFocus";
import useMediaQuery from "../hooks/useMediaQuery";
import useSpatialCards from "../hooks/useSpatialCards";
import { useTranslation } from "react-i18next";

const SERVICES = [Team, Documents, Information, Exam, Prepare, Documentation];
const FEATURED = 0;

// Order in which the connecting path visits the cards on the desktop
// composition (left, featured, right, lower right, lower centre, lower left).
const PATH_LOOP = [1, 0, 2, 4, 5, 3];

const DESKTOP_QUERY = "(min-width: 1200px)";
const MOBILE_QUERY = "(max-width: 767px)";
const SPATIAL_QUERY =
  "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const FEED_STAGGER = 90;

// Closed Catmull-Rom spline through the points, split into one cubic
// segment per neighbouring pair so each can be highlighted on its own.
function loopSegments(points) {
  const n = points.length;
  return points.map((p1, i) => {
    const p0 = points[(i - 1 + n) % n];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    return `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  });
}

export default function Services() {
  const { t } = useTranslation();
  const stageRef = useRef(null);
  const [focus, setFocus] = useState(FEATURED);
  const [paths, setPaths] = useState(null);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const spatial = useMediaQuery(SPATIAL_QUERY);

  useSpatialCards(stageRef, spatial);

  const items = useCallback(
    () => Array.from(stageRef.current.querySelectorAll(".services__item")),
    []
  );

  // Mobile feed: each card enters on its own as it approaches the viewport;
  // cards that arrive together get a short stagger in reading order.
  // Larger layouts reveal the whole composition together so the stagger
  // reads as one entrance.
  useEffect(() => {
    const stage = stageRef.current;
    if (!("IntersectionObserver" in window)) return undefined;

    if (isMobile) {
      const els = items();
      const observer = new IntersectionObserver(
        (entries) => {
          entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target)
            .sort((a, b) => els.indexOf(a) - els.indexOf(b))
            .forEach((el, i) => {
              el.style.setProperty("--feed-delay", `${i * FEED_STAGGER}ms`);
              el.setAttribute("data-visible", "");
              observer.unobserve(el);
            });
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.12 }
      );
      els.filter((el) => !el.hasAttribute("data-visible")).forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        items().forEach((el) => el.setAttribute("data-visible", ""));
        observer.disconnect();
      },
      { threshold: 0.12 }
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, [items, isMobile]);

  useEffect(() => {
    if (!isDesktop) {
      setPaths(null);
      return undefined;
    }
    const stage = stageRef.current;
    const measure = () => {
      const els = items();
      const points = PATH_LOOP.map((slot) => {
        const el = els[slot];
        return { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 };
      });
      setPaths({ w: stage.clientWidth, h: stage.clientHeight, d: loopSegments(points) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    items().forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isDesktop, items]);

  // Mobile feed: the card crossing the middle band of the viewport carries
  // the (barely-there) emphasis. No scroll listener needed.
  useEffect(() => {
    if (!isMobile || !("IntersectionObserver" in window)) {
      setFocus(FEATURED);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setFocus(Number(entry.target.dataset.slot));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    items().forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isMobile, items]);

  const slotOf = (target) => {
    const item = target.closest?.(".services__item");
    return item ? Number(item.dataset.slot) : -1;
  };

  const onPointerOver = (event) => {
    if (isMobile || event.pointerType === "touch") return;
    const slot = slotOf(event.target);
    if (slot >= 0) setFocus(slot);
  };

  const onPointerLeave = (event) => {
    if (isMobile || event.pointerType === "touch") return;
    if (!stageRef.current.contains(document.activeElement)) setFocus(FEATURED);
  };

  const onFocus = (event) => {
    const slot = slotOf(event.target);
    if (slot >= 0 && !isMobile) setFocus(slot);
  };

  const onBlur = (event) => {
    if (isMobile || stageRef.current.contains(event.relatedTarget)) return;
    setFocus(FEATURED);
  };

  return (
    <>
      <section
        id="services"
        className="section services"
        aria-labelledby="services-title"
      >
        <Aurora variant="services" />
        <div className="container">
          <header className="section-head" data-reveal>
            <span className="accent-bar" aria-hidden="true" />
            <h2 id="services-title" className="section-title">
              {t("services")}
            </h2>
          </header>
        </div>

        <div className="container services__container">
          <ServiceFocusContext.Provider value={focus}>
            <div
              ref={stageRef}
              className="services__stage"
              role="list"
              onPointerOver={onPointerOver}
              onPointerLeave={onPointerLeave}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              {paths && (
                <svg
                  className="services__paths"
                  viewBox={`0 0 ${paths.w} ${paths.h}`}
                  aria-hidden="true"
                  focusable="false"
                >
                  <defs>
                    <linearGradient
                      id="services-path-gradient"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2={paths.w}
                      y2={paths.h}
                    >
                      <stop offset="0" stopColor="var(--c-teal-500)" />
                      <stop offset="0.5" stopColor="var(--c-blue-500)" />
                      <stop offset="1" stopColor="var(--c-purple-500)" />
                    </linearGradient>
                  </defs>
                  {paths.d.map((d, i) => {
                    const lit =
                      PATH_LOOP[i] === focus ||
                      PATH_LOOP[(i + 1) % PATH_LOOP.length] === focus;
                    return (
                      <path
                        key={PATH_LOOP[i]}
                        d={d}
                        className={`services__path${lit ? " is-lit" : ""}`}
                      />
                    );
                  })}
                </svg>
              )}

              {SERVICES.map((Service, index) => (
                <Service key={index} index={index} />
              ))}
            </div>
          </ServiceFocusContext.Provider>
        </div>

        <Gallery />
      </section>

      <About />
    </>
  );
}
