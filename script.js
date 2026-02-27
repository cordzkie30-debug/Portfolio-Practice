const revealTargets = document.querySelectorAll(".fade-up, .reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formStatus");
const themeToggle = document.getElementById("themeToggle");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

revealTargets.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.55 }
);

sections.forEach((section) => sectionObserver.observe(section));

if (themeToggle) {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "Dark";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    themeToggle.textContent = isLight ? "Dark" : "Light";
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  });
}

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const userName = contactForm.name.value.trim();
    const userEmail = contactForm.email.value.trim();
    const userMessage = contactForm.message.value.trim();

    if (!userName || !userEmail || !userMessage) {
      formMessage.textContent = "Please complete all fields.";
      formMessage.style.color = "#ef4444";
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    if (!emailOk) {
      formMessage.textContent = "Please use a valid email address.";
      formMessage.style.color = "#ef4444";
      return;
    }

    formMessage.textContent = "Message ready. Connect this form to a backend next.";
    formMessage.style.color = "#22c55e";
    contactForm.reset();
  });
}
