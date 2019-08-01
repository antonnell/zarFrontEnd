import React from "react";
import createReactClass from "create-react-class";
import AssetComponent from "../components/asset";

let Asset = createReactClass({
  getInitialState() {
    return {

    };
  },
  render() {
    return (
      <AssetComponent
        theme={ this.props.theme }
        asset={ this.props.asset }
        viewMode={ this.props.viewMode }
      />
    );
  }
});

export default Asset;
