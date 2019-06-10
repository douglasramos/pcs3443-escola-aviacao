import React from 'react';

function Unauthorized() {
  return (
    <div>
      <h1>Acesso não autorizado, retorne à tela de login</h1>
      <a href="/login">Link para login</a>
    </div>
  );
}

export default Unauthorized;
