import React, { useState, useEffect } from "react";
import { Typography, Button, Avatar, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { HostName } from "../../script/HostName";
import "./PlanCard.css";
import dayjs from "dayjs";
import PlanModal from "./PlanModal";
import { motion } from "framer-motion";
import { useSwitch } from "../../context/SwitchContext";

function PlanCard({ selectedDate }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();
  const { switchPlans } = useSwitch();

  const fetchPlans = async (date) => {
    setLoading(true);
    try {
      let response;
      if (date) {
        response = await axios.get(`${HostName}/api/plans/date/${date}`);
      } else {
        response = await axios.get(`${HostName}/api/plans`);
      }
      setPlans(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setPlans([]);
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(selectedDate);
  }, [selectedDate, update, switchPlans]);

  const renderIcon = (iconTouse, color = "gray") => {
    if (iconTouse && ficons[iconTouse]) {
      return (
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
          <FontAwesomeIcon icon={ficons[iconTouse]} />
        </Avatar>
      );
    }
    return <Avatar sx={{ bgcolor: color, width: 40, height: 40 }} />;
  };

  const handleOpenPlanModal = (plan) => {
    setSelectedPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setSelectedPlan(null);
    setIsPlanModalOpen(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {selectedDate
          ? `Plans for ${dayjs(selectedDate).format("MMMM D, YYYY")}`
          : "All Plans"}
      </Typography>
      {plans.length === 0 ? (
        <>
          <Typography>No plans for this date.</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <Button
              sx={{ fontSize: "1rem" }}
              onClick={() => navigate("/calendar")}
            >
              <CalendarMonthIcon
                sx={{ verticalAlign: "middle", marginLeft: "8px" }}
              />{" "}
              See Calendar
            </Button>
          </div>
        </>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Grid container spacing={2} className="card-container">
            {Array.isArray(plans) &&
              plans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                  <motion.div variants={itemVariants}>
                    <div
                      className={`plan-card ${
                        plan.is_complete ? "completed" : ""
                      } font1 gap`}
                      style={{ backgroundColor: plan.color }}
                      onClick={() => handleOpenPlanModal(plan)}
                    >
                      <div className="plan-content">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {renderIcon(plan.nameTouse, plan.color)}
                          <div className="plan-name" style={{ color: "white" }}>
                            {plan.name}
                          </div>
                        </div>
                        <div className="plan-date">
                          <CalendarMonthIcon />
                          {plan.start_date} - {plan.end_date}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
        </motion.div>
      )}
      {selectedPlan && (
        <PlanModal
          open={isPlanModalOpen}
          onClose={handleClosePlanModal}
          plan={selectedPlan}
          setUpdate={setUpdate}
        />
      )}
    </Box>
  );
}

export default PlanCard;
