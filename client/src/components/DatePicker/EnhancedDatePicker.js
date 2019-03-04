import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { withStyles, Tooltip, IconButton } from '@material-ui/core';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import 'react-datepicker/dist/react-datepicker.min.css';

class EnhancedDatePicker extends React.Component {
  /**
   * Sends the user-selected date to the GraphAreaWrapper component.
   */
  handleChange = date => {
    this.props.getSelectedDate(date);
  };

  /**
   * Sends the user-decreased date to the GraphAreaWrapper component.
   */
  decreaseDate = () => {
    const newDate = this.props.selectedDate.clone().subtract(1, 'd');
    this.props.getSelectedDate(newDate);
  };

  /**
   * Sends the user-increased date to the GraphAreaWrapper component.
   */
  increaseDate = () => {
    const newDate = this.props.selectedDate.clone().add(1, 'd');
    this.props.getSelectedDate(newDate);
  };

  /**
   * Handles the jump to previous time break after button click.
   * Uses timeBreaks array computed in the GraphAreaWrapper component
   */
  jumpToPreviousBreak = () => {
    const { timeBreaks, selectedDate } = this.props;
    const len = timeBreaks.length;
    if (len > 0) {
      let prevDate = selectedDate;
      for (let i = len - 1; i >= 0; i--) {
        const timeBreak = timeBreaks[i];
        if (timeBreak.isBefore(selectedDate)) {
          prevDate = timeBreak;
          break;
        }
      }
      this.props.getSelectedDate(prevDate);
    }
  };

  /**
   * Handles the jump to next time break after button click.
   * Uses timeBreaks array computed in the GraphAreaWrapper component
   */
  jumpToNextBreak = () => {
    const { timeBreaks, selectedDate } = this.props;
    const len = timeBreaks.length;
    if (len > 0) {
      let nextDate = selectedDate;
      for (let i = 0; i < len; i++) {
        const timeBreak = timeBreaks[i];
        if (timeBreak.isAfter(selectedDate)) {
          nextDate = timeBreak;
          break;
        }
      }
      this.props.getSelectedDate(nextDate);
    }
  };

  render() {
    const { classes, validityStart, validityEnd, selectedDate, timeBreaks } = this.props;
    const minValidity = moment(validityStart);
    const maxValidity = moment(validityEnd);
    return (
      <div className={classes.root}>
        <Tooltip title="Jump to the previous relationship change">
          <div>
            <IconButton
              className={classes.button}
              aria-label="Previous break"
              onClick={this.jumpToPreviousBreak}
              disabled={!!selectedDate.isSameOrBefore(timeBreaks[0])}
            >
              <ArrowLeft />
            </IconButton>
          </div>
        </Tooltip>

        <IconButton
          className={classes.button}
          aria-label="Decrease date"
          disabled={
            !!selectedDate
              .clone()
              .subtract(1, 'd')
              .isBefore(minValidity, 'd')
          }
          onClick={this.decreaseDate}
        >
          <ArrowDown />
        </IconButton>
        <DatePicker
          className="form-control"
          selected={selectedDate}
          onChange={this.handleChange}
          minDate={minValidity}
          maxDate={maxValidity}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat="MMM DD YYYY HH:mm"
          timeCaption="Time"
          placeholderText="Select a date"
        />
        <IconButton
          className={classes.button}
          aria-label="Increase date"
          disabled={
            !!selectedDate
              .clone()
              .add(1, 'd')
              .isAfter(maxValidity, 'd')
          }
          onClick={this.increaseDate}
        >
          <ArrowUp />
        </IconButton>
        <Tooltip title="Jump to the next relationship change">
          <div>
            <IconButton
              className={classes.button}
              aria-label="Next break"
              onClick={this.jumpToNextBreak}
              disabled={!!selectedDate.isSameOrAfter(timeBreaks[timeBreaks.length - 1])}
            >
              <ArrowRight />
            </IconButton>
          </div>
        </Tooltip>
      </div>
    );
  }
}

EnhancedDatePicker.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  timeBreaks: PropTypes.array.isRequired,
  validityStart: PropTypes.string.isRequired,
  validityEnd: PropTypes.string.isRequired
};

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    height: '40px',
    width: '40px'
  }
});

export default withStyles(styles)(EnhancedDatePicker);
