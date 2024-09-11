import React, { useState } from 'react';
import {   Typography, Grid } from '@mui/material';
import TaskCard from './TaskCard';
import useFetchTasks from '../../hooks/useFetchTasks';
import TaskModal from './TaskModal';

const TaskList = () => {
  const [selectedTask, setSelectedTask] = useState(null);  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);  
  const { taskData, error: taskError } = useFetchTasks();

  const handleOpenTaskDetail = (task) => () => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  if (taskData.length === 0) {
    return <Typography variant="h6">No tasks found.</Typography>;
  }

  const completedTasks = taskData.filter(task => task.is_complete);
  const incompleteTasks = taskData.filter(task => !task.is_complete);

  return (
    <>
     {incompleteTasks.length > 0 && (
       <>
         <Typography variant="h5" gutterBottom>Incomplete Tasks</Typography>
         <Grid container spacing={2}>
           {incompleteTasks.map((task) => (
             <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
               <TaskCard task={task} handleOpenDetail={handleOpenTaskDetail(task)} />
             </Grid>
           ))}
         </Grid>
       </>
     )}

     {completedTasks.length > 0 && (
       <div style={{marginTop:'-2rem'}}>
         <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>Completed Tasks</Typography>
         <Grid container spacing={2}>
           {completedTasks.map((task) => (
             <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
               <TaskCard task={task} handleOpenDetail={handleOpenTaskDetail(task)} />
             </Grid>
           ))}
         </Grid>
       </div>
     )}
     
      {selectedTask && (
        <TaskModal
          open={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          task={selectedTask}
        />
      )}
    </>
  );
};

export default TaskList;
