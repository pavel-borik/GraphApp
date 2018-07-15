import React, { Component } from 'react';
import GraphVis from '../graph-elements/Graph';
import CustomProgress from '../gui-elements/CustomProgress';
import moment from 'moment';
import CardWrapper from '../card-wrapper/CardWrapper'
import './GraphWrapper.css';
import CustomDatePicker from '../gui-elements/CustomDatePicker';

class GraphWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graphData: {},
            selectedDate: {},
            selectedNode: {},
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
            .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validityfrom, 'DDMMYYYY'), selectedNode: data.queriedentity })
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
                .then(graphData => this.setState({ graphData })
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
        console.log('graphwrapper state',this.state);
        //console.log(this.props.location.pathname+this.props.location.search);
        let graphComponent = null;
        let cardComponent = null;
        let datePickerComponent = null;
        if (Object.keys(this.state.graphData).length === 0 && this.state.graphData.constructor === Object) {
            graphComponent = <CustomProgress className={"progress"} />
        } else {
            graphComponent = <GraphVis data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />
            cardComponent = <CardWrapper selectedNode={this.state.selectedNode} />
            datePickerComponent = <CustomDatePicker getSelectedDate={this.getSelectedDate}
                                    selectedDate={this.state.selectedDate}
                                    validityFrom={this.state.graphData.config.range.validityfrom}
                                    validityTo={this.state.graphData.config.range.validityto} />
        }
        return (
            <div>
                <div className="left-gui-elements">
                    <div className="datepicker-container">
                        {datePickerComponent}
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