const nav=document.querySelector(".floating-nav");const hero=document.querySelector(".hero");const heroBg=document.querySelector(".hero-bg");const mouseGlow=document.querySelector(".mouse-glow");const timeline=document.querySelector("[data-timeline]");const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener("click",e=>{const target=document.querySelector(a.getAttribute("href"));if(!target)return;e.preventDefault();target.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});window.history.pushState(null,"",a.getAttribute("href"))})});const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;el.classList.add("visible");if(el.classList.contains("reveal-group")){el.querySelectorAll(".reveal").forEach((child,index)=>{child.style.transitionDelay=`${index*70}ms`;child.classList.add("visible")})}if(el.classList.contains("stagger-tags")){el.classList.add("visible");el.querySelectorAll(".pill").forEach((pill,index)=>{pill.style.transitionDelay=`${index*45}ms`})}})},{threshold:.16});document.querySelectorAll(".reveal,.reveal-group,.stagger-tags").forEach(el=>observer.observe(el));function updateScrollEffects(){const y=window.scrollY;if(nav)nav.classList.toggle("visible",y>96);if(hero&&heroBg&&!reduced){const progress=Math.min(Math.max(y/hero.offsetHeight,0),1);heroBg.style.setProperty("--hero-y",`${progress*90}px`);heroBg.style.setProperty("--hero-scale",`${1.08+progress*.08}`)}if(timeline){const rect=timeline.getBoundingClientRect();const start=window.innerHeight*.72;const end=window.innerHeight*.42-rect.height;const progress=(start-rect.top)/(start-end);timeline.style.setProperty("--timeline-progress",Math.min(Math.max(progress,0),1).toString())}}window.addEventListener("scroll",updateScrollEffects,{passive:true});window.addEventListener("resize",updateScrollEffects);updateScrollEffects();if(hero&&mouseGlow&&!reduced){hero.addEventListener("mousemove",event=>{const rect=hero.getBoundingClientRect();const x=(event.clientX-rect.left-rect.width/2)/rect.width;const y=(event.clientY-rect.top-rect.height/2)/rect.height;mouseGlow.style.setProperty("--mouse-x",`${x*68}px`);mouseGlow.style.setProperty("--mouse-y",`${y*52}px`)});hero.addEventListener("mouseleave",()=>{mouseGlow.style.setProperty("--mouse-x","0px");mouseGlow.style.setProperty("--mouse-y","0px")})}document.querySelectorAll(".project-card").forEach(card=>{const inner=card.querySelector(".project-inner");if(!inner||reduced)return;card.addEventListener("mousemove",event=>{const rect=card.getBoundingClientRect();const px=(event.clientX-rect.left)/rect.width;const py=(event.clientY-rect.top)/rect.height;inner.style.setProperty("--tilt-x",`${(0.5-py)*12}deg`);inner.style.setProperty("--tilt-y",`${(px-0.5)*12}deg`);inner.style.setProperty("--glare-x",`${px*100}%`);inner.style.setProperty("--glare-y",`${py*100}%`)});card.addEventListener("mouseleave",()=>{inner.style.setProperty("--tilt-x","0deg");inner.style.setProperty("--tilt-y","0deg");inner.style.setProperty("--glare-x","50%");inner.style.setProperty("--glare-y","50%")})});
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
