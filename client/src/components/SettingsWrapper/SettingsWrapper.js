import React, { Component } from 'react'
import IconButton from '@material-ui/core/IconButton';
import CheckCircle from '@material-ui/icons/CheckCircle';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import './SettingsWrapper.css'
import ValidityRangeSettings from './ValidityRangeSettings';
import moment from 'moment';

export default class SettingsWrapper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedView: "1",
            startDate: moment(this.props.validityStart),
            endDate: moment(this.props.validityEnd)
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.validityStart !== this.props.validityStart || prevProps.validityEnd !== this.props.validityEnd) {
            this.setState({startDate: moment(this.props.validityStart), endDate: moment(this.props.validityEnd)});
        }
    }

    getSelectedView = (view) => {
        this.props.getSelectedView(view);
    }

    handleRadioChange = (event) => {
        this.props.getSelectedView(event);
        this.setState({ selectedView: event.target.value });
    }
    
    handleChangeStart = (newStartDate) => {
        this.setState({ startDate: newStartDate })
    }

    handleChangeEnd = (newEndDate) => {
        this.setState({ endDate: newEndDate })
    }

    confirmNewDateRange = () => {
        this.props.processNewDateRange(this.state.startDate, this.state.endDate);
    }

    render() {
        return (
            <div>
                <div className="validity-range-settings-container">
                    <FormControl>
                        <FormLabel component="legend">Select validity range of relationships</FormLabel>
                        <div className="range-form-container">
                            <ValidityRangeSettings startDate={this.state.startDate}
                                endDate={this.state.endDate} handleChangeStart={this.handleChangeStart} handleChangeEnd={this.handleChangeEnd} />
                            <IconButton disabled={ moment(this.props.validityStart).isSame(this.state.startDate) && 
                                moment(this.props.validityEnd).isSame(this.state.endDate)} 
                                onClick={this.confirmNewDateRange} 
                                color="inherit" aria-label="Menu" 
                                style={{width:40, height:40}}>
                                <CheckCircle/>
                            </IconButton>
                        </div>
                    </FormControl>
                </div>

                <div className="container">
                    <FormControl>
                        <FormLabel component="legend">Choose view</FormLabel>
                        <RadioGroup
                            row
                            aria-label="view"
                            name="view"
                            value={this.state.selectedView}
                            onChange={this.handleRadioChange}>

                            <FormControlLabel value="1" control={<Radio />} label="Duration" />
                            <FormControlLabel value="2" control={<Radio />} label="Moment" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
        )
    }
}
