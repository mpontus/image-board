import * as React from "react";

const Header = ({
  title,
  isAuthenticated,
  avatarUrl,
  onTitleClick,
  onLoginClick,
  onCreateClick,
  onAvatarClick
}) => (
  <div>
    <h1 onClick={onTitleClick}>{title}</h1>
    {isAuthenticated ? (
      <div>
        <input type="file" onChange={e => onCreateClick(e.target.files[0])} />
        <div onClick={onAvatarClick}>{avatarUrl}</div>
      </div>
    ) : (
      <div onClick={onLoginClick}>Login</div>
    )}
  </div>
);

export default Header;
