(() => {
  const preview = document.querySelector("#csr-preview");
  if (!preview) return;

  const media = preview.querySelector(".project-media");
  const slides = [...media.querySelectorAll(".project-slide")];
  const descriptions = [...preview.querySelectorAll(".project-descriptions p")];
  const controls = preview.querySelector(".project-controls");
  const dotGroup = controls.querySelector(".project-dots");
  const dots = [...dotGroup.querySelectorAll(".project-dot")];
  const ring = dotGroup.querySelector(".project-timer-progress");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let inView = false;
  let countdown;

  function show(index) {
    if (index === current) return;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-previous", i === current && i !== index);
      slide.classList.toggle("is-current", i === index);
      slide.setAttribute("aria-hidden", String(i !== index));
      descriptions[i].setAttribute("aria-hidden", String(i !== index));
    });
    dots[current].removeAttribute("aria-current");
    dots[index].setAttribute("aria-current", "true");
    dotGroup.style.setProperty("--active-dot", index);
    current = index;
  }

  function resetCountdown() {
    countdown?.cancel();
    countdown = null;
  }

  function syncCountdown() {
    if (!inView || document.hidden || reducedMotion.matches) {
      resetCountdown();
      return;
    }
    if (media.matches(":focus-visible")) {
      countdown?.pause();
      return;
    }
    if (countdown) {
      countdown.play();
      return;
    }

    const animation = ring.animate(
      [{ strokeDashoffset: "100" }, { strokeDashoffset: "0" }],
      { duration: 5000, fill: "forwards" }
    );
    countdown = animation;
    animation.onfinish = () => {
      if (countdown !== animation) return;
      resetCountdown();
      if (!inView || document.hidden || reducedMotion.matches || media.matches(":focus-visible")) return;
      show((current + 1) % slides.length);
      syncCountdown();
    };
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      resetCountdown();
      syncCountdown();
    });
  });
  media.addEventListener("focus", syncCountdown);
  media.addEventListener("blur", syncCountdown);
  reducedMotion.addEventListener("change", syncCountdown);
  document.addEventListener("visibilitychange", syncCountdown);
  new IntersectionObserver(([entry]) => {
    inView = entry.intersectionRatio >= 0.4;
    syncCountdown();
  }, { threshold: 0.4 }).observe(media);
  controls.hidden = false;
})();

