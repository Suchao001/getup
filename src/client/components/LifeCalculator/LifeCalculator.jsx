import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import ResultDisplay from './ResultDisplay';
import WeekGrid from './WeekGrid';

function LifeCalculator({ initialBirthDate, initialExpectedAge }) {
  const [birthDate, setBirthDate] = useState(initialBirthDate || '');
  const [expectedAge, setExpectedAge] = useState(initialExpectedAge || '');
  const [remainingTime, setRemainingTime] = useState(null);
  const [passedWeeks, setPassedWeeks] = useState(0);
  const [lifeProgress, setLifeProgress] = useState(0);

  useEffect(() => {
    if (birthDate && expectedAge) {
      calculateRemainingTime();
    }
  }, [birthDate, expectedAge]);

  const calculateRemainingTime = () => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMilliseconds = today - birth;
    const ageInWeeks = ageInMilliseconds / (1000 * 60 * 60 * 24 * 7);
    const totalWeeks = expectedAge * 52;
    const remainingWeeks = totalWeeks - ageInWeeks;
    const remainingDays = Math.floor((remainingWeeks % 1) * 7);

    setRemainingTime({
      weeks: Math.floor(remainingWeeks),
      days: remainingDays
    });
    setPassedWeeks(Math.floor(ageInWeeks));
    setLifeProgress((ageInWeeks / totalWeeks) * 100);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Life Progress</Typography>
        <LinearProgress 
          variant="determinate" 
          value={lifeProgress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4caf50',
            }
          }} 
        />
        <Typography variant="body2" color="text.secondary" align="right">
          {lifeProgress.toFixed(2)}%
        </Typography>
      </Box>
      
      {remainingTime && <ResultDisplay remainingTime={remainingTime} />}
      {expectedAge && <WeekGrid totalWeeks={expectedAge * 52} passedWeeks={passedWeeks} />}
    </Box>
  );
}

export default LifeCalculator;