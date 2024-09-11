import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Select
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import CustomColorPicker from '../common/ColorPicker';
import IconPicker from '../common/IconPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import { badAlert, goodAlert } from '../../script/sweet';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
  },
});

const TaskForm = ({ task = {}, isEdit = false, onFormClose, fetchTasks }) => {
  const [taskName, setTaskName] = useState(task.name || '');
  const [color, setColor] = useState(task.color || '#1677ff');
  const [icon, setIcon] = useState(task.iconTouse || 'faUser');
  const [iconId, setIconId] = useState(task.iconId || null);
  const [icons, setIcons] = useState([]);
  const [deadline, setDeadline] = useState(task.deadline || '');
  const [priority, setPriority] = useState(task.priority || 1);
  const [points, setPoints] = useState(task.point || 0);

  useEffect(() => {
    setTaskName(task.name || '');
    setColor(task.color || '#1677ff');
    setIcon(task.iconTouse || 'faUser');
    setIconId(task.icon_id || null);
    setDeadline(task.deadline || '');
    setPriority(task.priority || 1);
    setPoints(task.point || 0);
  }, [task]);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await axios.get(`${HostName}/api/icons`);
        setIcons(response.data);
      } catch (error) {
        console.error('Error fetching icons:', error);
      }
    };
    fetchIcons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        name: taskName,
        icon_id: iconId,
        color,
        deadline,
        priority,
        point: points,
      };
      const url = isEdit
        ? `${HostName}/api/tasks/update/${task.id}`
        : `${HostName}/api/tasks/create`;
      const method = isEdit ? 'put' : 'post';
      const response = await axios[method](url, taskData, { withCredentials: true });
      
      if (response.status === 200 || response.status === 201) {
        goodAlert('success', `Task ${isEdit ? 'updated' : 'created'} successfully`);
        if (fetchTasks) fetchTasks();
        if (onFormClose) onFormClose();
      }
    } catch (error) {
      badAlert('error', `Error ${isEdit ? 'updating' : 'creating'} task`);
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Typography variant="h5" style={{marginBottom:'1rem'}}>
        {isEdit ? 'Edit Task' : 'Create Task'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Task Name"
          variant="outlined"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={{marginBottom:'1rem'}}
        />

        <Typography variant="subtitle1" style={{marginBottom:'0.5rem'}}>
          ICON AND COLOR
        </Typography>
        <Grid container alignItems="center" spacing={2} style={{marginBottom:'1rem'}}>
          <Grid item>
            <FontAwesomeIcon style={{ width: '30px', height: '30px' }} icon={ficons[icon]} />
          </Grid>
          <Grid item xs>
            <IconPicker icons={icons} icon={icon} onSelectIcon={setIcon} onSelectIconId={setIconId} />
          </Grid>
          <Grid item>
            <CustomColorPicker color={color} onChange={setColor} />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" style={{marginBottom:'0.5rem'}}>
          DEADLINE
        </Typography>
        <TextField
          type="datetime-local"
          fullWidth
          variant="outlined"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{marginBottom:'1rem'}}
        />

        <Typography variant="subtitle1" style={{marginBottom:'0.5rem'}}>
          PRIORITY
        </Typography>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
          style={{marginBottom:'1rem'}}
        >
          {["LOW", "MEDIUM", "HIGH"].map((level, index) => (
            <MenuItem key={level} value={index + 1}>
              {level}
            </MenuItem>
          ))}
        </Select>

        <TextField
          type="number"
          fullWidth
          label="Points"
          variant="outlined"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          style={{marginBottom:'1rem'}}
        />

        <Button variant="contained" color="primary" fullWidth type="submit">
          {isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </ThemeProvider>
  );
};

export default TaskForm;
