import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.min.css';

// CSS Modules, react-datepicker-cssmodules.css
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class CustomDatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: moment(this.props.validityFrom, "DDMMYYYY"),
      minDate: moment(this.props.validityFrom, "DDMMYYYY"),
      maxDate: moment(this.props.validityTo, "DDMMYYYY")
    };
  }

  handleChange = (date) => {
    this.setState({
      startDate: date
    });
  }

  render() {
    return (
      <div className="input-group">
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          minDate={this.state.minDate}
          maxDate={this.state.maxDate}
          className="form-control"
        />
      </div>
    )
  }
}

export default CustomDatePicker;