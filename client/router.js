import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../imports/ui/containers/App';

import Home from '../imports/ui/pages/Home';
import Register from '../imports/ui/pages/auth/Register';
import Logout from '../imports/ui/pages/auth/Logout';
import Login from '../imports/ui/pages/auth/Login';
import LoginRegister from '../imports/ui/pages/auth/LoginRegister';
import RequestPassword from '../imports/ui/pages/auth/RequestPassword';
import ResetPassword from '../imports/ui/pages/auth/ResetPassword';

import AdminTags from '../imports/ui/pages/admin/tags/AdminTags';
import CreateTag from '../imports/ui/pages/admin/tags/CreateTag';
import EditTag from '../imports/ui/pages/admin/tags/EditTag';

import ViewProfile from '../imports/ui/pages/user/ViewProfile';
import ListUsers from '../imports/ui/pages/user/ListUsers';
import StatusFeed from '../imports/ui/pages/user/StatusFeed';

import NotFound from '../imports/ui/pages/NotFound';

FlowRouter.route('/', {
  action() {
    mount(App, {
      content: <Home/>,
      className: 'home',
    });
  },
});

/*
 *  Auth Pages
 */

 FlowRouter.route('/register', {
   name: 'register',
   action() {
     mount(App, {
       content: <Register/>,
     });
   },
 });

 FlowRouter.route('/logout', {
   name: 'logout',
   action() {
     mount(App, {
       content: <Logout/>,
     });
   },
 });

 FlowRouter.route('/login', {
   name: 'login',
   action() {
     mount(App, {
       content: <Login/>,
     });
   },
 });

 FlowRouter.route('/loginRegister', {
   name: 'LoginRegister',
   action() {
     mount(App, {
       content: <LoginRegister/>,
     });
   },
 });

 FlowRouter.route('/requestPassword', {
   name: 'requestPassword',
   action() {
     mount(App, {
       content: <RequestPassword/>,
     });
   },
 });

 FlowRouter.route('/resetPassword/:token', {
   name: 'resetPassword',
   action() {
     mount(App, {
       content: <ResetPassword/>,
     });
   },
 });


/*
 *  Profile Pages
 */

 FlowRouter.route('/users', {
  name: 'ListUsers',
  action() {
    mount(App, {
      content: <ListUsers/>,
    });
  },
});

FlowRouter.route('/profile/:userId', {
  action() {
    mount(App, {
      content: <Profile/>,
    });
  },
});

FlowRouter.route('/profile/:userId', {
  name: 'profile',
  action() {
    mount(App, {
      content: <ViewProfile/>,
    });
  },
});

FlowRouter.route('/profile', {
  name: 'myProfile',
  action() {
    mount(App, {
      content: <ViewProfile/>,
    });
  },
});

FlowRouter.route('/status/:userId', {
  name: 'status',
  action() {
    mount(App, {
      content: <StatusFeed/>,
    });
  },
});

FlowRouter.route('/status', {
  name: 'myStatus',
  action() {
    mount(App, {
      content: <StatusFeed/>,
    });
  },
});


/*
 *  Admin Pages
 */

FlowRouter.route('/admin/tags', {
  name: 'AdminTags',
  action() {
    mount(App, {
      content: <AdminTags/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/tags/new', {
  name: 'adminTagNew',
  action() {
    mount(App, {
      content: <CreateTag/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/tags/:tagId', {
  name: 'AdminTagEdit',
  action() {
    mount(App, {
      content: <EditTag/>,
      className: 'admin',
    });
  },
});


/*
 *  404 Page
 */

 FlowRouter.notFound = {
     action: function() {
       mount(App, {
         content: <NotFound/>,
       });
     }
 };
