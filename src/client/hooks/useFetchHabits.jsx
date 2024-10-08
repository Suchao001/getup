import { useState, useEffect } from "react";
import axios from "axios";
import { HostName } from "../script/HostName";

const useFetchHabits = ({ selectedDate, setSelectedDate }) => {
  const [habitData, setHabitData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      let url;
      if (selectedDate) {
        url = `${HostName}/api/habits/${selectedDate}`;
      } else {
        url = `${HostName}/api/habits/`;
      }
      const response = await axios.get(url, { withCredentials: true });
      if (Array.isArray(response.data)) {
        setHabitData(response.data);
      } else {
        setHabitData([]);
        console.error("Received non-array data:", response.data);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError("Failed to load habits. Please try again later.");
      setHabitData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  const refetchHabits = () => {
    fetchHabits();
  };

  const updateHabit = async (id) => {
    try {
      const response = await axios.put(
        `${HostName}/api/habits/toggle-complete/${id}`,
        { withCredentials: true }
      );
      refetchHabits();
      return response.data;
    } catch (error) {
      console.error("Error updating habit:", error);
      throw error;
    }
  };
  return {
    habitData,
    error,
    isLoading,
    selectedDate,
    setSelectedDate,
    refetchHabits,
    updateHabit,
  };
};

export default useFetchHabits;
