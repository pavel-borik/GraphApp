import Graph from 'react-graph-vis';
import React, { Component } from 'react';
import CustomButton from '../gui-elements/CustomButton'
import { options } from './GraphOptions'
import { legendOptions } from './GraphLegendOptions'
import moment from 'moment';


class GraphVis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            links: [],
            legend: [],
        }
        const network = null;
        const legendNetwork = null;
        const dataset = null;
    }

    componentDidMount() {
        this.props.data.config.legend.nodes.map(node => {
            let coords = this.legendNetwork.DOMtoCanvas({ x: node.x, y: node.y });
            node.x = coords.x;
            node.y = coords.y;
            return node;
        })

        const displayedNodes = this.props.data.graph.nodes.filter(node => {
            if (node.group === 0) {
                return true;
            } else {
                return this.props.selectedDate.isBetween(moment(node.validity_start), node.validity_end !== "unlimited" ? moment(node.validity_end) : moment(),'day', '[)');
            }
        });

        this.setState({
            nodes: displayedNodes, links: this.props.data.graph.links, legend: this.props.data.config.legend.nodes
        }, () => {
            this.clusterByGroup();
        });
    }

    componentDidUpdate(prevProps) {
        
        if (!prevProps.selectedDate.isSame(this.props.selectedDate)) {
            
            const displayedNodes = this.props.data.graph.nodes.filter(node => {
                if (node.group === 0) {
                    return true;
                } else {
                    return this.props.selectedDate.isBetween(moment(node.validity_start), node.validity_end !== "unlimited" ? moment(node.validity_end) : moment(), 'day', '[)');
                }
            });
            console.log("displayed nodes", displayedNodes)
            if(displayedNodes.length === this.state.nodes.length) {
                if(JSON.stringify(displayedNodes) !== JSON.stringify(this.state.nodes)) {
                    this.setState({nodes: displayedNodes}, () => {this.openAllClusters(); this.clusterByGroup()});
                }
            } else {
                this.setState({nodes: displayedNodes}, () => {this.openAllClusters(); this.clusterByGroup()});
            }
        }
    }

    initNetworkInstance = (networkInstance) => {
        networkInstance.on("selectNode", (params) => {
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
        this.legendNetwork = networkInstance;
        //console.log(this.legendNetwork);
    }

    initDatasetInstance = (datasetInstance) => {
        this.dataset = datasetInstance;
        //console.log(this.network);
    }

    openAllClusters = () => {
        Object.keys(this.network.clustering.body.nodes).forEach( node => {
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
        const groupcount = this.props.data.config.group_count;
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

        const events = {
            selectNode: this.selectNode,
            click: this.click,
        };
        //console.log("legend", this.state.legend)
        //console.log("data", this.state.nodes)
        return (
            <div>
                <div style={{ display: 'flex' }}>
                    <CustomButton onClick={this.clusterByGroup} name={'Cluster'} />
                    <CustomButton onClick={this.fitToScreen} name={'Fit graph'} />
                </div>
                <div style={{ position: 'absolute', width: '100%' }}>
                    <Graph graph={{ nodes: this.state.legend, edges: [] }}
                        options={legendOptions}
                        style={{ height: "800px" }}
                        getNetwork={this.initLegendNetworkInstance}
                    />
                </div>
                <div style={{ position: 'absolute', width: '100%' }}>
                    <Graph graph={{ nodes: this.state.nodes, edges: this.state.links }}
                        options={options}
                        events={events}
                        style={{ height: "800px" }}
                        getNetwork={this.initNetworkInstance}
                        getNodes={this.initDatasetInstance} />
                </div>

            </div>
        )

    }
}

export default GraphVis;