/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

class RegisterInstructor extends Component {
  constructor() {
    super();

    this.state = {
      // controle dos dados
      value: '',
      name: 'Fábio Fusimoto Pires',
      institution: 'Escola Politécnica',
      graduationDate: '2021-01-01',
      licenseNumber: 9853294,
      birthDate: '1998-10-28',
      courseName: 'Engenharia Elétrica',
      address: 'Avenida Alberto Byington, 2306',
    };
  }

  submitNewInstructor = () => {
    // Post a new instructor
    const url = 'http://localhost:8888/api/instructors/';

    axios
      .post(url, {
        // eslint-disable-next-line react/destructuring-assignment
        name: this.state.name,
        institution: this.state.institution,
        graduationDate: this.state.graduation_date,
        licenseNumber: this.state.license_number,
        birthDate: this.state.birth_date,
        courseName: this.state.course_name,
        address: this.state.address,
      })
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(response.data.endpoint);
      });
  };

  displayStateOnConsole = () => {
    // for debugging purposes
    // eslint-disable-next-line no-console
    console.log(this.state);
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const instructor = this.state;
    return (
      <div className="margin">
        <Button
          variant="contained"
          color="secondary"
          onClick={this.displayStateOnConsole}
        >
          Mostrar estado no console
        </Button>
        <form>
          <Grid container spacing={16} lg={13}>
            <Grid item xs={3}>
              <TextField
                id="TextField_name"
                label="Nome"
                className="TextField"
                type="text"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                value={instructor.value}
                onChange={this.handleChange('name')}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="TextField_license_number"
                label="Número do brevê"
                className="TextField"
                type="number"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                value={this.state.value}
                onChange={this.handleChange('license_number')}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="TextField_address"
                label="Endereço"
                className="TextField"
                type="text"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                value={this.state.value}
                onChange={this.handleChange('address')}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="TextField_birth_date"
                label="Data de Nascimento"
                className="TextField"
                type="date"
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                fullWidth
                value={this.state.value}
                onChange={this.handleChange('birth_date')}
              />
            </Grid>
          </Grid>
          <Grid container spacing={16} lg={13}>
            <Grid item xs={3}>
              <TextField
                id="TextField_course_name"
                label="Nome do curso"
                className="TextField"
                type="text"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                value={this.state.value}
                onChange={this.handleChange('course_name')}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="TextField_graduation_date"
                label="Data de conclusão de curso"
                className="TextField"
                type="date"
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
                fullWidth
                value={this.state.value}
                onChange={this.handleChange('graduation_date')}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="TextField_institution"
                label="Instituição cursada"
                className="TextField"
                type="text"
                required
                variant="outlined"
                margin="normal"
                fullWidth
                value={this.state.value}
                onChange={this.handleChange('institution')}
              />
            </Grid>
          </Grid>
        </form>
        <Button
          variant="contained"
          color="primary"
          onClick={this.submitNewInstructor}
        >
          Inscrever instrutor
        </Button>
      </div>
    );
  }
}

export default RegisterInstructor;
