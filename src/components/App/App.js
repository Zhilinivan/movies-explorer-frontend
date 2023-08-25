import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Movies from "../Movies/Movies";
import SavedMovies from "../SavedMovies/SavedMovies";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Profile from "../Profile/Profile";
import PageNotFound from "../PageNotFound/PageNotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <Header islogged={false} />
              <main>
                <Main />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/movies"
          element={
            <>
              <Header islogged={true} />
              <main>
                <Movies />
              </main>
              <Movies />
              <Footer />
            </>
          }
        />
        <Route
          exact
          path="/saved-movies"
          element={
            <>
              <Header islogged={true} />
              <main>
                <SavedMovies />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          exact
          path="/signup"
          element={
            <>
              <main>
                <Register />
              </main>
            </>
          }
        />
        <Route
          exact
          path="/signin"
          element={
            <>
              <main>
                <Login />
              </main>
            </>
          }
        />
        <Route
          exact
          path="/profile"
          element={
            <>
              <Header islogged={true} />
              <main>
                <Profile />
              </main>
            </>
          }
        />

        <Route
          path="*"
          element={
            <>
              <main>
                <PageNotFound />
              </main>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
