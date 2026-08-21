// public/website/contact-form.js
//
// Submit backend for any page carrying <form id="contact-form">.
// Composed from library/features/contact-form/FEATURE.md and its atomics:
//   - field-agnostic-capture      every named control is captured; markup owns the field set
//   - honeypot-anti-spam          decoy field checked first, bots shown success, nothing written
//   - firebase-rtdb-write-adapter push() to the configured path, mailto fallback on failure
//
// The form's markup and styling belong to the page. This file only wires submit
// to a backend.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const CONFIG = window.NSC_CONTACT_CONFIG;
const forms  = document.querySelectorAll("form#contact-form");
if (!forms.length) { /* nothing to wire on this page */ }

// Fail loudly in the console rather than silently degrading. The documented
// failure mode is a form that looks fine and writes nothing, so say so here.
const configured = !!(CONFIG && CONFIG.FIREBASE_CONFIG && CONFIG.FIREBASE_CONFIG.databaseURL);
if (forms.length && !configured) {
  console.warn(
    "[contact-form] NSC_CONTACT_CONFIG.FIREBASE_CONFIG.databaseURL is empty. " +
    "Submissions will fall back to email instead of reaching Firebase. " +
    "Fill in public/website/contact-form.config.js."
  );
}

let db = null;
if (configured) {
  try {
    db = getDatabase(initializeApp(CONFIG.FIREBASE_CONFIG));
  } catch (err) {
    console.error("[contact-form] Firebase init failed:", err);
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const msg = (k) => (CONFIG && CONFIG.MESSAGES && CONFIG.MESSAGES[k]) || "";

function pageSlug() {
  const f = location.pathname.split("/").pop() || "index.html";
  return f.replace(/\.html$/, "") || "index";
}

function utmBundle() {
  if (!CONFIG || !CONFIG.CAPTURE_UTM) return {};
  const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  let stored = {};
  try { stored = JSON.parse(sessionStorage.getItem("nsc_utm") || "{}"); } catch (_) {}
  const q = new URLSearchParams(location.search);
  const fresh = {};
  KEYS.forEach(k => { const v = q.get(k); if (v) fresh[k] = v.slice(0, 190); });
  const merged = Object.keys(fresh).length ? fresh : stored;
  if (Object.keys(fresh).length) {
    try { sessionStorage.setItem("nsc_utm", JSON.stringify(fresh)); } catch (_) {}
  }
  return merged;
}

// Capture every named control in the form. The markup is the source of truth
// for the field set; the honeypot is the one deliberate exclusion.
function capture(form) {
  const honeypot = (CONFIG && CONFIG.HONEYPOT_FIELD) || "website";
  const record = {};
  form.querySelectorAll("input[name], select[name], textarea[name]").forEach(el => {
    if (el.name === honeypot) return;
    if (el.type === "submit" || el.type === "button") return;
    if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
    record[el.name] = typeof el.value === "string" ? el.value.trim() : el.value;
  });
  return record;
}

function mailtoFallback(record) {
  const to = (CONFIG && CONFIG.FALLBACK_EMAIL) || "";
  if (!to) return;
  const body = Object.entries(record)
    .filter(([k]) => !["page_slug", "submitted_at", "referrer"].includes(k))
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  const url = `mailto:${to}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

forms.forEach(form => {
  const statusEl = form.querySelector("[data-form-status]");
  const button   = form.querySelector('button[type="submit"]');
  const setStatus = (text, state) => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.dataset.state = state || "";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // 1. Honeypot, before anything else. A filled decoy is a bot: show the same
    //    success a human sees, write nothing, emit nothing.
    const honeypot = (CONFIG && CONFIG.HONEYPOT_FIELD) || "website";
    const decoy = form.querySelector(`[name="${honeypot}"]`);
    if (decoy && decoy.value.trim() !== "") {
      setStatus(msg("success"), "ok");
      form.reset();
      return;
    }

    // 2. Capture, then validate the required subset.
    const record = capture(form);
    const required = (CONFIG && CONFIG.REQUIRED_FIELDS) || [];
    const missing = required.filter(k => !record[k]);
    if (missing.length) {
      setStatus(msg("required"), "error");
      const first = form.querySelector(`[name="${missing[0]}"]`);
      if (first) first.focus();
      return;
    }
    if (record.email && !EMAIL_RE.test(record.email)) {
      setStatus(msg("badEmail"), "error");
      const el = form.querySelector('[name="email"]');
      if (el) el.focus();
      return;
    }

    // 3. Context the rules expect.
    Object.assign(record, utmBundle(), {
      page_slug: pageSlug(),
      submitted_at: Date.now()
    });
    if (document.referrer) record.referrer = document.referrer.slice(0, 490);

    // 4. Write.
    setStatus(msg("sending"), "pending");
    if (button) button.disabled = true;

    try {
      if (!db) throw new Error("Firebase not configured");
      await push(ref(db, CONFIG.RTDB_WRITE_PATH || "leads"), record);
      setStatus(msg("success"), "ok");
      form.reset();
      form.dispatchEvent(new CustomEvent("contact-form-submitted", {
        bubbles: true, detail: { page_slug: record.page_slug }
      }));
    } catch (err) {
      // A rules-drift rejection arrives here as a 401 with no CORS error.
      // Never drop the submission: hand it to the visitor's mail client.
      console.error("[contact-form] write failed:", err);
      setStatus(msg("failed"), "error");
      mailtoFallback(record);
    } finally {
      if (button) button.disabled = false;
    }
  });
});
