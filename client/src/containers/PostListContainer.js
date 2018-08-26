import * as React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  makeHasMorePosts,
  makeGetLastPage,
  makeGetPostIds
} from "../selectors";
import { fetchPosts, createPost, endReached } from "../actions";

const makeMapStateToProps = () =>
  createStructuredSelector({
    hasMorePosts: makeHasMorePosts(),
    lastPage: makeGetLastPage(),
    ids: makeGetPostIds()
  });

const enhance = connect(makeMapStateToProps, {
  fetchPosts,
  createPost,
  endReached
});

class PostListContainer extends React.Component {
  componentDidMount() {
    this.props.fetchPosts();
  }

  render() {
    const {
      hasMorePosts,
      lastPage,
      ids,
      createPost,
      endReached,
      children
    } = this.props;

    return children({ hasMorePosts, lastPage, ids, createPost, endReached });
  }
}

export default enhance(PostListContainer);
