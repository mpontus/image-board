import * as React from "react";
import styled from "styled-components";
import { MdAdd as AddIcon } from "react-icons/md";
import Button from "../Button";

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 8px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  flex: 1;
  font-size: 16px;
  margin: 0;
  line-height: 1em;
`;

const UploadContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const UploadInput = styled.input`
  bottom: 0;
  cursor: pointer;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const TextButton = styled.button`
  border: none;
  background: transparent;
  padding: 8px;
  font-size: 14px;
  text-transform: uppercase;
`;

const Header = ({
  title,
  isAuthenticated,
  avatarUrl,
  onTitleClick,
  onLoginClick,
  onCreateClick,
  onLogoutClick,
}) => (
  <Container>
    <Title onClick={onTitleClick}>{title}</Title>
    {isAuthenticated ? (
      <React.Fragment>
        <UploadContainer>
          <Button>
            <AddIcon size="24" />
          </Button>
          <UploadInput
            type="file"
            onChange={e =>
              e.target.files.length && onCreateClick(e.target.files[0])
            }
          />
        </UploadContainer>
        <Button onClick={onLogoutClick}>Logout</Button>
      </React.Fragment>
    ) : (
      <TextButton onClick={onLoginClick}>Login</TextButton>
    )}
  </Container>
);

export default Header;
