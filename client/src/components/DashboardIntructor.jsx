import React, { Component } from 'react';
import './NavBar.css';
import { Redirect } from 'react-router-dom';
import EvaluateLesson from './EvaluateLesson';
import NavBar from './NavBar';

class DashboardInstructor extends Component {
  constructor() {
    super();
    this.state = {
      type: String(JSON.parse(localStorage.getItem('type'))),
    };
  }

  render() {
    let Page = '';
    console.log(`Type: ${this.state.type}`);
    if (this.state.type === 'instructor') {
      console.log('Type == instructor');
      Page = <EvaluateLesson />;
    } else {
      console.log('Type != instructor');
      Page = <Redirect to="/unauthorized" />;
    }
    return (
      <React.Fragment>
        <NavBar />
        {Page}
      </React.Fragment>
    );
  }
}

export default DashboardInstructor;
