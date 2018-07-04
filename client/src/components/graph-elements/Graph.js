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
            this.clusterByColor();
            this.createLegend();
        });
    }

    componentDidUpdate() {
        this.setState({ nodes: this.props.data.nodes, links: this.props.data.links }, () => {
            this.clusterByColor();
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

    clusterByColor = () => {
        var colors = ['green', 'blue', '#6b486b'];
        var clusterOptionsByData;
        for (var i = 0; i < colors.length; i++) {
            var color = colors[i];
            var totalMass;
            clusterOptionsByData = {
                joinCondition: function (childOptions) {
                    return childOptions.color.background == color; // the color is fully defined in the node.
                },
                processProperties: function (clusterOptions, childNodes, childEdges) {
                    totalMass = 0;
                    for (var i = 0; i < childNodes.length; i++) {
                        totalMass += childNodes[i].mass;
                    }
                    clusterOptions.mass = 1;
                    return clusterOptions;
                },
                clusterNodeProperties: { id: i, borderWidth: 3, shape: 'circle', color: color, label: 'color:' + color }
            };
            //console.log(totalMass)
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
                    <CustomButton onClick={this.clusterByColor} name={'Cluster'} />
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