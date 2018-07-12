import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import { Button, LinearProgress } from "@material-ui/core";

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

  render() {
    const { showLoader } = this.state;
    const {
      show,
      classes,
      handleOnClose,
      resSummaries,
      selectedEventsCount
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

          {Object.keys(selectedEventsCount).map(key => {
            return (
              <Typography gutterBottom variant="subheading">
                {key}: {selectedEventsCount[key]}
              </Typography>
            );
          })}
        </div>

        <div className={classes.footer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.confirmClick}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleOnClose}
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
