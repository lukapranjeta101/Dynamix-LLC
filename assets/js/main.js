const menuButton = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const heroVideo = document.querySelector(".hero-video");

if (heroVideo) {
  heroVideo.removeAttribute("controls");
  heroVideo.controls = false;
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;
  heroVideo.loop = true;
  heroVideo.autoplay = true;
  heroVideo.setAttribute("muted", "");
  heroVideo.setAttribute("autoplay", "");
  heroVideo.setAttribute("loop", "");
  heroVideo.setAttribute("playsinline", "");
  heroVideo.setAttribute("webkit-playsinline", "");
  heroVideo.setAttribute("x-webkit-airplay", "deny");
  heroVideo.setAttribute("disableremoteplayback", "");
  heroVideo.setAttribute("disablepictureinpicture", "");
  heroVideo.setAttribute("controlslist", "nodownload noplaybackrate nofullscreen noremoteplayback");

  const tryPlayHeroVideo = () => {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  if (heroVideo.readyState >= 2) {
    tryPlayHeroVideo();
  } else {
    heroVideo.addEventListener("canplay", tryPlayHeroVideo, { once: true });
  }

  let heroPlayAttempts = 0;
  const retryPlayHeroVideo = () => {
    if (!heroVideo.paused || heroPlayAttempts >= 12) return;
    heroPlayAttempts += 1;
    tryPlayHeroVideo();
    window.setTimeout(retryPlayHeroVideo, 250);
  };
  retryPlayHeroVideo();

  const resumeHeroVideoFromGesture = () => {
    tryPlayHeroVideo();
    window.removeEventListener("touchstart", resumeHeroVideoFromGesture);
    window.removeEventListener("click", resumeHeroVideoFromGesture);
  };
  window.addEventListener("touchstart", resumeHeroVideoFromGesture, { passive: true });
  window.addEventListener("click", resumeHeroVideoFromGesture);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tryPlayHeroVideo();
  });

  window.addEventListener("pageshow", tryPlayHeroVideo);
}

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach((el, index) => {
    const staggerStep = index % 6;
    el.style.setProperty("--reveal-delay", `${staggerStep * 80}ms`);
    observer.observe(el);
  });
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const introOverlay = document.getElementById("intro-overlay");
const isHomePage = document.body.classList.contains("home-page");
const rootEl = document.documentElement;

if (isHomePage && introOverlay && rootEl.classList.contains("intro-pending")) {
  const holdDelay = 1400;
  const exitDuration = 620;

  window.setTimeout(() => {
    rootEl.classList.add("intro-exit");
  }, holdDelay);

  window.setTimeout(() => {
    rootEl.classList.remove("intro-pending", "intro-exit");
  }, holdDelay + exitDuration + 40);
} else {
  rootEl.classList.remove("intro-pending", "intro-exit");
}

const reduceMotionPreferred = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reactiveSections = Array.from(document.querySelectorAll("main > section:not(.hero)"));

if (!reduceMotionPreferred && reactiveSections.length > 0) {
  reactiveSections.forEach((section) => section.classList.add("scroll-section"));

  let scrollTicking = false;

  const updateSectionMotion = () => {
    const viewportHeight = Math.max(window.innerHeight, 1);
    const viewportMid = viewportHeight * 0.5;

    reactiveSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionMid = rect.top + rect.height * 0.5;
      const normalized = Math.max(-1, Math.min(1, (sectionMid - viewportMid) / viewportMid));

      const sectionShift = normalized * -16;
      const contentShift = normalized * -9;
      const sectionOpacity = 1 - Math.min(0.18, Math.abs(normalized) * 0.12);

      section.style.setProperty("--section-shift", `${sectionShift.toFixed(2)}px`);
      section.style.setProperty("--content-shift", `${contentShift.toFixed(2)}px`);
      section.style.setProperty("--section-opacity", sectionOpacity.toFixed(3));
    });

    scrollTicking = false;
  };

  const requestSectionMotionUpdate = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateSectionMotion);
    }
  };

  window.addEventListener("scroll", requestSectionMotionUpdate, { passive: true });
  window.addEventListener("resize", requestSectionMotionUpdate);
  requestSectionMotionUpdate();
}

