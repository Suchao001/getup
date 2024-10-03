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
    if (habitData.length > 0) {
      setIsLoading(false);
    }
  }, [habitData]);

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

  if (habitData.length === 0) {
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
        {morningHabit.length > 0 && (
          <>
            {morningHabit.length < 4 ? (
              <Grid key="allInclusive">
                <WbSunny />
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key="allInclusive"
                style={{ display: "flex", alignItems: "center" }}
              >
                <WbSunny />{" "}
                <span className="font1" style={{ marginLeft: "0.5rem" }}>
                  Morning
                </span>
              </Grid>
            )}
            {morningHabit.map((habit) => (
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
            ))}
            <Box sx={{ width: "100%", marginBottom: "20px" }} />
          </>
        )}

        {afternoonHabit.length > 0 && (
          <>
            {afternoonHabit.length < 4 ? (
              <Grid key="allInclusive">
                <Brightness7 />
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key="allInclusive"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Brightness7 />{" "}
                <span className="font1" style={{ marginLeft: "0.5rem" }}>
                  Afternoon
                </span>
              </Grid>
            )}
            {afternoonHabit.map((habit) => (
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
            ))}
            <Box sx={{ width: "100%", marginBottom: "20px" }} />
          </>
        )}

        {eveningHabit.length > 0 && (
          <>
            {eveningHabit.length < 4 ? (
              <Grid key="allInclusive">
                <WbTwilight />
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key="allInclusive"
                style={{ display: "flex", alignItems: "center" }}
              >
                <WbTwilight />{" "}
                <span className="font1" style={{ marginLeft: "0.5rem" }}>
                  Evening
                </span>
              </Grid>
            )}
            {eveningHabit.map((habit) => (
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
            ))}
            <Box sx={{ width: "100%", marginBottom: "20px" }} />
          </>
        )}

        {anytimeHabit.length > 0 && (
          <>
            {anytimeHabit.length < 4 ? (
              <Grid key="allInclusive">
                <AllInclusive />
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key="allInclusive"
                style={{ display: "flex", alignItems: "center" }}
              >
                <AllInclusive />{" "}
                <span className="font1" style={{ marginLeft: "0.5rem" }}>
                  {allDay ? "Every Time Habits" : "Anytime"}
                </span>
              </Grid>
            )}
            {anytimeHabit.map((habit) => (
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
            ))}
          </>
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
