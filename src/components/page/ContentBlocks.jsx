import React from "react";
import { IconCheck, IconExternalLink } from "../Icons";

const collapse = (text = "") => text.replace(/\s+/g, " ").trim();
const pad = (n) => String(n).padStart(2, "0");

const splitBullets = (text = "") =>
  text.split("•").map(collapse).filter(Boolean);

// "Doctor-patient conversation: You will…" → run-in bold lead. Only applies
// when the colon closes a short label and real text follows it.
function splitLead(text) {
  const clean = collapse(text);
  const index = clean.indexOf(":");
  if (index > 0 && index <= 80 && clean.length - index > 24) {
    return [clean.slice(0, index + 1), clean.slice(index + 1).trim()];
  }
  return [null, clean];
}

function ItemBody({ description = "", title = "" }) {
  const [lead, rest] = splitLead(description);
  const extra = collapse(title);
  const isLink = /^https?:\/\//.test(extra);
  const bullets = extra && !isLink ? splitBullets(title) : [];

  return (
    <div className="item-body">
      <p className="item-body__text">
        {lead && <strong className="item-body__lead">{lead} </strong>}
        {rest}
      </p>
      {isLink && (
        <a href={extra} className="item-link">
          <IconExternalLink size={18} className="item-link__icon" />
          <span>{extra}</span>
        </a>
      )}
      {bullets.length > 0 && (
        <ul className="check-list" role="list">
          {bullets.map((bullet, index) => (
            <li key={index}>
              <IconCheck size={20} strokeWidth={2.6} className="check-list__icon" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const hasBullets = (item) => {
  const extra = collapse(item.title);
  return Boolean(extra) && !/^https?:\/\//.test(extra);
};

/* Template A — numbered information rows */
export function InfoList({ items }) {
  return (
    <ol className="info-list" role="list">
      {items.map((item, index) => (
        <li key={item.id} data-reveal="right" style={{ "--i": index }}>
          <div className="info-row">
            <span className="index-badge" aria-hidden="true">
              {pad(index + 1)}
            </span>
            <ItemBody {...item} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Template B — document / requirement cards */
export function DocList({ items, marker = "number" }) {
  const isChecklist = marker === "check";

  return (
    <ol
      className={`doc-list${isChecklist ? " doc-list--grid" : ""}`}
      role="list"
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          className={hasBullets(item) ? "doc-list__item--wide" : undefined}
          data-reveal="right"
          style={{ "--i": index }}
        >
          <div className={`doc-card${isChecklist ? " doc-card--check" : ""}`}>
            {isChecklist ? (
              <span className="doc-card__check" aria-hidden="true">
                <IconCheck size={18} strokeWidth={2.6} />
              </span>
            ) : (
              <span className="index-badge" aria-hidden="true">
                {pad(index + 1)}
              </span>
            )}
            <ItemBody {...item} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Template C — process timeline */
export function Timeline({ items }) {
  return (
    <ol className="timeline" role="list">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="timeline__step"
          data-reveal="right"
          style={{ "--i": index }}
        >
          <span className="timeline__marker" aria-hidden="true">
            {pad(index + 1)}
          </span>
          <div className="timeline__card">
            <ItemBody {...item} />
          </div>
        </li>
      ))}
    </ol>
  );
}
