import * as React from "react";
import styled, { keyframes } from "styled-components";

const { PI } = Math;
const DURATION = 1400;
const COLORS = ["red", "green", "dodgerblue"];

const defaultProps = {
  size: 80
};

/**
 * Animate spinner rotation as a whole
 */
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

/**
 * Extend and collapse the stroke indefinitely
 */
const extend = keyframes`
  0% { 
    stroke-dashoffset: ${PI * 0.8}; 
  }
  50% {
    stroke-dashoffset: ${PI * 0.2};
  }
  100% {
    stroke-dashoffset: ${PI * 0.8};
  }
`;

/**
 * Make the end of the stroke catch up to its original position by making a full circle
 */
const catchUp = keyframes`
  0% {
    transform: rotate(0deg);
  }
  
  50% {
    transform: rotate(72deg);
  }
  
  100% {
    transform: rotate(360deg);
  }
`;

/**
 * Animate spinner color
 */
const colorPercent = i => Math.floor(i / COLORS.length * 100);

const colors = keyframes(
  COLORS.reduce(
    (keyframes, color, i) => ({
      ...keyframes,
      [`${colorPercent(i)}%`]: { stroke: color }
    }),
    {
      "100%": { stroke: COLORS[0] }
    }
  )
);

const prop = key => props => props[key];

const Spinner = styled(props => (
  <svg {...props} viewBox="0 0 1.12 1.12">
    <circle
      fill="none"
      stroke="#000"
      strokeWidth="10%"
      strokeLinecap="round"
      cx="50%"
      cy="50%"
      r="0.5"
    />
  </svg>
)).withConfig({
  displayName: "Spinner"
})`
  width: ${prop("size")}px;
  height: ${prop("size")}px;
  animation: ${rotate} ${DURATION * 1.6}ms linear infinite;

  & > circle {
    stroke-dasharray: ${PI};
    transform-origin: center;
    animation: ${extend} ${DURATION}ms ease-in-out infinite,
      ${catchUp} ${DURATION}ms ease-in-out infinite,
      ${colors} ${DURATION * 8}ms linear infinite;
  }
`;

Spinner.defaultProps = defaultProps;

export default Spinner;
