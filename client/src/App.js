import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

class App extends Component {
  render() {
    const DashboardWithProps = props => {
      return <Dashboard {...props} />;
    };

    return (
      <Router>
        <div className="App">
          <div className="Graphdiv">
            <Route path="/getdata" render={DashboardWithProps} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
