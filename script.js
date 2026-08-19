// Hide Loading Screen on window load
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
    }, 400);
});

// Update Log Modal Pop-up Handlers
const modal = document.getElementById('update-modal');
const openBtn = document.getElementById('open-updates');
const closeBtn = document.getElementById('close-updates');

openBtn.addEventListener('click', () => {
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

// Track GitHub Actions for Tvman4/Tvman-Hub
async function checkRepoActions() {
    const hubStatusElement = document.getElementById('hub-status');
    try {
        const response = await fetch('https://api.github.com/repos/Tvman4/Tvman-Hub/actions/runs?per_page=1');
        if (response.ok) {
            const data = await response.json();
            const runs = data.workflow_runs;
            if (runs && runs.length > 0) {
                const latestRun = runs[0];
                // Check if action status is currently queued or in progress
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
        // Fallback default text if API rate limits or errors occur
        hubStatusElement.innerText = 'Hub: Online';
        hubStatusElement.style.color = '#00ff66';
    }
}

// Initial call and periodic check every 30 seconds
checkRepoActions();
setInterval(checkRepoActions, 30000);
