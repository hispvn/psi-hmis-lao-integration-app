import React from "react";
import { LinearProgress } from "material-ui/Progress";
import Paper from "material-ui/Paper";
import { FormControlLabel } from "material-ui/Form";
import Checkbox from "material-ui/Checkbox";
import Tooltip from "material-ui/Tooltip";
import moment from "moment";

import "./EventTableSection.css";

export default class EventTableSection extends React.Component {
  constructor() {
    super();
    this.state = {
      events: []
    };
  }

  generateEventRows = () => {
    return this.props.events.map(event => {
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

      return (
        <Tooltip id="tooltip-bottom" title={tooltip} placement="left">
          <div
            className={`row ${rowClassName}`}
            style={{ display: event.showed ? "" : "none" }}
          >
            <div className="row-item">
              <FormControlLabel control={<Checkbox />} label="" />
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
                  <Checkbox
                    checked={this.state.checkAll}
                    onChange={this.handleCheckAll}
                  />
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
          </Paper>
        ) : (
          ""
        )}
      </div>
    );
  }
}
