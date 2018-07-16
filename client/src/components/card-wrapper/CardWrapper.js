import React, { Component } from 'react';
import CustomCard from '../gui-elements/CustomCard';
import PropTypes from 'prop-types';

class CardWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedNode: this.props.selectedNode,
        };
    }

    componentDidMount() {
        console.log('prp',this.props)
        this.setState({ selectedNode: this.props.selectedNode });
    }

    componentDidUpdate(prevProps) {
        console.log('updatecall')
        console.log(this.props)
        console.log('----------')
        if (prevProps.selectedNode.id !== this.props.selectedNode.id) {
            console.log('updating')
            const url = 'api/getdetail?' + 'id=' + this.props.selectedNode.id + '&type=' + this.props.selectedNode.type;
            fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then( nodeDetail => this.setState( {selectedNode: nodeDetail.queried_entity} ));
        }
    }

    render() {
        console.log('sleel', this.state.selectedNode)
        return (
            <div>
                <CustomCard data={this.state.selectedNode} />
            </div>
        )
    }
}

CardWrapper.propTypes = {
    selectedNode: PropTypes.object,
};


export default CardWrapper;