import translations, { phoneData, sensitiveData } from "./translations.js";

class EtangApp {
  constructor() {
    this.currentLang = "fr";
    this.init();
  }

  init() {
    this.initLanguageSwitcher();
    this.initScrollAnimations();
    this.initMobileMenu();
    this.initSmoothScroll();
    this.initModals();
    this.updateLanguage(this.currentLang);
  }

  // --- Language Translation Logic ---
  initLanguageSwitcher() {
    const langBtns = document.querySelectorAll(".lang-btn");

    langBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const lang = e.target.getAttribute("data-lang");
        if (lang === this.currentLang) return;

        // Update active class
        langBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Update Language
        this.updateLanguage(lang);
      });
    });
  }

  updateLanguage(lang) {
    this.currentLang = lang;
    document.documentElement.lang = lang;
    const currentTranslations = translations[lang];

    // Translate text contents
    const elementsToTranslate = document.querySelectorAll("[data-i18n]");
    elementsToTranslate.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (currentTranslations[key]) {
        el.innerHTML = currentTranslations[key];
      }
    });

    // Translate attributes (like alt texts)
    const attrElementsToTranslate =
      document.querySelectorAll("[data-i18n-alt]");
    attrElementsToTranslate.forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (currentTranslations[key]) {
        el.setAttribute("alt", currentTranslations[key]);
      }
    });

    // Translate aria-labels
    const labelElementsToTranslate =
      document.querySelectorAll("[data-i18n-label]");
    labelElementsToTranslate.forEach((el) => {
      const key = el.getAttribute("data-i18n-label");
      if (currentTranslations[key]) {
        el.setAttribute("aria-label", currentTranslations[key]);
      }
    });

    // Render obfuscated phone numbers assembled from fragments
    this.renderPhones(lang);

    // Render obfuscated sensitive data assembled from fragments
    this.renderSensitiveData();
  }

  /**
   * Assembles phone number fragments at runtime and injects them as clickable
   * list items. Numbers are never stored as complete strings to prevent scraping.
   */
  renderPhones(lang) {
    const container = document.querySelector("[data-phones]");
    if (!container) return;

    const phones = phoneData[lang] ?? [];

    // Clear previous entries
    container.innerHTML = "";

    phones.forEach((fragments) => {
      // Assemble display text and tel: href from fragments
      const displayNumber = fragments.join("");
      const telNumber = displayNumber.replace(/[\s()]/g, "");

      const li = document.createElement("li");
      li.className = "footer__list-item";

      const icon = document.createElement("span");
      icon.className = "material-symbols-outlined";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "call";

      const link = document.createElement("a");
      link.href = `tel:${telNumber}`;
      link.textContent = displayNumber;

      li.appendChild(icon);
      li.appendChild(link);
      container.appendChild(li);
    });
  }

  /**
   * Assembles sensitive data fragments at runtime and injects them into the DOM.
   * Handles plain text spans, email anchors (mailto:), and phone anchors (tel:).
   * Sensitive data is never stored as a complete string in the source.
   */
  renderSensitiveData() {
    // Plain text: <span data-sensitive="key">...
    document.querySelectorAll("[data-sensitive]").forEach((el) => {
      const key = el.getAttribute("data-sensitive");
      const fragments = sensitiveData[key];
      if (fragments) {
        el.textContent = fragments.join("");
      }
    });

    // Email links: <a data-sensitive-email="key">...
    document.querySelectorAll("[data-sensitive-email]").forEach((el) => {
      const key = el.getAttribute("data-sensitive-email");
      const fragments = sensitiveData[key];
      if (fragments) {
        const assembled = fragments.join("");
        el.textContent = assembled;
        el.href = `mailto:${assembled}`;
      }
    });

    // Phone links: <a data-sensitive-tel="key">...
    document.querySelectorAll("[data-sensitive-tel]").forEach((el) => {
      const key = el.getAttribute("data-sensitive-tel");
      const fragments = sensitiveData[key];
      if (fragments) {
        const displayNumber = fragments.join("");
        const telNumber = displayNumber.replace(/[\s()]/g, "");
        el.textContent = displayNumber;
        el.href = `tel:${telNumber}`;
      }
    });
  }

  // --- Intersection Observer for Animations ---
  initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      ".animate-fade-in, .animate-slide-up, .activity-card"
    );

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((el) => observer.observe(el));
  }

  // --- Mobile Menu Toggle ---
  initMobileMenu() {
    const menuBtn = document.querySelector(".header__menu-btn");
    const nav = document.querySelector(".header__nav");

    menuBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", isOpen);

      // Update aria-label based on state
      const labelKey = isOpen ? "menu-close-label" : "menu-open-label";
      const translation = translations[this.currentLang][labelKey];
      if (translation) {
        menuBtn.setAttribute("aria-label", translation);
      }
    });
  }

  // --- Smooth Scrolling ---
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Close mobile menu if open
          const nav = document.querySelector(".header__nav");
          if (nav.classList.contains("is-open")) {
            nav.classList.remove("is-open");
          }

          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // --- Modals ---
  initModals() {
    const modalLinks = document.querySelectorAll("[data-modal-target]");
    const modals = document.querySelectorAll(".modal");
    const closeBtns = document.querySelectorAll(".modal__close");

    modalLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("data-modal-target");
        const targetModal = document.getElementById(targetId);
        if (targetModal) {
          targetModal.classList.add("is-open");
          document.body.style.overflow = "hidden"; // Prevent background scrolling
        }
      });
    });

    // Close via close button
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        if (modal) {
          modal.classList.remove("is-open");
          document.body.style.overflow = "";
        }
      });
    });

    // Close on clicking outside the modal content
    modals.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("is-open");
          document.body.style.overflow = "";
        }
      });
    });
  }
}

// Initialize the app when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new EtangApp();
});
