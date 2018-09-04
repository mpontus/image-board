import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeGetPostIds } from "../selectors";

interface RenderProps {
  ids: ReadonlyArray<string>;
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
