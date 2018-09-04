import * as React from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  CellRenderer,
  KeyMapper,
  Masonry,
  MasonryCellProps,
  Size,
  WindowScroller,
  createMasonryCellPositioner
} from "react-virtualized";

interface Props {
  cellCount: number;
  keyMapper?: KeyMapper;
  maxCellWidth: number;
  gutter?: number;
  cellRenderer: CellRenderer;
}

interface State {
  columnCount: number;
  columnWidth: number;
}

const defaultProps = {
  gutter: 0
};

/**
 * Masonry layout component using React-Virtualized
 */
const MasonryLayout: React.ComponentClass<
  Props
  > = class extends React.Component<Props & typeof defaultProps, State> {
    static defaultProps = defaultProps;

    state = {
      columnCount: 0,
      columnWidth: Math.min(200, this.props.maxCellWidth)
    };

    cellMeasurerCache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: this.state.columnWidth,
      fixedWidth: true
    });

    cellPositioner = createMasonryCellPositioner({
      cellMeasurerCache: this.cellMeasurerCache,
      columnCount: this.state.columnCount,
      columnWidth: this.state.columnWidth,
      spacer: this.props.gutter
    });

    masonry: React.RefObject<Masonry> = React.createRef();

    handleResize = ({ width }: Size) => {
      const { gutter } = this.props;
      const columnCount = Math.ceil(
        (width - gutter) / (this.props.maxCellWidth + gutter)
      );
      const columnWidth = Math.trunc(width / columnCount);

      this.setState(
        {
          columnCount,
          columnWidth
        },
        () => {
          this.cellMeasurerCache.clearAll();

          this.cellPositioner.reset({
            columnWidth,
            columnCount,
            spacer: this.props.gutter
          });

          if (this.masonry.current !== null) {
            this.masonry.current.clearCellPositions();
          }
        }
      );
    };

    cellRenderer = (props: MasonryCellProps) => {
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

    componentDidUpdate(prevProps: Props) {
      if (this.props.cellCount !== prevProps.cellCount) {
        const { columnWidth, columnCount } = this.state;

        this.cellMeasurerCache.clearAll();
        this.cellPositioner.reset({
          columnWidth,
          columnCount,
          spacer: this.props.gutter
        });

        if (this.masonry.current !== null) {
          this.masonry.current.clearCellPositions();
        }
      }
    }

    render() {
      return (
        <WindowScroller>
          {({ height, scrollTop }) => (
            <AutoSizer
              disableHeight={true}
              height={height}
              scrollTop={scrollTop}
              onResize={this.handleResize}
            >
              {({ width }) => (
                <Masonry
                  autoHeight={true}
                  height={height}
                  width={width}
                  scrollTop={scrollTop}
                  keyMapper={this.props.keyMapper}
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
  };

export default MasonryLayout;
