import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Pagination,
  LinearProgress,
} from "@mui/material";
import useFetchHabits from "../../hooks/useFetchHabits";
import useFetchTasks from "../../hooks/useFetchTasks";
import HabitForm from "../../components/habit/HabitForm";
import TaskForm from "../../components/task/TaskForm";
import CustomModal from "../../components/common/CustomModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { HostName } from "../../script/HostName";
import { deleteConfirm, goodAlert } from "../../script/sweet";
import useFetchUserProfile from "../../hooks/FetchUserProfile";
import TotalPointsProgress from "../../components/common/TotalPointsProgress";

function ManagementPage() {
  const { habitData, refetchHabits } = useFetchHabits({});
  const { taskData, refetchTasks } = useFetchTasks({});
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [habitPage, setHabitPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const { userProfile } = useFetchUserProfile();
  const itemsPerPage = 5;

  useEffect(() => {
    if (habitData) {
      setHabits(habitData);
    }
  }, [habitData]);

  useEffect(() => {
    if (taskData) {
      setTasks(taskData);
    }
  }, [taskData]);

  const handleDeleteHabit = async (habit) => {
    const isConfirmed = await deleteConfirm(
      "Delete Habit",
      "Are you sure you want to delete this habit?"
    );
    if (!isConfirmed) return;
    try {
      await axios.delete(`${HostName}/api/habits/delete/${habit.id}`, {
        withCredentials: true,
      });
      goodAlert("Habit deleted successfully");
      refetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const handleDeleteTask = async (task) => {
    const isConfirmed = await deleteConfirm(
      "Delete Task",
      `Are you sure you want to delete task "${task.name}"?`
    );
    if (!isConfirmed) return;
    try {
      await axios.delete(`${HostName}/api/tasks/${task.id}`, {
        withCredentials: true,
      });
      goodAlert("Task deleted successfully");
      refetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const renderHabits = () => {
    const startIndex = (habitPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedHabits = habits.slice(startIndex, endIndex);

    return paginatedHabits.map((habit) => (
      <Box key={habit.id} mb={2} display="flex" alignItems="center">
        <FontAwesomeIcon
          icon={ficons[habit.nameTouse] || ficons.faUser}
          style={{
            fontSize: "1.5rem",
            marginRight: "10px",
            color: habit.color,
          }}
        />
        <Typography variant="body1">{habit.name}</Typography>
        <Box ml="auto">
          <Button onClick={() => setEditingHabit(habit)}>Edit</Button>
          <Button onClick={() => handleDeleteHabit(habit)}>Delete</Button>
        </Box>
      </Box>
    ));
  };

  const renderTasks = () => {
    const startIndex = (taskPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    return paginatedTasks.map((task) => (
      <Box key={task.id} mb={2} display="flex" alignItems="center">
        <FontAwesomeIcon
          icon={ficons[task.nameTouse] || ficons.faTasks}
          style={{ fontSize: "1.5rem", marginRight: "10px", color: task.color }}
        />
        <Typography variant="body1">{task.name}</Typography>
        <Box ml="auto">
          <Button onClick={() => setEditingTask(task)}>Edit</Button>
          <Button onClick={() => handleDeleteTask(task)}>Delete</Button>
        </Box>
      </Box>
    ));
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Typography variant="h6" gutterBottom color="#2196f3">
            Habits
          </Typography>

          <TotalPointsProgress habits={habits} userProfile={userProfile} />

          <Paper
            sx={{ borderRadius: "8px", padding: "16px", marginBottom: "16px" }}
          >
            {renderHabits()}
            <Pagination
              count={Math.ceil(habits.length / itemsPerPage)}
              page={habitPage}
              onChange={(event, value) => setHabitPage(value)}
            />
          </Paper>
          <CustomModal
            open={!!editingHabit}
            onClose={() => setEditingHabit(null)}
            title="Edit Habit"
          >
            {editingHabit && (
              <HabitForm
                habit={editingHabit}
                isEdit={true}
                refetchHabits={refetchHabits}
                open={true}
              />
            )}
          </CustomModal>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h6" gutterBottom color="#2196f3">
            Tasks
          </Typography>
          <Paper
            sx={{ borderRadius: "8px", padding: "16px", marginBottom: "16px" }}
          >
            {renderTasks()}
            <Pagination
              count={Math.ceil(tasks.length / itemsPerPage)}
              page={taskPage}
              onChange={(event, value) => setTaskPage(value)}
            />
          </Paper>
          <CustomModal
            open={!!editingTask}
            onClose={() => setEditingTask(null)}
            title="Edit Task"
          >
            {editingTask && (
              <TaskForm
                task={editingTask}
                isEdit={true}
                fetchTasks={refetchTasks}
                onFormClose={() => setEditingTask(null)}
              />
            )}
          </CustomModal>
        </Grid>
      </Grid>
    </div>
  );
}

export default ManagementPage;
