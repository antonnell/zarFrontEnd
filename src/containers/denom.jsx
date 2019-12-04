import React from "react";
import createReactClass from "create-react-class";
import AssetComponent from "../components/denom";

let Denom = createReactClass({
  getInitialState() {
    return {

    };
  },
  render() {

    const {
      theme,
      denom,
      viewMode,
    } = this.props

    return (
      <AssetComponent
        theme={ theme }
        denom={ denom }
        viewMode={ viewMode }
      />
    );
  }
});

export default Denom;
