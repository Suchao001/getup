import React, { useState } from 'react';
import './WeekGrid.css';
import { FormControl, InputLabel, Select, MenuItem, IconButton, Collapse, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function WeekGrid({ totalWeeks, passedWeeks }) {
  const [displayMode, setDisplayMode] = useState('weeks');
  const [isGridVisible, setIsGridVisible] = useState(false);

  const handleDisplayModeChange = (event) => {
    setDisplayMode(event.target.value);
  };

  const toggleGridVisibility = () => {
    setIsGridVisible(!isGridVisible);
  };

  const getBoxCount = () => {
    switch (displayMode) {
      case 'weeks':
        return totalWeeks;
      case 'months':
        return Math.ceil(totalWeeks / 4);
      case 'years':
        return Math.ceil(totalWeeks / 52);
      default:
        return totalWeeks;
    }
  };

  const getPassedCount = () => {
    switch (displayMode) {
      case 'weeks':
        return passedWeeks;
      case 'months':
        return Math.floor(passedWeeks / 4);
      case 'years':
        return Math.floor(passedWeeks / 52);
      default:
        return passedWeeks;
    }
  };



  const getGradientColor = (index, totalCount) => {
    const startColor = [255, 107, 107]; // #ff6b6b (แดง)
    const endColor = [255, 165, 0]; // #ffa500 (ส้ม)
  
    const ratio = index / totalCount; // คำนวณระยะทางจากสีเริ่มต้นไปสีปลาย
  
    const r = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]));
    const g = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]));
    const b = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]));
  
    return `rgb(${r}, ${g}, ${b})`; // ผลลัพธ์สีที่ไล่ไปเรื่อยๆ
  };
  
  const getBoxStyle = (index, passedCount) => {
    if (index < passedCount) {
      const color = getGradientColor(index, passedCount); // ไล่สีต่อเนื่อง
      return {
        background: color,
        transition: 'background 0.3s ease',
      };
    } else {
      return {
        background: '#f0f0f0', // สีพื้นฐานสำหรับบล็อกที่ยังไม่ผ่าน
        transition: 'background 0.3s ease',
      };
    }
  };
  
  

  return (
    <Box className="week-grid-container">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="display-mode-label">Display Mode</InputLabel>
          <Select
            labelId="display-mode-label"
            id="display-mode-select"
            value={displayMode}
            label="Display Mode"
            onChange={handleDisplayModeChange}
          >
            <MenuItem value="weeks">Weeks</MenuItem>
            <MenuItem value="months">Months</MenuItem>
            <MenuItem value="years">Years</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={toggleGridVisibility}>
          {isGridVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={isGridVisible}>
      <Box className="week-grid">
        {[...Array(getBoxCount())].map((_, index) => (
          <Box
            key={index}
            className={`week-box ${index < getPassedCount() ? 'passed' : ''}`}
            style={getBoxStyle(index, getPassedCount())} // ไล่สีจาก #ff6b6b ไป #ffa500
          />
        ))}
      </Box>
    </Collapse>


      
      <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
        {getPassedCount()} / {getBoxCount()} {displayMode}
      </Typography>
    </Box>
  );
}

export default WeekGrid;