(() => {
  const coverflow = document.querySelector("#more-projects");
  if (!coverflow) return;

  const stage = coverflow.querySelector(".coverflow-stage");
  const cards = [...stage.querySelectorAll(".coverflow-card")];
  const ambience = stage.querySelector(".coverflow-ambience");
  const previous = stage.querySelector(".coverflow-previous");
  const next = stage.querySelector(".coverflow-next");
  const pagination = coverflow.querySelector(".coverflow-dots");
  const status = coverflow.querySelector(".coverflow-status");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const positions = ["center", "near-right", "far-right", "offstage", "far-left", "near-left"];
  let current = 0;
  let gesture;
  let motionFrame;
  let dragPosition = 0;

  const wrap = index => ((index % cards.length) + cards.length) % cards.length;
  const titles = cards.map(card => card.querySelector("h4").textContent);
  const pdfLinks = cards.map(card => card.querySelector(".coverflow-pdf"));
  const pdfPreview = document.querySelector("#project-pdf-preview");
  const pdfTitle = pdfPreview.querySelector("h2");
  const pdfPages = pdfPreview.querySelector(".pdf-preview-pages");
  const dots = titles.map((title, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Show ${title}`);
    button.setAttribute("aria-controls", stage.id);
    button.addEventListener("click", () => navigate(index));
    pagination.append(button);
    return button;
  });

  if (typeof pdfPreview.showModal === "function") {
    pdfLinks.forEach((link, index) => {
      if (!link) return;
      link.setAttribute("aria-haspopup", "dialog");
      link.addEventListener("click", event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (index !== current || stage.hasAttribute("data-moving")) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        pdfTitle.textContent = titles[index];
        const pages = Number(link.dataset.pages);
        const pageFolder = link.href.replace("/pdfs/", "/pdf-pages/").replace(/\.pdf$/, "");
        const fragment = document.createDocumentFragment();
        for (let page = 1; page <= pages; page++) {
          const image = document.createElement("img");
          const number = String(page).padStart(String(pages).length, "0");
          image.loading = page === 1 ? "eager" : "lazy";
          image.alt = `Page ${page} of ${pages}`;
          image.src = `${pageFolder}/page-${number}.jpg`;
          fragment.append(image);
        }
        pdfPages.replaceChildren(fragment);
        pdfPreview.showModal();
        pdfPages.scrollTop = 0;
      });
    });
    pdfPreview.addEventListener("close", () => {
      pdfPages.replaceChildren();
      pdfLinks[current]?.focus({ preventScroll: true });
    });
  }

  function show(index, announce = false) {
    current = wrap(index);
    cards.forEach((card, i) => {
      card.dataset.position = positions[wrap(i - current)];
      card.setAttribute("aria-hidden", String(i !== current));
      if (pdfLinks[i]) pdfLinks[i].tabIndex = i === current ? 0 : -1;
      if (i === current) dots[i].setAttribute("aria-current", "true");
      else dots[i].removeAttribute("aria-current");
    });
    const image = cards[current].querySelector("img");
    ambience.style.setProperty("--coverflow-image", `url("${image.getAttribute("src")}")`);
    if (announce) status.textContent = `${titles[current]}, ${current + 1} of ${cards.length}`;
  }

  function navigate(index) {
    clearMotion();
    show(index, true);
  }

  function clearMotion() {
    cancelAnimationFrame(motionFrame);
    motionFrame = undefined;
    if (!stage.hasAttribute("data-moving")) return;
    stage.removeAttribute("data-moving");
    cards.forEach(card => {
      card.style.removeProperty("--drag-distance");
      card.style.removeProperty("--drag-side");
    });
  }

  function renderDrag(position) {
    dragPosition = position;
    stage.setAttribute("data-moving", "");
    const half = cards.length / 2;
    cards.forEach((card, index) => {
      // Recycle each card at the back of the loop, where its opacity is zero.
      const distance = wrap(index - position + half) - half;
      card.style.setProperty("--drag-distance", Math.abs(distance));
      card.style.setProperty("--drag-side", Math.sign(distance));
    });
  }

  function settleDrag(position, velocity = 0) {
    const projection = position + velocity * 220;
    const target = Math.sign(projection) * Math.round(Math.abs(projection));
    if (reducedMotion.matches || Math.abs(target - position) < .001) {
      navigate(target);
      return;
    }

    const duration = Math.abs(target - position) > 1 ? 560 : 300;
    const start = performance.now();
    function coast(now) {
      const progress = Math.min(1, (now - start) / duration);
      renderDrag(target + (position - target) * (1 - progress) ** 3);
      if (progress < 1) motionFrame = requestAnimationFrame(coast);
      else navigate(target);
    }
    motionFrame = requestAnimationFrame(coast);
  }

  previous.addEventListener("click", () => navigate(current - 1));
  next.addEventListener("click", () => navigate(current + 1));
  coverflow.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const destinations = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1 };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    navigate(destinations[event.key]);
  });

  stage.addEventListener("pointerdown", event => {
    if (!event.isPrimary || event.button !== 0 || event.target.closest("button")) return;
    cancelAnimationFrame(motionFrame);
    motionFrame = undefined;
    const moving = stage.hasAttribute("data-moving");
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    gesture = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      card: event.target.closest(".coverflow-card"),
      dragging: false,
      position: moving ? dragPosition : current,
      step: Math.min(stage.clientWidth * .245, rem * 17.8125),
      samples: [{ x: event.clientX, time: event.timeStamp }],
    };
    // Preserve the native link click until a horizontal drag actually starts.
    if (!event.target.closest(".coverflow-pdf")) stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener("pointermove", event => {
    if (gesture?.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.dragging && (Math.abs(dx) < 10 || Math.abs(dx) <= Math.abs(dy))) return;
    if (!gesture.dragging) stage.setPointerCapture(event.pointerId);
    gesture.dragging = true;
    gesture.samples.push({ x: event.clientX, time: event.timeStamp });
    gesture.samples = gesture.samples.filter(sample => event.timeStamp - sample.time <= 100);
    if (reducedMotion.matches) return;
    stage.setAttribute("data-dragging", "");
    renderDrag(gesture.position - dx / gesture.step);
  });
  function endGesture(event) {
    if (gesture?.id !== event.pointerId) return;
    const { x, y, card, dragging, position, step, samples } = gesture;
    gesture = null;
    stage.removeAttribute("data-dragging");
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    if (event.type === "pointerup") {
      if (dragging) {
        const recent = samples.find(sample => event.timeStamp - sample.time <= 100);
        const elapsed = recent ? Math.max(16, event.timeStamp - recent.time) : 0;
        const speed = elapsed ? (recent.x - event.clientX) / elapsed : 0;
        const velocity = reducedMotion.matches ? 0 : Math.max(-.018, Math.min(.018, speed / step));
        settleDrag(position - dx / step, velocity);
        return;
      }
      if (!dragging && Math.hypot(dx, dy) < 10 && card && card.dataset.position !== "center") {
        navigate(cards.indexOf(card));
        return;
      }
    }
    if (stage.hasAttribute("data-moving")) {
      settleDrag(dragPosition);
    }
  }
  stage.addEventListener("pointerup", endGesture);
  stage.addEventListener("pointercancel", endGesture);
  stage.addEventListener("lostpointercapture", endGesture);

  show(0);
  coverflow.classList.add("is-ready");
  previous.hidden = next.hidden = pagination.hidden = false;
})();

(() => {
  function setFillOrigin(event) {
    const pill = event.currentTarget;
    const { left, top, width, height } = pill.getBoundingClientRect();
    const x = Math.max(0, Math.min(width, event.clientX - left));
    const y = Math.max(0, Math.min(height, event.clientY - top));
    const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
    pill.style.setProperty("--fill-x", `${x}px`);
    pill.style.setProperty("--fill-y", `${y}px`);
    pill.style.setProperty("--fill-size", `${Math.ceil(radius * 2)}px`);
  }

  document.querySelectorAll(".fill-pill").forEach(pill => {
    pill.addEventListener("pointerenter", setFillOrigin);
    pill.addEventListener("pointerdown", setFillOrigin);
    pill.addEventListener("focus", () => {
      if (!pill.matches(":focus-visible")) return;
      for (const property of ["--fill-x", "--fill-y", "--fill-size"]) {
        pill.style.removeProperty(property);
      }
    });
  });
})();

(() => {
  const journey = document.querySelector("#experience.journey");
  if (!journey) return;

  const tabs = Array.from(journey.querySelectorAll('.journey-tabs [role="tab"]'));
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute("aria-controls")));

  function select(index, moveFocus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (moveFocus) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", event => {
      let next;
      switch (event.key) {
        case "ArrowLeft": next = (index + tabs.length - 1) % tabs.length; break;
        case "ArrowRight": next = (index + 1) % tabs.length; break;
        case "Home": next = 0; break;
        case "End": next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      select(next, true);
    });
  });
})();

const heroContactLink = document.querySelector("#hero-contact-link");
const contactSection = document.querySelector("#contact");
const contactName = document.querySelector("#contact-name");
if (heroContactLink && contactSection && contactName) {
  heroContactLink.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (location.hash !== heroContactLink.hash) {
      history.pushState(null, "", heroContactLink.hash);
    }
    contactName.focus({ preventScroll: true });
    contactSection.scrollIntoView();
  });
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const status = document.querySelector("#contact-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.querySelector(".contact-submit-label");
  const idleLabel = submitLabel.textContent;
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton.disabled || !contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    if (data.get("_honey")) return;
    if (!String(data.get("name")).trim() || !String(data.get("message")).trim()) {
      status.dataset.state = "error";
      status.textContent = "Please enter your name and a message.";
      return;
    }
    submitButton.disabled = true;
    submitLabel.textContent = "Sending…";
    contactForm.setAttribute("aria-busy", "true");
    status.dataset.state = "pending";
    status.textContent = "Sending your message…";
    try {
      const response = await fetch(contactForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== "true")) throw new Error("Submission failed");
      status.dataset.state = "success";
      status.textContent = "Your message has been submitted. Thank you for getting in touch!";
      contactForm.reset();
    } catch {
      status.dataset.state = "error";
      status.textContent = "Your message could not be confirmed. Please try again, or email geoffreylhk@gmail.com. Your message is still here.";
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = idleLabel;
      contactForm.removeAttribute("aria-busy");
    }
  });
}
