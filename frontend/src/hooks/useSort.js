import { useState } from 'react';
import _ from 'lodash';

const useSort = (items, initialSortColumn = { path: 'title', order: 'asc' }) => {
  const [sortColumn, setSortColumn] = useState(initialSortColumn);

  const handleSort = (path) => {
    const newSortColumn = { ...sortColumn };
    
    if (newSortColumn.path === path) {
      newSortColumn.order = newSortColumn.order === 'asc' ? 'desc' : 'asc';
    } else {
      newSortColumn.path = path;
      newSortColumn.order = 'asc';
    }
    
    setSortColumn(newSortColumn);
  };

  const getSortedData = (itemsToSort = items) => {
    return _.orderBy(itemsToSort, [sortColumn.path], [sortColumn.order]);
  };

  return {
    sortColumn,
    setSortColumn,
    handleSort,
    getSortedData,
  };
};

export default useSort;
