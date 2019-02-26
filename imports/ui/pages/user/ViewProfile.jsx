import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import * as _ from 'lodash';
import CreateStatus from '/imports/ui/components/forms/status/CreateStatus';
import ViewStatusList from '/imports/ui/components/displays/ViewStatusList';
import EditProfile from '/imports/ui/components/forms/user/EditProfile';
import UploadAvatar from '/imports/ui/components/forms/user/UploadAvatar';

class ProfileTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: {
        createStatus: {
          show: false
        },
        editProfile: {
          show: false
        },
        uploadAvatar: {
          show: false,
        },
      },
    };
  }

  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: true,
  };

  closeModal = modalId => {
    let modals = _.cloneDeep(this.state.modals);
    modals[modalId].show = false;
    this.setState({modals});
  }

  openModal = modalId => {
    let modals = _.cloneDeep(this.state.modals);
    modals[modalId].show = true;
    this.setState({modals});
  }

  render(){
    return (
      <div className="row page">
        <div className="col-sm-2"></div>
        <div className="col-sm-4">

          <Modal show={this.state.modals.uploadAvatar.show} onHide={()=>this.closeModal('uploadAvatar')}>
            <Modal.Header closeButton>
              <Modal.Title>Upload Avatar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UploadAvatar
                user={this.props.user}
                cancelCallback={()=>this.closeModal('uploadAvatar')}
                successCallback={()=>{
                  this.closeModal('uploadAvatar');
                  toast.success(<div><h4>Image uploaded!</h4><p>It might take just a second for it to show up</p></div> );
                }}
              />
            </Modal.Body>
          </Modal>

          <div className="profile view">
            {!this.props.loading &&
              <div className="avatar-holder">
                <img className="avatar" src={this.props.user.getAvatar()} />
                {Meteor.userId() && (this.props.user._id == Meteor.userId() || this.props.user.isAdmin()) &&
                  <a href="" onClick={()=>{this.openModal('uploadAvatar')}} className="text-center btn btn-primary">Upload Photo</a>
                }
              </div>
            }

            {this.props.loading?<p className="skeleton line"></p>:<h3>
              {this.props.user.getFirstName()} {this.props.user.getLastName()}
            </h3>}

            {!this.props.loading && this.props.user && this.props.user.profile && this.props.user.profile.location &&
              <p className="location"><strong>Location:</strong> {this.props.user.getLocation()}</p>
            }

            {!this.props.loading && this.props.user && this.props.user.getTags().length > 0 &&
              <div className="tags">
                <strong>Tags:</strong>
                <ul className="taglist boxed inline">
                  {this.props.user.getTags().filter(t=>Tags.findOne(t)).map(t=>{
                    let tag = Tags.findOne(t);
                    return <li key={tag._id}>{tag.name}</li>;
                  })}
                </ul>

              </div>
            }


            {!this.props.loading && (Meteor.userId() && (this.props.user._id == Meteor.userId() || this.props.user.isAdmin())) &&
              <div>
                <a className="btn btn-primary btn-small" href="" onClick={()=>this.openModal('editProfile')}>Edit Profile</a>
                <Modal show={this.state.modals.editProfile.show} onHide={()=>this.closeModal('editProfile')}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditProfile
                      user={this.props.user}
                      cancelCallback={()=>this.closeModal('editProfile')}
                      successCallback={()=>{this.closeModal('editProfile');}}
                    />
                  </Modal.Body>
                </Modal>
              </div>
            }
          </div>
        </div>

        <div className="col-sm-4">
          <h3>Status Feed &nbsp; {!this.props.loading && (Meteor.userId() && (this.props.user._id == Meteor.userId() || this.props.user.isAdmin())) && <a href="" className="btn btn-primary" onClick={()=>this.openModal('createStatus')}>Upload Picture</a>}</h3>
          {!this.props.loading && (Meteor.userId() && (this.props.user._id == Meteor.userId() || this.props.user.isAdmin())) &&
            <div>
              <Modal show={this.state.modals.createStatus.show} onHide={()=>this.closeModal('createStatus')}>
                <Modal.Header closeButton>
                  <Modal.Title>New Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CreateStatus
                    cancelCallback={()=>this.closeModal('createStatus')}
                    successCallback={()=>{this.closeModal('createStatus');}}
                  />
                </Modal.Body>
              </Modal>
            </div>
          }

          {!this.props.loading && <ViewStatusList userId={this.props.user._id}/>}
        </div>
      </div>
    );
  }
};

export default withTracker(props => {
  let user = {};
  let loading = true;

  if(!FlowRouter.getParam("userId") && !Meteor.userId()){
    FlowRouter.go('/');
  }

  const handles = [
    Meteor.subscribe('tags'),
    Meteor.subscribe('user', FlowRouter.getParam("userId")?FlowRouter.getParam("userId"):Meteor.userId()),
  ];
  loading = handles.some(handle => !handle.ready());
  user = Meteor.users.findOne(FlowRouter.getParam("userId")?FlowRouter.getParam("userId"):Meteor.userId());

  return {
    user,
    loading,
  };
})(ProfileTemplate);
