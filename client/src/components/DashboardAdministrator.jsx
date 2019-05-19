import React from 'react';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import './NavBar.css';
import RegisterInstructor from './RegisterInstructor';
// import { Link } from 'react-router-dom';

function DashboardAministrator() {
  return (
    <div>
      <h3>Dashboard Administrador</h3>
      <RegisterInstructor />
    </div>
  );
}

export default DashboardAministrator;
