import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Modal, 
  Typography, 
  IconButton, 
  Button, 
  Chip,
  Grid,
  Paper,
  Fade,
  Backdrop,
  ThemeProvider,
  createTheme
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
import { badAlert, goodAlert, deleteConfirm } from '../../script/sweet';
import { HostName } from '../../script/HostName';
import './HabitModal.css';
import { Avatar } from '@mui/material';

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
  maxHeight: '90vh',
  overflowY: 'auto',
};

const HabitModal = ({ open, onClose, habit }) => {
  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  // Create a theme based on the habit color
  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: habit.color,
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
    },
  }), [habit.color]);

  const handleDelete = async () => {
    try {
      const isConfirmed = await deleteConfirm('Delete Habit', 'Are you sure you want to delete this habit?');
      if (!isConfirmed) return;
      const res = await axios.delete(`${HostName}/api/habits/delete/${habit.id}`, {withCredentials: true});
      goodAlert('Habit deleted successfully');
      onClose(); 
    } catch (error) {
      badAlert(error.response?.data?.message || error.message); 
    }
  };

  const renderDaysOrDates = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (habit.days && habit.days.length > 0) {
      return (
        <Box display="flex" gap={1} mb={2} className="days-container">
          {days.map((day, index) => (
            <Chip
              key={index}
              label={day}
              color="primary"
              variant={habit.days.includes(day) ? 'filled' : 'outlined'}
              className={habit.days.includes(day) ? 'active-day' : ''}
            />
          ))}
        </Box>
      );
    }
    if (habit.dates && habit.dates.length > 0) {
      return (
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {habit.dates.map((date, index) => (
            <Chip
              key={index}
              label={date}
              color="primary"
              variant="filled"
              className="date-chip"
            />
          ))}
        </Box>
      );
    }
    return (
      <Chip 
        label="Daily"
        color="primary"
        variant="filled"
        className="daily-chip"
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper sx={modalStyle } className="habit-modal" >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <IconButton onClick={onClose} edge="start" className="back-button">
                <ArrowBack />
              </IconButton>
              <Box>
                <IconButton onClick={handleEditOpen} className="edit-button">
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete} className="delete-button" >
                  <Delete />
                </IconButton>
              </Box>
            </Box>

            <CustomModal open={editOpen} onClose={handleEditClose}>
              <HabitForm formClose={handleEditClose} habit={habit} isEdit={true} />
            </CustomModal>

            <Box mb={4} className="habit-header">
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <div className="icon-container-modal" style={{ backgroundColor: habit.color }}>
                <FontAwesomeIcon
                  icon={ficons[habit.nameTouse || 'faUser']}
                  style={{ fontSize: '2.5rem', color: 'white' }}
                  className="habit-icon"
                />
                </div>
                <Typography variant="h4" fontWeight="bold" className="habit-name" style={{ color: '#333' }}>
                  {habit.name}
                </Typography>
              </Box>
            </Box>

            <Box mb={4} className="habit-section">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                INTERVAL AND REPETITION
              </Typography>
              {renderDaysOrDates()}
              <Button
                startIcon={<CalendarToday />}
                color="primary"
                variant="outlined"
                className="calendar-button"
              >
                See calendar
              </Button>
            </Box>
             
            <Box mb={4} className="habit-section">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                TIME OF DAY
              </Typography>
              <Grid container spacing={1}>
                {['Morning', 'Afternoon', 'Night', 'Anytime'].map((time) => (
                  <Grid item key={time}>
                    <Chip
                      icon={time === 'Night' ? <NightsStay /> : <WbSunny />}
                      label={time}
                      variant={habit.time_of_day === time || (time === 'Anytime' && !habit.time_of_day) ? 'filled' : 'outlined'}
                      color="primary"
                      className={`time-chip ${habit.time_of_day === time || (time === 'Anytime' && !habit.time_of_day) ? 'active-time' : ''}`}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default HabitModal;
