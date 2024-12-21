import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/User/Home.tsx';  // Страница домашняя
import Profile from '../pages/User/Profile.tsx';  // Страница профиля
import NotFound from '../pages/NotFound.tsx';
import AuthPage from '../pages/AuthPage.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { selectIsAuthenticated, selectUserRole } from '../features/auth/model/authSelectors.ts';
import { useEffect } from 'react';
import { setAuthenticated, setUserRole } from '../features/auth/model/authSlice.ts';
import MyTickets from '../pages/User/MyTickets.tsx';
import '../pages/styles/pagesContainers.css'
import { jwtDecode } from 'jwt-decode';
import AdminHomePage from '../pages/Admin/AdminHomePage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import AddEventPage from '../pages/Admin/AddEventPage.tsx';
import EventDashboard from '../pages/Admin/EventDashboard.tsx';

const AppRoutes = () => {
  const isAuth = useAppSelector(selectIsAuthenticated)
  const role = useAppSelector(selectUserRole);
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decodedToken: {exp: number, role: string} = jwtDecode(token)
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime){
          localStorage.removeItem('token')
          dispatch(setAuthenticated(false))
        } else{
          if (decodedToken.role === 'admin'){
            dispatch(setUserRole('admin'))
          }else if (decodedToken.role === 'user'){
            dispatch(setUserRole('user'))
          }
        }
      }
      catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        dispatch(setAuthenticated(false));
      }
    }
    else {
      dispatch(setAuthenticated(false))
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* User Routess */}
        <Route path='/' element={isAuth && role === 'user'? <Navigate to="/home" /> 
        : isAuth && role === 'admin'?<Navigate to='/dashboard'/> : <AuthPage />} />
        
        <Route path="/home" element={isAuth && role === 'user'? <Home />: <Navigate to="/" />} />
        
        <Route path="/profile" element={isAuth && role === 'user'? <Profile />
        : isAuth && role === 'admin' ? <Navigate to='/403' /> : <Navigate to="/" />} />

        <Route path='/my-tickets' element={isAuth && role === 'user'? <MyTickets />
        : isAuth && role === 'admin'? <Navigate to='/403' /> : <Navigate to='/' />} />


        {/* Admin Routess */} 
        <Route path='/dashboard'element={isAuth && role === 'admin' ? <AdminHomePage/>
        : isAuth && role === 'user'? <Navigate to='/403' />: <AuthPage />} />
        
        <Route path='/add-event'element={isAuth && role === 'admin' ? <AddEventPage/>
        : isAuth && role === 'user'? <Navigate to='/403' />: <AuthPage />} />
        
        <Route path='/dashboard/:id' element={isAuth && role === 'admin' ? <EventDashboard/>
        : isAuth && role === 'user'? <Navigate to='/403' />: <AuthPage />} />

        {/* Other Routessss*/}
        <Route path='/403' element={<ProtectedRoute />} />
        <Route path='404' element={<NotFound />}/>
        <Route path='*' element={<Navigate to='/404'/>} />
      </Routes>
    </>
  );
}

export default AppRoutes;