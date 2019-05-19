import React from 'react';
import { Redirect } from 'react-router-dom';

function HomeApp() {
  // Hoje não temos Home. É redirecionado para o dashboard do administrador
  return <Redirect to="/dashboard-administrator" />;
}
export default HomeApp;
