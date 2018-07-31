export const options = {
    autoResize: true,
    nodes: {
        color: {
            border: 'white',
            highlight: {
                border: 'white'
            }
        },
        borderWidth: 1,
        borderWidthSelected: 5,
        shape: 'dot',
        size: 20,
        shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.5)',
            size: 10,
            x: 5,
            y: 5
        },
    },
    edges: {
        arrows: {
            to: { enabled: true, scaleFactor: 0.6 },
        },
        color: {
            color: '#848484',
            opacity: 0.6,
            highlight: '#000000'
        },
        arrowStrikethrough: false,
        width: 1.5,
    },
    groups: {
        // "0": {
        //     color: {
        //         background: 'red',
        //         highlight: {
        //             background: '#ffbcbc'
        //         }
        //     }
        // },
        // "1": { color: { background: 'green', highlight: { background: '#ffbcbc' } } },
        // "2": { color: { background: 'blue', highlight: { background: '#ffbcbc' } } },
        // "3": { color: { background: '#6b486b', highlight: { background: '#ffbcbc' } } },
        // "4": { color: { background: '#a05d56', highlight: { background: '#ffbcbc' } } },
    },
    layout: {
        improvedLayout: true,
        hierarchical: false
    },
    interaction: {
        hover: false,
        dragNodes: true,
        zoomView: true,
        dragView: true
    },
    physics: {
        enabled: true,
        forceAtlas2Based: {
            gravitationalConstant: -200,
            centralGravity: 0.03,
            springConstant: 0.004,
            springLength: 30,
            damping: 0.9,
            avoidOverlap: 0
        },
        solver: 'forceAtlas2Based',
        stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false,
            fit: true
        },
        maxVelocity: 20,
        timestep: 0.3,
        adaptiveTimestep: true,
    }
}