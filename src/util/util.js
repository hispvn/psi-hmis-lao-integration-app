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
  events = events.filter(e => e.result != "");
  return events;
};

const checkResponsesStatus = responses => {
  if (responses.httpStatus != "OK" || responses.httpStatusCode != 200) {
    return false;
  }
  return true;
};

const responsesErrors = responses => {
  let errors = [];
  if (responses) {
    errors = responses.response.importSummaries.filter(
      n => n.status == "ERROR"
    );
  }
  return errors;
};

export { filterEvent, checkResponsesStatus, responsesErrors };
