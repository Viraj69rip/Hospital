const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navbar = document.querySelector(".navbar");
const bookingForm = document.querySelector("#bookingForm");
const cursorGlow = document.querySelector(".cursor-glow");
const scrollProgress = document.querySelector(".scroll-progress");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("is-open");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
    });
  });
}

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  if (navbar) {
    navbar.classList.toggle("is-scrolled", scrollTop > 20);
  }

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }
});

if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });
}

const animatedBlocks = document.querySelectorAll("[data-animate]");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const delay = entry.target.getAttribute("data-delay");
    if (delay) {
      entry.target.style.setProperty("--delay", `${delay}ms`);
    }

    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.18
});

animatedBlocks.forEach((block) => revealObserver.observe(block));

const counters = document.querySelectorAll("[data-counter]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const counter = entry.target;
    const target = Number(counter.getAttribute("data-counter"));
    const suffix = target === 96 ? "%" : "+";
    const duration = 1300;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        counter.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(animate);
    counterObserver.unobserve(counter);
  });
}, {
  threshold: 0.5
});

counters.forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  const reset = () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = (0.5 - (y / rect.height)) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", reset);
});

const dots = document.querySelectorAll(".testimonial-dot");
const testimonialCards = document.querySelectorAll(".testimonial-card");
let testimonialIndex = 0;
let testimonialTimer;

const showTestimonial = (index) => {
  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === index);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });

  testimonialIndex = index;
};

const startTestimonialLoop = () => {
  if (testimonialCards.length === 0) {
    return;
  }

  testimonialTimer = window.setInterval(() => {
    const nextIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(nextIndex);
  }, 4500);
};

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    window.clearInterval(testimonialTimer);
    showTestimonial(index);
    startTestimonialLoop();
  });
});

startTestimonialLoop();

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-question");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("is-open");
      faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

if (bookingForm) {
  const dateField = bookingForm.querySelector("#visitDate");
  const today = new Date().toISOString().split("T")[0];

  if (dateField) {
    dateField.min = today;
  }

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const patientName = formData.get("patientName");
    const patientPhone = formData.get("patientPhone");
    const department = formData.get("department");
    const visitDate = formData.get("visitDate");
    const patientConcern = formData.get("patientConcern");

    const message = [
      "Hello Baramati Signature Hospital, I want to book an appointment.",
      `Patient Name: ${patientName}`,
      `Phone Number: ${patientPhone}`,
      `Department: ${department}`,
      `Preferred Date: ${visitDate}`,
      `Symptoms/Requirement: ${patientConcern || "Not provided"}`,
      "Location: Baramati"
    ].join("\n");

    const whatsappUrl = `https://wa.me/919307815563?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener");
  });
}
