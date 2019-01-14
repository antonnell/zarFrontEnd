import * as React from 'react';
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import {colors} from "../../../theme";
import Button from "@material-ui/core/Button";
import {ShareIcon} from "../../../theme/icons";
import IconButton from "@material-ui/core/IconButton";
import {FundingPool} from "../../../types/pooling";

interface OwnProps {
  pool: FundingPool;
}

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing.unit * 3,
      position: "relative"
    },
    tokenText: {
      color: theme.palette.secondary.main,
      textTransform: "uppercase",
      marginLeft: theme.spacing.unit
    },
    authorText: {
      marginTop: theme.spacing.unit
    },
    gridSecondRow: {
      marginTop: theme.spacing.unit * 4
    },
    daysText: {
      marginTop: theme.spacing.unit
    },
    progressGrid: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    progress: {
      color: colors["robin-s-egg"],
      transform: "rotate(-130deg) !important",
    },
    button: {
      minWidth: 80,
      color: colors.dark
    },
    buttonSpacer: {
      margin: theme.spacing.unit
    },
    buttonRow: {
      marginTop: theme.spacing.unit
    },
    shareButton: {
      position: "absolute",
      top: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2
    }
  });

interface Props extends OwnProps, WithStyles<typeof styles> {
}

class PoolCard extends React.Component<Props> {
  public render() {
    const {classes,pool} = this.props;
    console.log(pool);
    return (
      <Paper className={classes.paper}>
        <Grid container direction="row">
          <Grid item xs={6} container direction="column">
            <Grid container direction="row" alignItems="baseline">
              <Typography variant="h5">{pool.name}</Typography>
              <Typography variant="body1" className={classes.tokenText}>{pool.blockchain}</Typography>
            </Grid>
            <Typography variant="subtitle1" className={classes.authorText}><b>AUTHOR</b></Typography>
          </Grid>
          <Grid item xs={6} container direction="column">
            <Grid className={classes.progressGrid}>
              <CircularProgress size={80} className={classes.progress} variant="static" value={95} />
              <Typography variant="h5" style={{position: "absolute"}}>95%</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.gridSecondRow}>
            <Typography variant="subtitle1"><strong>561</strong> Contributors</Typography>
            <Typography variant="subtitle1" className={classes.daysText}><b>51</b> days left</Typography>
          </Grid>
          <Grid item xs={6} className={classes.gridSecondRow}>
            <Typography align="center" variant="subtitle1"><b>$243,398.34</b> Raised</Typography>
            <Grid item container direction="row" justify="center" className={classes.buttonRow}>
              <Button variant="contained" color="secondary" className={classes.button} size="small">join</Button>
              <div className={classes.buttonSpacer} />
              <Button variant="outlined" className={classes.button} color="secondary" size="small" onClick={this.handleViewClick}>view</Button>
            </Grid>
          </Grid>
        </Grid>
          <IconButton className={classes.shareButton}><ShareIcon /></IconButton>
      </Paper>
    );
  }

  handleViewClick = ()=> {
    const {pool:{id}} = this.props;
    window.location.hash = `poolDetails/${id}`;
  }
}

export default withStyles(styles)(PoolCard) as React.ComponentClass<OwnProps>;
