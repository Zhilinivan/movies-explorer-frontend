import "./Movies.css";
import React, { useEffect, useState } from "react";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Preloader from "../Preloader/Preloader";
import mainApi from "../../utils/MainApi";
import moviesApi from "../../utils/MoviesApi";

const Movies = ({ openPopup }) => {
  const [searchFilms, setSearchFilms] = useState(null);
  const [filmsSaved, setFilmsSaved] = useState([]);
  const [preloader, setPreloader] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [tumbler, setTumbler] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [moviesCount, setMoviesCount] = useState([]);
  const [filmsShowed, setFilmsShowed] = useState([]);

  useEffect(() => {
    setMoviesCount(getMoviesCount());
    const handlerResize = () => setMoviesCount(getMoviesCount());
    window.addEventListener("resize", handlerResize);

    return () => {
      window.removeEventListener("resize", handlerResize);
    };
  }, []);

  useEffect(() => {
    mainApi
      .getMovies()
      .then((data) => {
        setFilmsSaved(data);
      })
      .catch((err) => {
        openPopup(`Ошибка сервера ${err}`);
      });
  }, [openPopup]);

  useEffect(() => {
    const startFilms = JSON.parse(localStorage.getItem("searchFilms"));
    const startInput = localStorage.getItem("inputSearch");
    const startTumbler = localStorage.getItem("tumbler") === "true";

    setSearchFilms(startFilms);
    setInputSearch(startInput);

    setTumbler(startTumbler);
    setFilmsShowed(startFilms?.slice(0, getMoviesCount()[0]) || []);
  }, []);

  function getMoviesCount() {
    let countCards;
    const clientWidth = document.documentElement.clientWidth;
    const MoviesCountConfig = {
      1260: [16, 4],
      970: [12, 3],
      480: [8, 2],
      240: [5, 2],
    };

    Object.keys(MoviesCountConfig)
      .sort((a, b) => a - b)
      .forEach((key) => {
        if (clientWidth > +key) {
          countCards = MoviesCountConfig[key];
        }
      });

    return countCards;
  }

  function handleMore() {
    setFilmsShowed([
      ...filmsShowed,
      ...searchFilms.slice(
        filmsShowed.length,
        filmsShowed.length + moviesCount[1]
      ),
    ]);
  }

  async function handleGetMovies(inputSearch, tumbler) {
    if (!inputSearch) {
      setErrorText("Нужно ввести ключевое слово");
      return false;
    }

    setErrorText("");
    setPreloader(true);

    try {
      const data = await moviesApi.getMovies();

      let filterData = data.filter(({ nameRU }) =>
        nameRU.toLowerCase().includes(inputSearch.toLowerCase())
      );

      if (tumbler) {
        filterData = filterData.filter(({ duration }) => duration <= 40);
      }
      setSearchFilms(filterData);
      localStorage.setItem("searchFilms", JSON.stringify(filterData));

      localStorage.setItem("inputSearch", inputSearch);
      localStorage.setItem("tumbler", tumbler);

      setFilmsShowed(filterData.slice(0, moviesCount[0]));
    } catch (err) {
      setErrorText(
        "Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз"
      );

      localStorage.removeItem("searchFilms");
      localStorage.removeItem("tumbler");
      localStorage.removeItem("inputSearch");
    } finally {
      setPreloader(false);
    }
  }

  async function savedMoviesToggle(film, favorite) {
    if (favorite) {
      const objFilm = {
        ...film,
        image: "https://api.nomoreparties.co" + film.image.url,
        thumbnail: "https://api.nomoreparties.co" + film.image.url,
        movieId: film.id,
        country: film.country || "Неизвестно",
      };
      try {
        await mainApi.addMovies(objFilm);
        const newSaved = await mainApi.getMovies();
        setFilmsSaved(newSaved);
      } catch (err) {
        openPopup("Во время добавления фильма произошла ошибка.");
      }
    } else {
      try {
        await mainApi.deleteMovies(film._id);
        const newSaved = await mainApi.getMovies();
        setFilmsSaved(newSaved);
      } catch (err) {
        openPopup("Во время удаления фильма произошла ошибка.");
      }
    }
  }

  function handleChangeTumbler(newTumbler) {
    setTumbler(newTumbler);
    handleGetMovies(inputSearch, newTumbler);
  }

  function handleSearch(inputSearch) {
    handleGetMovies(inputSearch, tumbler);
  }

  function inputChange(evt) {
    setInputSearch(evt.target.value);
  }

  return (
    <div className="movies">
      <SearchForm
        handleSearch={handleSearch}
        tumbler={tumbler}
        inputSearch={inputSearch}
        handleChangeTumbler={handleChangeTumbler}
        inputChange={inputChange}
      />
      {preloader && <Preloader />}
      {errorText && <div className="movies__text-error">{errorText}</div>}
      {!preloader &&
        !errorText &&
        searchFilms !== null &&
        filmsSaved !== null &&
        filmsShowed !== null && (
          <MoviesCardList
            handleMore={handleMore}
            filmsRemains={searchFilms}
            films={filmsShowed}
            savedMoviesToggle={savedMoviesToggle}
            filmsSaved={filmsSaved}
          />
        )}
    </div>
  );
};

export default Movies;
