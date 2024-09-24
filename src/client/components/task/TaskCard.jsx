import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Collapse, List, ListItem, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import './TaskCard.css';
import axios from 'axios';
import { HostName } from '../../script/HostName';

const TaskCard = ({ task, handleOpenDetail, isLate  }) => {
  const { id, name, nameTouse: iconTouse, color, deadline, is_complete, task_list } = task;
  const deadlineDate = new Date(deadline).toLocaleDateString();
  const [isCompleted, setIsCompleted] = useState(is_complete);
  const [showTaskList, setShowTaskList] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0); // New state for slider position
  const sliderRef = useRef(null);
  const cardRef = useRef(null);

  const updateTask = async (taskId) => {
    try {
      const response = await axios.put(`${HostName}/api/tasks/${taskId}`);
      if (response.status === 200) {
        setIsCompleted(response.data.is_complete);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  useEffect(() => {
    let isDragging = false;
    let startX, startLeft;

    setIsCompleted(is_complete);
    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX - sliderRef.current.offsetLeft;
      startLeft = sliderRef.current.offsetLeft;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX - startX;
      const maxX = cardRef.current.offsetWidth - sliderRef.current.offsetWidth;
      const newLeft = Math.max(0, Math.min(x, maxX));
      sliderRef.current.style.left = `${newLeft}px`;
      setSliderPosition(newLeft); // Update slider position
    };

    const onMouseUp = () => {
      isDragging = false;
      const threshold = cardRef.current.offsetWidth * 0.4;
      if (sliderRef.current.offsetLeft > threshold) {
        updateTask(id);
      } else {
        setIsCompleted(false);
      }
      sliderRef.current.style.left = '0px';
      setSliderPosition(0); // Reset slider position
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    sliderRef.current.addEventListener('mousedown', onMouseDown);

    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener('mousedown', onMouseDown);
      }
    };
  }, [id]);

  const renderIcon = () => {
    if (iconTouse && ficons[iconTouse]) {
      return (
        <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', width: 40, height: 40 }}>
          <FontAwesomeIcon icon={ficons[iconTouse]} color={color} />
        </Avatar>
      );
    }
    return <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', width: 40, height: 40 }} />;
  };

  const toggleTaskList = (e) => {
    e.stopPropagation();
    setShowTaskList(!showTaskList);
  };

  return (
    <div 
      className={`task-card ${isCompleted ? 'completed' : ''} font1`} 
      style={{ backgroundColor: color }}
      ref={cardRef}
    >
      <div className="task-content" onClick={handleOpenDetail}>
        {deadline !== null && (
          <div className={`task-badges ${isLate ? 'late' : ''}`}>
            <span className="badge">
              <FontAwesomeIcon icon={ficons.faClock} />
              {deadlineDate}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="task-icon">
            {renderIcon()}
          </div>
          <div className="task-name mt-3" style={{ color: 'white' }}>
            {name}
          </div>
        </div>
      </div>

      <Collapse in={showTaskList}>
        <List>
          {task_list && task_list.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Collapse>

      <div className="slider-container" style={{ backgroundColor: sliderPosition > 0 ? '#58e600' : 'rgba(255, 255, 255, 0.2)' }}>
        <div className="slider" ref={sliderRef}>
          <div className="slider-handle"></div>
        </div>
        <div className="completion-indicator">
          {isCompleted ? 'Completed' : (sliderPosition === 0 ? 'Slide to complete' : '')}
        </div>
      </div>

      {task_list && task_list.length > 0 && (
        <div 
          className="task-list-dropdown" 
          onClick={toggleTaskList} 
          style={{ position: 'absolute', top: deadline === null ? '10px' : '40px', right: '10px' }}
        >
          <FontAwesomeIcon icon={showTaskList ? ficons.faChevronUp : ficons.faChevronDown} />
        </div>
      )}
    </div>
  );
};

export default TaskCard;