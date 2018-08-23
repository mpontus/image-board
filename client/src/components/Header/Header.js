import * as React from "react";
import { MdAdd as AddIcon } from "react-icons/md";
import "./Header.css";

const Header = ({
  title,
  isAuthenticated,
  avatarUrl,
  onTitleClick,
  onLoginClick,
  onCreateClick,
  onLogoutClick
}) => (
  <div className="header">
    <h1 className="header__title" onClick={onTitleClick}>
      {title}
    </h1>
    {isAuthenticated ? (
      <React.Fragment>
        <div className="header__upload-container">
          <div className="header__icon-button">
            <AddIcon className="header__icon" />
          </div>
          <input
            className="header__upload-input"
            type="file"
            onChange={e => onCreateClick(e.target.files[0])}
          />
        </div>
        <div className="header__text-button" onClick={onLogoutClick}>
          Logout
        </div>
      </React.Fragment>
    ) : (
      <div className="header__text-button" onClick={onLoginClick}>
        Login
      </div>
    )}
  </div>
);

export default Header;
