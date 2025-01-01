document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const authSection = document.getElementById("auth-section");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const registrationStatus = document.getElementById("registration-status");
  const loginStatus = document.getElementById("login-status");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const switchToRegister = document.getElementById("switch-to-register");
  const switchToLogin = document.getElementById("switch-to-login");
  const logoutBtn = document.getElementById("logout-btn");

  // Helper Functions
  function toggleForms(showLogin) {
    authSection.classList.remove("hidden");
    if (showLogin) {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    } else {
      registerForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    }
  }

  function showError(input, message) {
    const parent = input.parentElement;
    const error = document.createElement("p");
    error.className = "error-message";
    error.style.color = "var(--highlight-color)";
    error.style.margin = "0.25rem 0";
    error.textContent = message;
    parent.appendChild(error);
  }

  function clearErrors(form) {
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function isStrongPassword(password) {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  // Event Listeners for Switching Forms
  if (loginBtn && registerBtn && switchToRegister && switchToLogin) {
    loginBtn.addEventListener("click", () => toggleForms(true));
    registerBtn.addEventListener("click", () => toggleForms(false));
    switchToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      toggleForms(false);
    });
    switchToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      toggleForms(true);
    });
  }

  // Handle Login Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors(loginForm);

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!email || !password) {
        loginStatus.textContent = "Please fill out all fields.";
        loginStatus.style.color = "red";
        return;
      }

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          loginStatus.textContent = "Login successful!";
          loginStatus.style.color = "green";

          setTimeout(() => {
            window.location.href = "./discover.html";
          }, 1000);
        } else {
          loginStatus.textContent = data.error || "Login failed.";
          loginStatus.style.color = "red";
        }
      } catch (error) {
        console.error("Error during login:", error);
        loginStatus.textContent = "An error occurred. Please try again.";
        loginStatus.style.color = "red";
      }
    });
  }

  // Handle Register Form Submission
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors(registerForm);

      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document
        .getElementById("register-password")
        .value.trim();
      const role = document.querySelector('input[name="role"]:checked')?.value;

      if (!name || !email || !password || !role) {
        registrationStatus.textContent = "Please fill out all fields.";
        registrationStatus.style.color = "red";
        return;
      }

      if (!isValidEmail(email)) {
        registrationStatus.textContent = "Enter a valid email address.";
        registrationStatus.style.color = "red";
        return;
      }

      if (!isStrongPassword(password)) {
        registrationStatus.textContent =
          "Password must be at least 8 characters long and include a number and a special character.";
        registrationStatus.style.color = "red";
        return;
      }

      try {
        const response = await fetch(
          "/api/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          registrationStatus.textContent = "Registration successful!";
          registrationStatus.style.color = "green";
        } else {
          registrationStatus.textContent = data.error || "Registration failed.";
          registrationStatus.style.color = "red";
        }
      } catch (error) {
        console.error("Error during registration:", error);
        registrationStatus.textContent = "An error occurred. Please try again.";
        registrationStatus.style.color = "red";
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("You have been logged out.");
      window.location.href = "./index.html";
    });
  }

  // Password Visibility Toggle
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const passwordField = document.getElementById(targetId);

      if (passwordField.type === "password") {
        passwordField.type = "text";
        button.textContent = "Hide";
      } else {
        passwordField.type = "password";
        button.textContent = "Show";
      }
    });
  });
});
