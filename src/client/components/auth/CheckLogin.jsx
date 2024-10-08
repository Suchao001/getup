import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CheckLogin({ page }) {
    const { isLogin, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return; 
        if (!isLogin) {
            navigate('/');
        }
    }, [isLogin, navigate, loading]);

    return (
        <>
            {isLogin && !loading ? page : null}
        </>
    );
}

export default CheckLogin;
