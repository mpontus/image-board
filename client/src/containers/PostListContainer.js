import * as React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  makeIsLoading,
  makeGetLastPage,
  makeHasMorePosts,
  makeGetPostIds,
} from "../selectors";
import { fetchPosts, createPost, endReached } from "../actions";

const makeMapStateToProps = () =>
  createStructuredSelector({
    isLoading: makeIsLoading(),
    hasMorePosts: makeHasMorePosts(),
    lastPage: makeGetLastPage(),
    ids: makeGetPostIds(),
  });

const enhance = connect(
  makeMapStateToProps,
  {
    fetchPosts,
    createPost,
    endReached,
  }
);

class PostListContainer extends React.Component {
  componentDidMount() {
    this.props.fetchPosts();
  }

  handleCreatePost = (file, user) => {
    const img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;

      this.props.createPost(file, img.src, width, height, user);
    };
  };

  render() {
    const {
      isLoading,
      hasMorePosts,
      lastPage,
      ids,
      endReached,
      children,
    } = this.props;

    return children({
      isLoading,
      hasMorePosts,
      lastPage,
      ids,
      onCreatePost: this.handleCreatePost,
      onEndReached: endReached,
    });
  }
}

export default enhance(PostListContainer);
