import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import moment from "moment";
import CheckLogin from "../components/auth/CheckLogin";
import Calendar from "../components/common/Calendar";
import { Container, Box, Button, Typography, TextField } from "@mui/material";
import PlanPopover from "../components/plan/PlanPopover";
import PlanDrawer from "../components/plan/PlanDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import processPlans from "../components/plan/processPlans";
import renderEventContent from "../components/plan/EventContent";
import AddPlanButton from "../components/plan/AddPlanButton";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom"; // ใช้ useLocation แทน useParams
import { useSwitch } from "../context/SwitchContext.jsx";
import { HostName } from "../script/HostName";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [anchorEl, setAnchorEl] = useState(null);
  const [plansForDate, setPlansForDate] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const calendarRef = useRef(null);
  const location = useLocation(); // ใช้ useLocation เพื่อดึงข้อมูล query string
  const { switchPlans, toggleSwitch } = useSwitch();
  // ดึงค่าจาก query string
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const parsedDate = dayjs(dateParam);
      setSelectedDate(parsedDate);
      if (calendarRef.current) {
        calendarRef.current.getApi().gotoDate(parsedDate.toDate());
      }
    }
  }, [location]);

  useEffect(() => {
    fetchEvents();
  }, [switchPlans]);

  useEffect(() => {
    if (selectedDate && events.length > 0) {
      const plansOnDate = events.filter(
        (event) =>
          moment(selectedDate.format("YYYY-MM-DD")).isSameOrAfter(
            moment(event.start).startOf("day")
          ) &&
          moment(selectedDate.format("YYYY-MM-DD")).isSameOrBefore(
            moment(event.end).endOf("day")
          )
      );
      if (plansOnDate.length > 0) {
        fetchPlansByDate(selectedDate.format("YYYY-MM-DD"));
      }
      if (calendarRef.current) {
        calendarRef.current.getApi().gotoDate(selectedDate.toDate());
      }
    }
  }, [selectedDate, events]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(HostName + "/api/plans");
      const { monthViewEvents, timeGridEvents } = processPlans(response.data);
      setEvents([...monthViewEvents, ...timeGridEvents]);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchPlansByDate = async (date) => {
    try {
      const response = await axios.get(HostName + `/api/plans/date/${date}`);
      setPlansForDate(response.data);
    } catch (error) {
      console.error("Error fetching plans by date:", error);
    }
  };

  const handleDateClick = async (arg) => {
    const dateStr = arg.dateStr;
    const plansOnDate = events.filter(
      (event) =>
        moment(dateStr).isSameOrAfter(moment(event.start).startOf("day")) &&
        moment(dateStr).isSameOrBefore(moment(event.end).endOf("day"))
    );

    setSelectedDate(dayjs(dateStr));
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
    const planId = eventInfo.event.groupId.split("-")[1];
    const selected = plansForDate.find((plan) => plan.id === parseInt(planId));
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
  };
  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  function PriorityDescription() {
    return (
      <div
        style={{
          backgroundColor: "#ff961b",
          marginBottom: "0.2rem",
          paddingBottom: "5px",
          paddingRight: "5px",
          borderRadius: "5px",
        }}
      >
        <FontAwesomeIcon
          icon={ficons["faStar"]}
          style={{ marginLeft: "5px", color: "white", fontSize: "0.7rem" }}
        />
        <span style={{ color: "white", fontSize: "0.7rem" }}>1st priority</span>
        <FontAwesomeIcon
          icon={faStar}
          style={{ marginLeft: "5px", color: "white", fontSize: "0.7rem" }}
        />
        <span style={{ color: "white", fontSize: "0.7rem" }}>2nd priority</span>
      </div>
    );
  }

  return (
    <Container style={{ width: "90%", margin: "auto" }}>
      <CheckLogin />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0.2rem 0rem",
        }}
        className="font1"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select date"
            value={selectedDate}
            onChange={handleDateChange}
            slots={{
              textField: (params) => <TextField {...params} />,
            }}
          />
        </LocalizationProvider>
        <Box>
          <PriorityDescription />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ff961b",
              "&:hover": { backgroundColor: "#ff6e66" },
            }}
            color="primary"
            style={{ marginLeft: "0.5rem" }}
            onClick={handlePopupOpen}
          >
            Add Plan
          </Button>
        </Box>
      </Box>
      <Calendar
        ref={calendarRef}
        events={events}
        handleDateClick={handleDateClick}
        renderEventContent={renderEventContent}
        handleEventClick={handleEventClick}
      />
      <PlanPopover
        popupOpen={popupOpen}
        anchorEl={anchorEl}
        handlePopupClose={handlePopupClose}
        selectedDate={selectedDate.format("YYYY-MM-DD")}
        isEdit={isEdit}
        selectedPlan={selectedPlan}
      />
      <PlanDrawer
        setPopupOpen={setPopupOpen}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        plans={plansForDate}
        selectedDate={selectedDate.format("YYYY-MM-DD")}
        setIsEdit={setIsEdit}
        setSelectedPlan={setSelectedPlan}
        onAddPlan={() => {
          setIsEdit(false);
          setSelectedPlan(null);
          setPopupOpen(true);
        }}
      />
      <AddPlanButton />
    </Container>
  );
};

export default CalendarPage;
