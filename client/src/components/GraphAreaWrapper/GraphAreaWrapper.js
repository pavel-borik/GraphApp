import React, { Component } from 'react';
import GraphComponentView1 from '../GraphComponent/GraphComponentView1';
import GraphComponentView2 from '../GraphComponent/GraphComponentView2';
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
        marginLeft: 5,
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
            view: "1",
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
            const url = 'api' + this.props.location.pathname + this.props.location.search;
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

    computeTimeBreaks = () => {
        let newTimeBreaks = new Set();
        const validityRangeStart = moment(this.state.graphData.config.range.validityStart);
        const validityRangeEnd = moment(this.state.graphData.config.range.validityEnd);
        if (validityRangeStart.isValid) newTimeBreaks.add(this.state.graphData.config.range.validityStart)

        let validityStart;
        let validityEnd;
        this.state.graphData.graph.edges.forEach(edge => {
            validityStart = moment(edge.validityStart);
            validityEnd = moment(edge.validityEnd);
            if (validityStart.isBetween(validityRangeStart, validityRangeEnd)) newTimeBreaks.add(edge.validityStart);
            if (validityEnd.isBetween(validityRangeStart, validityRangeEnd)) newTimeBreaks.add(edge.validityEnd);
        });
        let newTimeBreaksAsMoments = Array.from(newTimeBreaks).map(i => {
            return moment(i);
        }).sort((a, b) => a.diff(b));

        this.setState({ timeBreaks: newTimeBreaksAsMoments });
    }

    getSelectedNode = (node) => {
        this.setState({ selectedNode: node })
    }

    getSelectedDate = (date) => {
        this.setState({ selectedDate: date })
    }

    getSelectedView = (event) => {
        this.setState({ view: event.target.value });
    }

    processNewDateRange = (newStartDate, newEndDate) => {
        if (newStartDate.format("YYYYMMDDTHHmm") !== this.state.graphData.config.range.validityStart ||
            newEndDate.format("YYYYMMDDTHHmm") !== this.state.graphData.config.range.validityEnd) {
            const search = this.props.location.search;
            const newUrl = this.props.location.pathname + search.replace(/validityStart=\w{13}/, `validityStart=${newStartDate.format("YYYYMMDDTHHmm")}`)
                .replace(/validityEnd=\w{13}/, `validityEnd=${newEndDate.format("YYYYMMDDTHHmm")}`);
            this.props.history.push(newUrl);
        }
    }

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        console.log('graphwrapper state', this.state);
        //console.log(this.props.location.pathname+this.props.location.search);
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

            if (this.state.view === "1") {
                graphComponent = <GraphComponentView1 data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />
            } else {
                graphComponent = <GraphComponentView2 data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />

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
                        <SettingsWrapper processNewDateRange={this.processNewDateRange} getSelectedView={this.getSelectedView} validityStart={this.state.graphData.config.range.validityStart}
                            validityEnd={this.state.graphData.config.range.validityEnd} />

                        <Fade in={this.state.view === "2"}>
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
                        <Link className="link" to="/getdata?id=EIC_10YFI_1________U&type=mba&validityStart=20150101T0000&validityEnd=20180101T0000&view=ro,mga,tso,country">Link 1</Link>
                        <Link className="link" to="/getdata?id=EIC_10YFI_1________U&type=mba&validityStart=20150101T0000&validityEnd=20180101T0000&view=ro,mga,tso">Link 2</Link>
                        <Link className="link" to="/getdata?id=EIC_10YNO_3________J&type=mba&validityStart=20150101T0000&validityEnd=20180101T0000&view=ro,mga,tso,country">Link 3</Link>
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