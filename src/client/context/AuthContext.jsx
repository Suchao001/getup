import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from '../script/HostName';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userImage, setUserImage] = useState(null);

  const authenticateUser = async () => {
    try {          
        const authResponse = await axios.get(`${HostName}/api/user/protected-route`, { withCredentials: true });
        if (authResponse.data.success) {
          const userResponse = await axios.get(`${HostName}/api/user/user_info`, { withCredentials: true });
          if (userResponse.data.ok) {
            setUser(userResponse.data.user);
            setIsLogin(true);
          }
        } else {
          throw new Error('Authorization failed');
        }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsLogin(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  const updateUserImage = (imageUrl) => {
    setUserImage(imageUrl);
    setUser(prevUser => ({ ...prevUser, img: imageUrl }));
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, loading, userImage, updateUserImage, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;