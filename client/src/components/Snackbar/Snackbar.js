import styled, { keyframes } from "styled-components";

const appear = keyframes`
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
`;

const Snackbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: orangered;
  color: white;

  animation: ${appear} 80ms linear;
  transform-origin: bottom;
`;

export default Snackbar;
