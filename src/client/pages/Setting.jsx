import React from "react";
import {
  Typography,
  Button,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material"; // นำเข้า useTheme ด้วย
import { Person, Settings } from "@mui/icons-material";
import CheckLogin from "../components/auth/CheckLogin";
import { useNavigate } from "react-router-dom";
import useFetchUserProfile from "../hooks/FetchUserProfile";

function Setting({ children, title }) {
  const navigate = useNavigate();
  const { userProfile, avatarSrc, loading, error } = useFetchUserProfile();

  const theme = useTheme(); // ใช้ useTheme เพื่อนำเข้า theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ใช้ theme ใน useMediaQuery

  const goSetting = (part) => {
    navigate(`/setting/${part}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: "#f2f2f2" }}>
      <Container>
        <CheckLogin
          page={
            <Box
              sx={{
                display: "flex",
                p: 3,
                flexDirection: isMobile ? "column" : "row", // กำหนด flexDirection ตามขนาดหน้าจอ
              }}
            >
              <Box
                sx={{ width: isMobile ? "100%" : 250, mr: isMobile ? 0 : 4 }}
              >
                {" "}
                {/* ปรับความกว้างตามขนาดหน้าจอ */}
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={avatarSrc}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">
                        {userProfile?.username || "Username"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Your personal account
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/profile")}
                  >
                    profile
                  </Button>
                </Box>
                <List component="nav">
                  <ListItem
                    button
                    selected={title === "Profile"}
                    onClick={() => goSetting("profile")}
                    sx={{
                      borderRadius: "10px",
                    }}
                  >
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="Public profile" />
                  </ListItem>
                  {/* <ListItem 
                button 
                selected={title === "Account"}
                onClick={() => goSetting('account')}
              >
                <ListItemIcon><Settings /></ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem> */}
                </List>
              </Box>
              <Box sx={{ flex: 1, mt: isMobile ? 2 : 0 }}>
                {" "}
                {/* เพิ่มระยะห่างด้านบนเมื่ออยู่บนมือถือ */}
                {children}
              </Box>
            </Box>
          }
        />
      </Container>
    </div>
  );
}

export default Setting;
