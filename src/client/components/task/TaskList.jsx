import React, { useState } from 'react';
import { Typography, Grid } from '@mui/material';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import moment from 'moment';

const TaskList = ({ fetchTasks, taskData }) => {
  const [selectedTask, setSelectedTask] = useState(null);  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);  

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

  const completedTasks = [];
  const incompleteTasks = [];
  const lateTasks = [];
  const today = moment().startOf('day');
  const sevenDaysAgo = moment().subtract(14, 'days').startOf('day');
 

  taskData.forEach(task => {
    const updatedAt = moment(task.updated_at).startOf('day');
    if (task.is_complete) {
      if (updatedAt.isAfter(sevenDaysAgo)) {
        completedTasks.push(task);
      }
    } else if (task.deadline < today.format('YYYY-MM-DD') && task.deadline !== null) {
      lateTasks.push(task);
    } else {
      incompleteTasks.push(task);
    }
  });

  return (
    <>
     {incompleteTasks.length > 0 && (
       <>
         <Typography variant="h5" gutterBottom>Incomplete Tasks</Typography>
         <Grid container spacing={2}>
           {incompleteTasks.map((task) => (
             <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
               <TaskCard task={task} handleOpenDetail={handleOpenTaskDetail(task)} fetchTasks={fetchTasks} />
             </Grid>
           ))}
         </Grid>
       </>
     )}

     {completedTasks.length > 0 && (
       <div style={{marginTop:'-2rem'}}>
         <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>Completed Tasks  (last 14 days)</Typography>
         <Grid container spacing={2}>
           {completedTasks.map((task) => (
             <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
               <TaskCard task={task} handleOpenDetail={handleOpenTaskDetail(task)} fetchTasks={fetchTasks} />
             </Grid>
           ))}
         </Grid>
       </div>
     )}

     {lateTasks.length > 0 && (
       <div style={{marginTop:'-2rem'}}>
         <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>Late Tasks</Typography>
         <Grid container spacing={2}>
           {lateTasks.map((task) => (
             <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
               <TaskCard task={task} handleOpenDetail={handleOpenTaskDetail(task)} isLate={true} fetchTasks={fetchTasks} />
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
          fetchTasks={fetchTasks}
        />
      )}
    </>
  );
};

export default TaskList;
