import React, { useState, useMemo } from 'react';
import {
  Box,
  Modal,
  Typography,
  IconButton,
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
  createTheme,
  Avatar
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
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

const TaskModal = ({ open, onClose, task, fetchTasks }) => {
  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

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
        primary: '#333333',
        secondary: task.color,
      },
    },
  }), [task.color]);

  const taskDetailsStyle = {
    border: `1px solid ${task.color}`,
    padding: '15px',
    borderRadius: '8px',
    boxShadow: `0 2px 10px ${task.color}40`,
    marginBottom: '20px',
  };

  const handleDelete = async () => {
    try {
      const isConfirmed = await deleteConfirm('Delete Task', `Are you sure you want to delete task "${task.name}"?`);
      if (!isConfirmed) return;
      await axios.delete(`${HostName}/api/tasks/${task.id}`);
      goodAlert('Task deleted successfully');
      fetchTasks();
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      badAlert(error.response?.data?.message || 'An error occurred while deleting the task');
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
              <TaskForm formClose={handleEditClose} task={task} isEdit={true} fetchTasks={fetchTasks} />
            </CustomModal>

            <Box mb={4} className="task-header">
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Avatar
                  style={{ backgroundColor: task.color, width: '5rem', height: '5rem' }}
                >
                  <FontAwesomeIcon
                    icon={ficons[task.nameTouse || 'faTasks']}
                    style={{ fontSize: '2.5rem', color: 'white' }}
                  />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" className="task-name" style={{ color: task.color }}>
                  {task.name}
                </Typography>
              </Box>
            </Box>

            <Box className="task-section" style={taskDetailsStyle}>
              <Typography variant="h6" fontWeight="bold" mb={2} style={{ color: task.color }}>
                TASK DETAILS
              </Typography>
              <Typography variant="body1" mb={2} style={{ color: `${task.color}CC` }}>
                {task.details || "No details available"}
              </Typography>
            </Box>

            <Box className="task-section" style={taskDetailsStyle}>
              <Typography variant="h6" fontWeight="bold" mb={2} style={{ color: task.color }}>
                TIME AND POINTS
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Chip
                    icon={<AccessTime style={{ color: task.color }} />}
                    label={task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}
                    variant="outlined"
                    className="time-chip"
                    style={{ color: task.color, borderColor: task.color }}
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
              <Box className="task-section" style={taskDetailsStyle}>
                <Typography variant="h6" fontWeight="bold" mb={2} style={{ color: task.color }}>
                  TASK LIST
                </Typography>
                <List>
                  {task.task_list.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {task.is_complete ? (
                          <CheckCircleOutline style={{ color: task.color }} />
                        ) : (
                          <RadioButtonUnchecked style={{ color: task.color }} />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={item} style={{ color: task.color }} />
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