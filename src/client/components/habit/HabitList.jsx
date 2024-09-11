import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import './HabitCard.css';
import { Grid, Typography } from '@mui/material';
import HabitModal from './HabitModal';
import useFetchHabits from '../../hooks/useFetchHabits';


const HabitCard = ({ habit, handleOpenDetail }) => {
  const { name, nameTouse: iconToUse = "faUser", color, details } = habit || {};
  const renderIcon = () => {
    if (iconToUse && ficons[iconToUse]) {
      return <FontAwesomeIcon icon={ficons[iconToUse]} className="text-3xl" />;
    }
    return <FontAwesomeIcon icon={ficons["faUser"]} className="text-3xl" />;
  };

  return (
    <div
      className="habit-card font1"
      style={{ backgroundColor: color }}
      onClick={handleOpenDetail}
      title={details || "No details available"}
    >
      <div className="card-content">
        <div className="icon-container">
          {renderIcon()}
        </div>
        <h3 className="habit-name">{name}</h3>
      </div>
      <div className="animated-bar" />
    </div>
  );
};


const HabitList = ({selectedDate,setSelectedDate}) => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const { habitData, error: habitError } = useFetchHabits({selectedDate,setSelectedDate});

  const handleOpenHabitModal = (habit) => () => {
    setSelectedHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleCloseHabitModal = () => {
    setSelectedHabit(null);
    setIsHabitModalOpen(false);
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
          <HabitCard habit={habit} handleOpenDetail={handleOpenHabitModal(habit)} />
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
