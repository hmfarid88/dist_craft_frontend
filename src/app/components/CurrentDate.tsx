import React from 'react'

const CurrentDate = () => {
    const currentDate = new Date();

   const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div>{formattedDate}</div>
  )
}

export default CurrentDate