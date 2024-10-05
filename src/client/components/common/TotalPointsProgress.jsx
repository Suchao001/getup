import React, { useState, useEffect } from "react";
import { Typography, Box, LinearProgress, Paper } from "@mui/material";
import axios from "axios";
import { HostName } from "../../script/HostName";
const TotalPointsProgress = ({ userProfile }) => {
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchTotalPoints = async () => {
      if (!userProfile?.habits_setting_view) return;

      try {
        const response = await axios.get(HostName + "/api/user/total_point", {
          params: { period: userProfile.habits_setting_view },
          withCredentials: true,
        });
        if (response.data.ok) {
          setTotalPoints(response.data.totalPoint);
        }
      } catch (error) {
        console.error("Error fetching total points:", error);
      }
    };

    fetchTotalPoints();
  }, [userProfile?.habits_setting_view]);

  const goalPoints = userProfile?.habit_point_goal
    ? JSON.parse(userProfile.habit_point_goal)[userProfile.habits_setting_view]
    : 0;
  const progressPercentage = (totalPoints / (goalPoints || 1)) * 100;

  return (
    <Paper sx={{ padding: "16px", marginBottom: "16px" }}>
      <Typography variant="h6" gutterBottom color="#2196f3">
        Total Points / {userProfile?.habits_setting_view}
      </Typography>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#00cc00",
              },
            }}
          />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="text.secondary">
            {totalPoints} / {goalPoints}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TotalPointsProgress;
