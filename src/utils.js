const moment = require("moment");
const React = require("react");
const _ = require("lodash");

import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';

const {
    baseUrl,
    programId,
    authorization
} = require("./config.json");


const getEvents = (startDate, endDate) => {
    return fetch(`${baseUrl}/api/events.json?program=${programId}&startDate=${startDate}&endDate=${endDate}&skipPaging=true&order=lastUpdated:DESC`, {
        credentials: "same-origin",
        headers: {
            Authorization: authorization
        },
        compress: false
    })
        .then(result => result.json())
        .then(json => {
            json.events.forEach(e => {
                e.checked = false;
                e.showed = true;
            });
            json.events.sort((a, b) => {
                if (moment(a.eventDate).format("YYYY-MM-DD") !== moment(b.eventDate).format("YYYY-MM-DD")) {
                    return moment(a.eventDate) < moment(b.eventDate) ? -1 : 1;
                }
                else {
                    if (a.event > b.event) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            })
            return json.events;
        });
};

const getDistricts = () => {
    return fetch(`${baseUrl}/api/programs/${programId}.json?fields=organisationUnits[id,parent[name]]`, {
        credentials: "same-origin",
        headers: {
            Authorization: authorization
        }
    })
        .then(result => result.json())
        .then(json => {
            let o = {};
            json.organisationUnits.forEach(ou => {
                o[ou.id] = ou.parent.name;
            });
            return o;
        });
};

const generateEventRows = (component) => {
    let rows = [];
    component.state.events.forEach((event, index) => {
        if (event.showed === false) {
            return;
        }
        let eventId = event.event;
        let eventDate = (!event.eventDate) ? "" : moment(event.eventDate).format("YYYY-MM-DD");
        let age = "";
        let gender = "";
        let rdtResult = "";
        let treatment = "";
        let status = "";
        let syncDate = "";
        let syncErrorMessage = "";
        let orgUnitName = event.orgUnitName;
        let district = component.state.districtMapping[event.orgUnit];
        event.dataValues.forEach(dataValue => {
            switch (dataValue.dataElement) {
                case "qQngeCbT4uI":
                    age = dataValue.value;
                    break;
                case "lNcuFJPKhp9":
                    gender = dataValue.value;
                    break;
                case "FPNbkUi9D55":
                    rdtResult = dataValue.value;
                    break;
                case "TzL693oH3D9":
                    treatment = dataValue.value;
                    break;
                case "MLbNyweMihi":
                    status = dataValue.value;
                    break;
                case "N5B5r1okTqq":
                    syncDate = dataValue.value;
                    break;
                case "hjSIBxruyJA":
                    syncErrorMessage = dataValue.value;
                    break;

            }
        });
        let className = "";
        let disableCheckbox = false;
        let tooltip = false;
        let tooltipText = "";
        switch (status) {
            case "Synced":
                className = "synced";
                disableCheckbox = true;
                event.canBeChecked = false;
                tooltip = true;
                tooltipText = `Synced date: ${moment(syncDate).format("YYYY-MM-DD")}`;
                break;
            case "Rejected":
                className = "rejected";
                tooltip = true;
                tooltipText = `Rejected reason: ${syncErrorMessage}`;
                break;
            case "Pendding":
                className = "pending";
                break;
        }
        event.canBeChecked = !disableCheckbox;
        rows.push(
            <Tooltip key={index} title={<div className="tooltip-container">{tooltipText}</div>} placement="left" disableTriggerFocus={!tooltip} disableTriggerHover={!tooltip}>
                <div className={`row ${className}`} onClick={component.handleCheck(index, disableCheckbox)}>
                    <div className="row-item">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={component.state.events[index].checked}
                                    disabled={disableCheckbox}
                                />
                            }
                            label=""
                        />
                    </div>
                    <div className="row-item">{eventId}</div>
                    <div className="row-item">{eventDate}</div>
                    <div className="row-item">{orgUnitName}</div>
                    <div className="row-item">{district}</div>
                    <div className="row-item">{age}</div>
                    <div className="row-item">{gender}</div>
                    <div className="row-item">{rdtResult}</div>
                    <div className="row-item">{treatment}</div>
                </div>
            </Tooltip>
        );
    });
    return rows;
};

