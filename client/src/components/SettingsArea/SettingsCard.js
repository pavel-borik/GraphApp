import React, { Component } from 'react';
import classnames from 'classnames';
import ValiditySettingsArea from './ValiditySettingsArea';
import { Paper, Collapse, Typography, IconButton, withStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class SettingsCard extends Component {
  state = {
    expanded: true
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, selectedView, selectedDate, timeBreaks } = this.props;
    return (
      <Paper elevation={1}>
        <div className="settingsHeader">
          <Typography variant="title" component="h3" className={classes.title}>
            {'Settings'}
          </Typography>
          <IconButton
            className={classnames(
              classes.expand,
              {
                [classes.expandOpen]: this.state.expanded
              },
              classes.iconButton
            )}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
            style={{ width: 40, height: 40 }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </div>

        <Collapse in={this.state.expanded} timeout="auto">
          <ValiditySettingsArea
            selectedView={selectedView}
            selectedDate={selectedDate}
            timeBreaks={timeBreaks}
            validityStart={this.props.graphData.config.range.validityStart}
            validityEnd={this.props.graphData.config.range.validityEnd}
            processNewDateRange={this.props.processNewDateRange}
            getSelectedView={this.props.getSelectedView}
            getSelectedDate={this.props.getSelectedDate}
          />
        </Collapse>
      </Paper>
    );
  }
}

const styles = theme => ({
  iconButton: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  title: {
    marginLeft: 10,
    marginTop: 5
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
});

export default withStyles(styles)(SettingsCard);
