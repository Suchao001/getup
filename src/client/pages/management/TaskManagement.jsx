import React, { useState, useEffect } from "react";
import { Typography, Paper, Box, Button, Pagination } from "@mui/material";
import useFetchTasks from "../../hooks/useFetchTasks";
import TaskForm from "../../components/task/TaskForm";
import CustomModal from "../../components/common/CustomModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { HostName } from "../../script/HostName";
import { deleteConfirm, goodAlert } from "../../script/sweet";

function TaskManagement({ itemsPerPage }) {
  const { taskData, fetchTasks } = useFetchTasks({});
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPage, setTaskPage] = useState(1);

  useEffect(() => {
    if (taskData) {
      setTasks(taskData);
    }
  }, [taskData]);

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

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
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
    <>
      <Typography variant="h6" gutterBottom color="#2196f3">
        Tasks
      </Typography>
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          marginBottom: "16px",
        }}
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
            fetchTasks={fetchTasks}
            formClose={() => setEditingTask(null)}
          />
        )}
      </CustomModal>
    </>
  );
}

export default TaskManagement;
