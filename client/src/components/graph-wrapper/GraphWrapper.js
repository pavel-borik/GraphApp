import React, { Component } from 'react';
import GraphVis from '../graph-elements/Graph';
import CustomProgress from '../gui-elements/CustomProgress';
import moment from 'moment';
import CardWrapper from '../card-wrapper/CardWrapper'
import './GraphWrapper.css';
import CustomDatePicker from '../gui-elements/CustomDatePicker';
import { Link } from 'react-router-dom';


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
        const url = 'api' + this.props.location.pathname + this.props.location.search;
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validity_from, 'YYYYMMDD'), selectedNode: data.queried_entity })
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
                .then(data => this.setState({ graphData: data, selectedDate: moment(data.config.range.validity_from, 'YYYYMMDD'), selectedNode: data.queried_entity })
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
        if (Object.keys(this.state.graphData).length === 0 && this.state.graphData.constructor === Object) {
            graphComponent = <CustomProgress className={"progress"} />
        } else {
            graphComponent = <GraphVis data={this.state.graphData} selectedDate={this.state.selectedDate} getSelectedNode={this.getSelectedNode} />
            cardComponent = <CardWrapper selectedNode={this.state.selectedNode} />
            datePickerComponent = <CustomDatePicker getSelectedDate={this.getSelectedDate}
                selectedDate={this.state.selectedDate}
                validityFrom={this.state.graphData.config.range.validity_from}
                validityTo={this.state.graphData.config.range.validity_to} />
        }
        return (
            <div className="base-container">
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

export default GraphWrapper;