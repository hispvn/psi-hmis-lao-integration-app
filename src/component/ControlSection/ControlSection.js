import React from "react";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import { green, red } from "material-ui/colors";

import "./ControlSection.css";

export default class ControlSection extends React.Component {
  render() {
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
              backgroundColor:
                this.props.selectedEventsCount.noSynced > 0 ? green[700] : ""
            }}
            disabled={
              this.props.selectedEventsCount.noSynced > 0 ? false : true
            }
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
