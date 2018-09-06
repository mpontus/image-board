import * as React from "react";
import { Flex, Box, Text } from "rebass";

interface Props {
  isAuthenticated: boolean;
  onLoginClick?: (e: React.SyntheticEvent) => void;
  onLogoutClick?: (e: React.SyntheticEvent) => void;
}

const Header = ({ isAuthenticated, onLoginClick, onLogoutClick }: Props) => (
  <Flex is="header">
    <Box flex="1">
      <Text is="h1">Image Board</Text>
    </Box>
    <Box>
      {isAuthenticated ? (
        <button onClick={onLogoutClick}>Logout</button>
      ) : (
          <button onClick={onLoginClick}>Login</button>
        )}
    </Box>
  </Flex>
);

export default Header;
