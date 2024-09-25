import React from 'react';

function ResultDisplay({ remainingTime }) {
  return (
    <div className='font1'>
      <h2>Your remaining time:</h2>
      <p>{remainingTime.weeks} weeks and {remainingTime.days} days</p>
    </div>
  );
}

export default ResultDisplay;