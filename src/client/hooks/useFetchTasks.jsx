import { useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from '../script/HostName';

const useFetchTasks = () => {
  const [taskData, setTaskData] = useState([]);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${HostName}/api/tasks`, { withCredentials: true });
      setTaskData(response.data);
 
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    }
  };
  
  useEffect(() => {
      
      fetchTasks();
    
  }, []);


  return { taskData,fetchTasks, error };
};

export default useFetchTasks;
