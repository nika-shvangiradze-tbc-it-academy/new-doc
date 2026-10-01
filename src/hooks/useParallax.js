import { useEffect } from "react";

export default function useParallax(ref, factor = 0.25) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = window.scrollY;
      if (offset > window.innerHeight * 1.2) return;
      el.style.transform = `translate3d(0, ${offset * factor}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref, factor]);
}
