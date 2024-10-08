import { Popover } from "@mui/material";
import PopupForm from "./PopupForm";

const PlanPopover = ({
  popupOpen,
  anchorEl,
  handlePopupClose,
  selectedDate,
  isEdit,
  selectedPlan,
  onAddPlan,
}) => {
  return (
    <Popover
      open={popupOpen}
      anchorEl={anchorEl}
      onClose={handlePopupClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <PopupForm
        selectedDate={selectedDate}
        onClose={handlePopupClose}
        plan={selectedPlan}
        onAddPlan={onAddPlan}
        isEdit={isEdit}
      />
    </Popover>
  );
};

export default PlanPopover;
