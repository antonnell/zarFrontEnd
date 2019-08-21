import React from "react";
import createReactClass from "create-react-class";
import AssetComponent from "../components/asset";

let Asset = createReactClass({
  getInitialState() {
    return {

    };
  },
  render() {

    const {
      theme,
      asset,
      viewMode,
      mintAssetClicked,
      burnAssetClicked
    } = this.props

    return (
      <AssetComponent
        theme={ theme }
        asset={ asset }
        viewMode={ viewMode }
        mintAssetClicked={ mintAssetClicked }
        burnAssetClicked={ burnAssetClicked }
      />
    );
  }
});

export default Asset;
