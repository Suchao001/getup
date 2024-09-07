import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import CheckLogin from '../components/auth/CheckLogin';
import Calendar from '../components/common/Calendar';
import PlanPopover from '../components/plan/PlanpopOver';
import PlanDrawer from '../components/plan/PlanDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import {faStar} from '@fortawesome/free-regular-svg-icons';
import processPlans from '../components/plan/processPlans';
import renderEventContent from '../components/plan/EventContent';

const Plan = () => {
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
      console.log(plansOnDate);
      await fetchPlansByDate(dateStr);
      setDrawerOpen(true);
    } else {
      console.log('no plans on this date');
      setIsEdit(false); 
      setSelectedPlan(null);
      setPopupOpen(true);
    }
  };
  
  const handleEventClick = async (eventInfo) => {
    const planId = eventInfo.event.groupId.split('-')[1];
    const selected = plansForDate.find(plan => plan.id === parseInt(planId));
    if (selected) {
      setIsEdit(true); // Edit mode
      setSelectedPlan(selected); // Set the selected plan for editing
      setPopupOpen(true); // Open popup
    }
  };
  

  const handlePopupClose = () => setPopupOpen(false);


 


  return (
    <div className="container-md mt-2" style={{ width: '90%', margin: 'auto' }}>
    <CheckLogin />
      <div className="container d-flex justify-content-end align-items-center" >
        <div style={{backgroundColor: '#ff961b', paddingBottom: '5px',paddingRight: '5px', borderRadius: '5px'}}>
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
        </div>

    <Calendar events={events} handleDateClick={handleDateClick} renderEventContent={renderEventContent} handleEventClick={handleEventClick} />
    <PlanPopover popupOpen={popupOpen} anchorEl={anchorEl} handlePopupClose={handlePopupClose} selectedDate={selectedDate} fetchEvents={fetchEvents} isEdit={isEdit} selectedPlan={selectedPlan} />
    <PlanDrawer setPopupOpen={setPopupOpen} open={drawerOpen} onClose={() => setDrawerOpen(false)} plans={plansForDate} selectedDate={selectedDate} setIsEdit={setIsEdit} setSelectedPlan={setSelectedPlan}  onAddPlan={() => {
      setIsEdit(false); 
      setSelectedPlan(null); 
      setPopupOpen(true); 
    }} />
  </div>
  );
};

export default Plan;
