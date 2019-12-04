import React, { Component } from 'react'
import { Grid, Typography, Button, SvgIcon } from '@material-ui/core'

function CloseIcon(props) {
  return (
    <SvgIcon onClick={props.onClick} style={props.style}>
      <path
        fill={"#FFF"}
        d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      />
    </SvgIcon>
  );
}

class CloseCSDT extends Component {

  constructor(props) {
    super();
    this.state = { };

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    let st = {}
    st[e.target.id] = e.target.value
    this.setState(st)
  };

  render() {
    const { onClose, onSubmit } = this.props;

    const classes = {
      container: {
        padding: '30px'
      },
      closeButton: {
        cursor: 'pointer'
      },
      title: {
        marginBottom: '32px',
        color: "#FFF"
      },
      button: {
        marginTop: '32px',
        color: "#FFF"
      },
      infoTitle: {
        marginTop: '12px',
        color: "#FFF"
      },
      infoValue: {
        marginTop: '6px',
        color: "#FFF"
      },
      sepperate: {
        marginTop: '32px'
      }
    }

    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        style={ classes.container }>
        <Grid item xs={10} style={classes.header}>
          <Typography variant="h2" style={ classes.title }>Close CSDT</Typography>
        </Grid>
        <Grid item xs={2} align="right">
          <CloseIcon onClick={onClose} style={ classes.closeButton }/>
        </Grid>
        <Grid item xs={11}>
          <Typography variant="body1">Closing your CSDT requires paying back your outstanding CSDT debt, as well as the accumulated stability fe.</Typography>
        </Grid>
        <Grid item xs={12} style={ classes.sepperate }>
          <Typography variant="body1" style={ classes.infoTitle }>Outstanding CSDT generated</Typography>
          <Typography variant="h3" style={ classes.infoValue }>0.53 CSDT</Typography>
          <Typography variant="body1" style={ classes.infoTitle }>Stability fee @5.0%/year in MKR </Typography>
          <Typography variant="h3" style={ classes.infoValue }>5.00%/year</Typography>
          <Typography variant="body1" style={ classes.infoTitle }>Current price information (FTM/USD)</Typography>
          <Typography variant="h3" style={ classes.infoValue }>183.01 USD</Typography>
          <Typography variant="body1" style={ classes.infoTitle }>Projected liquidation price (FTM/USD)</Typography>
          <Typography variant="h3" style={ classes.infoValue }>0.29 USD</Typography>
          <Typography variant="body1" style={ classes.infoTitle }>Projected collateralization ratio</Typography>
          <Typography variant="h3" style={ classes.infoValue }>92,054.03 %</Typography>
        </Grid>
        <Grid item xs={6} style={ classes.sepperate }>
          <Button
            style={ classes.button }
            variant="text"
            size='medium'
            color='secondary'
            onClick={onClose}
            >
              Cancel
          </Button>
        </Grid>
        <Grid item xs={6} align="right" style={ classes.sepperate }>
          <Button
            style={ classes.button }
            variant="contained"
            size='medium'
            color='primary'
            onClick={onSubmit}
            >
              Close
          </Button>
        </Grid>
      </Grid>
    )
  }
}

export default CloseCSDT
