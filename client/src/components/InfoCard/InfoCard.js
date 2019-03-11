import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import InfoCardDetail from './InfoCardDetail';
import { withStyles, Card, CardContent, Typography } from '@material-ui/core';
import './InfoCard.css';

class InfoCard extends PureComponent {
  render() {
    const { classes, selectedNode } = this.props;

    const isInfoIncluded =
      Object.prototype.hasOwnProperty.call(selectedNode, 'detail') &&
      Object.prototype.hasOwnProperty.call(selectedNode, 'actions');

    return (
      <Fragment>
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
            <InfoCardDetail selectedNode={selectedNode} isInfoIncluded={isInfoIncluded} />
          </CardContent>
        </Card>
      </Fragment>
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
  }
};

export default withStyles(styles)(InfoCard);
