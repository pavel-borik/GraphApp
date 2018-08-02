import Graph from 'react-graph-vis';
import React, { Component } from 'react';
import CustomButton from '../GuiElements/CustomButton'
import { options } from './GraphOptions'
import moment from 'moment';
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
            links: [],
            intervals: [],
        }
        const network = null;
        const legendNetwork = null;
        const nodeDataset = null;
        const edgeDataset = null;
    }

    componentDidMount() {
        let newIntervals = new Set();
        const displayedNodes = this.props.data.graph.nodes.filter(node => {
            if (node.validityStart !== null && node.validityStart !== "unlimited") newIntervals.add(node.validityStart);
            if (node.validityEnd !== null && node.validityEnd !== "unlimited") newIntervals.add(node.validityEnd);

            if (node.group === 0) {
                return true;
            } else {
                return this.props.selectedDate.isBetween(moment(node.validityStart), node.validityEnd !== "unlimited" ? moment(node.validityEnd) : moment(), 'day', '[)');
            }
        });

        this.setState({
            nodes: displayedNodes,
            intervals: Array.from(newIntervals).sort()
        }, () => {
            this.clusterByGroup();
        });
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.data.graph.nodes) === JSON.stringify(prevProps.data.graph.nodes)) {
            if (!prevProps.selectedDate.isSame(this.props.selectedDate)) {
                const displayedNodes = this.props.data.graph.nodes.filter(node => {
                    if (node.group === 0) {
                        return true;
                    } else {
                        return this.props.selectedDate.isBetween(moment(node.validityStart), node.validityEnd !== "unlimited" ? moment(node.validityEnd) : moment(), 'day', '[)');
                    }
                });
                //console.log("displayed nodes", displayedNodes)
                if (displayedNodes.length === this.state.nodes.length) {
                    if (JSON.stringify(displayedNodes) !== JSON.stringify(this.state.nodes)) {
                        this.setState({ nodes: displayedNodes }, () => {
                            Object.assign(options.groups, this.props.data.config.groups);
                            this.network.setOptions(options);
                            this.network.unselectAll();
                            this.openAllClusters();
                            this.clusterByGroup();
                        });
                    }
                } else {
                    this.setState({ nodes: displayedNodes }, () => { this.network.unselectAll(); this.openAllClusters(); this.clusterByGroup() });
                }
            }
        } else {
            const displayedNodes = this.props.data.graph.nodes.filter(node => {
                if (node.group === 0) {
                    return true;
                } else {
                    return this.props.selectedDate.isBetween(moment(node.validityStart), node.validityEnd !== "unlimited" ? moment(node.validityEnd) : moment(), 'day', '[)');
                }
            });

            this.setState({
                nodes: displayedNodes,// links: this.props.data.graph.links
            }, () => {
                Object.assign(options.groups, this.props.data.config.groups);
                this.network.setOptions(options);
                this.network.unselectAll();
                this.openAllClusters();
                this.clusterByGroup();
                this.legendNetwork.redraw();
            });
        }
    }

    initNetworkInstance = (networkInstance) => {
        this.network = networkInstance;
        //console.log(this.network);
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
        //console.log(this.network);
    }
    initEdgeDatasetInstance = (edgeDatasetInstance) => {
        this.edgeDataset = edgeDatasetInstance;
        //console.log(this.network);
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
        const selectedNode = this.state.nodes.find(node => { return node.id === clickedNode; });

        if (this.network.isCluster(clickedNode) === true) {
            this.network.openCluster(clickedNode);
            return;
            //networkInstance.setData({nodes: this.state.nodes, edges: this.props.data.graph.links})
        }

        if (selectedNode !== undefined) {
            //this.setState({ selectedNodeId: selectedNode.id });
            this.props.getSelectedNode(selectedNode);
        }
        //console.log(selectedNode);
    }

    click = (event) => {
    }

    fitToScreen = () => {
        this.network.fit({ animation: { duration: 1000, easingFunction: 'easeOutQuart' } });
    }

    clusterByGroup = () => {
        const groupcount = Object.keys(this.props.data.config.groups).length - 1;
        let clusterOptionsByData;
        for (let i = 1; i <= groupcount; i++) {
            clusterOptionsByData = {
                joinCondition: (nodeOptions) => {
                    //console.log('childoptions', nodeOptions)
                    return nodeOptions.group === i;
                },
                processProperties: (clusterOptions, childNodes, childEdges) => {
                    //console.log("childedges", childEdges);
                    clusterOptions.label = 'Node count:\n' + '<b>' + childNodes.length + '</b>';
                    return clusterOptions;
                },
                clusterNodeProperties: {
                    id: i,
                    group: i,
                    borderWidth: 3,
                    shape: 'circle',
                    labelHighlightBold: false,
                    font: {
                        face: 'georgia',
                        color: "white",
                        size: 14,
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
                }
            };
            //console.log("clusteroptions", clusterOptionsByData)
            this.network.cluster(clusterOptionsByData)
            //this.network.clustering.updateClusteredNode(i, { label: 'Items: '+ totalMass });
        }
        //console.log('taht',this.network.clustering.body.nodes)
    }

    render() {
        //console.log('ntw',this.network);
        //console.log('datset',this.dataset);
        Object.assign(options.groups, this.props.data.config.groups);

        const events = {
            selectNode: this.selectNode,
            selectEdge: this.selectEdge,
            deselectEdge: this.deselectEdge,
            click: this.click,
        };
        console.log("displayednodes", this.state.nodes)
        return (
            <div>

                <div style={{ width: '73%', position: 'absolute' }}>
                    <Graph graph={{ nodes: [], edges: [] }}
                        options={{ autoResize: true }}
                        style={{ height: "900px" }}
                        getNetwork={this.initLegendNetworkInstance}
                    />
                </div>
                <div style={{ width: '73%', position: 'absolute' }}>
                    <Graph graph={{ nodes: this.state.nodes, edges: this.props.data.graph.links }}
                        options={options}
                        events={events}
                        style={{ height: "900px" }}
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

export default GraphComponentView2;