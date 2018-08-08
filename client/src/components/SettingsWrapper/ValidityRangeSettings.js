import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

export default class ValidityRangeSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }

    handleChangeStart = (newStartDate) => {
        this.props.handleChangeStart(newStartDate)
    }

    handleChangeEnd = (newEndDate) => {
        this.props.handleChangeEnd(newEndDate)
    }


    render() {
        return (
            <div className="datepickers-container">
                <div className="datepicker">
                    <DatePicker
                        className="form-control"
                        selected={this.props.startDate}
                        selectsStart
                        maxDate={this.props.endDate}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                        onChange={this.handleChangeStart}
                    />
                </div>
                <div className="datepicker">
                    <DatePicker
                        className="form-control"
                        selected={this.props.endDate}
                        selectsEnd
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