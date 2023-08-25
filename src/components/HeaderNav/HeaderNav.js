import './HeaderNav.css';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import account from '../../images/account.svg';

const HeaderNav = () => {
  const [showItems, setShowItems] = useState(false);

  const handleToggleMenu = () => setShowItems(!showItems);

  return (
    <nav className="header-nav">
      <button className="header-nav__menu-button" type="button" onClick={handleToggleMenu}></button>
      <div className={`header-nav__container ${showItems ? 'header-nav__container_visible' : ''}`}>
        <div className="header-nav__sidebar">
          <div className="header-nav__list-container">
            <button className="header-nav__close-button" type="button" onClick={handleToggleMenu}></button>
            <ul className="header-nav__list">
              <li className="header-nav__list-item header-nav__list-item_main">
                <Link to="/" className="header-nav__link">Главная</Link>
              </li>
              <li className="header-nav__list-item">
                <NavLink to="/movies" className="header-nav__link" activeClassName="header-nav__link_active">Фильмы</NavLink>
              </li>
              <li className="header-nav__list-item">
                <NavLink to="/saved-movies" className="header-nav__link" activeClassName="header-nav__link_active">Сохранённые фильмы</NavLink>
              </li>
            </ul>
          </div>
          <NavLink to="/profile" className="header-nav__link header-nav__link_profile" activeClassName="header-nav__link_active">
            <p>Аккаунт</p>
            <img src={account} alt="Аккаунт"></img>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;