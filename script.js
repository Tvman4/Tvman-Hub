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

    // --- 2. Lanyard Tracking (Spotify, Online Status, Activity) ---
    const DISCORD_USER_ID = '1373549788628254821'; 

    // DOM Elements
    const songNameEl = document.querySelector('.song-name');
    const artistNameEl = document.querySelector('.artist-name');
    const albumArtEl = document.querySelector('.music-thumb');
    const musicWidget = document.querySelector('.music-widget');
    const statusDot = document.querySelector('.discord-status-dot');
    const pillBadgeText = document.querySelector('.pill-badge span'); // Assumes text next to the dot is in a span

    function updateLanyardData() {
        fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data) {
                    const presence = data.data;

                    // --- A. Online / Offline Status Tracking ---
                    const discordStatus = presence.discord_status; // 'online', 'idle', 'dnd', 'offline'
                    
                    if (statusDot) {
                        // Remove previous status color classes if any
                        statusDot.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');
                        
                        // Set color based on status
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
                                statusDot.style.backgroundColor = '#80848e'; // Grey / Offline
                                break;
                        }
                    }

                    // --- B. Spotify Tracking ---
                    if (presence.spotify && presence.listening_to_spotify) {
                        const spotify = presence.spotify;
                        
                        if (songNameEl) songNameEl.textContent = spotify.song || 'Unknown Track';
                        if (artistNameEl) artistNameEl.textContent = spotify.artist || 'Unknown Artist';
                        
                        if (albumArtEl && spotify.album_art_url) {
                            albumArtEl.src = spotify.album_art_url;
                        }

                        if (musicWidget) musicWidget.style.display = 'flex';
                    } else {
                        // Hide widget or show fallback if not listening to music
                        if (songNameEl) songNameEl.textContent = 'Not playing music';
                        if (artistNameEl) artistNameEl.textContent = 'Spotify';
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching Lanyard data:', error);
            });
    }

    // Initial fetch and poll every 10 seconds to keep live status updated
    updateLanyardData();
    setInterval(updateLanyardData, 10000);

    // --- 3. Modal Open/Close Logic ---
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeModalBtns = document.querySelectorAll('.close-btn, .modal-overlay');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target === btn || btn.classList.contains('close-btn')) {
                const modal = btn.closest('.modal-overlay');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
        });
    });
});
