import React, { Component } from 'react';
import {
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  Grid
} from '@material-ui/core';
import { version } from "../version";
import ScrollArea  from 'react-scrollbar';

class AppDrawer extends Component {
  componentDidMount() {
    if (this.props.user == null) {
      window.location.hash = 'welcome';
    }
  }

  render() {
    let { user, size, open,  closeDrawer, theme } = this.props

    if (user == null) {
      return null;
    }

    return size === 'xs' || size === 'sm' ? (
      <Drawer
        open={ open }
        onClose={ closeDrawer }
      >
        <ScrollArea horizontal={false} style={{ height: '100%' }} >
          { this.renderGridList() }
        </ScrollArea>
      </Drawer>
    ) : (
      <div style={ theme.custom.drawerContainer }>
        { this.renderGridList() }
      </div>
    );
  }

  renderTop() {
    let { user } = this.props
    return (
      <div style={ { padding: '24px', marginBottom: '8px' } }>
        <Grid container justify="center" alignItems="center" style={ { paddingTop: 24 } } direction="column">
          <Typography variant="h1" style={ { paddingBottom: 16 } }>ZAR Network</Typography>
          <div style={ { width: '50px', height: '50px', borderRadius: '25px', background: '#ECECEC', position: 'relative', backgroundImage: 'url("' + user.profilePhoto + '")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' } }>
          </div>
          <Typography variant="h1" style={ { paddingTop: 16 } }>{ user.username }</Typography>
        </Grid>
      </div>
    )
  }

  renderBottom() {
    return this.renderList();
  }

  renderList() {
    let { currentScreen, navClicked, theme, logUserOut } = this.props
    const path = currentScreen.split('/')[0];

    return (
      <List style={ { height: "calc(100% - 173px)" } }>
        <ListSubheader disableSticky={ true }>MENU</ListSubheader>
        <ListItem
          selected={ ['accounts', 'binanceAccounts', 'ethAccounts'].includes(path) }
          button
          onClick={ event => {
            navClicked(event, 'accounts');
          } }
        >
          <ListItemText primary="Accounts" />
        </ListItem>
        <ListItem
          selected={ path === 'beneficiaries' }
          button
          onClick={ event => {
            navClicked(event, 'beneficiaries');
          } }
        >
          <ListItemText primary="Beneficiaries" />
        </ListItem>
        {/*<ListItem
          selected={ ['tokenSwap'].includes(path) }
          button
          onClick={ event => {
            navClicked(event, 'tokenSwap');
          } }
        >
          <ListItemText primary="Token Swap" />
        </ListItem>*/}
        <ListItem
          selected={ ['assetManagement'].includes(path) }
          button
          onClick={ event => {
            navClicked(event, 'assetManagement');
          } }
        >
          <ListItemText primary="Asset Management" />
        </ListItem>

        <Divider />
        <ListSubheader disableSticky={ true }>PROFILE</ListSubheader>
        <ListItem
          selected={ path === 'settings' }
          button
          onClick={ event => {
            navClicked(event, 'settings');
          } }
        >
          <ListItemText primary="Settings" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={ event => {
            logUserOut();
          } }
          style={theme.custom.logout}
        >
          <ListItemText primary="Log Out" style={theme.custom.logoutText} />
        </ListItem>
        <Typography
          variant="body1"
          align="justify"
          style={{
            marginTop: '24px',
            color: "#fff",
            fontSize: '14px'
          }}
        >
          V{version}-beta
        </Typography>
      </List>
    );
  }

  renderGridList() {
    return (
      <div style={ this.props.theme.custom.drawer }>
        { this.renderTop() }
        { this.renderBottom() }
      </div>
    );
  }
}

export default AppDrawer;
