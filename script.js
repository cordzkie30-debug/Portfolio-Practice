
const fadeElements = document.querySelectorAll(".fade-up");

const scrollObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, {
  threshold: 0.3
});

fadeElements.forEach(function(element) {
  scrollObserver.observe(element);
});



const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formStatus");

contactForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const userName = contactForm.name.value.trim();
  const userEmail = contactForm.email.value.trim();
  const userMessage = contactForm.message.value.trim();

  
  if (!userName || !userEmail || !userMessage) {
    formMessage.textContent = "Oops! Please complete all fields.";
    formMessage.style.color = "#e74c3c";
    return;
  }

  if (!userEmail.includes("@") || !userEmail.includes(".")) {
    formMessage.textContent = "That email doesn't look valid.";
    formMessage.style.color = "#e74c3c";
    return;
  }

 
  formMessage.textContent = "Thanks! Your message has been sent.";
  formMessage.style.color = "#2ecc71";

  contactForm.reset();
});
