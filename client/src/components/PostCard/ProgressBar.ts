import * as React from "react";
import styled from "styled-components";

const Background = styled.div`
  background-color: darkgray;
  width: 100%;
  height: 2px;
  margin: 2px 0 4px;
`;

const Foreground = styled.div`
  height: 2px;
  background-color: dodgerblue;
`;

const ProgressBar = ({ progress }) => (
  <Background>
    <Foreground style={{ width: `${progress}%` }} />
  </Background>
);

export default ProgressBar;
