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
              backgroundColor: green[700]
            }}
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
              backgroundColor: red[500]
            }}
          >
            ABORT SUBMIT
          </Button>
        </div>
      </div>
    );
  }
}
