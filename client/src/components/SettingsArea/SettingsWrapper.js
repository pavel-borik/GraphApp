import React, { Component, Fragment } from 'react';
import moment from 'moment';
import ValidityRangeSettings from './ValidityRangeSettings';
import EnhancedDatePicker from '../GuiElements/EnhancedDatePicker';
import {
  IconButton,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Fade
} from '@material-ui/core';
import { CheckCircle, HelpOutline } from '@material-ui/icons';
import './SettingsWrapper.css';

class SettingsWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(this.props.validityStart),
      endDate: moment(this.props.validityEnd)
    };
  }

  componentDidUpdate(prevProps) {
    const { validityStart, validityEnd } = this.props;
    if (prevProps.validityStart !== validityStart || prevProps.validityEnd !== validityEnd) {
      this.setState({
        startDate: moment(validityStart),
        endDate: moment(validityEnd)
      });
    }
  }

  /**
   * Handles the change of graph view in the radio group.
   */
  handleRadioChange = event => {
    const selectedViewName = event.target.value;
    this.props.getSelectedView(selectedViewName);
  };

  handleChangeStart = newStartDate => {
    this.setState({ startDate: newStartDate });
  };

  handleChangeEnd = newEndDate => {
    this.setState({ endDate: newEndDate });
  };

  /**
   * Sends the newly selected relationships' validity range to the parent component
   * where the URL change and redirect are executed.
   */
  confirmNewDateRange = () => {
    this.props.processNewDateRange(this.state.startDate, this.state.endDate);
  };

  render() {
    const { startDate, endDate } = this.state;
    const {
      validityStart,
      validityEnd,
      selectedView,
      selectedDate,
      timeBreaks,
      getSelectedDate
    } = this.props;

    const isMomentViewSelected = selectedView === 'momentView';

    const datePickerComponent = (
      <EnhancedDatePicker
        getSelectedDate={getSelectedDate}
        selectedDate={selectedDate}
        validityStart={validityStart}
        validityEnd={validityEnd}
        timeBreaks={timeBreaks}
      />
    );
    return (
      <Fragment>
        <div className="validity-range-settings-container">
          <FormControl>
            <FormLabel component="legend">Select validity range of relationships</FormLabel>
            <div className="range-form-container">
              <ValidityRangeSettings
                startDate={startDate}
                endDate={endDate}
                handleChangeStart={this.handleChangeStart}
                handleChangeEnd={this.handleChangeEnd}
              />

              <IconButton
                disabled={
                  moment(validityStart).isSame(startDate) && moment(validityEnd).isSame(endDate)
                }
                onClick={this.confirmNewDateRange}
                color="inherit"
                aria-label="Menu"
                style={{ width: 40, height: 40 }}
              >
                <CheckCircle />
              </IconButton>
            </div>
          </FormControl>
        </div>

        <div className="view-choice-form">
          <FormControl>
            <div className="view-choice-label">
              <FormLabel component="legend" focused={false}>
                {'Choose view'}
              </FormLabel>
              <Tooltip title={tooltipText}>
                <HelpOutline style={{ width: 20, height: 20 }} />
              </Tooltip>
            </div>

            <RadioGroup
              row
              aria-label="view"
              name="view"
              value={selectedView}
              onChange={this.handleRadioChange}
            >
              <FormControlLabel value="timeFrameView" control={<Radio />} label="Time Frame" />
              <FormControlLabel value="momentView" control={<Radio />} label="Moment" />
            </RadioGroup>
          </FormControl>
        </div>
        {isMomentViewSelected && (
          <Fade in={isMomentViewSelected}>
            <div className="datepicker-container">{datePickerComponent}</div>
          </Fade>
        )}
      </Fragment>
    );
  }
}

const tooltipText = (
  <div>
    {
      'Time frame view shows all the entities in a relationship during the specified validity range.'
    }
    <br />
    {
      'If the relationship between two entities changes within this validity range, the link is colored red.'
    }
    <br />
    <br />
    {'Moment view shows the relationships valid in a specified moment.'}
    <br />
  </div>
);

export default SettingsWrapper;
