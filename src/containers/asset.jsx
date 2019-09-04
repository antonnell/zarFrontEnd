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
      user,
      asset,
      viewMode,
      mintAssetClicked,
      burnAssetClicked,
      owner,
      handleUploadClicked
    } = this.props

    return (
      <AssetComponent
        theme={ theme }
        user={ user }
        asset={ asset }
        viewMode={ viewMode }
        mintAssetClicked={ mintAssetClicked }
        burnAssetClicked={ burnAssetClicked }
        handleUploadClicked={ handleUploadClicked }
        owner={ owner }
      />
    );
  }
});

export default Asset;
