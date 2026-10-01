import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PageHero({ title, current }) {
  const { t } = useTranslation();

  return (
    <header className="page-hero">
      <div className="container page-hero__inner">
        <nav className="breadcrumb" aria-label={t("breadcrumb")}>
          <ol className="breadcrumb__list">
            <li>
              <Link to="/">{t("home")}</Link>
            </li>
            <li>
              <Link to={{ pathname: "/", hash: "#services" }}>
                {t("services").trim()}
              </Link>
            </li>
            {current && <li aria-current="page">{current}</li>}
          </ol>
        </nav>
        <span className="accent-bar page-hero__accent" aria-hidden="true" />
        <h1 id="page-title" className="page-hero__title">
          {title}
        </h1>
      </div>
    </header>
  );
}
