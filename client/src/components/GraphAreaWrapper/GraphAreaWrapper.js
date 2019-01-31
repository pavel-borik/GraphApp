import React, { Component } from 'react';
import moment from 'moment';
import './GraphAreaWrapper.css';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import SettingsWrapper from '../SettingsWrapper/SettingsWrapper';
import EnhancedDatePicker from '../DatePicker/EnhancedDatePicker';
import InfoCard from '../InfoCard/InfoCard';
import CustomProgress from '../GuiElements/CustomProgress';
import GraphViewMoment from '../GraphComponent/GraphViewMoment';
import GraphViewTimeFrame from '../GraphComponent/GraphViewTimeFrame';

class GraphAreaWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: {},
      selectedNode: {},
      selectedDate: {},
      timeBreaks: [],
      view: 'timeFrameView',
      isLoading: false,
      expanded: true
    };
  }

  componentDidMount() {
    const { location } = this.props;
    this.setState({ isLoading: true });
    fetch(`${process.env.REACT_APP_API}${location.pathname}${location.search}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Something went wrong');
      })
      .then(data =>
        this.setState(
          {
            graphData: data,
            selectedDate: moment(data.config.range.validityStart),
            selectedNode: data.queriedEntity,
            isLoading: false
          },
          () => this.computeTimeBreaks()
        )
      );
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location.search !== prevProps.location.search) {
      this.setState({ isLoading: true });
      fetch(`${process.env.REACT_APP_API}${location.pathname}${location.search}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Something went wrong');
        })
        .then(data =>
          this.setState(
            {
              graphData: data,
              selectedDate: moment(data.config.range.validityStart),
              selectedNode: data.queriedEntity,
              isLoading: false
            },
            () => this.computeTimeBreaks()
          )
        );
    }
  }

  /**
   * Function looks for validity changes of all entities during the basic queried validity range of relationships.
   * Time breaks are stored in an array of momemnt objects sorted by date.
   */
  computeTimeBreaks = () => {
    const { graphData } = this.state;
    const newTimeBreaks = new Set();
    const validityRangeStart = moment(graphData.config.range.validityStart);
    const validityRangeEnd = moment(graphData.config.range.validityEnd);
    if (validityRangeStart.isValid) {
      newTimeBreaks.add(graphData.config.range.validityStart);
    }

    let validityStart;
    let validityEnd;
    graphData.graph.edges.forEach(edge => {
      validityStart = moment(edge.validityStart);
      validityEnd = edge.validityEnd === 'unlimited' ? null : moment(edge.validityEnd);
      if (validityStart !== undefined && validityStart !== null) {
        if (validityStart.isBetween(validityRangeStart, validityRangeEnd))
          newTimeBreaks.add(edge.validityStart);
      }

      if (validityEnd !== undefined && validityEnd !== null) {
        if (validityEnd.isBetween(validityRangeStart, validityRangeEnd))
          newTimeBreaks.add(edge.validityEnd);
      }
    });
    const newTimeBreaksAsMoments = Array.from(newTimeBreaks)
      .map(i => {
        return moment(i);
      })
      .sort((a, b) => a.diff(b));

    this.setState({ timeBreaks: newTimeBreaksAsMoments });
  };

  /**
   * Retrieves the node object when user clicks on it in any of the graph view component.
   */
  getSelectedNode = node => {
    this.setState({ selectedNode: node });
  };

  /**
   * Retrieves the selected date when using the Moment graph view.
   */
  getSelectedDate = date => {
    this.setState({ selectedDate: date });
  };

  /**
   * Retrieves the selected graph view - Moment or Time frame.
   */
  getSelectedView = selectedView => {
    this.setState({ view: selectedView });
  };

  /**
   * Creates new URL and redirects when user queries new relationships' validity range.
   * Uses the History object from React router
   */
  processNewDateRange = (newStartDate, newEndDate) => {
    const { graphData } = this.state;
    const { location, history } = this.props;
    if (
      newStartDate.format('YYYYMMDDTHHmm') !== graphData.config.range.validityStart ||
      newEndDate.format('YYYYMMDDTHHmm') !== graphData.config.range.validityEnd
    ) {
      const { search } = location;
      const newUrl =
        location.pathname +
        search
          .replace(/validityStart=\w{13}/, `validityStart=${newStartDate.format('YYYYMMDDTHHmm')}`)
          .replace(/validityEnd=\w{13}/, `validityEnd=${newEndDate.format('YYYYMMDDTHHmm')}`);
      history.push(newUrl);
    }
  };

  /**
   * Controls whether the Settings panel is collapsed or not.
   */
  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;
    const {
      graphData,
      isLoading,
      view,
      selectedDate,
      timeBreaks,
      expanded,
      selectedNode
    } = this.state;
    let graphComponent = null;
    let cardComponent = null;
    let datePickerComponent = null;
    let progressComponent = null;
    let settingsComponent = null;

    if (Object.keys(graphData).length === 0 && graphData.constructor === Object) {
      progressComponent = (
        <div className="progress-container">
          <CustomProgress className="progress" />
        </div>
      );
    } else {
      if (isLoading === true)
        progressComponent = (
          <div className="progress-container">
            <CustomProgress className="progress" />
          </div>
        );

      if (view === 'timeFrameView') {
        graphComponent = (
          <GraphViewTimeFrame
            data={graphData}
            selectedDate={selectedDate}
            getSelectedNode={this.getSelectedNode}
          />
        );
      } else {
        graphComponent = (
          <GraphViewMoment
            data={graphData}
            selectedDate={selectedDate}
            getSelectedNode={this.getSelectedNode}
          />
        );

        datePickerComponent = (
          <EnhancedDatePicker
            getSelectedDate={this.getSelectedDate}
            jumpToPreviousBreak={this.jumpToPreviousBreak}
            jumpToNextBreak={this.jumpToNextBreak}
            selectedDate={selectedDate}
            validityStart={graphData.config.range.validityStart}
            validityEnd={graphData.config.range.validityEnd}
            timeBreaks={timeBreaks}
          />
        );
      }
      settingsComponent = (
        <Paper elevation={1}>
          <div className="settingsHeader">
            <Typography variant="title" component="h3" className={classes.title}>
              {'Settings'}
            </Typography>
            <IconButton
              className={classnames(
                classes.expand,
                {
                  [classes.expandOpen]: expanded
                },
                classes.iconButton
              )}
              onClick={this.handleExpandClick}
              aria-expanded={expanded}
              aria-label="Show more"
              style={{ width: 40, height: 40 }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </div>

          <Collapse in={expanded} timeout="auto">
            <SettingsWrapper
              processNewDateRange={this.processNewDateRange}
              getSelectedView={this.getSelectedView}
              validityStart={graphData.config.range.validityStart}
              validityEnd={graphData.config.range.validityEnd}
            />

            <Fade in={view === 'momentView'}>
              <div className="datepicker-container">{datePickerComponent}</div>
            </Fade>
          </Collapse>
        </Paper>
      );

      cardComponent = <InfoCard selectedNode={selectedNode} />;
    }

    return (
      <div className="base-container">
        {progressComponent}
        <div className="left-gui-elements">
          {settingsComponent}
          <div className="card-container">{cardComponent}</div>
        </div>
        <div className="graph-container">{graphComponent}</div>
      </div>
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

export default withStyles(styles)(GraphAreaWrapper);
