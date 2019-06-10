import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      emailIsFilled: false,
      password: '',
      passwordIsFilled: false,
      type: '',
      typeIsFilled: '',
      wasSubmitted: false,
      redirectionURL: '',
      redirect: false,
    };
  }

  handleChange = event => {
    // é preciso salvar as informações de event em constantes pois na chamada de checkField o event não é preservado
    // eslint-disable-next-line no-console
    console.log(`Campo: ${event.target.name} mudou`);
    const eventName = String(event.target.name);
    const eventValue = event.target.value;
    this.setState({ [event.target.name]: event.target.value }, () =>
      this.checkField(eventName, eventValue)
    );
    this.setState({ wasSubmitted: false });
  };

  checkField = (fieldName, value) => {
    const fieldNameIsFilled = `${String(fieldName)}IsFilled`;
    if (value !== '') {
      this.setState({ [fieldNameIsFilled]: true });
    } else {
      this.setState({ [fieldNameIsFilled]: false });
    }
  };

  register = () => {
    const url = 'http://localhost:8888/api/login/register';
    axios
      .post(url, {
        email: this.state.email,
        password: this.state.password,
        type: this.state.type,
      })
      .then(response => {
        console.log(response.data);
      });
  };

  login = () => {
    console.log(this.state);
    const url = 'http://localhost:8888/api/login/';
    axios
      .post(url, {
        email: this.state.email,
        password: this.state.password,
      })
      .then(response => {
        console.log(response.data);
        console.log(JSON.stringify(response.data));
        localStorage.setItem('ID', JSON.stringify(response.data.ID));
        console.log(`ID: ${localStorage.getItem('ID')}`);
        localStorage.setItem('email', JSON.stringify(response.data.email));
        console.log(`Email: ${localStorage.getItem('email')}`);
        localStorage.setItem('password', JSON.stringify(response.data.password));
        console.log(`Senha: ${localStorage.getItem('password')}`);
        localStorage.setItem('type', JSON.stringify(response.data.type));
        console.log(`Tipo: ${localStorage.getItem('type')}`);
        this.setState({ redirectionURL: response.data.url, redirect: true });
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  resetSession = () => {
    localStorage.removeItem('ID');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('type');
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirectionURL} />;
    }
    return (
      <React.Fragment>
        <Grid
          container
          spacing={16}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '50vh' }}
        >
          <Grid>
            <TextField
              id="TextField_email"
              label="Email"
              type="text"
              name="email"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              value={this.state.email}
              onChange={this.handleChange}
              error={this.state.wasSubmitted && !this.state.emailIsFilled}
            />
          </Grid>
          <Grid>
            <TextField
              id="TextField_password"
              label="Senha"
              type="password"
              name="password"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              value={this.state.password}
              onChange={this.handleChange}
              error={this.state.wasSubmitted && !this.state.passwordIsFilled}
            />
          </Grid>
          <Grid>
            <TextField
              id="TextField_password"
              label="Tipo de conta (0-admin, 1-aluno, 2-instrutor)"
              type="number"
              name="type"
              required
              variant="outlined"
              margin="normal"
              fullWidth
              value={this.state.type}
              onChange={this.handleChange}
              error={this.state.wasSubmitted && !this.state.typeIsFilled}
            />
          </Grid>
          <Button
            className="button-w-outline"
            activeClassName="active"
            color="inherit"
            // component={NavLink}
            style={{ backgroundColor: '#4285F4', color: 'white', minWidth: 210 }}
            onClick={this.register}
          >
            Register
          </Button>
          <Button
            className="button-w-outline"
            activeClassName="active"
            color="inherit"
            // component={NavLink}
            style={{ backgroundColor: '#4285F4', color: 'white', minWidth: 210 }}
            onClick={this.login}
          >
            Login
          </Button>
          <Button
            className="button-w-outline"
            activeClassName="active"
            color="inherit"
            // component={NavLink}
            style={{ backgroundColor: '#4285F4', color: 'white', minWidth: 210 }}
            onClick={this.resetSession}
          >
            Reset session
          </Button>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Login;
