import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      InputID: 1,
      name: '',
      institution: '',
      graduationDate: '',
      // licenseNumber: '',
      // birth_date: '',
      // courseName: '',
      // address: '',
    };

    // why do we need this?
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    // Get all instructors
    const url = 'http://localhost:8888/api/instructors/' + this.state.InputID;

    axios.get(url).then(response =>
      this.setState({
        name: response.data.name,
        institution: response.data.institution,
        graduationDate: response.data.graduation_date,
        // license_number: response.data.license_number,
        // birth_date: response.data.birth_date,
        // course_name: response.data.course_name,
        // address: response.data.address,
      })
    );
  }

  handleChange(event) {
    this.setState({ InputID: event.target.value });
  }

  render() {
    return (
      <div className="margin">
        <label htmlFor="number">
          ID:
          <input
            type="number"
            value={this.state.InputID}
            onChange={this.handleChange}
          />
        </label>
        <div>
          <button
            type="button"
            className="button btn btn-primary"
            onClick={this.handleClick}
          >
            Get instructors
          </button>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Nome</h5>
            <p className="card-text">{this.state.name}</p>
            <h5 className="card-title">Insituição</h5>
            <p className="card-text">{this.state.institution}</p>
            <h5 className="card-title">Data de Formação</h5>
            <p className="card-text">{this.state.graduationDate}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
