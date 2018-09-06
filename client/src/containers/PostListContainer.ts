import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetPostIds } from "../selectors";
import { createPost } from "../actions";
import { User } from "../models";

interface RenderProps {
  ids: ReadonlyArray<string>;
  createPost: (file: File, user: User) => void;
}

interface Props extends RenderProps {
  children: (props: RenderProps) => JSX.Element | null;
}

const makeMapStateToProps = createStructuredSelector({
  ids: makeGetPostIds()
});

const enhance = connect(makeMapStateToProps, { createPost });

const PostListContainer = ({ children, ...rest }: Props) => children(rest);

export default enhance(PostListContainer);
