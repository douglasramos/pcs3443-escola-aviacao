import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './NavBar.css';
import ScheduleLesson from './ScheduleLesson';
import ListEditLessons from './ListEditLessons';
import NavBar from './NavBar';

class DashboardStudent extends Component {
  constructor() {
    super();
    this.state = {
      type: String(JSON.parse(localStorage.getItem('type'))),
    };
  }

  render() {
    let Page = '';
    console.log(`Type: ${this.state.type}`);
    if (this.state.type === 'student') {
      console.log('Type == student');
      Page = (
        <div>
          <ListEditLessons />
          <ScheduleLesson />
        </div>
      );
    } else {
      console.log('Type != student');
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

export default DashboardStudent;
