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

  if (!Array.isArray(taskData) || taskData.length === 0) {
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

  const renderTaskGrid = (tasks, title, isLate = false) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return null;

    return (
      <motion.div
        style={{ marginTop: title !== "Incomplete Tasks" ? "-2rem" : "0" }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Typography variant="h5" gutterBottom style={{ marginTop: "2rem" }}>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                <motion.div variants={itemVariants}>
                  <TaskCard
                    task={task}
                    handleOpenDetail={handleOpenTaskDetail(task)}
                    isLate={isLate}
                    fetchTasks={fetchTasks}
                  />
                </motion.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1">No tasks available.</Typography>
            </Grid>
          )}
        </Grid>
      </motion.div>
    );
  };

  return (
    <>
      {renderTaskGrid(incompleteTasks, "Incomplete Tasks")}
      {renderTaskGrid(completedTasks, "Completed Tasks (last 14 days)")}
      {renderTaskGrid(lateTasks, "Late Tasks", true)}

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
