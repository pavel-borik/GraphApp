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
import Tooltip from '@material-ui/core/Tooltip';
import 'react-datepicker/dist/react-datepicker.min.css';

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

class EnhancedDatePicker extends React.Component {

    /**
     * Sends the user-selected date to the GraphAreaWrapper component.
     */
    handleChange = (date) => {
        this.props.getSelectedDate(date);
    }

    /**
     * Sends the user-decreased date to the GraphAreaWrapper component.
     */
    decreaseDate = () => {
        const newDate = this.props.selectedDate.clone().subtract(1, 'd');
        this.props.getSelectedDate(newDate);
    }

    /**
     * Sends the user-increased date to the GraphAreaWrapper component.
     */
    increaseDate = () => {
        const newDate = this.props.selectedDate.clone().add(1, 'd');
        this.props.getSelectedDate(newDate);
    }

    /**
     * Handles the jump to previous time break after button click.
     * Uses timeBreaks array computed in the GraphAreaWrapper component
     */
    jumpToPreviousBreak = () => {
        const len = this.props.timeBreaks.length;
        if (len > 0) {
            let prevDate = this.props.selectedDate;
            for (let i = len - 1; i >= 0; i--) {
                const timeBreak = this.props.timeBreaks[i];
                if (timeBreak.isBefore(this.props.selectedDate)) {
                    prevDate = timeBreak;
                    break;
                }
            }
            this.props.getSelectedDate(prevDate);
        }
    }

    /**
     * Handles the jump to next time break after button click.
     * Uses timeBreaks array computed in the GraphAreaWrapper component
     */
    jumpToNextBreak = () => {
        const len = this.props.timeBreaks.length;
        if (len > 0) {
            let nextDate = this.props.selectedDate;
            for (let i = 0; i < len; i++) {
                const timeBreak = this.props.timeBreaks[i];
                if (timeBreak.isAfter(this.props.selectedDate)) {
                    nextDate = timeBreak;
                    break;
                }
            }
            this.props.getSelectedDate(nextDate);
        }
    }

    render() {
        const { classes } = this.props;
        const minValidity = moment(this.props.validityStart);
        const maxValidity = moment(this.props.validityEnd);
        return (
            <div className={classes.root}>
                <Tooltip title={"Jump to the previous relationship change"}>
                    <div>
                        <IconButton
                            className={classes.button}
                            aria-label="Previous break"
                            onClick={this.jumpToPreviousBreak}
                            disabled={this.props.selectedDate.isSameOrBefore(this.props.timeBreaks[0]) ? true : false}>
                            <ArrowLeft />
                        </IconButton>
                    </div>
                </Tooltip>

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
                    dateFormat="MMM DD YYYY HH:mm"
                    timeCaption="Time"
                    placeholderText="Select a date"
                />
                <IconButton className={classes.button} aria-label="Increase date" disabled={this.props.selectedDate.clone().add(1, 'd').isAfter(maxValidity, 'd') ? true : false} onClick={this.increaseDate}>
                    <ArrowUp />
                </IconButton>
                <Tooltip title={"Jump to the next relationship change"}>
                    <div>
                        <IconButton
                            className={classes.button}
                            aria-label="Next break"
                            onClick={this.jumpToNextBreak}
                            disabled={this.props.selectedDate.isSameOrAfter(this.props.timeBreaks[this.props.timeBreaks.length - 1]) ? true : false}>
                            <ArrowRight />
                        </IconButton>
                    </div>
                </Tooltip>
            </div>
        )
    }
}

EnhancedDatePicker.propTypes = {
    selectedDate: PropTypes.object.isRequired,
    timeBreaks: PropTypes.array.isRequired,
    validityStart: PropTypes.string.isRequired,
    validityEnd: PropTypes.string.isRequired,

};

EnhancedDatePicker.defaultProps = {
    selectedDate: moment(),
    timeBreaks: [moment()]
};

export default withStyles(styles)(EnhancedDatePicker);