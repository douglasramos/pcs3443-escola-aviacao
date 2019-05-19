import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './NavBar.css';
import { Link, NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <div className="navbar">
      <AppBar position="static">
        <Toolbar>
          <nav className="display">
            {/* Device Pequeno */}
            <span className="fas fa-plane-departure mr-2 display-logo" />
            {/* Device Grandes */}
            <Typography
              variant="h6"
              color="inherit"
              className="title display-logo-name"
              component={Link}
              to="/"
            >
              <span className="fas fa-plane-departure mr-2" />
              Voe Mais
            </Typography>
            <Button
              className="button-w-outline"
              activeClassName="active"
              color="inherit"
              component={NavLink}
              to="/dashboard-administrator"
            >
              Administrador
            </Button>
            <Button
              className="button-w-outline"
              activeClassName="active"
              color="inherit"
              component={NavLink}
              to="/dashboard-student"
            >
              Aluno
            </Button>
            <Button
              className="button-w-outline"
              activeClassName="active"
              color="inherit"
              component={NavLink}
              to="/dashboard-instructor"
            >
              Instrutor
            </Button>
          </nav>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
