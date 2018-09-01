import VisNetwork from './VisNetwork';
import React, { Component } from 'react';
import CustomButton from '../GuiElements/CustomButton'
import { options } from './GraphOptions'
import moment from 'moment';
import uuid from "uuid";
import './GraphComponent.css';

/**
 * View 2
 * Viewing relationships in a certain date/time moment
 */
class GraphComponentView2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            edges: [],
        }
        const network = null;
        const legendNetwork = null;
        const nodeDataset = null;
        const edgeDataset = null;
        const clusterOperations = null;

    }

    componentDidMount() {
        this.clusterOperations = [];
        const displayedEdges = this.props.data.graph.edges.filter(edge => {
            delete edge['color'];
            return this.props.selectedDate.isBetween(moment(edge.validityStart), edge.validityEnd !== "unlimited" ? moment(edge.validityEnd) : moment('2100-01-01'), 'h', '[)');
        });
        const displayedNodes = this.props.data.graph.nodes.filter(node => {
            const edgeCount = displayedEdges.filter(edge => {
                return edge.from === node.id || edge.to === node.id;
            });
            return edgeCount.length > 0;
        })
        this.network.setData({ nodes: displayedNodes, edges: displayedEdges });
        this.nodeDataset = this.network.body.data.nodes;
        this.edgeDataset = this.network.body.data.edges;
        this.createTopLevelClusters();

        this.setState({
            nodes: displayedNodes,
            edges: displayedEdges
        }, () => {
        });
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.data.graph) === JSON.stringify(prevProps.data.graph)) {
            if (!prevProps.selectedDate.isSame(this.props.selectedDate)) {
                const displayedEdges = this.props.data.graph.edges.filter(edge => {
                    return this.props.selectedDate.isBetween(moment(edge.validityStart), edge.validityEnd !== "unlimited" ? moment(edge.validityEnd) : moment('2100-01-01'), 'h', '[)');
                });
                const displayedNodes = this.props.data.graph.nodes.filter(node => {
                    const edgeCount = displayedEdges.filter(edge => {
                        return edge.from === node.id || edge.to === node.id;
                    });
                    return edgeCount.length > 0;
                })

                //console.log("displayed nodes", displayedNodes)
                if (displayedNodes.length === this.state.nodes.length) {
                    if (JSON.stringify(displayedNodes) !== JSON.stringify(this.state.nodes)) {
                        this.network.setData({ nodes: displayedNodes, edges: displayedEdges });
                        this.clusterOperations.length > 0 ? this.recreatePreviousClustering() : this.createTopLevelClusters();
                        this.nodeDataset = this.network.body.data.nodes;
                        this.edgeDataset = this.network.body.data.edges;

                        this.setState({ nodes: displayedNodes, edges: displayedEdges }, () => {
                            // this.network.unselectAll();
                            // this.openAllClusters();
                            // this.clusterByGroup();
                        });
                    }
                } else {

                    this.network.setData({ nodes: displayedNodes, edges: displayedEdges });
                    this.clusterOperations.length > 0 ? this.recreatePreviousClustering() : this.createTopLevelClusters();
                    this.nodeDataset = this.network.body.data.nodes;
                    this.edgeDataset = this.network.body.data.edges;

                    this.setState({ nodes: displayedNodes, edges: displayedEdges }, () => {
                        // this.network.unselectAll();
                        // this.openAllClusters();
                        // this.clusterByGroup()
                    });
                }
            }
        } else {
            const displayedEdges = this.props.data.graph.edges.filter(edge => {
                return this.props.selectedDate.isBetween(moment(edge.validityStart), edge.validityEnd !== "unlimited" ? moment(edge.validityEnd) : moment('2100-01-01'), 'h', '[)');
            });
            const displayedNodes = this.props.data.graph.nodes.filter(node => {
                const edgeCount = displayedEdges.filter(edge => {
                    return edge.from === node.id || edge.to === node.id;
                });
                return edgeCount.length > 0;
            })
            this.clusterOperations = [];
            Object.assign(options.groups, this.props.data.config.groups);
            this.network.setOptions(options)
            this.network.setData({ nodes: displayedNodes, edges: displayedEdges });
            this.createTopLevelClusters();
            this.nodeDataset = this.network.body.data.nodes;
            this.edgeDataset = this.network.body.data.edges;
            this.legendNetwork.redraw();

            this.setState({
                nodes: displayedNodes,
                edges: displayedEdges
            }, () => {
                // Object.assign(options.groups, this.props.data.config.groups);
                // this.network.setOptions(options);
                // this.network.unselectAll();
                // this.createTopLevelClusters();
                // this.legendNetwork.redraw();
            });
        }
    }

    initNetworkInstance = (networkInstance) => {
        this.network = networkInstance;
    }

    initLegendNetworkInstance = (networkInstance) => {
        networkInstance.on("beforeDrawing", (ctx) => {
            ctx.save();
            let baseX = 50;
            let baseY = 80;

            Object.values(this.props.data.config.groups).map(group => {
                if (group.hasOwnProperty("parent")) return;
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
    }

    initNodeDatasetInstance = (nodeDatasetInstance) => {
        this.nodeDataset = nodeDatasetInstance;
    }

    initEdgeDatasetInstance = (edgeDatasetInstance) => {
        this.edgeDataset = edgeDatasetInstance;
    }

    openAllClusters = () => {
        Object.keys(this.network.clustering.body.nodes).forEach(node => {
            if (this.network.isCluster(node) === true) {
                this.network.openCluster(node);
            }
        });
    }

    selectEdge = (event) => {
        const { edges } = event;
        if (edges.length === 1) {
            const selectedEdge = this.edgeDataset.get(edges[0]);
            if (selectedEdge != null) {
                this.edgeDataset.update({ id: edges[0], label: selectedEdge.hiddenLabel });
            }
        }
    }

    deselectEdge = (event) => {
        const { edges } = event.previousSelection;
        if (edges.length === 1) {
            const selectedEdge = this.edgeDataset.get(edges[0]);
            if (selectedEdge != null) {
                this.edgeDataset.update({ id: edges[0], label: "" })
            }
        }
    }

    selectNode = (event) => {
        const { nodes } = event;
        const clickedNode = nodes[0];
        if (this.network.isCluster(clickedNode) === true) {
            const clusterNodeInfo = this.network.clustering.body.nodes[clickedNode];
            console.log(clusterNodeInfo);
            this.logClusterOperation(clusterNodeInfo.options.group, clusterNodeInfo.options.clusterGroupId);
            this.network.openCluster(clickedNode);
            this.createSubclustersByGroupId(clusterNodeInfo.options.group, clusterNodeInfo.options.clusterGroupId);
            return;
        } else {
            const selectedNode = this.props.data.graph.nodes.find(node => { return node.id === clickedNode; });
            if (selectedNode !== undefined) this.props.getSelectedNode(selectedNode);
        }
    }

    click = (event) => {
    }

    fitToScreen = () => {
        this.network.fit({ animation: { duration: 1000, easingFunction: 'easeOutQuart' } });
    }

    createSubclustersByGroupId = (styleGroupId, clusterGroupId) => {
        Object.entries(this.props.data.config.clustering).forEach(clusterDescription => {
            if (clusterDescription[1].hasOwnProperty("parent")) {
                if (clusterDescription[1].parent == clusterGroupId) this.clusterByGroupId(styleGroupId, clusterDescription[0])
            }
        });
    }

    createTopLevelClusters = () => {
        this.openAllClusters();
        Object.entries(this.props.data.config.clustering).forEach(clusterDescription => {
            if (!clusterDescription[1].hasOwnProperty("parent")) this.clusterByGroupId(clusterDescription[0], clusterDescription[0]);
        });
    }

    createTopLevelClustersAndReset = () => {
        this.clusterOperations = [];
        this.createTopLevelClusters();
    }

    logClusterOperation = (styleGroupId, clusterGroupId) => {
        this.clusterOperations.push({ styleGroupId: styleGroupId, clusterGroupId: clusterGroupId });
    }

    revertClusterOperation = () => {
        if (this.clusterOperations.length > 0) {
            let searching = true;
            /*  Opened clusters in the past may have been filtered. 
                Need to loop until a revertable operation with nodes that are being displayed right now is found
                Without this clicking on REVERT button would cause no action - it would try to revert subclusters, the nodes of which are not being displayed right now.
            */
            while(searching) {

                // Find all possible (distinct) subcluster assignments of current nodes
                let revertableClusters = new Set();
                this.state.nodes.forEach(node => {
                    node.clustering.forEach(c => {
                        revertableClusters.add(c)
                    })
                });

                // If the last logged operation doesn't affect displayed nodes, keep searching
                const lastClusterOperation = this.clusterOperations.pop();
                if(revertableClusters.has(lastClusterOperation.clusterGroupId)) {
                    searching = false;
                } else {
                    continue;
                }
    
                let childClustersIds = [];
                Object.entries(this.props.data.config.clustering).forEach(clusterDescription => {
                    if (clusterDescription[1].hasOwnProperty("parent")) {
                        if (clusterDescription[1].parent == lastClusterOperation.clusterGroupId) {
                            childClustersIds.push(clusterDescription[0]);
                        }
                    }
                });
    
                //Opening current subclusters to be able to cluster basic nodes back
                Object.values(this.network.clustering.body.nodes).forEach(node => {
                    if (this.network.isCluster(node.id) === true && childClustersIds.includes(node.options.clusterGroupId)) {
                        this.network.openCluster(node.id);
                    }
                });
    
                // Create a one-level-above cluster of free nodes
                this.clusterByGroupId(lastClusterOperation.styleGroupId, lastClusterOperation.clusterGroupId);
                searching = false;
            }
        }
    }

    recreatePreviousClustering = () => {
        // Create default top level clustering
        this.createTopLevelClusters();

        if (this.clusterOperations.length > 0) {
            // Recreate previous situation from logged (sub)cluster operations data
            this.clusterOperations.forEach(clusterOp => {
                Object.values(this.network.clustering.body.nodes).forEach(node => {
                    if (this.network.isCluster(node.id) === true && clusterOp.clusterGroupId === node.options.clusterGroupId) {
                        this.network.openCluster(node.id);
                    }
                });
                this.createSubclustersByGroupId(clusterOp.styleGroupId, clusterOp.clusterGroupId);
            })
        }
    }

    findParent = (clusterGroupId) => {
        let parent = this.props.data.config.clustering[clusterGroupId].parent;
        if (parent === undefined) return clusterGroupId;
        return this.findParent(parent);
    }

    clusterByGroupId = (styleGroupId, clusterGroupId) => {
        const groupInfo = this.props.data.config.clustering[clusterGroupId];
        const clusterOptionsByData = {
            joinCondition: (nodeOptions) => {
                if (!nodeOptions.hasOwnProperty("clustering")) return false;
                return nodeOptions.clustering.includes(clusterGroupId);
            },
            processProperties: (clusterOptions, childNodes, childEdges) => {
                const countPlaceholder = "{count}";
                let label = groupInfo.name;
                if (label.includes(countPlaceholder)) {
                    label = label.replace(countPlaceholder, childNodes.length);
                } else {
                    label = "Contains: " + childNodes.length.toString();
                }
                clusterOptions.label = label;
                return clusterOptions;
            },
            clusterNodeProperties: {
                id: uuid.v4(),
                group: styleGroupId,
                clusterGroupId: clusterGroupId,
                shape: 'circle',
                labelHighlightBold: false,
                font: {
                    face: 'georgia',
                    color: "black",
                    size: 12,
                    align: 'center',
                    multi: 'html',
                    bold: {
                        size: 18,
                        vadjust: 2
                    }
                }
            },
            clusterEdgeProperties: {
                label: '',
                color: '#848484',
                opacity: 0.6,
            }
        };
        this.network.cluster(clusterOptionsByData)
    }

    render() {
        Object.assign(options.groups, this.props.data.config.groups);
        const events = {
            selectNode: this.selectNode,
            selectEdge: this.selectEdge,
            deselectEdge: this.deselectEdge,
            click: this.click,
        };

        return (
            <div>
                <div style={{ width: '70%', position: 'absolute' }}>
                    <VisNetwork graph={{ nodes: [], edges: [] }}
                        options={{ autoResize: true }}
                        style={{ height: "800px" }}
                        getNetwork={this.initLegendNetworkInstance}
                    />
                </div>
                <div style={{ width: '70%', position: 'absolute' }}>
                    <VisNetwork graph={{ nodes: [], edges: [] }}
                        options={options}
                        events={events}
                        style={{ height: "800px" }}
                        getNetwork={this.initNetworkInstance}
                        getNodes={this.initNodeDatasetInstance}
                        getEdges={this.initEdgeDatasetInstance}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <CustomButton onClick={this.revertClusterOperation} name={'Revert'} />
                    <CustomButton onClick={this.createTopLevelClustersAndReset} name={'Reset clustering'} />
                    <CustomButton onClick={this.fitToScreen} name={'Fit to screen'} />
                </div>
            </div>
        )

    }
}

export default GraphComponentView2;