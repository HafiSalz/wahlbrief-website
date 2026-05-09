(function () {
  var ctaTimer = null;
  var ctaDelay = 10000;

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShareCta);
  } else {
    initShareCta();
  }
})();
