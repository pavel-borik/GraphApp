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
        this.state = {
            nodes: [],
            edges: [],
        }
        const network = null;
        const legendNetwork = null;
        const nodeDataset = null;
        const edgeDataset = null;
    }

    componentDidMount() {
        this.highlightEdges();
        this.clusterByGroup();
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.data.graph) !== JSON.stringify(prevProps.data.graph)) {
            Object.assign(options.groups, this.props.data.config.groups);
            this.network.setOptions(options);
            this.network.unselectAll();
            this.openAllClusters();
            this.highlightEdges();
            this.clusterByGroup();
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
            this.network.openCluster(clickedNode);
            this.createSubclusters(clusterNodeInfo.options.group, clusterNodeInfo.options.clusterGroupId);
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

    createSubclusters = (groupId, clusterGroupId) => {
        const childGroups = Object.values(this.props.data.config.groups).filter(group => {
            if (group.hasOwnProperty("parent")) {
                return group.parent == clusterGroupId;
            }
            return false;
        });
        if(!childGroups.length > 0) return;
        let clusterOptionsByData;
        for (let i = 0; i < childGroups.length; i++) {
            const currentGroupId = childGroups[i].id;
            clusterOptionsByData = {
                joinCondition: (nodeOptions) => {
                    if (!nodeOptions.hasOwnProperty("clustering")) return false;
                    return nodeOptions.clustering.includes(currentGroupId);
                },
                processProperties: (clusterOptions, childNodes, childEdges) => {
                    const countPlaceholder = "{count}";
                    let label = childGroups[i].name;
                    if(label.includes(countPlaceholder)) {
                        label = label.replace(countPlaceholder, childNodes.length);
                    }
                    clusterOptions.label = label;
                    return clusterOptions;
                },
                clusterNodeProperties: {
                    id: uuid.v4(),
                    group: groupId,
                    clusterGroupId: currentGroupId,
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
    }

    clusterByGroup = () => {
        this.openAllClusters();
        const filteredGroups = Object.values(this.props.data.config.groups).filter(g => {
            return !g.hasOwnProperty("parent");
        });

        let clusterOptionsByData;
        for (let i = 0; i < filteredGroups.length; i++) {
            const currentGroupId = filteredGroups[i].id
            clusterOptionsByData = {
                joinCondition: (nodeOptions) => {
                    if (!nodeOptions.hasOwnProperty("clustering")) return false;
                    return nodeOptions.clustering.includes(currentGroupId);
                },
                processProperties: (clusterOptions, childNodes, childEdges) => {
                    let sumOfNodes = childNodes.length;
                    clusterOptions.label = `Node count:\n <b> ${sumOfNodes} </b>`;
                    return clusterOptions;
                },
                clusterNodeProperties: {
                    id: uuid.v4(),
                    group: currentGroupId,
                    clusterGroupId: currentGroupId,
                    borderWidth: 3,
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
                    <CustomButton onClick={this.clusterByGroup} name={'Cluster'} />
                    <CustomButton onClick={this.fitToScreen} name={'Fit to screen'} />
                </div>
            </div>
        )
    }
}

export default GraphComponentView1;