import "./SearchForm.css";
import FilterCheckbox from "../FilterCheckbox/FilterCheckbox";

const SearchForm = ({
  handleSearch,
  tumbler,
  inputSearch,
  handleChangeTumbler,
  inputChange,
}) => {
  function handleSubmit(evt) {
    evt.preventDefault();
    handleSearch(inputSearch);
  }

  function changeTumbler(evt) {
    handleChangeTumbler(evt.target.checked);
  }

  return (
    <form className="search">
      <div className="search__container">
        <input
          className="search__input"
          placeholder="Фильм"
          type="text"
          value={inputSearch || ""}
          onChange={inputChange}
          required
        />
        <button type="submit" className="search__button" onClick={handleSubmit}>
          Найти
        </button>
      </div>
      <FilterCheckbox value={tumbler} onChange={changeTumbler} />
    </form>
  );
};

export default SearchForm;
