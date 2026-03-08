import translations from './translations.js';

class EtangApp {
    constructor() {
        this.currentLang = 'fr';
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
        const langBtns = document.querySelectorAll('.lang-btn');

        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                if (lang === this.currentLang) return;

                // Update active class
                langBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

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
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (currentTranslations[key]) {
                el.innerHTML = currentTranslations[key];
            }
        });

        // Translate attributes (like alt texts)
        const attrElementsToTranslate = document.querySelectorAll('[data-i18n-alt]');
        attrElementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n-alt');
            if (currentTranslations[key]) {
                el.setAttribute('alt', currentTranslations[key]);
            }
        });
    }

    // --- Intersection Observer for Animations ---
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .activity-card');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Mobile Menu Toggle ---
    initMobileMenu() {
        const menuBtn = document.querySelector('.header__menu-btn');
        const nav = document.querySelector('.header__nav');

        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('is-open');
        });
    }

    // --- Smooth Scrolling ---
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();

                    // Close mobile menu if open
                    const nav = document.querySelector('.header__nav');
                    if (nav.classList.contains('is-open')) {
                        nav.classList.remove('is-open');
                    }

                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // --- Modals ---
    initModals() {
        const modalLinks = document.querySelectorAll('[data-modal-target]');
        const modals = document.querySelectorAll('.modal');
        const closeBtns = document.querySelectorAll('.modal__close');

        modalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-modal-target');
                const targetModal = document.getElementById(targetId);
                if (targetModal) {
                    targetModal.classList.add('is-open');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });

        // Close via close button
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close on clicking outside the modal content
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            });
        });
    }
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new EtangApp();
});
