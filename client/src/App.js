import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GraphAreaWrapper from './components/GraphAreaWrapper/GraphAreaWrapper';

class App extends Component {
  render() {
    const GraphAreaWrapperWithProps = props => {
      return <GraphAreaWrapper {...props} />;
    };

    return (
      <Router>
        <div className="App">
          <div className="Graphdiv">
            <Route path="/getdata" render={GraphAreaWrapperWithProps} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
