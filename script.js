const menuButtons = document.querySelectorAll(".menu-toggle");

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nav = button.closest(".topbar")?.querySelector(".nav-links");
    if (!nav) return;

    nav.classList.toggle("is-open");
  });
});

document.querySelectorAll(".business-nav .nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    link.closest(".nav-links")?.classList.remove("is-open");
  });
});

document.querySelectorAll(".grounds-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector(".form-status");
    const submitButton = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const need = String(data.get("need") || "").trim();
    const fallbackRecipient = form.dataset.recipient || "hello@groundsstudio.com";
    const formAction = form.getAttribute("action") || `https://formsubmit.co/${fallbackRecipient}`;
    const submitUrl = formAction.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");

    if (!name || !contact || !need) {
      if (status) {
        status.textContent = "Please complete all fields before sending.";
        status.classList.add("is-error");
      }
      return;
    }

    if (status) {
      status.textContent = "Sending your inquiry...";
      status.classList.remove("is-error");
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      data.set("_subject", `Project inquiry from ${name}`);

      if (contact.includes("@")) {
        data.set("email", contact);
        data.set("_replyto", contact);
      }

      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: data
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Form submission failed");
      }

      form.reset();

      if (status) {
        status.textContent = result?.message || "Thanks. Your inquiry has been sent.";
      }
    } catch (error) {
      console.error("Grounds Studio inquiry failed:", error);

      if (status) {
        status.textContent = error.message || "Something went wrong. Please try again or email us directly.";
        status.classList.add("is-error");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Inquiry";
      }
    }
  });
});
