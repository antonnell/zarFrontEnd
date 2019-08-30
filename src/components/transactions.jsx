import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import config from "../config";
import ListItemText from "@material-ui/core/ListItemText";
import { colors } from '../theme.js';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  if (!array) {
    return [];
  }
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, size } = this.props;
    let rows = [
      {
        id: "timestamp",
        disablePadding: false,
        label: "Date"
      },
      {
        id: "reference",
        disablePadding: false,
        label: "Reference"
      },
      {
        id: "amount",
        disablePadding: false,
        label: "Amount"
      }
    ];

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}

              >
                <Tooltip
                  title="Sort"
                  placement={"bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  },
});

let EnhancedTableToolbar = props => {
  const { classes, toggleFilters, theme } = props;

  return (
    <Toolbar>
      <div style={theme.custom.sectionTitle} className={classes.title}>
        <Typography variant='h2' align='left'>Transactions</Typography>
      </div>
      <div className={classes.spacer} />
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = () => ({});

class EnhancedTable extends React.Component {
  state = {
    order: "desc",
    orderBy: "timestamp",
    selected: [],
    data: this.props.transactions,
    page: 0,
    rowsPerPage: 5,
    filtersVisible: false
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleToggleFilters = () => {
    this.setState({ filtersVisible: !this.state.filtersVisible });
  };

  render() {
    const { classes, theme, size } = this.props;
    const {
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      filtersVisible
    } = this.state;
    const data = this.props.transactions;

    let divStyle = {
      display: 'inline-block',
      minWidth: '42px'
    }

    return (
      <div className={classes.root}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          toggleFilters={this.handleToggleFilters}
          theme={theme}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data ? data.length : 0}
              theme={theme}
              size={size}
            />
            <TableBody>
              {stableSort(
                data,
                getSorting(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {

                  let url = config.explorerURL + n.transactionId

                  return (
                    <TableRow hover tabIndex={-1} key={n.transactionId}>
                      <TableCell>
                        <div style={divStyle}>
                          <img
                            alt=""
                            src={ require('../assets/images/Bitcoin-logo.png') }
                            height="30px"
                            style={{marginRight: '12px'}}
                          />
                        </div>
                        <div style={divStyle}>
                          <Typography variant="body1" style={{ fontFamily: 'Montserrat-SemiBold' }}>
                            {n.type}
                          </Typography>
                          <Typography variant="subtitle2">
                            {moment(n.created).format("YYYY/MM/DD hh:mm")}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" noWrap style={{ maxWidth: size==='lg'?'530px':'auto' }}>
                          {n.reference}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{n.amount + ' ' + n.symbol}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data ? data.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
