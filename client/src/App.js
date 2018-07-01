import React, { Component } from 'react';
import './App.css';
import NavBar from './components/navbar/NavBar';
import GraphWrapper from './components/graph-wrapper/GraphWrapper';
import CustomButton from './components/gui-elements/CustomButton';

class App extends Component {
  state = {
    url: '/api/countries/NO/relationships',
    counter: 1,
  }

  changeUrl = () => {
    this.setState({ counter: (this.state.counter + 1) % 5 }, () => {
      switch (this.state.counter) {
        case 0: this.setState({ url: 'api/regulationobjects/EIC_MR_RO204/relationships' }); break;
        case 1: this.setState({ url: '/api/countries/NO/relationships' }); break;
        case 2: this.setState({ url: '/api/marketbalanceareas/EIC_10Y1001A1001A44P/relationships' }); break;
        case 3: this.setState({ url: '/api/retailers/EIC_RE01/relationships' }); break;
        case 4: this.setState({ url: '/api/marketbalanceareas/EIC_10YFI_1________U/relationships' }); break;
      }
    });

    console.log(this.state.url);
  }
  render() {
    return (
      <div className="App">
        <div>
          <NavBar />
        </div>
        <div className="Buttondiv" >
          <CustomButton onClick={this.changeUrl} name={'Change entity'} />
        </div>
        <div className="Graphdiv">
          <GraphWrapper url={this.state.url} />
        </div>

      </div>
    );
  }
}

export default App;
