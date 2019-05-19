import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import './RegisterInstructor.css';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';

class RegisterInstructor extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      institution: '',
      graduationDate: '',
      licenseNumber: '',
      birthDate: '',
      courseName: '',
      address: '',
    };
  }

  submitNew = () => {
    // Post a new instructor
    const url = 'http://localhost:8888/api/instructors/';

    this.displayStateOnConsole();

    axios
      .post(url, {
        name: this.state.name,
        institution: this.state.institution,
        graduation_date: this.state.graduationDate,
        license_number: this.state.licenseNumber,
        birth_date: this.state.birthDate,
        course_name: this.state.courseName,
        address: this.state.address,
      })
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(response.data.endpoint);
      });
  };

  resetState = () => {
    this.setState({
      name: '',
      institution: '',
      graduationDate: '',
      licenseNumber: '',
      birthDate: '',
      courseName: '',
      address: '',
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
    return (
      <div>
        <Typography component="h4" variant="h4" gutterBottom>
          Cadastrar Instrutor
        </Typography>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              id="TextField_name"
              label="Nome"
              type="text"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              value={this.state.name}
              onChange={this.handleChange('name')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={5}>
            <TextField
              id="TextField_address"
              label="Endereço"
              type="text"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              value={this.state.address}
              onChange={this.handleChange('address')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_birth_date"
              label="Data de Nascimento"
              type="date"
              autoComplete="new-password"
              required
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
              fullWidth
              value={this.state.birthDate}
              onChange={this.handleChange('birthDate')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_license_number"
              label="Número do brevê"
              type="number"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              value={this.state.licenseNumber}
              onChange={this.handleChange('licenseNumber')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_institution"
              label="Instituição cursada"
              type="text"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              value={this.state.institution}
              onChange={this.handleChange('institution')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_course_name"
              label="Nome do curso"
              type="text"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              value={this.state.courseName}
              onChange={this.handleChange('courseName')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_graduation_date"
              label="Data de conclusão de curso"
              type="date"
              required
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
              fullWidth
              value={this.state.graduationDate}
              onChange={this.handleChange('graduationDate')}
            />
          </Grid>
        </Grid>
        <div className="mt-3 text-right">
          <Button variant="outlined" onClick={this.resetState}>
            cancelar
          </Button>
          <Button
            className="ml-3"
            variant="contained"
            style={{ backgroundColor: '#2cad58', color: 'white' }}
            onClick={this.submitNew}
          >
            cadastrar
          </Button>
        </div>
      </div>
    );
  }
}

export default RegisterInstructor;
