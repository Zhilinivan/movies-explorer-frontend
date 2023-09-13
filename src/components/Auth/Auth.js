import './Auth.css';
import { Link } from 'react-router-dom';

function Auth() {
  return (
    <nav className="auth">
      <ul className="auth__list">
        <li className="auth__list-item">
          <Link to="/signup" className="auth__link auth__link_signup">Регистрация</Link>
        </li>
        <li className="auth__list-item">
          <Link to="/signin" className="auth__link auth__link_signin">Войти</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Auth;