const typingHeading = document.querySelector(".hero-typing");
const typingWordEl = document.querySelector(".typing-word-live");

if (typingHeading && typingWordEl) {
  const words = (typingHeading.dataset.words || "leaders")
    .split("|")
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length > 0) {
    let wordIndex = 0;
    let wordCharIndex = 0;
    let mode = "typingWord";
    typingWordEl.textContent = "";

    const step = () => {
      const currentWord = words[wordIndex].replace(/\.+$/, "");
      const currentPhrase = `${currentWord}.`;

      if (mode === "typingWord") {
        wordCharIndex += 1;
        typingWordEl.textContent = currentPhrase.slice(0, wordCharIndex);

        if (wordCharIndex >= currentPhrase.length) {
          mode = "holdingWord";
          setTimeout(step, 1300);
          return;
        }

        setTimeout(step, 95);
        return;
      }

      if (mode === "holdingWord") {
        mode = "deletingWord";
        setTimeout(step, 55);
        return;
      }

      if (mode === "deletingWord") {
        wordCharIndex -= 1;
        typingWordEl.textContent = currentPhrase.slice(0, Math.max(0, wordCharIndex));

        if (wordCharIndex <= 0) {
          wordIndex = (wordIndex + 1) % words.length;
          mode = "typingWord";
          setTimeout(step, 230);
          return;
        }

        setTimeout(step, 55);
      }
    };

    step();
  }
}

const workflowTabs = Array.from(document.querySelectorAll(".workflow-tab"));
const workflowTitle = document.querySelector("[data-workflow-title]");
const workflowText = document.querySelector("[data-workflow-text]");
const workflowCopy = document.querySelector("[data-workflow-copy]");
const workflowVisuals = Array.from(
  document.querySelectorAll("[data-workflow-visual]")
);
const workflowSection = document.querySelector(".workflow-section");

