import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

function User() {
  const { auth, isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    console.log("isLogin:", isLogin);
    if (!isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate, loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>User</div>;
}

export default User;
