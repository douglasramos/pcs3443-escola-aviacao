import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavBar from './components/NavBar';
import DashboardInstructor from './components/DashboardIntructor';
import DashboardAdministrator from './components/DashboardAdministrator';
import DashboardStudent from './components/DashboardStudent';
import HomeApp from './components/HomeApp';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <div>
          <NavBar />
          <Route exact path="/" component={HomeApp} />
          <Route path="/dashboard-instructor" component={DashboardInstructor} />
          <Route path="/dashboard-administrator" component={DashboardAdministrator} />
          <Route path="/dashboard-student" component={DashboardStudent} />
        </div>
      </Router>
    </React.Fragment>
  );
}
export default App;
