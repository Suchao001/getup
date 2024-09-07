import React,{useContext} from 'react'
import Navi from './Navi'
import BeginNavBar from './components/layout/BeginNavBar'
import AuthContext from './context/AuthContext'

function renderNavigation() {
    const { isLogin, loading } = useContext(AuthContext);
  
    if (isLogin && !loading) {
      return <Navi />;
    } else {
      return <BeginNavBar />;
    }
  }
  
  export default renderNavigation;