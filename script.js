document.addEventListener('DOMContentLoaded', () => {
    // Hide Loading Screen on window load
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
        }, 400);
    }

    // Modal Handlers (Updates & FAQ)
    setupModal('update-modal', 'open-updates', 'close-updates');
    setupModal('faq-modal', 'open-faq', 'close-faq');

    function setupModal(modalId, openId, closeId) {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openId);
        const closeBtn = document.getElementById(closeId);

        if (openBtn && modal && closeBtn) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });

            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    }

    // Handle Link Redirects cleanly
    const tabButtons = document.querySelectorAll('.tabs-container .tab-btn');
    tabButtons.forEach((btn) => {
        if (btn.id === 'open-faq') return; // Skip FAQ button trigger
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.getAttribute('data-link');
            let destination = '';

            if (type === 'lib') {
                destination = 'https://github.com/Tvman4/TvMenuLib/releases#release-TvMenuV2';
            } else {
                destination = 'https://discord.gg/g7CW8USwn';
            }

            window.open(destination, '_blank');
        });
    });

    // Simulated Live Online Visitors Tracker
    const liveUsersEl = document.getElementById('live-users');
    if (liveUsersEl) {
        let currentUsers = Math.floor(Math.random() * 3) + 1;
        liveUsersEl.innerText = currentUsers;
        setInterval(() => {
            const change = Math.random() > 0.5 ? 1 : -1;
            currentUsers = Math.max(1, currentUsers + change);
            liveUsersEl.innerText = currentUsers;
        }, 10000);
    }

    // Track GitHub Actions for Tvman4/Tvman-Hub
    async function checkRepoActions() {
        const hubStatusElement = document.getElementById('hub-status');
        if (!hubStatusElement) return;

        try {
            const response = await fetch('https://api.github.com/repos/Tvman4/Tvman-Hub/actions/runs?per_page=1');
            if (response.ok) {
                const data = await response.json();
                const runs = data.workflow_runs;
                if (runs && runs.length > 0) {
                    const latestRun = runs[0];
                    if (latestRun.status === 'in_progress' || latestRun.status === 'queued') {
                        hubStatusElement.innerText = 'Hub: Updating';
                        hubStatusElement.style.color = '#ff4d4d';
                    } else {
                        hubStatusElement.innerText = 'Hub: Online';
                        hubStatusElement.style.color = '#00ff66';
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch GitHub action status:', error);
            hubStatusElement.innerText = 'Hub: Online';
            hubStatusElement.style.color = '#00ff66';
        }
    }

    checkRepoActions();
    setInterval(checkRepoActions, 30000);

    // Lanyard API Integration for Discord Status & Spotify Tracking
    const LANYARD_API = 'https://api.lanyard.rest/v1/users/1373549788628254821';

    async function fetchLanyardData() {
        try {
            const response = await fetch(LANYARD_API);
            if (!response.ok) return;
            const json = await response.json();
            
            if (json.success && json.data) {
                const data = json.data;
                
                // 1. Update Discord Username and Status Dot (Online/Offline/Idle/DND)
                const discordUsernameEl = document.getElementById('discord-username');
                const statusDotEl = document.getElementById('discord-status-dot');
                const activityTextEl = document.getElementById('discord-activity');

                if (discordUsernameEl && data.discord_user) {
                    discordUsernameEl.innerText = `@${data.discord_user.username}`;
                }

                if (statusDotEl) {
                    statusDotEl.className = `discord-status-dot ${data.discord_status}`;
                }

                // Custom Activity or Game
                if (activityTextEl) {
                    if (data.activities && data.activities.length > 0) {
                        const nonSpotify = data.activities.find(act => act.name !== 'Spotify');
                        if (nonSpotify) {
                            activityTextEl.innerText = nonSpotify.name;
                        } else if (data.discord_status) {
                            activityTextEl.innerText = data.discord_status.toUpperCase();
                        }
                    } else {
                        activityTextEl.innerText = data.discord_status.toUpperCase();
                    }
                }

                // 2. Update Spotify Widget
                const songEl = document.getElementById('spotify-song');
                const artistEl = document.getElementById('spotify-artist');
                const albumArtEl = document.getElementById('spotify-album-art');
                const spotifyWidget = document.getElementById('spotify-widget');

                if (data.spotify && data.spotify.track_id) {
                    songEl.innerText = data.spotify.song;
                    artistEl.innerText = data.spotify.artist;
                    albumArtEl.src = data.spotify.album_art_url;
                    spotifyWidget.style.display = 'flex';
                } else {
                    songEl.innerText = 'Not Listening';
                    artistEl.innerText = 'Spotify Inactive';
                    albumArtEl.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&auto=format&fit=crop';
                }
            }
        } catch (error) {
            console.error('Failed to fetch Lanyard data:', error);
        }
    }

    fetchLanyardData();
    setInterval(fetchLanyardData, 15000);
});
