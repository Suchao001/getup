import React from "react";
import { Grid } from "@mui/material";
import useFetchUserProfile from "../../hooks/FetchUserProfile";
import HabitManagement from "./HabitManagement";
import TaskManagement from "./TaskManagement";
import PlanManagement from "./PlanManagement";

function ManagementPage() {
  const { userProfile } = useFetchUserProfile();
  const itemsPerPage = 5;

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <HabitManagement
            userProfile={userProfile}
            itemsPerPage={itemsPerPage}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TaskManagement itemsPerPage={itemsPerPage} />
        </Grid>
        <Grid item xs={12} md={12}>
          <PlanManagement itemsPerPage={itemsPerPage} />
        </Grid>
      </Grid>
    </div>
  );
}

export default ManagementPage;
