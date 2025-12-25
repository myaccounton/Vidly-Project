import React from 'react';

const TableHeader = ({ columns, sortColumn, onSort }) => {
  const raiseSort = path => {
    if (!path) return;

    const newSortColumn = { ...sortColumn };

    if (newSortColumn.path === path)
      newSortColumn.order =
        newSortColumn.order === "asc" ? "desc" : "asc";
    else {
      newSortColumn.path = path;
      newSortColumn.order = "asc";
    }

    onSort(newSortColumn);
  };

  const renderSortIcon = column => {
    if (column.path !== sortColumn.path) return null;

    return sortColumn.order === "asc"
      ? <i className="fa fa-sort-asc ms-1"></i>
      : <i className="fa fa-sort-desc ms-1"></i>;
  };

  return (
    <thead>
      <tr>
        {columns.map(column => (
          <th
            key={column.path || column.key}
            onClick={() => raiseSort(column.path)}
            style={{ cursor: column.path ? "pointer" : "default" }}
          >
            {column.label}
            {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
