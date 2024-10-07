import React, { useState, useEffect } from "react";
import { Typography, Paper, Box, Button, Pagination } from "@mui/material";
import useFetchHabits from "../../hooks/useFetchHabits";
import HabitForm from "../../components/habit/HabitForm";
import CustomModal from "../../components/common/CustomModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { HostName } from "../../script/HostName";
import { deleteConfirm, goodAlert } from "../../script/sweet";
import TotalPointsProgress from "../../components/common/TotalPointsProgress";

function HabitManagement({ userProfile, itemsPerPage }) {
  const { habitData, refetchHabits } = useFetchHabits({});
  const [habits, setHabits] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitPage, setHabitPage] = useState(1);

  useEffect(() => {
    if (habitData) {
      setHabits(habitData);
    }
  }, [habitData]);

  const handleDeleteHabit = async (habit) => {
    const isConfirmed = await deleteConfirm(
      "Delete Habit",
      "Are you sure you want to delete this habit?"
    );
    if (!isConfirmed) return;
    try {
      await axios.delete(`${HostName}/api/habits/delete/${habit.id}`, {
        withCredentials: true,
      });
      goodAlert("Habit deleted successfully");
      refetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const renderHabits = () => {
    const startIndex = (habitPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedHabits = habits.slice(startIndex, endIndex);

    return paginatedHabits.map((habit) => (
      <Box key={habit.id} mb={2} display="flex" alignItems="center">
        <FontAwesomeIcon
          icon={ficons[habit.nameTouse] || ficons.faUser}
          style={{
            fontSize: "1.5rem",
            marginRight: "10px",
            color: habit.color,
          }}
        />
        <Typography variant="body1">{habit.name}</Typography>
        <Box ml="auto">
          <Button onClick={() => setEditingHabit(habit)}>Edit</Button>
          <Button onClick={() => handleDeleteHabit(habit)}>Delete</Button>
        </Box>
      </Box>
    ));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom color="#2196f3">
        Habits
      </Typography>

      <TotalPointsProgress habits={habits} userProfile={userProfile} />

      <Paper
        sx={{
          padding: "16px",
          marginBottom: "16px",
          borderRadius: 3,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {renderHabits()}
        <Pagination
          count={Math.ceil(habits.length / itemsPerPage)}
          page={habitPage}
          onChange={(event, value) => setHabitPage(value)}
        />
      </Paper>
      <CustomModal
        open={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        title="Edit Habit"
      >
        {editingHabit && (
          <HabitForm
            habit={editingHabit}
            isEdit={true}
            refetchHabits={refetchHabits}
            open={true}
          />
        )}
      </CustomModal>
    </>
  );
}

export default HabitManagement;
