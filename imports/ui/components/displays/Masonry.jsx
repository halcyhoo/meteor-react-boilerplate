import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Masonry from 'react-masonry-component';

export default class MasonryTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    items: PropTypes.array,
    loading: PropTypes.bool,
    cutOffText: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    loading: true,
    cutOffText: false,
    className: '',
    items: [],
  };


  render(){
    return (
      <div className="masonry-wrapper">
      <Masonry
              className={`masonry row ${this.props.className}`} // default ''
              elementType={'ul'} // default 'div'
          >
            {this.props.items.map((item, i)=>{
              return <li key={i} className="masonry-block col-sm-3">
                <a href={item.linkUrl?item.linkUrl:''} className="masonry-content">
                  {item.image && item.image.url && <img src={item.image.url} />}
                  <div className="text-content">
                    {(item.text || item.title) &&
                      <div className={this.props.cutOffText?'text-wrapper cutoff':'text-wrapper'}>
                        <div className="text">
                          {item.title && <div className="title">{item.title}</div>}
                          {item.text}
                        </div>
                        <div className="fader"></div>
                      </div>
                    }
                    {item.linkText && item.linkUrl && <div className="link"><a href={item.linkUrl}>{item.linkText}</a></div>}
                  </div>
                </a>
              </li>
            })}
          </Masonry>
      </div>
    );
  }
};
