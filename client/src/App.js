import React, { Component } from 'react';
import './App.css';
import NavBar from './components/navbar/NavBar';
import GraphWrapper from './components/graph-wrapper/GraphWrapper';
import CustomButton from './components/gui-elements/CustomButton';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {
  state = {
    url: '/api/countries/NO/relationships',
    counter: 1,
  }

  changeUrl = () => {
    this.setState({ counter: (this.state.counter + 1) % 5 }, () => {
      switch (this.state.counter) {
        case 0: this.setState({ url: '/api/regulationobjects/EIC_MR_RO204/relationships' }); break;
        case 1: this.setState({ url: '/api/countries/NO/relationships' }); break;
        case 2: this.setState({ url: '/api/marketbalanceareas/EIC_10Y1001A1001A44P/relationships' }); break;
        case 3: this.setState({ url: '/api/retailers/EIC_RE01/relationships' }); break;
        case 4: this.setState({ url: '/api/marketbalanceareas/EIC_10YFI_1________U/relationships' }); break;
        case 4: this.setState({
          url: '/api/getData?id=EIC_SC_MBA101&type=mba&validityFrom=01012017&validityTo=30122017&view=ro,mga,tso,country'
        }); break;
      }
    });

    console.log(this.state.url);
  }
  render() {
    const GraphWrapperWithProps = (props) => {
      return (
        <GraphWrapper
          url={this.state.url}
          {...props}
        />
      );
    }
    return (
      <Router>
        <div className="App">
          <div>
            <NavBar />
          </div>
          <div className="Buttondiv" >
            {/*<CustomButton onClick={this.changeUrl} name={'Change entity'} />*/}
            <Link className="link" to="/getData?id=EIC_SC_MBA101&type=mba&validityFrom=01012017&validityTo=30122017&view=ro,mga,tso,country">Link 1</Link>
            <Link className="link" to="/getData?id=EIC_SC_MBA101&type=mba&validityFrom=01012017&validityTo=30122017&view=ro,mga,tso">Link 2</Link>
          </div>
          <div className="Graphdiv">
            <Route path="/getdata" render={GraphWrapperWithProps} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
