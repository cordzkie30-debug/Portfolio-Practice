const navbar = document.querySelector(".custom-navbar");
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const successAlert = document.querySelector(".form-alert-success");
const errorAlert = document.querySelector(".form-alert-error");
const themeToggle = document.querySelector("#themeToggle");
const body = document.body;
const lightboxTriggers = document.querySelectorAll(".lightbox-trigger");
const lightboxModal = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector("#lightboxClose");
const lightboxBackdrop = document.querySelector("#lightboxBackdrop");

const getPreferredTheme = () => {
  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = (theme) => {
  body.setAttribute("data-theme", theme);

  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
  }
};

const encodeFormData = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");

const updateNavbarState = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 20);
};

const openLightbox = (trigger) => {
  if (!lightboxModal || !lightboxImage || !trigger) return;

  const imageSrc = trigger.getAttribute("data-lightbox-image") || trigger.getAttribute("src");
  const imageAlt = trigger.getAttribute("data-lightbox-alt") || trigger.getAttribute("alt") || "";

  lightboxImage.setAttribute("src", imageSrc);
  lightboxImage.setAttribute("alt", imageAlt);
  lightboxModal.classList.add("is-open");
  lightboxModal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightboxModal || !lightboxImage) return;

  lightboxModal.classList.remove("is-open");
  lightboxModal.setAttribute("aria-hidden", "true");
  lightboxImage.setAttribute("src", "");
  lightboxImage.setAttribute("alt", "");
  body.style.overflow = "";
};

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = body.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  });
}

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openLightbox(trigger));
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(trigger);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxBackdrop?.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightboxModal?.classList.contains("is-open")) {
    closeLightbox();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button[type='submit']");

    contactForm.classList.add("was-validated");
    successAlert?.classList.add("d-none");
    errorAlert?.classList.add("d-none");

    if (!contactForm.checkValidity()) {
      contactForm.querySelector(":invalid")?.focus();
      return;
    }

    if (!button) return;

    const originalText = button.textContent;
    button.textContent = "Sending...";
    button.disabled = true;

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(payload),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();
      contactForm.classList.remove("was-validated");
      contactForm.querySelectorAll(".is-valid, .is-invalid").forEach((field) => {
        field.classList.remove("is-valid", "is-invalid");
      });
      successAlert?.classList.remove("d-none");
    } catch (error) {
      errorAlert?.classList.remove("d-none");
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });

  contactForm.querySelectorAll(".form-control").forEach((field) => {
    field.addEventListener("input", () => {
      if (field.checkValidity()) {
        field.classList.add("is-valid");
        field.classList.remove("is-invalid");
      } else {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
      }
    });
  });
}

updateNavbarState();
window.addEventListener("scroll", updateNavbarState);
