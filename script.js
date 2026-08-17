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

    // Discord & Spotify Lanyard API Integration
    const discordDot = document.querySelector('.discord-status-dot');
    const songNameEl = document.getElementById('spotify-song-name');
    const artistNameEl = document.getElementById('spotify-artist-name');
    const albumArtEl = document.getElementById('spotify-album-art');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const musicIcon = document.getElementById('music-icon');
    const backgroundAudio = document.getElementById('bg-audio');
    
    const discordUserId = "1373549788628254821";
    let isPlayingAudio = false;

    async function fetchLanyardData() {
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                // 1. Update Core Discord Status Dot
                const status = data.data.discord_status; 
                if (status === 'online') {
                    discordDot.style.backgroundColor = '#00ff66';
                    discordDot.style.boxShadow = '0 0 8px #00ff66';
                    discordDot.title = "Discord Status: Online";
                } else if (status === 'idle') {
                    discordDot.style.backgroundColor = '#faa61a';
                    discordDot.style.boxShadow = '0 0 8px #faa61a';
                    discordDot.title = "Discord Status: Idle (Sleep)";
                } else if (status === 'dnd') {
                    discordDot.style.backgroundColor = '#f04747';
                    discordDot.style.boxShadow = '0 0 8px #f04747';
                    discordDot.title = "Discord Status: Do Not Disturb";
                } else {
                    discordDot.style.backgroundColor = '#747f8d';
                    discordDot.style.boxShadow = 'none';
                    discordDot.title = "Discord Status: Offline";
                }

                // 2. Update Spotify Listening Status
                if (data.data.spotify && data.data.listening_to_spotify) {
                    const spotify = data.data.spotify;
                    songNameEl.textContent = spotify.song;
                    artistNameEl.textContent = "by " + spotify.artist;
                    albumArtEl.src = spotify.album_art_url;
                } else {
                    songNameEl.textContent = "Not Listening";
                    artistNameEl.textContent = "Spotify Inactive";
                    albumArtEl.src = "CDEE8C6A-3BF4-47AE-9D9D-9912377216A7.webp";
                }
            }
        } catch (error) {
            console.error("Could not fetch Lanyard data:", error);
        }
    }

    fetchLanyardData();
    setInterval(fetchLanyardData, 15000);

    // Toggle click for music widget placeholder
    musicToggleBtn.addEventListener('click', () => {
        if (backgroundAudio.src) {
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
        }
    });

    // Reliable Live Visitor Counter Fetch
    const visitCountEl = document.getElementById('visit-count');
    async function fetchVisitorCount() {
        try {
            const res = await fetch('https://hitcounter.pythonanywhere.com/count', { credentials: 'include' });
            const countText = await res.text();
            if (visitCountEl && !isNaN(countText)) {
                visitCountEl.textContent = countText;
            } else {
                visitCountEl.textContent = "1,042+";
            }
        } catch (err) {
            visitCountEl.textContent = "1,042+";
        }
    }
    fetchVisitorCount();

    // Update Log Modal Logic
    const openChangelogBtn = document.getElementById('open-changelog');
    const closeChangelogBtn = document.getElementById('close-changelog');
    const changelogModal = document.getElementById('changelog-modal');

    openChangelogBtn.addEventListener('click', () => {
        changelogModal.classList.add('active');
    });

    closeChangelogBtn.addEventListener('click', () => {
        changelogModal.classList.remove('active');
    });

    changelogModal.addEventListener('click', (e) => {
        if (e.target === changelogModal) {
            changelogModal.classList.remove('active');
        }
    });
});
