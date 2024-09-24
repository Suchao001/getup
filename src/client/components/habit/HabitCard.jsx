import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import './HabitCard.css';
import axios from 'axios';
import { HostName } from '../../script/HostName';

const HabitCard = ({ habit, handleOpenDetail, onToggleComplete, isToday }) => {
    const { id, name, nameTouse: iconToUse = "faUser", color, details,time_of_day } = habit || {};
    const [completed, setCompleted] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const checkCompleted = async () => {
        const response = await axios.get(`${HostName}/api/habits/check-completed/${id}`);
        setCompleted(response.data.completed);
    }
    useEffect(() => {
      checkCompleted();
      console.log(isToday);
    }, []);

    const renderIcon = () => {
      if (iconToUse && ficons[iconToUse]) {
        return <FontAwesomeIcon icon={ficons[iconToUse]} className="text-3xl" />;
      }
      return <FontAwesomeIcon icon={ficons["faUser"]} className="text-3xl" />;
    };

    const handleToggleComplete = (e) => {
      e.stopPropagation();
      if (isToday) {
        const newCompletedState = !completed;
        setCompleted(newCompletedState);
        onToggleComplete(id, newCompletedState);
      }
    };

    return (
      <div
        className={`habit-card font1 ${completed ? 'completed' : ''} ${isActive ? 'active' : ''}`}
        style={{ backgroundColor: color }}
        onClick={handleOpenDetail}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onMouseLeave={() => setIsActive(false)}
        onTouchStart={() => setIsActive(true)}
        onTouchEnd={() => setIsActive(false)}
        title={details || "No details available"}
      >
        <div className="card-content">
          <div className="icon-container">
            {renderIcon()}
          </div>
          <h3 className="habit-name" style={{ color: 'white' }}>{name}</h3>
   
        </div>
        {isToday && (
          <div 
            className="complete-checkbox"
            onClick={handleToggleComplete}
          >
            <FontAwesomeIcon icon={completed ? ficons.faCheckCircle : ficons.faCircle} />
          </div>
        )}
        <div className="animated-bar" />
      </div>
    );
  };

export default HabitCard;
