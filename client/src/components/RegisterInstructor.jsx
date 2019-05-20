import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import './RegisterInstructor.css';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
      dialogOpen: false,
      nameIsFilled: false,
      institutionIsFilled: false,
      graduationDateIsFilled: false,
      licenseNumberIsFilled: false,
      birthDateIsFilled: false,
      courseNameIsFilled: false,
      addressIsFilled: false,
      wasSubmitted: false,
      responseID: '',
    };
  }

  submitNew = () => {
    // Post a new instructor
    const url = 'http://localhost:8888/api/instructors/';
    this.setState({ wasSubmitted: true });
    if (
      this.state.nameIsFilled &&
      this.state.institutionIsFilled &&
      this.state.graduationDateIsFilled &&
      this.state.licenseNumberIsFilled &&
      this.state.birthDateIsFilled &&
      this.state.courseNameIsFilled &&
      this.state.addressIsFilled
    ) {
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
          const responseString = response.data.endpoint;
          const ID = responseString.split('api/instructors/').pop();
          this.setState({ responseID: ID }, () => this.setState({ dialogOpen: true }));
        });
    }
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
      dialogOpen: false,
      nameIsFilled: false,
      institutionIsFilled: false,
      graduationDateIsFilled: false,
      licenseNumberIsFilled: false,
      birthDateIsFilled: false,
      courseNameIsFilled: false,
      addressIsFilled: false,
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
          Cadastro de Instrutor
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
              Novo instrutor cadastrado. ID: {this.state.responseID}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6} lg={4}>
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
          <Grid item xs={12} sm={6} lg={5}>
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
          <Grid item xs={12} sm={6} lg={3}>
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
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_license_number"
              label="Número do brevê"
              type="number"
              name="licenseNumber"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              error={!this.state.licenseNumberIsFilled && this.state.wasSubmitted}
              value={this.state.licenseNumber}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_institution"
              label="Instituição cursada"
              type="text"
              name="institution"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              error={!this.state.institutionIsFilled && this.state.wasSubmitted}
              value={this.state.institution}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_course_name"
              label="Nome do curso"
              type="text"
              name="courseName"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              error={!this.state.courseNameIsFilled && this.state.wasSubmitted}
              value={this.state.courseName}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              id="TextField_graduation_date"
              label="Data de conclusão de curso"
              type="date"
              name="graduationDate"
              required
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }} // para não ocorrer sobreposição da label e do dd/mm/yyyy
              fullWidth
              error={!this.state.graduationDateIsFilled && this.state.wasSubmitted}
              value={this.state.graduationDate}
              onChange={this.handleChange}
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
