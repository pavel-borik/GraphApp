import React, { Component } from 'react';
import cytoscape from 'cytoscape';

let cyStyle = {
    position: 'absolute',
    width: '70%',
    height: '900px',
};

let conf = {
    boxSelectionEnabled: false,
    autounselectify: true,
    zoomingEnabled: true,
    style: [
        {
            selector: 'node',
            style: {
                'text-opacity': 0.5,
                'text-valign': 'bottom',
                'label': 'data(typeFullName)'
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
                'label': 'data(hiddenLabel)',
                'text-rotation': 'autorotate',
            }
        }
    ],
    layout: {
        name: 'concentric',
        nodeDimensionsIncludeLabels: true
        //animate:true,
        //animationDuration: 5000
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