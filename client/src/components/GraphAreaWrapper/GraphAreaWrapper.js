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
        };
    }

    componentDidMount() {
        const url = 'api' + this.props.location.pathname + this.props.location.search;
        this.setState({isLoading: true});
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityStart, 'YYYYMMDD'), selectedNode: data.queriedEntity, isLoading: false },
                () => this.computeTimeBreaks()
            ));
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            this.setState({isLoading: true});
            const url = 'api' + this.props.location.pathname + this.props.location.search;
            fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityStart, 'YYYYMMDD'), selectedNode: data.queriedEntity, isLoading: false },
                    () => this.computeTimeBreaks()
                ));
        }
    }

    computeTimeBreaks = () => {
        let newIntervals = new Set();
        const validityRangeStart = moment(this.state.graphData.config.range.validityStart);
        const validityRangeEnd = moment(this.state.graphData.config.range.validityEnd);
        if (validityRangeStart.isValid) newIntervals.add(this.state.graphData.config.range.validityStart)

        this.state.graphData.graph.nodes.forEach(node => {
            const validityStart = moment(node.validityStart);
            const validityEnd = moment(node.validityEnd);
            if (validityStart.isBetween(validityRangeStart, validityRangeEnd)) newIntervals.add(node.validityStart);
            if (validityEnd.isBetween(validityRangeStart, validityRangeEnd)) newIntervals.add(node.validityEnd);
        });
        const intervalsAsMoments = Array.from(newIntervals).map(i => {
            return moment(i);
        }).sort((a, b) => b.isBefore(a));

        this.setState({ timeBreaks: intervalsAsMoments });
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

    jumpToPreviousBreak = () => {
        const len = this.state.timeBreaks.length;
        if (len > 0) {
            let prevDate = this.state.selectedDate;
            for (let i = len - 1; i >= 0; i--) {
                const timeBreak = this.state.timeBreaks[i];
                if (timeBreak.isBefore(this.state.selectedDate)) {
                    prevDate = timeBreak;
                    break;
                }
            }
            this.setState({ selectedDate: prevDate });
        }
    }

    jumpToNextBreak = () => {
        const len = this.state.timeBreaks.length;
        if (len > 0) {
            let nextDate = this.state.selectedDate;
            for (let i = 0; i < len; i++) {
                const timeBreak = this.state.timeBreaks[i];
                if (timeBreak.isAfter(this.state.selectedDate)) {
                    nextDate = timeBreak;
                    break;
                }
            }
            this.setState({ selectedDate: nextDate });
        }
    }

    processNewDateRange = (newStartDate, newEndDate) => {
        if (newStartDate.format("YYYYMMDD") !== this.state.graphData.config.range.validityStart || 
            newEndDate.format("YYYYMMDD") !== this.state.graphData.config.range.validityEnd) {
            const search = this.props.location.search;
            const newUrl = this.props.location.pathname + search.replace(/validityStart=\d+/, `validityStart=${newStartDate.format("YYYYMMDD")}`)
                .replace(/validityEnd=\d+/, `validityEnd=${newEndDate.format("YYYYMMDD")}`);
            this.props.history.push(newUrl);
        }
    }

    render() {
        console.log('graphwrapper state', this.state);
        //console.log(this.props.location.pathname+this.props.location.search);
        let graphComponent = null;
        let cardComponent = null;
        let datePickerComponent = null;
        let progressComponent = null;
        let settingsComponent = null;

        if (Object.keys(this.state.graphData).length === 0 && this.state.graphData.constructor === Object) {
            progressComponent = (<div className="progress-container"><CustomProgress className={"progress"} /></div>)
        } else {
            if(this.state.isLoading === true) progressComponent = (<div className="progress-container"><CustomProgress className={"progress"} /></div>)

            if (this.state.view === "1") {
                graphComponent = <GraphComponentView1 data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />
            } else {
                graphComponent = <GraphComponentView2 data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />

                datePickerComponent = <EnhancedDatePicker getSelectedDate={this.getSelectedDate}
                    jumpToPreviousBreak={this.jumpToPreviousBreak}
                    jumpToNextBreak={this.jumpToNextBreak}
                    selectedDate={this.state.selectedDate}
                    validityStart={this.state.graphData.config.range.validityStart}
                    validityEnd={this.state.graphData.config.range.validityEnd}
                    timeBreaks={this.state.timeBreaks}
                    />
            }
            settingsComponent = <SettingsWrapper processNewDateRange={this.processNewDateRange} getSelectedView={this.getSelectedView} validityStart={this.state.graphData.config.range.validityStart}
                validityEnd={this.state.graphData.config.range.validityEnd} />
            cardComponent = <InfoCard selectedNode={this.state.selectedNode} />
        }

        return (
            <div className="base-container">
                {progressComponent}
                <div className="left-gui-elements">
                    {settingsComponent}
                    <div className="datepicker-container">
                        {datePickerComponent}
                    </div>
                    <div className="card-container">
                        {cardComponent}
                        <Link className="link" to="/getdata?id=EIC_10YFI_1________U&type=mba&validityStart=20150101&validityEnd=20180101&view=ro,mga,tso,country">Link 1</Link>
                        <Link className="link" to="/getdata?id=EIC_10YFI_1________U&type=mba&validityStart=20150101&validityEnd=20180101&view=ro,mga,tso">Link 2</Link>
                        <Link className="link" to="/getdata?id=EIC_10YNO_3________J&type=mba&validityStart=20150101&validityEnd=20180101&view=ro,mga,tso,country">Link 3</Link>
                    </div>
                </div>
                <div className="graph-container">
                    {graphComponent}
                </div>
            </div>
        )
    }
}

export default GraphAreaWrapper;