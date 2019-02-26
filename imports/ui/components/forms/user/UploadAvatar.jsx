import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';

class UploadAvatarTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreview: '',
      image: []
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
    },
    successCallback: ()=>{
      toast.success('Avatar Uploaded!');
    },
    errorCallback: (error)=>{
      if(!error){error={}};
      toast.error(error.reason?error.reason:error);
    },
  };


  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      this.setState({imagePreview: this.props.user.getAvatar()});
    }
  }

  componentDidMount = () => {
    if(this.props.user && !this.props.userId){
      this.setState({imagePreview: this.props.user.getAvatar()});
    }
  }

  uploadImage = (files, imageType, var1, var2) => {
    return new Promise((resolve, reject)=>{
      if(files){
        const file = files[0];
        let uploadSettings = {
          file:  file,
          streams: 'dynamic',
          chunkSize: 'dynamic',
        };

        switch(imageType){
          case 'avatarPhoto':
            uploadSettings.meta = {
              directions: {
                type: imageType,
                userId: var1
              },
            };
            break;
        }

        const upload = Images.insert(uploadSettings, false);

        upload.on('start', function () {
          //toast.info('Uploading...');
          console.log('Uploading: ', this);
        });

        upload.on('end', (error, a) => {
          if (error) {
            toast.error(error.message);
            reject(error);
          } else {
            resolve(a);
          }
        });
        upload.start();
      }else{
        reject();
      }
    });
  };

  selectedImage = event => {
    this.setState({image: event.target.files}, ()=>{
      var reader = new FileReader();
      reader.onload = (e) => {
         this.setState({imagePreview: e.target.result});

      }
      reader.readAsDataURL(this.state.image[0]);
    });

  }

  handleSubmit = (e) => {
    e.preventDefault();

    toast.info('Uploading image...');
    this.uploadImage(this.state.image, 'avatarPhoto', this.props.user._id).then(success=>{
      if(success){
        this.setState({image: false});
        this.props.successCallback();
      }else{
        this.props.errorCallback();
      }
    });

  }

  render(){

    return (
      <form onSubmit={this.handleSubmit} className="profile uploadAvatar">
        {!this.props.loading &&
          <div className="form-group image-group">
            {this.state.imagePreview &&
              <img src={this.state.imagePreview} />
            }
            <label htmlFor="image" className="btn btn-primary">Select Image</label>
            <input type="file" id="image" onChange={e=>{this.selectedImage(e, )}}/>
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
      user = {};
  const handles = [];
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
    user,
  };
})(UploadAvatarTemplate);
