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
        console.log(this.props.hasOwnProperty('basic_info'));
        if (this.props.selectedNode.hasOwnProperty('basic_info')) {
            if (prevProps.selectedNode.basic_info.internal_id !== this.props.selectedNode.basic_info.internal_id) {
            const url = 'api/getdetail?' + 'id=' + this.props.selectedNode.basic_info.internal_id + '&type=' + this.props.selectedNode.basic_info.type;
            fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(nodeDetailData => this.setState({ nodeDetail: nodeDetailData.queried_entity }));
            }
        } else {
            if (prevProps.selectedNode.id !== this.props.selectedNode.id) {
                console.log('prevprops', prevProps)
                console.log('thisprops', this.props)
                const url = 'api/getdetail?' + 'id=' + this.props.selectedNode.id + '&type=' + this.props.selectedNode.type;
                fetch(url)
                    .then((res) => {
                        if (res.ok) {
                            return res.json();
                        } else {
                            throw new Error('Something went wrong');
                        }
                    })
                    .then(nodeDetailData => this.setState({ nodeDetail: nodeDetailData.queried_entity }));
            }
        }
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.nodeDetail)[0] !== "error" ? <CustomCard data={this.state.nodeDetail} /> : null}
            </div>
        )
    }
}

CardWrapper.propTypes = {
    selectedNode: PropTypes.object,
};


export default CardWrapper;