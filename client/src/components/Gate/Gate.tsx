import * as React from "react";

interface Props {
  condition: boolean;
  placeholder: React.ReactNode;
}

/**
 * component which renders its children when condition is true
 */
const Gate: React.SFC<Props> = ({ condition, placeholder, children }) =>
  React.Children.only(condition ? children : placeholder);

export default Gate;
