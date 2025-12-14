import React from 'react';

const Pagination = ({ currentPage = 1, setCurrentPage, totalPages = 1, onPageChange }) => {
  if (totalPages === 0) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage -= 1)}
      >
        Prev
      </button>

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

      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage += 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
