import * as React from "react";
import styled from "styled-components";
import Media from "./Media";
import AuthorBlock from "./AuthorBlock";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

const Card = styled.div.withConfig({
  displayName: "Card"
})`
  margin: ${props => props.theme.space[2]};
  box-shadow: ${props => props.theme.boxShadow[0]};
  transition: box-shadow ${props => props.theme.duration[1]} ease-in;

  &:hover {
    box-shadow: ${props => props.theme.boxShadow[1]};
  }
`;

const Toolbar = styled.div.withConfig({
  displayName: "Toolbar"
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.space[2]} ${props => props.theme.space[1]};
`;

export const PostCard = ({
  imageUrl,
  imageWidth,
  imageHeight,
  avatarUrl,
  authorName,
  likesCount,
  isLiked,
  canDelete,
  bytesUploaded,
  bytesTotal,
  errorMessage,
  onLikeToggle,
  onDeleteClick,
  onAuthorClick,
  ...rest
}) => (
  <Card {...rest}>
    <Media ratio={imageHeight / imageWidth} image={imageUrl} />
    <Toolbar>
      <AuthorBlock avatarUrl={avatarUrl} authorName={authorName} />
      <LikeButton active={isLiked} count={likesCount} onClick={onLikeToggle} />
      {canDelete && <DeleteButton px={1} onClick={onDeleteClick} />}
    </Toolbar>
  </Card>
);

export default PostCard;
