import { useState, useCallback } from 'react';
import { paginate } from '../utils/paginate';

const usePagination = (items, pageSize, initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPagedData = (itemsToPaginate = items) => {
    const pagedItems = paginate(itemsToPaginate, currentPage, pageSize);
    return { data: pagedItems, totalCount: itemsToPaginate.length };
  };

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    handlePageChange,
    getPagedData,
    resetPage,
  };
};

export default usePagination;
