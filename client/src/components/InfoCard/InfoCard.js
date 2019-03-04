import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import InfoCardDetail from './InfoCardDetail';
import './InfoCard.css';
import { withStyles, Card, CardContent, Typography, Button } from '@material-ui/core';

class InfoCard extends PureComponent {
  render() {
    const { classes, selectedNode } = this.props;

    let detailComponent = null;
    if (
      Object.prototype.hasOwnProperty.call(selectedNode, 'detail') &&
      Object.prototype.hasOwnProperty.call(selectedNode, 'actions')
    ) {
      detailComponent = (
        <Fragment>
          <div className="detail" dangerouslySetInnerHTML={{ __html: selectedNode.detail }} />
          <div className="actions-container">
            {selectedNode.actions.map(a => {
              return (
                <Button
                  key={`id_${a.name}`}
                  className={classes.button}
                  variant="outlined"
                  size="small"
                  color="primary"
                  href={a.url}
                >
                  {a.name}
                </Button>
              );
            })}
          </div>
        </Fragment>
      );
    } else {
      detailComponent = (
        <InfoCardDetail internalId={selectedNode.internalId} type={selectedNode.type} />
      );
    }

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              {'Entity information:'}
            </Typography>
            <Typography variant="headline" component="h2">
              {selectedNode.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {selectedNode.typeFullName}
            </Typography>
            {detailComponent}
          </CardContent>
        </Card>
      </div>
    );
  }
}

InfoCard.propTypes = {
  classes: PropTypes.object
};

const styles = {
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  uldetail: {
    listStyleType: 'none',
    padding: 0,
    margin: 0
  },
  button: {
    marginRight: 5
  }
};

export default withStyles(styles)(InfoCard);
