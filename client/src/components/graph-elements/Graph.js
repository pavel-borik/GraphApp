import Graph from 'react-graph-vis';
import React, { Component } from 'react';
import CustomButton from '../gui-elements/CustomButton'
import { options } from './GraphOptions'
import moment from 'moment';

class GraphVis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            links: [],
        }
        const network = null;
        const legendNetwork = null;
        const dataset = null;
    }

    componentDidMount() {
        const displayedNodes = this.props.data.graph.nodes.filter(node => {
            if (node.group === 0) {
                return true;
            } else {
                return this.props.selectedDate.isBetween(moment(node.validity_start), node.validity_end !== "unlimited" ? moment(node.validity_end) : moment(), 'day', '[)');
            }
        });

        this.setState({
            nodes: displayedNodes, links: this.props.data.graph.links
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
                        return this.props.selectedDate.isBetween(moment(node.validity_start), node.validity_end !== "unlimited" ? moment(node.validity_end) : moment(), 'day', '[)');
                    }
                });
                console.log("displayed nodes", displayedNodes)
                if (displayedNodes.length === this.state.nodes.length) {
                    if (JSON.stringify(displayedNodes) !== JSON.stringify(this.state.nodes)) {
                        this.setState({ nodes: displayedNodes }, () => { this.network.unselectAll(); this.openAllClusters(); this.clusterByGroup() });
                    } else { console.log("actually not updating") }
                } else {
                    this.setState({ nodes: displayedNodes }, () => { this.network.unselectAll(); this.openAllClusters(); this.clusterByGroup() });
                }
            }
        } else {
            const displayedNodes = this.props.data.graph.nodes.filter(node => {
                if (node.group === 0) {
                    return true;
                } else {
                    return this.props.selectedDate.isBetween(moment(node.validity_start), node.validity_end !== "unlimited" ? moment(node.validity_end) : moment(), 'day', '[)');
                }
            });

            this.setState({
                nodes: displayedNodes, links: this.props.data.graph.links
            }, () => {
                this.network.unselectAll();
                this.openAllClusters();
                this.clusterByGroup();
                this.legendNetwork.redraw();
            });
        }
    }

    initNetworkInstance = (networkInstance) => {
        networkInstance.on("selectNode", (params) => {
            console.log("params", params);
            if (params.nodes.length === 1) {
                if (networkInstance.isCluster(params.nodes[0]) === true) {
                    networkInstance.openCluster(params.nodes[0]);
                }
            }
        });

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
                
                baseY+=40;
            });
        });
        networkInstance.on("resize", () => {
            networkInstance.redraw();
        });

        this.legendNetwork = networkInstance;
    }

    initDatasetInstance = (datasetInstance) => {
        this.dataset = datasetInstance;
        //console.log(this.network);
    }

    openAllClusters = () => {
        Object.keys(this.network.clustering.body.nodes).forEach(node => {
            if (this.network.isCluster(node) === true) {
                this.network.openCluster(node);
            }
        });
    }

    selectNode = (event) => {
        const { nodes } = event;
        const param = nodes[0];
        const selectedNode = this.state.nodes.find(node => { return node.id === param; });
        if (selectedNode !== undefined) {
            //this.setState({ selectedNodeId: selectedNode.id });
            this.props.getSelectedNode(selectedNode);
        }
        //console.log(selectedNode);
    }

    click = (event) => {
        //console.log(event);
    }

    fitToScreen = () => {
        this.network.fit({ animation: { duration: 1000, easingFunction: 'easeOutQuart' } });
    }

    clusterByGroup = () => {
        const groupcount = Object.keys(this.props.data.config.groups).length-1;
        let clusterOptionsByData;
        for (let i = 1; i <= groupcount; i++) {
            clusterOptionsByData = {
                joinCondition: (nodeOptions) => {
                    //console.log('childoptions', nodeOptions)
                    return nodeOptions.group === i;
                },
                processProperties: (clusterOptions, childNodes, childEdges) => {
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
            click: this.click,
        };
        //console.log("data", this.state.nodes)
        return (
            <div>

                <div style={{ width: '73%', position: 'absolute' }}>
                    <Graph graph={{ nodes: [], edges: [] }}
                        options={ {autoResize: true} }
                        style={{ height: "900px" }}
                        getNetwork={this.initLegendNetworkInstance}
                    />
                </div>
                <div style={{ width: '73%', position: 'absolute' }}>
                    <Graph graph={{ nodes: this.state.nodes, edges: this.state.links }}
                        options={options}
                        events={events}
                        style={{ height: "900px" }}
                        getNetwork={this.initNetworkInstance}
                        getNodes={this.initDatasetInstance} />
                </div>
                <div style={{ display: 'flex' }}>
                    <CustomButton onClick={this.clusterByGroup} name={'Cluster'} />
                    <CustomButton onClick={this.fitToScreen} name={'Fit to screen'} />
                </div>
            </div>
        )

    }
}

export default GraphVis;