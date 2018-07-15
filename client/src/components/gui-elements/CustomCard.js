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
    const entityDataKeys = Object.keys(entityData);
    const entityDataValues = Object.keys(entityData).map(key => entityData[key]);
    let infoElements = [];
    let actionElements = [];
    
    for (var i = 0; i < entityDataKeys.length; i++) {
      if(entityDataKeys[i] === "actions") {
        entityDataValues[i].map(action => {
          const button = <Button size="small" color="primary" href={action.url}>{action.type}</Button>
          actionElements.push(button);
        });
        continue;
      }
      if (entityDataValues[i] === null || entityDataKeys[i] === "type") continue;
      const listItem = <li key={i} >{entityDataKeys[i]}: {entityDataValues[i]} </li>
      infoElements.push(listItem);
    }

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Entity information:
          </Typography>
            <Typography variant="headline" component="h2">
              {entityData.Name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {entityData.type}
            </Typography>
            <Typography component="p">
              {infoElements}
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