import * as React from "react";
import { CellRenderer } from "react-virtualized";

interface Props {
  cellCount: number;
  cellRenderer: CellRenderer;
}

/**
 * Inject last item into Masonry element
 */
// TODO: Write adequate typings if it works
const injectLastItem = <T extends Props, P>(
  makeCellRenderer: (props: T) => CellRenderer,
  mapProps: (props: T) => P
) => (Component: React.ComponentType<P>): React.ComponentType<T> => (
  props: T
) => {
  const lastItemCellRenderer: CellRenderer = makeCellRenderer(props);
  const cellRenderer: CellRenderer = cellRendererProps => {
    if (cellRendererProps.index === props.cellCount) {
      return lastItemCellRenderer(cellRendererProps);
    }

    return props.cellRenderer(cellRendererProps);
  };
  const injectProps = mapProps({
    ...(props as any),
    cellRenderer,
    cellCount: props.cellCount + 1
  });

  return <Component {...injectProps} />;
};

export default injectLastItem;
