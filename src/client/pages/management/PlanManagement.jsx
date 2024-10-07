import React, { useState, useEffect } from "react";
import { Typography, Paper, Box, Button, Pagination } from "@mui/material";
import useFetchPlans from "../../hooks/useFetchPlans";
import PopupForm from "../../components/plan/PopupForm";
import CustomModal from "../../components/common/CustomModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ficons from "@fortawesome/free-solid-svg-icons";
import { useSwitch } from "../../context/SwitchContext";

function PlanManagement({ itemsPerPage }) {
  const { planData, loading, error, fetchPlans, updatePlan, deletePlan } =
    useFetchPlans();
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planPage, setPlanPage] = useState(1);
  const { toggleSwitch } = useSwitch();

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (planData) {
      setPlans(planData);
    }
  }, [planData]);

  const handleDeletePlan = async (plan) => {
    await deletePlan(
      plan,
      () => {
        setEditingPlan(null);
        fetchPlans();
      },
      () => {}
    );
  };

  const handleUpdatePlan = async (formData, iconId) => {
    await updatePlan(formData, iconId, editingPlan, toggleSwitch, () => {
      setEditingPlan(null);
      fetchPlans();
    });
  };

  const renderPlans = () => {
    const startIndex = (planPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPlans = plans.slice(startIndex, endIndex);

    return paginatedPlans.map((plan) => (
      <Box key={plan.id} mb={2} display="flex" alignItems="center">
        <FontAwesomeIcon
          icon={ficons[plan.nameTouse] || ficons.faCalendar}
          style={{ fontSize: "1.5rem", marginRight: "10px", color: plan.color }}
        />
        <Typography variant="body1">{plan.name}</Typography>
        <Box ml="auto">
          <Button onClick={() => setEditingPlan(plan)}>Edit</Button>
          <Button onClick={() => handleDeletePlan(plan)}>Delete</Button>
        </Box>
      </Box>
    ));
  };

  if (loading) {
    return <Typography>Loading plans...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom color="#2196f3">
        Plans
      </Typography>
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        {renderPlans()}
        <Pagination
          count={Math.ceil(plans.length / itemsPerPage)}
          page={planPage}
          onChange={(event, value) => setPlanPage(value)}
        />
      </Paper>
      <CustomModal open={!!editingPlan} onClose={() => setEditingPlan(null)}>
        {editingPlan && (
          <PopupForm
            plan={editingPlan}
            isEdit={true}
            onClose={() => setEditingPlan(null)}
            selectedDate={editingPlan.start_date}
            onSubmit={handleUpdatePlan}
          />
        )}
      </CustomModal>
    </>
  );
}

export default PlanManagement;
