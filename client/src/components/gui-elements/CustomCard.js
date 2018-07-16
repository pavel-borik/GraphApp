import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    minWidth: 400,
    maxWidth: 400
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

class CustomCard extends PureComponent {

  render() {
    const { classes } = this.props;
    const entityData = this.props.data;
    console.log('awfgawe', entityData)
    const entityDetailKeys = Object.keys(entityData.detail);
    const entityDetailValues = Object.keys(entityData.detail).map(key => entityData.detail[key]);
    let detailElements = [];
    let actionElements = [];

    entityData.basic_info.actions.map(action => {
      const button = <Button size="small" color="primary" href={action.url}>{action.type}</Button>
      actionElements.push(button);
    });

    for (var i = 0; i < entityDetailKeys.length; i++) {
      if (entityDetailValues[i] === null) continue;
      const listItem = <li key={i} >{entityDetailKeys[i]}: {entityDetailValues[i]} </li>
      detailElements.push(listItem);
    }

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Entity information:
          </Typography>
            <Typography variant="headline" component="h2">
              {entityData.basic_info.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {entityData.basic_info.type}
            </Typography>
            <Typography component="p">
              {detailElements}
            </Typography>
          </CardContent>
          <CardActions>
            {actionElements}
          </CardActions>
        </Card>
      </div>
    );
  }
}

CustomCard.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object
};

export default withStyles(styles)(CustomCard);