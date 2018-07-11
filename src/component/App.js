import React from "react";
import ControlSection from "./ControlSection/ControlSection";
import FilterSection from "./FilterSection/FilterSection";
import EventTableSection from "./EventTableSection/EventTableSection";
import moment from "moment";
import { getEvent, updateEvent } from "../util/store";
import { filterEvent } from "../util/util";
import Confirmation from "./ConfirmationModal";

import "./App.css";
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      statusFilter: {
        synced: false,
        noSynced: true,
        pending: true,
        rejected: false
      },
      testResultFilter: "all",
      statusCount: {
        synced: 0,
        noSynced: 0,
        pending: 0,
        rejected: 0
      },
      loader: "loader-hide",
      startDate: "2017-08-01",
      endDate: "2017-08-05",
      events: [],
      selected: [],
      filteredEvents: [],
      confirmationShow: false,
      updateEventSummaries: null
    };

    this._testResultFilterOptions = {
      all: ["Pf", "Pv", "Mixed", "Negative"],
      positive: ["Pf", "Pv", "Mixed"],
      negative: ["Negative"]
    };
  }

  handleGetEvent = () => {
    this.setState({
      loader: "loader-show"
    });

    getEvent(this.state.startDate, this.state.endDate).then(events => {
      let statusCount = {
        synced: 0,
        noSynced: 0,
        pending: 0,
        rejected: 0
      };

      events.forEach(event => {
        switch (event.syncStatus) {
          case "Synced":
            statusCount.synced += 1;
            break;
          case "Pendding":
            statusCount.pending += 1;
            break;
          case "Rejected":
            statusCount.rejected += 1;
            break;
          default:
            statusCount.noSynced += 1;
            break;
        }
      });

      this.setState({
        statusCount: statusCount,
        events: filterEvent(
          events,
          this.state.statusFilter,
          this._testResultFilterOptions[this.state.testResultFilter]
        ),
        loader: "loader-hide"
      });
    });
  };

  handleSubmitEvent = async () => {
    let selectedEvents = this.state.events.filter(n =>
      this.state.selected.includes(n.eventId)
    );
    let res = await updateEvent(selectedEvents);
    this.setState({
      updateEventSummaries: res
      // confirmationShow: false
    });
  };

  handleConfirm = () => {
    this.setState({ confirmationShow: true });
  };

  handleChangeDate = type => event => {
    this.setState({
      [type]: moment(event.target.value).format("YYYY-MM-DD")
    });
  };

  handleSelectStatus = type => event => {
    let statusFilter = this.state.statusFilter;
    statusFilter[type] = event.target.checked;

    this.setState({
      statusFilter: statusFilter,
      events: filterEvent(
        this.state.events,
        statusFilter,
        this._testResultFilterOptions[this.state.testResultFilter]
      )
    });
  };

  handleSelectTestResult = event => {
    this.setState({
      testResultFilter: event.target.value,
      events: filterEvent(
        this.state.events,
        this.state.statusFilter,
        this._testResultFilterOptions[event.target.value]
      )
    });
  };

  handleSelectedAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({
        selected: state.events
          .filter(n => n.showed === true)
          .map(n => n.eventId)
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleEventClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    this.setState({
      selected: newSelected
    });
  };

  handleConfirmClose = () => {
    this.setState({
      confirmationShow: false
    });
  };

  render() {
    return (
      <div>
        <ControlSection
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          handleChangeDate={this.handleChangeDate}
          handleGetEvent={this.handleGetEvent}
          handleSubmitEvent={this.handleConfirm}
        />
        <FilterSection
          testResultFilter={this.state.testResultFilter}
          statusCount={this.state.statusCount}
          synced={this.state.statusFilter.synced}
          noSynced={this.state.statusFilter.noSynced}
          pending={this.state.statusFilter.pending}
          rejected={this.state.statusFilter.rejected}
          handleSelectStatus={this.handleSelectStatus}
          handleSelectTestResult={this.handleSelectTestResult}
        />
        <EventTableSection
          events={this.state.events}
          loader={this.state.loader}
          handleEventClick={this.handleEventClick}
          handleSelectedAllClick={this.handleSelectedAllClick}
          selected={this.state.selected}
        />
        <Confirmation
          show={this.state.confirmationShow}
          handleOnClose={this.handleConfirmClose}
          handleOnConfirm={this.handleSubmitEvent}
          resSummaries={this.state.updateEventSummaries}
        />
      </div>
    );
  }
}
