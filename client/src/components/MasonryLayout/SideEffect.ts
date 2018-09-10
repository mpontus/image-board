import * as React from "react";

const noop = () => undefined;

interface Props {
  onMount?: () => void;
  onUpdate?: () => void;
  onUnmount?: () => void;
}

const defaultProps = {
  onMount: noop,
  onUpdate: noop,
  onUnmount: noop
};

const SideEffect: React.ComponentClass<Props> = class extends React.Component<
  Props & typeof defaultProps
> {
  public static defaultProps = defaultProps;

  public componentDidMount() {
    this.props.onMount();
  }

  public compnentDidUpdate() {
    this.props.onUpdate();
  }

  public componentWillUnmount() {
    this.props.onUnmount();
  }

  public render() {
    return null;
  }
};

export default SideEffect;
