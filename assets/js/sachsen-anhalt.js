(function () {
  var ctaTimer = null;
  var ctaDelay = 10000;
  var pageColor = "#f4e7f5";
  var menuColor = "#757dc6";
  var defaultThemeColor = "transparent";
  var initialFinalMessageHtml = null;

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

    if (window.matchMedia("(max-width: 74.999rem)").matches) {
      window.requestAnimationFrame(function () {
        var shareCta = document.getElementById("sachsen-share-cta");

        if (shareCta) {
          shareCta.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      });
    }
  }

  function scheduleShareCta() {
    if (ctaTimer) {
      window.clearTimeout(ctaTimer);
    }

    ctaTimer = window.setTimeout(showShareCta, ctaDelay);
  }

  function resetShareCta() {
    if (ctaTimer) {
      window.clearTimeout(ctaTimer);
      ctaTimer = null;
    }

    document.body.classList.remove("sachsen-share-cta-visible");

    var finalMessage = document.getElementById("final-message");
    var sendButton = document.getElementById("send-email");

    if (finalMessage && initialFinalMessageHtml !== null) {
      finalMessage.innerHTML = initialFinalMessageHtml;
      finalMessage.classList.remove("success");
    }

    if (sendButton) {
      sendButton.setAttribute("href", "#");
    }
  }

  function initShareCta() {
    var sendButton = document.getElementById("send-email");
    var copyButton = document.getElementById("copy-text");
    var stepTwoTab = document.getElementById("step-2-tab");
    var finalMessage = document.getElementById("final-message");

    if (finalMessage) {
      initialFinalMessageHtml = finalMessage.innerHTML;
    }

    if (sendButton) {
      sendButton.addEventListener("click", scheduleShareCta);
    }

    if (copyButton) {
      copyButton.addEventListener("click", scheduleShareCta);
    }

    if (stepTwoTab) {
      stepTwoTab.addEventListener("shown.bs.tab", resetShareCta);
    }

    if (typeof window.backtosecondpage === "function") {
      var originalBackToSecondPage = window.backtosecondpage;

      window.backtosecondpage = function () {
        resetShareCta();
        return originalBackToSecondPage.apply(this, arguments);
      };
    }
  }

  function initBirthdayAutoAdvance() {
    if (!isSachsenPage()) {
      return;
    }

    var fields = [
      {
        current: document.getElementById("form-day"),
        next: document.getElementById("form-month"),
      },
      {
        current: document.getElementById("form-month"),
        next: document.getElementById("form-year"),
      },
    ];

    fields.forEach(function (field) {
      if (!field.current || !field.next) {
        return;
      }

      field.current.addEventListener("input", function (event) {
        var isDeleting = event.inputType && event.inputType.indexOf("delete") === 0;

        if (isDeleting) {
          return;
        }

        if (
          field.current.value.length >= field.current.maxLength &&
          field.current.validity.valid
        ) {
          field.next.focus();
        }
      });
    });
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
      initBirthdayAutoAdvance();
    });
  } else {
    initSafeAreas();
    initShareCta();
    initBirthdayAutoAdvance();
  }
})();
