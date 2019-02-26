import React, { Component } from 'react';

import RegisterForm from '/imports/ui/components/forms/auth/Register.jsx';
export default class RegisterPage extends Component {

  render(){
    return <div className="auth page">
      <RegisterForm/>
    </div>;
  }
}
