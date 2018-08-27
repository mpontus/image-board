import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetPostById } from "../selectors";
import { likePost, deletePost } from "../actions";

const makeMapStateToProps = () =>
  createStructuredSelector({
    post: makeGetPostById(),
  });

const enhance = connect(
  makeMapStateToProps,
  { likePost, deletePost }
);

const PostContainer = ({ post, likePost, deletePost, children }) =>
  children({ post, likePost, deletePost });

export default enhance(PostContainer);
