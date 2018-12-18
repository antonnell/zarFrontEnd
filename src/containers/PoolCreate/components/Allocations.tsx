import * as React from 'react';
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {PoolCreateHandleChange} from "../PoolCreate";

interface OwnProps {
  minContribution: number;
  maxContribution: number;
  transactionFee: number;
  handleChange: PoolCreateHandleChange;
}

const styles = (theme: Theme) =>
    createStyles({
      separator: {
        marginTop: theme.spacing.unit * 5
      }
    });

interface Props extends OwnProps, WithStyles<typeof styles> {
}

class Allocations extends React.Component<Props> {
  public render() {
    const {classes,minContribution,maxContribution,transactionFee,handleChange} = this.props;
    return (
        <Grid item xs={12} md={5} className={classes.separator}>
            <Grid item>
              <Typography variant="h2">Allocations</Typography>
            </Grid>
            <Grid item>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Minimum Contribution"
                  value={minContribution}
                  onChange={handleChange("minContribution")}
                  inputProps={{type: "number"}}
                  InputLabelProps={{shrink: true}}
                  placeholder="100"
              />
            </Grid>
            <Grid item>
              <TextField
                  required
                  fullWidth
                  label="Maximum Contribution"
                  value={maxContribution}
                  onChange={handleChange("maxContribution")}
                  margin="normal"
                  inputProps={{type: "number"}}
                  InputLabelProps={{shrink: true,}}
                  placeholder="1000"
              />
            </Grid>
            <Grid item>
              <TextField
                  required
                  fullWidth
                  label="Transaction Fee"
                  value={transactionFee}
                  onChange={handleChange("transactionFee")}
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                  placeholder="5"
                  inputProps={{type: "number"}}
                  InputProps={{endAdornment: <Typography>%</Typography>}}
              />
            </Grid>
        </Grid>
    );
  }
}

export default withStyles(styles)(Allocations) as React.ComponentClass<OwnProps>;
