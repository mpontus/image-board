import * as React from "react";
import styled from "styled-components";
import Button from "../Button";
import {
  MdFavorite as FavoriteIcon,
  MdDelete as DeleteIcon,
} from "react-icons/md";
import Media from "./Media";

const Card = styled.div`
  margin: 8px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
`;

const CardToolbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 4px;
`;

const AuthorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 0 4px;
`;

const AuthorAvatar = styled.img`
  margin: 0 4px;
  height: 24px;
  width: 24px;
`;

const AuthorName = styled.span`
  font-size: 14px;
  padding: 0 4px;
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
    <CardToolbar>
      <AuthorContainer>
        <AuthorAvatar src={avatarUrl} />
        <AuthorName>{authorName}</AuthorName>
      </AuthorContainer>
      <Button color={isLiked ? "hotpink" : "gray"} onClick={onLikeToggle}>
        <span>{likesCount}</span>
        <FavoriteIcon size="24" />
      </Button>
      {canDelete && (
        <Button onClick={onDeleteClick}>
          <DeleteIcon size="24" />
        </Button>
      )}
    </CardToolbar>
  </Card>
);

export default PostCard;
