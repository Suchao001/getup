import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Navi.css";
import { Button, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AuthContext from "../../context/AuthContext";

function BeginNavBar() {
  const [activeLink, setActiveLink] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLogin, user } = useContext(AuthContext);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, [window.location.pathname]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goRegister = () => {
    navigate("/register");
  };

  const goLogin = () => {
    navigate("/login");
  };
  const Sun = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-white mr-2"
        // ใช้ className แทน class
      >
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    );
  };

  return (
    <nav className="custom-navbar">
      <div
        className="custom-navbar-container "
        style={{ alignItems: "center" }}
      >
        <Link
          to="/"
          className={`custom-brand-link ${activeLink === "/" ? "active" : ""}`}
          onClick={() => handleLinkClick("/")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Sun />
            <h3 className="font1 text-white" style={{ marginLeft: "8px" }}>
              GetUpEveryDay
            </h3>
          </div>
        </Link>
        <div className="custom-navbar-brand text-center">
          <div className={`custom-navbar-links ${menuOpen ? "open" : ""}`}>
            <Button
              className="user-menu-button"
              onClick={goLogin}
              startIcon={<LoginIcon />}
              sx={{ color: "white" }}
            >
              <Typography variant="button" sx={{ color: "white" }}>
                {isLogin ? user.username : "Login"}
              </Typography>
            </Button>
            <Button
              className="register-button"
              onClick={goRegister}
              startIcon={<AppRegistrationIcon />}
              sx={{ color: "white" }}
            >
              <Typography variant="button" sx={{ color: "white" }}>
                Register
              </Typography>
            </Button>
          </div>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </nav>
  );
}

export default BeginNavBar;
