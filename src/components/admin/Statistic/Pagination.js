import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, paginate }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null; 

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const delta = 2; 

        if (totalPages <= maxVisiblePages) {
           
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
 
            pageNumbers.push(1);

            let startPage = Math.max(currentPage - delta, 2);
            let endPage = Math.min(currentPage + delta, totalPages - 1);

            if (startPage > 2) {
                pageNumbers.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }

            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination-container mt-4 flex justify-center space-x-2">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''} px-3 py-1 border`}
            >
                &lt;
            </button>

            {pageNumbers.map((number, index) =>
                typeof number === 'string' ? (
                    <span key={index} className="pagination-ellipsis px-3 py-1">
                        {number}
                    </span>
                ) : (
                    <button
                        key={index}
                        onClick={() => paginate(number)}
                        className={`pagination-button ${currentPage === number ? 'active' : ''} px-3 py-1 border`}
                    >
                        {number}
                    </button>
                )
            )}

            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''} px-3 py-1 border`}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
