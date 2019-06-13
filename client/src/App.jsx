import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import DashboardInstructor from './components/DashboardIntructor';
import DashboardAdministrator from './components/DashboardAdministrator';
import DashboardStudent from './components/DashboardStudent';
import Login from './components/Login';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <div>
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/unauthorized" component={Unauthorized} />
          <Route path="/dashboard-instructor" component={DashboardInstructor} />
          <Route path="/dashboard-administrator" component={DashboardAdministrator} />
          <Route path="/dashboard-student" component={DashboardStudent} />
        </div>
      </Router>
    </React.Fragment>
  );
}
export default App;
