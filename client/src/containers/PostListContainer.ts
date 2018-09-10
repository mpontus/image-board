import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { createPost, deletePost, endReached, likePost } from "../actions";
import { Post, User } from "../models";
import {
  makeGetLastPage,
  makeGetPostIds,
  makeGetPostsLoading,
  makeGetTotalPosts
} from "../selectors";

interface RenderProps {
  ids: ReadonlyArray<string>;
  loading: boolean;
  lastPage: number | null;
  total: number | null;
  onCreatePost: (file: File, user: User) => void;
  onDeletePost: (post: Post) => void;
  onLikePost: (post: Post, value: 1 | -1) => void;
  onEndReached: (lastPage: number) => void;
}

interface Props extends RenderProps {
  children: (props: RenderProps) => JSX.Element | null;
}

const makeMapStateToProps = createStructuredSelector({
  ids: makeGetPostIds(),
  loading: makeGetPostsLoading(),
  lastPage: makeGetLastPage(),
  total: makeGetTotalPosts()
});

const enhance = connect(
  makeMapStateToProps,
  {
    onEndReached: endReached,
    onCreatePost: createPost,
    onDeletePost: deletePost,
    onLikePost: likePost
  }
);

const PostListContainer = ({ children, ...rest }: Props) => children(rest);

export default enhance(PostListContainer);
