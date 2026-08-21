function hideLoader() {
    const loader = document.getElementById('loading-screen');
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
}

window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 1500);

// Language Switching Engine
function changeLanguage(lang) {
    if (!translations[lang]) return;
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Handle RTL orientation support for languages like Arabic, Persian, Hebrew, Urdu
    if (['ar', 'fa', 'he', 'ur'].includes(lang)) {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }

    localStorage.setItem('selected_lang', lang);
}

const langSelect = document.getElementById('language-select');
if (langSelect) {
    const savedLang = localStorage.getItem('selected_lang') || 'en';
    langSelect.value = savedLang;
    changeLanguage(savedLang);

    langSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
}

// Modals Control Logic
const updateModal = document.getElementById('update-modal');
const openUpdates = document.getElementById('open-updates');
const closeUpdates = document.getElementById('close-updates');

const faqModal = document.getElementById('faq-modal');
const openFaq = document.getElementById('open-faq');
const closeFaq = document.getElementById('close-faq');

const creditsModal = document.getElementById('credits-modal');
const openCredits = document.getElementById('open-credits');
const closeCredits = document.getElementById('close-credits');

if (openUpdates && updateModal) {
    openUpdates.addEventListener('click', (e) => {
        e.preventDefault();
        updateModal.classList.add('active');
    });
}

if (closeUpdates && updateModal) {
    closeUpdates.addEventListener('click', () => {
        updateModal.classList.remove('active');
    });
}

if (openFaq && faqModal) {
    openFaq.addEventListener('click', (e) => {
        e.preventDefault();
        faqModal.classList.add('active');
    });
}

if (closeFaq && faqModal) {
    closeFaq.addEventListener('click', () => {
        faqModal.classList.remove('active');
    });
}

if (openCredits && creditsModal) {
    openCredits.addEventListener('click', (e) => {
        e.preventDefault();
        creditsModal.classList.add('active');
    });
}

if (closeCredits && creditsModal) {
    closeCredits.addEventListener('click', () => {
        creditsModal.classList.remove('active');
    });
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// External link buttons router
document.querySelectorAll('.tab-btn-pill[data-link]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const linkType = btn.getAttribute('data-link');
        if (linkType === 'discord') {
            e.preventDefault();
            window.open('https://discord.gg/chG2a3uyRY', '_blank');
        } else if (linkType === 'lib') {
            e.preventDefault();
            window.open('https://github.com/Tvman4/TvMenuLib/releases/tag/TvMenuV2', '_blank');
        }
    });
});
