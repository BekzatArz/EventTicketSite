import { useTranslation } from 'react-i18next';
import './Header.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MouseEventHandler, useEffect, useState } from 'react';
import { logout } from '../../../features/auth/model/authSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectIsAuthenticated, selectUserRole } from '../../../features/auth/model/authSelectors';

const Header = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const isAuth = useAppSelector(selectIsAuthenticated)
  const role = useAppSelector(selectUserRole)
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleProfileClick: MouseEventHandler<SVGElement> = (e) => {
    e.stopPropagation();
    setProfileOpen(!profileOpen);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector('.profile-icon__menu');
      if (menu && !menu.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/404') {
      return;
    }
  }, [location.pathname])
  if (!isAuth ) return;

  return (
    <div className="header">
      {
        role === 'admin' ? <div className="header__nav">
        <NavLink to="/dashboard" className="header__nav-links">
          {i18n.t('header.myEvents')}
        </NavLink>
        <NavLink to="/add-event" className="header__nav-links">
          {i18n.t('header.addEvent')}
        </NavLink>
        <svg
          onClick={handleProfileClick}
          fill="#ffffff"
          className="profile-icon"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="48px"
          height="48px"
          viewBox="-4.55 -4.55 54.63 54.63"
          xmlSpace="preserve"
          stroke="#6a198f"
          strokeWidth="0.00045531999999999994"
        >
          <g id="SVGRepo_iconCarrier">
            <path
              d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
            ></path>
          </g>
        </svg>
        <div className={`profile-icon__menu ${profileOpen ? 'active' : ''}`}>
          {profileOpen && (
            <button onClick={handleLogoutClick}>Выйти</button>
          )}
        </div>
      </div>
      
      :
      
      <div className="header__nav">
        <NavLink to="/home" className="header__nav-links">
          {i18n.t('header.events')}
        </NavLink>
        <NavLink to="/my-tickets" className="header__nav-links">
          {i18n.t('header.my-tickets')}
        </NavLink>
        <svg
          onClick={handleProfileClick}
          fill="#ffffff"
          className="profile-icon"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="48px"
          height="48px"
          viewBox="-4.55 -4.55 54.63 54.63"
          xmlSpace="preserve"
          stroke="#6a198f"
          strokeWidth="0.00045531999999999994"
        >
          <g id="SVGRepo_iconCarrier">
            <path
              d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
            ></path>
          </g>
        </svg>
        <div className={`profile-icon__menu ${profileOpen ? 'active' : ''}`}>
          {profileOpen && (
            <button onClick={handleLogoutClick}>Выйти</button>
          )}
        </div>
      </div>
  }
    </div>
  );
};

export default Header