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

const CreateTaskForm = ({ task = {}, isEdit = false, onFormClose }) => {
  const [taskName, setTaskName] = useState(task.name || '');
  const [color, setColor] = useState(task.color || '#1677ff');
  const [icon, setIcon] = useState(task.iconTouse || 'faUser');
  const [iconId, setIconId] = useState(task.iconId || null);
  const [icons, setIcons] = useState([]);
  const [deadline, setDeadline] = useState(task.deadline || '');
  const [priority, setPriority] = useState(task.priority || 1);
  const [points, setPoints] = useState(task.point || 0);

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        name: taskName,
        icon: iconId,
        color,
        deadline,
        priority,
        point: points,
      };
      const url = isEdit
        ? `${HostName}/api/tasks/update/${task.id}`  // Assuming task.id is the identifier
        : `${HostName}/api/tasks/create`;
      const response = await axios.post(url, taskData, { withCredentials: true });
      console.log(response.data);
      if (response.status === 200 || response.status === 201) {
        goodAlert('success', `Task ${isEdit ? 'updated' : 'created'} successfully`);
        if (onFormClose) onFormClose();  // Close the form after successful submission
      }
    } catch (error) {
      badAlert('error', `Error ${isEdit ? 'updating' : 'creating'} task`);
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Typography variant="h5" className="mb-4">
        {isEdit ? 'Edit Task' : 'Create Task'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Task Name"
          variant="outlined"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="mb-4"
        />

        <Typography variant="subtitle1" className="mb-2">
          ICON AND COLOR
        </Typography>
        <Grid container alignItems="center" className="mb-4">
          <Grid item>
            <FontAwesomeIcon style={{ width: '30px', height: '30px' }} icon={ficons[icon]} />
          </Grid>
          <Grid item>
            <IconPicker icons={icons} icon={icon} onSelectIcon={setIcon} onSelectIconId={setIconId} style={{ flexGrow: 1 }} />
          </Grid>
          <Grid item>
            <CustomColorPicker color={color} onChange={setColor} />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" className="mb-2">
          DEADLINE
        </Typography>
        <TextField
          type="datetime-local"
          fullWidth
          variant="outlined"
          value={deadline || ''}
          onChange={(e) => setDeadline(e.target.value)}
          className="mb-4"
        />

        <Typography variant="subtitle1" className="mb-2">
          PRIORITY
        </Typography>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
          className="mb-4"
        >
          {[1, 2, 3].map((level) => (
            <MenuItem key={level} value={level}>
              {`Priority ${level}`}
            </MenuItem>
          ))}
        </Select>

        <TextField
          type="number"
          fullWidth
          label="Points"
          variant="outlined"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="mb-4"
        />

        <Button variant="contained" color="primary" fullWidth type="submit">
          {isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </ThemeProvider>
  );
};

export default CreateTaskForm;
