document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen smoothly once assets/scripts initialize
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
    }, 600);

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
    const musicWidget = document.getElementById('music-toggle-btn');
    
    const discordUserId = "1373549788628254821";

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
                    discordDot.title = "Discord Status: Idle";
                } else if (status === 'dnd') {
                    discordDot.style.backgroundColor = '#f04747';
                    discordDot.style.boxShadow = '0 0 8px #f04747';
                    discordDot.title = "Discord Status: Do Not Disturb";
                } else {
                    discordDot.style.backgroundColor = '#747f8d';
                    discordDot.style.boxShadow = 'none';
                    discordDot.title = "Discord Status: Offline";
                }

                // 2. Accurate Spotify Listening Status Verification
                if (data.data.spotify && data.data.listening_to_spotify === true) {
                    const spotify = data.data.spotify;
                    songNameEl.textContent = spotify.song;
                    artistNameEl.textContent = "by " + spotify.artist;
                    
                    if (spotify.album_art_url) {
                        albumArtEl.src = spotify.album_art_url;
                    }
                    musicWidget.style.borderColor = "#00ff66";
                } else {
                    songNameEl.textContent = "Not Listening";
                    artistNameEl.textContent = "Spotify Inactive";
                    albumArtEl.src = "CDEE8C6A-3BF4-47AE-9D9D-9912377216A7.webp";
                    musicWidget.style.borderColor = "rgba(255, 0, 0, 0.4)";
                }
            }
        } catch (error) {
            console.error("Could not fetch Lanyard data:", error);
            songNameEl.textContent = "API Error";
            artistNameEl.textContent = "Check Connection";
        }
    }

    fetchLanyardData();
    setInterval(fetchLanyardData, 10000); // Poll every 10 seconds for snappy updates

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
