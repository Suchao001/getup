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
  AccessTime
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import TaskForm from './TaskForm';
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

const TaskModal = ({ open, onClose, task }) => {
  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleDelete = async () => {
    try {
      const isConfirmed = await deleteConfirm('Delete Task', `Are you sure you want to delete task "${task.name}"`);
      if (!isConfirmed) return;
      const response = await axios.delete(`${HostName}/api/tasks/${task._id}`);
      goodAlert('Task deleted successfully');
      onClose(); 
    } catch (error) {
      badAlert(error.response?.data?.message || error.message); // Improved error handling
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-task-title"
      aria-describedby="modal-task-description"
    >
      <Paper sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <IconButton onClick={onClose} edge="start" aria-label="close">
            <ArrowBack />
          </IconButton>
          <Box>
            <IconButton onClick={handleEditOpen} aria-label="edit">
              <Edit />
            </IconButton>
            <IconButton onClick={handleDelete} aria-label="delete">
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <CustomModal
          open={editOpen}
          onClose={handleEditClose}
         
        >
          <TaskForm formClose={handleEditClose} task={task} isEdit={true} />
        </CustomModal>

        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <FontAwesomeIcon
              icon={ficons[task.nameTouse || 'faTasks']}
              style={{ fontSize: '2rem', color: '#2196f3' }}
            />
            <Typography variant="h4" fontWeight="bold">
              {task.name}
            </Typography>
          </Box>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            TASK DETAILS
          </Typography>
          <Typography variant="body1" mb={2}>
            {task.details || "No details available"}
          </Typography>
          <Button
            startIcon={<CalendarToday />}
            color="primary"
            aria-label="view calendar"
          >
            View calendar
          </Button>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            TIME OF DAY
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                icon={<AccessTime />}
                label="Due Time"
                variant="outlined"
                clickable
              />
            </Grid>
            <Grid item>
              <Chip
                label={`Points: ${task.point || 0}`}
                color="primary"
                clickable
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Modal>
  );
};

export default TaskModal;
