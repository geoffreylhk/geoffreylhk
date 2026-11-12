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

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const status = document.querySelector("#contact-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
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
    submitButton.textContent = "Sending…";
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
      submitButton.textContent = "Send message";
      contactForm.removeAttribute("aria-busy");
    }
  });
}
