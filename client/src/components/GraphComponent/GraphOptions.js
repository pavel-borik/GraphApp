/**
 * Options object which is used by Vis.js library.
 * All the options are available at http://visjs.org/docs/network/#options.
 */
const options = {
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
    }
  },
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 0.6 }
    },
    color: {
      color: '#848484',
      opacity: 0.6,
      highlight: '#000000'
    },
    font: {
      align: 'bottom'
    },
    arrowStrikethrough: false,
    width: 1.5
  },
  groups: {},
  layout: {
    improvedLayout: false,
    randomSeed: 2
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
      springConstant: 0.006,
      springLength: 150,
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
    adaptiveTimestep: true
  }
};
export default options;
