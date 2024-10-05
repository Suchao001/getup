import React, { useState, useEffect } from "react";
import { Paper, Typography, Grid } from "@mui/material";
import HabitHistory from "./HabitHistory";
import axios from "axios";
import { HostName } from "../../script/HostName";
import TaskHistory from "./TaskHistory";

const ActivityPage = () => {
  const [habitCount, setHabitCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    axios
      .get(`${HostName}/api/HabitCount`, { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setHabitCount(response.data[0].count);
        } else {
          console.error("Unexpected response format:", response.data);
          setHabitCount(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching habit count:", error);
        setHabitCount(0);
      });
  }, []);

  const HabitDoneBar = () => {
    return (
      <Grid
        container
        spacing={1}
        sx={{ width: "100%", justifyContent: "end", alignItems: "center" }}
      >
        <Grid item xs={2}>
          <Typography variant="h6" sx={{ color: "#2196f3" }}>
            Habit Done
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" sx={{ color: "#2196f3" }}>
            {habitCount}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const TaskDoneBar = () => {
    return (
      <Grid
        container
        spacing={1}
        sx={{ width: "100%", justifyContent: "end", alignItems: "center" }}
      >
        <Grid item xs={2}>
          <Typography variant="h6" sx={{ color: "#2196f3" }}>
            Task Done
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" sx={{ color: "#2196f3" }}>
            {taskCount}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: "#fff" }}
      >
        <Typography variant="h6" gutterBottom color="#2196f3">
          Habits
        </Typography>
        <HabitDoneBar />
        <HabitHistory />
      </Paper>
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 3, backgroundColor: "#fff" }}
      >
        <Typography variant="h6" gutterBottom color="#2196f3">
          Tasks
        </Typography>
        <TaskDoneBar />
        <TaskHistory setTaskCount={setTaskCount} />
      </Paper>
    </>
  );
};

export default ActivityPage;
