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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  AccessTime,
  CheckCircleOutline,
  RadioButtonUnchecked
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import TaskForm from './TaskForm';
import CustomModal from '../common/CustomModal';
import axios from 'axios';
import { badAlert, goodAlert, deleteConfirm } from '../../script/sweet';
import { HostName } from '../../script/HostName';
import './TaskModal.css';

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
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const TaskModal = ({ open, onClose, task }) => {
  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  // Create a theme based on the task color
  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: task.color,
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: task.color,
        secondary: task.color,
      },
    },
  }), [task.color]);

  const handleDelete = async () => {
    try {
      const isConfirmed = await deleteConfirm('Delete Task', `Are you sure you want to delete task "${task.name}"`);
      if (!isConfirmed) return;
      const response = await axios.delete(`${HostName}/api/tasks/${task.id}`);
      goodAlert('Task deleted successfully');
      onClose(); 
    } catch (error) {
      console.log(error);
      badAlert(error.response?.data?.message || error.message);
    }
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
          <Paper sx={modalStyle} className="task-modal">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <IconButton onClick={onClose} edge="start" aria-label="close" className="back-button">
                <ArrowBack />
              </IconButton>
              <Box>
                <IconButton onClick={handleEditOpen} aria-label="edit" className="edit-button">
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete} aria-label="delete" className="delete-button">
                  <Delete />
                </IconButton>
              </Box>
            </Box>

            <CustomModal open={editOpen} onClose={handleEditClose}>
              <TaskForm formClose={handleEditClose} task={task} isEdit={true} />
            </CustomModal>

            <Box mb={4} className="task-header">
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <FontAwesomeIcon
                  icon={ficons[task.nameTouse || 'faTasks']}
                  style={{ fontSize: '2.5rem', color: task.color }}
                  className="task-icon"
                />
                <Typography variant="h4" fontWeight="bold" className="task-name">
                  {task.name}
                </Typography>
              </Box>
            </Box>

            <Box mb={4} className="task-section">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                TASK DETAILS
              </Typography>
              <Typography variant="body1" mb={2}>
                {task.details || "No details available"}
              </Typography>
              <Button
                startIcon={<CalendarToday />}
                color="primary"
                variant="outlined"
                className="calendar-button"
              >
                View calendar
              </Button>
            </Box>

            <Box mb={4} className="task-section">
              <Typography variant="h6" fontWeight="bold" mb={2}>
                TIME AND POINTS
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Chip
                    icon={<AccessTime />}
                    label={task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}
                    variant="outlined"
                    className="time-chip"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={`Points: ${task.point || 0}`}
                    color="primary"
                    variant="filled"
                    className="points-chip"
                  />
                </Grid>
              </Grid>
            </Box>

            {task.task_list && task.task_list.length > 0 && (
              <Box mb={4} className="task-section">
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  TASK LIST
                </Typography>
                <List>
                  {task.task_list.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {task.is_complete ? <CheckCircleOutline /> : <RadioButtonUnchecked />}
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default TaskModal;