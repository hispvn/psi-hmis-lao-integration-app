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
      updateEventSummaries: null,
      selectedEventsCount: {
        synced: 0,
        noSynced: 0,
        pending: 0,
        rejected: 0
      },
      submitType: null,

      page: 0,
      rowsPerPage: 50
    };

    this._testResultFilterOptions = {
      all: ["Pf", "Pv", "Mixed", "Negative"],
      positive: ["Pf", "Pv", "Mixed"],
      negative: ["Negative"]
    };
  }

  eventsCount = events => {
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
    return statusCount;
  };

  handleGetEvent = () => {
    this.setState({
      loader: "loader-show"
    });

    getEvent(this.state.startDate, this.state.endDate).then(events => {
      let eventsFiltered = filterEvent(
        events,
        this.state.statusFilter,
        this._testResultFilterOptions[this.state.testResultFilter]
      );
      this.setState({
        statusCount: this.eventsCount(eventsFiltered),
        events: eventsFiltered,
        loader: "loader-hide"
      });
    });
  };

  clear = () => {
    this.setState({
      selected: [],
      selectedEventsCount: {
        synced: 0,
        noSynced: 0,
        pending: 0,
        rejected: 0
      }
    });
  };

  handleSubmitEvent = async () => {
    let selectedEvents = this.state.events.filter(
      n =>
        this.state.selected.includes(n.eventId) &&
        (n.syncStatus == "No Synced" || n.syncStatus == "Rejected")
    );
    let res = await updateEvent(selectedEvents, "Pendding");
    this.handleGetEvent();
    this.setState({
      updateEventSummaries: res
    });
    this.clear();
  };

  handleAbortSubmitEvent = async () => {
    let selectedEvents = this.state.events.filter(
      n => this.state.selected.includes(n.eventId) && n.syncStatus == "Pendding"
    );
    let res = await updateEvent(selectedEvents, "No Synced");
    this.handleGetEvent();
    this.setState({
      updateEventSummaries: res
    });
    this.clear();
  };

  handleConfirm = type => {
    this.setState({
      submitType: type,
      confirmationShow: true
    });
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
    let newSelected = this.state.events
      .filter(n => n.showed === true)
      .slice(
        this.state.page * this.state.rowsPerPage,
        this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
      )
      .map(n => n.eventId);
    let selectedEvents = this.state.events.filter(n =>
      newSelected.includes(n.eventId)
    );
    if (checked) {
      this.setState({
        selected: newSelected,
        selectedEventsCount: this.eventsCount(selectedEvents)
      });
      return;
    }
    this.setState({ selected: [] });
  };

  handleEventClick = (e, event) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(event.eventId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, event.eventId);
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

    let selectedEvents = this.state.events.filter(n =>
      newSelected.includes(n.eventId)
    );

    this.setState({
      selected: newSelected,
      selectedEventsCount: this.eventsCount(selectedEvents)
    });
  };

  handleConfirmClose = () => {
    this.setState({
      confirmationShow: false,
      updateEventSummaries: null
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    return (
      <div>
        <ControlSection
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          handleChangeDate={this.handleChangeDate}
          handleGetEvent={this.handleGetEvent}
          handleSubmitEvent={e => this.handleConfirm("submit")}
          handleAbortSubmitEvent={e => this.handleConfirm("abortSubmit")}
          selectedEventsCount={this.state.selectedEventsCount}
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
          eventCount={this.state.events}
        />
        <EventTableSection
          events={this.state.events.filter(e => e.showed == true)}
          loader={this.state.loader}
          handleEventClick={this.handleEventClick}
          handleSelectedAllClick={this.handleSelectedAllClick}
          selected={this.state.selected}
          page={this.state.page}
          rowsPerPage={this.state.rowsPerPage}
          handleChangePage={this.handleChangePage}
          handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <Confirmation
          show={this.state.confirmationShow}
          handleOnClose={this.handleConfirmClose}
          handleOnConfirm={
            this.state.submitType == "submit"
              ? this.handleSubmitEvent
              : this.handleAbortSubmitEvent
          }
          type={this.state.submitType}
          resSummaries={this.state.updateEventSummaries}
          selectedEventsCount={this.state.selectedEventsCount}
        />
      </div>
    );
  }
}
