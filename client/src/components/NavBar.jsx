import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './NavBar.css';
import { Redirect } from 'react-router-dom';

// logo
import SmallLogo from '../logo_aviacao_pequeno.png';

class NavBar extends Component {
  constructor(props) {
    super(props);
    if (String(JSON.parse(localStorage.getItem('name')))) {
      this.state = {
        name: String(JSON.parse(localStorage.getItem('name'))),
        localStorage: true,
        redirect: false,
      };
    } else {
      this.state = {
        name: '',
        localStorage: false,
        redirect: false,
      };
    }

    console.log(this.state.name);
    console.log(this.state.localStorage);
  }

  logout = () => {
    localStorage.removeItem('ID');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('type');
    localStorage.removeItem('name');
    this.setState({ redirect: true });
  };

  handleRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  render() {
    return (
      <div className="navbar">
        <AppBar position="static">
          <Toolbar>
            <nav className="display">
              {/* Device Pequeno */}
              <span className="fas fa-plane-departure mr-2 display-logo" />
              {/* Device Grandes */}
              <Typography variant="h6" color="inherit" className="title display-logo-name">
                <img src={SmallLogo} alt="Small logo" />
                Voe Mais
              </Typography>
              {this.state.localStorage ? (
                <React.Fragment>
                  <h6 style={{ position: 'relative', top: '3px' }}>
                    Seja bem-vindo, {this.state.name}
                  </h6>
                  {this.handleRedirect()}
                  <Button
                    className="button-w-outline"
                    color="inherit"
                    onClick={this.logout}
                    style={{ position: 'relative', left: '20px', top: '1.5px' }}
                  >
                    Logout
                  </Button>
                </React.Fragment>
              ) : (
                ''
              )}
            </nav>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default NavBar;
