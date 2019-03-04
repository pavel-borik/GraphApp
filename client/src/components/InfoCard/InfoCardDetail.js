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
    const { internalId, type } = this.props;
    this.setState({ isLoading: true });
    fetch(`${process.env.REACT_APP_API}/getdetail?id=${internalId}&type=${type}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Something went wrong');
      })
      .then(nodeDetailData =>
        this.setState({ queriedEntity: nodeDetailData.queriedEntity, isLoading: false })
      );
  }

  componentDidUpdate(prevProps) {
    const { internalId, type } = this.props;
    if (prevProps.internalId !== internalId) {
      this.setState({ isLoading: true });
      fetch(`${process.env.REACT_APP_API}/getdetail?id=${internalId}&type=${type}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Something went wrong');
        })
        .then(nodeDetailData =>
          this.setState({ queriedEntity: nodeDetailData.queriedEntity, isLoading: false })
        );
    }
  }

  render() {
    const { classes } = this.props;
    const { queriedEntity, isLoading } = this.state;
    let actionsComponent = null;
    if (Object.prototype.hasOwnProperty.call(queriedEntity, 'actions')) {
      actionsComponent = queriedEntity.actions.map(a => {
        return (
          <Button
            className={classes.button}
            variant="outlined"
            size="small"
            color="primary"
            href={a.url}
          >
            {a.name}
          </Button>
        );
      });
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
