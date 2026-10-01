import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  CONTACT_CHANNELS,
  externalLinkProps,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "../contact";
import { IconClose, IconPhone } from "./Icons";

const ContactContext = createContext({
  openContact: () => {},
});

export function useContact() {
  return useContext(ContactContext);
}

export function ContactProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openContact = useCallback(() => setIsOpen(true), []);
  const closeContact = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ openContact }), [openContact]);

  return (
    <ContactContext.Provider value={value}>
      {children}
      {isOpen && <ContactModal onClose={closeContact} />}
    </ContactContext.Provider>
  );
}

function ContactModal({ onClose }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    document.body.classList.add("is-locked");

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("is-locked");
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
      >
        <button
          type="button"
          className="modal__x"
          onClick={onClose}
          aria-label={t("close")}
        >
          <IconClose size={20} />
        </button>

        <span className="modal__badge" aria-hidden="true">
          <IconPhone size={22} />
        </span>
        <h2 id="contact-title" className="modal__title">
          {t("contact")}
        </h2>

        <ul className="contact-channels">
          {CONTACT_CHANNELS.map((channel) => (
            <li key={channel.name}>
              <a
                href={channel.href}
                {...externalLinkProps(channel.href)}
                className="contact-channels__link"
                aria-label={channel.name}
              >
                <img
                  src={channel.icon}
                  alt=""
                  width="32"
                  height="32"
                  className={channel.round ? "is-round" : undefined}
                />
              </a>
            </li>
          ))}
        </ul>

        <a href={PHONE_HREF} className="modal__phone">
          {PHONE_DISPLAY}
        </a>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="btn btn--outline modal__close"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
