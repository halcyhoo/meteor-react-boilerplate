import React, { Component } from 'react';

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    Meteor.logout(()=>{
      FlowRouter.go('/');
    });
  }

  render(){
    return <div className="auth page">
      <h3>Logging you out</h3>
    </div>;
  }
}
