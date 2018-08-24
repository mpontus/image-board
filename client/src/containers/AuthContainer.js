import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetAuthenticatedUser } from "../selectors";
import { login, logout } from "../actions";

const makeMapStateToProps = () =>
  createStructuredSelector({
    user: makeGetAuthenticatedUser()
  });

const enhance = connect(makeMapStateToProps, { login, logout });

const AuthContainer = ({ user, login, logout, children }) =>
  children({ user, login, logout });

export default enhance(AuthContainer);
