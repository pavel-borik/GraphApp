import React, { Component } from 'react';
import Graph from '../graph-elements/Graph';
import CustomProgress from '../gui-elements/CustomProgress';
import moment from 'moment';
import CardWrapper from '../card-wrapper/CardWrapper'
import './GraphWrapper.css';
import CustomDatePicker from '../gui-elements/CustomDatePicker';

class GraphWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graphdata: {},
            selecteddate: moment(),
            queriedentity: {},
        };
    }

    componentDidMount() {
        /*
        '/api/regulationobjects/EIC_MR_RO204/relationships'
        '/api/countries/NO/relationships'
        '/api/productionunits/EIC_MR_PU201/relationships'
        '/api/marketbalanceareas/EIC_10Y1001A1001A44P/relationships'
        '/api/marketbalanceareas/EIC_SC_MBA101/relationships'
        '/api/marketbalanceareas/EIC_10YFI_1________U/relationships'
        '/api/retailers/EIC_RE01/relationships'
        */
        const url = 'api' + this.props.location.pathname + this.props.location.search;
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(data => this.setState({ graphdata: data, queriedentity: data.queriedentity })
            );

        this.getTimeIntervals();
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
                .then(graphdata => this.setState({ graphdata })
                );

            this.getTimeIntervals();
        }

    }
    getTimeIntervals() {
        //console.log("fce", this.state.graphdata);
    }

    getSelectedNode = (node) => {
        this.setState({ queriedentity: node })
    }

    getSelectedDate = (date) => {
        this.setState({ selecteddate: date })
    }

    render() {

        //const validityFrom = this.props.location.search.validityFrom.;
        //const validityTo = this.props.location.search.validityTo.toString();
        console.log(this.state.graphdata);
        //console.log(this.props.location.pathname+this.props.location.search);
        let graphComponent = null;
        let cardComponent = null;
        let datePickerComponent = null;
        if (Object.keys(this.state.graphdata).length === 0 && this.state.graphdata.constructor === Object) {
            graphComponent = <CustomProgress className={"progress"} />
        } else {
            graphComponent = <Graph data={this.state.graphdata} selectedDate={this.state.selecteddate} getSelectedNode={this.getSelectedNode} />
            cardComponent = <CardWrapper queriedentity={this.state.queriedentity} />
            datePickerComponent = <CustomDatePicker getSelectedDate={this.getSelectedDate}
                                    validityFrom={this.state.graphdata.config.range.validityfrom}
                                    validityTo={this.state.graphdata.config.range.validityto} />
        }
        return (
            <div>
                <div className="left-gui-elements">
                    <div className="datepicker-container">
                        <span>Validity: &nbsp; </span> {datePickerComponent}
                    </div>
                    <div className="card-container">
                        {cardComponent}
                    </div>
                </div>
                <div className="graph-div">
                    {graphComponent}
                </div>
            </div>
        )
    }
}

export default GraphWrapper;