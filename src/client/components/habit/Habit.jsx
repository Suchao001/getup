import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import HabitForm from './HabitForm';
import CustomModal from '../common/CustomModal';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { Tooltip } from '@mui/material';

const Habits = ({ buttonstyle,refetchHabits}) => {
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
        <Box sx={{ zIndex: 1000, position: 'fixed', bottom: 16, right: 16 }}>
          <Tooltip title="Add Habit">
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
              <AccessibilityIcon />
            </Fab>
          </Tooltip>
        </Box>
      )}
      <CustomModal
        open={open}
        onClose={handleClose}
      >
        <HabitForm open={true} formClose={handleClose} isEdit={false} refetchHabits={refetchHabits} />
      </CustomModal>
    </>
  );
};

export default Habits;
