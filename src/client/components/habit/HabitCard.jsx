import React from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import './HabitCard.css';

const HabitCard = ({ habit, handleOpenDetail }) => {
  const { name, nameTouse: iconTouse, color, details } = habit;

  const renderIcon = () => {
    if (iconTouse && ficons[iconTouse]) {
      return (
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
          <FontAwesomeIcon icon={ficons[iconTouse]} />
        </Avatar>
      );
    }
    return <Avatar sx={{ bgcolor: color, width: 40, height: 40 }} />;
  };

  return (
    <Tooltip title={details || "No details available"} arrow>
      <Card className="habit-card mb-3" onDoubleClick={handleOpenDetail}>
        <CardContent sx={{ padding: '20px' }}>
          <Grid container alignItems="center">
            <Grid item xs={9} display="flex" alignItems="center">
              {renderIcon()}
              <Typography variant="h6" component="div" sx={{ marginLeft: '10px' }}>
                {name}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Tooltip>
  );
};

export default HabitCard;
