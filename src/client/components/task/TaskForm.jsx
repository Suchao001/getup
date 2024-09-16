import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import CustomColorPicker from '../common/ColorPicker';
import IconPicker from '../common/IconPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import { badAlert, goodAlert } from '../../script/sweet';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

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
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    console.log('Task name updated:', taskName);
  }, [taskName]);

  useEffect(() => {
    if(isEdit){
    setTaskName(task.name || '');
    setColor(task.color || '#1677ff');
    setIcon(task.iconTouse || 'faUser');
    setIconId(task.icon_id || null);
    setDeadline(task.deadline || '');
    setPriority(task.priority || 1);
    setPoints(task.point || 0);
    }
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

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Task Name"
              variant="outlined"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              style={{marginBottom:'1rem'}}
            />
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography>Priority:</Typography>
              </Grid>
              <Grid item>
                <ToggleButtonGroup
                  value={priority}
                  exclusive
                  onChange={(e, newPriority) => setPriority(newPriority)}
                >
                  <ToggleButton value={1}>
                    <FontAwesomeIcon icon={faFlag} color="green" />
                  </ToggleButton>
                  <ToggleButton value={2}>
                    <FontAwesomeIcon icon={faFlag} color="orange" />
                  </ToggleButton>
                  <ToggleButton value={3}>
                    <FontAwesomeIcon icon={faFlag} color="red" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="subtitle1" style={{marginBottom:'0.5rem'}}>
              ICON AND COLOR
            </Typography>
            {/* Your existing icon and color picker code */}
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="subtitle1" style={{marginBottom:'0.5rem'}}>
              DEADLINE
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="Date"
                  value={deadline}
                  onChange={(newDate) => setDeadline(newDate)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="Time"
                  value={deadline}
                  onChange={(newTime) => setDeadline(newTime)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h5" style={{marginBottom:'1rem'}}>
          {isEdit ? 'Edit Task' : 'Create Task'}
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel style={{marginBottom: '2rem'}}>
          <Step><StepLabel>Basic Info</StepLabel></Step>
          <Step><StepLabel>Icon & Color</StepLabel></Step>
          <Step><StepLabel>Deadline</StepLabel></Step>
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'space-between'}}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={activeStep === 2 ? handleSubmit : handleNext}
            >
              {activeStep === 2 ? (isEdit ? 'Update Task' : 'Create Task') : 'Next'}
            </Button>
          </div>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default TaskForm;
