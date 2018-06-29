const moment = require("moment");
let districtMapping = {};

const {
	baseUrl,
	programId,
	authorization,
	credentials,
	metadata
} = require("../config.json");

const getEvent = (startDate, endDate) => {
	return fetch(
		`${baseUrl}/api/events.json?program=${programId}&startDate=${startDate}&endDate=${endDate}&skipPaging=true`,
		{
			credentials: credentials,
			headers: {
				Authorization: authorization
			}
		}
	)
		.then(result => result.json())
		.then(json => {
			json.events.forEach(e => {
				e.checked = false;
				e.showed = true;
			});
			//This code block is for sort events based on both lastUpdated and eventId
			json.events.sort((a, b) => {
				if (
					moment(a.eventDate).format("YYYY-MM-DD") !==
					moment(b.eventDate).format("YYYY-MM-DD")
				) {
					return moment(a.eventDate) < moment(b.eventDate) ? -1 : 1;
				} else {
					if (a.event > b.event) {
						return 1;
					} else {
						return -1;
					}
				}
			});
			return transformFromDhis2(json);
		});
};

const getDistrict = () => {
	console.log("get district");
	return fetch(
		`${baseUrl}/api/programs/${programId}.json?fields=organisationUnits[id,parent[name]]`,
		{
			credentials: credentials,
			headers: {
				Authorization: authorization
			}
		}
	)
		.then(result => result.json())
		.then(json => {
			json.organisationUnits.forEach(ou => {
				districtMapping[ou.id] = ou.parent.name;
			});
		});
};

const transformFromDhis2 = events => {
	let outputEvents = [];
	events.events.forEach(event => {
		let transformedEvent = {
			eventId: event.event,
			eventDate: moment(event.eventDate).format("YYYY-MM-DD"),
			orgUnit: event.orgUnitName,
			district: districtMapping[event.orgUnit],
			showed: true,
			checked: false
		};
		Object.keys(metadata).forEach(prop => {
			transformedEvent[metadata[prop]] = getDataValue(prop, event.dataValues);
		});
		outputEvents.push(transformedEvent);
	});
	return outputEvents;
};

const transformToDhis2 = events => { };

const getDataValue = (dataElementId, dataValues) => {
	let dataValue = dataValues.find(dv => {
		return dv.dataElement === dataElementId;
	});
	if (dataValue) {
		return dataValue.value;
	} else {
		return "";
	}
};

getDistrict();

export { getEvent };
