(function () {
  "use strict";

  var seal = document.getElementById("waxSeal");
  var envelope = document.getElementById("envelope");
  var flap = document.getElementById("envFlap");
  var cavity = document.getElementById("cavity");
  var card = document.getElementById("card");
  var prelude = document.getElementById("prelude");
  var scene = document.getElementById("scene");

  var hasOpened = false;

  function openInvitation() {
    if (hasOpened) return;
    hasOpened = true;

    prelude.classList.add("is-hidden");

    // 1. Seal cracks, then breaks away
    seal.classList.add("is-cracking");

    window.setTimeout(function () {
      seal.classList.add("is-breaking");
    }, 260);

    // 2. Flap swings open
    window.setTimeout(function () {
      flap.classList.add("is-open");
    }, 420);

    // 3. Cavity clip relaxes and the card rises through the opening,
    //    timed to start just as the flap clears the opening.
    window.setTimeout(function () {
      cavity.classList.add("is-open");
      card.classList.add("is-risen");
    }, 1700);

    // 4. Camera eases very slightly closer as the card settles.
    window.setTimeout(function () {
      scene.classList.add("is-close");
    }, 2800);

    // 5. Envelope dissolves away, leaving only the invitation card.
    window.setTimeout(function () {
      envelope.classList.add("is-fading");
    }, 2450);

    // 6. Fully remove the envelope from interaction/layout flow.
    window.setTimeout(function () {
      envelope.setAttribute("aria-hidden", "true");
    }, 3500);

    window.setTimeout(function () {
      card.classList.remove("is-risen");
      card.classList.add("is-centered");
    }, 3600);
  }
  flap.addEventListener("transitionend", function (e) {
    if (e.propertyName !== "transform") return;

    flap.classList.add("is-behind");
  });

  seal.addEventListener("click", openInvitation);

  seal.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      openInvitation();
    }
  });
})();

/* ============================================================
   Landing → Story Transition — NEW
   Swipe-up cue, cinematic zoom into the card, reveal Our Story
   ============================================================ */
(function () {
  "use strict";

  var scene = document.getElementById("scene");
  var stage = document.getElementById("stage");
  var scrollCue = document.getElementById("scrollCue");
  var storySection = document.getElementById("storySection");
  var card = document.getElementById("card");
  var cardSettled = false; // true once the card has finished centering
  var zoomTriggered = false; // true once the swipe/scroll-up has fired
  var zoomDone = false;

  card.addEventListener("transitionend", function (e) {
    if (e.propertyName !== "transform") return;
    if (!card.classList.contains("is-centered")) return;

    cardSettled = true;

    setTimeout(function () {
      scrollCue.classList.add("is-visible");
    }, 800);
  });

  var TOUCH_THRESHOLD = 24; // px of upward movement counted as "swipe up"
  var ZOOM_DURATION_MS = 1800; // must stay in sync with the CSS transition

  // Lock page scroll for the entire intro (envelope + pause + cue),
  // matching the existing envelope timing exactly.
  document.documentElement.classList.add("scroll-lock");
  document.body.classList.add("scroll-lock");

  // The existing openInvitation() sequence finishes centering the card
  // at 3600ms. Add the requested ~1s pause, then reveal the cue.

  function beginZoom() {
    if (!cardSettled || zoomTriggered) return;
    zoomTriggered = true;

    scrollCue.classList.remove("is-visible");
    scrollCue.classList.add("is-hidden");

    scene.classList.add("is-zooming");

    window.setTimeout(function () {
      // Cross-fade: reveal the story section while the paper overlay
      // is fully covering the (now unrecognizable) zoomed card.
      storySection.classList.add("is-visible");
      stage.classList.add("is-away");

      // Hand scrolling back to the browser.
    }, ZOOM_DURATION_MS * 0.65);
    window.setTimeout(function () {
      zoomDone = true;

      document.documentElement.classList.remove("scroll-lock");
      document.body.classList.remove("scroll-lock");
    }, ZOOM_DURATION_MS);
  }

  // --- Desktop / trackpad: wheel scrolled upward ---
  window.addEventListener(
    "wheel",
    function (e) {
      if (zoomDone) return; // let normal scrolling resume in the story section

      if (!zoomTriggered) {
        e.preventDefault();
        if (cardSettled && e.deltaY !== 0) {
          beginZoom();
        }
        return;
      }

      // Still mid-zoom: keep the page locked.
      e.preventDefault();
    },
    { passive: false },
  );

  // --- Mobile: swipe up ---
  var touchStartY = null;

  window.addEventListener(
    "touchstart",
    function (e) {
      if (zoomDone) return;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    function (e) {
      if (zoomDone) return;

      e.preventDefault();

      if (zoomTriggered || touchStartY === null) return;

      var deltaY = touchStartY - e.touches[0].clientY;
      if (cardSettled && deltaY > TOUCH_THRESHOLD) {
        beginZoom();
      }
    },
    { passive: false },
  );

  // --- Keyboard: Arrow Up / Page Up as an accessible equivalent ---
  window.addEventListener("keydown", function (e) {
    if (zoomDone || zoomTriggered) return;
    if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (cardSettled) {
        e.preventDefault();
        beginZoom();
      }
    }
  });
})();

