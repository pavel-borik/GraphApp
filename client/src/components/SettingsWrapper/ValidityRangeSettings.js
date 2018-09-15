import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import './SettingsWrapper.css'
import { Portal } from 'react-portal'

/**
 * Handles correct visualization of the react-datepicker popper in front of all other components.
 */
const CalendarContainer = ({ children }) => {
    return (
        <Portal container={document.getElementById('calendar-portal')}> {children}</Portal>
    )
}

class ValidityRangeSettings extends Component {
    /**
     * Handles the change in the validity range start date picker
     */
    handleChangeStart = (newStartDate) => {
        this.props.handleChangeStart(newStartDate)
    }

    /**
     * Handles the change in the validity range end date picker
     */
    handleChangeEnd = (newEndDate) => {
        this.props.handleChangeEnd(newEndDate)
    }

    render() {
        return (
            <div className="datepickers-container">
                <div className="datepicker">
                    <DatePicker
                        className="form-control"
                        popperContainer={CalendarContainer}
                        selected={this.props.startDate}
                        selectsStart
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        dateFormat="MMM DD YYYY HH:mm"
                        showTimeSelect
                        timeCaption="Time"
                        maxDate={this.props.endDate}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                        onChange={this.handleChangeStart}
                    />
                </div>
                <div className="datepicker">
                    <DatePicker
                        className="form-control"
                        popperContainer={CalendarContainer}
                        selected={this.props.endDate}
                        selectsEnd
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        dateFormat="MMM DD YYYY HH:mm"
                        showTimeSelect
                        timeCaption="Time"
                        minDate={this.props.startDate}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                        onChange={this.handleChangeEnd}
                    />
                </div>
            </div>
        )
    }
}

export default ValidityRangeSettings;