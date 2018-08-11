import React, { Component } from 'react'
import Cytoscape from './Cytoscape';

const elements = {
    nodes: [
        {
            "data": {
                "id": "f9c821f8-9d43-11e8-bbe4-1c6f65c3aae2",
                "internalId": "EIC_SC_RO10",
                "label": "SC RO10",
                "group": "g1",
                "type": "ro",
                "validityStart": "2015-12-31T23:00",
                "validityEnd": "2018-06-30T23:00",
                "title": "<h3> f9c821f8-9d43-11e8-bbe4-1c6f65c3aae2 </h3><ul class=\"tooltip-list\"><li>Validity start: 2015-12-31T23:00</li><li>Validity end: 2018-06-30T23:00</li></ul>",
                "typeFullName": "Regulation Object"
            }
        },
        {
            "data": {
                "id": "f9c8cf47-9d43-11e8-bbe4-1c6f65c3aae2",
                "internalId": "EIC_10YFI_1________U",
                "label": "FI",
                "type": "mba",
                "typeFullName": "Market Balance Area",
                "group": "g0",
                "title": "<h3> EIC_10YFI_1________U </h3>\n        <ul class=\"tooltip-list\">\n            <li>Validity start: 2015-01-01T00:00</li>\n            <li>Validity end: unlimited</li>\n        </ul>      \n        ",
                "validityStart": "2015-01-01T00:00",
                "validityEnd": "unlimited"
            }
        }
    ],
    edges: [
        {
            "data": {
                "source": "f9c821f8-9d43-11e8-bbe4-1c6f65c3aae2",
                "target": "f9c8cf47-9d43-11e8-bbe4-1c6f65c3aae2",
                "hiddenLabel": "2015-12-31T23:00 -- 2018-06-30T23:00",
                "validityChanges": false
            },
        },
    ]
};

export default class GraphComponentViewCy extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
        const cy = null
    }

    initCyInstance = (cy) => {
        this.cy = cy;

        cy.on('tap', 'node', function (evt) {
            var node = evt.target;
            console.log('tapped ', node.data());
            console.log('tapped ', node.id());

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
