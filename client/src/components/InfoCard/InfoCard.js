import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import './InfoCard.css'
import InfoCardDetail from './InfoCardDetail';

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
    padding: 0,
    margin: 0
  }
};

class InfoCard extends PureComponent {

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Entity information:
            </Typography>
            <Typography variant="headline" component="h2">
              {this.props.selectedNode.label ? this.props.selectedNode.label : this.props.selectedNode.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {this.props.selectedNode.type}
            </Typography>
              {this.props.selectedNode.detail ? <div className="detail" dangerouslySetInnerHTML={{ __html: this.props.selectedNode.detail }}></div> : <InfoCardDetail internalId={this.props.selectedNode.internalId} type={this.props.selectedNode.type} />}
          </CardContent>
          <CardActions>
            {/* {actionElements} */}
          </CardActions>
        </Card>
      </div>
    );
  }
}

InfoCard.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object
};

export default withStyles(styles)(InfoCard);