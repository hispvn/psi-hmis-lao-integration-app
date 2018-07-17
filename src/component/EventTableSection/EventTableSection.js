import React from "react";
import { LinearProgress } from "material-ui/Progress";
import { FormControlLabel } from "material-ui/Form";
import { TablePagination, Paper } from "@material-ui/core";
import Checkbox from "material-ui/Checkbox";
import Tooltip from "material-ui/Tooltip";
import moment from "moment";

import "./EventTableSection.css";

export default class EventTableSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 50
    };
  }

  isSelected = id => this.props.selected.indexOf(id) !== -1;

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  generateEventRows = () => {
    return this.props.events
      .slice(
        this.state.page * this.state.rowsPerPage,
        this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
      )
      .map(event => {
        let rowClassName = "";
        let tooltip = "";
        switch (event.syncStatus) {
          case "Synced":
            rowClassName = "synced";
            tooltip = (
              <div className="tooltip-container">
                Synced date: {moment(event.syncedDate).format("YYYY-MM-DD")}
              </div>
            );
            break;
          case "Pendding":
            rowClassName = "pending";
            break;
          case "Rejected":
            rowClassName = "rejected";
            tooltip = (
              <div className="tooltip-container">
                Rejected reason: {event.syncErrorMessage}
              </div>
            );
            break;
          default:
            break;
        }
        const isSelected = this.isSelected(event.eventId);
        return (
          <Tooltip id="tooltip-bottom" title={tooltip} placement="left">
            <div
              className={`row ${rowClassName}`}
              style={{ display: event.showed ? "" : "none" }}
              onClick={e => this.props.handleEventClick(e, event)}
            >
              <div className="row-item">
                <FormControlLabel
                  control={<Checkbox checked={isSelected} />}
                  label=""
                />
              </div>
              <div className="row-item">{event.eventId}</div>
              <div className="row-item">{event.eventDate}</div>
              <div className="row-item">{event.orgUnit}</div>
              <div className="row-item">{event.district}</div>
              <div className="row-item">{event.age}</div>
              <div className="row-item">{event.gender}</div>
              <div className="row-item">{event.result}</div>
              <div className="row-item">{event.treatment}</div>
            </div>
          </Tooltip>
        );
      });
  };

  render() {
    const { rowsPerPage, page } = this.state;
    return (
      <div className="event-table-container">
        <div>
          <LinearProgress className={this.props.loader} mode="query" />
        </div>
        <Paper elevation={1} id="fixed-header">
          <div className="header-container">
            <div className="header-item">
              <FormControlLabel
                control={
                  <Checkbox onChange={this.props.handleSelectedAllClick} />
                }
                label=""
              />
            </div>
            <div className="header-item">Event id</div>
            <div className="header-item">Event date</div>
            <div className="header-item">Org Unit</div>
            <div className="header-item">District</div>
            <div className="header-item">Age</div>
            <div className="header-item">Gender</div>
            <div className="header-item">RDT Result</div>
            <div className="header-item">Treatment</div>
          </div>
        </Paper>
        {this.props.events.length !== 0 ? (
          <Paper elevation={2} style={{ marginTop: 5 }}>
            {this.generateEventRows()}
            <TablePagination
              component="div"
              count={this.props.events.length}
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
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </Paper>
        ) : (
          ""
        )}
      </div>
    );
  }
}
