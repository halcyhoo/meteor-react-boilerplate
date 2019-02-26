import React, { Component } from 'react';

import LoginForm from '/imports/ui/components/forms/auth/Login.jsx';
export default class LoginPage extends Component {

  render(){
    return <div className="auth page">
      <LoginForm/>
    </div>;
  }
}
