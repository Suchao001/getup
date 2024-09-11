import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import './TaskCard.css';
import axios from 'axios';
import { HostName } from '../../script/HostName';

const TaskCard = ({ task, handleOpenDetail }) => {
  const { id, name, nameTouse: iconTouse, color, deadline, is_complete } = task;
  const deadlineDate = new Date(deadline).toLocaleDateString();
  const [isCompleted, setIsCompleted] = useState(is_complete);
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
    console.log(task);
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

  return (
    <div 
      className={`task-card ${isCompleted ? 'completed' : ''} font1`} 
      style={{ backgroundColor: color }}
      ref={cardRef}
    >
      <div className="task-content" onClick={handleOpenDetail}>
        <div className="task-badges">
          <span className="badge">
            <FontAwesomeIcon icon={ficons.faClock} />
            {deadlineDate}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="task-icon">
            {renderIcon()}
          </div>
          <div className="task-name mt-3">
            {name}
          </div>
        </div>
      </div>

      <div className="slider-container">
        <div className="slider" ref={sliderRef}>
          <div className="slider-handle"></div>
        </div>
        <div className="completion-indicator">
          {isCompleted ? 'Completed' : 'Slide to complete'}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;