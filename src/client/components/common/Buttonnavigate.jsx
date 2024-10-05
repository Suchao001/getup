import React, { useState, useRef, useEffect } from "react";

const BottomTabNavigation = ({ handleTabClick }) => {
  const [activeTab, setActiveTab] = useState("habit");
  const [sliderStyle, setSliderStyle] = useState({});
  const tabRefs = useRef({});

  const tabs = ["habit", "task", "plan"];

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setSliderStyle({
        width: `${activeTabElement.offsetWidth}px`,
        left: `${activeTabElement.offsetLeft}px`,
        transition: "width 0.3s ease, left 0.3s ease", // Smooth slider transition
      });
    }
  }, [activeTab]);

  const handleClick = (tab) => {
    setActiveTab(tab);
    handleTabClick(tab); // Call the parent function to scroll to the section
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "300px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: "9999px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "4px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Slider for the active tab */}
        <div
          style={{
            position: "absolute",
            top: "4px",
            height: "calc(100% - 8px)",
            backgroundColor: "#ffeedc",
            borderRadius: "9999px",
            ...sliderStyle, // Applying the dynamic width and left positioning
          }}
        />
        {Array.isArray(tabs) && tabs.length > 0 ? (
          tabs.map((tab) => (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[tab] = el)}
              onClick={() => handleClick(tab)}
              aria-selected={activeTab === tab}
              style={{
                position: "relative",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                color: activeTab === tab ? "#ff961b" : "#ff6e66",
                background: "none",
                border: "none",
                outline: "none",
                cursor: "pointer",
                borderRadius: "9999px",
                transition: "color 0.3s ease", // Smooth color transition
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))
        ) : (
          <div>No tabs available</div>
        )}
      </div>
    </div>
  );
};

export default BottomTabNavigation;
