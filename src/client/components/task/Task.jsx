import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TaskForm from './TaskForm';
import CustomModal from '../common/CustomModal';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Tooltip } from '@mui/material';
const Tasks = ({ fetchTasks, buttonstyle }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {buttonstyle === 'text' ? (
        <Button variant="text" onClick={handleOpen}>
          Add Task
        </Button>
      ) : (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <Tooltip title="Add Task">
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
              <TaskAltIcon />
            </Fab>
          </Tooltip>
        </Box>
      )}
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Create Task"
      >
        <TaskForm open={true} formClose={handleClose} isEdit={false} fetchTasks={fetchTasks} />
      </CustomModal>
    </>
  );
};

export default Tasks;
