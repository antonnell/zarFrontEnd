import React, { Component } from 'react';

class ApplicationBar extends Component {

  render() {
    if(this.props.size === 'xs' || this.props.size === 'sm') {
      return (
        <div style={this.props.theme.custom.appBar}>
          <img onClick={this.props.menuClicked ? this.props.menuClicked : null} style={{ verticalAlign: 'middle', height:43, width:200, cursor:'pointer' }} src={require("../assets/images/zarnetwork_logo_collapsed.png")} alt="ZarNetwork.io" />
        </div>
      )
    }
    return (
      <div />
    );
  };
}

export default ApplicationBar;
