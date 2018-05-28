const filterEvent = (events, statusFilter, testResultFilter) => {
	events.forEach(event => {
		switch (event.syncStatus) {
			case "Synced":
				event.showed =
					statusFilter.synced && testResultFilter.includes(event.result);
				break;
			case "Pendding":
				event.showed =
					statusFilter.pending && testResultFilter.includes(event.result);
				break;
			case "Rejected":
				event.showed =
					statusFilter.rejected && testResultFilter.includes(event.result);
				break;
			default:
				event.showed =
					statusFilter.noSynced && testResultFilter.includes(event.result);
				break;
		}
	});
	return events;
};

export { filterEvent };
