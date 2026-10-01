import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} DOCBRIDGE</p>
        </div>
      </div>
    </footer>
  );
}
