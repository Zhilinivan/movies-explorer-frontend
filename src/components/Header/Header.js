import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../../images/logo.svg";
import Auth from "../Auth/Auth";
import HeaderNav from "../HeaderNav/HeaderNav";

const Header = ({ loggedIn }) => {
  return (
    <header className={`header ${!loggedIn ? "header_auth" : ""}`}>
      <Link to="/" className="header__link">
        <img className="header__logo" src={logo} alt="Логотип"></img>
      </Link>
      {!loggedIn && <Auth />}
      {loggedIn && <HeaderNav />}
    </header>
  );
};

export default Header;
