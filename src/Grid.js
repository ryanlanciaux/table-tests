import React, { Component, PropTypes } from 'react';
import { Grid } from 'react-virtualized';

import FakeData, { buildColumnLookup } from './fakeData';

const list = new FakeData(1000).getAll();
const columnLookup = buildColumnLookup(list);

class Cell extends Component {
  static propTypes = {
    rowIndex: React.PropTypes.number,
    columnIndex: React.PropTypes.number,
    key: React.PropTypes.node,
    style: React.PropTypes.object,
    toggleRow: React.PropTypes.func,
    data: React.PropTypes.array,
  }

  state = {
    expanded: false,
  }

  expandable = () => {
    const { data } = this.props;

    if (data.length < 1) { return false; }
    return data[0].hasOwnProperty('children');
  };
  
  onClick = () => {
    const { expanded } = this.state;
    const { toggleRow, rowIndex } = this.props;

    const shouldExpand = !expanded;
    toggleRow(rowIndex, shouldExpand);
    this.setState({
      expanded: shouldExpand
    });
  }

  getExpandToggle = () => {
    const { columnIndex } = this.props;

    if (this.expandable() === false || columnIndex > 0) {
      return null;
    }

    return this.state.expanded ?
      <span>▼</span> :
      <span>▶</span>;
  }

  render() {
    const expandable = this.expandable();
    const { key, style, rowIndex, columnIndex, data } = this.props;

    const value = data[rowIndex][columnLookup[columnIndex]];
    return (
      <div
        key={key}
        style={style}
        onClick={this.onClick}
      >
         {this.getExpandToggle()} {value}
      </div>
    );
  }
}

class DataGrid extends Component {
  state = {
    data: list
  }

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    return (
      <Cell
        key={key}
        style={style}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
        data={this.state.data}
        toggleRow={this.toggleRow}
      />
    );
  };

  recordCount = () => {
    return this.state.data.length;
  }

  columnCount = () => {
    return this.recordCount() > 0 ?
      Object.keys(this.state.data[0]).length :
      0;
  }

  toggleRow = (rowIndex, shouldExpand) => {
    const { data } = this.state;

    const hasChildren = data[rowIndex].hasOwnProperty('children');

    if(shouldExpand) {
      // intentionally mutating stuff for example -- really shouldn't be doing this -- should be getting this data from a server or something on toggle
      data.splice(rowIndex + 1, 0, ...data[rowIndex].children);
      this.setState(data);
      return;
    }

    data.splice(rowIndex + 1, data[rowIndex].children.length);
    this.setState({ data });
  }

  render() {
    const { data } = this.state;

    return (
      <Grid
        cellRenderer={this.cellRenderer}
        columnCount={this.columnCount()}
        columnWidth={100}
        height={300}
        rowCount={this.recordCount()}
        rowHeight={30}
        width={300}
      />
    );
  }
}

export default DataGrid;