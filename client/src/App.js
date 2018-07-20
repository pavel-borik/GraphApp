import React, { Component } from 'react';
import './App.css';
import NavBar from './components/navbar/NavBar';
import GraphWrapper from './components/graph-wrapper/GraphWrapper';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    const GraphWrapperWithProps = (props) => {
      return (
        <GraphWrapper {...props} />
      );
    }

    return (
      <Router>
        <div className="App">
          <div>
            <NavBar />
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
