(function(){
  "use strict";

  function getDepth(pathname){
    var p = (pathname || "/").replace(/\\/g, "/");
    try{ p = decodeURIComponent(p); }catch(_e){}
    p = p.replace(/\/+/g, "/");
    if (p === "/" || p === "") return 0;
    var segments = p.split("/").filter(Boolean);
    return Math.max(0, segments.length - 1);
  }

  function getBasePrefix(pathname){
    var depth = getDepth(pathname);
    return depth === 0 ? "." : Array(depth + 1).join("../").slice(0, -1);
  }

  function buildNavHtml(base){
    return '' +
      '<header class="rf-nav" data-rf-nav>' +
      '  <div class="rf-nav__inner">' +
      '    <a class="rf-brand" href="' + base + '/index.html" aria-label="Ryvox Forge home">' +
      '      <span class="rf-brand__mark" aria-hidden="true"></span>' +
      '      <span class="rf-brand__text">Ryvox Forge</span>' +
      '    </a>' +
      '    <button class="rf-nav__burger" type="button" data-rf-burger aria-label="Open navigation" aria-expanded="false">' +
      '      <span class="rf-burger" aria-hidden="true"></span>' +
      '    </button>' +
      '    <nav class="rf-nav__tree" aria-label="Primary">' +
      '      <a class="rf-item" data-rf-item data-route="home" href="' + base + '/index.html"><span class="rf-item__dot" aria-hidden="true"></span>Home</a>' +
      '      <a class="rf-item" data-rf-item data-route="pvpflow" href="' + base + '/pvp/pvpflow.html"><span class="rf-item__dot" aria-hidden="true"></span>PvPFlow</a>' +
      '      <a class="rf-item" data-rf-item data-route="novapixel" href="' + base + '/np/novapixel.html"><span class="rf-item__dot" aria-hidden="true"></span>NovaPixel</a>' +
      '      <div class="rf-group" data-rf-group="pulseevents">' +
      '        <button class="rf-item rf-item--toggle" type="button" data-rf-toggle="pulseevents" aria-expanded="false">' +
      '          <span class="rf-item__dot" aria-hidden="true"></span>PulseEvents<span class="rf-caret" aria-hidden="true"></span>' +
      '        </button>' +
      '        <div class="rf-sub" data-rf-sub="pulseevents">' +
      '          <a class="rf-sub__item" data-rf-item data-route="pulseevents-overview" href="' + base + '/PulseEvents/index.html">Overview</a>' +
      '          <a class="rf-sub__item" data-rf-item data-route="pulseevents-docs" href="' + base + '/PulseEvents/doc.html">Docs</a>' +
      '          <a class="rf-sub__item" data-rf-item data-route="pulseevents-roadmap" href="' + base + '/PulseEvents/roadmap.html">Roadmap</a>' +
      '        </div>' +
      '      </div>' +
      '      <a class="rf-item" data-rf-item data-route="about" href="' + base + '/about.html"><span class="rf-item__dot" aria-hidden="true"></span>About</a>' +
      '    </nav>' +
      '    <div class="rf-nav__meta" aria-label="Location">' +
      '      <div class="rf-crumb" data-rf-crumb>' +
      '        <span class="rf-crumb__label">Location</span>' +
      '        <span class="rf-crumb__value" data-rf-crumb-value>Home</span>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="rf-mobile" data-rf-mobile hidden>' +
      '    <nav class="rf-mobile__tree" aria-label="Primary mobile">' +
      '      <a class="rf-mitem" data-rf-item data-route="home" href="' + base + '/index.html">Home</a>' +
      '      <a class="rf-mitem" data-rf-item data-route="pvpflow" href="' + base + '/pvp/pvpflow.html">PvPFlow</a>' +
      '      <a class="rf-mitem" data-rf-item data-route="novapixel" href="' + base + '/np/novapixel.html">NovaPixel</a>' +
      '      <button class="rf-mitem rf-mitem--toggle" type="button" data-rf-toggle="pulseevents-mobile" aria-expanded="false">PulseEvents<span class="rf-caret" aria-hidden="true"></span></button>' +
      '      <div class="rf-msub" data-rf-sub="pulseevents-mobile">' +
      '        <a class="rf-msub__item" data-rf-item data-route="pulseevents-overview" href="' + base + '/PulseEvents/index.html">Overview</a>' +
      '        <a class="rf-msub__item" data-rf-item data-route="pulseevents-docs" href="' + base + '/PulseEvents/doc.html">Docs</a>' +
      '        <a class="rf-msub__item" data-rf-item data-route="pulseevents-roadmap" href="' + base + '/PulseEvents/roadmap.html">Roadmap</a>' +
      '      </div>' +
      '      <a class="rf-mitem" data-rf-item data-route="about" href="' + base + '/about.html">About</a>' +
      '    </nav>' +
      '  </div>' +
      '</header>';
  }

  function normalizePathname(pathname){
    // Lowercase + normalize slashes. Keep case-insensitive matching for Windows/GH pages.
    var p = (pathname || "/").replace(/\\/g, "/");
    try{ p = decodeURIComponent(p); }catch(_e){}
    p = p.toLowerCase();
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  }

  function getRoute(pathname){
    var p = normalizePathname(pathname);
    var pulsePath = p.indexOf("/pulseevents/") !== -1 || p.endsWith("/pulseevents");
    var aboutPath = p.endsWith("/about") || p.endsWith("/about.html");
    var homePath = p.endsWith("/index.html") && !pulsePath && p.indexOf("/np/") === -1 && p.indexOf("/pvp/") === -1;

    if (p === "/" || p === "" || homePath) return { active: "home", crumb: "Home" };
    if (aboutPath) return { active: "about", crumb: "About" };

    if (pulsePath){
      if (p.endsWith("/pulseevents") || p.endsWith("/pulseevents/index.html")) return { active: "pulseevents-overview", project: "pulseevents", crumb: "PulseEvents / Overview" };
      if (p.endsWith("/doc.html")) return { active: "pulseevents-docs", project: "pulseevents", crumb: "PulseEvents / Docs" };
      if (p.endsWith("/roadmap.html")) return { active: "pulseevents-roadmap", project: "pulseevents", crumb: "PulseEvents / Roadmap" };
      return { active: "pulseevents-overview", project: "pulseevents", crumb: "PulseEvents" };
    }

    if (p.startsWith("/np/") || p.includes("novapixel")) return { active: "novapixel", crumb: "NovaPixel" };
    if (p.startsWith("/pvp/") || p.includes("pvpflow")) return { active: "pvpflow", crumb: "PvPFlow" };

    return { active: "home", crumb: "Home" };
  }

  function closeAllGroups(root){
    root.querySelectorAll("[data-rf-group]").forEach(function(g){
      g.dataset.open = "false";
      var t = g.querySelector("[data-rf-toggle]");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }

  function setGroupOpen(root, groupName, open){
    var g = root.querySelector('[data-rf-group="' + groupName + '"]');
    if (!g) return;
    g.dataset.open = open ? "true" : "false";
    var t = g.querySelector('[data-rf-toggle="' + groupName + '"]');
    if (t) t.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function setMobileSubOpen(root, subName, open){
    var sub = root.querySelector('[data-rf-sub="' + subName + '"]');
    if (!sub) return;
    sub.dataset.open = open ? "true" : "false";
    var t = root.querySelector('[data-rf-toggle="' + subName + '"]');
    if (t) t.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function setActive(root, route){
    root.querySelectorAll("[data-rf-item].is-active").forEach(function(el){
      el.classList.remove("is-active");
    });

    var activeEl = root.querySelector('[data-route="' + route.active + '"]');
    if (activeEl) activeEl.classList.add("is-active");

    // Also highlight project group toggle if we're inside it.
    if (route.project === "pulseevents"){
      var toggle = root.querySelector('[data-rf-toggle="pulseevents"]');
      if (toggle) toggle.classList.add("is-active");
    }
  }

  function setCrumb(root, route){
    var v = root.querySelector("[data-rf-crumb-value]");
    if (v) v.textContent = route.crumb || "Home";
  }

  function wireInteractions(root, route){
    // Desktop dropdown toggle (PulseEvents)
    var peToggle = root.querySelector('[data-rf-toggle="pulseevents"]');
    if (peToggle){
      peToggle.addEventListener("click", function(){
        var g = root.querySelector('[data-rf-group="pulseevents"]');
        var next = !(g && g.dataset.open === "true");
        closeAllGroups(root);
        setGroupOpen(root, "pulseevents", next);
      });
    }

    document.addEventListener("click", function(e){
      if (root.contains(e.target)) return;
      closeAllGroups(root);
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") closeAllGroups(root);
    });

    // Mobile burger panel
    var burger = root.querySelector("[data-rf-burger]");
    var mobile = root.querySelector("[data-rf-mobile]");
    if (burger && mobile){
      var setOpen = function(open){
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        mobile.hidden = !open;
      };
      setOpen(false);

      burger.addEventListener("click", function(){
        var open = burger.getAttribute("aria-expanded") === "true";
        setOpen(!open);
      });
      document.addEventListener("keydown", function(e){
        if (e.key === "Escape") setOpen(false);
      });
    }

    // Mobile PulseEvents subtree
    var peMobileToggle = root.querySelector('[data-rf-toggle="pulseevents-mobile"]');
    if (peMobileToggle){
      peMobileToggle.addEventListener("click", function(){
        var sub = root.querySelector('[data-rf-sub="pulseevents-mobile"]');
        var next = !(sub && sub.dataset.open === "true");
        setMobileSubOpen(root, "pulseevents-mobile", next);
      });
    }

    // Auto-expand PulseEvents when we're inside it
    if (route.project === "pulseevents"){
      setGroupOpen(root, "pulseevents", true);
      setMobileSubOpen(root, "pulseevents-mobile", true);
    }
  }

  async function inject(){
    var mount = document.querySelector("[data-ryvox-nav]") || document.getElementById("ryvox-nav");
    if (!mount){
      // Minimal fallback: inject at top of body.
      mount = document.createElement("div");
      mount.id = "ryvox-nav";
      document.body.prepend(mount);
    }

    var route = getRoute(location.pathname);
    var base = getBasePrefix(location.pathname);
    mount.innerHTML = buildNavHtml(base);

    var root = mount.querySelector("[data-rf-nav]");
    if (!root) return;

    setActive(root, route);
    setCrumb(root, route);
    wireInteractions(root, route);

    document.documentElement.classList.add("rf-nav-ready");
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", inject);
  }else{
    inject();
  }
})();
