import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

// ícones
import Email from '@material-ui/icons/Email';
import Lock from '@material-ui/icons/Lock';

// logo
import Logo from '../logo_aviacao.png';

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
      error: false,
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
        this.setState({ error: true });
      });
  };

  resetSession = () => {
    localStorage.removeItem('ID');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('type');
  };

  render() {
    let errorMessage = '';
    if (this.state.error) {
      errorMessage = <h6 style={{ color: '#FF0000' }}>Email ou senha incorretos</h6>;
    }
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirectionURL} />;
    }
    return (
      <div
        style={{
          background: 'linear-gradient(to right bottom, #1488CC, #37aff5)',
          position: 'fixed',
          padding: '0',
          margin: '0',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            'border-radius': '10px',
            'box-shadow': 'rgba(0, 0, 0, 0.35) 20px 20px 20px -8px',
            width: '700px',
            height: '450px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            'margin-left': '-350px',
            'margin-top': '-225px',
          }}
        >
          <Paper style={{ height: '450px' }}>
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
                <img src={Logo} alt="Logo" />
              </Grid>
              <Grid item>
                <h3>Escola de aviação Voe Mais</h3>
              </Grid>
              <Grid item container direction="row" justify="center">
                <Grid item style={{ position: 'relative', top: '25px', left: '-10px' }}>
                  <Email style={{ 'font-size': '40px' }} />
                </Grid>
                <Grid item>
                  <TextField
                    style={{ width: '400px' }}
                    id="TextField_email"
                    label="Email"
                    type="text"
                    name="email"
                    required
                    variant="outlined"
                    margin="normal"
                    value={this.state.email}
                    onChange={this.handleChange}
                    error={this.state.wasSubmitted && !this.state.emailIsFilled}
                  />
                </Grid>
              </Grid>
              <Grid item container direction="row" justify="center">
                <Grid item style={{ position: 'relative', top: '25px', left: '-10px' }}>
                  <Lock style={{ 'font-size': '40px' }} />
                </Grid>
                <Grid item>
                  <TextField
                    style={{ width: '400px' }}
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
              </Grid>
              <Grid item style={{ position: 'relative', top: '20px' }}>
                <Button
                  className="button-w-outline"
                  color="inherit"
                  // component={NavLink}
                  style={{ backgroundColor: '#4285F4', color: 'white', minWidth: 442 }}
                  onClick={this.login}
                >
                  Login
                </Button>
                <React.Fragment>{errorMessage}</React.Fragment>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
    );
  }
}

export default Login;
