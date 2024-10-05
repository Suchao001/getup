import React from "react";
import { Box, Typography, Tooltip, Grid } from "@mui/material";
import { format, isSameDay } from "date-fns";

const DayGrid = ({ createdAt, completeAt }) => {
  const startDate = new Date(createdAt);
  const endDate = new Date();
  const days = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  // Calculate the maximum steak
  let maxSteak = 0;
  let currentSteak = 0;
  days.forEach((day) => {
    if (
      completeAt.some((completedDate) =>
        isSameDay(new Date(completedDate), day)
      )
    ) {
      currentSteak++;
      if (currentSteak > maxSteak) {
        maxSteak = currentSteak;
      }
    } else {
      currentSteak = 0;
    }
  });

  // Limit the number of days to 30
  const limitedDays = days.slice(-30);

  return (
    <>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}
      >
        {limitedDays.map((day, index) => {
          const isCompleted = completeAt.some((completedDate) =>
            isSameDay(new Date(completedDate), day)
          );

          return (
            <Tooltip key={index} title={format(day, "Pp")}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isCompleted ? "#6dfb72" : "#e0e0e0",
                  borderRadius: "4px",
                }}
              >
                <Typography variant="body2">{format(day, "d")}</Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      <Box>
        <Typography
          variant="body1"
          sx={{ marginTop: 2, fontWeight: "bold", color: "primary.main" }}
        >
          Steak: {maxSteak} days
        </Typography>
      </Box>
    </>
  );
};

export default DayGrid;
