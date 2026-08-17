document.addEventListener('DOMContentLoaded', () => {
    const discordInviteLink = "https://discord.gg/chG2a3uyRY";
    const tabButtons = document.querySelectorAll('.tab-btn');

    // Handle Discord tab redirects
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.open(discordInviteLink, '_blank');
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
});
