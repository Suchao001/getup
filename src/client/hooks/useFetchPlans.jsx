import React, { useState } from "react";
import axios from "axios";
import { HostName } from "../script/HostName";
import { goodAlert, badAlert, deleteConfirm } from "../script/sweet";

const useFetchPlans = () => {
  const [planData, setPlanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${HostName}/api/plans`);
      console.log(response.data);
      setPlanData(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      setPlanData([]);
      setError("Error fetching plans");
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (formData, iconId, plan, toggleSwitch, onClose) => {
    formData.icon_id = iconId;
    if (formData.start_time !== "" && formData.end_time !== "") {
      if (formData.start_date > formData.end_date) {
        badAlert("Start date cannot be greater than end date");
        return;
      }
    }
    try {
      const response = await axios.put(
        `${HostName}/api/plans/update/${plan.id}`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        goodAlert("Plan updated successfully");
        toggleSwitch();
        onClose();
      }
    } catch (error) {
      badAlert("Error updating plan");
      console.error(error);
    }
  };

  const deletePlan = async (plan, onClose, setUpdate) => {
    try {
      const isConfirmed = await deleteConfirm(
        "Delete Plan",
        "Are you sure you want to delete this plan?"
      );
      if (!isConfirmed) return;
      const res = await axios.delete(
        `${HostName}/api/plans/delete/${plan.id}`,
        { withCredentials: true }
      );
      goodAlert("Plan deleted successfully");
      onClose();
      setUpdate(true);
    } catch (error) {
      badAlert(error.response?.data?.message || error.message);
    }
  };

  return { planData, loading, error, fetchPlans, updatePlan, deletePlan };
};

export default useFetchPlans;
