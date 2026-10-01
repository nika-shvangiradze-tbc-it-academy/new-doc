import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../Header";
import { useContact } from "../ContactModal";
import { IconArrowLeft, IconArrowRight } from "../Icons";
import { NAV_ITEMS } from "../../navigation";
import useReveal from "../../hooks/useReveal";
import PageHero from "./PageHero";

export default function InternalPage({
  title,
  image,
  imageAlt,
  imagePosition,
  variant = "list",
  children,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { openContact } = useContact();
  const { pathname } = useLocation();
  const currentPath = pathname.replace(/\/+$/, "");
  const currentItem = NAV_ITEMS.find((item) => item.to === currentPath);

  useReveal([i18n.language]);

  return (
    <>
      <Header />
      <main id="main" className={`page page--${variant}`}>
        <PageHero
          title={title}
          current={currentItem && t(currentItem.key).trim()}
        />

        <section className="page-body" aria-labelledby="page-title">
          <div className="container page-split">
            <figure className="page-media" data-reveal="left">
              <span className="page-media__shape" aria-hidden="true" />
              <span className="page-media__dots" aria-hidden="true" />
              <div className="page-media__frame">
                <img
                  src={image}
                  alt={imageAlt}
                  style={imagePosition ? { "--media-pos": imagePosition } : undefined}
                  decoding="async"
                />
              </div>
            </figure>

            <div className="page-content">
              {children}

              <div className="page-actions" data-reveal>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => navigate("/form")}
                >
                  <IconArrowLeft className="btn__icon btn__icon--lead" />
                  {t("back")}
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={openContact}
                >
                  {t("contact")}
                  <IconArrowRight className="btn__icon" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
