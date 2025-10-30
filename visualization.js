// Visualization Functions

class GraphVisualizer {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.currentStep = 0;
        this.steps = [];
        this.playing = false;
        this.playInterval = null;
    }

    setData(graphData, result) {
        this.nodes = graphData.nodes;
        this.edges = graphData.edges;
        this.steps = result.steps;
        this.currentStep = 0;
        this.result = result;
    }

    renderGraph(stepData) {
        const container = document.getElementById('graph-viz');
        container.innerHTML = '';
        
        if (!this.nodes.length) {
            container.innerHTML = '<p style="text-align: center; color: #b0b0b0; padding: 50px;">Run the algorithm first</p>';
            return;
        }

        // Force a reflow to ensure container has dimensions
        container.offsetHeight;
        
        // Get container dimensions - use clientWidth/clientHeight for accurate size
        const containerWidth = container.clientWidth || 600;
        const containerHeight = container.clientHeight || 500;
        
        console.log('Container dimensions:', containerWidth, containerHeight); // Debug
        
        // Calculate safe area for nodes
        const padding = 80;
        const usableWidth = containerWidth - (padding * 2);
        const usableHeight = containerHeight - (padding * 2);
        
        // Calculate radius to fit nodes
        const radius = Math.min(usableWidth, usableHeight) / 2;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        console.log('Center:', centerX, centerY, 'Radius:', radius); // Debug
        
        this.nodes.forEach((node, index) => {
            // Calculate angle for circular layout
            const angle = (index / this.nodes.length) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            console.log(`Node ${node}:`, x, y); // Debug
            
            const nodeEl = document.createElement('div');
            nodeEl.className = 'node';
            nodeEl.textContent = node;
            
            // Use absolute positioning
            nodeEl.style.position = 'absolute';
            nodeEl.style.left = `${x}px`;
            nodeEl.style.top = `${y}px`;
            nodeEl.style.transform = 'translate(-50%, -50%)';
            
            // Highlight based on step
            if (stepData) {
                if (stepData.currentNode === node) {
                    nodeEl.classList.add('current');
                } else if (stepData.visited && stepData.visited.has(node)) {
                    nodeEl.classList.add('visited');
                }
                
                if (this.result && this.result.path.includes(node) && stepData.type === 'goal') {
                    nodeEl.classList.add('goal');
                }
            }
            
            container.appendChild(nodeEl);
        });
    }

    renderDistances(stepData) {
        const container = document.getElementById('distances-table');
        container.innerHTML = '';
        
        if (!stepData || !stepData.distances) {
            container.innerHTML = '<p style="color: #b0b0b0; text-align: center;">No data</p>';
            return;
        }
        
        stepData.distances.forEach((dist, node) => {
            const row = document.createElement('div');
            row.className = 'data-row';
            
            if (stepData.currentNode === node || stepData.updatedNode === node) {
                row.classList.add('highlight');
            }
            
            row.innerHTML = `
                <span>${node}</span>
                <span>${dist === Infinity ? '∞' : dist}</span>
            `;
            container.appendChild(row);
        });
    }

    renderQueue(stepData) {
        const container = document.getElementById('queue-table');
        container.innerHTML = '';
        
        if (!stepData || !stepData.queue || stepData.queue.length === 0) {
            container.innerHTML = '<p style="color: #b0b0b0; text-align: center;">Empty</p>';
            return;
        }
        
        stepData.queue.forEach(([dist, node]) => {
            const row = document.createElement('div');
            row.className = 'data-row';
            row.innerHTML = `
                <span>${node}</span>
                <span>${dist}</span>
            `;
            container.appendChild(row);
        });
    }

    renderVisited(stepData) {
        const container = document.getElementById('visited-list');
        container.innerHTML = '';
        
        if (!stepData || !stepData.visited || stepData.visited.size === 0) {
            container.innerHTML = '<p style="color: #b0b0b0; text-align: center;">None</p>';
            return;
        }
        
        stepData.visited.forEach(node => {
            const span = document.createElement('span');
            span.className = 'visited-node';
            span.textContent = node;
            container.appendChild(span);
        });
    }

    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;
        
        this.currentStep = stepIndex;
        const stepData = this.steps[stepIndex];
        
        // Update step info
        document.getElementById('current-step').textContent = stepIndex + 1;
        document.getElementById('total-steps').textContent = this.steps.length;
        document.getElementById('step-message').textContent = stepData.message;
        
        // Small delay to ensure container is properly sized
        setTimeout(() => {
            this.renderGraph(stepData);
            this.renderDistances(stepData);
            this.renderQueue(stepData);
            this.renderVisited(stepData);
        }, 50);
    }

    play() {
        if (this.playing) return;
        this.playing = true;
        
        this.playInterval = setInterval(() => {
            if (this.currentStep < this.steps.length - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                this.pause();
            }
        }, 1500);
    }

    pause() {
        this.playing = false;
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }

    reset() {
        this.pause();
        this.showStep(0);
    }

    nextStep() {
        this.pause();
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }

    prevStep() {
        this.pause();
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
}