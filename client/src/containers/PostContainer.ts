import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetPostById } from "../selectors";
import { Post } from "../models";

interface RenderProps {
  post: Post | undefined;
}

interface Props extends RenderProps {
  id: string;
  children: (props: RenderProps) => JSX.Element | null;
}

const makeMapStateToProps = createStructuredSelector({
  post: makeGetPostById(),
});

const enhance = connect(makeMapStateToProps);

const PostContainer = ({ children, ...rest }: Props) => children(rest);

export default enhance(PostContainer);
