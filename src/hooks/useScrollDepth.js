import { useEffect } from "react";

// Moves `[data-depth]` decorations at a fraction of the scroll speed, measured
// against their (untransformed) parent. Uses the `translate` property so it
// composes with any CSS transform animation on the same element.
export default function useScrollDepth() {
  useEffect(() => {
    const enabled = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    ).matches;
    if (!enabled) return undefined;

    const elements = Array.from(document.querySelectorAll("[data-depth]")).map((el) => ({
      el,
      factor: parseFloat(el.getAttribute("data-depth")) || 0,
    }));
    if (!elements.length) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const rects = elements.map(({ el }) => el.parentElement.getBoundingClientRect());
      elements.forEach(({ el, factor }, i) => {
        const rect = rects[i];
        if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) return;
        const offset = (rect.top + rect.height / 2 - vh / 2) * factor;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      elements.forEach(({ el }) => {
        el.style.translate = "";
      });
    };
  }, []);
}
