import React, { Component } from 'react';

import RequestPassword from '/imports/ui/components/forms/auth/RequestPassword.jsx';
export default class RequestPasswordPage extends Component {

  render(){
    return <div className="auth page">
      <RequestPassword/>
    </div>;
  }
}
