import React, { Component, PropTypes } from 'react';
import FixedDataTable from 'fixed-data-table';
import 'fixed-data-table/dist/fixed-data-table.min.css';

import FakeData, { buildColumnLookup } from './fakeData';
import fakeSubgridData from './fakeSubgridData';

const { Table, Column, Cell } = FixedDataTable;
const list = new FakeData(100, true).getAll();

const TextCell = ({rowIndex, data, col, ...props}) => {
  const value = data[rowIndex][col];
  return (
    <Cell {...props}>
      {value}
    </Cell>
  );
};

class ExpandCell extends Component {
  static propTypes = {
    rowIndex: React.PropTypes.number,
    col: React.PropTypes.string,
    data: React.PropTypes.array,
    toggleRow: React.PropTypes.func,
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
    const { col } = this.props;

    if (this.expandable() === false || col !== 'id') {
      return null;
    }

    return this.state.expanded ?
      <span>▼</span> :
      <span>▶</span>;
  }

  render() {
    const expandable = this.expandable();
    const { rowIndex, col, data } = this.props;

    const value = data[rowIndex][col];

    return (
      <Cell {...this.props} onClick={this.onClick}>
         {this.getExpandToggle()} {value}
      </Cell>
    );
  }
}

class FixedGrid extends Component {
  state = {
    data: list
  }

  toggleRow = (rowIndex, shouldExpand) => {
    const { data } = this.state;

    const hasChildren = data[rowIndex].hasOwnProperty('children');

    if(shouldExpand) {
      // intentionally mutating stuff for example -- really shouldn't be doing this -- should be getting this data from a server or something on toggle
      const children = data[rowIndex].children.map(c => ({...c, child: true }));

      data.splice(rowIndex + 1, 0, ...children);
      this.setState(data);
      return;
    }

    data.splice(rowIndex + 1, data[rowIndex].children.length);
    this.setState({ data });
  }

  render() {
    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowsCount={list.length}
        width={1000}
        height={500}
      >
        <Column
          header={<Cell>ID</Cell>}
          cell={<ExpandCell data={this.state.data} col="id" toggleRow={this.toggleRow} />}
          width={100}
        />
        <Column
          header={<Cell>Name</Cell>}
          cell={<TextCell data={this.state.data} col="name" />}
          width={100}
        />
        <Column
          header={<Cell>City</Cell>}
          cell={<TextCell data={this.state.data} col="city" />}
          width={100}
        />
        <Column
          header={<Cell>State</Cell>}
          cell={<TextCell data={this.state.data} col="state" />}
          width={100}
        />
        <Column
          header={<Cell>Zip</Cell>}
          cell={<TextCell data={this.state.data} col="zipCode" />}
          width={100}
        />
        <Column
          header={<Cell>Company</Cell>}
          cell={<TextCell data={this.state.data} col="company" />}
          width={100}
        />
        <Column
          header={<Cell>Favorite Number</Cell>}
          cell={<TextCell data={this.state.data} col="favoriteNumber" />}
          width={100}
        />
      </Table>
    )
  }
}

export default FixedGrid;