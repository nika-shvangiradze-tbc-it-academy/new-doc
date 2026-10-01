import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconArrowLeft, IconArrowRight, IconPause, IconPlay } from "./Icons";
import useMediaQuery from "../hooks/useMediaQuery";

const GALLERY_IMAGES = [
  { src: "/images/opt/vutemberg.jpg", alt: "Baden-Württemberg, Germany", width: 512, height: 341 },
  { src: "/images/munich.jpg", alt: "Munich, Germany", width: 1500, height: 938 },
  { src: "/images/opt/berlin.jpg", alt: "Berlin, Germany", width: 800, height: 600 },
  { src: "/images/opt/ph-10.jpg", alt: "Bode Museum on the Spree with the Berlin TV Tower in the background", width: 960, height: 640 },
  { src: "/images/bremen.jpg", alt: "Bremen, Germany", width: 910, height: 607 },
  { src: "/images/opt/hamburg.jpg", alt: "Hamburg, Germany", width: 960, height: 600 },
  { src: "/images/hese.jpg", alt: "Hesse, Germany", width: 768, height: 432 },
  { src: "/images/ph-1.webp", alt: "Landmark in Germany", width: 960, height: 640 },
  { src: "/images/opt/munichas.jpg", alt: "Munich skyline, Germany", width: 960, height: 594 },
  { src: "/images/opt/bl.jpg", alt: "City view in Germany", width: 960, height: 639 },
  { src: "/images/brl.webp", alt: "Berlin TV Tower and city skyline at dusk", width: 734, height: 475 },
  { src: "/images/opt/trg.jpg", alt: "Aerial view of a German castle with formal gardens", width: 960, height: 640 },
  { src: "/images/photo-2.jpg", alt: "Surgeons performing an operation", width: 1080, height: 1146 },
];

// The ribbon is rendered twice; the second copy sits exactly one loop width
// after the first, so wrapping the offset by that width is visually seamless.
const SLIDES = [
  ...GALLERY_IMAGES.map((image) => ({ ...image, clone: false })),
  ...GALLERY_IMAGES.map((image) => ({ ...image, clone: true })),
];

// -1 drifts the ribbon to the right, 1 to the left.
const FLOW = -1;
const SPEED_FINE = 34; // px/s
const SPEED_TOUCH = 24;
const MAX_FLING = 2200;
const TILT_X = 2; // deg
const TILT_Y = 3;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_QUERY = "(hover: hover) and (pointer: fine)";

const mod = (value, size) => ((value % size) + size) % size;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const ease = (dt, rate) => 1 - Math.exp(-dt * rate);

