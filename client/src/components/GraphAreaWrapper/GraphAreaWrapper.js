import React, { Component } from 'react';
import GraphComponent from '../GraphComponent/GraphComponent';
import CustomProgress from '../GuiElements/CustomProgress';
import moment from 'moment';
import CardWrapper from '../CardWrapper/CardWrapper'
import './GraphAreaWrapper.css';
import DatePicker from '../DatePicker/DatePicker';
import { Link } from 'react-router-dom';


class GraphAreaWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graphData: {},
            selectedDate: {},
            selectedNode: {},
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
            .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityFrom, 'YYYYMMDD'), selectedNode: data.queriedEntity })
            );
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
                .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityFrom, 'YYYYMMDD'), selectedNode: data.queriedEntity })
                );
        }

    }

    getSelectedNode = (node) => {
        this.setState({ selectedNode: node })
    }

    getSelectedDate = (date) => {
        this.setState({ selectedDate: date })
    }

    render() {

        //const validityFrom = this.props.location.search.validityFrom.;
        //const validityTo = this.props.location.search.validityTo.toString();
        console.log('graphwrapper state', this.state);
        //console.log(this.props.location.pathname+this.props.location.search);
        let graphComponent = null;
        let cardComponent = null;
        let datePickerComponent = null;
        let progressComponent = null;

        if (Object.keys(this.state.graphData).length === 0 && this.state.graphData.constructor === Object) {
            progressComponent = (<div className="progress-container"><CustomProgress className={"progress"}/></div>) 
        } else {
            graphComponent = <GraphComponent data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />
            cardComponent = <CardWrapper selectedNode={this.state.selectedNode} />
            datePickerComponent = <DatePicker getSelectedDate={this.getSelectedDate}
                selectedDate={this.state.selectedDate}
                validityFrom={this.state.graphData.config.range.validityFrom}
                validityTo={this.state.graphData.config.range.validityTo} />
        }
        return (
            <div className="base-container">
                {progressComponent}
                <div className="left-gui-elements">
                    <div className="datepicker-container">
                        {datePickerComponent}
                    </div>
                    <div className="card-container">
                        {cardComponent}
                        <Link className="link" to="/getdata?id=EIC_10YFI_1________U&type=mba&validityFrom=20160101&validityTo=20180101&view=ro,mga,tso,country">Link 1</Link>
                        <Link className="link" to="/getdata?id=EIC_10YFI_1________U&type=mba&validityFrom=20160101&validityTo=20180101&view=ro,mga,tso">Link 2</Link>
                        <Link className="link" to="/getdata?id=EIC_10YNO_3________J&type=mba&validityFrom=20160101&validityTo=20180101&view=ro,mga,tso,country">Link 3</Link>
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