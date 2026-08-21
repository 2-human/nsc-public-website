// public/website/contact-form.config.js
//
// Project input for the contact-form composition
// (library/features/contact-form/FEATURE.md).
//
// Per library/features/firebase-config-global/FEATURE.md the config global is
// named {PROJECT}_CONTACT_CONFIG. For nsc that is NSC_CONTACT_CONFIG. One
// global, many readers: if a review widget is ever added to this site it reads
// this same global and binds to the same [DEFAULT] Firebase app.
//
// LOAD RULE, do not break this: this file must be loaded by an unconditional
// top-level <script> on every page carrying the form, ahead of contact-form.js.
// It must never sit behind a conditional or auth-gated loader. When glinda put
// its config inside an auth-gate branch, every non-authed visitor got an
// undefined config, the write adapter fell back to "captured locally", and
// roughly 21 days of leads were lost with the backend perfectly healthy.
//
// API key safety: Firebase Web config values are identifiers, not secrets.
// They are designed to be public and are safe to commit and serve. Access is
// controlled by the database rules in brand/firebase-rules.json, not by hiding
// these values.

window.NSC_CONTACT_CONFIG = {

  // ---- Backend connection -------------------------------------------------
  // Project north-star-communications, RTDB in europe-west1.
  // Configured 2026-08-20. These are identifiers, not secrets: access is
  // controlled by brand/firebase-rules.json, not by hiding these values.
  FIREBASE_CONFIG: {
    apiKey:            "AIzaSyC7mUGU6LTwqc77MK0hJ8OXkS5tCkd_Yxk",
    authDomain:        "north-star-communications.firebaseapp.com",
    databaseURL:       "https://north-star-communications-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:         "north-star-communications",
    storageBucket:     "north-star-communications.firebasestorage.app",
    messagingSenderId: "259650319353",
    appId:             "1:259650319353:web:171376ea123382bfa20328"
  },

  // ---- Write target -------------------------------------------------------
  // Sibling path, never nested under a review widget's /comments/, so the two
  // can carry different rules. push() semantics: one record per submission.
  RTDB_WRITE_PATH: "leads",

  // ---- Validation ---------------------------------------------------------
  // Capture is field-agnostic (every named control in the form is recorded);
  // this is only the subset that blocks submission when empty.
  REQUIRED_FIELDS: ["email", "message"],

  // ---- Bot screen ---------------------------------------------------------
  // Name of the decoy input. Present in the DOM, hidden from humans and from
  // assistive tech, excluded from the written record.
  HONEYPOT_FIELD: "website",

  // ---- Attribution --------------------------------------------------------
  // Off for now. Turning this on adds utm_* keys to the payload, which means
  // brand/firebase-rules.json must be redeployed or every write 401s.
  CAPTURE_UTM: false,

  // ---- Fallback -----------------------------------------------------------
  // Used only when the write fails, so a submission is never silently dropped.
  FALLBACK_EMAIL: "milos.milosavljevic@nsc.agency",

  // ---- Copy ---------------------------------------------------------------
  MESSAGES: {
    sending:  "Sending…",
    success:  "Thank you. Your message is on its way, and you will hear back within a business day.",
    required: "Please fill in your email and a message.",
    badEmail: "That email address does not look right.",
    failed:   "Something went wrong sending that. Your email app should open with the message ready to send instead."
  }
};
