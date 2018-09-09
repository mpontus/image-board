import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { createPost, deletePost, likePost } from "../actions";
import { Post, User } from "../models";
import { makeGetPostIds } from "../selectors";

interface RenderProps {
  ids: ReadonlyArray<string>;
  onCreatePost: (file: File, user: User) => void;
  onDeletePost: (post: Post) => void;
  onLikePost: (post: Post, value: 1 | -1) => void;
}

interface Props extends RenderProps {
  children: (props: RenderProps) => JSX.Element | null;
}

const makeMapStateToProps = createStructuredSelector({
  ids: makeGetPostIds()
});

const enhance = connect(
  makeMapStateToProps,
  {
    onCreatePost: createPost,
    onDeletePost: deletePost,
    onLikePost: likePost
  }
);

const PostListContainer = ({ children, ...rest }: Props) => children(rest);

export default enhance(PostListContainer);
