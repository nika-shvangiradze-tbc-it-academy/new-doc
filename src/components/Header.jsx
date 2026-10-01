import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NAV_ITEMS } from "../navigation";
import { PHONE_DISPLAY, PHONE_HREF } from "../contact";
import { useContact } from "./ContactModal";
import LanguageSelect from "./LanguageSelect";
import { IconArrowRight, IconPhone } from "./Icons";

export default function Header({ overlay = false }) {
  const { t, i18n } = useTranslation();
  const { openContact } = useContact();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navMode, setNavMode] = useState("collapsed");
  const isCollapsed = navMode === "collapsed";

  const innerRef = useRef(null);
  const brandRef = useRef(null);
  const listRef = useRef(null);
  const actionsRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The nav labels differ a lot in length between languages, so instead of
  // fixed breakpoints the nav picks the first layout that actually fits:
  // single-line labels, then two-line labels, then the burger menu.
  const measure = useCallback(() => {
    const inner = innerRef.current;
    const list = listRef.current;
    if (!inner || !list) return;
    if (window.innerWidth < 1024) {
      setNavMode("collapsed");
      return;
    }
    const styles = getComputedStyle(inner);
    const gap = parseFloat(styles.columnGap) || 0;
    const contentWidth =
      inner.clientWidth -
      parseFloat(styles.paddingLeft) -
      parseFloat(styles.paddingRight);
    const fixedWidth = Array.from(actionsRef.current.children)
      .filter((el) => !el.classList.contains("burger"))
      .reduce((sum, el) => sum + el.offsetWidth, 0);
    const available =
      contentWidth - brandRef.current.offsetWidth - fixedWidth - gap * 4;

    const renderedClassName = list.className;
    list.className = "site-nav__list";
    const singleLineWidth = list.scrollWidth;
    list.className = "site-nav__list is-wrapped";
    const wrappedWidth = list.scrollWidth;
    list.className = renderedClassName;

    if (singleLineWidth <= available) setNavMode("full");
    else if (wrappedWidth <= available) setNavMode("wrapped");
    else setNavMode("collapsed");
  }, []);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(innerRef.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure, i18n.language]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isCollapsed) setIsMenuOpen(false);
  }, [isCollapsed]);

  useEffect(() => {
    if (menuRef.current) menuRef.current.inert = !isMenuOpen;
    if (!isMenuOpen) return;
    document.body.classList.add("is-locked");
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const isSolid = !overlay || isScrolled || isMenuOpen;

  const headerClasses = [
    "site-header",
    overlay && "site-header--overlay",
    isSolid ? "is-solid" : "on-dark",
    isCollapsed && "is-collapsed",
  ]
    .filter(Boolean)
    .join(" ");

  const navLinkClass = ({ isActive }) =>
    `site-nav__link${isActive ? " is-active" : ""}`;

  const handleContact = () => {
    setIsMenuOpen(false);
    openContact();
  };

  return (
    <>
      <a href="#main" className="skip-link">
        {t("skip_to_content")}
      </a>

      <header className={headerClasses}>
        <div ref={innerRef} className="container container--wide site-header__inner">
          <Link to="/" ref={brandRef} className="site-header__brand">
            <img
              src="/images/opt/lg-5.png"
              alt="DocBridge"
              width="256"
              height="263"
            />
          </Link>

          <nav className="site-nav" aria-label={t("services")}>
            <ul
              ref={listRef}
              className={`site-nav__list${navMode === "wrapped" ? " is-wrapped" : ""}`}
            >
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClass}>
                    {t(item.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div ref={actionsRef} className="site-header__actions">
            <LanguageSelect />
            <button
              type="button"
              className="btn btn--primary btn--sm site-header__cta"
              onClick={handleContact}
            >
              {t("contact")}
            </button>
            <button
              type="button"
              className={`burger${isMenuOpen ? " is-open" : ""}`}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? t("close") : t("menu")}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="burger__lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu${isMenuOpen ? " is-open" : ""}`}
      >
        <div
          className="mobile-menu__backdrop"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
        <div className="mobile-menu__panel">
          <nav className="mobile-menu__inner" aria-label={t("services")}>
            <ul className="mobile-menu__list">
              {NAV_ITEMS.map((item, index) => (
                <li key={item.to} style={{ "--i": index }}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `mobile-menu__link${isActive ? " is-active" : ""}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{t(item.key)}</span>
                    <IconArrowRight size={18} className="mobile-menu__arrow" />
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mobile-menu__footer" style={{ "--i": NAV_ITEMS.length }}>
              <button
                type="button"
                className="btn btn--primary btn--lg mobile-menu__cta"
                onClick={handleContact}
              >
                {t("contact")}
              </button>
              <a href={PHONE_HREF} className="mobile-menu__phone">
                <IconPhone size={18} />
                {PHONE_DISPLAY}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
