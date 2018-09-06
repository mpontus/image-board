import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetAuthenticatedUser } from "../selectors";
import { login, logout } from "../actions";
import { User } from "../models";

interface RenderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

interface Props {
  user: User | null;
  login: () => void;
  logout: () => void;
  children: (props: RenderProps) => JSX.Element;
}

const makeMapStateToProps = createStructuredSelector({
  user: makeGetAuthenticatedUser(),
});

const enhance = connect(
  makeMapStateToProps,
  { login, logout }
);

const AuthContainer = ({ user, login, logout, children }: Props) =>
  children({
    user,
    onLogin: login,
    onLogout: logout,
  });

export default enhance(AuthContainer);
