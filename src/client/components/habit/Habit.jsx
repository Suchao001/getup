import React from 'react';
import Button from '@mui/material/Button';
import HabitForm from './HabitForm';
import CustomModal from '../common/CustomModal';

const Habits = ({fetchHabits}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Create Habit</Button>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Create Habit"
      >
        <HabitForm open={true} formClose={handleClose} isEdit={false} fetchHabits={fetchHabits}/>
      </CustomModal>
    </>
  );
};

export default Habits;
