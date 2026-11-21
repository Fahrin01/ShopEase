/* ==========================================================================
   ShopEase — auth.js
   Frontend-only validation for login.html and register.html.
   No backend: this only simulates success and redirects.
   ========================================================================== */

function isValidEmailAuth(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setAuthFieldError(input, errorId, message) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = message;
  const field = input.closest(".form-field");
  if (field) field.classList.toggle("invalid", Boolean(message));
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Login form ---------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      const email = document.getElementById("loginEmail");
      const password = document.getElementById("loginPassword");
      const message = document.getElementById("loginMessage");

      if (!isValidEmailAuth(email.value.trim())) {
        setAuthFieldError(email, "loginEmailError", "Please enter a valid email address.");
        isValid = false;
      } else {
        setAuthFieldError(email, "loginEmailError", "");
      }

      if (password.value.length < 6) {
        setAuthFieldError(password, "loginPasswordError", "Password must be at least 6 characters.");
        isValid = false;
      } else {
        setAuthFieldError(password, "loginPasswordError", "");
      }

      if (!isValid) {
        message.textContent = "";
        return;
      }

      message.textContent = "Login successful! Redirecting...";
      message.className = "form-message success";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    });
  }

  /* ---------- Register form ---------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById("registerName");
      const email = document.getElementById("registerEmail");
      const password = document.getElementById("registerPassword");
      const confirm = document.getElementById("registerConfirm");
      const message = document.getElementById("registerMessage");

      if (name.value.trim().length < 2) {
        setAuthFieldError(name, "registerNameError", "Please enter your full name.");
        isValid = false;
      } else {
        setAuthFieldError(name, "registerNameError", "");
      }

      if (!isValidEmailAuth(email.value.trim())) {
        setAuthFieldError(email, "registerEmailError", "Please enter a valid email address.");
        isValid = false;
      } else {
        setAuthFieldError(email, "registerEmailError", "");
      }

      if (password.value.length < 6) {
        setAuthFieldError(password, "registerPasswordError", "Password must be at least 6 characters.");
        isValid = false;
      } else {
        setAuthFieldError(password, "registerPasswordError", "");
      }

      if (confirm.value === "" || confirm.value !== password.value) {
        setAuthFieldError(confirm, "registerConfirmError", "Passwords do not match.");
        isValid = false;
      } else {
        setAuthFieldError(confirm, "registerConfirmError", "");
      }

      if (!isValid) {
        message.textContent = "";
        return;
      }

      message.textContent = "Account created! Redirecting to login...";
      message.className = "form-message success";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    });
  }
});
