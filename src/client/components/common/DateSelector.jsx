import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function DateSelector({ selectedDate, setSelectedDate, everyDay, setEveryDay, isToday, setIsToday }) {
  const handleDateChange = (newDate) => {
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
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Select date"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{ height: '56px' }}
          />
        </DemoContainer>
      </LocalizationProvider>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{
          backgroundColor: isToday ? '#32485d' : 'primary.main',
          '&:hover': {backgroundColor: '#1e2b37'},
          height: '56px'
        }} 
        onClick={handleToday}
      >
        Today
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{
          backgroundColor: everyDay ? '#32485d' : 'primary.main',
          '&:hover': {backgroundColor: '#1e2b37'},
          height: '56px'
        }} 
        onClick={handleEveryDay}
      >
        Every Day
      </Button>
      <Typography variant="body1" sx={{ ml: 2 }}>
        {everyDay 
          ? "Showing all items" 
          : `Selected: ${selectedDate.format('MMMM D, YYYY')}`}
      </Typography>
    </Box>
  );
}

export default DateSelector;