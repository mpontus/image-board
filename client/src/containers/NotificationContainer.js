import * as React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { dismissNotification } from "../actions";
import { makeGetNotificationMessage } from "../selectors";

const makeMapStateToProps = () =>
  createStructuredSelector({
    message: makeGetNotificationMessage(),
  });

const enhance = connect(
  makeMapStateToProps,
  { dismissNotification }
);

const defaultProps = {
  timeout: 5000,
};

class NotificationContainer extends React.Component {
  static defaultProps = defaultProps;

  timeout = null;

  componentDidUpdate(prevProps) {
    if (this.props.message !== prevProps.message && this.props.message) {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(
        this.props.dismissNotification,
        this.props.timeout
      );
    }
  }

  render() {
    const { children, message, dismissNotification } = this.props;

    return children({
      message,
      dismissNotification,
    });
  }
}

export default enhance(NotificationContainer);
