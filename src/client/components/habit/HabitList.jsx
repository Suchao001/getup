import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import HabitModal from "./HabitModal";
import HabitCard from "./HabitCard";
import {
  WbSunny,
  Brightness7,
  WbTwilight,
  AllInclusive,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const HabitList = ({
  allDay,
  habitData,
  error: habitError,
  updateHabit,
  isToday,
  refetchHabits,
}) => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const morningHabit = [];
  const afternoonHabit = [];
  const eveningHabit = [];
  const anytimeHabit = [];

  useEffect(() => {
    if (Array.isArray(habitData) && habitData.length > 0) {
      setIsLoading(false);
    }
  }, [habitData]);

  if (Array.isArray(habitData)) {
    habitData.forEach((habit) => {
      if (allDay) {
        anytimeHabit.push(habit);
      } else {
        if (habit.time_of_day.toLowerCase() === "morning") {
          morningHabit.push(habit);
        } else if (habit.time_of_day.toLowerCase() === "afternoon") {
          afternoonHabit.push(habit);
        } else if (habit.time_of_day.toLowerCase() === "evening") {
          eveningHabit.push(habit);
        } else {
          anytimeHabit.push(habit);
        }
      }
    });
  }

  const handleOpenHabitModal = (habit) => () => {
    setSelectedHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleCloseHabitModal = () => {
    setSelectedHabit(null);
    setIsHabitModalOpen(false);
  };

  const handleToggleComplete = (id) => {
    updateHabit(id);
  };

  if (habitError) {
    return <Typography variant="h6">Error: {habitError}</Typography>;
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!Array.isArray(habitData) || habitData.length === 0) {
    return <Typography variant="h6">No habits found.</Typography>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const renderHabitSection = (habits, icon, title) => {
    if (habits.length === 0) return null;

    return (
      <>
        {habits.length < 4 ? (
          <Grid key={title.toLowerCase()}>{icon}</Grid>
        ) : (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            key={title.toLowerCase()}
            style={{ display: "flex", alignItems: "center" }}
          >
            {icon}{" "}
            <span className="font1" style={{ marginLeft: "0.5rem" }}>
              {title}
            </span>
          </Grid>
        )}
        {Array.isArray(habits) && habits.length > 0 ? (
          habits.map((habit) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={habit.id}>
              <motion.div variants={itemVariants}>
                <HabitCard
                  habit={habit}
                  handleOpenDetail={handleOpenHabitModal(habit)}
                  onToggleComplete={handleToggleComplete}
                  isToday={isToday}
                />
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">
              No habits found for this time of day.
            </Typography>
          </Grid>
        )}
        <Box sx={{ width: "100%", marginBottom: "20px" }} />
      </>
    );
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "1rem",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {renderHabitSection(morningHabit, <WbSunny />, "Morning")}
        {renderHabitSection(afternoonHabit, <Brightness7 />, "Afternoon")}
        {renderHabitSection(eveningHabit, <WbTwilight />, "Evening")}
        {renderHabitSection(
          anytimeHabit,
          <AllInclusive />,
          allDay ? "Every Time Habits" : "Anytime"
        )}
      </Grid>

      {selectedHabit && (
        <HabitModal
          open={isHabitModalOpen}
          onClose={handleCloseHabitModal}
          habit={selectedHabit}
          title={selectedHabit.name}
          details={selectedHabit.details}
          frequency={selectedHabit.frequency}
          dates={selectedHabit.dates}
          days={selectedHabit.days}
          refetchHabits={refetchHabits}
        />
      )}
    </motion.div>
  );
};

export default HabitList;
