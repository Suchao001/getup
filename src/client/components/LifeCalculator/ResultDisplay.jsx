import React from 'react';

function ResultDisplay({ remainingTime }) {
  return (
    <div>
      <h2>เวลาที่เหลือของคุณ:</h2>
      <p>{remainingTime.weeks} สัปดาห์ และ {remainingTime.days} วัน</p>
    </div>
  );
}

export default ResultDisplay;