if (workflowTabs.length > 0 && workflowTitle && workflowText && workflowCopy) {
  document.documentElement.classList.add("workflow-force-motion");
  if (workflowSection) workflowSection.classList.add("workflow-idle");

  const workflowContent = {
    need: {
      title: "Understanding the Need",
      text: "We begin with client discovery, culture alignment, and role planning so the search starts with a clear and strategic hiring blueprint."
    },
    research: {
      title: "Research & Planning",
      text: "Target market research and role mapping guide where to focus, who to approach, and how to build a practical plan for outreach."
    },
    recruitment: {
      title: "Recruitment & Assessment",
      text: "We source and screen candidates through structured outreach, qualification, and assessment to identify high-potential fits."
    },
    presentation: {
      title: "Presentation & Interviews",
      text: "A focused shortlist is presented with alignment notes, then we coordinate interview scheduling and stage-by-stage guidance to keep decisions moving."
    },
    close: {
      title: "Checks, Offer & Follow Up",
      text: "We run references and background validation, support offer negotiation and acceptance, then follow up post-placement to protect long-term success."
    }
  };

  let workflowSwapTimer = null;
  const workflowDurationMs = 10000;
  const workflowSteps = workflowTabs
    .map((tab) => tab.dataset.workflowStep || "")
    .filter(Boolean);
  let workflowIndex = Math.max(
    0,
    workflowTabs.findIndex((tab) => tab.classList.contains("is-active"))
  );
  let workflowCycleStart = performance.now();
  let workflowRafId = null;
  let workflowPaused = true;
  let workflowPausedAt = performance.now();

  const restartNeedVisualPop = () => {
    const needVisual = workflowVisuals.find(
      (visual) => visual.getAttribute("data-workflow-visual") === "need"
    );
    if (!needVisual) return;
    needVisual.classList.remove("workflow-pop");
    void needVisual.offsetWidth;
    needVisual.classList.add("workflow-pop");
  };

  const setWorkflowStep = (stepKey) => {
    const next = workflowContent[stepKey];
    if (!next) return;

    workflowTabs.forEach((tab) => {
      const isActive = tab.dataset.workflowStep === stepKey;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    workflowVisuals.forEach((visual) => {
      visual.classList.toggle(
        "is-active",
        visual.getAttribute("data-workflow-visual") === stepKey
      );
    });

    if (stepKey === "need") {
      restartNeedVisualPop();
    } else {
      const needVisual = workflowVisuals.find(
        (visual) => visual.getAttribute("data-workflow-visual") === "need"
      );
      if (needVisual) needVisual.classList.remove("workflow-pop");
    }

    workflowCopy.classList.add("is-switching");
    if (workflowSwapTimer) window.clearTimeout(workflowSwapTimer);
    workflowSwapTimer = window.setTimeout(() => {
      workflowTitle.textContent = next.title;
      workflowText.innerHTML = next.text;
      workflowCopy.classList.remove("is-switching");
    }, 160);
  };

  const setWorkflowProgress = (progress) => {
    workflowTabs.forEach((tab, index) => {
      tab.style.setProperty(
        "--workflow-progress",
        index === workflowIndex ? progress.toFixed(4) : "0"
      );
    });
  };

  const advanceWorkflowStep = () => {
    if (workflowSteps.length === 0) return;
    workflowIndex = (workflowIndex + 1) % workflowSteps.length;
    setWorkflowStep(workflowSteps[workflowIndex]);
    workflowCycleStart = performance.now();
    setWorkflowProgress(0);
  };

  const animateWorkflowCycle = (now) => {
    if (workflowSteps.length <= 1) return;
    if (workflowPaused) {
      workflowRafId = window.requestAnimationFrame(animateWorkflowCycle);
      return;
    }
    const progress = Math.min(1, (now - workflowCycleStart) / workflowDurationMs);
    setWorkflowProgress(progress);

    if (progress >= 1) {
      advanceWorkflowStep();
    }

    workflowRafId = window.requestAnimationFrame(animateWorkflowCycle);
  };

  workflowTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const stepKey = tab.dataset.workflowStep || "need";
      const nextIndex = workflowSteps.indexOf(stepKey);
      if (nextIndex >= 0) workflowIndex = nextIndex;
      setWorkflowStep(stepKey);
      workflowCycleStart = performance.now();
      setWorkflowProgress(0);
    });
  });

  if (workflowSteps.length > 0) {
    const initialStep =
      workflowSteps[workflowIndex] || workflowTabs[0]?.dataset.workflowStep || "need";
    setWorkflowStep(initialStep);
  }

  if (workflowSteps.length > 1) {
    setWorkflowProgress(0);
    workflowRafId = window.requestAnimationFrame(animateWorkflowCycle);
    window.addEventListener("beforeunload", () => {
      if (workflowRafId) window.cancelAnimationFrame(workflowRafId);
    });
  }

  if (workflowSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== workflowSection) return;
          const inView = entry.isIntersecting && entry.intersectionRatio >= 0.3;
          workflowSection.classList.toggle("workflow-in-view", inView);

          if (inView) {
            workflowSection.classList.remove("workflow-idle");
            if (workflowPaused) {
              workflowCycleStart += performance.now() - workflowPausedAt;
              workflowPaused = false;
            }
            const currentStep =
              workflowSteps[workflowIndex] ||
              workflowTabs[workflowIndex]?.dataset.workflowStep ||
              "need";
            if (currentStep === "need") restartNeedVisualPop();
          } else if (!workflowPaused) {
            workflowPaused = true;
            workflowPausedAt = performance.now();
            workflowSection.classList.add("workflow-idle");
          }
        });
      },
      { threshold: [0, 0.3, 0.6] }
    );

    observer.observe(workflowSection);

    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
  } else {
    workflowPaused = false;
    if (workflowSection) {
      workflowSection.classList.remove("workflow-idle");
      workflowSection.classList.add("workflow-in-view");
    }
  }
}

