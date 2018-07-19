export const legendOptions = {
    autoResize:  true,

    nodes: {
        borderWidth: 0,
        shape: 'dot',
        size: 10,
        shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.5)',
            size: 3,
            x: 2,
            y: 2
        },
    },
    
    groups: {
        "L0": { color: { background: 'red',  } },
        "L1": { color: { background: 'green', } },
        "L2": { color: { background: 'blue',  } },
        "L3": { color: { background: '#6b486b',  } },
        "L4": { color: { background: '#a05d56', } },

    },
    layout: {
        improvedLayout: false,
        hierarchical: false
    },
    interaction: {
        hover: false,
        dragNodes: false,
        zoomView: false,
        dragView: false
    },

    physics: {
        enabled: false,
        
    }
};