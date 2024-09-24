import React, { useState } from 'react';
import Habit from '../components/habit/Habit';
import Task from '../components/task/Task'; 
import { Container } from '@mui/material';
import PlanCard from '../components/plan/PlanCard';
import BottomTabNavigation from '../components/common/Buttonnavigate';
import HabitList from '../components/habit/HabitList';
import TaskList from '../components/task/TaskList';
import CheckLogin from '../components/auth/CheckLogin';
import dayjs from 'dayjs';
import AddPlanButton from '../components/plan/AddPlanButton';
import CustomDateBar from '../components/common/CustomDateBar';
import Divider from '@mui/material/Divider';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Accessibility from '@mui/icons-material/Accessibility';
import HabitRecommend from '../components/habit/HabitRecommend';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';


function Home() {
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('habit');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [everyDay, setEveryDay] = useState(false);
  const [isToday, setIsToday] = useState(true);
  const [allDay, setAllDay] = useState(false);


  const handleTab = (tab) => {
    setCurrentTab(tab);
    const targetElement = document.getElementById(tab);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAllDayChange = (event) => {
    setAllDay(event.target.checked);
  };

  return (
    <>
    <CheckLogin/>
    <Container>
      <BottomTabNavigation handleTabClick={handleTab} />
      {currentTab === 'habit' && (
      <div id='habit'>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'-1rem'}}>
        <h1 className='font2 my-4'>Habits <Accessibility sx={{ verticalAlign: 'middle', marginLeft: '8px',fontSize:'2rem'}} /></h1>    
       <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
        <HabitRecommend />
        <Tooltip title="sort by time">
        <Switch
          checked={allDay}
          onChange={handleAllDayChange}
          color="primary"
          inputProps={{ 'aria-label': 'all day' }}
        />
        
        </Tooltip>
        </div>
        </div>
        <Divider sx={{ my: 2 }} />
       
        <CustomDateBar 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        everyDay={everyDay}
        setEveryDay={setEveryDay}
        setIsToday={setIsToday}
       
      />
        <Habit buttonstyle='float' />

        

        {error && <p className="text-danger">{error}</p>}
        <HabitList   allDay={allDay} isToday={isToday} selectedDate={everyDay ? null : selectedDate.format('YYYY-MM-DD')} setSelectedDate={setSelectedDate}/>
      </div>
      )}

      {currentTab === 'task' && (
      <div id='task'>
        <h1 className='font2 my-4'>Tasks <TaskAltIcon sx={{ verticalAlign: 'middle', marginLeft: '8px' }} /></h1>
        <Divider sx={{ my: 2 }} />
        <Task/>
        <TaskList/>
      </div>
      )}

      {currentTab === 'plan' && (
      <div id='plan'>
        <h1 className='font2 my-4'>
          Plans <CalendarMonthIcon sx={{ verticalAlign: 'middle', marginLeft: '8px' }} />
        </h1>
        <Divider sx={{ my: 2 }} />
        <CustomDateBar 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        everyDay={everyDay}
        setEveryDay={setEveryDay}
        setIsToday={setIsToday}
         
      />
      
        <AddPlanButton/>
        <PlanCard selectedDate={everyDay ? null : selectedDate.format('YYYY-MM-DD')}/>
      </div>
      )}

    </Container>
    </>
  );
}

export default Home;
