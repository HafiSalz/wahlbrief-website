(function () {
  var ctaTimer = null;
  var ctaDelay = 10000;
  var pageColor = "#f4e7f5";
  var menuColor = "#757dc6";
  var defaultThemeColor = "transparent";

  function isSachsenPage() {
    return document.body && document.body.classList.contains("page-sachsen-anhalt");
  }

  function setViewportFitCover() {
    var viewport = document.querySelector('meta[name="viewport"]');

    if (!viewport) {
      return;
    }

    var content = viewport.getAttribute("content") || "";

    if (content.indexOf("viewport-fit=cover") === -1) {
      viewport.setAttribute("content", content + ", viewport-fit=cover");
    }
  }

  function setThemeColor(color) {
    var themeMeta = document.querySelector('meta[name="theme-color"]');

    if (themeMeta) {
      themeMeta.setAttribute("content", color);
    }
  }

  function setSafeAreaColor(color) {
    setThemeColor(color);
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
  }

  function syncSafeAreaColor(color) {
    setSafeAreaColor(color);
    window.requestAnimationFrame(function () {
      setSafeAreaColor(color);
    });
    window.setTimeout(function () {
      setSafeAreaColor(color);
    }, 180);
  }

  function clearSafeAreaColor() {
    setThemeColor(defaultThemeColor);
    document.documentElement.style.backgroundColor = "";
    document.body.style.backgroundColor = "";
  }

  function syncClearSafeAreaColor() {
    clearSafeAreaColor();
    window.requestAnimationFrame(clearSafeAreaColor);
    window.setTimeout(clearSafeAreaColor, 180);
  }

  function showShareCta() {
    document.body.classList.add("sachsen-share-cta-visible");
  }

  function scheduleShareCta() {
    if (ctaTimer) {
      window.clearTimeout(ctaTimer);
    }

    ctaTimer = window.setTimeout(showShareCta, ctaDelay);
  }

  function initShareCta() {
    var sendButton = document.getElementById("send-email");
    var copyButton = document.getElementById("copy-text");

    if (sendButton) {
      sendButton.addEventListener("click", scheduleShareCta);
    }

    if (copyButton) {
      copyButton.addEventListener("click", scheduleShareCta);
    }
  }

  function initSafeAreas() {
    if (!isSachsenPage()) {
      return;
    }

    var originalOpenNav = window.openNav;
    var originalCloseNav = window.closeNav;

    setViewportFitCover();
    syncClearSafeAreaColor();

    if (typeof originalOpenNav === "function") {
      window.openNav = function () {
        setViewportFitCover();
        syncSafeAreaColor(menuColor);
        originalOpenNav();
        syncSafeAreaColor(menuColor);
      };
    }

    if (typeof originalCloseNav === "function") {
      window.closeNav = function () {
        originalCloseNav();
        syncClearSafeAreaColor();
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initSafeAreas();
      initShareCta();
    });
  } else {
    initSafeAreas();
    initShareCta();
  }
})();
