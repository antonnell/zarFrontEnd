import React, { Component } from 'react';
import {
  SvgIcon,
 } from "@material-ui/core";

 import { colors } from '../theme.js'

function MenuIcon(props) {
  return (
    <SvgIcon style={{ cursor:'pointer', margin: '6px', fontSize: '30px' }} onClick={ props.onClick }>
      <path
        fill={props.color}
        d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
      />
    </SvgIcon>
  );
}

class ApplicationBar extends Component {

  render() {
    if(this.props.size === 'xs' || this.props.size === 'sm') {
      return (
        <div style={this.props.theme.custom.appBar}>
          <MenuIcon onClick={this.props.menuClicked ? this.props.menuClicked : null} color={ colors.darkGray } />
          <img style={{ verticalAlign: 'top', height:43, width:200 }} src={require("../assets/images/xarnetwork_logo_collapsed.png")} alt="Xar.cloud" />
        </div>
      )
    }
    return (
      <div />
    );
  };
}

export default ApplicationBar;
