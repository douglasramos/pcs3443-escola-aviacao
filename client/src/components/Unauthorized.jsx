import React from 'react';
import { Redirect } from 'react-router-dom';

function Unauthorized() {
  return <Redirect push to="/login" />;
}

export default Unauthorized;
