import * as React from "react";
import styled from "styled-components";

const Button = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${props => props.color};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 40px;
  padding: 0 4px;
  text-transform: uppercase;

  & > svg {
    margin: 0 4px;
  }
`;

Button.defaultProps = {
  color: "gray",
};

export default Button;
