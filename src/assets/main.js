(function () {
  "use strict";
  var FP = window.FP || {};
  var KEY = "fp_consent";
  var loaded = false;

  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function clearConsent() { try { localStorage.removeItem(KEY); } catch (e) {} }
  function hasTracking() { return !!(FP.pixelId || FP.ga4Id); }
  function consented() { return hasTracking() && (!FP.consentRequired || getConsent() === "yes"); }
  function newEventId() { return "ev_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10); }

  function loadTracking() {
    if (loaded || !hasTracking()) return;
    loaded = true;
    if (FP.pixelId) {
      /* Meta Pixel base code */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", FP.pixelId);
      window.fbq("track", "PageView");
    }
    if (FP.ga4Id) {
      var g = document.createElement("script");
      g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(FP.ga4Id);
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", FP.ga4Id);
    }
    document.dispatchEvent(new Event("fp:tracking"));
  }

  // name: Meta event name. custom: true for custom events. gaName: GA4 event name.
  function track(name, data, eventId, custom, gaName) {
    if (!loaded) return;
    if (window.fbq) {
      if (eventId) window.fbq(custom ? "trackCustom" : "track", name, data || {}, { eventID: eventId });
      else window.fbq(custom ? "trackCustom" : "track", name, data || {});
    }
    if (window.gtag && gaName) window.gtag("event", gaName, data || {});
  }

  // ----- Consent banner -----
  var banner = document.getElementById("consent");
  if (hasTracking()) {
    if (consented()) loadTracking();
    else if (banner && getConsent() === null) banner.hidden = false;
  }
  if (banner) {
    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var v = btn.getAttribute("data-consent");
      setConsent(v);
      banner.hidden = true;
      if (v === "yes") loadTracking();
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cookie-settings]");
    if (!b || !banner) return;
    if (!hasTracking()) { alert("This site is not using analytics or advertising cookies right now."); return; }
    clearConsent();
    banner.hidden = false;
  });

  // ----- Affiliate click tracking -----
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-aff]");
    if (!a) return;
    var cat = a.getAttribute("data-category") || "";
    if (a.hasAttribute("data-missing")) {
      e.preventDefault();
      if (window.console) console.warn('FreelancePicks: affiliate link missing for "' + cat + '". Add it in data/affiliate-links.js');
      return;
    }
    var id = newEventId();
    track("OutboundClick", { category: cat }, id, true, "outbound_click");
    if (consented() && FP.pixelId && navigator.sendBeacon) {
      try {
        navigator.sendBeacon("/api/event", JSON.stringify({
          event_name: "OutboundClick", event_id: id, source_url: location.href, category: cat, consent: true,
        }));
      } catch (err) {}
    }
  });

  // ----- Lead form -----
  Array.prototype.forEach.call(document.querySelectorAll("form[data-lead-form]"), function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      var btn = form.querySelector('button[type="submit"]');
      var fd = new FormData(form);
      var email = String(fd.get("email") || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Please enter a valid email address."; return; }
      if (!fd.get("agree")) { msg.textContent = "Please tick the box so we can send you the kit."; return; }
      var id = newEventId();
      btn.disabled = true;
      msg.style.color = "";
      msg.textContent = "Sending...";
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          first_name: String(fd.get("first_name") || "").trim(),
          company: fd.get("company") || "",
          event_id: id,
          source_url: location.href,
          consent: consented() && !!FP.pixelId,
        }),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok) {
            location.href = (form.getAttribute("data-success") || "/kit-thank-you/") + "?eid=" + encodeURIComponent(id);
          } else {
            msg.textContent = (res.j && res.j.error) || "Something went wrong. Please try again.";
            btn.disabled = false;
          }
        })
        .catch(function () { msg.textContent = "Network error. Please try again."; btn.disabled = false; });
    });
  });

  // ----- Lead event on the thank-you page (deduplicated with the server event) -----
  if (document.body.hasAttribute("data-lead-page")) {
    var eid = new URLSearchParams(location.search).get("eid");
    if (eid) {
      var fire = function () { track("Lead", { content_name: "Store Launch Kit" }, eid, false, "generate_lead"); };
      if (loaded) fire(); else document.addEventListener("fp:tracking", fire, { once: true });
    }
  }

  // ----- Cost calculator -----
  var calc = document.getElementById("cost-calc");
  if (calc) {
    var fmt = function (n) { return "$" + n.toLocaleString("en-US"); };
    var update = function () {
      var lo = 0, hi = 0;
      Array.prototype.forEach.call(calc.querySelectorAll('input[type="checkbox"]'), function (i) {
        if (i.checked) { lo += Number(i.getAttribute("data-low")); hi += Number(i.getAttribute("data-high")); }
      });
      document.getElementById("calc-low").textContent = fmt(lo);
      document.getElementById("calc-high").textContent = fmt(hi);
    };
    calc.addEventListener("change", update);
    update();
  }
})();
