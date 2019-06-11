/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link, Redirect } from 'react-router-dom';
import RegisterStudent from './RegisterStudent';
import EditStudent from './EditStudent';
import RegisterInstructor from './RegisterInstructor';
import EditInstructor from './EditInstructor';
import NavBar from './NavBar';
import './DashboardAdministrator.css';

function LinkTab(props) {
  return <Tab component={Link} {...props} />;
}

class DashboardAdministrator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dashboardTab: 0,
      type: String(JSON.parse(localStorage.getItem('type'))),
    };
  }

  handleChange = (_event, value) => {
    this.setState({ dashboardTab: value });
  };

  render() {
    const { dashboardTab } = this.state;
    let Page = '';
    if (this.state.type === 'admin') {
      Page = (
        <React.Fragment>
          <Tabs
            variant="fullWidth"
            indicatorColor="primary"
            value={dashboardTab}
            onChange={this.handleChange}
          >
            <LinkTab label="Aluno" to={`${this.props.match.url}/student`} />
            <LinkTab label="Instrutor" to={`${this.props.match.url}/instructor`} />
          </Tabs>
          <div className="container mt-3">
            {this.state.dashboardTab === 0 && <RegisterStudent />}
            {this.state.dashboardTab === 1 && <RegisterInstructor />}
          </div>
          <div className="container mt-3">
            {this.state.dashboardTab === 0 && <EditStudent />}
            {this.state.dashboardTab === 1 && <EditInstructor />}
          </div>
        </React.Fragment>
      );
    } else {
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

export default DashboardAdministrator;
