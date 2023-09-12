import "./SavedMovies.css";
import { useEffect, useState } from "react";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Preloader from "../Preloader/Preloader";
import mainApi from "../../utils/MainApi.js";

const SavedMovies = ({ openPopup }) => {
  const [filmsSaved, setFilmsSaved] = useState([]);
  const [preloader, setPreloader] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [tumbler, setTumbler] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [filmsShowed, setFilmsShowed] = useState([]);

  async function handleGetMovies(inputSearch, tumbler) {
    setErrorText("");
    setPreloader(true);

    try {
      let filterData = filmsSaved.filter(({ nameRU }) =>
        nameRU.toLowerCase().includes(inputSearch.toLowerCase())
      );

      if (tumbler)
        filterData = filterData.filter(({ duration }) => duration <= 40);

      setFilmsShowed(filterData);
    } catch (err) {
      setErrorText(
        "Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз"
      );
    } finally {
      setPreloader(false);
    }
  }

  async function savedMoviesToggle(film, favorite) {
    if (!favorite) {
      try {
        await mainApi.deleteMovies(film._id);
        const newFilms = await mainApi.getMovies();
        setFilmsShowed(newFilms);
        setFilmsSaved(newFilms);
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

  useEffect(() => {
    async function formData() {
      try {
        const data = await mainApi.getMovies();
        setFilmsSaved(data);
        setFilmsShowed(data);
      } catch (err) {
        openPopup(`Ошибка сервера ${err}`);
      }
    }
    formData();
  }, [openPopup]);

  return (
    <div className="saved-movies">
      <SearchForm
        handleSearch={handleSearch}
        tumbler={tumbler}
        inputSearch={inputSearch}
        handleChangeTumbler={handleChangeTumbler}
        inputChange={inputChange}
      />

      {preloader && <Preloader />}
      {errorText && <div className="saved-movies__text-error">{errorText}</div>}
      {!preloader && !errorText && filmsSaved !== null && (
        <MoviesCardList
          filmsRemains={[]}
          savedMoviesToggle={savedMoviesToggle}
          films={filmsShowed}
        />
      )}
    </div>
  );
};

export default SavedMovies;
