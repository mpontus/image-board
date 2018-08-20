import * as React from "react";

export const PostCard = ({
  imageUrl,
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
  onAuthorClick
}) => (
  <div>
    <img src={imageUrl} width="480" />
    <div onClick={onAuthorClick}>
      <img src={avatarUrl} width="88" />
      <span>{authorName}</span>
    </div>
    <div onClick={onLikeToggle}>
      <span>{likesCount}</span>
      <span>{isLiked ? "You like it" : "You don't like it"}</span>
    </div>
    {canDelete && <div onClick={onDeleteClick}>Delete</div>}
  </div>
);

export default PostCard;
