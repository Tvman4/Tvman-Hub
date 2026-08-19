document.addEventListener('DOMContentLoaded', () => {
    // Hide Loading Screen on window load
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
        }, 400);
    }

    // Update Log Modal Pop-up Handlers
    const modal = document.getElementById('update-modal');
    const openBtn = document.getElementById('open-updates');
    const closeBtn = document.getElementById('close-updates');

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

    // Handle Link Redirects cleanly through script.js
    const tabButtons = document.querySelectorAll('.tabs-container .tab-btn');
    tabButtons.forEach((btn) => {
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

    // Simulated Live Online Users Tracker (Increments/decrements realistically)
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

    // Spotify Widget Integration (Lanyard / Public API tracker placeholder)
    async function updateSpotifyStatus() {
        const songEl = document.getElementById('spotify-song');
        const artistEl = document.getElementById('spotify-artist');
        const albumArtEl = document.getElementById('spotify-album-art');
        
        // If you use Lanyard for Discord/Spotify, replace DISCORD_USER_ID with your numeric Discord ID
        // For now, it defaults gracefully to inactive state if not configured
    }
    updateSpotifyStatus();
});
