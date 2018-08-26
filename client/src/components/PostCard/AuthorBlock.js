import * as React from "react";
import styled from "styled-components";

const Container = styled.div.withConfig({
  displayName: "Container"
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 ${props => props.theme.space[1]};
  flex: 1;
`;

const Avatar = styled.img.withConfig({
  displayName: "Avatar"
})`
  width: ${props => props.theme.size[1]};
  height: ${props => props.theme.size[1]};
`;

const Name = styled.span.withConfig({
  displayName: "Name"
})`
  padding-left: ${props => props.theme.space[2]};
  font-size: ${props => props.theme.fontSize.normal};
`;

const AuthorBlock = ({ avatarUrl, authorName }) => (
  <Container>
    <Avatar src={avatarUrl} />
    <Name>{authorName}</Name>
  </Container>
);

export default AuthorBlock;
