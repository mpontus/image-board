import * as React from "react";
import styled from "styled-components";

const IconButton = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;

  & > svg {
    color: ${props => props.theme.colors[props.color]};
  }
`;

IconButton.defaultProps = {
  color: "black"
};

export default IconButton;
