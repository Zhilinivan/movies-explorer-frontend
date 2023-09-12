import "./PageNotFound.css";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <section className="not-found">
      <div className="not-found__container">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__text">Страница не найдена</p>
      </div>
      <button onClick={() => navigate(-1)} className="not-found__link">
        Назад
      </button>
    </section>
  );
};

export default PageNotFound;
