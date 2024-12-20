import React from 'react'
import './error.css'

const error = () => {
  return (
    <div className='error_wrapper'>
        <div className="error_box justify-content-center align-items-center text-dark">
            <h1>404</h1>
            <h2>Something went wrong...</h2>
            <p>
                Sorry, the page is having issues.
            </p>
        </div>
    </div>
    
  )
}

export default error