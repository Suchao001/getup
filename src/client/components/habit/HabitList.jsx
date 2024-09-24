import React, { useState,useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import HabitModal from './HabitModal';
import useFetchHabits from '../../hooks/useFetchHabits';
import HabitCard from './HabitCard';
import { WbSunny, Brightness7, WbTwilight, AllInclusive } from '@mui/icons-material';


const HabitList = ({ allDay, selectedDate, setSelectedDate, isToday }) => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const { habitData, error: habitError, updateHabit } = useFetchHabits({ selectedDate, setSelectedDate });
  
  const morningHabit = [];
  const afternoonHabit = [];
  const eveningHabit = [];
  const anytimeHabit = [];

  useEffect(() => {
    console.log(habitData)
  },[])

  habitData.forEach(habit => {
    if(allDay){
      anytimeHabit.push(habit);
    }
    else{
    if (habit.time_of_day.toLowerCase() === 'morning') {
      morningHabit.push(habit);
    } else if (habit.time_of_day.toLowerCase() === 'afternoon') {
      afternoonHabit.push(habit);
    } else if (habit.time_of_day.toLowerCase() === 'evening') {
      eveningHabit.push(habit);
    } else {
        anytimeHabit.push(habit);
      }
    }
  });

  const handleOpenHabitModal = (habit) => () => {
    setSelectedHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleCloseHabitModal = () => {
    setSelectedHabit(null);
    setIsHabitModalOpen(false);
  };

  const handleToggleComplete = (id) => {
    updateHabit(id);
  };

  if (habitError) {
    return <Typography variant="h6">Error: {habitError}</Typography>;
  }

  if (habitData.length === 0) {
    return <Typography variant="h6">No habits found.</Typography>;
  }

  return (
    <Grid>
      <Grid container spacing={2} sx={{marginTop:'1rem', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        {morningHabit.length > 0 && (
          <>      
         {  morningHabit.length < 4 ? (
              <Grid  key="allInclusive">
                <WbSunny />
              </Grid>
            ) : (
              <Grid item xs={12} sm={12} md={12} lg={12} key="allInclusive" style={{display:'flex', alignItems:'center'}}>
                <WbSunny /> <span className='font1' style={{marginLeft:'0.5rem'}}>Anytime</span>
              </Grid>
            )}
            {morningHabit.map((habit) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={habit.id}>
                <HabitCard 
                  habit={habit} 
                  handleOpenDetail={handleOpenHabitModal(habit)}
                  onToggleComplete={handleToggleComplete}
                  isToday={isToday}
                />
              </Grid>
            ))}
            <Box sx={{ width: '100%', marginBottom: '20px' }} />
          </>
        )}

        {afternoonHabit.length > 0 && (
          <>
          {afternoonHabit.length < 4 ? (
              <Grid key="allInclusive">
                <Brightness7 />
              </Grid>
            ) : (
              <Grid item xs={12} sm={12} md={12} lg={12} key="allInclusive" style={{display:'flex', alignItems:'center'}}>
                <Brightness7 /> <span className='font1' style={{marginLeft:'0.5rem'}}>Anytime</span>
              </Grid>
            )}
            {afternoonHabit.map((habit) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={habit.id}>
                <HabitCard 
                  habit={habit} 
                  handleOpenDetail={handleOpenHabitModal(habit)}
                  onToggleComplete={handleToggleComplete}
                  isToday={isToday}
                />
              </Grid>
            ))}
            <Box sx={{ width: '100%', marginBottom: '20px' }} />
          </>
        )}

        {eveningHabit.length > 0 && (
          <>
         { eveningHabit.length < 4 ? (
              <Grid  key="allInclusive">
                <WbTwilight />
              </Grid>
            ) : (
              <Grid item xs={12} sm={12} md={12} lg={12} key="allInclusive" style={{display:'flex', alignItems:'center'}}>
                <WbTwilight /> <span className='font1' style={{marginLeft:'0.5rem'}}>Evening</span>
              </Grid>
            )}
            {eveningHabit.map((habit) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={habit.id}>
                <HabitCard 
                  habit={habit} 
                  handleOpenDetail={handleOpenHabitModal(habit)}
                  onToggleComplete={handleToggleComplete}
                  isToday={isToday}
                />
              </Grid>
            ))}
            <Box sx={{ width: '100%', marginBottom: '20px' }} />
          </>
        )}

        {anytimeHabit.length > 0 && (
          <>
      
            {anytimeHabit.length < 4 ? (
              <Grid  key="allInclusive">
                <AllInclusive />
              </Grid>
            ) : (
              <Grid item xs={12} sm={12} md={12} lg={12} key="allInclusive" style={{display:'flex', alignItems:'center'}}>
                <AllInclusive /> <span className='font1' style={{marginLeft:'0.5rem'}}>{allDay ? 'Every Time Habits' : 'Anytime'}</span>
              </Grid>
            )}
            {anytimeHabit.map((habit) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={habit.id}>
                <HabitCard 
                  habit={habit} 
                  handleOpenDetail={handleOpenHabitModal(habit)}
                  onToggleComplete={handleToggleComplete}
                  isToday={isToday}
                />
              </Grid>
            ))}

       </>
        )}
      </Grid>
      

      {selectedHabit && (
        <HabitModal
          open={isHabitModalOpen}
          onClose={handleCloseHabitModal}
          habit={selectedHabit}
          title={selectedHabit.name}
          details={selectedHabit.details}
          frequency={selectedHabit.frequency}
          dates={selectedHabit.dates}
          days={selectedHabit.days}
        />
      )}
    </Grid>
  );
};

export default HabitList;