/* ============================================================
   Countdown Section — NEW
   Paste this at the end of landing.js, after the existing
   "Landing → Story Transition" IIFE. Does not modify any
   existing listeners, timings, or variables.
   ============================================================ */
(function () {
  "use strict";

  var storySection = document.getElementById("storySection");
  var countdownSection = document.getElementById("countdownSection");

  var elDays = document.getElementById("cdDays");
  var elHours = document.getElementById("cdHours");
  var elMinutes = document.getElementById("cdMinutes");
  var elSeconds = document.getElementById("cdSeconds");
  var grid = document.getElementById("countdownGrid");
  var completeMsg = document.getElementById("countdownComplete");

  // --- Scroll-triggered reveal (Our Story fades/slides out slightly,
  //     Countdown fades/slides in). Pure transform + opacity. ---
  if (storySection && countdownSection && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.target === countdownSection) {
            if (entry.isIntersecting) {
              countdownSection.classList.add("is-visible");
              storySection.classList.add("is-leaving");
            } else if (entry.boundingClientRect.top > 0) {
              // Scrolled back above the countdown section.
              countdownSection.classList.remove("is-visible");
              storySection.classList.remove("is-leaving");
            }
          }
        });
      },
      { threshold: 0.2 },
    );

    revealObserver.observe(countdownSection);
  } else if (countdownSection) {
    // Fallback: no IntersectionObserver support.
    countdownSection.classList.add("is-visible");
  }

  // --- Live countdown timer ---
  var TARGET_DATE = new Date("2026-11-25T00:00:00");
  var countdownInterval = null;

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  function renderComplete() {
    if (countdownInterval) {
      window.clearInterval(countdownInterval);
      countdownInterval = null;
    }
    if (grid) grid.classList.add("is-hidden");
    if (completeMsg) completeMsg.classList.add("is-visible");
  }

  function updateCountdown() {
    var now = new Date();
    var diff = TARGET_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
      renderComplete();
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  if (elDays && elHours && elMinutes && elSeconds) {
    updateCountdown();
    countdownInterval = window.setInterval(updateCountdown, 1000);
  }
})();


/* ============================================================
   Wedding Events Section — NEW
   Paste this at the end of landing.js, after the existing
   "Countdown Section" IIFE. Does not modify any existing
   listeners, timings, or variables.
   ============================================================ */
