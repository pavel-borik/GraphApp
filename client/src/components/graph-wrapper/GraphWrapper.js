import React, { Component } from 'react';
import Graph from '../graph-elements/Graph';
import CustomProgress from '../gui-elements/CustomProgress';
import CustomSelect from '../gui-elements/CustomSelect';
import CardWrapper from '../card-wrapper/CardWrapper'
import './GraphWrapper.css';

class GraphWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graphdata: {},
            timeintervals: [],
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
       const url = 'api'+this.props.location.pathname+this.props.location.search;
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(data => this.setState({ graphdata:data, queriedentity: data.queriedentity  })
            );

        this.getTimeIntervals();
    }
    componentDidUpdate(prevProps) {
        //console.log('props',this.props)
        if (this.props.location.search !== prevProps.location.search) {
            const url = 'api'+this.props.location.pathname+this.props.location.search;
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
        this.setState({queriedentity: node})
    }

    render() {
        //console.log(this.state.graphdata);
        //console.log(this.props.location.pathname+this.props.location.search);
        if (Object.keys(this.state.graphdata).length === 0 && this.state.graphdata.constructor === Object) {
            var graphComponent = <CustomProgress className={"progress"} />
            var cardComponent = null;
        } else {
            graphComponent = <Graph data={this.state.graphdata} getSelectedNode={this.getSelectedNode}/>
            cardComponent = <CardWrapper queriedentity={this.state.queriedentity} />
        }
        return (
            <div>
                <div className="left-gui-elements">
                    <CustomSelect />
                    {cardComponent}
                </div>
                <div className="graph-div">
                    {graphComponent}
                </div>
            </div>
        )
    }
}

export default GraphWrapper;