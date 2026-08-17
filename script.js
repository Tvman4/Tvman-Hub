document.addEventListener('DOMContentLoaded', () => {
    const discordInviteLink = "https://discord.gg/chG2a3uyRY";
    const githubReleasesLink = "https://github.com/Tvman4/TvMenuLib/releases";
    const tabButtons = document.querySelectorAll('.tab-btn');

    // Handle distinct button link behaviors
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const linkType = button.getAttribute('data-link');
            if (linkType === 'github') {
                window.open(githubReleasesLink, '_blank');
            } else {
                window.open(discordInviteLink, '_blank');
            }
        });
    });

    // Music Player Logic
    const backgroundAudio = document.getElementById('bg-audio');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const musicIcon = document.getElementById('music-icon');

    // Set default volume
    backgroundAudio.volume = 0.5;

    musicToggleBtn.addEventListener('click', () => {
        if (backgroundAudio.paused) {
            backgroundAudio.play();
            musicToggleBtn.classList.add('playing');
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        } else {
            backgroundAudio.pause();
            musicToggleBtn.classList.remove('playing');
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        }
    });

    // Visitor Counter Logic (Stores visits locally and increments on unique session loads)
    const visitCountElement = document.getElementById('visit-count');
    let visits = localStorage.getItem('tvman_hub_visits');
    
    if (!visits) {
        visits = 1342; // Base starting count
    }
    
    if (!sessionStorage.getItem('visited_session')) {
        visits = parseInt(visits) + 1;
        localStorage.setItem('tvman_hub_visits', visits);
        sessionStorage.setItem('visited_session', 'true');
    }
    
    visitCountElement.textContent = Number(visits).toLocaleString();
});
