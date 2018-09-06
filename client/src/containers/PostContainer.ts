import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Post } from "../models";
import { makeGetPostById } from "../selectors";

interface RenderProps {
  post: Post | undefined;
}

interface Props extends RenderProps {
  id: string;
  children: (props: RenderProps) => JSX.Element | null;
}

const makeMapStateToProps = createStructuredSelector({
  post: makeGetPostById()
});

const enhance = connect(makeMapStateToProps);

const PostContainer = ({ children, ...rest }: Props) => children(rest);

export default enhance(PostContainer);
