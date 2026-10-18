/* ============================================================
   CLINICAL CANNA COACHING: script.js
   The "site-wide brain." Edit this ONCE and every page updates:
   the menu, the footer, the booking link, the SEO basics.
   To add a page later: create newpage.html, link styles.css +
   script.js, drop in <header id="site-header"> and
   <footer id="site-footer">, then add the page to SITE.nav below.
   ============================================================ */

const SITE = {
  name: "Clinical Canna Coaching",
  tagline: "Cannabis, with a clear head. Coaching for adults 21+.",
  email: "hello@clinicalcannacoach.com",

  /* 👉 Paste your real scheduler link here (Calendly / Cal.com / Acuity).
     It auto-fills every "Book" button on the site. */
  bookingUrl: "https://calendly.com/your-handle/consult",

  /* The nav. An item with `children` becomes a dropdown automatically.
     `href` can be an in-page anchor (#about) or another page (services.html). */
  nav: [
    { label: "What is it?", href: "#about" },
    {
      label: "Services", href: "#services",
      children: [
        { label: "1:1 Coaching",            href: "#services" },
        { label: "Canna 101 (New users)",   href: "#services" },
        { label: "Mindful Use & Resets",    href: "#services" },
        { label: "Dispensary Prep",         href: "#services" },
        { label: "Cannabis & Routines",     href: "#services" },
        { label: "Workshops & Groups",      href: "#services" }
      ]
    },
    { label: "Resources", href: "#resources" },
    { label: "Schedule",  href: "#schedule" }
  ],

  /* Footer link columns */
  footer: [
    {
      heading: "Explore",
      links: [
        { label: "What is coaching?", href: "#about" },
        { label: "Services",          href: "#services" },
        { label: "Resources",         href: "#resources" },
        { label: "Schedule",          href: "#schedule" }
      ]
    },
    {
      heading: "Connect",
      links: [
        { label: "Email us",   href: "mailto:hello@clinicalcannacoach.com" },
        { label: "Instagram",  href: "#" },
        { label: "Newsletter", href: "#resources" }
      ]
    }
  ],

  disclaimer: "Clinical Canna Coaching provides education and wellness coaching only. It is not medical care, diagnosis, treatment, or a substitute for advice from a licensed healthcare provider. Services are for adults 21+ and intended for use only where cannabis is legal. Always follow your local laws."
};

/* ---------- BUILD HEADER ---------- */
function buildHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;

  const links = SITE.nav.map(item => {
    if (item.children) {
      const sub = item.children
        .map(c => `<li><a href="${c.href}">${c.label}</a></li>`).join("");
      return `
        <li class="nav__item nav__item--has-children">
          <a class="nav__link" href="${item.href}" aria-haspopup="true">${item.label} ▾</a>
          <ul class="nav__panel">${sub}</ul>
        </li>`;
    }
    return `<li class="nav__item"><a class="nav__link" href="${item.href}">${item.label}</a></li>`;
  }).join("");

  host.innerHTML = `
    <nav class="wrap nav" aria-label="Primary">
      <a class="brand" href="#top" aria-label="${SITE.name} home">
        <img class="brand__logo" src="./ccclogo.jpg" alt="Cannabis Coach logo" />
        <span class="brand__name">Clinical Canna</span>
      </a>
      <button class="nav__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="primary-menu">
        <span></span>
      </button>
      <ul class="nav__list" id="primary-menu">
        ${links}
        <li class="nav__cta"><a class="btn btn--primary" href="${SITE.bookingUrl}" target="_blank" rel="noopener">Book consult</a></li>
      </ul>
    </nav>`;

  // mobile toggle
  const toggle = host.querySelector(".nav__toggle");
  const list = host.querySelector(".nav__list");
  toggle.addEventListener("click", () => {
    const open = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  // close menu after tapping a link (mobile)
  list.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      list.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- BUILD FOOTER ---------- */
function buildFooter() {
  const host = document.getElementById("site-footer");
  if (!host) return;

  const cols = SITE.footer.map(col => `
    <div class="footer__col">
      <h4>${col.heading}</h4>
      <ul>${col.links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>
    </div>`).join("");

  host.innerHTML = `
    <div class="wrap">
      <div class="footer__grid">
        <div class="footer__brand">
          <img class="brand__logo footer__logo" src="./ccclogo.jpg" alt="Cannabis Coach logo" />
          <span class="brand__name">Clinical Canna Coaching</span>
          <p class="footer__tag">${SITE.tagline}</p>
        </div>
        ${cols}
      </div>
      <p class="footer__disclaimer" style="display:block;line-height:1.6">${SITE.disclaimer}</p>
      <div class="footer__disclaimer">
        <span>&copy; <span id="year"></span> ${SITE.name}. All rights reserved.</span>
        <span>Education, not medical advice &middot; 21+</span>
      </div>
    </div>`;
}

/* ---------- WIRE UP BOOKING BUTTONS ---------- */
function wireBooking() {
  const btn = document.getElementById("booking-btn");
  if (btn) { btn.href = SITE.bookingUrl; btn.target = "_blank"; btn.rel = "noopener"; }
}

/* ---------- GA4 EVENT TRACKING ----------
   Fires named GA4 events on the actions that matter (lead conversions).
   After these fire once, mark them as "Key events" in GA4:
   Admin → Events → toggle "Mark as key event", or Admin → Key events → New.
   Primary conversion: book_consult_click. Secondary: email_click. */
function track(name, params) {
  if (typeof window.gtag === "function") window.gtag("event", name, params || {});
}

function wireAnalytics() {
  const isBooking = href =>
    href && SITE.bookingUrl && href.indexOf(SITE.bookingUrl) === 0;

  document.querySelectorAll("a[href]").forEach(a => {
    const href = a.getAttribute("href") || "";

    // Primary conversion: clicked through to the scheduler
    if (isBooking(href) || a.id === "booking-btn") {
      a.addEventListener("click", () => track("book_consult_click", {
        link_text: a.textContent.trim(),
        link_location: a.closest(".site-header") ? "header"
                     : a.closest(".schedule__card") ? "schedule_card" : "page",
        link_url: SITE.bookingUrl
      }));

    // Secondary lead: emailed to schedule / get in touch
    } else if (href.indexOf("mailto:") === 0) {
      a.addEventListener("click", () => track("email_click", {
        link_text: a.textContent.trim(),
        email: href.replace("mailto:", "").split("?")[0]
      }));

    // Funnel step: in-page CTA that scrolls to the Schedule section
    } else if (href === "#schedule") {
      a.addEventListener("click", () => track("schedule_cta_click", {
        link_text: a.textContent.trim(),
        link_location: a.closest(".hero") ? "hero"
                     : a.closest(".section--services") ? "services" : "page"
      }));
    }
  });
}

/* ---------- SCROLL-SPY (highlights active section in nav) ---------- */
function scrollSpy() {
  const links = [...document.querySelectorAll('.nav__link[href^="#"]')];
  const map = links.map(l => ({ link: l, sec: document.querySelector(l.getAttribute("href")) }))
                   .filter(x => x.sec);
  if (!map.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        map.forEach(m => m.link.classList.toggle("is-active", m.sec === e.target));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  map.forEach(m => obs.observe(m.sec));
}

/* ---------- REVEAL ON SCROLL ---------- */
function revealOnScroll() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(el => el.classList.add("is-in")); return;
  }
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("is-in"), (i % 6) * 70);
        o.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  buildFooter();
  wireBooking();
  wireAnalytics();
  scrollSpy();
  revealOnScroll();
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
