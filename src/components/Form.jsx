// src/components/Form.jsx
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Services from "./Services";
import { useContact } from "./ContactModal";
import { IconArrowRight } from "./Icons";
import Aurora from "./Aurora";
import useReveal from "../hooks/useReveal";
import useParallax from "../hooks/useParallax";
import usePointerDepth from "../hooks/usePointerDepth";
import useScrollDepth from "../hooks/useScrollDepth";

const HERO_SLIDES = [
  "/images/photo-3.jpg",
  "/images/photo-4.jpg",
  "/images/photo-5.jpg",
  "/images/photo-6.jpg",
  "/images/photo-1.jpg",
];

export default function Form() {
  const { t } = useTranslation();
  const { openContact } = useContact();
  const heroRef = useRef(null);
  const mediaRef = useRef(null);

  useReveal();
  useParallax(mediaRef, 0.3);
  usePointerDepth(heroRef);
  useScrollDepth();

  return (
    <>
      <Header overlay />

      <main id="main">
        <section ref={heroRef} className="hero on-dark" aria-labelledby="hero-title">
          <div
            ref={mediaRef}
            className="hero__media"
            data-pointer-depth="4"
            aria-hidden="true"
          >
            <div className="hero__media-drift">
              <div className="hero__media-zoom">
                {HERO_SLIDES.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="hero__slide"
                    style={{ "--i": index }}
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="hero__overlay" data-pointer-depth="6" aria-hidden="true" />
          <div className="hero__glow" data-pointer-depth="8" aria-hidden="true" />

          <div className="container hero__content" data-pointer-depth="1.5">
            <span className="accent-bar hero__accent" aria-hidden="true" />
            <h1 id="hero-title" className="hero__title">
              {t("title")}
            </h1>
            <p className="hero__lead">{t("description")}</p>
            <div className="hero__actions">
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={openContact}
              >
                {t("contact")}
                <IconArrowRight className="btn__icon" />
              </button>
              <a href="#services" className="btn btn--ghost btn--lg">
                {t("services")}
              </a>
            </div>
          </div>
        </section>

        <section className="section career" aria-labelledby="career-title">
          <Aurora variant="career" />
          <div className="container career__grid">
            <div className="career__media" data-reveal="left">
              <span className="career__shape" data-depth="0.035" aria-hidden="true" />
              <span className="career__dots" data-depth="-0.06" aria-hidden="true" />
              <img
                src="/images/photo-2.jpg"
                alt="Two surgeons in scrubs performing an operation under surgical lights"
                width="1080"
                height="1146"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="career__content" data-reveal="right">
              <span className="accent-bar" aria-hidden="true" />
              <h2 id="career-title" className="section-title">
                {t("career_title")}
              </h2>
              <p className="career__text">{t("career_subtitle")}</p>
              <button
                type="button"
                className="btn btn--primary btn--lg career__cta"
                onClick={openContact}
              >
                {t("contact")}
                <IconArrowRight className="btn__icon" />
              </button>
            </div>
          </div>
        </section>

        <Services />
      </main>
    </>
  );
}
