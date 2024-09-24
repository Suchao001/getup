import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, Button, TextField } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CustomDateBar = ({ selectedDate, setSelectedDate, everyDay, setEveryDay, setIsToday }) => {
  const [dates, setDates] = useState([]);

  const generateDates = useCallback(() => {
    const currentDate = dayjs(selectedDate);
    const datesArray = [];
    for (let i = -3; i <= 3; i++) {
      datesArray.push(currentDate.add(i, 'day'));
    }
    setDates(datesArray);
  }, [selectedDate]);

  useEffect(() => {
    generateDates();
  }, [generateDates]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEveryDay(false);
    setIsToday(date.isSame(dayjs(), 'day'));
  };

  const handlePrevDay = () => {
    const newDate = dayjs(selectedDate).subtract(1, 'day');
    setSelectedDate(newDate);
    setEveryDay(false);
    setIsToday(newDate.isSame(dayjs(), 'day'));
  };

  const handleNextDay = () => {
    const newDate = dayjs(selectedDate).add(1, 'day');
    setSelectedDate(newDate);
    setEveryDay(false);
    setIsToday(newDate.isSame(dayjs(), 'day'));
  };

  const handleToday = () => {
    setSelectedDate(dayjs());
    setEveryDay(false);
    setIsToday(true);
  };

  const handleEveryDay = () => {
    setEveryDay(true);
    setIsToday(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, width: '100%' }}>
        <IconButton onClick={handlePrevDay}>
          <ArrowBackIos />
        </IconButton>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: 1, maxWidth: '100%', overflow: 'auto' }}>
          {dates.map((date, index) => (
            <Box
              key={index}
              onClick={() => handleDateClick(date)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                mx: 1,
                p: 1,
                borderRadius: 1,
                backgroundColor: date.isSame(selectedDate, 'day') ? 'primary.main' : 'transparent',
                color: date.isSame(selectedDate, 'day') ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: date.isSame(selectedDate, 'day') ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <Typography variant="caption">{date.format('ddd')}</Typography>
              <Typography variant="body2">{date.format('D')}</Typography>
            </Box>
          ))}
        </Box>
        <IconButton onClick={handleNextDay}>
          <ArrowForwardIos />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select date"
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                setEveryDay(false);
                setIsToday(newDate.isSame(dayjs(), 'day'));
              }}
              renderInput={(params) => <TextField {...params} size="small" />}
              sx={{ width: '150px' }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleToday}
          sx={{ backgroundColor: dayjs().isSame(selectedDate, 'day') ? 'secondary.main' : 'primary.main' }}
        >
          Today
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleEveryDay}
          sx={{ backgroundColor: everyDay ? 'secondary.main' : 'primary.main' }}
        >
          Every Day
        </Button>
      </Box>
    </Box>
  );
};

export default CustomDateBar;
