import React, { Component } from 'react'
import IconButton from '@material-ui/core/IconButton';
import CheckCircle from '@material-ui/icons/CheckCircle';
import HelpOutline from '@material-ui/icons/HelpOutline';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import './SettingsWrapper.css'
import ValidityRangeSettings from './ValidityRangeSettings';
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';


const tooltipText = <div>Time frame view shows all the entities in a relationship during the specified validity range.<br />
    If the relationship between two entities changes within this validity range, the link is colored red. <br /><br />
    Moment view shows the relationships valid in a specified moment.<br />
</div>;

class SettingsWrapper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedView: "timeFrameView",
            startDate: moment(this.props.validityStart),
            endDate: moment(this.props.validityEnd)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.validityStart !== this.props.validityStart || prevProps.validityEnd !== this.props.validityEnd) {
            this.setState({ startDate: moment(this.props.validityStart), endDate: moment(this.props.validityEnd) });
        }
    }

    /**
     * Handles the change of graph view in the radio group.
     */
    handleRadioChange = (event) => {
        const selectedViewName = event.target.value;
        this.props.getSelectedView(selectedViewName);
        this.setState({ selectedView: selectedViewName });
    }

    handleChangeStart = (newStartDate) => {
        this.setState({ startDate: newStartDate })
    }

    handleChangeEnd = (newEndDate) => {
        this.setState({ endDate: newEndDate })
    }

    /**
     * Sends the newly selected relationships' validity range to the parent component
     * where the URL change and redirect are executed.
     */
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
                            <ValidityRangeSettings
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                handleChangeStart={this.handleChangeStart}
                                handleChangeEnd={this.handleChangeEnd} />

                            <IconButton
                                disabled={moment(this.props.validityStart).isSame(this.state.startDate) &&
                                    moment(this.props.validityEnd).isSame(this.state.endDate)}
                                onClick={this.confirmNewDateRange}
                                color="inherit" aria-label="Menu"
                                style={{ width: 40, height: 40 }}>
                                <CheckCircle />
                            </IconButton>
                        </div>
                    </FormControl>
                </div>

                <div className="view-choice-form">
                    <FormControl>
                        <div className="view-choice-label">
                            <FormLabel component="legend" focused={false}>Choose view </FormLabel>
                            <Tooltip title={tooltipText}>
                                <HelpOutline style={{ width: 20, height: 20 }} />
                            </Tooltip>
                        </div>

                        <RadioGroup
                            row
                            aria-label="view"
                            name="view"
                            value={this.state.selectedView}
                            onChange={this.handleRadioChange}>

                            <FormControlLabel
                                value="timeFrameView"
                                control={<Radio />}
                                label="Time Frame" />
                            <FormControlLabel
                                value="momentView"
                                control={<Radio />}
                                label="Moment" />

                        </RadioGroup>
                    </FormControl>

                </div>
            </div>
        )
    }
}

export default SettingsWrapper;