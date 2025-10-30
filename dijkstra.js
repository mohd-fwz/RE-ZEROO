// Dijkstra's Algorithm Implementation with Step Tracking

function dijkstra(graph, start, goal) {
    const dist = new Map();
    const parent = new Map();
    const visited = new Set();
    const steps = [];
    
    // Priority queue: [distance, node]
    const pq = [[0, start]];
    dist.set(start, 0);
    
    steps.push({
        type: 'start',
        message: `Starting from "${start}" with 0 deaths`,
        currentNode: start,
        distances: new Map(dist),
        queue: [...pq],
        visited: new Set()
    });
    
    while (pq.length > 0) {
        // Sort to get minimum
        pq.sort((a, b) => a[0] - b[0]);
        const [currentDist, currentNode] = pq.shift();
        
        if (visited.has(currentNode)) continue;
        visited.add(currentNode);
        
        steps.push({
            type: 'visit',
            message: `Visiting "${currentNode}" (deaths: ${currentDist})`,
            currentNode,
            distances: new Map(dist),
            visited: new Set(visited),
            queue: [...pq]
        });
        
        if (currentNode === goal) {
            steps.push({
                type: 'goal',
                message: `✓ Goal "${goal}" reached with ${currentDist} deaths!`,
                currentNode: goal,
                distances: new Map(dist),
                visited: new Set(visited)
            });
            break;
        }
        
        if (graph.has(currentNode)) {
            for (const { to, deaths } of graph.get(currentNode)) {
                const newDist = currentDist + deaths;
                
                if (!dist.has(to) || newDist < dist.get(to)) {
                    dist.set(to, newDist);
                    parent.set(to, currentNode);
                    pq.push([newDist, to]);
                    
                    steps.push({
                        type: 'update',
                        message: `Updated "${to}": ${newDist} deaths (via "${currentNode}", +${deaths})`,
                        currentNode,
                        updatedNode: to,
                        distances: new Map(dist),
                        visited: new Set(visited),
                        queue: [...pq]
                    });
                }
            }
        }
    }
    
    // Reconstruct path
    const path = [];
    if (dist.has(goal)) {
        let current = goal;
        while (current) {
            path.unshift(current);
            current = parent.get(current);
        }
    }
    
    return {
        minDeaths: dist.get(goal) ?? -1,
        path,
        steps,
        allDistances: dist
    };
}

function parseInput(inputText) {
    const lines = inputText.trim().split('\n');
    const [N, M] = lines[0].split(' ').map(Number);
    
    const graph = new Map();
    const nodes = new Set();
    const edges = [];
    
    for (let i = 1; i <= M; i++) {
        const parts = lines[i].trim().split(' ');
        const from = parts[0];
        const to = parts[1];
        const deaths = parseInt(parts[2]);
        
        nodes.add(from);
        nodes.add(to);
        edges.push({ from, to, deaths });
        
        if (!graph.has(from)) {
            graph.set(from, []);
        }
        graph.get(from).push({ to, deaths });
    }
    
    const [start, goal] = lines[M + 1].trim().split(' ');
    
    return { 
        graph, 
        start, 
        goal, 
        nodes: Array.from(nodes),
        edges 
    };
}