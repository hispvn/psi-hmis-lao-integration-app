import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Done } from "@material-ui/icons";
import {
  Button,
  LinearProgress,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  ListItem
} from "@material-ui/core";
import { checkResponsesStatus, responsesErrors } from "../util/util";
import { green, red } from "@material-ui/core/colors";

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    height: 200
  },
  button: {
    margin: theme.spacing.unit
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgb(39, 102, 150)",
    padding: 5
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgb(39, 102, 150)",
    textAlign: "right"
  },
  content: {
    position: "fixed",
    top: 50,
    bottom: 50,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#FFFFFF",
    overflow: "auto",
    padding: 5
  },
  icon: {
    color: "#4cd137",
    fontSize: 16,
    paddingRight: 5
  },
  vl: {
    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
    height: "auto",
    paddingTop: -20,
    marginLeft: 10
  }
});

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false
    };
  }

  confirmClick = () => {
    this.setState({
      showLoader: true
    });
    this.props.handleOnConfirm();
  };

  onClose = () => {
    this.setState({
      showLoader: false
    });
    this.props.handleOnClose();
  };

  render() {
    const { showLoader } = this.state;
    const {
      show,
      classes,
      handleOnClose,
      resSummaries,
      selectedEventsCount,
      type
    } = this.props;
    let content;
    content = (
      <div>
        <LinearProgress
          style={{ opacity: !resSummaries && showLoader ? 1 : 0 }}
        />
        <DialogTitle
          gutterBottom
          variant="display1"
          style={{ color: "#ffffff" }}
        >
          Summaries
          <ListItem divider />
        </DialogTitle>

        <DialogContent>
          <div style={{ display: "flex" }}>
            <div style={{ minWidth: 125 }}>
              {Object.keys(selectedEventsCount).map(key => {
                return (
                  <Typography gutterBottom variant="subheading" style={{}}>
                    <Done
                      className={classes.icon}
                      style={{
                        opacity:
                          resSummaries && checkResponsesStatus(resSummaries)
                            ? 1
                            : 0
                      }}
                    />
                    {key}: {selectedEventsCount[key]}
                  </Typography>
                );
              })}
            </div>
            <div className={classes.vl} />
            <div style={{ marginLeft: 5 }}>
              <Typography gutterBottom style={{ color: "#DC0037" }}>
                {type == "submit"
                  ? 'This action only affect "noSync/rejected" events.'
                  : 'This action only affect "pending" events.'}
              </Typography>
              {responsesErrors(resSummaries).map(res => {
                return res.description;
              })}
            </div>
          </div>
        </DialogContent>
        <ListItem divider />
        <DialogActions>
          {type == "submit" ? (
            <Button
              variant="contained"
              style={{ backgroundColor: green[700], color: "#ffffff" }}
              className={classes.button}
              onClick={this.confirmClick}
              disabled={
                selectedEventsCount.noSynced <= 0 &&
                selectedEventsCount.rejected <= 0
                  ? true
                  : false
              }
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{ backgroundColor: red[500], color: "#ffffff" }}
              className={classes.button}
              onClick={this.confirmClick}
              disabled={selectedEventsCount.pending <= 0 ? true : false}
            >
              Abort Submit
            </Button>
          )}

          <Button
            variant="contained"
            className={classes.button}
            onClick={this.onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </div>
    );

    return (
      <Dialog
        open={show}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <div className={classes.paper} style={getModalStyle()}> */}
        {content}
        {/* </div> */}
      </Dialog>
    );
  }
}

export default withStyles(styles)(Confirmation);
