// Remove loading screen on load
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
});

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

// Tab button link handler (redirects to Discord or specific anchors)
document.querySelectorAll('.tab-btn-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const linkType = btn.getAttribute('data-link');
        if (linkType === 'discord' || !linkType) {
            e.preventDefault();
            // Replace with your actual invite link if desired
            window.open('https://discord.gg/yourinvite', '_blank');
        }
    });
});
