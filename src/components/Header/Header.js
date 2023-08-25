import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../../images/logo.svg";
import Auth from "../Auth/Auth";
import HeaderNav from "../HeaderNav/HeaderNav";

const Header = ({ islogged }) => {
  return (
    <header className={`header ${!islogged ? "header_auth" : ""}`}>
      <Link to="/" className="header__link">
        <img className="header__logo" src={logo} alt="Логотип"></img>
      </Link>
      {!islogged && <Auth />}
      {islogged && <HeaderNav />}
    </header>
  );
};

export default Header;
