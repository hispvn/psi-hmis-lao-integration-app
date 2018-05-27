const filterEvent = (events, statusFilter) => {
  events.forEach(event => {
    switch (event.syncStatus) {
      case "Synced":
        event.showed = statusFilter.synced;
        break;
      case "Pendding":
        event.showed = statusFilter.pending;
        break;
      case "Rejected":
        event.showed = statusFilter.rejected;
        break;
      default:
        event.showed = statusFilter.noSynced;
        break;
    }
  });
  return events;
};

export { filterEvent };
