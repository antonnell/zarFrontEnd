import React, { Component } from 'react';
import { CssBaseline, Grid } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  UNAUTHORISED,
} from './constants'

import customTheme from './theme';

import TheAppBar from './containers/applicationBar.jsx';
import AppDrawer from './containers/drawer.jsx';

import Welcome from './containers/welcome.jsx';
import Accounts from './containers/accounts.jsx';
import Beneficiaries from './containers/beneficiaries.jsx';
import SetUsername from './containers/setUsername.jsx';
import Settings from './containers/settings.jsx';
import Transact from './containers/transact';
// import TokenSwap from './containers/tokenSwap.jsx';
import CSDT from './containers/csdt.jsx';
import AssetManagement from './containers/assetManagement.jsx';

const { emitter, store } = require("./store/xarStore.js");

const setInitialUser = () => {
  const userString = sessionStorage.getItem("xar_user");
  return userString !== null ? JSON.parse(userString) : null;
};

const setInitialTheme = () => {
  let themeString = localStorage.getItem("xar_theme");
  return themeString !== null ? themeString : "light";
};

class App extends Component {
  state = {
    drawerOpen: false,
    user: setInitialUser(),
    uriParameters: {},
    verificationSearching: false,
    currentTheme: setInitialTheme(),
    theme: customTheme[setInitialTheme()],
    transactOpen: false,
    investOpen: false,
    transactAsset: null,
    transactBeneficiary: null,
    transactAccount: null,
  };

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.locationHashChanged = this.locationHashChanged.bind(this);

    this.setUser = this.setUser.bind(this);
    this.logUserOut = this.logUserOut.bind(this);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.navClicked = this.navClicked.bind(this);

