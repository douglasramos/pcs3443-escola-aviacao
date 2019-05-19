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

class RegisterStudent extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      birthDate: '',
      address: '',
      nameIsFilled: false,
      birthDateIsFilled: false,
      addressIsFilled: false,
      dialogOpen: false,
      wasSubmitted: false,
    };
  }

  submitNew = () => {
    const url = 'http://localhost:8888/api/students/';
    this.setState({ wasSubmitted: true }, () => this.checkFields());
    if (this.state.nameIsFilled && this.state.birthDateIsFilled && this.state.addressIsFilled) {
      axios
        .post(url, {
          name: this.state.name,
          birth_date: this.state.birthDate,
          address: this.state.address,
        })
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(response.data.endpoint);
          this.setState({ dialogOpen: true });
          this.resetFields();
        });
    }
  };

  resetFields = () => {
    this.setState(
      {
        name: '',
        birthDate: '',
        address: '',
        wasSubmitted: false,
      },
      () => this.checkFields()
    );
  };

  displayStateOnConsole = () => {
    // for debugging purposes
    // eslint-disable-next-line no-console
    console.log(this.state);
  };

  checkFields = () => {
    if (this.state.name === '') {
      this.setState({ nameIsFilled: false });
    } else {
      this.setState({ nameIsFilled: true });
    }

    if (this.state.birthDate === '') {
      this.setState({ birthDateIsFilled: false });
    } else {
      this.setState({ birthDateIsFilled: true });
    }

    if (this.state.address === '') {
      this.setState({ addressIsFilled: false });
    } else {
      this.setState({ addressIsFilled: true });
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value }, () => this.checkFields());
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    return (
      <div>
        <Typography component="h4" variant="h4" gutterBottom>
          Cadastrar Aluno
        </Typography>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="registerSucessTitle"
          aria-describedby="registerSuccessText"
        >
          <DialogTitle id="registerSucessTitle">SUCESSO</DialogTitle>
          <DialogContent>
            <DialogContentText id="registerSuccessText">Novo aluno cadastrado</DialogContentText>
          </DialogContent>
        </Dialog>

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
              error={!this.state.nameIsFilled && this.state.wasSubmitted}
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
              error={!this.state.addressIsFilled && this.state.wasSubmitted}
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
              error={!this.state.birthDateIsFilled && this.state.wasSubmitted}
              value={this.state.birthDate}
              onChange={this.handleChange('birthDate')}
            />
          </Grid>
        </Grid>
        <div className="mt-3 text-right">
          <Button variant="outlined" onClick={this.resetFields}>
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
