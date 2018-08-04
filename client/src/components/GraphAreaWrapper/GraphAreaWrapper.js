import React, { Component } from 'react';
import GraphComponentView1 from '../GraphComponent/GraphComponentView1';
import GraphComponentView2 from '../GraphComponent/GraphComponentView2';
import CustomProgress from '../GuiElements/CustomProgress';
import moment from 'moment';
import CardWrapper from '../CardWrapper/CardWrapper'
import './GraphAreaWrapper.css';
import DatePicker from '../DatePicker/DatePicker';
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
            view: "1"
        };
    }

    componentDidMount() {
        const url = 'api' + this.props.location.pathname + this.props.location.search;
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityStart, 'YYYYMMDD'), selectedNode: data.queriedEntity },
                () => this.computeTimeBreaks()
            ));
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            const url = 'api' + this.props.location.pathname + this.props.location.search;
            fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityStart, 'YYYYMMDD'), selectedNode: data.queriedEntity },
                    () => this.computeTimeBreaks()
                ));
        }
    }

    computeTimeBreaks = () => {
        let newIntervals = new Set();
        const validityRangeStart = moment(this.state.graphData.config.range.validityStart);
        const validityRangeEnd = moment(this.state.graphData.config.range.validityEnd);
        if(validityRangeStart.isValid) newIntervals.add(this.state.graphData.config.range.validityStart)
        
        this.state.graphData.graph.nodes.forEach(node => {
            const validityStart = moment(node.validityStart);
            const validityEnd = moment(node.validityEnd);
            if(validityStart.isBetween(validityRangeStart, validityRangeEnd)) newIntervals.add(node.validityStart);
            if(validityEnd.isBetween(validityRangeStart, validityRangeEnd)) newIntervals.add(node.validityEnd);
        });
        this.setState({ timeBreaks: Array.from(newIntervals).sort() });
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
        if(len > 0) {
            let prevDate = moment(this.state.timeBreaks[0]);
            if(len > 1) {
                for(let i = 1; i < len; i++) {
                    const timeBreak = moment(this.state.timeBreaks[i]);
                    if(timeBreak.isBefore(this.state.selectedDate) && timeBreak.isAfter(prevDate)) {
                        prevDate = timeBreak;
                    }
                } 
            }
            this.setState({ selectedDate: prevDate });
        }
    }
  
    jumpToNextBreak = () => {
        const len = this.state.timeBreaks.length;
        if(len > 0) {
            let nextDate = moment(this.state.timeBreaks[len-1]);
            if(len > 1) {
                for(let i = 1; i < len; i++) {
                    const timeBreak = moment(this.state.timeBreaks[i]);
                    if(timeBreak.isAfter(this.state.selectedDate) && timeBreak.isBefore(nextDate)) {
                        nextDate = timeBreak;
                    }
                } 
            }
            this.setState({ selectedDate: nextDate });
        }
    }

    render() {

        //const validityStart = this.props.location.search.validityStart.;
        //const validityEnd = this.props.location.search.validityEnd.toString();
        console.log('graphwrapper state', this.state);
        //console.log(this.props.location.pathname+this.props.location.search);
        let graphComponent = null;
        let cardComponent = null;
        let datePickerComponent = null;
        let progressComponent = null;

        if (Object.keys(this.state.graphData).length === 0 && this.state.graphData.constructor === Object) {
            progressComponent = (<div className="progress-container"><CustomProgress className={"progress"} /></div>)
        } else {
            if (this.state.view === "1") {
                graphComponent = <GraphComponentView1 data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />
            } else {
                graphComponent = <GraphComponentView2 data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />

                datePickerComponent = <DatePicker getSelectedDate={this.getSelectedDate}
                    jumpToPreviousBreak={this.jumpToPreviousBreak}
                    jumpToNextBreak={this.jumpToNextBreak}
                    selectedDate={this.state.selectedDate}
                    validityStart={this.state.graphData.config.range.validityStart}
                    validityEnd={this.state.graphData.config.range.validityEnd} />
            }
            cardComponent = <CardWrapper selectedNode={this.state.selectedNode} />

        }
        return (
            <div className="base-container">
                {progressComponent}
                <div className="left-gui-elements">
                    <SettingsWrapper getSelectedView={this.getSelectedView} />
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