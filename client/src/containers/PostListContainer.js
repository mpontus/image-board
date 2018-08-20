import * as React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetPostIds } from "../selectors";
import { createPost } from "../actions";

const makeMapStateToProps = () =>
  createStructuredSelector({
    ids: makeGetPostIds()
  });

const enhance = connect(makeMapStateToProps, { createPost });

const PostListContainer = ({ ids, createPost, children }) =>
  children({ ids, createPost });

export default enhance(PostListContainer);