const filter = (filteredByStatus, filteredByTestResult, events) => {
    let results = [];
    let status = [];
    switch (filteredByTestResult) {
        case "positive":
            results = ["Pf", "Pv", "Mixed"];
            break;
        case "negative":
            results = ["Negative"];
            break;
        case "all":
            results = ["Pf", "Pv", "Mixed", "Negative"];
            break;
    }

    Object.keys(filteredByStatus).forEach(key => {
        if (filteredByStatus[key] === true) {
            status.push(key);
        }
    });

    events.forEach(e => {
        let testResultIndex = _.findIndex(e.dataValues, o => {
            return o.dataElement === "FPNbkUi9D55";
        });

        if (testResultIndex === -1) {
            return;
        }

        let statusIndex = _.findIndex(e.dataValues, o => {
            return o.dataElement === "MLbNyweMihi";
        });

        if (statusIndex === -1) {
            if (results.includes(e.dataValues[testResultIndex].value) && status.includes("No Synced")) {
                e.showed = true;
            } else {
                e.showed = false;
            }
        } else {
            if (results.includes(e.dataValues[testResultIndex].value) && status.includes(e.dataValues[statusIndex].value)) {
                e.showed = true;
            } else {
                e.showed = false;
            }
        }
    });

    return events;
};

const pushEvents = (payload) => {
    return fetch(`${baseUrl}/api/events`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            Authorization: authorization,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        compress: false
    })
        .then(result => result.json())
        .then(json => {
            return json;
        });
};

const checkEvents = (events, condition1, condition2) => {
    eventIds = [];
    eventsToCompare = {};
    eventsToReturn = [];
    payload = {
        events: []
    };

    events.forEach(e => {
        if (e.checked) {
            eventIds.push(e.event);
        }
    });

    _.chunk(eventIds, 50);
    let promises = [];
    eventIds.forEach(ids => {
        let api = `${baseUrl}/api/events.json?event=`;
        ids.forEach(id => {
            api += `${id};`;
        });
        api = api.slice(0, -1);
        promises.push(fetch(api, {
            credentials: "same-origin",
            headers: {
                Authorization: authorization
            },
            compress: false
        })
            .then(result => result.json())
            .then(json => {
                json.events.forEach(e => {
                    eventsToCompare[e.event] = e;
                });
            })
        );
    });

    return Promise.all(promises)
        .then(() => {
            events.forEach(e => {
                if (e.checked) {
                    let dataValueIndex = _.findIndex(eventsToCompare[e.event].dataValues, dv => {
                        return dv.dataElement === "MLbNyweMihi";
                    });
                    if (dataValueIndex === -1) {
                        eventsToReturn.push(e);
                    } else {
                        let status = eventsToCompare[e.event].dataValues[dataValueIndex].value;
                        if ([condition1, condition2].includes(status)) {
                            eventsToReturn.push(e);
                        }
                    }
                }
            });

            eventToReturn
        });

};

const checkStatus = (events, type) => {
    let checkedEvents = "";
    let returnedEvents = [];
    events.forEach(e => {
        if (e.checked === true) {
            checkedEvents += e.event + ";"
        }
    });

    return fetch(`${baseUrl}/api/events.json?event=${checkedEvents}&skipPaging=true`, {
        credentials: "same-origin",
        headers: {
            Authorization: authorization
        },
        compress: false
    })
        .then(res => res.json())
        .then(json => {
            json.events.forEach(e => {
                if (type === "submit") {
                    let dataValueIndex = _.findIndex(e.dataValues, dv => {
                        return dv.dataElement === "MLbNyweMihi";
                    });
                    if (dataValueIndex === -1 || e.dataValues[dataValueIndex].value === "No Synced" || e.dataValues[dataValueIndex].value === "Rejected") {
                        returnedEvents.push(e);
                        return;
                    }
                } else {
                    let dataValueIndex = _.findIndex(e.dataValues, dv => {
                        return dv.dataElement === "MLbNyweMihi";
                    });
                    if (e.dataValues[dataValueIndex].value === "Pendding") {
                        returnedEvents.push(e);
                        return;
                    }
                }
            });
            return returnedEvents;
        });
};


module.exports = {
    getEvents,
    getDistricts,
    generateEventRows,
    filter,
    pushEvents,
    checkStatus
};