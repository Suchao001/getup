import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Box,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import ProfileForm from "./ProfileForm";
import useFetchUserProfile from "../../hooks/FetchUserProfile";
import { HostName } from "../../script/HostName";

function SettingProfile() {
  const { userProfile, avatarSrc, loading, error, refetchUserProfile } =
    useFetchUserProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [habitPointGoal, setHabitPointGoal] = useState({
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });
  const [habitsSettingView, setHabitsSettingView] = useState("weekly");

  useEffect(() => {
    if (userProfile && userProfile.habit_point_goal) {
      setHabitPointGoal(JSON.parse(userProfile.habit_point_goal));
    }
    if (userProfile && userProfile.habits_setting_view) {
      setHabitsSettingView(userProfile.habits_setting_view);
    }
  }, [userProfile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      setUploading(true);
      try {
        const response = await axios.post(
          `${HostName}/api/user/upload_img`,
          formData,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          console.log("Image uploaded successfully");
          refetchUserProfile(); // Refetch user profile to get updated image
          setPreview(response.data.imageUrl);
        } else {
          console.error("Image upload failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleHabitPointGoalChange = (period) => (event) => {
    setHabitPointGoal((prev) => ({
      ...prev,
      [period]: parseInt(event.target.value) || 0,
    }));
  };

  const handleHabitsSettingViewChange = (event) => {
    setHabitsSettingView(event.target.value);
  };

  const handleHabitSettingsSubmit = async () => {
    try {
      const response = await axios.put(
        `${HostName}/api/user/update_profile`,
        {
          habit_point_goal: JSON.stringify(habitPointGoal),
          habits_setting_view: habitsSettingView,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Habit settings updated successfully");
        console.log(response.data);

        console.log(JSON.stringify(habitPointGoal));
        console.log(habitsSettingView);
        refetchUserProfile();
      }
    } catch (error) {
      console.error("Error updating habit settings:", error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h4" gutterBottom>
        Public profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ProfileForm
            userProfile={userProfile}
            refetchUserProfile={refetchUserProfile}
          />
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Habit Settings
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor="weekly-goal">Weekly Goal</InputLabel>
              <Input
                id="weekly-goal"
                value={habitPointGoal.weekly}
                onChange={handleHabitPointGoalChange("weekly")}
                endAdornment={
                  <InputAdornment position="end">points</InputAdornment>
                }
                type="number"
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor="monthly-goal">Monthly Goal</InputLabel>
              <Input
                id="monthly-goal"
                value={habitPointGoal.monthly}
                onChange={handleHabitPointGoalChange("monthly")}
                endAdornment={
                  <InputAdornment position="end">points</InputAdornment>
                }
                type="number"
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor="yearly-goal">Yearly Goal</InputLabel>
              <Input
                id="yearly-goal"
                value={habitPointGoal.yearly}
                onChange={handleHabitPointGoalChange("yearly")}
                endAdornment={
                  <InputAdornment position="end">points</InputAdornment>
                }
                type="number"
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="habits-setting-view-label">
                Habits Setting View
              </InputLabel>
              <Select
                labelId="habits-setting-view-label"
                id="habits-setting-view"
                value={habitsSettingView}
                label="Habits Setting View"
                onChange={handleHabitsSettingViewChange}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleHabitSettingsSubmit}
            >
              Save Habit Settings
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Box
              sx={{
                position: "relative",
                width: 200,
                height: 200,
                margin: "auto",
              }}
            >
              {imageLoading && (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-20px",
                    marginLeft: "-20px",
                  }}
                />
              )}
              <Avatar
                src={preview || avatarSrc}
                sx={{
                  width: 200,
                  height: 200,
                  display: imageLoading ? "none" : "block",
                }}
                onLoad={handleImageLoad}
              />
            </Box>
            <Button variant="text" component="label" sx={{ mt: 2 }}>
              {uploading ? "Uploading..." : "Change Avatar"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSubmit}
              disabled={uploading}
            >
              Save Avatar
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SettingProfile;
