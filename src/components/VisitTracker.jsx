import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const PAGE_NAMES = {
  "/": "Home",
  "/services": "Services",
  "/about": "About",
  "/careers": "Careers",
  "/request-care": "Request Care",
  "/contact": "Contact",
  "/quiz": "Quiz",
  "/privacy-policy": "Privacy Policy",
  "/terms-of-use": "Terms of Use",
  "/login": "Login",
  "/register": "Register",
  "/forgot-password": "Forgot Password",
};

function getSessionId() {
  let sid = sessionStorage.getItem("fcws_session_id");
  if (!sid) {
    sid = "s_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem("fcws_session_id", sid);
  }
  return sid;
}

export default function VisitTracker() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;

    // Skip internal dashboard pages — we track public visitor traffic only
    if (path.startsWith("/admin") || path.startsWith("/caregiver") || path.startsWith("/portal")) return;

    const page = PAGE_NAMES[path] || (path.startsWith("/services/") ? "Service Detail" : "Page");

    base44.functions.invoke("trackVisit", {
      path,
      page,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent || "",
      sessionId: getSessionId(),
      locale: navigator.language || "",
    }).catch(() => {});
  }, [location.pathname]);

  return null;
}