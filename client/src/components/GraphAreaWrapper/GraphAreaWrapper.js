import React, { Component, Fragment } from 'react';
import moment from 'moment';
import GraphViewMoment from '../GraphComponent/GraphViewMoment';
import GraphViewTimeFrame from '../GraphComponent/GraphViewTimeFrame';
import InfoCard from '../InfoCard/InfoCard';
import SettingsCard from '../SettingsArea/SettingsCard';
import { CircularProgress } from '@material-ui/core';
import './GraphAreaWrapper.css';

class GraphAreaWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: {},
      selectedNode: {},
      selectedDate: {},
      timeBreaks: [],
      selectedView: 'timeFrameView',
      isLoading: false
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
    this.setState({ selectedView });
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

  render() {
    const { graphData, isLoading, selectedView, selectedDate, selectedNode } = this.state;
    let graphComponent = null;
    let cardComponent = null;
    let settingsComponent = null;
    let progressComponent = null;

    progressComponent = (
      <div className="progress-container">
        <CircularProgress />
      </div>
    );

    switch (selectedView) {
      case 'timeFrameView':
        graphComponent = (
          <GraphViewTimeFrame
            data={graphData}
            selectedDate={selectedDate}
            getSelectedNode={this.getSelectedNode}
          />
        );
        break;
      case 'momentView':
        graphComponent = (
          <GraphViewMoment
            data={graphData}
            selectedDate={selectedDate}
            getSelectedNode={this.getSelectedNode}
          />
        );
        break;
      default:
    }

    if (Object.keys(graphData).length > 0) {
      settingsComponent = (
        <SettingsCard
          processNewDateRange={this.processNewDateRange}
          getSelectedView={this.getSelectedView}
          getSelectedDate={this.getSelectedDate}
          {...this.state}
        />
      );
    }

    cardComponent = <InfoCard selectedNode={selectedNode} />;

    return (
      <div className="base-container">
        {isLoading && progressComponent}
        {Object.keys(graphData).length > 0 && (
          <Fragment>
            <div className="left-gui-elements">
              {settingsComponent}
              <div className="card-container">{cardComponent}</div>
            </div>
            <div className="graph-container">{graphComponent}</div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default GraphAreaWrapper;
