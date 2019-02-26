import React, { Component } from 'react';
import { Panel, PanelGroup } from "react-bootstrap";
import RegisterForm from '/imports/ui/components/forms/auth/Register.jsx';
import LoginForm from '/imports/ui/components/forms/auth/Login.jsx';

export default class LoginRegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePanel: FlowRouter.getQueryParam("a")?FlowRouter.getQueryParam("a"):'login',
    };
  }

  openCollapse = groupId => {
    let showCollapse = this.state.showCollapsed;
    for(let id in showCollapse){
      showCollapse[id] = false;
    }
    showCollapse[groupId] = true;
    this.setState({showCollapse});
  }

  render(){
    return (
      <div className="row page">
        <div className="col-sm-2"></div>
        <div className="col-sm-8">

          <PanelGroup id="loginRegister" accordion activeKey={this.state.activePanel} onSelect={id=>this.setState({activePanel: id})} >
            <Panel eventKey="login">
              <Panel.Heading>
                <Panel.Title toggle>Login</Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <LoginForm/>
              </Panel.Body>
            </Panel>
            <Panel eventKey="signup">
              <Panel.Heading>
                <Panel.Title toggle>Sign up</Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <RegisterForm/>
              </Panel.Body>
            </Panel>
          </PanelGroup>

        </div>
        <div className="col-sm-2"></div>
      </div>);
  }
}
