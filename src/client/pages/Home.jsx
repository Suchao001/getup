import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Grid, Typography } from '@mui/material';
import HabitCard from '../components/habit/HabitCard';
import AuthContext from '../context/AuthContext';
import { HostName } from '../script/HostName';
import Habit from '../components/habit/Habit';
import HabitModal from '../components/habit/HabitModal';
import Task from '../components/task/Task.jsx';
import TaskCard from '../components/task/TaskCard.jsx';
import TaskModal from '../components/task/TaskModal';  // Import the TaskModal component

function Home() {
  const [habitData, setHabitData] = useState([]);
  const { isLogin } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);  // New state for selected task
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);  // New state for task modal
  const [taskData, setTaskData] = useState([]);

  const fetchHabits = async (date) => {
    try {
      const response = await axios.get(`${HostName}/api/habits`, { withCredentials: true });
      setHabitData(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setError('Failed to load habits. Please try again later.');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${HostName}/api/tasks`, { withCredentials: true });
      setTaskData(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchHabits(selectedDate);
      fetchTasks();
    }
  }, [isLogin, selectedDate]);

  const handleOpenHabitDetail = (habit) => () => {
    setSelectedHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleCloseHabitModal = () => {
    setIsHabitModalOpen(false);
    setSelectedHabit(null);
  };

  const handleOpenTaskDetail = (task) => () => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const TaskList = () => {
    if (taskData.length === 0) {
      return <Typography variant="h6">No tasks found.</Typography>;
    }

    return (
      <Grid container spacing={2}>
        {taskData.map((task) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
            <TaskCard task={task} handleOpenDetail={handleOpenTaskDetail(task)} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const HabitList = () => {
    if (habitData.length === 0) {
      return <Typography variant="h6">No habits found.</Typography>;
    }

    return (
      <Grid container spacing={2}>
        {habitData.map((habit) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={habit.id}>
            <HabitCard habit={habit} handleOpenDetail={handleOpenHabitDetail(habit)} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <div className="container">
      <h1 className='font2'>Habits</h1>
      <Habit fetchHabits={fetchHabits}/>
      {error && <p className="text-danger">{error}</p>}
      <HabitList />
      {selectedHabit && (
        <HabitModal
          open={isHabitModalOpen}
          onClose={handleCloseHabitModal}
          habit={selectedHabit}
          title={selectedHabit.name}
          details={selectedHabit.details}
          frequency={selectedHabit.frequency}
          dates={selectedHabit.dates}
          days={selectedHabit.days}
        />
      )}
      <h1 className='font2'>Tasks</h1>
      <Task fetchTasks={fetchTasks}/>
      <TaskList />
      {selectedTask && (
        <TaskModal
          open={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          task={selectedTask}
        />
      )}
    </div>
  );
}

export default Home;
