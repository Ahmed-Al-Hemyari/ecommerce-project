import React from 'react';

const Pagination = ({
  currentPage = 1,
  setCurrentPage,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  setLimit,
}) => {
  if (totalPages === 0) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const limits = [5, 50, 100, 150]; // options for items per page

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between mt-4 px-2 space-y-2 md:space-y-0">
      
      {/* Items info */}
      <div className="text-sm text-gray-700">
        {`Showing ${startItem} - ${endItem} of ${totalItems} items`}
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        <div className="flex space-x-1">
          {pages.map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded hover:bg-gray-300 ${
                page === currentPage ? 'bg-(--color-dark-green) text-white' : 'bg-gray-200'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>

      {/* Limit selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Items per page:</span>
        <select
          className="border rounded-md outline-0 px-2 py-1"
          value={limit}
          onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1);}}
        >
          {limits.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
