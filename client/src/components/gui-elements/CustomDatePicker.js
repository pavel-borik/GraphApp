import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import 'react-datepicker/dist/react-datepicker.min.css';

// CSS Modules, react-datepicker-cssmodules.css
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';
const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
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

  increaseDate = () => {
     const newDate = this.props.selectedDate.clone().add(1, 'd');
     this.props.getSelectedDate(newDate);
}

  decreaseDate = () => {
    const newDate = this.props.selectedDate.clone().subtract(1, 'd');
    this.props.getSelectedDate(newDate);
  }

  render() {
    const { classes } = this.props;
    const minValidity = moment(this.props.validityFrom, "DDMMYYYY");
    const maxValidity = moment(this.props.validityTo, "DDMMYYYY");
    return (
      <div className={classes.root}>
        <IconButton className={classes.button} aria-label="Decrease date" disabled={this.props.selectedDate.isSame(minValidity) ? true : false} onClick={this.decreaseDate}>
          <ArrowLeft />
        </IconButton>
        <DatePicker 
          selected={this.props.selectedDate}
          onChange={this.handleChange}
          minDate={minValidity}
          maxDate={maxValidity}
          className="form-control"
          dateFormat="YYYY/MM/DD"
          placeholderText="Select a date"
        />
        <IconButton className={classes.button} aria-label="Increase date" disabled={this.props.selectedDate.isSame(maxValidity) ? true : false} onClick={this.increaseDate}>
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