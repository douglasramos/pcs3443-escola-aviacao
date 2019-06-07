import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import './RegisterStudent.css';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';

class RegisterStudent extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      birthDate: '',
      address: '',
      course: '',
      nameIsFilled: false,
      birthDateIsFilled: false,
      addressIsFilled: false,
      courseIsFilled: '',
      dialogOpen: false,
      wasSubmitted: false,
      responseID: '',
    };
  }

  submitNew = () => {
    const url = 'http://localhost:8888/api/students/';
    this.setState({ wasSubmitted: true });
    if (
      this.state.nameIsFilled &&
      this.state.birthDateIsFilled &&
      this.state.addressIsFilled &&
      this.state.courseIsFilled
    ) {
      axios
        .post(url, {
          name: this.state.name,
          birth_date: this.state.birthDate,
          address: this.state.address,
          courseDuration: this.state.course,
        })
        .then(response => {
          const responseString = response.data.endpoint;
          const ID = responseString.split('api/students/').pop();
          this.setState({ responseID: ID }, () => this.setState({ dialogOpen: true }));
        });
    }
  };

  resetState = () => {
    this.setState({
      name: '',
      birthDate: '',
      address: '',
      course: '',
      nameIsFilled: false,
      birthDateIsFilled: false,
      addressIsFilled: false,
      courseIsFilled: false,
      wasSubmitted: false,
      responseID: '',
    });
  };

  displayStateOnConsole = () => {
    // for debugging purposes
    // eslint-disable-next-line no-console
    console.log(this.state);
  };

  handleChange = event => {
    // é preciso salvar as informações de event em constantes pois na chamada de checkField o event não é preservado
    const eventName = String(event.target.name);
    const eventValue = event.target.value;
    this.setState({ [event.target.name]: event.target.value }, () =>
      this.checkField(eventName, eventValue)
    );
  };

  checkField = (fieldName, value) => {
    const fieldNameIsFilled = `${String(fieldName)}IsFilled`;
    if (value !== '') {
      this.setState({ [fieldNameIsFilled]: true });
    } else {
      this.setState({ [fieldNameIsFilled]: false });
    }
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false }, this.resetState());
  };

  render() {
    return (
      <div>
        <Typography component="h4" variant="h4" gutterBottom>
          Cadastro de aluno
        </Typography>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="registerSucessTitle"
          aria-describedby="registerSuccessText"
        >
          <DialogTitle id="registerSucessTitle">SUCESSO</DialogTitle>
          <DialogContent>
            <DialogContentText id="registerSuccessText">
              Novo aluno cadastrado. ID: {this.state.responseID}
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Grid container spacing={16}>
          <Grid item xs={12}>
            <TextField
              id="TextField_name"
              label="Nome"
              type="text"
              name="name"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              error={!this.state.nameIsFilled && this.state.wasSubmitted}
              value={this.state.name}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="TextField_address"
              label="Endereço"
              type="text"
              name="address"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              error={!this.state.addressIsFilled && this.state.wasSubmitted}
              value={this.state.address}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="TextField_birth_date"
              label="Data de Nascimento"
              type="date"
              name="birthDate"
              autoComplete="new-password"
              required
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
              fullWidth
              error={!this.state.birthDateIsFilled && this.state.wasSubmitted}
              value={this.state.birthDate}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="TextField_course"
              select
              label="Curso"
              name="course"
              value={this.state.course}
              onChange={this.handleChange}
              fullWidth
              error={this.state.wasSubmitted && !this.state.courseIsFilled}
              variant="outlined"
            >
              <MenuItem key="Curso_10h" value={10}>
                Habilitação básica de pilotagem (10h)
              </MenuItem>
              <MenuItem key="Curso_20h" value={20}>
                Pilotagem comercial (20h)
              </MenuItem>
              <MenuItem key="Curso_30h" value={30}>
                Pilotagem de aviões de grande porte (30h)
              </MenuItem>
              <MenuItem key="Curso_50h" value={50}>
                Habilitação para instrutores de voo (50h)
              </MenuItem>
            </TextField>
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
