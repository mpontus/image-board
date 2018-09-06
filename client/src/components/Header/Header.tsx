import * as React from "react";
import { Flex, Box, Text } from "rebass";

interface Props {
  isAuthenticated: boolean;
  onLoginClick?: (e: React.SyntheticEvent) => void;
  onLogoutClick?: (e: React.SyntheticEvent) => void;
  onFileChange?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}

const Header = ({
  isAuthenticated,
  onLoginClick,
  onLogoutClick,
  onFileChange
}: Props) => (
    <Flex is="header">
      <Box flex="1">
        <Text is="h1">Image Board</Text>
      </Box>
      <Box>
        {isAuthenticated ? (
          <React.Fragment>
            <label>
              <span role="button" aria-controls="filename" tabIndex={0}>
                Upload Picture
            </span>
              <input data-testid="upload" type="file" onChange={onFileChange} />
            </label>
            <button onClick={onLogoutClick}>Logout</button>
          </React.Fragment>
        ) : (
            <button onClick={onLoginClick}>Login</button>
          )}
      </Box>
    </Flex>
  );

export default Header;
