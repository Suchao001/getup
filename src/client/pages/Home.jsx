import React, { useState } from 'react';
import Habit from '../components/habit/Habit';
import Task from '../components/task/Task.jsx'; 
import { Container, Button } from '@mui/material';
import PlanCard from '../components/plan/PlanCard';
import BottomTabNavigation from '../components/common/Buttonnavigate';
import HabitList from '../components/habit/HabitList';
import TaskList from '../components/task/TaskList';
import CheckLogin from '../components/auth/CheckLogin';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function Home() {
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('habit');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  
  const handleTab = (tab) => {
    setCurrentTab(tab);
    const targetElement = document.getElementById(tab);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToday = () => {
    setSelectedDate(dayjs());
  };

  return (
    <>
    <CheckLogin/>
    <Container>
      <BottomTabNavigation handleTabClick={handleTab}/>

      {/*                                                Habit                                                                  */}
      {currentTab === 'habit' && (
      <div id='habit'>
      <h1 className='font2 my-4' >Habits</h1>
      <div className='mb-4' style={{display:'flex', gap: '10px', alignItems: 'center'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Select date"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{ height: '56px' }} // Adjust this value to match the button height
          />
        </DemoContainer>
      </LocalizationProvider>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{
          backgroundColor:'#32485d', 
          '&:hover': {backgroundColor: '#1e2b37'},
          height: '56px' // Match this height with the DatePicker
        }} 
        onClick={handleToday}
      >
        Today
      </Button>
      </div>
      <Habit buttonstyle='float'/>
      {error && <p className="text-danger">{error}</p>}
      <HabitList selectedDate={selectedDate.format('YYYY-MM-DD')} setSelectedDate={setSelectedDate}/>
      </div>
      )}
        {/*                                                Task                                                                  */}
      {currentTab === 'task' && (
      <div id='task'>
      <h1 className='font2 my-4' >Tasks</h1>
      <Task/>
      <TaskList/>
      
      </div>
      )}

          {/*                                                Plan                                                                  */}
      {currentTab === 'plan' && (
      <div id='plan'>
      <h1 className='font2 my-4'>Plans</h1>
      <PlanCard/>
      </div>
      )}

    </Container>
    </>
  );
}

export default Home;
