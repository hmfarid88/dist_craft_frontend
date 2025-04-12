import React from 'react';

const CurrentMonthYear: React.FC = () => {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  return <div>{formattedDate}</div>;
};

export default CurrentMonthYear;
