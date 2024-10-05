import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  Collapse,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import { HostName } from "../../script/HostName";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons"; // Import all icons in the ficons object
import DayGrid from "../../components/habit/DayGrid"; // Import DayGrid

const HabitHistory = () => {
  const [habits, setHabits] = useState([]);
  const [openHistory, setOpenHistory] = useState({});

  useEffect(() => {
    fetchHabitsHistory();
  }, []);

  const fetchHabitsHistory = async () => {
    try {
      const response = await axios.get(`${HostName}/api/HabitHistory`, {
        withCredentials: true,
      });
      setHabits(Array.isArray(response.data) ? response.data : []);
    } catch (error) {}
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm");
  };

  const getIcon = (iconName) => {
    return ficons[iconName] || ficons.faQuestion;
  };

  const toggleHistory = (habitId) => {
    setOpenHistory((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }));
  };

  return (
    <Box sx={{ padding: 2, border: "none" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }} color="#2196f3">
        History
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(habits) &&
          habits.map((habit) => (
            <Grid item xs={12} md={6} lg={4} key={habit.id}>
              <Card sx={{ height: "100%", border: `2px solid ${habit.color}` }}>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: habit.color,
                        width: "3rem",
                        height: "3rem",
                      }}
                    >
                      <FontAwesomeIcon icon={getIcon(habit.nameTouse)} />
                    </Avatar>
                  }
                  title={habit.name}
                  subheader={`Time Period: ${
                    habit.time_of_day || "Not specified"
                  }`}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Date of Activity:{" "}
                    {habit.complete_at && habit.complete_at.length > 0
                      ? formatDate(habit.complete_at[0])
                      : "No activity recorded"}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => toggleHistory(habit.id)}
                    sx={{ marginTop: 1 }}
                  >
                    {openHistory[habit.id] ? "Hide History" : "View History"}
                  </Button>
                  <Collapse
                    in={openHistory[habit.id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <DayGrid
                      createdAt={habit.created_at}
                      completeAt={habit.complete_at}
                    />
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default HabitHistory;
