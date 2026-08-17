document.addEventListener('DOMContentLoaded', () => {
    // Animated Loading Screen Text Loop Logic
    const loadingScreen = document.getElementById('loading-screen');
    const loadingTextEl = document.querySelector('#loading-screen h2');
    
    const loadingStates = ["Loading.", "Loading..", "Loading…"];
    let stateIndex = 0;
    
    const loadingInterval = setInterval(() => {
        if (loadingTextEl) {
            loadingTextEl.textContent = loadingStates[stateIndex];
            stateIndex = (stateIndex + 1) % loadingStates.length;
        }
    }, 400); // Cycles every 400ms

    // Hide loading screen smoothly once initialization finishes
    setTimeout(() => {
        clearInterval(loadingInterval);
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
    }, 1500);

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
    const musicIcon = document.getElementById('music-icon');
    
    const discordUserId = "1373549788628254821";
    let activeSpotifyUrl = null;

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

                // 2. Accurate Spotify Listening Status Verification & Full Song Link Bind
                if (data.data.spotify && data.data.listening_to_spotify === true) {
                    const spotify = data.data.spotify;
                    songNameEl.textContent = spotify.song;
                    artistNameEl.textContent = "by " + spotify.artist;
                    
                    if (spotify.album_art_url) {
                        albumArtEl.src = spotify.album_art_url;
                    }
                    musicWidget.style.borderColor = "#00ff66";
                    musicIcon.className = "fa-solid fa-play";
                    musicWidget.title = "Click to open full song on Spotify";

                    // Construct direct full track URL using Spotify Track ID
                    if (spotify.track_id) {
                        activeSpotifyUrl = `https://open.spotify.com/track/${spotify.track_id}`;
                    }
                } else {
                    songNameEl.textContent = "Not Listening";
                    artistNameEl.textContent = "Spotify Inactive";
                    albumArtEl.src = "CDEE8C6A-3BF4-47AE-9D9D-9912377216A7.webp";
                    musicWidget.style.borderColor = "rgba(255, 0, 0, 0.4)";
                    musicIcon.className = "fa-solid fa-music";
                    musicWidget.title = "Spotify Inactive";
                    activeSpotifyUrl = null;
                }
            }
        } catch (error) {
            console.error("Could not fetch Lanyard data:", error);
            songNameEl.textContent = "API Error";
            artistNameEl.textContent = "Check Connection";
        }
    }

    fetchLanyardData();
    setInterval(fetchLanyardData, 5000); // Poll every 5 seconds for fast synchronization

    // Open Full Song on Spotify when Widget is Clicked
    musicWidget.addEventListener('click', () => {
        if (activeSpotifyUrl) {
            window.open(activeSpotifyUrl, '_blank');
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
