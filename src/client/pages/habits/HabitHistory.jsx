import React, { useEffect, useState } from 'react';
import { Typography, Avatar, Grid, Card, CardContent, CardHeader, Paper, Button, Collapse, List, ListItem,Box} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons'; // นำเข้าไอคอนทั้งหมดใน object ficons

const HabitHistory = () => {
  const [habits, setHabits] = useState({});
  const [openHistory, setOpenHistory] = useState({}); // เก็บสถานะของการเปิด/ปิดแต่ละกิจกรรม

  useEffect(() => {
    axios.get(`${HostName}/api/HabitHistory`,{withCredentials:true})
      .then(response => {
        setHabits(response.data);
      })
      .catch(error => {
        console.error('Error fetching habits:', error);
      });
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd HH:mm');
  };

  // ฟังก์ชันเลือกไอคอนจาก nameTouse โดยดูจาก ficons
  const getIcon = (iconName) => {
    return ficons[iconName] || ficons.faQuestion; // หากไม่พบไอคอน จะแสดงเป็น faQuestion
  };

  // ฟังก์ชันเปิด/ปิดการแสดงประวัติ complete_at
  const toggleHistory = (habitId) => {
    setOpenHistory(prev => ({
      ...prev,
      [habitId]: !prev[habitId] // สลับสถานะเปิด/ปิด
    }));
  };

  return (
    <Box sx={{ padding: 2 ,border:'none'}}>
      <Typography variant="h6" sx={{ marginBottom: 2 }} color='#2196f3'>History</Typography>
      <Grid container spacing={3}>
        {Object.values(habits).map((habit) => (
          <Grid item xs={12} md={6} lg={4} key={habit.id}>
            <Card sx={{ height: '100%', border: `2px solid ${habit.color}` }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: habit.color, width: '3rem', height: '3rem' }}>
                    <FontAwesomeIcon icon={getIcon(habit.nameTouse)} /> {/* ดึงไอคอนตาม nameTouse */}
                  </Avatar>
                }
                title={habit.name}
                subheader={`ช่วงเวลา: ${habit.time_of_day || 'ไม่ระบุ'}`}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  วันที่ทำกิจกรรม: {formatDate(habit.complete_at[0])} {/* แสดง complete_at ล่าสุด */}
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => toggleHistory(habit.id)} 
                  sx={{ marginTop: 1 }}
                >
                  {openHistory[habit.id] ? 'ซ่อนประวัติ' : 'ดูประวัติ'}
                </Button>
                <Collapse in={openHistory[habit.id]} timeout="auto" unmountOnExit>
                  <List>
                    {habit.complete_at.map((date, index) => (
                      <ListItem key={index}>
                        {formatDate(date)} {/* แสดง complete_at ที่ทำสำเร็จ */}
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HabitHistory;
