// Main Application Logic

let visualizer = new GraphVisualizer();
let currentResult = null;
let currentGraphData = null;

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab pane
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// Run Algorithm
document.getElementById('run-btn').addEventListener('click', () => {
    const input = document.getElementById('graph-input').value;
    
    try {
        // Parse input
        const graphData = parseInput(input);
        currentGraphData = graphData;
        
        // Run Dijkstra's algorithm
        const result = dijkstra(graphData.graph, graphData.start, graphData.goal);
        currentResult = result;
        
        // Display result
        document.getElementById('result-summary').style.display = 'block';
        document.getElementById('min-deaths').textContent = result.minDeaths;
        document.getElementById('optimal-path').textContent = result.path.join(' → ');
        
        // Setup visualizer
        visualizer.setData(graphData, result);
        visualizer.showStep(0);
        
        // Switch to visualization tab
        document.querySelector('[data-tab="visualization"]').click();
        
    } catch (error) {
        alert('Invalid input format! Please check your input.\n\n' + error.message);
        console.error(error);
    }
});

// Visualization Controls
document.getElementById('prev-step').addEventListener('click', () => {
    visualizer.prevStep();
});

document.getElementById('next-step').addEventListener('click', () => {
    visualizer.nextStep();
});

document.getElementById('play-pause').addEventListener('click', (e) => {
    if (visualizer.playing) {
        visualizer.pause();
        e.target.innerHTML = '▶ Play';
    } else {
        visualizer.play();
        e.target.innerHTML = '⏸ Pause';
    }
});

document.getElementById('reset-viz').addEventListener('click', () => {
    visualizer.reset();
    document.getElementById('play-pause').innerHTML = '▶ Play';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Re:Zero Algorithm Visualizer loaded!');
});

// Handle window resize
window.addEventListener('resize', () => {
    if (currentResult && currentGraphData) {
        visualizer.showStep(visualizer.currentStep);
    }
});