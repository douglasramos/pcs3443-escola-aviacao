import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

class Login extends Component {
  constructor() {
    super();
    let redirect;
    let redirectionURL;
    if (String(JSON.parse(localStorage.getItem('type'))) === 'student') {
      redirect = true;
      redirectionURL = '/dashboard-student';
    } else if (String(JSON.parse(localStorage.getItem('type'))) === 'instructor') {
      redirect = true;
      redirectionURL = '/dashboard-instructor';
    } else if (String(JSON.parse(localStorage.getItem('type'))) === 'admin') {
      redirect = true;
      redirectionURL = '/dashboard-administrator';
    } else {
      redirect = false;
      redirectionURL = '';
    }
    this.state = {
      email: '',
      emailIsFilled: false,
      password: '',
      passwordIsFilled: false,
      type: '',
      typeIsFilled: '',
      wasSubmitted: false,
      redirectionURL, // o mesmo que redirectionURL: redirectionURL
      redirect, // o mesmo que redirect: redirect
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
        localStorage.setItem('ID', JSON.stringify(response.data.ID));
        localStorage.setItem('email', JSON.stringify(response.data.email));
        localStorage.setItem('password', JSON.stringify(response.data.password));
        localStorage.setItem('type', JSON.stringify(response.data.type));
        localStorage.setItem('name', JSON.stringify(response.data.name));
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
          spacing={12}
          direction="column"
          alignContent="center"
          alignItems="center"
          justify="center"
          style={{ minHeight: '50vh' }}
        >
          <Grid item>
            <h3>Escola de aviação Voe Mais</h3>
          </Grid>
          <Grid item>
            <h4>Login</h4>
          </Grid>
          <Grid item>
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
          <Grid item>
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
          <Grid item>
            <Button
              className="button-w-outline"
              color="inherit"
              // component={NavLink}
              style={{ backgroundColor: '#4285F4', color: 'white', minWidth: 210 }}
              onClick={this.login}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Login;
