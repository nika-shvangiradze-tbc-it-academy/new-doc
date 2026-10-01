import { useEffect } from "react";

// Shifts `[data-pointer-depth]` layers inside the container by up to N px,
// eased towards the pointer. Desktop pointers only.
export default function usePointerDepth(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    const enabled = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    ).matches;
    if (!container || !enabled) return undefined;

    const layers = Array.from(container.querySelectorAll("[data-pointer-depth]")).map((el) => ({
      el,
      depth: parseFloat(el.getAttribute("data-pointer-depth")) || 0,
    }));

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    let last = 0;

    const tick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const k = 1 - Math.exp(-dt * 3.2);
      x += (targetX - x) * k;
      y += (targetY - y) * k;
      layers.forEach(({ el, depth }) => {
        el.style.translate = `${(-x * depth).toFixed(2)}px ${(-y * depth).toFixed(2)}px`;
      });
      if (Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001) {
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
      const rect = container.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      start();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    container.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      layers.forEach(({ el }) => {
        el.style.translate = "";
      });
    };
  }, [containerRef]);
}
