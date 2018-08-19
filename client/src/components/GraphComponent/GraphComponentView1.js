import Graph from 'react-graph-vis';
import React, { Component } from 'react';
import CustomButton from '../GuiElements/CustomButton'
import { options } from './GraphOptions'
import moment from 'moment';
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
        this.edgeDataset.map(edge => {
            if (edge.validityChanges === true) this.edgeDataset.update({ id: edge.id, color: { color: "#ff6363", opacity: 0.5, highlight: "#fb1414" } });
        })
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
            if (!clusterNodeInfo.options.isCluster === true) {
                this.network.openCluster(clickedNode);
                this.createSubclusters(clusterNodeInfo.options.group);
            } else {
                this.network.openCluster(clickedNode);
            }
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

    createSubclusters = (groupId) => {
        const g = this.props.data.config.groups[groupId];
        const groupKey = groupId;
        if (g.hasOwnProperty("clustering")) {
            if (g.clustering.length > 0) {
                g.clustering.forEach(c => {
                    let clusterOptionsByData;
                    clusterOptionsByData = {
                        joinCondition: (nodeOptions) => {
                            return nodeOptions.subcluster === c.id;
                        },
                        processProperties: (clusterOptions, childNodes, childEdges) => {
                            clusterOptions.label = `${c.name}\n Contains: \n ${childNodes.length} nodes`;
                            clusterOptions.nOfNodes = childNodes.length;
                            clusterOptions.isCluster = true;
                            return clusterOptions;
                        },
                        clusterNodeProperties: {
                            id: groupKey + "_" + c.id,
                            group: groupKey,
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
                })
            }
        }

    }

    clusterByGroup = () => {
        //this.createSubclusters();
        const groupKeys = Object.keys(this.props.data.config.groups);
        const groupcount = groupKeys.length;
        let clusterOptionsByData;
        for (let i = 0; i < groupcount; i++) {
            clusterOptionsByData = {
                joinCondition: (nodeOptions) => {
                    return nodeOptions.group == groupKeys[i];
                },
                processProperties: (clusterOptions, childNodes, childEdges) => {
                    let sumOfNodes = childNodes.length;
                    for (let i = 0; i < childNodes.length; i++) {
                        if (childNodes[i].isCluster === true) {
                            sumOfNodes += childNodes[i].nOfNodes - 1
                        }
                    }
                    clusterOptions.label = `Node count:\n <b> ${sumOfNodes} </b>`;
                    return clusterOptions;
                },
                clusterNodeProperties: {
                    id: groupKeys[i],
                    group: groupKeys[i],
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
                <div style={{ width: '73%', position: 'absolute' }}>
                    <Graph graph={{ nodes: [], edges: [] }}
                        options={{ autoResize: true }}
                        style={{ height: "99vh" }}
                        getNetwork={this.initLegendNetworkInstance}
                    />
                </div>
                <div style={{ width: '73%', position: 'absolute' }}>
                    <Graph graph={{ nodes: this.props.data.graph.nodes, edges: this.props.data.graph.edges }}
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