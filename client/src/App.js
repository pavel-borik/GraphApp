import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import GraphAreaWrapper from './components/GraphAreaWrapper/GraphAreaWrapper';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    const GraphAreaWrapperWithProps = (props) => {
      return (
        <GraphAreaWrapper {...props} />
      );
    }

    return (
      <Router>
        <div className="App">
          <div>
            <NavBar />
          </div>
          <div className="Graphdiv">
            <Route path="/getdata" render={GraphAreaWrapperWithProps} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
