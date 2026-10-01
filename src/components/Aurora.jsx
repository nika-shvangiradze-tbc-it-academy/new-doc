import React, { useEffect, useRef } from "react";

// Soft, slowly drifting light fields behind a section. Purely decorative:
// CSS animates transforms only, and they are paused while off-screen.
export default function Aurora({ variant }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) {
      el.setAttribute("data-active", "");
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => el.toggleAttribute("data-active", entry.isIntersecting),
      { rootMargin: "120px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`aurora aurora--${variant}`} aria-hidden="true">
      <span className="aurora__layer aurora__layer--1" data-depth="0.05">
        <span className="aurora__light" />
      </span>
      <span className="aurora__layer aurora__layer--2" data-depth="-0.035">
        <span className="aurora__light" />
      </span>
      <span className="aurora__layer aurora__layer--3" data-depth="0.08">
        <span className="aurora__light" />
      </span>
    </div>
  );
}
