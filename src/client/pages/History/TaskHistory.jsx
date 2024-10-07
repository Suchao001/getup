import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Collapse,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import { HostName } from "../../script/HostName";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons"; // Import all icons in the ficons object

const TaskHistory = ({ setTaskCount }) => {
  const [tasks, setTasks] = useState([]);
  const [openHistory, setOpenHistory] = useState({}); // Store the open/close state of each task

  useEffect(() => {
    axios
      .get(`${HostName}/api/tasks/done`, { withCredentials: true })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTasks(response.data);
          setTaskCount(response.data.length); // Set the count of completed tasks
        } else {
          setTasks([]);
          setTaskCount(0);
        }
      })
      .catch((error) => {
        setTasks([]);
        setTaskCount(0);
      });
  }, [setTaskCount]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : format(date, "yyyy-MM-dd HH:mm");
  };

  // Function to select an icon from nameTouse by looking at ficons
  const getIcon = (iconName) => {
    return iconName && ficons[iconName] ? ficons[iconName] : ficons.faQuestion; // If icon not found or undefined, show faQuestion
  };

  // Function to toggle the display of task history
  const toggleHistory = (taskId) => {
    setOpenHistory((prev) => ({
      ...prev,
      [taskId]: !prev[taskId], // Toggle open/close state
    }));
  };

  return (
    <Box sx={{ padding: 2, border: "none" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }} color="#2196f3">
        Task Done History
      </Typography>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} lg={4} key={task.id}>
            <Card
              sx={{
                height: "100%",
                border: `1px solid  ${task.color || "#000"}`,
                boxShadow: `0px 0px 3px 0px ${task.color}`,
                borderRadius: 3,
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: task.color || "#000",
                      width: "3rem",
                      height: "3rem",
                    }}
                  >
                    <FontAwesomeIcon icon={getIcon(task.nameTouse)} />{" "}
                    {/* Display icon based on nameTouse */}
                  </Avatar>
                }
                title={task.name || "Unnamed Task"}
                subheader={`Priority: ${task.priority || "Not set"}`}
              />
              <CardContent>
                <Button
                  variant="outlined"
                  onClick={() => toggleHistory(task.id)}
                  sx={{ marginTop: 1 }}
                >
                  {openHistory[task.id] ? "Hide Details" : "Show Details"}
                </Button>
                <Collapse
                  in={openHistory[task.id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <Typography variant="body2" color="text.secondary">
                    Deadline: {formatDate(task.deadline)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updated at: {formatDate(task.updated_at)}
                  </Typography>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskHistory;
