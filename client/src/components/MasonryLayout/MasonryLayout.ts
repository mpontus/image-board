import * as React from "react";
import {
  AutoSizer,
  WindowScroller,
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";

const defaultProps = {
  spacer: 0,
  overscanByPixels: 20,
};

/**
 * Masonry layout component using React-Virtualized
 */
class MasonryLayout extends React.Component {
  static defaultProps = defaultProps;

  state = {
    columnCount: 0,
    columnWidth: Math.min(200, this.props.maxCellWidth),
  };

  cellMeasurerCache = new CellMeasurerCache({
    defaultHeight: 250,
    defaultWidth: this.state.columnWidth,
    fixedWidth: true,
  });

  cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: this.cellMeasurerCache,
    columnCount: this.state.columnCount,
    columnWidth: this.state.columnWidth,
    spacer: this.props.spacer,
  });

  masonry = React.createRef();

  handleResize = ({ width }) => {
    const columnCount = Math.ceil(width / this.props.maxCellWidth);
    const columnWidth = Math.trunc(width / columnCount);

    this.setState(
      {
        columnCount,
        columnWidth,
      },
      () => {
        this.cellMeasurerCache.clearAll();

        this.cellPositioner.reset({
          columnWidth,
          columnCount,
          spacer: this.props.spacer,
        });

        this.masonry.current.clearCellPositions();
      }
    );
  };

  cellRenderer = props => {
    const { index, key, parent, style } = props;
    const { columnWidth: width } = this.state;

    if (!(index < this.props.cellCount)) {
      // TODO: Investigate how to avoid rendering cell outside cellCount range
      return null;
    }

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

  componentDidUpdate(prevProps) {
    if (this.props.cellCount !== prevProps.cellCount) {
      const { columnWidth, columnCount } = this.state;

      this.cellMeasurerCache.clearAll();
      this.cellPositioner.reset({
        columnWidth,
        columnCount,
        spacer: this.props.spacer,
      });
      this.masonry.current.clearCellPositions();
    }
  }

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
                keyMapper={this.props.keyMapper}
                cellCount={this.props.cellCount}
                cellMeasurerCache={this.cellMeasurerCache}
                cellPositioner={this.cellPositioner}
                cellRenderer={this.cellRenderer}
                ref={this.masonry}
                overscanByPixels={
                  "Cypress" in window
                    ? // Effectively disable optimization for UI tests
                      Infinity
                    : this.props.overscanByPixels
                }
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }
}

export default MasonryLayout;
