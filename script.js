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

    // --- 2. Lanyard API Tracking (Discord Presence & Spotify Widget) ---
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

                    const discordStatus = presence.discord_status;
                    if (statusDot) {
                        switch (discordStatus) {
                            case 'online':
                                statusDot.style.backgroundColor = '#23a55a';
                                break;
                            case 'idle':
                                statusDot.style.backgroundColor = '#f0b232';
                                break;
                            case 'dnd':
                                statusDot.style.backgroundColor = '#f23f43';
                                break;
                            default:
                                statusDot.style.backgroundColor = '#80848e';
                                break;
                        }
                    }

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

    // --- 3. Discord Profile Redirect ---
    const discordProfileLink = document.getElementById('discord-profile-link');
    if (discordProfileLink) {
        const openProfile = () => {
            window.open('https://discord.com/users/1373549788628254821', '_blank');
        };
        discordProfileLink.addEventListener('click', openProfile);
        discordProfileLink.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProfile();
            }
        });
    }

    // --- 4. Language Selector Translation Wiring ---
    const languageSelect = document.getElementById('language-select');
    const rtlLangs = ['ar', 'he', 'fa', 'ur'];

    function applyLanguage(lang) {
        if (typeof changeLanguage === 'function') {
            changeLanguage(lang);
        }
        document.documentElement.lang = lang;
        document.documentElement.dir = rtlLangs.includes(lang) ? 'rtl' : 'ltr';
        try { localStorage.setItem('tvman-lang', lang); } catch (e) {}
    }

    if (languageSelect && typeof changeLanguage === 'function') {
        let saved = 'en';
        try { saved = localStorage.getItem('tvman-lang') || 'en'; } catch (e) {}
        if (languageSelect.querySelector(`option[value="${saved}"]`)) {
            languageSelect.value = saved;
            applyLanguage(saved);
        }
        languageSelect.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    }

    // --- 5. Modal Popups (FAQ, Credits, Updates) ---
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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach((m) => m.classList.remove('active'));
        }
    });

    // --- 6. Link Routing (Discord & MediaFire Lib Flow) ---
    const discordInviteUrl = "https://discord.gg/chG2a3uyRY";
    const mediafireLibUrl = "https://www.mediafire.com/file/s55mh4kz8zybxl1/libTvMenu.so/file";

    document.querySelectorAll('[data-link="discord"]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(discordInviteUrl, '_blank');
        });
    });

    document.querySelectorAll('[data-link="lib"]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(mediafireLibUrl, '_blank');
            const libModal = document.getElementById('lib-modal');
            if (libModal) {
                libModal.classList.add('active');
            }
        });
    });

    const closeLibModalBtn = document.getElementById('close-lib-modal');
    const libModal = document.getElementById('lib-modal');
    const libDiscordBtn = document.getElementById('lib-discord-btn');

    if (closeLibModalBtn && libModal) {
        closeLibModalBtn.addEventListener('click', () => {
            libModal.classList.remove('active');
        });
        libModal.addEventListener('click', (e) => {
            if (e.target === libModal) {
                libModal.classList.remove('active');
            }
        });
    }

    if (libDiscordBtn) {
        libDiscordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(discordInviteUrl, '_blank');
        });
    }

    // Soft live-user display (local session only)
    const liveUsers = document.getElementById('live-users');
    if (liveUsers) {
        const n = 2 + Math.floor(Math.random() * 7);
        liveUsers.textContent = String(n);
    }
});
