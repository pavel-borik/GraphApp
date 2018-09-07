import VisNetwork from './VisNetwork';
import React, { Component } from 'react';
import CustomButton from '../GuiElements/CustomButton';
import { options } from './GraphOptions';
import uuid from "uuid";
import './GraphComponent.css';


/**
 * View 1
 * Viewing relationships during a certain time period
 * Relationships which begin AFTER the start moment or end BEFORE the end moment have the edges highlighted
 */
class GraphComponentView1 extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        const network = null;
        const legendNetwork = null;
        const nodeDataset = null;
        const edgeDataset = null;
        const clusterOperations = null;
    }

    componentDidMount() {
        this.highlightEdges();
        this.createTopLevelClusters();
        this.clusterOperations = [];
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.data.graph) !== JSON.stringify(prevProps.data.graph)) {
            Object.assign(options.groups, this.props.data.config.groups);
            this.network.setOptions(options);
            this.network.unselectAll();
            this.highlightEdges();
            this.createTopLevelClusters();
            this.legendNetwork.redraw();
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

    highlightEdges = () => {
        const highlightedEdges = this.props.data.graph.edges.map(edge => {
            if (edge.validityChanges === true) return Object.assign(edge, { color: { color: "#ff6363", opacity: 0.5, highlight: "#fb1414" } });
            return edge;
        });
        this.network.setData({ nodes: this.props.data.graph.nodes, edges: highlightedEdges })
        this.edgeDataset = this.network.body.data.edges;
        // this.edgeDataset.map(edge => {
        //     if (edge.validityChanges === true) this.edgeDataset.update({ id: edge.id, color: { color: "#ff6363", opacity: 0.5, highlight: "#fb1414" } });
        // })
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
            const lastClusterOperation = this.clusterOperations.pop();

            let childGroupsIds = [];
            Object.entries(this.props.data.config.clustering).forEach(clusterDescription => {
                // Iterating over entries - clusterDescription[0] - key, clusterDescription[1] - value
                if (clusterDescription[1].hasOwnProperty("parent")) {
                    if (clusterDescription[1].parent == lastClusterOperation.clusterGroupId) {
                        childGroupsIds.push(clusterDescription[0]);
                    }
                }
            });

            // Opening current subclusters to be able to cluster basic nodes back
            Object.values(this.network.clustering.body.nodes).forEach(node => {
                if (this.network.isCluster(node.id) === true && childGroupsIds.includes(node.options.clusterGroupId)) {
                    this.network.openCluster(node.id);
                }
            });

            // Create a one-level-above cluster of free nodes
            this.clusterByGroupId(lastClusterOperation.styleGroupId, lastClusterOperation.clusterGroupId);
        }
    }

    click = (event) => { }

    fitToScreen = () => {
        this.network.fit({ animation: { duration: 1000, easingFunction: 'easeOutQuart' } });
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
                        style={{ height: "99vh" }}
                        getNetwork={this.initLegendNetworkInstance}
                    />
                </div>
                <div style={{ width: '70%', position: 'absolute' }}>
                    <VisNetwork graph={{ nodes: this.props.data.graph.nodes, edges: this.props.data.graph.edges }}
                        options={options}
                        events={events}
                        style={{ height: "99vh" }}
                        getNetwork={this.initNetworkInstance}
                        getNodes={this.initNodeDatasetInstance}
                        getEdges={this.initEdgeDatasetInstance}
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <CustomButton onClick={this.revertClusterOperation} name={'Revert'} tooltipTitle={"Reverts last declustering operation"}/>
                    <CustomButton onClick={this.createTopLevelClustersAndReset} name={'Reset clustering'} tooltipTitle={"Resets the clustering to default level"}/>
                    <CustomButton onClick={this.fitToScreen} name={'Fit to screen'} tooltipTitle={"Moves and centers the graph so that all nodes fit on the screen"}/>
                </div>
            </div>
        )
    }
}

export default GraphComponentView1;