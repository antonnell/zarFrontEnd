import * as React from 'react';
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import EnhancedTableHead from "./EnhancedTableHead";
import {WithPoolingContext, withPoolingContext} from "../../../../context/PoolingContext";
import {User} from "../../../../types/account";
import {FundingPool, PoolingContractStatus} from "../../../../types/pooling";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";

function desc(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array: any, cmp: any) {
  if (!array) {
    return [];
  }
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any) => el[0]);
}

function getSorting(order: any, orderBy: any) {
  return order === "desc"
    ? (a: any, b: any) => desc(a, b, orderBy)
    : (a: any, b: any) => -desc(a, b, orderBy);
}

const styles = (theme: Theme) =>
  createStyles({
    table: {},
    tableWrapper: {
      position: 'relative'
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  });

interface OwnProps {
  user: User;
}

interface State {
  order: false | "desc" | "asc" | undefined;
  orderBy: string;
  selected: any;
  page: number;
  rowsPerPage: number;
  filtersVisible: boolean;
}

interface Props extends OwnProps, WithStyles<typeof styles>, WithPoolingContext {
}

class Pools extends React.Component<Props, State> {
  readonly state: State = {
    order: "desc",
    orderBy: "id",
    selected: [],
    page: 0,
    rowsPerPage: 5,
    filtersVisible: false,
  };

  componentWillMount(): void {
    const {
      user,
      poolingContext: {
        getManagedFundingPools,
      },
    } = this.props;
    getManagedFundingPools(user.id)

  }

  public render() {
    const {classes, poolingContext: {managedPools,managedPoolsLoading}} = this.props;
    const {order, orderBy, page, rowsPerPage} = this.state;
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, managedPools ? managedPools.length : 0 - page * rowsPerPage);
    return (
      <Grid item xs={12}>
        <Typography variant="h3" style={{marginBottom: "20px"}}>My Pools</Typography>
          <div className={classes.tableWrapper}>
            {managedPoolsLoading && <LinearProgress style={ {
              position: 'absolute',
              width: '100%',
              top: '15px'
            } } />}
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {stableSort(managedPools, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n: FundingPool) => {
                  // console.log(n);
                  let status = PoolingContractStatus[n.status];
                  if (n.pendingTransactions && n.pendingTransactions.length) {
                    if (n.pendingTransactions.findIndex(transaction=>transaction.functionCall === "deployPoolingContract") !== -1) {
                      status = "Deploying";
                    } else if (n.pendingTransactions.findIndex(transaction=>transaction.functionCall === "setDepositsLocked (True)") !== -1) {
                      status = "Locking";
                    } else if (n.pendingTransactions.findIndex(transaction=>transaction.functionCall === "setDepositsLocked (False)") !== -1) {
                      status = "Unlocking";
                    } else if (n.pendingTransactions.findIndex(transaction=>transaction.functionCall === "buyTokens") !== -1) {
                      status = "Sending Funds";
                    } else if (n.pendingTransactions.findIndex(transaction=>transaction.functionCall === "deposit") !== -1) {
                      status = "Processing Deposit";
                    } else if (n.pendingTransactions.findIndex(transaction=>transaction.functionCall === "setTokensReceived") !== -1) {
                      status = "Confirming Tokens";
                    } else if (n.pendingTransactions.findIndex(transaction=>transaction.functionCall === "distributeFunds (0)") !== -1) {
                      status = "Distributing Tokens";
                    }
                  }
                  return (
                    <TableRow hover={!n.isBusy} tabIndex={-1} key={n.id} className={classes.row} onClick={this.handleRowClick(n.isBusy?null:n.id)} style={{cursor: n.isBusy?" not-allowed":"pointer"}}>
                      <TableCell>
                        <Typography
                          variant="body1"
                          noWrap
                        >
                          {n.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          noWrap
                        >
                          {status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          noWrap
                        >
                          {n.blockchain}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={managedPools ? managedPools.length : 0}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
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
      </Grid>
    );
  }

  private handleRequestSort = (event: any, property: string) => {
    const orderBy = property;
    let order: false | "desc" | "asc" | undefined = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({order, orderBy});
  };

  private handleChangePage = (event: any, page: any) => {
    this.setState({page});
  };

  private handleChangeRowsPerPage = (event: any) => {
    this.setState({rowsPerPage: event.target.value});
  };
  private handleRowClick = (id: null|number) => () => {
    if (id !== null) {
      window.location.hash = `updatePool/${id}`;
    }
  };
}

export default withStyles(styles)(withPoolingContext(Pools)) as unknown as React.ComponentClass<OwnProps>;
