import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetPostById } from "../selectors";
import { Post } from "../models";

interface RenderProps {
  post: Post;
}

interface Props extends RenderProps {
  id: string;
  children: (props: RenderProps) => JSX.Element;
}

const makeMapStateToProps = createStructuredSelector({
  post: makeGetPostById()
});

const enhance = connect(makeMapStateToProps);

const PostListContainer = ({ post, children }: Props) => children({ post });

export default enhance(PostListContainer);
