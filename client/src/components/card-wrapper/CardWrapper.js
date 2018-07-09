import React, { Component } from 'react';
import CustomCard from '../gui-elements/CustomCard';
import PropTypes from 'prop-types';

class CardWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queriedentity: {},
        };
    }

    componentDidMount() {
        this.setState({ queriedentity: this.props.queriedentity });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.queriedentity.id !== this.props.queriedentity.id) {
            const url = 'api/getdetail?' + 'id=' + this.props.queriedentity.id + '&type=' + this.props.queriedentity.type;
            fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(queriedentity => this.setState(queriedentity));
        }
    }

    render() {
        return (
            <div>
                <CustomCard data={this.state.queriedentity} />
            </div>
        )
    }
}

CardWrapper.propTypes = {
    queriedentity: PropTypes.object,
};


export default CardWrapper;