import React, { Component } from 'react';
import CustomCard from '../gui-elements/CustomCard';
import PropTypes from 'prop-types';

class CardWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeDetail: this.props.selectedNode,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedNode.id !== this.props.selectedNode.id) {
           // console.log('prevprops', prevProps)
            //console.log('thisprops', this.props)
            const url = 'api/getdetail?' + 'id=' + this.props.selectedNode.id + '&type=' + this.props.selectedNode.type;
            fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(nodeDetailData => this.setState({ nodeDetail: nodeDetailData.queriedEntity }));
        }

    }

    render() {
        const header = {
            "name": this.state.nodeDetail.name,
            "type": this.state.nodeDetail.typeFull
        };
        const actions = this.state.nodeDetail.actions;
        const detail = this.state.nodeDetail.detail;

        return (
            <div>
                {Object.keys(this.state.nodeDetail)[0] !== "error" ? <CustomCard header={header} actions={actions} detail={detail} /> : null}
            </div>
        )
    }
}

CardWrapper.propTypes = {
    selectedNode: PropTypes.object,
};


export default CardWrapper;