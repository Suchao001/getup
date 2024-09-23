import React, { useState, useEffect,useRef } from 'react';
import {
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Grid,
  Box,
  Chip,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import CustomColorPicker from '../common/ColorPicker';
import IconPicker from '../common/IconPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons'; 
import { badAlert, goodAlert } from '../../script/sweet';
import { WbSunny, NightsStay } from '@mui/icons-material';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
  },
});

const EditHabitForm = ({ open,habit, isEdit,fetchHabits,recommendHabit }) => {

  const [habitName, setHabitName] = useState(habit?.name || '');
  const [frequency, setInterval] = useState(habit?.frequency || 'daily');
  const [color, setColor] = useState(habit?.color || '#1677ff');
  const [icon, setIcon] = useState(habit?.icon || 'faUser');
  const [iconId, setIconId] = useState(habit?.icon_id || 3);
  const [icons, setIcons] = useState([]);
  const [selectedDays, setSelectedDays] = useState(habit?.days || []);
  const [selectedDates, setSelectedDates] = useState(habit?.dates || []);
  const [timeOfDay, setTimeOfDay] = useState(habit?.time_of_day || 'Anytime');
  const inputRef = useRef(null);
  

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await axios.get(`${HostName}/api/icons`);
        setIcons(response.data);

      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchIcons();
    if(open&& inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (isEdit && habit) {
      setHabitName(habit.name);
      setInterval(habit.frequency);
      setColor(habit.color);
      setIconId(habit.icon_id);
      setSelectedDays(habit.days || []);
      setSelectedDates(habit.dates || []);
      setTimeOfDay(habit.time_of_day || 'Anytime');
    }
    if(recommendHabit){
      setHabitName(recommendHabit.name);
      setColor(recommendHabit.color);
      setIconId(recommendHabit.icon_id);
      setIcon(recommendHabit.nameToUse);
      console.log(recommendHabit);
    }
  }, [isEdit, habit]);

  const handleIntervalChange = (event, newInterval) => {
    if (newInterval !== null) {
      setInterval(newInterval);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const habitData = {
        name: habitName,
        icon_id: iconId,
        color,
        frequency,
        ...(frequency === 'weekly' && selectedDays.length > 0 && { days: selectedDays }),
        ...(frequency === 'monthly' && selectedDates.length > 0 && { dates: selectedDates }),
        time_of_day: timeOfDay,
      };
     
      let response;
      if (isEdit) {
        response = await axios.put(`${HostName}/api/habits/update/${habit.id}`, habitData, { withCredentials: true });
      } else {
        response = await axios.post(`${HostName}/api/habits/create`, habitData, { withCredentials: true });
      }
      if (response.status === 200 || response.status === 201) {
        goodAlert('success', isEdit ? 'Habit updated successfully' : 'Habit created successfully');
        fetchHabits;
      }
    } catch (error) {
      badAlert('error', isEdit ? 'Error updating habit' : 'Error creating habit');
      console.error('Error:', error);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const toggleDate = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date]
    );
  };

  const handleTimeOfDayChange = (newTimeOfDay) => {
    setTimeOfDay(newTimeOfDay);
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const datesOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <ThemeProvider theme={theme}>

      <Typography variant="h5" style={{marginBottom:"1rem"}}>
        {isEdit ? 'Edit Habit' : 'Create Habit'}
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
    
      </Box>
    
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="NAME"
          variant="outlined"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          style={{marginBottom:"1rem"}}
          inputRef={inputRef}
        />

        <Typography variant="subtitle1" style={{marginBottom:"0.5rem"}}>
          ICON AND COLOR
        </Typography>
        <Grid container alignItems="center" style={{marginBottom:"1rem"}}>
          <Grid item>
            <FontAwesomeIcon style={{ width: '30px', height: '30px' }} icon={ficons[icon]} />
          </Grid>
          <Grid item>
            <IconPicker icons={icons} icon={icon} onSelectIcon={setIcon} onSelectIconId={setIconId} />
          </Grid>
          <Grid item>
            <CustomColorPicker color={color} onChange={setColor} />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" style={{marginBottom:"0.5rem"}}>
          INTERVAL AND REPETITION
        </Typography>
        <ToggleButtonGroup
          value={frequency}
          exclusive
          onChange={handleIntervalChange}
          style={{marginBottom:"0.7rem"}}
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>

        {frequency === 'weekly' && (
          <Grid container spacing={1} style={{marginBottom:"1rem"}}>
            {daysOfWeek.map((day) => (
              <Grid item key={day}>
                <Button
                  variant={selectedDays.includes(day) ? 'contained' : 'outlined'}
                  onClick={() => toggleDay(day)}
                  style={{ borderRadius: '50%' }}
                >
                  {day}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        {frequency === 'monthly' && (
          <Grid container spacing={1} style={{marginBottom:"1rem"}}>
            {datesOfMonth.map((date) => (
              <Grid item key={date}>
                <Button
                  variant={selectedDates.includes(date) ? 'contained' : 'outlined'}
                  onClick={() => toggleDate(date)}
                  style={{ borderRadius: '50%', width: 40, height: 40 }}
                >
                  {date}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            TIME OF DAY
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                icon={<WbSunny />}
                label="Morning"
                variant={timeOfDay === 'Morning' ? 'filled' : 'outlined'}
                onClick={() => handleTimeOfDayChange('Morning')}
                clickable
                color="primary"
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<WbSunny />}
                label="Afternoon"
                variant={timeOfDay === 'Afternoon' ? 'filled' : 'outlined'}
                onClick={() => handleTimeOfDayChange('Afternoon')}
                clickable
                color="primary"
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<NightsStay />}
                label="Night"
                variant={timeOfDay === 'Night' ? 'filled' : 'outlined'}
                onClick={() => handleTimeOfDayChange('Night')}
                clickable
                color="primary"
              />
            </Grid>
            <Grid item>
              <Chip
                label="Anytime"
                variant={timeOfDay === 'Anytime' ? 'filled' : 'outlined'}
                onClick={() => handleTimeOfDayChange('Anytime')}
                clickable
                color="primary"
              />
            </Grid>
          </Grid>
        </Box>

        <Button variant="contained" color="primary" fullWidth type="submit">
          {isEdit ? 'Update Habit' : 'Create Habit'}
        </Button>

      </form>
    </ThemeProvider>
  );
};

export default EditHabitForm;
