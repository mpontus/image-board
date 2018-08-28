import * as React from "react";
import styled from "styled-components";
import {
  MdFavorite as FavoriteIcon,
  MdDelete as DeleteIcon,
  MdClose as CloseIcon,
} from "react-icons/md";
import Spinner from "../Spinner";
import Button from "../Button";
import ImagePreloader from "./ImagePreloader";
import ProgressBar from "./ProgressBar";

const Card = styled.div`
  margin: 8px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
`;

const CardToolbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 4px;
  height: 56px;
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

const MediaBackdrop = styled.div`
  position: relative;
  padding-top: ${props => props.ratio * 100}%;
`;

const MediaImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const UploadProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 4px;
`;

const ProgressText = styled.div`
  font-size: 12px;
`;

ProgressBar.defaultProps = {
  width: 0,
};

class PostCard extends React.Component {
  render() {
    const {
      committed,
      imageUrl,
      imageRatio,
      imageWidth,
      imageHeight,
      avatarUrl,
      authorName,
      likesCount,
      isLiked,
      canDelete,
      bytesTransferred,
      bytesTotal,
      errorMessage,
      onLikeToggle,
      onDeleteClick,
      onAuthorClick,
      ...rest
    } = this.props;

    return (
      <Card {...rest}>
        <MediaBackdrop ratio={imageHeight / imageWidth}>
          <ImagePreloader
            src={imageUrl}
            loading={
              <SpinnerContainer>
                <Spinner />
              </SpinnerContainer>
            }
          >
            {({ src }) => <MediaImage src={src} />}
          </ImagePreloader>
        </MediaBackdrop>
        {committed ? (
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
        ) : (
          <CardToolbar>
            <UploadProgressContainer>
              <ProgressBar
                progress={
                  bytesTransferred ? (bytesTransferred / bytesTotal) * 100 : 0
                }
              />
              <ProgressText>
                {bytesTransferred ? `${bytesTransferred}Kb` : "Pending"}
              </ProgressText>
            </UploadProgressContainer>
            <Button onClick={onDeleteClick}>
              <CloseIcon size="24" />
            </Button>
          </CardToolbar>
        )}
      </Card>
    );
  }
}

export default PostCard;
