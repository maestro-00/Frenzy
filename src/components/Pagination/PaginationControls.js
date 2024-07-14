import React from 'react'
import './PaginationControls.css'
//  renders pagination controls
const PaginationControls = ({currentPage, totalPages,onPageChange}) => {
  return (
    <div className='pagination-controls'>
        {/* Button to go to the previous page. It is disabled if the current page is the first page */}
        <button onClick={()=>onPageChange(currentPage-1)} disabled={currentPage ===1}>Previous</button>
        
         {/* Display the current page and total pages */}
        <span>Page {currentPage} of {totalPages} </span>
        
        {/* Button to go to the next page. It is disabled if the current page is the last page */}
        <button onClick={()=>onPageChange(currentPage+1)} disabled={currentPage ===totalPages}>Next</button>
    </div>
  )
}

export default PaginationControls
