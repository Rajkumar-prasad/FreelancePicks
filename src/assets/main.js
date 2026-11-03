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

  // ----- Hero background video -----
  var video = document.querySelector(".hero-video");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (video && !reduce && !saveData) {
    video.src = window.innerWidth < 820 ? video.getAttribute("data-src-sm") : video.getAttribute("data-src-lg");
    var toggle = document.querySelector("[data-video-toggle]");
    var playP = video.play();
    if (playP && playP.catch) playP.catch(function () {});
    if (toggle) {
      toggle.hidden = false;
      var playIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
      var pauseIcon = toggle.innerHTML;
      toggle.addEventListener("click", function () {
        if (video.paused) { video.play(); toggle.innerHTML = pauseIcon; toggle.setAttribute("aria-label", "Pause background video"); }
        else { video.pause(); toggle.innerHTML = playIcon; toggle.setAttribute("aria-label", "Play background video"); }
      });
    }
  }

  // ----- Hero search: jump to the matching service page -----
  var search = document.querySelector("[data-hero-search]");
  if (search) {
    var links = Array.prototype.map.call(document.querySelectorAll("#panel-all .tile"), function (a) {
      return { href: a.getAttribute("href"), text: a.querySelector(".tile-name").textContent.toLowerCase() };
    });
    search.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = String(search.querySelector("input").value || "").trim().toLowerCase();
      if (!q) { location.href = "/hire/"; return; }
      var words = q.split(/\s+/).filter(function (w) { return w.length > 2; });
      var best = null, bestScore = 0;
      links.forEach(function (l) {
        var score = l.text === q ? 100 : 0;
        words.forEach(function (w) { if (l.text.indexOf(w) > -1) score += w.length; });
        if (score > bestScore) { bestScore = score; best = l; }
      });
      location.href = best ? best.href : "/hire/";
    });
  }

  // ----- Service tabs -----
  var tablist = document.querySelector("[data-tabs]");
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") select(tabs[(i + 1) % tabs.length], true);
        if (e.key === "ArrowLeft") select(tabs[(i - 1 + tabs.length) % tabs.length], true);
      });
    });
  }

  // ----- Price explorer -----
  var pe = document.querySelector("[data-price-explorer]");
  if (pe) {
    var sel = pe.querySelector("select");
    var peLink = pe.querySelector("[data-pe-link]");
    sel.addEventListener("change", function () {
      var opt = sel.options[sel.selectedIndex];
      var tiers = [];
      try { tiers = JSON.parse(opt.getAttribute("data-tiers")); } catch (err) {}
      tiers.forEach(function (t, i) { var dd = pe.querySelector('[data-tier="' + i + '"]'); if (dd) dd.textContent = t; });
      peLink.setAttribute("href", "/hire/" + sel.value + "/");
      peLink.firstChild.textContent = "See the full " + opt.textContent + " guide ";
    });
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

// ----- Mobile menu -----
(function () {
  var btn = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("main-nav");
  if (!btn || !nav) return;
  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(false); } });
  document.addEventListener("click", function (e) { if (!e.target.closest(".header-inner")) setOpen(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 760) setOpen(false); });
})();
