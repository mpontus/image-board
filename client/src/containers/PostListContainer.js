import * as React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetPostIds } from "../selectors";
import { fetchPosts, createPost } from "../actions";

const makeMapStateToProps = () =>
  createStructuredSelector({
    ids: makeGetPostIds()
  });

const enhance = connect(makeMapStateToProps, { fetchPosts, createPost });

class PostListContainer extends React.Component {
  componentDidMount() {
    this.props.fetchPosts();
  }

  render() {
    const { ids, createPost, children } = this.props;

    return children({ ids, createPost });
  }
}

export default enhance(PostListContainer);
