import React from 'react';
import Button from '@mui/material/Button';
import TaskForm from './TaskForm';
import CustomModal from '../common/CustomModal';

const Tasks = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Create Task</Button>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Create Task"
      >
        <TaskForm formClose={handleClose} />
      </CustomModal>
    </>
  );
};

export default Tasks;
