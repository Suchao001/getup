import React,{useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Home from './Home';
import HomeFirst from './HomeFirst';

function FirstPage() {
    const { isLogin, loading } = useContext(AuthContext);
  return (
    <div>
        {isLogin && !loading ?  <Home />: <HomeFirst />}
    </div>
  )
}

export default FirstPage