import React from 'react';
import InputWithLabel from './InputWithLabel';
import RefButton from './RefButton';

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
    refSearch,
    handleRefButtonClick
  }) =>{ 

    return (<div>
    <form onSubmit={onSearchSubmit} className="search-form">
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
  
      <button
        type="submit"
        disabled={!searchTerm}
        className="button button_large"
      >
        Submit
      </button>
    </form>
    <RefButton refSearch={refSearch} handleRefButtonClick={handleRefButtonClick}/>
    </div>
  );
  }

  export default SearchForm;