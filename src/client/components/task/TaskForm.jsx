import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import { HostName } from "../../script/HostName";
import CustomColorPicker from "../common/ColorPicker";
import IconPicker from "../common/IconPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons";
import { badAlert, goodAlert } from "../../script/sweet";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2196f3",
    },
  },
});

const TaskForm = ({ task = {}, isEdit = false, formClose, fetchTasks }) => {
  const [taskName, setTaskName] = useState(task.name || "");
  const [color, setColor] = useState(task.color || "#1677ff");
  const [icon, setIcon] = useState(task.iconTouse || "faUser");
  const [iconId, setIconId] = useState(task.icon_id || 3);
  const [icons, setIcons] = useState([]);
  const [deadline, setDeadline] = useState(
    task.deadline ? dayjs(task.deadline) : null
  );
  const [priority, setPriority] = useState(task.priority || 3);
  const [points, setPoints] = useState(task.point || 0);
  const [taskList, setTaskList] = useState([]);
  const [newListItem, setNewListItem] = useState("");

  useEffect(() => {
    if (isEdit) {
      setTaskName(task.name || "");
      setColor(task.color || "#1677ff");
      setIcon(task.nameTouse || "faUser");
      setIconId(task.icon_id || null);
      setDeadline(task.deadline ? dayjs(task.deadline) : null);
      setPriority(task.priority || 1);
      setPoints(task.point || 0);
      setTaskList(task.task_list.map((item) => item.list_name) || []);
    }
  }, [task]);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await axios.get(`${HostName}/api/icons`);
        setIcons(response.data);
      } catch (error) {
        console.error("Error fetching icons:", error);
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
        deadline: deadline ? deadline.toISOString() : null,
        priority,
        point: points,
        task_list: taskList,
      };

      const url = isEdit
        ? `${HostName}/api/tasks/update/${task.id}`
        : `${HostName}/api/tasks/create`;
      const method = isEdit ? "put" : "post";
      const response = await axios[method](url, taskData, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        if (fetchTasks) {
          fetchTasks();
        } else {
          window.location.reload();
        }
        formClose();
        goodAlert(
          "success",
          `Task ${isEdit ? "updated" : "created"} successfully`
        );
      }
    } catch (error) {
      badAlert("error", `Error ${isEdit ? "updating" : "creating"} task`);
      console.error("Error:", error);
    }
  };

  const handleAddListItem = () => {
    if (newListItem.trim() !== "") {
      setTaskList([...taskList, newListItem.trim()]);
      setNewListItem("");
    }
  };

  const handleDeleteListItem = (index) => {
    const updatedList = taskList.filter((_, i) => i !== index);
    setTaskList(updatedList);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <Grid
            container
            spacing={2}
            alignItems="center"
            style={{ marginBottom: "1rem" }}
          >
            <Grid item>
              <Typography>Priority:</Typography>
            </Grid>
            <Grid item>
              <ToggleButtonGroup
                value={priority}
                exclusive
                onChange={(e, newPriority) => setPriority(newPriority)}
              >
                <ToggleButton value={3}>
                  <Typography>Low</Typography>
                </ToggleButton>
                <ToggleButton value={2}>
                  <Typography>Medium</Typography>
                </ToggleButton>
                <ToggleButton value={1}>
                  <Typography>High</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
          <Typography variant="subtitle1" style={{ marginBottom: "0.5rem" }}>
            ICON AND COLOR
          </Typography>
          <Grid container alignItems="center" style={{ marginBottom: "1rem" }}>
            <Grid item>
              <FontAwesomeIcon
                style={{ width: "30px", height: "30px" }}
                icon={ficons[icon]}
              />
            </Grid>
            <Grid item>
              <IconPicker
                icons={icons}
                icon={icon}
                onSelectIcon={setIcon}
                onSelectIconId={setIconId}
              />
            </Grid>
            <Grid item>
              <CustomColorPicker color={color} onChange={setColor} />
            </Grid>
          </Grid>
          <Typography variant="subtitle1" style={{ marginBottom: "0.5rem" }}>
            DEADLINE
          </Typography>
          <Grid container spacing={2} style={{ marginBottom: "1rem" }}>
            <Grid item xs={6}>
              <DatePicker
                label="Date"
                value={deadline}
                onChange={(newDate) => setDeadline(newDate)}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="Time"
                value={deadline}
                onChange={(newTime) => setDeadline(newTime)}
              />
            </Grid>
          </Grid>
          <Typography variant="subtitle1" style={{ marginBottom: "0.5rem" }}>
            TASK LIST
          </Typography>
          <Grid container spacing={2} style={{ marginBottom: "1rem" }}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                label="Add list item"
                variant="outlined"
                value={newListItem}
                onChange={(e) => setNewListItem(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddListItem}
                fullWidth
              >
                Add
              </Button>
            </Grid>
          </Grid>
          <Box style={{ marginBottom: "1rem" }}>
            {taskList.map((item, index) => (
              <Chip
                key={index}
                label={item}
                onDelete={() => handleDeleteListItem(index)}
                style={{ margin: "0.25rem" }}
              />
            ))}
          </Box>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            {isEdit ? "Update Task" : "Create Task"}
          </Button>
        </form>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default TaskForm;
