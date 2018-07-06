import Graph from 'react-graph-vis';
import React, { PureComponent } from 'react';
import CustomButton from '../gui-elements/CustomButton'
import { options } from './GraphOptions'

class GraphVis extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            links: [],
        }
        const network = null;
    }

    componentDidMount() {
        this.setState({ nodes: this.props.data.nodes, links: this.props.data.links }, () => {
            this.clusterByGroup();
            this.createLegend();
        });
    }

    componentDidUpdate() {
        this.setState({ nodes: this.props.data.nodes, links: this.props.data.links }, () => {
            this.clusterByGroup(    );
            this.createLegend();
        });    }

    initNetworkInstance = (networkInstance) => {
        this.network = networkInstance;
        //console.log(this.network);
    }

    selectNode = (event) => {
        const { nodes } = event;
        var param = nodes[0];
        var selectedNode = this.state.nodes.find(node => { return node.id === param; });
        //console.log(selectedNode);
    }

    fitToScreen = () => {
        this.network.fit({ animation: { duration: 1000, easingFunction: 'easeOutQuart' } });
    }

    clusterByGroup = () => {
        const groupcount = this.props.data.config.groupcount;
        let clusterOptionsByData;
        let colors = ["red", "green", "blue", "#6b486b", "#a05d56"];
        for (let i = 1; i <= groupcount; i++) {
            clusterOptionsByData = {
                joinCondition: (childOptions) => {
                    return childOptions.group === i;
                },
                processProperties: (clusterOptions, childNodes, childEdges) => {
                    clusterOptions.label = 'Node count:\n'+ '<b>'+childNodes.length+'</b>';
                    return clusterOptions;
                },
                clusterNodeProperties: { 
                    id: i,
                    group: i, 
                    borderWidth: 3, 
                    shape: 'circle',
                    labelHighlightBold: false,
                    color: colors[i], 
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
            console.log("clusteroptions", clusterOptionsByData)
            this.network.cluster(clusterOptionsByData)
            //this.network.clustering.updateClusteredNode(i, { label: 'Items: '+ totalMass });
        }
        const ntwrk = this.network;
        ntwrk.on("selectNode", (params) => {
            if (params.nodes.length == 1) {
                if (ntwrk.isCluster(params.nodes[0]) == true) {
                    ntwrk.openCluster(params.nodes[0]);
                }
            }
        });
    }

    createLegend = () => {
        console.log(this.network);
    }

    render() {
        const events = {
            selectNode: this.selectNode,
        };
        return (
            <div>
                <div style={{ display: 'flex' }}>
                    <CustomButton onClick={this.clusterByGroup} name={'Cluster'} />
                    <CustomButton onClick={this.fitToScreen} name={'Fit graph'} />
                </div>
                <div style={{ position: 'absolute', width: '100%'}}>
                    <Graph graph={{ nodes: this.state.nodes, edges: this.state.links }}
                        options={options}
                        events={events}
                        style={{ height: "800px" }}
                        getNetwork={this.initNetworkInstance} />
                </div>
            </div>
        )

    }
}

export default GraphVis;