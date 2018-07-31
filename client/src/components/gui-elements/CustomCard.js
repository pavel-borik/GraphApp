import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {

  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  uldetail: {
    listStyleType: 'none',
    padding:0,
    margin:0
  }
};

class CustomCard extends PureComponent {

  render() {
    const { classes, header, actions, detail } = this.props;
    const entityDetailKeys = Object.keys(detail);
    const entityDetailValues = Object.keys(detail).map(key => detail[key]);
    let detailElements = [];
    let actionElements = [];

    actions.forEach(action => {
      const button = <Button size="small" color="primary" href={action.url}>{action.name}</Button>
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
              {header.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {header.type}
            </Typography>
              <ul className={classes.uldetail}>
                {detailElements}
              </ul>
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