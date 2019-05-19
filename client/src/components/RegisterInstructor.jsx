import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import './RegisterInstructor.css';
import axios from 'axios';

class RegisterInstructor extends Component {
  constructor() {
    super();

    this.state = {
      // controle dos dados
      type: true,
      name: '',
      institution: '',
      graduation_date: '',
      license_number: null,
      birth_date: '',
      course_name: '',
      address: '',
    };
    this.submitNew = this.submitNew.bind(this);
    this.displayStateOnConsole = this.displayStateOnConsole.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  submitNew = () => {
    if (!this.state.type) {
      // Post a new instructor
      const url = 'http://localhost:8888/api/instructors/';

      axios
        .post(url, {
          name: this.state.name,
          institution: this.state.institution,
          graduation_date: this.state.graduation_date,
          license_number: this.state.license_number,
          birth_date: this.state.birth_date,
          course_name: this.state.course_name,
          address: this.state.address,
        })
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response.data.endpoint);
        });
    } else {
      const url = 'http://localhost:8888/api/students/';

      axios
        .post(url, {
          name: this.state.name,
          birth_date: this.state.birth_date,
          address: this.state.address,
        })
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response.data.endpoint);
        });
    }
  };

  displayStateOnConsole = () => {
    // for debugging purposes
    // eslint-disable-next-line no-console
    console.log(this.state);
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  toggle() {
    const currentState = this.state.type;
    this.setState({ type: !currentState });
  }

  render() {
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
          <Button variant="contained" onClick={this.toggle}>
            Mudar Tipo
          </Button>
          <Grid container spacing={16}>
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
                value={this.state.value}
                onChange={this.handleChange('name')}
              />
            </Grid>
            {this.state.type ? null : (
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
                  autocomplete="off"
                  onChange={this.handleChange('license_number')}
                />
              </Grid>
            )}

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

          <Grid container spacing={16}>
            {this.state.type ? null : (
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
            )}

            {this.state.type ? null : (
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
            )}

            {this.state.type ? null : (
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
            )}
          </Grid>
        </form>
        <Button variant="contained" color="primary" onClick={this.submitNew}>
          Inscrever {this.state.type ? 'aluno' : 'instrutor'}
        </Button>
      </div>
    );
  }
}

export default RegisterInstructor;
