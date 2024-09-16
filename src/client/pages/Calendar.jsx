import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import CheckLogin from '../components/auth/CheckLogin';
import Calendar from '../components/common/Calendar';
import { Container } from '@mui/material';
import PlanPopover from '../components/plan/PlanPopover';
import PlanDrawer from '../components/plan/PlanDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import {faStar} from '@fortawesome/free-regular-svg-icons';
import processPlans from '../components/plan/processPlans';
import renderEventContent from '../components/plan/EventContent';
import { Button } from '@mui/material';
import AddPlanButton from '../components/plan/AddPlanButton';




const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [plansForDate, setPlansForDate] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [plansForDate]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/plans');
      const { monthViewEvents, timeGridEvents } = processPlans(response.data); 
      setEvents([...monthViewEvents, ...timeGridEvents]);
      
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };


  const fetchPlansByDate = async (date) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/plans/date/${date}`);
      setPlansForDate(response.data);
    
    } catch (error) {
      console.error('Error fetching plans by date:', error);
    }
  };

  const handleDateClick = async (arg) => {
    const dateStr = arg.dateStr;
    const plansOnDate = events.filter(event => 
      moment(dateStr).isBetween(moment(event.start), moment(event.end), null, '[]')
    );
  
    setSelectedDate(dateStr);
    setAnchorEl(arg.dayEl);
  
    if (plansOnDate.length > 0) {
      await fetchPlansByDate(dateStr);
      setDrawerOpen(true);
    } else {
      setIsEdit(false); 
      setSelectedPlan(null);
      setPopupOpen(true);
    }
  };
  
  const handleEventClick = async (eventInfo) => {
    const planId = eventInfo.event.groupId.split('-')[1];
    const selected = plansForDate.find(plan => plan.id === parseInt(planId));
    if (selected) {
      setIsEdit(true); 
      setSelectedPlan(selected); 
      setPopupOpen(true); 
    }
   
  };

  const handlePopupOpen = () => {
    setIsEdit(false); 
    setSelectedPlan(null); 
    setPopupOpen(true); 
  }
  const handlePopupClose = () => {
    setPopupOpen(false);
  }


  function PriorityDescription() {
    return (
     
          <div style={{backgroundColor: '#ff961b',marginBottom: '0.2rem', paddingBottom: '5px',paddingRight: '5px', borderRadius: '5px'}}>
        <FontAwesomeIcon 
              icon={ficons['faStar']} 
              style={{ marginLeft: '5px', color: 'white', fontSize: '0.7rem' }} 
            />
            <span style={{  color: 'white', fontSize: '0.7rem' }}>1st priority</span>
        <FontAwesomeIcon 
              icon={faStar} 
              style={{ marginLeft: '5px', color: 'white', fontSize: '0.7rem' }} 
            />
            <span style={{  color: 'white', fontSize: '0.7rem' }}>2nd priority</span>
            </div>
           
   
    )
  }


  return (
    <Container style={{ width: '90%', margin: 'auto' }}>
    <CheckLogin />
    <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '0.2rem 0rem'}} className='font1'>
    <PriorityDescription />
    <Button variant="contained" sx={{backgroundColor: '#ff961b', '&:hover': {backgroundColor: '#ff6e66'}}} color="primary" style={{marginLeft: '0.5rem'}} onClick={handlePopupOpen}>
              Add Plan
    </Button>
    </div>
    <Calendar  events={events} handleDateClick={handleDateClick} renderEventContent={renderEventContent} handleEventClick={handleEventClick} />
    <PlanPopover popupOpen={popupOpen} anchorEl={anchorEl} handlePopupClose={handlePopupClose} selectedDate={selectedDate} fetchEvents={fetchEvents} isEdit={isEdit} selectedPlan={selectedPlan} />
    <PlanDrawer setPopupOpen={setPopupOpen} open={drawerOpen} onClose={() => setDrawerOpen(false)} plans={plansForDate} selectedDate={selectedDate} setIsEdit={setIsEdit} setSelectedPlan={setSelectedPlan}  onAddPlan={() => {
      setIsEdit(false); 
      setSelectedPlan(null); 
      setPopupOpen(true); 
    }} />
    <AddPlanButton />
  </Container>

  );
};

export default CalendarPage;
