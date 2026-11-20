/* ==========================================================================
   ShopEase — script.js
   Site-wide behavior: mobile menu, dropdown, active nav link, footer year,
   navbar scroll shadow, navbar search redirect, newsletter + contact validation.
   Loaded on every page, after products.js, cart.js and auth.js.
   ========================================================================== */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(input, errorId, message) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = message;
  const field = input.closest(".form-field");
  if (field) field.classList.toggle("invalid", Boolean(message));
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ---------- Categories dropdown toggle ---------- */
  const categoriesToggle = document.getElementById("categoriesToggle");
  const categoriesMenu = document.getElementById("categoriesMenu");
  if (categoriesToggle && categoriesMenu) {
    categoriesToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = categoriesMenu.classList.toggle("open");
      categoriesToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!categoriesToggle.contains(e.target) && !categoriesMenu.contains(e.target)) {
        categoriesMenu.classList.remove("open");
        categoriesToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Highlight the active nav link ---------- */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
    if (link.dataset.page === currentPage) link.classList.add("active");
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar shadow on scroll ---------- */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 10 ? "0 4px 16px rgba(20,32,46,0.08)" : "none";
    });
  }

  /* ---------- Navbar search ---------- */
  const navSearchForm = document.getElementById("navSearchForm");
  const navSearchInput = document.getElementById("navSearchInput");
  if (navSearchForm && navSearchInput) {
    navSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = navSearchInput.value.trim();
      const pageSearchInput = document.getElementById("pageSearchInput");

      if (pageSearchInput) {
        // Already on products.html: filter live instead of navigating away
        pageSearchInput.value = query;
        pageSearchInput.dispatchEvent(new Event("input"));
      } else {
        window.location.href = "products.html?search=" + encodeURIComponent(query);
      }
    });
  }

  /* ---------- Newsletter validation (home page) ---------- */
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("newsletterEmail");
      const message = document.getElementById("newsletterMessage");

      if (!isValidEmail(emailInput.value.trim())) {
        message.textContent = "Please enter a valid email address.";
        message.className = "form-message error";
        return;
      }
      message.textContent = "Thanks for subscribing! Check your inbox soon.";
      message.className = "form-message success";
      newsletterForm.reset();
    });
  }

  /* ---------- Contact form validation (contact page) ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById("contactName");
      const email = document.getElementById("contactEmail");
      const msg = document.getElementById("contactMessage");
      const successEl = document.getElementById("contactSuccess");

      if (name.value.trim().length < 2) {
        setFieldError(name, "nameError", "Please enter your name.");
        isValid = false;
      } else {
        setFieldError(name, "nameError", "");
      }

      if (!isValidEmail(email.value.trim())) {
        setFieldError(email, "emailError", "Please enter a valid email address.");
        isValid = false;
      } else {
        setFieldError(email, "emailError", "");
      }

      if (msg.value.trim().length < 10) {
        setFieldError(msg, "messageError", "Message should be at least 10 characters.");
        isValid = false;
      } else {
        setFieldError(msg, "messageError", "");
      }

      if (!isValid) {
        successEl.textContent = "";
        return;
      }

      successEl.textContent = "Message sent! We will get back to you within 24 hours.";
      successEl.className = "form-message success";
      contactForm.reset();
    });
  }
});
