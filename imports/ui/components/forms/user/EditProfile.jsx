import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import * as _ from 'lodash';

class EditProfileTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {

      },
    };
  }

  static propTypes = {
    user: PropTypes.object,
    userId: PropTypes.string,
    settings: PropTypes.object,
    successCallback: PropTypes.func,
    errorCallback: PropTypes.func,
    cancelCallback: PropTypes.func,
  };

  static defaultProps = {
    settings: {
      showName: true,
      showEmail: true,
      showLocation: true,
      showTags: true,
    },
    successCallback: ()=>{
      toast.success('Status Posted!');
    },
    errorCallback: (error)=>{
      if(!error){error={}};
      toast.error(error.reason?error.reason:error);
    },
  };

  updateProfileValue = (value, stateKey) => {
    let newState = this.state.profile?this.state.profile:{};
    newState[stateKey] = value;
    this.setState({profile: newState});
  }


  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({profile: {
        firstName: this.props.user.getFirstName(),
        lastName: this.props.user.getLastName(),
        email: this.props.user.getEmail(),
        location: this.props.user.getLocation(),
        tags: this.props.user.getTags().filter(t=>Tags.findOne(t)).map(t=>{
          let tag = Tags.findOne(t);
          return {value: t, label: tag.name};
        }),
      }});
    }
  }

  componentDidMount = () => {
    if(this.props.user && !this.props.userId){
      this.setState({profile: {
        firstName: this.props.user.getFirstName(),
        lastName: this.props.user.getLastName(),
        email: this.props.user.getEmail(),
        location: this.props.user.getLocation(),
        tags: this.props.user.getTags().filter(t=>Tags.findOne(t)).map(t=>{
          let tag = Tags.findOne(t);
          return {value: t, label: tag.name};
        }),
      }});
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let profile = _.cloneDeep(this.state.profile);

    if(profile.tags){
      profile.tags = profile.tags.map(tag=>tag.value);
    }

    Meteor.call('user.updateProfile', profile, this.props.user._id, error=>{
      if(error){
        this.props.errorCallback(error);
      }else{
        this.setState({profile: {}});
        this.props.successCallback();
      }
    });
  }

  render(){

    return (
      <form onSubmit={this.handleSubmit} className="profile edit">
        {!this.props.loading && this.props.settings.showName &&
          <div className="row form-group">
            <div className="col-sm-6">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value={this.state.profile.firstName || ''} onChange={e=>{this.updateProfileValue(e.target.value, 'firstName')}} className="form-control" />
            </div>
            <div className="col-sm-6">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value={this.state.profile.lastName || ''} onChange={e=>{this.updateProfileValue(e.target.value, 'lastName')}} className="form-control" />
            </div>
          </div>
        }

        {!this.props.loading && this.props.settings.showEmail &&
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={this.state.profile.email || ''} onChange={e=>{this.updateProfileValue(e.target.value, 'email')}} className="form-control" />
          </div>
        }

        {!this.props.loading && this.props.settings.showLocation &&
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" value={this.state.profile.location || ''} onChange={e=>{this.updateProfileValue(e.target.value, 'location')}} className="form-control" />
          </div>
        }

        {!this.props.loading && this.props.settings.showTags &&
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <Select
              value={this.state.profile.tags}
              isMulti={true}
              onChange={value=>this.updateProfileValue(value, 'tags')}
              options={this.props.tags.map(t=>{
                console.log(t);
                return { value:t._id, label: t.name };
              })}
            />
          </div>
        }

        <div className="spacer v20"></div>
        <input type="submit" className="btn btn-primary" value="Save" /> &nbsp;
        {this.props.cancelCallback && <a href="" className="btn btn-secondary" onClick={this.props.cancelCallback}>Cancel</a>}
      </form>
    );
  }
};

export default withTracker(props => {
  let loading = true,
      tags = [],
      user = {};
  const handles = [Meteor.subscribe('tags')];
  tags = Tags.find().fetch();
  if(props.userId){
    handles.push(Meteor.subscribe('user', props.userId));
    user = Meteor.users.findOne(props.userId);
    loading = handles.some(handle => !handle.ready());
  }else{
    user = props.user;
    loading = false;
  }

  return {
    loading,
    tags,
    user,
  };
})(EditProfileTemplate);
