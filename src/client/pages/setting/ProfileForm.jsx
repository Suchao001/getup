import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Grid, Box, Chip } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from "axios";
import { HostName } from "../../script/HostName";
import { goodAlert, badAlert } from "../../script/sweet";

function ProfileForm({ userProfile, refetchUserProfile }) {
  const [formData, setFormData] = useState({
    username: "",
    birthdate: null,
    estimated_death_date: null,
    motto: "",
    goals: [],
  });
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || "",
        birthdate: userProfile.birthdate || null,
        estimated_death_date: userProfile.estimated_death_date || null,
        motto: userProfile.motto || "",
        goals: parseGoals(userProfile.goals),
      });
    }
  }, [userProfile]);

  const parseGoals = (goalsString) => {
    try {
      return JSON.parse(goalsString) || [];
    } catch (error) {
      console.error("Error parsing goals:", error);
      return [];
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date ? date.format("YYYY-MM-DD") : null,
    });
  };

  const handleAddGoal = () => {
    if (newGoal.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        goals: [...prevData.goals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const handleDeleteGoal = (goalToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      goals: prevData.goals.filter((goal) => goal !== goalToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSubmit = {
        ...formData,
        goals: JSON.stringify(formData.goals),
      };
      console.log(dataToSubmit);
      const response = await axios.put(
        `${HostName}/api/user/update_profile`,
        dataToSubmit,
        {
          withCredentials: true,
        }
      );
      if (response.data.ok) {
        console.log(response.data);
        goodAlert("Profile updated successfully");
        refetchUserProfile();
      } else {
        console.log(response.data);
        badAlert(response.data.message);
      }
    } catch (error) {
      badAlert(error.message);
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Birthdate"
              value={formData.birthdate ? dayjs(formData.birthdate) : null}
              onChange={(date) => handleDateChange(date, "birthdate")}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Estimated Death Date"
              value={
                formData.estimated_death_date
                  ? dayjs(formData.estimated_death_date)
                  : null
              }
              onChange={(date) =>
                handleDateChange(date, "estimated_death_date")
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Motto"
            name="motto"
            value={formData.motto}
            onChange={handleChange}
            placeholder="Live and let live"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Goals
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {formData.goals.map((goal, index) => (
              <Chip
                key={index}
                label={goal}
                onDelete={() => handleDeleteGoal(goal)}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", mt: 2 }}>
            <TextField
              fullWidth
              label="Add a new goal"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <Button onClick={handleAddGoal} sx={{ ml: 1 }}>
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
}

export default ProfileForm;
