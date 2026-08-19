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

    // Assign links dynamically via JavaScript based on button index or class/attributes
    const tabButtons = document.querySelectorAll('.tabs-container .tab-btn');
    
    tabButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            let destination = '';
            
            // Map each button index to its specific link destination
            switch(index) {
                case 0: // Modded Apks
                case 1: // Discord Community
                case 3: // TvMenuPCVR
                case 4: // Modded Gtag By Tvman
                    destination = 'https://discord.gg/g7CW8USwn';
                    break;
                case 2: // TvMenu Lib
                    destination = 'https://github.com/Tvman4/TvMenuLib/releases#release-TvMenuV2';
                    break;
                default:
                    destination = 'https://discord.gg/g7CW8USwn';
            }
            
            if (destination) {
                window.open(destination, '_blank');
            }
        });
    });

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
});
