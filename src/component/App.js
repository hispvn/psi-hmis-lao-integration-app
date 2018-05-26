import React from "react";
import ControlSection from "./ControlSection/ControlSection";
import FilterSection from "./FilterSection/FilterSection";
import EventTableSection from "./EventTableSection/EventTableSection";
import moment from "moment";
import { getEvent } from "../util/store";

import "./App.css";
export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            statusFilter: {
                synced: true,
                noSynced: true,
                pending: true,
                rejected: true
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
            endDate: "2017-08-10",
            events: [],
            filteredEvents: []
        };
    }

    handleGetEvent = () => {
        this.setState({
            loader: "loader-show",
        })
        getEvent(this.state.startDate, this.state.endDate)
            .then(events => {
                let statusCount = {
                    synced: 0,
                    noSynced: 0,
                    pending: 0,
                    rejected: 0
                };

                events.forEach(event => {
                    switch (event.syncStatus) {
                        case "Synced": statusCount.synced += 1; break;
                        case "Pendding": statusCount.pending += 1; break;
                        case "Rejected": statusCount.rejected += 1; break;
                        default: statusCount.noSynced += 1; break;
                    }
                });

                this.setState({
                    statusCount: statusCount,
                    events: events,
                    loader: "loader-hide",
                })
            })
    }

    handleChangeDate = type => event => {
        this.setState({
            [type]: moment(event.target.value).format("YYYY-MM-DD")
        });
    }

    handleSelectStatus = type => event => {
        let statusFilter = this.state.statusFilter;
        statusFilter[type] = event.target.checked;
        this.setState({
            statusFilter: statusFilter
        });
    }

    handleSelectTestResult = event => {
        this.setState({
            testResultFilter: event.target.value
        });
    }

    render() {
        return (
            <div>
                <ControlSection
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    handleChangeDate={this.handleChangeDate}
                    handleGetEvent={this.handleGetEvent}
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
                />
            </div>
        );
    }
}