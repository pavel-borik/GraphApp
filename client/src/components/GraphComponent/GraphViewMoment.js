import React, { Component, Fragment } from 'react';
import moment from 'moment';
import isEqual from 'underscore';
import uuid from 'uuid';
import VisNetwork from './VisNetwork';
import CustomButton from '../GuiElements/CustomButton';
import options from './GraphOptions';
import './GraphComponent.css';

/**
 * Moment view
 * Viewing relationships in a certain date/time moment
 */
class GraphViewMoment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      edges: []
    };
    const nodes = [];
    const network = null;
    const legendNetwork = null;
    const nodeDataset = null;
    const edgeDataset = null;
    const clusterOperations = null;
  }

  componentDidMount() {
    this.clusterOperations = [];
    const displayedEdges = this.props.data.graph.edges.filter(edge => {
      delete edge.color;
      return this.props.selectedDate.isBetween(
        moment(edge.validityStart),
        edge.validityEnd !== 'unlimited' ? moment(edge.validityEnd) : moment('2100-01-01'),
        'h',
        '[)'
      );
    });
    const displayedNodes = this.props.data.graph.nodes.filter(node => {
      const edgeCount = displayedEdges.filter(edge => {
        return edge.from === node.id || edge.to === node.id;
      });
      return edgeCount.length > 0;
    });
    this.network.setData({ nodes: displayedNodes, edges: displayedEdges });
    this.nodeDataset = this.network.body.data.nodes;
    this.edgeDataset = this.network.body.data.edges;
    this.createTopLevelClusters();

    //this.setState({ nodes: displayedNodes, edges: displayedEdges }, () => {});
    this.nodes = displayedNodes;
  }

  componentDidUpdate(prevProps) {
    if (isEqual(this.props.data.graph, prevProps.data.graph)) {
      if (!prevProps.selectedDate.isSame(this.props.selectedDate)) {
        const displayedEdges = this.props.data.graph.edges.filter(edge => {
          return this.props.selectedDate.isBetween(
            moment(edge.validityStart),
            edge.validityEnd !== 'unlimited' ? moment(edge.validityEnd) : moment('2100-01-01'),
            'h',
            '[)'
          );
        });
        const displayedNodes = this.props.data.graph.nodes.filter(node => {
          const edgeCount = displayedEdges.filter(edge => {
            return edge.from === node.id || edge.to === node.id;
          });
          return edgeCount.length > 0;
        });

        if (displayedNodes.length === this.nodes.length) {
          if (isEqual(displayedNodes, this.nodes)) {
            this.network.setData({ nodes: displayedNodes, edges: displayedEdges });
            this.nodeDataset = this.network.body.data.nodes;
            this.edgeDataset = this.network.body.data.edges;
            this.clusterOperations.length > 0
              ? this.recreatePreviousClustering()
              : this.createTopLevelClusters();

            //this.setState({ nodes: displayedNodes, edges: displayedEdges }, () => {
            // this.network.unselectAll();
            // this.openAllClusters();
            // this.clusterByGroup();
            //});
            this.nodes = displayedNodes;
          }
        } else {
          this.network.setData({ nodes: displayedNodes, edges: displayedEdges });
          this.nodeDataset = this.network.body.data.nodes;
          this.edgeDataset = this.network.body.data.edges;
          this.clusterOperations.length > 0
            ? this.recreatePreviousClustering()
            : this.createTopLevelClusters();

          // this.setState({ nodes: displayedNodes, edges: displayedEdges }, () => {
          // this.network.unselectAll();
          // this.openAllClusters();
          // this.clusterByGroup()
          // });
          this.nodes = displayedNodes;
        }
      }
    } else {
      const displayedEdges = this.props.data.graph.edges.filter(edge => {
        return this.props.selectedDate.isBetween(
          moment(edge.validityStart),
          edge.validityEnd !== 'unlimited' ? moment(edge.validityEnd) : moment('2100-01-01'),
          'h',
          '[)'
        );
      });
      const displayedNodes = this.props.data.graph.nodes.filter(node => {
        const edgeCount = displayedEdges.filter(edge => {
          return edge.from === node.id || edge.to === node.id;
        });
        return edgeCount.length > 0;
      });
      this.clusterOperations = [];
      Object.assign(options.groups, this.props.data.config.groups);
      this.network.setOptions(options);
      this.network.setData({ nodes: displayedNodes, edges: displayedEdges });
      this.nodeDataset = this.network.body.data.nodes;
      this.edgeDataset = this.network.body.data.edges;
      this.createTopLevelClusters();
      this.legendNetwork.redraw();

      // this.setState({ nodes: displayedNodes, edges: displayedEdges }, () => {
      // Object.assign(options.groups, this.props.data.config.groups);
      // this.network.setOptions(options);
      // this.network.unselectAll();
      // this.createTopLevelClusters();
      // this.legendNetwork.redraw();
      // });
      this.nodes = displayedNodes;
    }
  }

  /**
   * Gets the reference of the Network object from Vis.js library.
   */
  initNetworkInstance = networkInstance => {
    this.network = networkInstance;
  };

  /**
   * Gets the reference of the Network object from Vis.js library.
   * Defines the beforeDrawing event where the legend is created.
   */
  initLegendNetworkInstance = networkInstance => {
    networkInstance.on('beforeDrawing', ctx => {
      ctx.save();
      const baseX = 50;
      let baseY = 80;

      Object.values(this.props.data.config.groups).forEach(group => {
        if (Object.prototype.hasOwnProperty.call(group, 'parent')) return;
        const coords = this.legendNetwork.DOMtoCanvas({ x: baseX, y: baseY });

        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 10, 0, 2 * Math.PI, false);
        ctx.shadowColor = '#999';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = group.color.background;
        ctx.fill();

        ctx.restore();
        ctx.fillStyle = '#000000';
        ctx.font = 'normal 10pt Calibri';
        ctx.fillText(group.name, coords.x + 20, coords.y + 5);
        ctx.save();

        baseY += 40;
      });
    });

    this.legendNetwork = networkInstance;
  };

  /**
   * Gets the reference of the Dataset object from Vis.js library.
   */
  initNodeDatasetInstance = nodeDatasetInstance => {
    this.nodeDataset = nodeDatasetInstance;
  };

  /**
   * Gets the reference of the Dataset object from Vis.js library.
   */
  initEdgeDatasetInstance = edgeDatasetInstance => {
    this.edgeDataset = edgeDatasetInstance;
  };

  /**
   * Iterates over all clusters and opens them.
   */
  openAllClusters = () => {
    Object.keys(this.network.clustering.body.nodes).forEach(node => {
      if (this.network.isCluster(node) === true) {
        this.network.openCluster(node);
      }
    });
  };

  /**
   * Shows the edge label when the edge is selected.
   */
  selectEdge = event => {
    const { edges } = event;
    if (edges.length === 1) {
      const selectedEdge = this.edgeDataset.get(edges[0]);
      if (selectedEdge != null) {
        this.edgeDataset.update({ id: edges[0], label: selectedEdge.hiddenLabel });
      }
    }
  };

  /**
   * Hides the edge label when the edge is deselected.
   */
  deselectEdge = event => {
    const { edges } = event.previousSelection;
    if (edges.length === 1) {
      const selectedEdge = this.edgeDataset.get(edges[0]);
      if (selectedEdge != null) {
        this.edgeDataset.update({ id: edges[0], label: '' });
      }
    }
  };

  /**
   * Defines an action upon clicking on the node.
   * If a cluster node is selected, the cluster is opened.
   * If a normal node is selected, the info card gets updated.
   */
  selectNode = event => {
    const { nodes } = event;
    const clickedNode = nodes[0];
    if (this.network.isCluster(clickedNode) === true) {
      const clusterNodeInfo = this.network.clustering.body.nodes[clickedNode];
      console.log(clusterNodeInfo);
      this.logClusterOperation(
        clusterNodeInfo.options.group,
        clusterNodeInfo.options.clusterGroupId
      );
      this.network.openCluster(clickedNode);
      this.createSubclustersByGroupId(
        clusterNodeInfo.options.group,
        clusterNodeInfo.options.clusterGroupId
      );
    } else {
      const selectedNode = this.props.data.graph.nodes.find(node => {
        return node.id === clickedNode;
      });
      if (selectedNode !== undefined) this.props.getSelectedNode(selectedNode);
    }
  };

  click = event => {};

  /**
   * Resizes and repositions the graph to fit the screen.
   */
  fitToScreen = () => {
    this.network.fit({ animation: { duration: 1000, easingFunction: 'easeOutQuart' } });
  };

  /**
   * Creates subclusters according to the definition in the API response.
   * Iterates over all cluster definitions and looks for children of the selected cluster node.
   * @param styleGroupId - String - reference to the key in Groups definition in the API response, used for node styling (colors).
   * Obtained from the selected cluster node.
   * @param clusterGroupId - String - reference to the key in clustering definition in the API response, used for searching for children.
   * Obtained from the selected cluster node.
   */
  createSubclustersByGroupId = (styleGroupId, clusterGroupId) => {
    Object.entries(this.props.data.config.clustering).forEach(clusterDescription => {
      if (Object.prototype.hasOwnProperty.call(clusterDescription[1], 'parent')) {
        if (clusterDescription[1].parent === clusterGroupId)
          this.clusterByGroupId(styleGroupId, clusterDescription[0]);
      }
    });
  };

  /**
   * Recreates top level clustering according to the definition in the API response.
   * Note: top level cluster definitions have no "parent" key.
   */
  createTopLevelClusters = () => {
    this.openAllClusters();
    Object.entries(this.props.data.config.clustering).forEach(clusterDescription => {
      if (!Object.prototype.hasOwnProperty.call(clusterDescription[1], 'parent'))
        this.clusterByGroupId(clusterDescription[0], clusterDescription[0]);
    });
  };

  /**
   * Recreates top level clustering according to the definition in the API response.
   * Resets the stack which tracks clustering operations.
   */
  createTopLevelClustersAndReset = () => {
    this.clusterOperations = [];
    this.createTopLevelClusters();
  };

  /**
   * Pushes the information about the opened cluster onto the stack.
   * This information is used for reverting of subcluster creation.
   */
  logClusterOperation = (styleGroupId, clusterGroupId) => {
    this.clusterOperations.push({ styleGroupId, clusterGroupId });
  };

  /**
   * Undoes last operation of subclusters' creation.
   */
  revertClusterOperation = () => {
    if (this.clusterOperations.length > 0) {
      let searching = true;
      /*  Opened clusters in the past may have been filtered. 
                Need to loop until a revertable operation with nodes that are being displayed right now is found
                Without this clicking on REVERT button would cause no action - it would try to revert subclusters, the nodes of which are not being displayed right now.
            */
      while (searching) {
        if (this.clusterOperations.length === 0) break;

        // Find all possible (distinct) subcluster assignments of current nodes
        const revertableClusters = new Set();
        this.nodes.forEach(node => {
          node.clustering.forEach(c => {
            revertableClusters.add(c);
          });
        });

        // If the last logged operation doesn't affect displayed nodes, keep searching
        const lastClusterOperation = this.clusterOperations.pop();
        if (revertableClusters.has(lastClusterOperation.clusterGroupId)) {
          searching = false;
        } else {
          continue;
        }

        const childClustersIds = [];
        Object.entries(this.props.data.config.clustering).forEach(clusterDescription => {
          if (Object.prototype.hasOwnProperty.call(clusterDescription[1], 'parent')) {
            if (clusterDescription[1].parent === lastClusterOperation.clusterGroupId) {
              childClustersIds.push(clusterDescription[0]);
            }
          }
        });

        // Opening current subclusters to be able to cluster basic nodes back
        Object.values(this.network.clustering.body.nodes).forEach(node => {
          if (
            this.network.isCluster(node.id) === true &&
            childClustersIds.includes(node.options.clusterGroupId)
          ) {
            this.network.openCluster(node.id);
          }
        });

        // Create a one-level-above cluster of free nodes
        this.clusterByGroupId(
          lastClusterOperation.styleGroupId,
          lastClusterOperation.clusterGroupId
        );
        searching = false;
      }
    }
  };

  /**
   * Used for keeping the previously opened clusters in this opened state when the new date/time is selected and there is a change in the displayed dataset.
   */
  recreatePreviousClustering = () => {
    // Create default top level clustering
    this.createTopLevelClusters();

    if (this.clusterOperations.length > 0) {
      // Recreate previous situation from logged (sub)cluster operations data
      this.clusterOperations.forEach(clusterOp => {
        Object.values(this.network.clustering.body.nodes).forEach(node => {
          if (
            this.network.isCluster(node.id) === true &&
            clusterOp.clusterGroupId === node.options.clusterGroupId
          ) {
            this.network.openCluster(node.id);
          }
        });
        this.createSubclustersByGroupId(clusterOp.styleGroupId, clusterOp.clusterGroupId);
      });
    }
  };

  findParent = clusterGroupId => {
    const { parent } = this.props.data.config.clustering[clusterGroupId];
    if (parent === undefined) return clusterGroupId;
    return this.findParent(parent);
  };

  /**
   * Creates a cluster of all the nodes which belong to the cluster group passed in the parameter.
   * Takes care of the label and styling settings of the created cluster node.
   * @param styleGroupId - String - reference to the key in Groups definition in the API response, used for node styling (colors).
   * @param clusterGroupId - String - reference to the key in clustering definition in the API response, used for searching for children.
   */
  clusterByGroupId = (styleGroupId, clusterGroupId) => {
    const groupInfo = this.props.data.config.clustering[clusterGroupId];
    const clusterOptionsByData = {
      // Clustering function
      joinCondition: nodeOptions => {
        if (!Object.prototype.hasOwnProperty.call(nodeOptions, 'clustering')) return false;
        return nodeOptions.clustering.includes(clusterGroupId);
      },
      processProperties: (clusterOptions, childNodes, childEdges) => {
        const countPlaceholder = '{count}';
        let label = groupInfo.name;
        if (label.includes(countPlaceholder)) {
          label = label.replace(countPlaceholder, childNodes.length);
        } else {
          label = `Contains: ${childNodes.length.toString()}`;
        }
        clusterOptions.label = label;
        return clusterOptions;
      },
      // Cluster node settings
      clusterNodeProperties: {
        id: uuid.v4(),
        group: styleGroupId,
        clusterGroupId,
        shape: 'circle',
        labelHighlightBold: false,
        font: {
          face: 'georgia',
          color: 'black',
          size: 12,
          align: 'center',
          multi: 'html',
          bold: {
            size: 18,
            vadjust: 2
          }
        }
      },
      // Cluster edges settings
      clusterEdgeProperties: {
        label: '',
        color: '#848484',
        opacity: 0.6
      }
    };
    this.network.cluster(clusterOptionsByData);
  };

  render() {
    Object.assign(options.groups, this.props.data.config.groups);
    // Register events for the Vis component
    const events = {
      selectNode: this.selectNode,
      selectEdge: this.selectEdge,
      deselectEdge: this.deselectEdge,
      click: this.click
    };

    return (
      <Fragment>
        <div style={{ width: '70%', position: 'absolute' }}>
          <VisNetwork
            graph={{ nodes: [], edges: [] }}
            options={{ autoResize: true }}
            style={{ height: '99vh' }}
            getNetwork={this.initLegendNetworkInstance}
          />
        </div>
        <div style={{ width: '70%', position: 'absolute' }}>
          <VisNetwork
            graph={{ nodes: [], edges: [] }}
            options={options}
            events={events}
            style={{ height: '99vh' }}
            getNetwork={this.initNetworkInstance}
            getNodes={this.initNodeDatasetInstance}
            getEdges={this.initEdgeDatasetInstance}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <CustomButton
            onClick={this.revertClusterOperation}
            name="Revert"
            tooltipTitle="Reverts last declustering operation"
          />
          <CustomButton
            onClick={this.createTopLevelClustersAndReset}
            name="Reset clustering"
            tooltipTitle="Resets the clustering to default level"
          />
          <CustomButton
            onClick={this.fitToScreen}
            name="Fit to screen"
            tooltipTitle="Moves and centers the graph so that all nodes fit on the screen"
          />
        </div>
      </Fragment>
    );
  }
}

export default GraphViewMoment;
