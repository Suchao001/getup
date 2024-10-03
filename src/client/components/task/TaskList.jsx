import React, { useState } from "react";
import { Typography, Grid } from "@mui/material";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import moment from "moment";
import { motion } from "framer-motion";

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
  const today = moment().startOf("day");
  const sevenDaysAgo = moment().subtract(14, "days").startOf("day");

  taskData.forEach((task) => {
    const updatedAt = moment(task.updated_at).startOf("day");
    if (task.is_complete) {
      if (updatedAt.isAfter(sevenDaysAgo)) {
        completedTasks.push(task);
      }
    } else if (
      task.deadline < today.format("YYYY-MM-DD") &&
      task.deadline !== null
    ) {
      lateTasks.push(task);
    } else {
      incompleteTasks.push(task);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      {incompleteTasks.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Typography variant="h5" gutterBottom>
            Incomplete Tasks
          </Typography>
          <Grid container spacing={2}>
            {incompleteTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                <motion.div variants={itemVariants}>
                  <TaskCard
                    task={task}
                    handleOpenDetail={handleOpenTaskDetail(task)}
                    fetchTasks={fetchTasks}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {completedTasks.length > 0 && (
        <motion.div
          style={{ marginTop: "-2rem" }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Typography variant="h5" gutterBottom style={{ marginTop: "2rem" }}>
            Completed Tasks (last 14 days)
          </Typography>
          <Grid container spacing={2}>
            {completedTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                <motion.div variants={itemVariants}>
                  <TaskCard
                    task={task}
                    handleOpenDetail={handleOpenTaskDetail(task)}
                    fetchTasks={fetchTasks}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {lateTasks.length > 0 && (
        <motion.div
          style={{ marginTop: "-2rem" }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Typography variant="h5" gutterBottom style={{ marginTop: "2rem" }}>
            Late Tasks
          </Typography>
          <Grid container spacing={2}>
            {lateTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                <motion.div variants={itemVariants}>
                  <TaskCard
                    task={task}
                    handleOpenDetail={handleOpenTaskDetail(task)}
                    isLate={true}
                    fetchTasks={fetchTasks}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
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