(function () {
  "use strict";

  var countdownSection = document.getElementById("countdownSection");
  var eventsSection = document.getElementById("eventsSection");
  var eventItems = document.querySelectorAll(
    "#eventsTimeline .event-item"
  );
  var venueBlock = document.getElementById("venueBlock");

  if (!eventsSection || !("IntersectionObserver" in window)) {
    // Fallback: no IntersectionObserver support — reveal everything.
    if (eventsSection) eventsSection.classList.add("is-visible");
    eventItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    if (venueBlock) venueBlock.classList.add("is-visible");
    return;
  }

  var STAGGER_MS = 130; // 100–150ms stagger between event cards

  // --- Section-level reveal: Countdown fades/slides up as
  //     Wedding Events fades/slides in, mirroring the existing
  //     Story → Countdown transition pattern. ---
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.target !== eventsSection) return;

        if (entry.isIntersecting) {
          eventsSection.classList.add("is-visible");
          if (countdownSection) {
            countdownSection.classList.add("is-leaving");
          }
        } else if (entry.boundingClientRect.top > 0) {
          eventsSection.classList.remove("is-visible");
          if (countdownSection) {
            countdownSection.classList.remove("is-leaving");
          }
        }
      });
    },
    { threshold: 0,
      rootMargin: "0px 0px -20% 0px"
     }
  );

  sectionObserver.observe(eventsSection);

  // --- Per-card stagger reveal for the timeline entries. ---
  var itemObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var index = Array.prototype.indexOf.call(eventItems, el);

        window.setTimeout(function () {
          el.classList.add("is-visible");
        }, Math.max(index, 0) * STAGGER_MS);

        obs.unobserve(el);
      });
    },
    { threshold: 0.25 }
  );

  eventItems.forEach(function (item) {
    itemObserver.observe(item);
  });

  // --- Venue section fades in once the final event card is visible. ---
  if (venueBlock && eventItems.length > 0) {
    var lastItem = eventItems[eventItems.length - 1];

    var venueObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          venueBlock.classList.add("is-visible");
          obs.unobserve(lastItem);
        });
      },
      { threshold: 0.25 }
    );

    venueObserver.observe(lastItem);
  }
})();

/* ============================================================
   Gallery Section — NEW
   Paste this at the end of landing.js, after the existing
   "Wedding Events Section" IIFE. Does not modify any existing
   listeners, timings, or variables.
   ============================================================ */
(function () {
  "use strict";

  var venueBlock = document.getElementById("venueBlock");
  var gallerySection = document.getElementById("gallerySection");
  var galleryItems = Array.prototype.slice.call(
    document.querySelectorAll("#galleryGrid .gallery-item")
  );

  var lightbox = document.getElementById("lightbox");
  var lightboxBackdrop = document.getElementById("lightboxBackdrop");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");

  var STAGGER_MS = 130; // 100–150ms stagger between gallery items
  var currentIndex = 0;
  var lastFocused = null;

  // --- Section-level reveal: Venue fades/slides up as Gallery
  //     fades/slides in, mirroring the existing transition pattern. ---
  if (gallerySection && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.target !== gallerySection) return;

          if (entry.isIntersecting) {
            gallerySection.classList.add("is-visible");
            if (venueBlock) venueBlock.classList.add("is-leaving");
          } else if (entry.boundingClientRect.top > 0) {
            gallerySection.classList.remove("is-visible");
            if (venueBlock) venueBlock.classList.remove("is-leaving");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionObserver.observe(gallerySection);
  } else if (gallerySection) {
    gallerySection.classList.add("is-visible");
  }

  // --- Per-item stagger reveal, animates once. ---
  if ("IntersectionObserver" in window) {
    var itemObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var el = entry.target;
          var index = galleryItems.indexOf(el);

          window.setTimeout(function () {
            el.classList.add("is-visible");
          }, Math.max(index, 0) * STAGGER_MS);

          obs.unobserve(el);
        });
      },
      { threshold: 0.25 }
    );

    galleryItems.forEach(function (item) {
      itemObserver.observe(item);
    });
  } else {
    galleryItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  // --- Lightbox ---
  function openLightbox(index) {
    if (!lightbox || galleryItems.length === 0) return;

    currentIndex = (index + galleryItems.length) % galleryItems.length;
    lastFocused = document.activeElement;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("scroll-lock");
    document.documentElement.classList.add("scroll-lock");

    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("scroll-lock");
    document.documentElement.classList.remove("scroll-lock");

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function showNext() {
    openLightbox(currentIndex + 1);
  }

  function showPrev() {
    openLightbox(currentIndex - 1);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener("click", closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", showNext);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPrev);
  }

  window.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  });
})();