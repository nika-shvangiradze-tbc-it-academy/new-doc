import React, { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../navigation";
import { IconCheck, IconChevronDown } from "./Icons";

export default function LanguageSelect() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  const current =
    LANGUAGES.find((lang) => lang.code === i18n.language) ??
    LANGUAGES.find((lang) => lang.code === "en");

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code) => {
    setIsOpen(false);
    i18n.changeLanguage(code);
    triggerRef.current?.focus();
  };

  return (
    <div className="lang" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="lang__trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={`${t("language")}: ${current.name}`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <img
          src={current.flag}
          alt=""
          width="22"
          height="22"
          className="lang__flag"
        />
        <span className="lang__code">{current.label}</span>
        <IconChevronDown size={16} className="lang__chevron" />
      </button>

      {isOpen && (
        <ul id={menuId} className="lang__menu">
          {LANGUAGES.map((lang) => {
            const isCurrent = lang.code === current.code;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  lang={lang.htmlLang}
                  className={`lang__option${isCurrent ? " is-current" : ""}`}
                  aria-current={isCurrent ? "true" : undefined}
                  onClick={() => handleSelect(lang.code)}
                >
                  <img
                    src={lang.flag}
                    alt=""
                    width="22"
                    height="22"
                    className="lang__flag"
                  />
                  <span className="lang__option-code">{lang.label}</span>
                  <span className="lang__option-name">{lang.name}</span>
                  {isCurrent && <IconCheck size={16} className="lang__check" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
