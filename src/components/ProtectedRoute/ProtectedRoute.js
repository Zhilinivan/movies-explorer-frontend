import { Navigate } from "react-router-dom";
import Preloader from "../Preloader/Preloader";

const ProtectedRoute = ({ component: Component, ...props }) => {

  return props.isLoading ? (

    <Preloader />
  ) : props.loggedIn ? (
    <Component {...props} />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
