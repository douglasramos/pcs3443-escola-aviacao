import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import './RegisterStudent.css';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';

class RegisterStudent extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      birthDate: '',
      address: '',
    };
  }

  submitNew = () => {
    const url = 'http://localhost:8888/api/students/';

    axios
      .post(url, {
        name: this.state.name,
        birth_date: this.state.birthDate,
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
      birthDate: '',
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

  toggle = () => {
    const currentState = this.state.type;
    this.setState({ type: !currentState });
  };

  render() {
    return (
      <div>
        <Typography component="h4" variant="h4" gutterBottom>
          Cadastrar Aluno
        </Typography>
        <Grid container spacing={16}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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

export default RegisterStudent;
