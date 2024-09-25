import React, { useEffect, useState } from 'react';
import { Typography, Avatar, Grid, Card, CardContent, CardHeader, Paper, Button, Collapse, List, ListItem, Box } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons'; // Import all icons in the ficons object
import DayGrid from '../../components/habit/DayGrid'; // Import DayGrid

const HabitHistory = () => {
  const [habits, setHabits] = useState({});
  const [openHistory, setOpenHistory] = useState({}); // Store the state of opening/closing each activity

  useEffect(() => {
    axios.get(`${HostName}/api/HabitHistory`, { withCredentials: true })
      .then(response => {
        setHabits(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching habits:', error);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd HH:mm');
  };

  // Function to select an icon from nameTouse by looking at ficons
  const getIcon = (iconName) => {
    return ficons[iconName] || ficons.faQuestion; // If the icon is not found, it will display faQuestion
  };

  // Function to open/close the display of complete_at history
  const toggleHistory = (habitId) => {
    setOpenHistory(prev => ({
      ...prev,
      [habitId]: !prev[habitId] // Toggle the open/close state
    }));
  };

  return (
    <Box sx={{ padding: 2, border: 'none' }} >
      <Typography variant="h6" sx={{ marginBottom: 2 }} color='#2196f3' >History</Typography>
      <Grid container spacing={3}>
        {Object.values(habits).map((habit) => (
          <Grid item xs={12} md={6} lg={4} key={habit.id}>
            <Card sx={{ height: '100%', border: `2px solid ${habit.color}` }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: habit.color, width: '3rem', height: '3rem' }}>
                    <FontAwesomeIcon icon={getIcon(habit.nameTouse)} /> {/* Retrieve the icon based on nameTouse */}
                  </Avatar>
                }
                title={habit.name}
                subheader={`Time Period: ${habit.time_of_day || 'Not specified'}`}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Date of Activity: {formatDate(habit.complete_at[0])} {/* Display the latest complete_at */}
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => toggleHistory(habit.id)} 
                  sx={{ marginTop: 1 }}
                >
                  {openHistory[habit.id] ? 'Hide History' : 'View History'}
                </Button>
                <Collapse in={openHistory[habit.id]} timeout="auto" unmountOnExit>
                <DayGrid createdAt={habit.created_at} completeAt={habit.complete_at} /> {/* Add DayGrid */}

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
