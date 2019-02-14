import * as React from 'react';
import {Grid} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

interface OwnProps {
}


interface Props extends OwnProps {
}

class Loader extends React.Component<Props> {
  public render() {
    return (
      <Grid container justify="center" style={{flex: 1,height: "100%"}} alignItems="center">
        <CircularProgress size={100}/>
      </Grid>
      )
    ;
  }
}

export default Loader as React.ComponentClass<OwnProps>;
