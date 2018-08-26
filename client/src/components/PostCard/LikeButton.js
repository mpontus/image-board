import * as React from "react";
import styled from "styled-components";
import { MdFavorite as FavoriteIcon } from "react-icons/md";
import IconButton from "../IconButton";

const Container = styled.div.withConfig({
  displayName: "Container"
})`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Count = styled.span.withConfig({
  displayName: "Count"
})`
  color: ${props => props.theme.colors[props.color]};
  padding-right: ${props => props.theme.space[1]};
`;

Count.defaultProps = {
  color: "black"
};

const LikeButton = ({ active, count, onClick }) => (
  <Container onClick={onClick}>
    <Count color={active ? "gray" : "hotpink"}>{count}</Count>
    <IconButton color={active ? "gray" : "hotpink"}>
      <FavoriteIcon size="24" />
    </IconButton>
  </Container>
);

export default LikeButton;
