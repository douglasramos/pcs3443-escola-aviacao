import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import RegisterInstructor from './RegisterInstructor';
import RegisterStudent from './RegisterStudent';

const registerType = {
  student: 1,
  instructor: 2,
};

class DashboardAministrator extends Component {
  constructor() {
    super();

    this.state = {
      registerType: null,
    };
  }

  changeTypeRegister = type => {
    this.setState({ registerType: type });
  };

  render() {
    return (
      <div className="container mt-3">
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.changeTypeRegister(registerType.student)}
          >
            Aluno
          </Button>
          <Button
            className="ml-3"
            variant="contained"
            style={{ backgroundColor: '#2cad58', color: 'white' }}
            onClick={() => this.changeTypeRegister(registerType.instructor)}
          >
            Instrutor
          </Button>
        </div>
        <div className="mt-5">
          {this.state.registerType === registerType.instructor ? (
            <RegisterInstructor />
          ) : (
            <RegisterStudent />
          )}
        </div>
      </div>
    );
  }
}

export default DashboardAministrator;
