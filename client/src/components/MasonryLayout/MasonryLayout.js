import * as React from "react";
import {
  AutoSizer,
  WindowScroller,
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";

/**
 * Masonry layout component using React-Virtualized
 */
class MasonryLayout extends React.Component {
  state = {
    columnWidth: Math.min(200, this.props.maxCellWidth),
  };

  cellMeasurerCache = new CellMeasurerCache({
    defaultHeight: 250,
    defaultWidth: this.state.columnWidth,
    fixedWidth: true,
  });

  cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: this.cellMeasurerCache,
    columnCount: 0,
    columnWidth: this.state.columnWidth,
    spacer: 10,
  });

  masonry = React.createRef();

  handleResize = ({ width }) => {
    const columnCount = Math.ceil(width / this.props.maxCellWidth);
    const columnWidth = Math.trunc(width / columnCount);

    this.setState(
      {
        columnWidth,
      },
      () => {
        this.cellMeasurerCache.clearAll();

        this.cellPositioner.reset({
          columnWidth,
          columnCount,
          spacer: 0,
        });

        this.masonry.current.clearCellPositions();
      }
    );
  };

  cellRenderer = props => {
    const { index, key, parent, style } = props;
    const { columnWidth: width } = this.state;

    return (
      <div key={key} style={{ ...style, width }}>
        <CellMeasurer
          cache={this.cellMeasurerCache}
          index={index}
          parent={parent}
        >
          {this.props.cellRenderer(props)}
        </CellMeasurer>
      </div>
    );
  };

  render() {
    return (
      <WindowScroller>
        {({ height, scrollTop }) => (
          <AutoSizer
            disableHeight
            height={height}
            scrollTop={scrollTop}
            onResize={this.handleResize}
          >
            {({ width }) => (
              <Masonry
                autoHeight
                height={height}
                width={width}
                scrollTop={scrollTop}
                cellCount={this.props.cellCount}
                cellMeasurerCache={this.cellMeasurerCache}
                cellPositioner={this.cellPositioner}
                cellRenderer={this.cellRenderer}
                ref={this.masonry}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }
}

export default MasonryLayout;
