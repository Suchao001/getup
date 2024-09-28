import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import { Popover } from '@mui/material';
import PopupForm from './PopupForm';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Tooltip } from '@mui/material';

const AddPlanButton = ({ buttonstyle }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedDate(new Date()); // Set to current date, adjust as needed
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {buttonstyle === 'text' ? (
        <Button variant="text" onClick={handleOpen}>
          Add Task
        </Button>
      ) : (
        <Box sx={{ zIndex: 1000, position: 'fixed', bottom: 16, right: 16 }}>
          <Tooltip title="Add Task">
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
              <CalendarMonthIcon />
            </Fab>
          </Tooltip>
        </Box>
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <PopupForm
          selectedDate={selectedDate}
          onClose={handleClose}
          onEventAdded={() => {}}
          plan={{}} 
          onAddPlan={() => {}} 
          isEdit={false}
        />
      </Popover>
    </>
  );
};

export default AddPlanButton;
