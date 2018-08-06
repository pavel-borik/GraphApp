import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import 'react-datepicker/dist/react-datepicker.min.css';

// CSS Modules, react-datepicker-cssmodules.css
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';
const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    height: '40px',
    width: '40px',
  },
});

class CustomDatePicker extends React.Component {

  handleChange = (date) => {
    this.props.getSelectedDate(date);
  }

  decreaseDate = () => {
    const newDate = this.props.selectedDate.clone().subtract(1, 'd');
    this.props.getSelectedDate(newDate);
  }

  increaseDate = () => {
     const newDate = this.props.selectedDate.clone().add(1, 'd');
     this.props.getSelectedDate(newDate);
  }

  render() {
    const { classes } = this.props;
    const minValidity = moment(this.props.validityStart, "YYYYMMDD");
    const maxValidity = moment(this.props.validityEnd, "YYYYMMDD");
    return (
      <div className={classes.root}>
        <IconButton className={classes.button} aria-label="Previous break" onClick={this.props.jumpToPreviousBreak}>
          <ArrowLeft />
        </IconButton>
        <IconButton className={classes.button} aria-label="Decrease date" disabled={this.props.selectedDate.clone().subtract(1, 'd').isBefore(minValidity, 'd') ? true : false} onClick={this.decreaseDate}>
          <ArrowDown />
        </IconButton>
        <DatePicker 
          className="form-control"
          selected={this.props.selectedDate}
          onChange={this.handleChange}
          minDate={minValidity}
          maxDate={maxValidity}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat="YYYY-MM-DD HH:mm"
          timeCaption="Time"
          placeholderText="Select a date"
        />
        <IconButton className={classes.button} aria-label="Increase date" disabled={this.props.selectedDate.clone().add(1, 'd').isAfter(maxValidity, 'd') ? true : false} onClick={this.increaseDate}>
          <ArrowUp />
        </IconButton>
        <IconButton className={classes.button} aria-label="Next break" onClick={this.props.jumpToNextBreak}>
          <ArrowRight />
        </IconButton>
      </div>
    )
  }
}

CustomDatePicker.propTypes = {
  selectedDate: PropTypes.object,
};

CustomDatePicker.defaultProps = {
  selectedDate: moment()
};

export default withStyles(styles)(CustomDatePicker);