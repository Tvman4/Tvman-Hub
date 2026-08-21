document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Loading Screen Handler ---
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 600);
    }

    // --- 2. Lanyard API Tracking (Discord Status, Activities & Spotify) ---
    const DISCORD_USER_ID = '1373549788628254821'; 

    const songNameEl = document.querySelector('.song-name');
    const artistNameEl = document.querySelector('.artist-name');
    const albumArtEl = document.querySelector('.music-thumb');
    const musicWidget = document.querySelector('.music-widget');
    const statusDot = document.getElementById('discord-status-dot');

    function updateLanyardData() {
        fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data) {
                    const presence = data.data;

                    // --- A. Discord Online / Offline Status Dot Color ---
                    const discordStatus = presence.discord_status; // 'online', 'idle', 'dnd', 'offline'
                    if (statusDot) {
                        switch (discordStatus) {
                            case 'online':
                                statusDot.style.backgroundColor = '#23a55a'; // Green
                                break;
                            case 'idle':
                                statusDot.style.backgroundColor = '#f0b232'; // Yellow
                                break;
                            case 'dnd':
                                statusDot.style.backgroundColor = '#f23f43'; // Red
                                break;
                            default:
                                statusDot.style.backgroundColor = '#80848e'; // Grey (Offline)
                                break;
                        }
                    }

                    // --- B. Custom Discord Status / Activity Tracking ---
                    // You can display custom activities/status text if needed:
                    // const activities = presence.activities;
                    // const customStatus = activities.find(act => act.type === 4); // Custom status type

                    // --- C. Spotify Tracking Widget ---
                    if (presence.spotify && presence.listening_to_spotify) {
                        const spotify = presence.spotify;
                        
                        if (songNameEl) songNameEl.textContent = spotify.song;
                        if (artistNameEl) artistNameEl.textContent = spotify.artist;
                        if (albumArtEl && spotify.album_art_url) {
                            albumArtEl.src = spotify.album_art_url;
                        }
                        if (musicWidget) musicWidget.style.display = 'flex';
                    } else {
                        if (musicWidget) musicWidget.style.display = 'none';
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching Lanyard data:', error);
            });
    }

    updateLanyardData();
    setInterval(updateLanyardData, 10000);

    // --- 3. Language Selector Fix (Hooking up translate.js engine) ---
    const languageSelect = document.getElementById('language-select');
    if (languageSelect && typeof changeLanguage === 'function') {
        languageSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }

    // --- 4. Modal Popup System Handlers ---
    const setupModal = (triggerId, modalId, closeId) => {
        const trigger = document.getElementById(triggerId);
        const modal = document.getElementById(modalId);
        const closeBtn = document.getElementById(closeId);

        if (trigger && modal && closeBtn) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });

            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    };

    setupModal('open-faq', 'faq-modal', 'close-faq');
    setupModal('open-credits', 'credits-modal', 'close-credits');
    setupModal('open-updates', 'update-modal', 'close-updates');

    // --- 5. Dynamic Link Redirect Routing ---
    const discordInviteUrl = "https://discord.gg/yourdiscordinvite"; 

    document.querySelectorAll('[data-link="discord"], [data-link="lib"]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(discordInviteUrl, '_blank');
        });
    });
});
