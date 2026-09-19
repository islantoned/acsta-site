/* ============================================================
   ACSTA — app.js   Renders content/homepage.json into index.html.
   You should never need to edit this file to change words or images.
   ============================================================ */
(function () {
  "use strict";

  var ICONS = {
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8 12h8M8 16h5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M6 16v-5M11 16V7M16 16v-9"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5A5 5 0 0121.5 20"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19a2 2 0 012-2h13M8 7h7"/></svg>',
    badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0zM5 13v8h14v-8"/></svg>',
    gavel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4l7 7M9 8l7 7M4 20h9M11 10l-7 7 3 3 7-7"/></svg>'
  };

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function setText(id, text) { var n = $(id); if (n) n.textContent = text || ""; }
  function link(a, item) { a.textContent = item.label; a.href = item.href || "#"; return a; }

  function imgSlot(node, src, alt) {
    node.innerHTML = "";
    if (src) { node.classList.remove("is-placeholder"); node.appendChild(el("img", { src: src, alt: alt || "" })); }
    else { node.classList.add("is-placeholder"); node.appendChild(el("span", { class: "placeholder-text", text: "Image" })); }
  }

  function brand(node, site) {
    node.innerHTML = "";
    if (site.logo_image) {
      node.appendChild(el("img", { src: site.logo_image, alt: site.name }));
    } else {
      node.appendChild(el("span", { class: "brand-mark", text: site.short_name }));
      node.appendChild(el("span", { class: "brand-full", text: site.name }));
    }
  }

  function render(c) {
    // ---- Header
    document.title = c.site.seo_title || document.title;
    var md = document.querySelector('meta[name="description"]');
    if (md && c.site.seo_description) md.setAttribute("content", c.site.seo_description);
    brand($("brand"), c.site);
    brand($("footer-brand"), c.site);
    var ul = $("utility-links");
    (c.site.utility_links || []).forEach(function (l) { ul.appendChild(link(el("a"), l)); });
    var nav = $("nav"), mnav = $("mobile-nav");
    c.site.nav.forEach(function (item) { nav.appendChild(link(el("a"), item)); mnav.appendChild(link(el("a"), item)); });
    nav.appendChild(link(el("a", { class: "btn btn-primary" }), c.site.nav_cta));
    mnav.appendChild(link(el("a", { class: "btn btn-primary" }), c.site.nav_cta));
    var mb = $("menu-btn");
    mb.addEventListener("click", function () {
      var open = mnav.hidden; mnav.hidden = !open; mb.setAttribute("aria-expanded", String(open));
    });
    mnav.addEventListener("click", function (e) { if (e.target.tagName === "A") { mnav.hidden = true; mb.setAttribute("aria-expanded", "false"); } });

    // ---- Hero carousel
    setText("hero-eyebrow", c.hero.eyebrow);
    var slides = $("slides"), dots = $("dots");
    c.hero.slides.forEach(function (s, i) {
      // Every slide has the same five parts: image area, label, headline, body, one button.
      var media = el("div", { class: "slide-media" + (s.image ? "" : " is-placeholder") });
      if (s.image) media.appendChild(el("img", { src: s.image, alt: s.image_alt || "" }));
      else media.appendChild(el("span", { class: "placeholder-text", text: "Image" }));
      var headline = i === 0 ? el("h1", { class: "slide-headline", text: s.headline }) : el("h2", { class: "slide-headline", text: s.headline });
      var slide = el("div", { class: "slide", role: "group", "aria-roledescription": "slide", "aria-label": (i + 1) + " of " + c.hero.slides.length, id: "slide-" + i }, [
        media,
        el("div", { class: "slide-text" }, [
          el("p", { class: "slide-label", text: s.label }),
          headline,
          el("p", { class: "slide-body", text: s.body }),
          link(el("a", { class: "btn btn-primary slide-btn" }), { label: s.cta_label, href: s.cta_href })
        ])
      ]);
      slides.appendChild(slide);
      dots.appendChild(el("button", { class: "dot", role: "tab", "aria-selected": "false", "aria-controls": "slide-" + i, "aria-label": s.label }));
    });
    var pause = el("button", { class: "pause", "aria-pressed": "false", text: "Pause" });
    dots.appendChild(pause);
    var idx = 0, timer = null, paused = false, reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function show(n) {
      idx = (n + c.hero.slides.length) % c.hero.slides.length;
      Array.prototype.forEach.call(slides.children, function (s, i) { s.classList.toggle("is-active", i === idx); });
      Array.prototype.forEach.call(dots.querySelectorAll(".dot"), function (d, i) { d.setAttribute("aria-selected", String(i === idx)); });
    }
    function start() { if (reduce || paused) return; stop(); timer = setInterval(function () { show(idx + 1); }, 6500); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    dots.addEventListener("click", function (e) {
      var d = e.target.closest(".dot"); if (d) { show(Array.prototype.indexOf.call(dots.querySelectorAll(".dot"), d)); start(); }
    });
    pause.addEventListener("click", function () {
      paused = !paused; pause.textContent = paused ? "Play" : "Pause"; pause.setAttribute("aria-pressed", String(paused));
      paused ? stop() : start();
    });
    slides.addEventListener("mouseenter", stop); slides.addEventListener("mouseleave", start);
    slides.addEventListener("focusin", stop); slides.addEventListener("focusout", start);
    show(0); start();

    // ---- Mission
    setText("mission-eyebrow", c.positioning.eyebrow);
    setText("mission-tagline", c.positioning.tagline);
    setText("mission-statement", c.positioning.statement);
    imgSlot($("mission-image"), c.positioning.image, c.positioning.image_alt);
    var aud = $("audiences");
    aud.appendChild(el("span", { class: "label", text: c.positioning.audiences_label }));
    c.positioning.audiences.forEach(function (a) { aud.appendChild(el("span", { class: "chip", text: a })); });

    // ---- What you get
    setText("wyg-eyebrow", c.what_you_get.eyebrow);
    setText("wyg-headline", c.what_you_get.headline);
    setText("wyg-intro", c.what_you_get.intro);
    var wyg = $("wyg-grid");
    c.what_you_get.items.forEach(function (it) {
      wyg.appendChild(el("article", { class: "feature" }, [
        el("div", { class: "ico", "aria-hidden": "true", html: ICONS[it.icon] || ICONS.book }),
        el("h3", { text: it.title }),
        el("p", { text: it.body })
      ]));
    });

    // ---- Membership
    setText("mem-eyebrow", c.membership.eyebrow);
    setText("mem-headline", c.membership.headline);
    setText("mem-intro", c.membership.intro);
    setText("mem-footnote", c.membership.footnote);
    var tiers = $("tiers");
    c.membership.tiers.forEach(function (t) {
      var ul = el("ul");
      t.features.forEach(function (f) { ul.appendChild(el("li", { text: f })); });
      tiers.appendChild(el("article", { class: "tier" + (t.featured ? " is-featured" : "") }, [
        t.flag ? el("span", { class: "flag", text: t.flag }) : null,
        el("h3", { text: t.name }),
        el("div", { class: "price" }, [el("span", { class: "amt", text: t.price }), el("span", { class: "per", text: t.period })]),
        el("p", { class: "tag", text: t.tagline }),
        ul,
        link(el("a", { class: "btn " + (t.featured ? "btn-primary" : "btn-navy") }), { label: t.cta_label, href: t.cta_href })
      ]));
    });

    // ---- Resources
    setText("res-eyebrow", c.resources.eyebrow);
    setText("res-headline", c.resources.headline);
    setText("res-intro", c.resources.intro);
    var rg = $("res-grid");
    c.resources.categories.forEach(function (r) {
      rg.appendChild(el("a", { class: "res", href: r.href || "#" }, [el("h3", { text: r.title }), el("p", { text: r.body })]));
    });
    link($("res-view-all"), { label: c.resources.view_all_label, href: c.resources.view_all_href });

    // ---- Estheticians
    setText("esth-eyebrow", c.estheticians.eyebrow);
    setText("esth-headline", c.estheticians.headline);
    setText("esth-body", c.estheticians.body);
    setText("esth-note", c.estheticians.note);
    imgSlot($("esth-image"), c.estheticians.image, c.estheticians.image_alt);
    var ep = $("esth-points");
    c.estheticians.points.forEach(function (p) { ep.appendChild(el("li", { text: p })); });
    link($("esth-cta"), { label: c.estheticians.cta_label, href: c.estheticians.cta_href });

    // ---- Blog
    setText("blog-eyebrow", c.blog.eyebrow);
    setText("blog-headline", c.blog.headline);
    var bg = $("blog-grid");
    c.blog.posts.forEach(function (p) {
      var thumb = el("div", { class: "thumb", "aria-hidden": p.image ? "false" : "true" });
      if (p.image) thumb.appendChild(el("img", { src: p.image, alt: p.image_alt || "" })); else thumb.textContent = c.site.short_name;
      bg.appendChild(el("a", { class: "post", href: p.href || "#" }, [
        thumb,
        el("div", { class: "body" }, [el("span", { class: "cat", text: p.category }), el("h3", { text: p.title }), el("p", { text: p.excerpt })])
      ]));
    });

    // ---- Subscribe
    setText("sub-eyebrow", c.subscribe.eyebrow);
    setText("sub-headline", c.subscribe.headline);
    setText("sub-body", c.subscribe.body);
    setText("sub-name-label", c.subscribe.name_label);
    setText("sub-email-label", c.subscribe.email_label);
    setText("sub-role-label", c.subscribe.role_label);
    setText("sub-btn", c.subscribe.button_label);
    setText("sub-privacy", c.subscribe.privacy_note);
    var sel = $("sub-role");
    c.subscribe.roles.forEach(function (r) { sel.appendChild(el("option", { value: r, text: r })); });
    var form = $("subscribe-form"), msg = $("sub-msg"), loadedAt = Date.now();
    $("sub-ts").value = String(loadedAt);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.className = "msg"; msg.textContent = "";
      var name = $("sub-name").value.trim(), email = $("sub-email").value.trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.className = "msg err"; msg.textContent = "Please enter your name and a valid email address."; return; }
      // Spam checks: honeypot filled, or submitted in under 3 seconds → silently drop.
      if ($("sub-website").value || Date.now() - loadedAt < 3000) { msg.className = "msg ok"; msg.textContent = c.subscribe.success_message; form.reset(); return; }
      var endpoint = c.subscribe.endpoint;
      if (!endpoint || endpoint.indexOf("http") !== 0) { msg.className = "msg err"; msg.textContent = "Subscribe form is not connected yet (add your Google Apps Script URL in the admin)."; return; }
      var btn = $("sub-btn"); btn.disabled = true;
      var body = new URLSearchParams({ name: name, email: email, role: sel.value, source: location.hostname, ts: new Date().toISOString() });
      fetch(endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
        .then(function () { msg.className = "msg ok"; msg.textContent = c.subscribe.success_message; form.reset(); })
        .catch(function () { msg.className = "msg err"; msg.textContent = c.subscribe.error_message; })
        .finally(function () { btn.disabled = false; });
    });

    // ---- Explore + attorney
    setText("explore-eyebrow", c.explore.eyebrow);
    var ex = $("explore-links");
    c.explore.links.forEach(function (l) { ex.appendChild(link(el("a"), l)); });
    setText("att-eyebrow", c.attorney.eyebrow);
    setText("att-headline", c.attorney.headline);
    setText("att-body", c.attorney.body);
    imgSlot($("att-image"), c.attorney.image, c.attorney.image_alt);

    // ---- Footer
    setText("footer-disclaimer", c.footer.disclaimer);
    setText("footer-tagline", c.footer.tagline);
    var cols = $("footer-cols");
    c.footer.columns.forEach(function (col) {
      var ul = el("ul");
      col.links.forEach(function (l) { ul.appendChild(el("li", null, [link(el("a"), l)])); });
      cols.appendChild(el("div", null, [el("h4", { text: col.title }), ul]));
    });
    setText("footer-copy", "© " + new Date().getFullYear() + " " + c.footer.copyright_name + ". All rights reserved.");
    var fl = $("footer-legal");
    c.footer.legal_links.forEach(function (l) { fl.appendChild(link(el("a"), l)); });
  }

  if (window.ACSTA_CONTENT) { render(window.ACSTA_CONTENT); return; }
  fetch("content/homepage.json", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function (err) { console.error("ACSTA: could not load content/homepage.json", err); });
})();
