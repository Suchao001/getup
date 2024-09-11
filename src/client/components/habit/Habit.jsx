import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import HabitForm from './HabitForm';
import CustomModal from '../common/CustomModal';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

const Habits = ({fetchHabits, buttonstyle}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {buttonstyle === 'text' ? (
        <Button variant="text" onClick={handleOpen}>
          Add Habit
        </Button>
      ) : (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <Fab color="primary" aria-label="add" onClick={handleOpen}>
            <AccessibilityIcon />
          </Fab>
        </Box>
      )}
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
