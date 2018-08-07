import React, { Component } from 'react'
import CustomProgress from '../GuiElements/CustomProgress'
import Button from '@material-ui/core/Button';
import { withStyles } from '../../../node_modules/@material-ui/core';

const styles = {
    button: {
        marginRight: 5
    },
};

class InfoCardDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            queriedEntity: {},
            isLoading: false
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        const url = 'api/getdetail?' + 'id=' + this.props.internalId + '&type=' + this.props.type;
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(nodeDetailData => this.setState({ queriedEntity: nodeDetailData.queriedEntity, isLoading: false }));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.internalId !== this.props.internalId) {
            this.setState({ isLoading: true });
            const url = 'api/getdetail?' + 'id=' + this.props.internalId + '&type=' + this.props.type;
            fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(nodeDetailData => this.setState({ queriedEntity: nodeDetailData.queriedEntity, isLoading: false }));
        }
    }

    render() {
        const { classes } = this.props;
        let actionsComponent = null;
        if (this.state.queriedEntity.hasOwnProperty("actions")) {
            actionsComponent = this.state.queriedEntity.actions.map(a => {
                return <Button className={classes.button} variant="outlined" size="small" color="primary" href={a.url}>{a.name}</Button>
            })
        }

        return (
            <div>
                {this.state.isLoading === true ? <CustomProgress className={"progress"} /> : (
                    <div>
                        <div className="detail" dangerouslySetInnerHTML={{ __html: this.state.queriedEntity.detail }}></div>
                        <div className="actions-container">
                            {actionsComponent}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default withStyles(styles)(InfoCardDetail);
