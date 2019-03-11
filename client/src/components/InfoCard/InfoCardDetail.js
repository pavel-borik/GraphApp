import React, { Component, Fragment } from 'react';
import { withStyles, CircularProgress, Button } from '@material-ui/core';

class InfoCardDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queriedEntity: {},
      isLoading: false
    };
  }

  componentDidMount() {
    const { selectedNode, isInfoIncluded } = this.props;
    if (isInfoIncluded) {
      this.setState({ queriedEntity: selectedNode });
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedNode, isInfoIncluded } = this.props;
    const { internalId, type } = selectedNode;
    if (prevProps.selectedNode.internalId !== internalId) {
      if (!isInfoIncluded) {
        this.setState({ isLoading: true });
        fetch(`${process.env.REACT_APP_API}/getdetail?id=${internalId}&type=${type}`)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Something went wrong');
          })
          .then(res => this.setState({ queriedEntity: res.queriedEntity, isLoading: false }));
      } else {
        this.setState({ queriedEntity: selectedNode });
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { queriedEntity, isLoading } = this.state;
    let actionsComponent = null;
    if (Object.prototype.hasOwnProperty.call(queriedEntity, 'actions')) {
      actionsComponent = queriedEntity.actions.map(action => (
        <Button
          className={classes.button}
          key={`${action.name}_${action.url}`}
          variant="outlined"
          size="small"
          color="primary"
          href={action.url}
        >
          {action.name}
        </Button>
      ));
    }

    return (
      <Fragment>
        {isLoading === true ? (
          <Fragment>
            <CircularProgress />
          </Fragment>
        ) : (
          <Fragment>
            <div className="detail" dangerouslySetInnerHTML={{ __html: queriedEntity.detail }} />
            <div className="actions-container">{actionsComponent}</div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const styles = {
  button: {
    marginRight: 5
  }
};

export default withStyles(styles)(InfoCardDetail);
