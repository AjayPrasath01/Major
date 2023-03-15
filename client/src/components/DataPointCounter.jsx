import React from 'react'
import './DataPointCounter.css'

function DataPointCounter(props) {
  return (
    <span className='data-count-holder'>
        <h1 className='data-count-text'>{props.count}</h1>
        <p className='data-count-lable'>Data Count</p>
    </span>
  )
}

export default DataPointCounter