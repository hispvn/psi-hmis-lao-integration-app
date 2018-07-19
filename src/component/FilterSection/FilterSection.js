import React from "react";
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Input,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";

import "./FilterSection.css";

export default class FilterSection extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="filter-container">
        <div>
          <strong>Filter by status: </strong>
        </div>
        <div>
          <FormGroup row>
            <FormControlLabel
              disabled={this.props.statusCount.synced === 0}
              style={{ marginLeft: 10 }}
              control={
                <Checkbox
                  checked={this.props.synced}
                  onChange={this.props.handleSelectStatus("synced")}
                />
              }
              label={`Synced (${this.props.statusCount.synced})`}
            />
            <FormControlLabel
              disabled={this.props.statusCount.noSynced === 0}
              style={{ marginLeft: 10 }}
              control={
                <Checkbox
                  checked={this.props.noSynced}
                  onChange={this.props.handleSelectStatus("noSynced")}
                />
              }
              label={`Not Synced (${this.props.statusCount.noSynced})`}
            />
            <FormControlLabel
              disabled={this.props.statusCount.rejected === 0}
              style={{ marginLeft: 10 }}
              control={
                <Checkbox
                  checked={this.props.rejected}
                  onChange={this.props.handleSelectStatus("rejected")}
                />
              }
              label={`Rejected (${this.props.statusCount.rejected})`}
            />
            <FormControlLabel
              disabled={this.props.statusCount.pending === 0}
              style={{ marginLeft: 10 }}
              control={
                <Checkbox
                  checked={this.props.pending}
                  onChange={this.props.handleSelectStatus("pending")}
                />
              }
              label={`Pending (${this.props.statusCount.pending})`}
            />
          </FormGroup>
        </div>
        <div>
          <FormControl
            style={{ marginLeft: 50, minWidth: 275 }}
            disabled={this.props.eventCount <= 0}
          >
            <InputLabel htmlFor="test-result-filer">
              Filter by test result
            </InputLabel>
            <Select
              value={this.props.testResultFilter}
              onChange={this.props.handleSelectTestResult}
              input={<Input id="test-result-filer" />}
            >
              <MenuItem value={"all"}>
                Both Positive and Negative cases
              </MenuItem>
              <MenuItem value={"positive"}>Only Positive cases</MenuItem>
              <MenuItem value={"negative"}>Only Negative cases</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    );
  }
}
