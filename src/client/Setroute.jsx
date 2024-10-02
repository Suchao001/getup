import React from 'react';
import { Routes,Route} from 'react-router-dom';
import RegisterForm from './pages/RegisterForm.jsx';
import User from './pages/User.jsx';
import Profile from './pages/Profile.jsx';
import Setting from './pages/Setting.jsx';
import FirstPage from './pages/FirstPage.jsx';
import LoginForm from './pages/LoginForm.jsx';
import CalendarPage from './pages/Calendar.jsx';
import Setting_profile from './pages/setting/Setting_profile.jsx';
import Setting_account from './pages/setting/Setting_accout.jsx';
import { SwitchProvider } from './context/SwitchContext.jsx';

function Setroute() {
  
  return (
      <Routes>
        <Route path="/" element={ <FirstPage />} />
        <Route path="/register" element={ <RegisterForm />} />
        <Route path="/login" element={ <LoginForm />} />
        <Route path="/user" element={ <User />} />
        <Route path="/profile" element={ <Profile />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/setting" element={<Setting children={<Setting_profile />} title="Profile"/>} />
        <Route path="/setting/profile" element={<Setting children={<Setting_profile />} title="Profile"/>} />
        <Route path="/setting/account" element={<Setting children={<Setting_account />} title="Account"/>} />
      </Routes>
  );
}
export default Setroute