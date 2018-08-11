import React, { Component } from 'react'
import Cytoscape from './Cytoscape';

export default class GraphComponentViewCy extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
        const cy = null
    }

    initCyInstance = (cy) => {
        this.cy = cy;

        cy.on('mouseover', 'edge', function (evt) {
            var edge = evt.target;
            cy.$(`#${edge.id()}`).data('label', edge.data().hiddenLabel);
        });

        
        cy.on('mouseout', 'edge', function (evt) {
            var edge = evt.target;
            cy.$(`#${edge.id()}`).data('label', "");
        });


    }

    render() {
        return (
            <div>
                {this.props.elements && <Cytoscape getCy={this.initCyInstance} data={this.props.elements} />}
            </div>
        )
    }
}
