import { useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from '../script/HostName';

const useFetchHabits = ({selectedDate,setSelectedDate}) => {
  const [habitData, setHabitData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const url = `${HostName}/api/habits/${selectedDate}`;
      const response = await axios.get(url, { withCredentials: true });
      setHabitData(response.data);
  
      setError(null);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setError('Failed to load habits. Please try again later.');
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

  return { habitData, error, isLoading, selectedDate, setSelectedDate, refetchHabits };
};

export default useFetchHabits;