export default function Gallery() {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const viewportRef = useRef(null);
  const sceneRef = useRef(null);
  const trackRef = useRef(null);
  const engineRef = useRef(null);
  const pausedRef = useRef(false);
  const reduced = useMediaQuery(REDUCED_QUERY);
  const [paused, setPaused] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
    engineRef.current?.wake();
  }, [paused]);

  // Images inside the clipped, transformed ribbon never "intersect" on their
  // own, so native lazy loading would pop them in late. Load them all once
  // the gallery approaches the viewport instead.
  useEffect(() => {
    const root = rootRef.current;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;

    if (reduced) {
      const step = () => {
        const item = trackRef.current.querySelector(".gallery__item");
        const gap = parseFloat(getComputedStyle(trackRef.current).columnGap) || 0;
        return item ? item.offsetWidth + gap : viewport.clientWidth;
      };
      engineRef.current = {
        wake() {},
        nudge(direction) {
          viewport.scrollBy({ left: direction * step(), behavior: "auto" });
        },
      };
      return () => {
        engineRef.current = null;
      };
    }

    const scene = sceneRef.current;
    const track = trackRef.current;
    const items = Array.from(track.children);
    const shades = items.map((item) => item.querySelector(".gallery__shade"));
    const glares = items.map((item) => item.querySelector(".gallery__glare"));
    const count = GALLERY_IMAGES.length;
    const fineQuery = window.matchMedia(FINE_QUERY);

    const lift = new Float32Array(items.length);
    const parked = new Uint8Array(items.length);

    const s = {
      fine: fineQuery.matches,
      pos: 0,
      v: 0,
      pending: 0,
      loopW: 1,
      step: 1,
      cardW: 1,
      cardH: 1,
      padTop: 0,
      stageW: 1,
      measured: false,
      visible: false,
      frame: 0,
      last: 0,
      hover: false,
      focused: false,
      clientX: 0,
      clientY: 0,
      lastPx: 0,
      pointerId: null,
      dragging: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastT: 0,
      dragV: 0,
      tiltX: 0,
      tiltY: 0,
      mouse: 0,
      hovered: -1,
      glareX: 0,
      glareY: 0,
    };

    const measure = () => {
      const itemStyle = getComputedStyle(items[0]);
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      s.cardW = parseFloat(itemStyle.width) || items[0].offsetWidth;
      s.cardH = parseFloat(itemStyle.height) || items[0].offsetHeight;
      s.step = s.cardW + gap;
      s.loopW = s.step * count;
      s.stageW = viewport.clientWidth || 1;
      s.padTop = parseFloat(getComputedStyle(viewport).paddingTop) || 0;
      if (!s.measured) {
        // Start with the first image centred.
        s.pos = -(s.stageW / 2 - s.cardW / 2);
        s.measured = true;
      }
      parked.fill(0);
    };

    const setHovered = (index) => {
      if (index === s.hovered) return;
      if (s.hovered >= 0) items[s.hovered].classList.remove("is-hovered");
      s.hovered = index;
      if (index >= 0) items[index].classList.add("is-hovered");
    };

    const tick = (now) => {
      s.frame = 0;
      const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 0;
      s.last = now;

      // Reads first, then writes, so the frame never forces a sync layout.
      const pointerInside = s.hover && s.fine && !s.dragging;
      let px = 0;
      let py = 0;
      let stageH = 1;
      if (pointerInside) {
        const rect = viewport.getBoundingClientRect();
        px = s.clientX - rect.left;
        py = s.clientY - rect.top;
        stageH = rect.height || 1;
        s.lastPx = px;
      }

      const speed = s.fine ? SPEED_FINE : SPEED_TOUCH;
      const holding = s.hover || s.focused || pausedRef.current;
      const target = holding ? 0 : FLOW * speed;

      if (!s.dragging) {
        s.v += (target - s.v) * ease(dt, 1.8);
        let nudge = s.pending * ease(dt, 5);
        if (Math.abs(s.pending - nudge) < 0.05) nudge = s.pending;
        s.pending -= nudge;
        s.pos += s.v * dt + nudge;
      }
      s.pos = mod(s.pos, s.loopW);

      const trackX = -s.pos;
      const half = s.stageW / 2;
      const intensity = s.fine ? 1 : 0.55;
      const limit = 1 + (s.cardW / 2 + 48) / half;

      let hovered = -1;
      if (pointerInside && py >= s.padTop && py <= s.padTop + s.cardH) {
        const along = px - trackX;
        const index = Math.floor(along / s.step);
        if (index >= 0 && index < items.length && along - index * s.step <= s.cardW) {
          hovered = index;
        }
      }
      if (hovered !== s.hovered && hovered >= 0) {
        s.glareX = px - (trackX + hovered * s.step);
        s.glareY = py - s.padTop;
      }
      setHovered(hovered);

      s.mouse += ((pointerInside ? 1 : 0) - s.mouse) * ease(dt, 4);
      const nx = pointerInside ? clamp((px / s.stageW) * 2 - 1, -1, 1) : 0;
      const ny = pointerInside ? clamp((py / stageH) * 2 - 1, -1, 1) : 0;
      s.tiltY += (nx * TILT_Y - s.tiltY) * ease(dt, 3);
      s.tiltX += (-ny * TILT_X - s.tiltX) * ease(dt, 3);

      track.style.transform = `translate3d(${trackX.toFixed(2)}px,0,0)`;
      scene.style.transform = `perspective(2200px) rotateX(${s.tiltX.toFixed(3)}deg) rotateY(${s.tiltY.toFixed(3)}deg)`;

      let settling = false;
      for (let i = 0; i < items.length; i += 1) {
        const left = trackX + i * s.step;
        const center = left + s.cardW / 2;
        const d = (center - half) / half;
        const a = Math.abs(d);

        if (a > limit) {
          lift[i] = 0;
          if (!parked[i]) {
            items[i].style.transform = "perspective(1400px) translate3d(0,0,-70px) scale(0.94)";
            parked[i] = 1;
          }
          continue;
        }
        parked[i] = 0;

        const tt = Math.min(1, a);
        const e = tt * tt * (3 - 2 * tt);
        const goal = i === hovered ? 1 : 0;
        lift[i] += (goal - lift[i]) * ease(dt, 7);
        if (Math.abs(goal - lift[i]) > 0.002) settling = true;

        const proximity = s.mouse * Math.max(0, 1 - Math.abs(center - s.lastPx) / (s.step * 1.4));
        const z = -70 * e * intensity + lift[i] * 34 + proximity * 12;
        const ry = Math.sign(d) * 10 * e * intensity;
        const scale = 1 - 0.06 * e * intensity;

        items[i].style.transform = `perspective(1400px) translate3d(0,0,${z.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
        shades[i].style.opacity = (0.26 * e * intensity).toFixed(3);
      }

      if (hovered >= 0) {
        const glareSize = s.cardW * 1.2;
        const gx = px - (trackX + hovered * s.step);
        const gy = py - s.padTop;
        s.glareX += (gx - s.glareX) * ease(dt, 10);
        s.glareY += (gy - s.glareY) * ease(dt, 10);
        glares[hovered].style.transform = `translate3d(${(s.glareX - glareSize / 2).toFixed(1)}px,${(s.glareY - glareSize / 2).toFixed(1)}px,0)`;
      }

      const active =
        target !== 0 ||
        s.dragging ||
        s.hover ||
        settling ||
        s.pending !== 0 ||
        Math.abs(s.v) > 0.5 ||
        s.mouse > 0.002 ||
        Math.abs(s.tiltX) > 0.002 ||
        Math.abs(s.tiltY) > 0.002;

      if (active && s.visible) s.frame = requestAnimationFrame(tick);
      else s.last = 0;
    };

    const wake = () => {
      if (s.frame || !s.visible) return;
      s.last = 0;
      s.frame = requestAnimationFrame(tick);
    };

    const sleep = () => {
      cancelAnimationFrame(s.frame);
      s.frame = 0;
      s.last = 0;
    };

    const onPointerEnter = (event) => {
      if (event.pointerType !== "mouse") return;
      s.hover = true;
      s.clientX = event.clientX;
      s.clientY = event.clientY;
      wake();
    };

    const onPointerLeave = (event) => {
      if (event.pointerType !== "mouse") return;
      s.hover = false;
      wake();
    };

    const onPointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      s.pointerId = event.pointerId;
      s.startX = s.lastX = event.clientX;
      s.startY = event.clientY;
      s.lastT = event.timeStamp;
      s.dragV = 0;
      if (event.pointerType === "mouse") event.preventDefault();
    };

    const onPointerMove = (event) => {
      if (event.pointerType === "mouse") {
        s.clientX = event.clientX;
        s.clientY = event.clientY;
        s.hover = true;
        wake();
      }
      if (event.pointerId !== s.pointerId) return;

      if (!s.dragging) {
        const dx = event.clientX - s.startX;
        const dy = event.clientY - s.startY;
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          s.pointerId = null;
          return;
        }
        if (Math.abs(dx) < 6) return;
        s.dragging = true;
        s.pending = 0;
        stage.classList.add("is-dragging");
        try {
          stage.setPointerCapture(event.pointerId);
        } catch {
          // Pointer already released.
        }
        setHovered(-1);
      }

      const delta = event.clientX - s.lastX;
      const elapsed = Math.max(1, event.timeStamp - s.lastT);
      s.pos -= delta;
      s.dragV = s.dragV * 0.6 + ((-delta / elapsed) * 1000) * 0.4;
      s.lastX = event.clientX;
      s.lastT = event.timeStamp;
      wake();
    };

    const onPointerUp = (event) => {
      if (event.pointerId !== s.pointerId) return;
      if (s.dragging) {
        const idle = event.timeStamp - s.lastT;
        s.v = idle > 90 ? 0 : clamp(s.dragV, -MAX_FLING, MAX_FLING);
        stage.classList.remove("is-dragging");
      }
      s.dragging = false;
      s.pointerId = null;
      wake();
    };

    const onFocusIn = () => {
      s.focused = stage.matches(":focus-visible");
      wake();
    };

    const onFocusOut = () => {
      s.focused = false;
      wake();
    };

    const onFineChange = () => {
      s.fine = fineQuery.matches;
      if (!s.fine) {
        s.hover = false;
        setHovered(-1);
      }
      wake();
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      wake();
    });
    resizeObserver.observe(viewport);

    let intersectionObserver = null;
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          s.visible = entry.isIntersecting;
          if (s.visible) wake();
          else sleep();
        },
        { rootMargin: "80px 0px" }
      );
      intersectionObserver.observe(viewport);
    } else {
      s.visible = true;
      wake();
    }

    stage.addEventListener("pointerenter", onPointerEnter);
    stage.addEventListener("pointerleave", onPointerLeave);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("focusin", onFocusIn);
    stage.addEventListener("focusout", onFocusOut);
    fineQuery.addEventListener("change", onFineChange);

    engineRef.current = {
      wake,
      nudge(direction) {
        s.pending += direction * s.step;
        wake();
      },
    };

    return () => {
      sleep();
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      stage.removeEventListener("pointerenter", onPointerEnter);
      stage.removeEventListener("pointerleave", onPointerLeave);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("focusout", onFocusOut);
      fineQuery.removeEventListener("change", onFineChange);
      stage.classList.remove("is-dragging");
      track.style.transform = "";
      scene.style.transform = "";
      items.forEach((item, i) => {
        item.style.transform = "";
        item.classList.remove("is-hovered");
        shades[i].style.opacity = "";
        glares[i].style.transform = "";
      });
      engineRef.current = null;
    };
  }, [reduced]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      engineRef.current?.nudge(event.key === "ArrowLeft" ? -1 : 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className="gallery"
      data-reveal="zoom"
      data-motion={reduced ? "static" : "flow"}
    >
      <div
        ref={stageRef}
        className="gallery__stage"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("gallery")}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div ref={viewportRef} className="gallery__viewport">
          <div ref={sceneRef} className="gallery__scene">
            <ul ref={trackRef} className="gallery__track">
              {SLIDES.map((image, index) => (
                <li
                  key={`${image.src}-${index}`}
                  className="gallery__item"
                  aria-hidden={image.clone || undefined}
                  data-clone={image.clone || undefined}
                >
                  <div className="gallery__frame">
                    <img
                      src={image.src}
                      alt={image.clone ? "" : image.alt}
                      width={image.width}
                      height={image.height}
                      loading={near ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                    />
                    <span className="gallery__shade" aria-hidden="true" />
                    <span className="gallery__glare" aria-hidden="true" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container gallery__controls">
        {!reduced && (
          <button
            type="button"
            className="gallery__btn"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? t("gallery_play") : t("gallery_pause")}
          >
            {paused ? <IconPlay size={16} /> : <IconPause size={16} />}
          </button>
        )}
        <button
          type="button"
          className="gallery__btn"
          onClick={() => engineRef.current?.nudge(-1)}
          aria-label={t("gallery_prev")}
        >
          <IconArrowLeft size={18} />
        </button>
        <button
          type="button"
          className="gallery__btn"
          onClick={() => engineRef.current?.nudge(1)}
          aria-label={t("gallery_next")}
        >
          <IconArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
