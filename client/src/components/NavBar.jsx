import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div className="navbar">
      <AppBar position="static">
        <Toolbar className="toolbar">
          <IconButton
            className="button-w-outline"
            edge="start"
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <nav className="display">
            <Typography
              variant="h6"
              color="inherit"
              className="title"
              component={Link}
              to="/"
            >
              Voe Mais
            </Typography>
            <Button
              className="button-w-outline"
              color="inherit"
              component={Link}
              to="/dashboard-administrator"
            >
              Adminitrador
            </Button>
            <Button
              className="button-w-outline"
              color="inherit"
              component={Link}
              to="/dashboard-student"
            >
              Aluno
            </Button>
            <Button
              className="button-w-outline"
              color="inherit"
              component={Link}
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
