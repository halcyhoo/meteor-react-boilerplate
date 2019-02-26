import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';
import * as _ from 'lodash';
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import EditStatus from '/imports/ui/components/forms/status/EditStatus';
import { formatDate } from '/lib/functions';

class StatusListTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses: [],
      modals: {},
      viewStatusModals: {},
    };
  }

  static propTypes = {
    loading: PropTypes.bool,
    query: PropTypes.object,
    format: PropTypes.string,
    queryOptions: PropTypes.object,
  };

  static defaultProps = {
    loading: true,
    query: {},
    format: 'list',
    queryOptions: {
      sort: {
        createdAt: -1,
      },
    },
  };

  deleteStatus = statusId => {
    Meteor.call('status.delete', statusId, error=>{
      if(error){
        toast.error(error.reason?error.reason:error);
      }else{
        toast.success('Status removed');
      }
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if(!this.props.loading && prevProps != this.props){
      let statuses = Statuses.find(this.props.query, this.props.queryOptions).fetch().map(status=>{
        status.popover = (<Popover className="popover status-popover" id={`popover-status-${status._id}`} title="">
          <strong>Publish date:</strong> {formatDate(status.createdAt)}
          {status.name &&
            <p><strong>Title:</strong> {status.name}</p>
          }
          {status.description &&
            <p><strong>Description:</strong> {status.description}</p>
          }
        </Popover>);
        return status;
      });
      let modals = {};
      let viewStatusModals = {};
      for(let s = 0; s<statuses.length; s++){
        modals[statuses[s]._id] = {show: false};
        viewStatusModals[statuses[s]._id] = {show: false};
      }
      this.setState({...prevState, statuses, viewStatusModals, modals});
    }
  };

  closeModal = statusId => {
    let modals = _.cloneDeep(this.state.modals);
    modals[statusId].show = false;
    this.setState({modals});
  }

  openModal = statusId => {
    let modals = _.cloneDeep(this.state.modals);
    modals[statusId].show = true;
    this.setState({modals});
  }

  closeViewStatusModal = statusId => {
    let viewStatusModals = _.cloneDeep(this.state.viewStatusModals);
    viewStatusModals[statusId].show = false;
    this.setState({viewStatusModals});
  }

  openViewStatusModal = statusId => {
    let viewStatusModals = _.cloneDeep(this.state.viewStatusModals);
    viewStatusModals[statusId].show = true;
    this.setState({viewStatusModals});
  }

  render(){
    return (
      <div>
        {this.props.loading &&
          <ul className={`status ${this.props.format}`}>
            <li><p className="skeleton line"></p></li>
            <li><p className="skeleton line"></p></li>
            <li><p className="skeleton line"></p></li>
          </ul>
        }

        {!this.props.loading && (!this.state.statuses || this.state.statuses.length == 0) &&
          <h4>No status updates yet</h4>
        }

        {!this.props.loading && this.state.statuses && this.state.statuses.length >= 1 &&
          <ul className={`status ${this.props.format}`}>
            {this.state.statuses.map(status=>{
              return <li className={`status item ${((status.image || status.imageUploading) && !status.description && !status.name)?'image-only':((status.image || status.imageUploading) && (status.description || status.name))?'image-text':'text-only'}`} key={status._id}>
                <Modal show={this.state.modals[status._id].show} onHide={()=>this.closeModal(status._id)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Status</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditStatus
                      cancelCallback={()=>this.closeModal(status._id)}
                      successCallback={()=>{this.closeModal(status._id);toast.success('Status Updated');}}
                      status={status}
                    />
                  </Modal.Body>
                </Modal>
                <Modal className="status preview" show={this.state.viewStatusModals[status._id].show} onHide={()=>this.closeViewStatusModal(status._id)}>
                  <Modal.Header closeButton>
                    <Modal.Title>{status.name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {(status.image || status.imageUploading) &&
                      <img src={status.imageUploading?'/img/loading.jpg':status.image} />
                    }

                    {status.description &&
                      <p><strong>Description:</strong>{status.description}</p>
                    }

                    <p><strong>Publish Date:</strong> {formatDate(status.createdAt)}</p>

                  </Modal.Body>
                </Modal>
                {(status.image || status.imageUploading) && !status.description && !status.name &&
                  <div>
                    <OverlayTrigger trigger="hover" placement="right" overlay={status.popover}>
                      <img className="clickable" onClick={()=>this.openViewStatusModal(status._id)} src={status.imageUploading?'/img/loading.jpg':status.image} />
                    </OverlayTrigger>
                    {this.props.user && (this.props.user.isAdmin() || this.props.user._id == status.userId) &&
                      <div className="status-controls group3">
                        <a href="" onClick={e=>{this.deleteStatus(status._id)}}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
                        <a href="" onClick={e=>{this.openModal(status._id)}}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                      </div>
                    }
                  </div>
                }
                {(status.image || status.imageUploading) && (status.description || status.name) &&
                  <div className="row">
                    <div className="image-holder">
                      <OverlayTrigger trigger="hover" placement="right" overlay={status.popover}>
                        <img className="clickable" onClick={()=>this.openViewStatusModal(status._id)} src={status.imageUploading?'/img/loading.jpg':status.image} />
                      </OverlayTrigger>
                    </div>
                    <div className="text-holder">
                      {status.name && <h5>{status.name}</h5>}
                      {status.description && <p>{status.description}</p>}
                      {this.props.user && (this.props.user.isAdmin() || this.props.user._id == status.userId) &&
                        <div className="status-controls group1">
                          <a href="" onClick={e=>{this.deleteStatus(status._id)}}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
                          <a href="" onClick={e=>{this.openModal(status._id)}}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                        </div>
                      }
                    </div>
                    <div className="status-controls group2">
                      <a href="" onClick={e=>{this.deleteStatus(status._id)}}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
                      <a href="" onClick={e=>{this.openModal(status._id)}}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                    </div>
                  </div>
                }
                {!status.image &&
                  <div>
                    <div className="text-holder">
                      <OverlayTrigger trigger="hover" placement="right" overlay={status.popover}>
                        <div className="clickable" onClick={()=>this.openViewStatusModal(status._id)}>
                          {status.name && <h5>{status.name}</h5>}
                          {status.description && <p>{status.description}</p>}
                        </div>
                      </OverlayTrigger>
                      {this.props.user && (this.props.user.isAdmin() || this.props.user._id == status.userId) &&
                        <div className="status-controls group4">
                          <a href="" onClick={e=>{this.deleteStatus(status._id)}}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
                          <a href="" onClick={e=>{this.openModal(status._id)}}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                        </div>
                      }
                    </div>
                  </div>
                }



              </li>;
            })}
          </ul>
        }
      </div>
    );
  }
};

export default withTracker(props => {
  let loading = true,
      user,
      statuses;
  const handles = [
    Meteor.subscribe('user'),
    Meteor.subscribe('statuses.byUser', props.userId?props.userId:false),
  ];

  loading = handles.some(handle => !handle.ready());
  statuses = Statuses.find().fetch();
  if(Meteor.userId()){
    user = Meteor.users.findOne(Meteor.userId());
  }

  return {
    user,
    loading,
    statuses,
  };
})(StatusListTemplate);
