import React from "react";
import { Button, TextField } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";

import "./ControlSection.css";

export default class ControlSection extends React.Component {
  render() {
    const { noSynced, rejected } = this.props.selectedEventsCount;
    return (
      <div className="period-selector-container">
        <div className="period-selector-item">
          <TextField
            value={this.props.startDate}
            label="Start date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            onChange={this.props.handleChangeDate("startDate")}
          />
        </div>
        <div className="period-selector-item">
          <TextField
            value={this.props.endDate}
            label="End date"
            InputLabelProps={{
              shrink: true
            }}
            type="date"
            onChange={this.props.handleChangeDate("endDate")}
          />
        </div>
        <div className="period-selector-item">
          <Button
            variant="raised"
            color="primary"
            style={{ width: 150, fontWeight: "bold" }}
            onClick={this.props.handleGetEvent}
          >
            GET EVENTS
          </Button>
        </div>
        <div className="period-selector-item">
          <Button
            variant="raised"
            style={{
              width: 150,
              fontWeight: "bold",
              color: "white",
              backgroundColor: (noSynced || rejected) > 0 ? green[700] : ""
            }}
            disabled={(noSynced || rejected) > 0 ? false : true}
            onClick={this.props.handleSubmitEvent}
          >
            SUBMIT
          </Button>
        </div>
        <div className="period-selector-item">
          <Button
            variant="raised"
            style={{
              width: 150,
              fontWeight: "bold",
              color: "white",
              backgroundColor:
                this.props.selectedEventsCount.pending > 0 ? red[500] : ""
            }}
            disabled={this.props.selectedEventsCount.pending > 0 ? false : true}
            onClick={this.props.handleAbortSubmitEvent}
          >
            ABORT SUBMIT
          </Button>
        </div>
      </div>
    );
  }
}
