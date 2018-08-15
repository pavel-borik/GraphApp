import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import spread from 'cytoscape-spread';
import cola from 'cytoscape-cola';

cytoscape.use( cola );

let cyStyle = {
    position: 'absolute',
    width: '70%',
    height: '900px',
};

let conf = {
    boxSelectionEnabled: false,
    autounselectify: true,
    zoomingEnabled: true,
    wheelSensitivity: 0.2,
    style: [
        {
            selector: 'node',
            style: {
                'text-opacity': 0.5,
                'text-valign': 'bottom',
                'label': 'data(name)'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 0.5,
                "curve-style": "bezier",
                'target-arrow-shape': 'triangle',
                'line-color': 'gray',
                'target-arrow-color': 'gray',
                'text-rotation': 'autorotate',
                'label': 'data(label)',
            }
        },
        {
            selector: '.changesValidity',
            style: {
                'line-color':'red'
            }
        }
    ],
    layout: {
        name: 'cola',
        nodeDimensionsIncludeLabels: true,
        infinite: true,
        fit: false,
    }
};

class Cytoscape extends Component {
    constructor(props) {
        super(props);
        this.state = { cy: null}
    }

    componentDidMount() {
        conf.container = this.cyRef;
        conf.elements = this.props.data;
        const cy = cytoscape(conf);

        this.setState({cy: cy}, () => this.props.getCy(this.state.cy));
        // cy.json();
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
        conf.container = this.cyRef;
        conf.elements = nextProps.data;
        const cy = cytoscape(conf);

        this.setState({cy: cy}, () => this.props.getCy(this.state.cy));
    }

    componentWillUnmount() {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
    }

    render() {
        console.log('rendercy')
        return <div style={cyStyle} ref={(cyRef) => {
            this.cyRef = cyRef;
        }}/>
    }
}

export default Cytoscape;