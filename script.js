// Function to remove loading screen safely
function hideLoader() {
    const loader = document.getElementById('loading-screen');
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
}

// Trigger on full window load
window.addEventListener('load', hideLoader);

// Failsafe: Force hide loader after 1.5 seconds just in case an image takes too long or fails
setTimeout(hideLoader, 1500);

// Modal Logic for Updates and FAQ
const updateModal = document.getElementById('update-modal');
const openUpdates = document.getElementById('open-updates');
const closeUpdates = document.getElementById('close-updates');

const faqModal = document.getElementById('faq-modal');
const openFaq = document.getElementById('open-faq');
const closeFaq = document.getElementById('close-faq');

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

// Close modals when clicking outside content area
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// Tab button link handler
document.querySelectorAll('.tab-btn-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const linkType = btn.getAttribute('data-link');
        if (linkType === 'discord' || !linkType) {
            e.preventDefault();
            window.open('https://discord.gg/yourinvite', '_blank');
        }
    });
});
