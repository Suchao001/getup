import React, { useState, useEffect,useRef } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Paper,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { HostName } from './../../script/HostName';
import CustomColorPicker from '../common/ColorPicker';
import IconPicker from '../common/IconPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import { goodAlert, badAlert } from '../../script/sweet';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
  },
});

const PopupForm = ({ selectedDate, onClose,plan={}, isEdit = false, onFormClose }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    color: plan?.color || '#1677ff',
    start_date: selectedDate || '',
    end_date: plan?.end_date || '',
    start_time: plan?.start_time || '',
    end_time: plan?.end_time || '',
    priority: plan?.priority || '',
  });

  const [icon, setIcon] = useState(plan?.iconTouse || 'faUser');
  const [iconId, setIconId] = useState(plan?.iconId || 3);
  const [icons, setIcons] = useState([]);
  const focusRef = useRef(null);

  useEffect(() => {
    if (isEdit && plan) {
      setFormData({
        ...formData,
        name: plan.name,
        description: plan.description,
        color: plan.color,
        start_date: plan.start_date,
        end_date: plan.end_date,
        start_time: plan.start_time,
        end_time: plan.end_time,
        priority: plan.priority,
      });
      setIcon(plan.iconTouse);
      setIconId(plan.iconId);
    }
  }, [isEdit, plan]);

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
    focusRef.current.focus();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.icon_id = iconId;
    if(!formData.start_time === '' || !formData.end_time === ''){
    if(formData.start_date > formData.end_date){
      badAlert('Start date cannot be greater than end date');
      return;
    }
    }
    try {    
      let response;
      if (isEdit) {
        response = await axios.put(`${HostName}/api/plans/update/${plan.id}`, formData, { withCredentials: true });
      } else {
        response = await axios.post(`${HostName}/api/plans/create`, formData, { withCredentials: true });
      }
  
      if (response.status === 200 || response.status === 201) {
        goodAlert(isEdit ? 'Plan updated successfully' : 'Plan created successfully');
        onFormClose(); 
      }
    } catch (error) {
      badAlert(isEdit ? 'Error updating plan' : 'Error creating plan');
      console.error(error); 
    }
  
    onClose();
  };
  


  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
        <Typography variant="h6" className="mb-4" align="center">
          {isEdit ? 'Edit Plan' : 'Create Plan'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            className="mb-2"
            inputRef={focusRef}
            required
                      />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            className="mb-2"
          />
          <Grid container spacing={2} alignItems="center" className="mb-4">
            <Grid item xs={12}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon style={{ width: '30px', height: '30px' }} icon={ficons[icon]} />

              <IconPicker icons={icons} icon={icon} onSelectIcon={setIcon} onSelectIconId={setIconId} style={{ flexGrow: 1 }} />
                <CustomColorPicker
                  color={formData.color}
                  onChange={(color) => setFormData({ ...formData, color })}
                  style={{ width: 'auto' }} // Allow CustomColorPicker to adjust width
                />
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="mb-4">
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="start_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.start_date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                name="end_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.end_date}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} className="mb-4">
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Time"
                name="start_time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.start_time}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Time"
                name="end_time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.end_time}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth variant="outlined" className="mb-4">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="1">High</MenuItem>
              <MenuItem value="2">Medium</MenuItem>
              <MenuItem value="3">Low</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex" justifyContent="center">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default PopupForm;
