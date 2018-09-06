import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetPostIds } from "../selectors";
import { createPost } from "../actions";

interface RenderProps {
  ids: ReadonlyArray<string>;
  createPost: (file: File, picture: Picture) => void;
}

interface Props extends RenderProps {
  children: (props: RenderProps) => JSX.Element;
}

const makeMapStateToProps = createStructuredSelector({
  ids: makeGetPostIds()
});

const enhance = connect(makeMapStateToProps);

const PostListContainer = ({ ids, children }: Props) => children({ ids });

export default enhance(PostListContainer);
