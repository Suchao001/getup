import React, { useState, useEffect } from 'react';
import './YearProgress.css';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function YearProgress() {
  const [daysPassed, setDaysPassed] = useState(0);
  const [daysInYear, setDaysInYear] = useState(365);
  const [isGridVisible, setIsGridVisible] = useState(true);

  useEffect(() => {
    const calculateYearProgress = () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const day = Math.floor(diff / oneDay);
      
      setDaysPassed(day);
      setDaysInYear(isLeapYear(now.getFullYear()) ? 366 : 365);
    };

    calculateYearProgress();
    const timer = setInterval(calculateYearProgress, 1000 * 60 * 60); // อัปเดตทุกชั่วโมง

    return () => clearInterval(timer);
  }, []);

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  const toggleGridVisibility = () => {
    setIsGridVisible(!isGridVisible);
  };

  const getGradientColor = (index, totalCount) => {
    const startColor = [255, 107, 107]; // #ff6b6b (แดง)
    const endColor = [255, 165, 0]; // #ffa500 (ส้ม)
  
    const ratio = index / totalCount;
  
    const r = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]));
    const g = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]));
    const b = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]));
  
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getBoxStyle = (index, passedCount) => {
    if (index < passedCount) {
      const color = getGradientColor(index, passedCount);
      return {
        background: color,
        transition: 'background 0.3s ease',
      };
    } else {
      return {
        background: '#f0f0f0',
        transition: 'background 0.3s ease',
      };
    }
  };

  return (
    <Box className="year-progress-container">
     
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">{new Date().getFullYear()}</Typography>
          <IconButton onClick={toggleGridVisibility}>
            {isGridVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      

      <Collapse in={isGridVisible}>
        <Box className="year-grid">
          {[...Array(daysInYear)].map((_, index) => (
            <Box
              key={index}
              className={`day-box ${index < daysPassed ? 'passed' : ''} ${index === daysPassed - 1 ? 'today' : ''}`}
              style={index === daysPassed - 1 ? { background: '#00cc00' } : getBoxStyle(index, daysPassed)}
            />
          ))}   
        </Box>
      </Collapse>

      <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
        {daysPassed} / {daysInYear} days
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'right' }}>
        {((daysPassed / daysInYear) * 100).toFixed(2)}% of the year
      </Typography>
    </Box>
  );
}

export default YearProgress;