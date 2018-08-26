import * as React from "react";
import styled from "styled-components";

const Backdrop = styled.div.withConfig({
  displayName: "Backdrop"
})`
  position: relative;
  padding-top: ${props => props.ratio * 100}%;
  background-color: ${props => props.theme.lightGray};
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Media = ({ ratio, image }) => (
  <Backdrop ratio={ratio}>
    <Image src={image} />
  </Backdrop>
);

export default Media;
