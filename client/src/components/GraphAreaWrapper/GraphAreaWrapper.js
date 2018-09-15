import React, { Component } from 'react';
import GraphViewTimeFrame from '../GraphComponent/GraphViewTimeFrame';
import GraphViewMoment from '../GraphComponent/GraphViewMoment';
import CustomProgress from '../GuiElements/CustomProgress';
import moment from 'moment';
import InfoCard from '../InfoCard/InfoCard'
import './GraphAreaWrapper.css';
import EnhancedDatePicker from '../DatePicker/EnhancedDatePicker';
import { Link } from 'react-router-dom';
import SettingsWrapper from '../SettingsWrapper/SettingsWrapper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = theme => ({
    iconButton: {
        "&:hover": {
            backgroundColor: "transparent"
        },
    },
    title: {
        marginLeft: 10,
        marginTop: 5
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
});

class GraphAreaWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graphData: {},
            selectedNode: {},
            selectedDate: {},
            timeBreaks: [],
            view: "timeFrameView",
            isLoading: false,
            expanded: true,
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(`${process.env.REACT_APP_API}${this.props.location.pathname}${this.props.location.search}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityStart), selectedNode: data.queriedEntity, isLoading: false },
                () => this.computeTimeBreaks()
            ));
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            this.setState({ isLoading: true });
            fetch(`${process.env.REACT_APP_API}${this.props.location.pathname}${this.props.location.search}`)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityStart), selectedNode: data.queriedEntity, isLoading: false },
                    () => this.computeTimeBreaks()
                ));
        }
    }

    /**
     * Function looks for validity changes of all entities during the basic queried validity range of relationships.
     * Time breaks are stored in an array of momemnt objects sorted by date.
     */
    computeTimeBreaks = () => {
        let newTimeBreaks = new Set();
        const validityRangeStart = moment(this.state.graphData.config.range.validityStart);
        const validityRangeEnd = moment(this.state.graphData.config.range.validityEnd);
        if (validityRangeStart.isValid) newTimeBreaks.add(this.state.graphData.config.range.validityStart)

        let validityStart;
        let validityEnd;
        this.state.graphData.graph.edges.forEach(edge => {
            validityStart = moment(edge.validityStart);
            validityEnd = edge.validityEnd === "unlimited" ? null : moment(edge.validityEnd);
            if (validityStart !== undefined && validityStart !== null) {
                if (validityStart.isBetween(validityRangeStart, validityRangeEnd)) newTimeBreaks.add(edge.validityStart);    
            }
            
            if (validityEnd !== undefined && validityEnd !== null) {
                if (validityEnd.isBetween(validityRangeStart, validityRangeEnd)) newTimeBreaks.add(edge.validityEnd);
            }
        });
        let newTimeBreaksAsMoments = Array.from(newTimeBreaks).map(i => {
            return moment(i);
        }).sort((a, b) => a.diff(b));

        this.setState({ timeBreaks: newTimeBreaksAsMoments });
    }

    /**
     * Retrieves the node object when user clicks on it in any of the graph view component.
     */
    getSelectedNode = (node) => {
        this.setState({ selectedNode: node })
    }

    /**
     * Retrieves the selected date when using the Moment graph view.
     */
    getSelectedDate = (date) => {
        this.setState({ selectedDate: date })
    }

    /**
     * Retrieves the selected graph view - Moment or Time frame.
     */
    getSelectedView = (selectedView) => {
        this.setState({ view: selectedView });
    }

    /**
     * Creates new URL and redirects when user queries new relationships' validity range.
     * Uses the History object from React router
     */
    processNewDateRange = (newStartDate, newEndDate) => {
        if (newStartDate.format("YYYYMMDDTHHmm") !== this.state.graphData.config.range.validityStart ||
            newEndDate.format("YYYYMMDDTHHmm") !== this.state.graphData.config.range.validityEnd) {
            const search = this.props.location.search;
            const newUrl = this.props.location.pathname + search.replace(/validityStart=\w{13}/, `validityStart=${newStartDate.format("YYYYMMDDTHHmm")}`)
                .replace(/validityEnd=\w{13}/, `validityEnd=${newEndDate.format("YYYYMMDDTHHmm")}`);
            this.props.history.push(newUrl);
        }
    }

    /**
     * Controls whether the Settings panel is collapsed or not.
     */
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { classes } = this.props;
        let graphComponent = null;
        let cardComponent = null;
        let datePickerComponent = null;
        let progressComponent = null;
        let settingsComponent = null;

        if (Object.keys(this.state.graphData).length === 0 && this.state.graphData.constructor === Object) {
            progressComponent = (<div className="progress-container"><CustomProgress className={"progress"} /></div>)
        } else {
            if (this.state.isLoading === true) progressComponent = (<div className="progress-container"><CustomProgress className={"progress"} /></div>)

            if (this.state.view === "timeFrameView") {
                graphComponent = <GraphViewTimeFrame data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />
            } else {
                graphComponent = <GraphViewMoment data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />

                datePickerComponent =
                    <EnhancedDatePicker getSelectedDate={this.getSelectedDate}
                        jumpToPreviousBreak={this.jumpToPreviousBreak}
                        jumpToNextBreak={this.jumpToNextBreak}
                        selectedDate={this.state.selectedDate}
                        validityStart={this.state.graphData.config.range.validityStart}
                        validityEnd={this.state.graphData.config.range.validityEnd}
                        timeBreaks={this.state.timeBreaks}
                    />
            }
            settingsComponent =
                <Paper elevation={1}>
                    <div className="settingsHeader">
                        <Typography variant="title" component="h3" className={classes.title}>
                            Settings
                    </Typography>
                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            }, classes.iconButton)}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                            style={{ width: 40, height: 40 }}>
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>

                    <Collapse in={this.state.expanded} timeout="auto" >
                        <SettingsWrapper 
                            processNewDateRange={this.processNewDateRange} 
                            getSelectedView={this.getSelectedView} 
                            validityStart={this.state.graphData.config.range.validityStart}
                            validityEnd={this.state.graphData.config.range.validityEnd} />

                        <Fade in={this.state.view === "momentView"}>
                            <div className="datepicker-container">
                                {datePickerComponent}
                            </div>
                        </Fade>
                    </Collapse>
                </Paper>

            cardComponent = <InfoCard selectedNode={this.state.selectedNode} />
        }

        return (
            <div className="base-container">
                {progressComponent}
                <div className="left-gui-elements">
                    {settingsComponent}
                    <div className="card-container">
                        {cardComponent}
                    </div>
                </div>
                <div className="graph-container">
                    {graphComponent}
                </div>
            </div >
        )
    }
}

export default withStyles(styles)(GraphAreaWrapper);