    this.transactClicked = this.transactClicked.bind(this);
    this.transactClosed = this.transactClosed.bind(this);
  }

  UNSAFE_componentWillMount() {
    var user = null;
    var userString = sessionStorage.getItem("xar_user");
    if (userString) {
      user = JSON.parse(userString);
      this.setUser(user);
    }

    var currentScreen = window.location.hash.substring(1);
    var paramsIndex = window.location.hash.indexOf("?");
    if (paramsIndex > -1) {
      currentScreen = window.location.hash.substring(1, paramsIndex);
    }
    if (
      ![
        "welcome",
        "resetPassword",
      ].includes(currentScreen)
    ) {
      if (user == null) {
        window.location.hash = "welcome";
      }
    }

    window.removeEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    window.onhashchange = this.locationHashChanged;
    this.locationHashChanged();

    emitter.removeListener(UNAUTHORISED, this.logUserOut)
    emitter.on(UNAUTHORISED, this.logUserOut)
  }

  updateWindowDimensions() {
    var size = "xl";
    if (window.innerWidth < 600) {
      size = "xs";
    } else if (window.innerWidth < 960) {
      size = "sm";
    } else if (window.innerWidth < 1280) {
      size = "md";
    } else  if (window.innerWidth < 1920) {
      size = "lg";
    }

    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      size
    });
  }

  closeDrawer() {
    this.setState({ drawerOpen: false });
  }

  openDrawer() {
    this.setState({ drawerOpen: true });
  }

  navClicked(event, currentScreen) {
    this.setState({ drawerOpen: false });
    window.location.hash = currentScreen;
  }

  logUserOut() {
    window.location.hash = "welcome";
    this.resetStores()
  };

  resetStores() {
    store.setStore({
      user: {},
      accounts: [],
      beneficiaries: [],
      bank_accounts: [],
      bank_account_types: [],
      transactions: [],
      allAssets: [],
      myAssets: []
    })
  }

  setUser(user) {
    this.setState({ user });
    sessionStorage.setItem("xar_user", JSON.stringify(user));

    if(user) {
      //get all things.
      // GET_BANKS, GET_BANK_ACCOUNT_TYPES etc.
    }
  }

  locationHashChanged() {
    const uriParameters = {};
    var currentScreen = "";
    var paramsIndex = window.location.hash.indexOf("?");
    if (paramsIndex > -1) {
      var params = window.location.hash.substring(paramsIndex + 1);
      params.split("&").forEach(pair => {
        var arr = pair.split("=");
        var val = decodeURIComponent(arr[1]);
        if (val.indexOf("'>here</a") > -1) {
          val = val.substring(0, val.length - 9);
        }
        uriParameters[decodeURIComponent(arr[0])] = val;
      });
      currentScreen = window.location.hash.substring(1, paramsIndex);
    } else {
      currentScreen = window.location.hash.substring(1);
    }

    if (["", "welcome", "logOut"].includes(currentScreen)) {
      sessionStorage.removeItem("xar_user");
      this.resetStores()
      this.setState({
        drawerOpen: false,
        user: null
      });
    }

    if ( ![ "welcome", "resetPassword", ].includes(currentScreen) && this.state.user === null ) {
      return (window.location.hash = "welcome");
    }

    this.setState({ currentScreen, uriParameters });
  }

  renderAppBar() {
    var menuClicked = null;
    if (this.state.user != null) {
      menuClicked = this.openDrawer;
    }

    return (
      <TheAppBar
        menuClicked={ menuClicked }
        user={ this.state.user }
        size={ this.state.size }
        title={ this.state.title }
        theme={ this.state.theme }
      />
    );
  }

  renderDrawer() {
    var drawer = null;
    if (this.state.user != null) {
      drawer = (
        <AppDrawer
          navClicked={ this.navClicked }
          currentScreen={ this.state.currentScreen }
          closeDrawer={ this.closeDrawer }
          user={ this.state.user }
          open={ this.state.drawerOpen }
          size={ this.state.size }
          theme={ this.state.theme }
          logUserOut={ this.logUserOut }
        />
      );
    }
    return drawer;
  }

  renderTransact() {
    const { transactOpen, transactAsset, transactBeneficiary, transactAccount, theme, user, supportedERC20Tokens, investOpen } = this.state

    return <Transact
      user={ user }
      theme={ theme }
      isOpen={ transactOpen }
      transactClosed= { this.transactClosed }
      transactAsset={ transactAsset }
      transactBeneficiary={ transactBeneficiary }
      transactAccount={ transactAccount }
      supportedERC20Tokens={ supportedERC20Tokens }
      invest={ investOpen }
    />
  }

  transactClicked(token, beneficiary, account, reason) {
    this.setState({ transactOpen: true, transactAsset: token, transactBeneficiary: beneficiary, transactAccount: (account ? account.uuid: null), investOpen: reason==='Invest' ? true: false })
  }

  transactClosed() {
    this.setState({ transactOpen: false})
  }

  render() {
    let background = "#f9f7f9";
    let backgroundImage = null;
    if (this.state.currentTheme === "dark") {
      backgroundImage =
        "radial-gradient(farthest-corner at 20% 20%, #3d424b, 40%, #1a191d)";
    }

    const { currentScreen } = this.state;
    const path = currentScreen.split('/')[0];
    if(['welcome', 'resetPassword'].includes(path)) {
      return (
        <MuiThemeProvider theme={ createMuiTheme(this.state.theme.mui) }>
          <CssBaseline />
          { this.renderScreen() }
        </MuiThemeProvider>
      )
    }

    return (
      <MuiThemeProvider theme={ createMuiTheme(this.state.theme.mui) }>
        <CssBaseline />
        <div
          style={ {
            minHeight: '100%',
            display: "flex",
            padding:
              this.state.size === "xs" || this.state.size === "sm"
                ? "0px"
                : this.state.theme.custom.page.padding,
            background: background,
            backgroundImage: backgroundImage
          } }
        >
          { this.renderDrawer() }

          { ['csdt'].includes(path) ?
            <Grid
              container
              justify="space-around"
              alignItems="flex-start"
              direction="row"
              style={ {
                minHeight: "924px",
                position: "relative",
                width: ["xs", "sm"].includes(this.state.size) ? '100vw' : this.state.size === "md" ? 'calc(100vw - 325px)' : 'calc(100vw - 325px)',
                marginLeft: ["xs", "sm"].includes(this.state.size) ? '0px' : "48px",
                marginRight: ["xs", "sm"].includes(this.state.size) ? '0px' : "0px"
              } }
            >
              <Grid item xs={ 12 } style={ { flex: 1, height: "100%"  } }>
                { this.state.user == null ? null : this.renderAppBar() }
                <div style={ {
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    height: '100%'
                  } }
                >
                  { this.renderScreen() }
                </div>
              </Grid>
            </Grid>
            :
            <Grid
              container
              justify="space-around"
              alignItems="flex-start"
              direction="row"
              style={ {
                minHeight: "924px",
                position: "relative",
                width: ["xs", "sm"].includes(this.state.size) ? '100vw' : this.state.size === "md" ? 'calc(100vw - 325px)' : 'calc(100vw - 402px)',
                marginLeft: ["xs", "sm"].includes(this.state.size) ? "0px" : this.state.size === "md" ? "24px" : "100px",
                marginRight: ["xs", "sm"].includes(this.state.size) ? "0px" : '24px'
              } }
            >
              <Grid item xs={ 12 } style={ { flex: 1, height: "100%"  } }>
                { this.state.user == null ? null : this.renderAppBar() }
                <div style={ {
                    paddingLeft: ["xs", "sm"].includes(this.state.size) ? "24px" : "0px",
                    paddingRight: ["xs", "sm"].includes(this.state.size) ? "24px" : "0px"
                  } }
                >
                  { this.renderScreen() }
                </div>
              </Grid>
            </Grid>
          }

        </div>
        { this.state.transactOpen && this.renderTransact() }
      </MuiThemeProvider>
    );
  }

  renderScreen() {
    const { currentScreen } = this.state;
    const path = currentScreen.split('/')[0];

    switch (path) {
      case "welcome":
        return <Welcome
        setUser={ this.setUser }
        theme={ this.state.theme }
        />;
      case "setUsername":
        return <SetUsername
         user={ this.state.user }
         setUser={ this.setUser }
         />;
      case "resetPassword":
        return <Welcome
        setUser={ this.setUser }
        theme={ this.state.theme }
        initialScreen='resetPassword'
        uriParameters={ this.state.uriParameters }
        />;
      case "accounts":
        return ( <Accounts
          theme={ this.state.theme }
          size={ this.state.size }
          user={ this.state.user }
          transactOpen={ this.state.transactOpen }
          transactClosed={ this.transactClosed }
          transactClicked={ this.transactClicked }
          transactAsset={ this.state.transactAsset }
          /> )
      case 'beneficiaries':
        return (
          <Beneficiaries
            theme={ this.state.theme }
            user={ this.state.user }
            transactClicked={ this.transactClicked }
            size={ this.state.size }
          />
        );
      case 'csdt':
        return (
          <CSDT
            theme={ this.state.theme }
            user={ this.state.user }
          />
        );
      case 'assetManagement':
        return (
          <AssetManagement
            theme={ this.state.theme }
            user={ this.state.user }
          />
        )
      case "settings":
        return (
          <Settings
            theme={ this.state.theme }
            user={ this.state.user }
            setUser={ this.setUser }
          />
        );
      case "logOut":
        return <Welcome setUser={ this.setUser } />;
      default:
        return <Welcome setUser={ this.setUser } />;
    }
  }
}

export default App;
