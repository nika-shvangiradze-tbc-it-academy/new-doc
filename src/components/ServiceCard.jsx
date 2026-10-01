import React, { useContext, useId } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconArrowRight } from "./Icons";
import { ServiceFocusContext } from "./serviceFocus";

// Entrance order: the featured card (0) lands first, the rest follow in
// reading order around it.
const ENTER_ORDER = [0, 1, 2, 3, 5, 4];

export default function ServiceCard({
  index = 0,
  image,
  alt,
  icon,
  title,
  description,
  to,
  children,
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const focused = useContext(ServiceFocusContext);
  const isActive = focused === index;

  return (
    <div
      className={`services__item${isActive ? " is-active" : ""}`}
      role="listitem"
      data-slot={index}
      data-reveal
      style={{ "--reveal-delay": `${(ENTER_ORDER[index] ?? index) * 95}ms` }}
    >
      <article className="service-card" aria-labelledby={titleId}>
        <div className="service-card__surface">
          <div className="service-card__media">
            <img
              src={image}
              alt={alt}
              width="1080"
              height="720"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="service-card__body">
            <span className="service-card__icon" aria-hidden="true">
              {icon}
            </span>
            <div className="service-card__copy">
              <h3 id={titleId} className="service-card__title">
                {title}
              </h3>
              <p className="service-card__desc">{description}</p>
              {children}
            </div>
            <Link
              to={to}
              className="btn btn--primary service-card__cta"
              aria-describedby={titleId}
            >
              {t("show_more")}
              <span className="service-card__arrow" aria-hidden="true">
                <IconArrowRight className="btn__icon" />
              </span>
            </Link>
          </div>
          <span className="service-card__glare" aria-hidden="true" />
        </div>
      </article>
    </div>
  );
}
