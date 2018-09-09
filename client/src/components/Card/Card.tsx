import * as React from "react";
import { Avatar, BackgroundImage, Box, Flex, Text } from "rebass";

interface Props {
  imageUrl: string;
  width: number;
  height: number;
  authorName?: string;
  authorAvatarUrl?: string;
  likeCount?: number;
  isLiked?: boolean;
  canLike?: boolean;
  onLikeToggle?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
  canDelete?: boolean;
  onDeleteClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const defaultProps = {
  likesCount: 0,
  isLiked: false,
  canDelete: false,
  canLike: false
};

const Card: React.SFC<Props> = ({
  imageUrl,
  width,
  height,
  authorName,
  authorAvatarUrl,
  canDelete,
  onDeleteClick,
  likeCount,
  isLiked,
  canLike,
  onLikeToggle
}) => (
  <Box data-cy="card">
    <BackgroundImage src={imageUrl} ratio={height / width} />
    <Flex>
      <Flex alignItems="center" flex={1}>
        {authorAvatarUrl && (
          <Avatar
            aria-label="Avatar"
            borderRadius={0}
            size={40}
            src={authorAvatarUrl}
          />
        )}
        {authorName && <Text>{authorName}</Text>}
      </Flex>
      <button aria-label="Delete" onClick={onDeleteClick}>
        x
      </button>
      <button aria-label="Like" onClick={onLikeToggle} disabled={!canLike}>
        {likeCount}
      </button>
    </Flex>
  </Box>
);

Card.defaultProps = defaultProps;

export default Card;
