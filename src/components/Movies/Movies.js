import "./Movies.css";
import React, { useEffect, useState } from "react";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Preloader from "../Preloader/Preloader";
import mainApi from "../../utils/MainApi";
import moviesApi from "../../utils/MoviesApi";

const Movies = ({ openPopup }) => {
  const [preloader, setPreloader] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [films, setFilms] = useState(null);
  const [searchFilms, setSearchFilms] = useState(null);
  const [filmsSaved, setFilmsSaved] = useState([]);

  const [filmsShowed, setFilmsShowed] = useState([]);

  const [tumbler, setTumbler] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [moviesCount, setMoviesCount] = useState([]);

  useEffect(() => {
    setMoviesCount(getMoviesCount());
    const handlerResize = () => setMoviesCount(getMoviesCount());
    window.addEventListener("resize", handlerResize);

    return () => {
      window.removeEventListener("resize", handlerResize);
    };
  }, []);

  useEffect(() => {
    async function formData() {
      try {
        const data = await mainApi.getMovies();
        setFilmsSaved(data);
      } catch (err) {
        openPopup(`Ошибка сервера ${err}`);
      }
    }
    formData();
  }, [openPopup]);

  useEffect(() => {
    async function getFilms() {
      setErrorText("");
      setPreloader(true);

      try {
        const data = await moviesApi.getMovies();

        setFilms(data);
      } catch (err) {
        setErrorText(
          "Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз"
        );
      } finally {
        setPreloader(false);
      }
    }

    getFilms();
  }, []);

  useEffect(() => {
    const searchFilms = JSON.parse(localStorage.getItem("searchFilms"));
    const inputSearch = localStorage.getItem("inputSearch");
    const tumbler = localStorage.getItem("tumbler") === "true";

    setSearchFilms(searchFilms);
    setInputSearch(inputSearch);

    setTumbler(tumbler);
    setFilmsShowed(searchFilms?.slice(0, getMoviesCount()[0]) || []);
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

    let searchFilms = films
      .filter(({ nameRU }) =>
        nameRU.toLowerCase().includes(inputSearch.toLowerCase())
      )
      .filter(({ duration }) => (tumbler ? duration <= 40 : true));

    setSearchFilms(searchFilms);

    localStorage.setItem("searchFilms", JSON.stringify(searchFilms));
    localStorage.setItem("inputSearch", inputSearch);
    localStorage.setItem("tumbler", tumbler);

    setFilmsShowed(searchFilms.slice(0, moviesCount[0]));
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
        setFilmsSaved((prev) => [...prev, objFilm]);
      } catch (err) {
        openPopup("Во время добавления фильма произошла ошибка.");
      }
    } else {
      try {
        await mainApi.deleteMovies(film.id);
        setFilmsSaved((prev) => prev.filter((f) => f.movieId !== film.id));
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