const recruitingSection = document.querySelector(".recruiting-activity");
const recruitingCards = Array.from(document.querySelectorAll("[data-alert-card]"));
const recruitingStage = document.querySelector("[data-alert-stage]");

if (recruitingSection && recruitingStage && recruitingCards.length > 0) {
  recruitingSection.classList.add("recruiting-in-view");
}

const autoSections = Array.from(document.querySelectorAll("main > section"));
const isHomePageForAuto = document.body.classList.contains("home-page");
const enableAutoSectionScroll = false;

if (!reduceMotionPreferred && isHomePageForAuto && enableAutoSectionScroll && autoSections.length > 1) {
  const sectionDurationMs = 10000;
  const userPauseMs = 18000;
  let activeIndex = 0;
  let pausedUntil = 0;
  let cycleStart = performance.now();
  let pauseCarryMs = 0;
  let rafId = null;

  const findClosestSectionIndex = () => {
    const viewportMid = window.innerHeight * 0.5;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    autoSections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionMid = rect.top + rect.height * 0.5;
      const distance = Math.abs(sectionMid - viewportMid);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const sectionTitles = autoSections.map((section) => section.querySelector(".section-cycle-title"));

  const clearSectionProgress = () => {
    sectionTitles.forEach((title) => {
      if (title) title.style.setProperty("--section-progress", "0");
    });
  };

  const setSectionProgress = (index, progress) => {
    clearSectionProgress();
    const activeTitle = sectionTitles[index];
    if (activeTitle) {
      activeTitle.style.setProperty("--section-progress", progress.toFixed(4));
    }
  };

  const resetTimerForSection = (index) => {
    activeIndex = index;
    cycleStart = performance.now();
    pauseCarryMs = 0;
    setSectionProgress(activeIndex, 0);
  };

  const pauseAutoCycle = () => {
    if (Date.now() >= pausedUntil) {
      pauseCarryMs = performance.now() - cycleStart;
    }
    pausedUntil = Date.now() + userPauseMs;
  };

  const cycleToNextSection = () => {
    const nextIndex = (activeIndex + 1) % autoSections.length;
    const nextSection = autoSections[nextIndex];
    if (!nextSection) return;

    nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    resetTimerForSection(nextIndex);
  };

  const onScrollSync = () => {
    const closest = findClosestSectionIndex();
    if (closest !== activeIndex) {
      resetTimerForSection(closest);
    }
  };

  const animateCycle = (now) => {
    if (Date.now() < pausedUntil) {
      setSectionProgress(activeIndex, Math.min(1, pauseCarryMs / sectionDurationMs));
      rafId = window.requestAnimationFrame(animateCycle);
      return;
    }

    if (pauseCarryMs > 0) {
      cycleStart = now - pauseCarryMs;
      pauseCarryMs = 0;
    }

    const elapsed = now - cycleStart;
    const progress = Math.min(1, elapsed / sectionDurationMs);
    setSectionProgress(activeIndex, progress);

    if (progress >= 1) {
      cycleToNextSection();
    }

    rafId = window.requestAnimationFrame(animateCycle);
  };

  window.addEventListener("wheel", pauseAutoCycle, { passive: true });
  window.addEventListener("touchstart", pauseAutoCycle, { passive: true });
  window.addEventListener("scroll", onScrollSync, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "PageDown" || event.key === "PageUp" || event.key === " " || event.key === "Home" || event.key === "End") {
      pauseAutoCycle();
    }
  });

  resetTimerForSection(findClosestSectionIndex());
  rafId = window.requestAnimationFrame(animateCycle);

  window.addEventListener("beforeunload", () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  });
}
