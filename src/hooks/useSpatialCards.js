import { useEffect } from "react";

const TILT_X = 3.5; // deg
const TILT_Y = 4.5;
const MAGNET = 3; // px
const MAGNET_RANGE = 140; // px from the card edge
const IMAGE_SHIFT = 6;
const ICON_SHIFT = 3;
const TEXT_SHIFT = 1.2;
const ARROW_SHIFT = 2;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const KEYS = ["rx", "ry", "mx", "my", "nx", "ny", "glow"];

// Pointer-driven depth for `.services__item` cards inside `stageRef`:
// tilt + magnetic pull on the surface, and independent parallax for the
// image, icon, copy and CTA arrow, all eased in one rAF loop.
export default function useSpatialCards(stageRef, enabled) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!enabled || !stage) return undefined;

    const cards = Array.from(stage.querySelectorAll(".services__item")).map((item) => ({
      item,
      surface: item.querySelector(".service-card__surface"),
      image: item.querySelector(".service-card__media img"),
      icon: item.querySelector(".service-card__icon"),
      copy: item.querySelector(".service-card__copy"),
      arrow: item.querySelector(".service-card__arrow"),
      glare: item.querySelector(".service-card__glare"),
      rect: null,
      cur: { rx: 0, ry: 0, mx: 0, my: 0, nx: 0, ny: 0, glow: 0 },
      tgt: { rx: 0, ry: 0, mx: 0, my: 0, nx: 0, ny: 0, glow: 0 },
      gx: 0,
      gy: 0,
      resting: true,
    }));

    let pointer = null;
    let rectsDirty = true;
    let frame = 0;
    let last = 0;

    const setTargets = () => {
      cards.forEach((card) => {
        const { tgt } = card;
        if (!pointer) {
          KEYS.forEach((key) => {
            tgt[key] = 0;
          });
          return;
        }
        const r = card.rect;
        const nx = (pointer.x - (r.left + r.width / 2)) / (r.width / 2);
        const ny = (pointer.y - (r.top + r.height / 2)) / (r.height / 2);
        const inside = Math.abs(nx) <= 1 && Math.abs(ny) <= 1;
        const edgeDx = Math.max(r.left - pointer.x, 0, pointer.x - r.right);
        const edgeDy = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom);
        const pull = inside ? 1 : Math.max(0, 1 - Math.hypot(edgeDx, edgeDy) / MAGNET_RANGE);

        tgt.mx = clamp(nx, -1, 1) * MAGNET * pull;
        tgt.my = clamp(ny, -1, 1) * MAGNET * pull;
        tgt.rx = inside ? -ny * TILT_X : 0;
        tgt.ry = inside ? nx * TILT_Y : 0;
        tgt.nx = inside ? nx : 0;
        tgt.ny = inside ? ny : 0;
        tgt.glow = inside ? 1 : 0;
        if (inside) {
          card.gx = pointer.x - r.left;
          card.gy = pointer.y - r.top;
        }
      });
    };

    const tick = (now) => {
      frame = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const k = 1 - Math.exp(-dt * 7);

      if (rectsDirty) {
        cards.forEach((card) => {
          card.rect = card.item.getBoundingClientRect();
        });
        rectsDirty = false;
      }
      setTargets();

      let moving = false;
      cards.forEach((card) => {
        const { cur, tgt } = card;
        let settled = true;
        KEYS.forEach((key) => {
          cur[key] += (tgt[key] - cur[key]) * k;
          if (Math.abs(tgt[key] - cur[key]) > 0.002) settled = false;
          else cur[key] = tgt[key];
        });
        if (!settled) moving = true;

        const atRest = KEYS.every((key) => cur[key] === 0);
        if (atRest && card.resting) return;
        card.resting = atRest;

        card.surface.style.transform = atRest
          ? ""
          : `perspective(1100px) translate3d(${cur.mx.toFixed(2)}px, ${cur.my.toFixed(2)}px, 0) rotateX(${cur.rx.toFixed(3)}deg) rotateY(${cur.ry.toFixed(3)}deg)`;
        card.image.style.translate = atRest
          ? ""
          : `${(-cur.nx * IMAGE_SHIFT).toFixed(2)}px ${(-cur.ny * IMAGE_SHIFT).toFixed(2)}px`;
        card.icon.style.translate = atRest
          ? ""
          : `${(cur.nx * ICON_SHIFT).toFixed(2)}px ${(cur.ny * ICON_SHIFT).toFixed(2)}px`;
        card.copy.style.translate = atRest
          ? ""
          : `${(cur.nx * TEXT_SHIFT).toFixed(2)}px ${(cur.ny * TEXT_SHIFT).toFixed(2)}px`;
        card.arrow.style.translate = atRest ? "" : `${(cur.nx * ARROW_SHIFT).toFixed(2)}px 0`;
        card.glare.style.opacity = cur.glow.toFixed(3);
        card.glare.style.transform = `translate3d(${card.gx.toFixed(1)}px, ${card.gy.toFixed(1)}px, 0)`;
      });

      if (moving) frame = requestAnimationFrame(tick);
      else last = 0;
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      start();
    };
    const onLeave = () => {
      pointer = null;
      start();
    };
    const invalidate = () => {
      rectsDirty = true;
      if (pointer) start();
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(stage);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      resizeObserver.disconnect();
      cards.forEach((card) => {
        card.surface.style.transform = "";
        card.image.style.translate = "";
        card.icon.style.translate = "";
        card.copy.style.translate = "";
        card.arrow.style.translate = "";
        card.glare.style.opacity = "";
        card.glare.style.transform = "";
      });
    };
  }, [stageRef, enabled]);
}
