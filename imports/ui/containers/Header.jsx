import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';

class HeaderTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    loggedin: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
    loggedin: false,
  };

  render() {
    return (
      <header className="container-fluid">
        {!this.props.loading && this.props.loggedin && this.props.user && this.props.user.isAdmin() &&
          <div className="row nav-bar">
            <div className="col-sm-12">
              <strong>Admin:</strong>
              <ul className="nav mini-nav">
                <li className={(FlowRouter.current().route.name == 'AdminTags')?'active':''}><a href="/admin/tags">Tags</a></li>
              </ul>
            </div>
          </div>
        }
        <div className="main-header row">
          <div className="col-sm-4">
            <h1 className="logo">Meteor + React</h1>
          </div>
          <div className="col-sm-8">
            <ul className="nav main-nav">
              <li className={(FlowRouter.current().route.name == 'home')?'active':''}><a href="/">Home</a></li>
              {this.props.loggedin && <li className={(FlowRouter.current().route.name == 'myProfile')?'active':''}><a href="/profile">My Profile</a></li>}
              {!this.props.loggedin && <li className={(FlowRouter.current().route.name == 'LoginRegister')?'active':''}><a href="/loginRegister?a=login">Login</a></li>}
              {this.props.loggedin && <li className={(FlowRouter.current().route.name == 'Logout')?'active':''}><a href="/logout">Logout</a></li>}
              {!this.props.loggedin && <li className={(FlowRouter.current().route.name == 'LoginRegister')?'active':''}><a href="/loginRegister?a=signup">Register</a></li>}
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

export default withTracker(props => {
  let user = {};
  let loading = true;
  let loggedin = false;
  if(Meteor.userId()){
    const userSub = Meteor.subscribe('user', FlowRouter.getParam("userId")?FlowRouter.getParam("userId"):Meteor.userId());
    loading = !userSub.ready();
    user = Meteor.users.findOne(FlowRouter.getParam("userId")?FlowRouter.getParam("userId"):Meteor.userId());
    loggedin = true;
  }

  return {
    user,
    loading,
    loggedin,
  };
})(HeaderTemplate);
