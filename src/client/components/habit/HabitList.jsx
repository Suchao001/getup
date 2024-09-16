import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import HabitModal from './HabitModal';
import useFetchHabits from '../../hooks/useFetchHabits';
import HabitCard from './HabitCard';


const HabitList = ({selectedDate, setSelectedDate, isToday}) => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const { habitData, error: habitError, updateHabit } = useFetchHabits({selectedDate, setSelectedDate});

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
    <>
    <Grid container spacing={2}>
      {habitData.map((habit) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={habit.id}>
          <HabitCard 
            habit={habit} 
            handleOpenDetail={handleOpenHabitModal(habit)}
            onToggleComplete={handleToggleComplete}
            isToday={isToday}
          />
        </Grid>
      ))}
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
    </>
  );
};

export default HabitList;
