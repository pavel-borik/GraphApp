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

    createSubclustersByGroupId = (groupId, clusterGroupId) => {
        const childGroups = Object.values(this.props.data.config.clustering).filter(group => {
            if (group.hasOwnProperty("parent")) {
                return group.parent == clusterGroupId;
            }
            return false;
        });

        if (!childGroups.length > 0) return;
        for (let i = 0; i < childGroups.length; i++) {
            this.clusterByGroupId(groupId, childGroups[i].id)
        }
    }

    createTopLevelClusters = () => {
        //this.clusterOperations = [];
        this.openAllClusters();
        const topLevelGroups = Object.values(this.props.data.config.clustering).filter(g => {
            return !g.hasOwnProperty("parent");
        });

        for (let i = 0; i < topLevelGroups.length; i++) {
            this.clusterByGroupId(topLevelGroups[i].id, topLevelGroups[i].id)
        }
    }

    createTopLevelClustersAndReset = () => {
        this.clusterOperations = [];
        this.createTopLevelClusters();
    }

    logClusterOperation = (styleGroupId, clusterGroupId) => {
        this.clusterOperations.push({ styleGroupId, clusterGroupId });
    }

    revertClusterOperation = () => {
        if (this.clusterOperations.length > 0) {
            const clusterOperation = this.clusterOperations.pop();
            console.log(clusterOperation)
            const values = Object.values(clusterOperation);

            const childGroups = Object.values(this.props.data.config.clustering).filter(group => {
                if (group.hasOwnProperty("parent")) {
                    return group.parent == values[1];
                }
                return false;
            });

            const childGroupsIds = childGroups.map(g => {
                return g.id;
            })

            //Opening current subclusters to be able to cluster basic nodes back
            Object.values(this.network.clustering.body.nodes).forEach(node => {
                if (this.network.isCluster(node.id) === true && childGroupsIds.includes(node.options.clusterGroupId)) {
                    this.network.openCluster(node.id);
                }
            });

            this.clusterByGroupId(values[0], values[1]);
        }
    }

    recreatePreviousClustering = () => {
        console.log("recreating", this.clusterOperations)

        // Create default top level clustering
        this.createTopLevelClusters();

        if (this.clusterOperations.length > 0) {
            // Subclusters that need to be opened to recreate previous situation
            let groupsToOpen = [];
            this.clusterOperations.forEach(clusterOp => {
                groupsToOpen.push( Object.values(clusterOp)[1] );
            })

            //Open them
            Object.values(this.network.clustering.body.nodes).forEach(node => {
                if (this.network.isCluster(node.id) === true && groupsToOpen.includes(node.options.clusterGroupId)) {
                    this.network.openCluster(node.id);
                }
            });

            // Recreate previous situation from logged (sub)cluster operations data
            this.clusterOperations.forEach(clusterOp => {
                const clusterOpValues = Object.values(clusterOp);
                Object.values(this.network.clustering.body.nodes).forEach(node => {
                    if (this.network.isCluster(node.id) === true && clusterOpValues[1] === node.options.clusterGroupId) {
                        this.network.openCluster(node.id);
                    }
                });

                this.createSubclustersByGroupId(clusterOpValues[0], clusterOpValues[1]);
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
                    <CustomButton onClick={this.createTopLevelClustersAndReset} name={'Cluster'} />
                    <CustomButton onClick={this.fitToScreen} name={'Fit to screen'} />
                    <CustomButton onClick={this.revertClusterOperation} name={'Revert'} />
                </div>
            </div>
        )

    }
}

export default GraphComponentView2;