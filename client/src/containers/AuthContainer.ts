import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { login, logout } from "../actions";
import { User } from "../models";
import { makeGetAuthenticatedUser } from "../selectors";

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
  user: makeGetAuthenticatedUser()
});

const enhance = connect(
  makeMapStateToProps,
  { login, logout }
);

const AuthContainer = ({
  user,
  login: onLogin,
  logout: onLogout,
  children
}: Props) =>
  children({
    user,
    onLogin,
    onLogout
  });

export default enhance(AuthContainer);
