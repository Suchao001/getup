import React from 'react';
import { 
  Box, 
  Modal, 
  Typography, 
  IconButton, 
  Button, 
  Chip,
  Grid,
  Paper
} from '@mui/material';
import { 
  ArrowBack, 
  Edit, 
  Delete, 
  CalendarToday, 
  WbSunny, 
  NightsStay 
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import HabitForm from './HabitForm';
import CustomModal from '../common/CustomModal';
import axios from 'axios';
import { badAlert, goodAlert,deleteConfirm } from '../../script/sweet';
import { HostName } from '../../script/HostName';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: '80%',
    md: 500,
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '99vh',
  overflowY: 'auto',
};

const HabitModal = ({ open, onClose, habit }) => {
  const [editOpen, setEditOpen] = React.useState(false);
  

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleDelete = async () => {
    try {
      const isConfirmed = await deleteConfirm('Delete Habit', 'Are you sure you want to delete this habit');
      if (!isConfirmed) return;
      const res = await axios.delete(`${HostName}/api/habits/delete/${habit.id}` ,{withCredentials: true});
     
      goodAlert('Habit deleted successfully');
      onClose(); 
    } catch (error) {
      badAlert(error.response?.data?.message || error.message); 
    }
  };

  const renderDaysOrDates = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'];
    if (habit.days && habit.days.length > 0) {
      return (
        <Box display="flex" gap={1} mb={2}>
          {days.map((day, index) => (
            <Chip
              key={index}
              label={day.charAt(0).toUpperCase()}
              color="primary"
              variant={habit.days.includes(day) ? 'contained' : 'outlined'}
            />
          ))}
        </Box>
      );
    }
    if (habit.dates && habit.dates.length > 0) {
      return (
        <Box display="flex" gap={1} mb={2}>
          {habit.dates.map((date, index) => (
            <Chip
              key={index}
              label={date}
              color="primary"
              variant="contained"
            />
          ))}
        </Box>
      );
    }
    return (
     <Chip 
     label="Daily"
     color="primary"
     variant="contained"
     
     ></Chip>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-habit-title"
      aria-describedby="modal-habit-description"
    >
      <Paper sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <IconButton onClick={onClose} edge="start">
            <ArrowBack />
          </IconButton>
          <Box>
            <IconButton onClick={handleEditOpen}>
              <Edit />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <CustomModal
          open={editOpen}
          onClose={handleEditClose}
        
        >
          <HabitForm formClose={handleEditClose} habit={habit} isEdit={true} />
        </CustomModal>

        {/* Confirmation Modal */}
        

        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <FontAwesomeIcon
              icon={ficons[habit.nameTouse || 'faUser']}
              style={{ fontSize: '2rem', color: '#2196f3' }}
            />
            <Typography variant="h4" fontWeight="bold">
              {habit.name}
            </Typography>
          </Box>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            INTERVAL AND REPETITION
          </Typography>
          {renderDaysOrDates()}
          <Button
            startIcon={<CalendarToday />}
            color="primary"
          >
            See calendar
          </Button>
        </Box>
         
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            TIME OF DAY
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                icon={<WbSunny />}
                label="Morning"
                variant={habit.time_of_day === 'Morning' ? 'contained' : 'outlined'}
               
                color="primary"
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<WbSunny />}
                label="Afternoon"
                variant={habit.time_of_day === 'Afternoon' ? 'contained' : 'outlined'}
        
                color="primary"
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<NightsStay />}
                label="Night"
                variant= {habit.time_of_day === 'Night' ? 'contained' : 'outlined'}
        
                color="primary"
              />
            </Grid>
            <Grid item>
              <Chip
                label="Anytime"
                color="primary"
                variant= {habit.time_of_day === 'Anytime'|| habit.time_of_day=== '' ? 'contained' : 'outlined'}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Modal>
  );
};

export default HabitModal;
