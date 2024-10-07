import React, { useState } from "react";
import Habit from "../components/habit/Habit";
import Task from "../components/task/Task";
import { Container, Alert } from "@mui/material";
import PlanCard from "../components/plan/PlanCard";
import BottomTabNavigation from "../components/common/Buttonnavigate";
import HabitList from "../components/habit/HabitList";
import TaskList from "../components/task/TaskList";
import CheckLogin from "../components/auth/CheckLogin";
import dayjs from "dayjs";
import AddPlanButton from "../components/plan/AddPlanButton";
import CustomDateBar from "../components/common/CustomDateBar";
import Divider from "@mui/material/Divider";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Accessibility from "@mui/icons-material/Accessibility";
import HabitRecommend from "../components/habit/HabitRecommend";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import useFetchHabits from "../hooks/useFetchHabits";
import useFetchTasks from "../hooks/useFetchTasks";

function Home() {
  const [currentTab, setCurrentTab] = useState("habit");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [everyDay, setEveryDay] = useState(false);
  const [isToday, setIsToday] = useState(true);
  const [allDay, setAllDay] = useState(false);

  const {
    habitData,
    error: habitError,
    updateHabit,
    refetchHabits,
  } = useFetchHabits({
    selectedDate: everyDay ? null : selectedDate.format("YYYY-MM-DD"),
    setSelectedDate,
  });
  const { taskData, fetchTasks, error: taskError } = useFetchTasks();
  const handleTab = (tab) => {
    setCurrentTab(tab);
    const targetElement = document.getElementById(tab);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAllDayChange = (event) => {
    setAllDay(event.target.checked);
  };

  return (
    <>
      <CheckLogin />
      <Container>
        <BottomTabNavigation handleTabClick={handleTab} />
        {currentTab === "habit" && (
          <div id="habit my-4">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "-1rem",
              }}
            >
              <h1 className="font2 my-4">
                Habits{" "}
                <Accessibility
                  sx={{
                    verticalAlign: "middle",
                    marginLeft: "8px",
                    fontSize: "2rem",
                  }}
                />
              </h1>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <HabitRecommend />
                <Tooltip title="sort by time">
                  <Switch
                    checked={allDay}
                    onChange={handleAllDayChange}
                    color="primary"
                    inputProps={{ "aria-label": "all day" }}
                  />
                </Tooltip>
              </div>
            </div>
            <Divider sx={{ my: 2 }} />

            <CustomDateBar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              everyDay={everyDay}
              setEveryDay={setEveryDay}
              setIsToday={setIsToday}
            />
            <Habit buttonstyle="float" refetchHabits={refetchHabits} />

            {habitError && (
              <Alert severity="error" sx={{ my: 2 }}>
                {habitError}
              </Alert>
            )}
            <HabitList
              allDay={allDay}
              isToday={isToday}
              refetchHabits={refetchHabits}
              habitData={habitData}
              updateHabit={updateHabit}
            />
          </div>
        )}

        {currentTab === "task" && (
          <div id="task">
            <h1 className="font2 my-4">
              Tasks{" "}
              <TaskAltIcon
                sx={{ verticalAlign: "middle", marginLeft: "8px" }}
              />
            </h1>
            <Divider sx={{ my: 2 }} />
            <Task taskData={taskData} fetchTasks={fetchTasks} />
            {taskError && (
              <Alert severity="error" sx={{ my: 2 }}>
                {taskError}
              </Alert>
            )}
            <TaskList taskData={taskData} fetchTasks={fetchTasks} />
          </div>
        )}

        {currentTab === "plan" && (
          <div id="plan">
            <h1 className="font2 my-4">
              Plans{" "}
              <CalendarMonthIcon
                sx={{ verticalAlign: "middle", marginLeft: "8px" }}
              />
            </h1>
            <Divider sx={{ my: 2 }} />
            <CustomDateBar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              everyDay={everyDay}
              setEveryDay={setEveryDay}
              setIsToday={setIsToday}
            />

            <AddPlanButton />
            <PlanCard
              selectedDate={everyDay ? null : selectedDate.format("YYYY-MM-DD")}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            ></div>
          </div>
        )}
      </Container>
    </>
  );
}

export default Home;
