import React, { Component, PropTypes } from 'react';
import { List } from 'react-virtualized';
import _ from 'lodash';

import FakeData from './fakeData';
import fakeSubgridData from './fakeSubgridData';

const list = new FakeData(100, true).getAll();

// object that contains all the column widths
const columnWidths = {
  name: 200,
  city: 100,
  state: 75,
  zipCode: 50,
  company: 75,
  favoriteNumber: 50
}

// get the styles object
const getStyle = key => {
  return {
    maxWidth: columnWidths[key],
    width: columnWidths[key],
    overflow: 'hidden',
  }
}

// Represents a row in the data list
class Row extends Component {
  static propTypes = {
    rowKey: PropTypes.node,
    index: PropTypes.number,
    style: PropTypes.object,
    columns: PropTypes.array,
    toggleRow: PropTypes.func,
    data: PropTypes.array,
    isRowExpanded: PropTypes.bool,
  }

  onClick = () => {
    const { isRowExpanded, index } = this.props;
    this.props.toggleRow(this.props.index, !isRowExpanded);
  }

  // Get the row elements -- this is currently pretty messy
  getRow(rowData, { style, key }) {
    const { columns } = this.props;
    const hasChildren = rowData.hasOwnProperty('children');

    return (
      <div style={{display: 'flex'}} key={key}>
        {columns.map((c, i) => (
          <div style={getStyle(c)} key={c}>
            { i === 0 && hasChildren && <button onClick={this.onClick}>Expand</button>}
            { rowData[c] }
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { index, rowKey, style, columns, data, isRowExpanded } = this.props;
    return (
      <div style={style} key={rowKey}>
        {
          this.getRow(data[index], { key: rowKey})
        }
        { isRowExpanded && (
          data[index].children.map((c, index) => (this.getRow(c, { key: `${rowKey}-${index}`})))
        )}
      </div>
    );
  }
}

// Wrap up the react-virtualized List component
class DataList extends Component {
  state = {
    data: list,
    // some of the fake columns -- we should not do this this way
    columns: ['name', 'city', 'state', 'zipCode', 'company', 'favoriteNumber'],
    // we are tracking which rows are expanded here and storying the row height in this object
    expanded: {},
  }

  // this is what is responsible for rendering the rows in virtualized
  rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    const { columns, data } = this.state;

    return (
      <Row
        key={key}
        rowKey={key}
        index={index}
        style={style}
        columns={columns}
        toggleRow={this.toggleRow}
        data={data}
        isRowExpanded={this.isRowExpanded(index)}
      />
    );
  };

  // if there is a property in the expanded state object, we can assume this row is expanded
  isRowExpanded = (rowIndex) => {
    return this.state.expanded.hasOwnProperty(rowIndex);
  }

  // This should get the height of the row and should check if row is expanded.
  // not totally seeing it but this method is not working as intended -- may be something
  // to do with calling the forceUpdateGrid method in toggleExpanded (maybe?)
  getRowHeight = ({index}) => {
    const { expanded } = this.state;

    const height = this.state.expanded.hasOwnProperty(index) ?
    expanded[index] :
    30;

    return height;
  }

  // Get the number of rows
  recordCount = () => {
    return this.state.data.length;
  }

  // Track the given row as expanded or collapsed based on 
  toggleRow = (rowIndex, shouldExpand) => {
    const { data, expanded } = this.state;

    const hasChildren = data[rowIndex].hasOwnProperty('children');

    if(shouldExpand) {
      const newExpanded = {};
      newExpanded[rowIndex.toString()] = (data[rowIndex].children.length * 30) + 30;
      this.setState({ expanded: newExpanded });
      this.list.forceUpdateGrid();
      return;
    }

    const newExpanded = _.omit(this.state.expanded, rowIndex.toString());

    this.list.forceUpdateGrid();
    this.setState({ expanded: newExpanded });
  }

  // store the react virtualized object so we can call forceUpdateGrid later
  getList = (ref) => {
    this.list = ref;
  }

  render() {
    const list = (
      <List
        ref={this.getList}
        width={800}
        height={600}
        rowCount={this.recordCount()}
        rowHeight={this.getRowHeight}
        rowRenderer={this.rowRenderer}
      />
    );

    return list;
  }
}

export default DataList;