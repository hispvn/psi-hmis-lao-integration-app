import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import { Done } from "@material-ui/icons";
import { Button, LinearProgress } from "@material-ui/core";
import { checkResponsesStatus, responsesErrors } from "../util/util";
import { green, red } from "material-ui/colors";

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
    backgroundColor: "#abcdef",
    padding: 5
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#abcdef",
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
    borderLeft: "6px solid green",
    height: 500,
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
        <div className={classes.header}>
          <Typography gutterBottom variant="display1">
            Review
          </Typography>
        </div>

        <div className={classes.content}>
          <LinearProgress
            style={{ opacity: !resSummaries && showLoader ? 1 : 0 }}
          />
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
                  ? 'This action only affect "noSync" events.'
                  : 'This action only affect "pending" events.'}
              </Typography>
              {responsesErrors(resSummaries).map(res => {
                return res.description;
              })}
            </div>
          </div>
        </div>

        <div className={classes.footer}>
          {type == "submit" ? (
            <Button
              variant="contained"
              style={{ backgroundColor: green[700], color: "#ffffff" }}
              className={classes.button}
              onClick={this.confirmClick}
              disabled={selectedEventsCount.noSynced <= 0 ? true : false}
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
        </div>
      </div>
    );

    return (
      <div>
        <Modal open={show}>
          <div className={classes.paper} style={getModalStyle()}>
            {content}
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(Confirmation);
