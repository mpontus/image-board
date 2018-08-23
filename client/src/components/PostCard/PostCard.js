import * as React from "react";
import classnames from "classnames";
import {
  MdFavorite as FavoriteIcon,
  MdDelete as DeleteIcon
} from "react-icons/md";
import "./PostCard.css";

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
  <div className="post-card">
    <div className="post-card__backdrop">
      <img className="post-card__primary-image" src={imageUrl} width="480" />
    </div>
    <div className="post-card__toolbar">
      <div className="post-card__author">
        <img className="post-card__avatar" src={avatarUrl} width="88" />
        <span className="post-card__username">{authorName}</span>
      </div>
      <div className="post-card__actions">
        <div
          className={classnames("post-card__likes", {
            "post-card__likes--active": isLiked
          })}
          onClick={onLikeToggle}
        >
          <span className="post-card__likes-count">{likesCount}</span>
          <FavoriteIcon className="post-card__icon" />
        </div>
        {canDelete && (
          <div className="post-card__delete" onClick={onDeleteClick}>
            <DeleteIcon className="post-card__icon" />
          </div>
        )}
      </div>
    </div>
  </div>
);

export default PostCard;
