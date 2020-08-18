import React from 'react';
import logo from './logo.svg';
import styles from './App.css';
import axios from 'axios';
import cs from 'classnames';
import SearchForm from './SearchForm';
import List from './List';
import {ReactComponent as Check} from './check.svg';
import {sortBy} from 'lodash';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    case 'UPDATE_STORY':
      if(action.payload === 'points' || action.payload === 'num_comments'){
        return {
          ...state,
          data: sortBy(state.data,action.payload).reverse()
        };
      }
      return {
        ...state,
        data: sortBy(state.data,action.payload)
      };
      case 'UPDATE_REV_STORY':
      if(action.payload === 'points' || action.payload === 'num_comments'){
        return {
          ...state,
          data: sortBy(state.data,action.payload)
        };
      }
      return {
        ...state,
        data: sortBy(state.data,action.payload).reverse()
      };
    default:
      throw new Error();
  }
};


const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [refSearch, setRefSearch] = React.useState(searchTerm);

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );
  
  const [toggle,setToggle] = React.useState({
    titletog: true,
    authortog: true,
    commenttog: true,
    pointtog: true 
  });


  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setRefSearch(`${searchTerm}`);
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleRefButtonClick = () => {
    setUrl(`${API_ENDPOINT}${refSearch}`)
  }

      
  const sortHandler = event =>{
    console.log(event.target.value)
      setToggle(false);
      switch(event.target.value){
        case 'title': 
        if(toggle.titletog === true){
          setToggle({...toggle, titletog: false})
          dispatchStories({ type: 'UPDATE_STORY', payload: 'title'});
        }
        else{
          setToggle({...toggle, titletog: true})
          dispatchStories({ type: 'UPDATE_REV_STORY', payload: 'title'});
        }
        
          break;
        case 'author': 
        if(toggle.authortog === true){
          setToggle({...toggle, authortog: false})
          dispatchStories({ type: 'UPDATE_STORY', payload: 'author'});
        }
        else{
          setToggle({...toggle, authortog: true})
          dispatchStories({ type: 'UPDATE_REV_STORY', payload: 'author'});
        }
        break;
        case 'num_comments': 
        if(toggle.commenttog === true){
          setToggle({...toggle, commenttog: false})
          dispatchStories({ type: 'UPDATE_STORY', payload: 'num_comments'});
        }
        else{
          setToggle({...toggle, commenttog: true})
          dispatchStories({ type: 'UPDATE_REV_STORY', payload: 'num_comments'});
        }
        break;
        case 'points': 
        if(toggle.pointtog === true){
          setToggle({...toggle, pointtog: false})
          dispatchStories({ type: 'UPDATE_STORY', payload: 'points'});
        }
        else{
          setToggle({...toggle, pointtog: true})
          dispatchStories({ type: 'UPDATE_REV_STORY', payload: 'points'});
        }
        break;
          default:
            break;
      
      }
  }

  const recentButton = () =>{

  }
  
  return (
    <div className="container">
      <h1 className="headline-primary">Vedant's News app</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        refSearch={refSearch}
        handleRefButtonClick={handleRefButtonClick}
      />
      <Sort  sortHandler={sortHandler}/>
    
      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const Sort = ({sortHandler}) =>{
  const [selectCounter, setSelectCounter] = React.useState(0);

  const ascendDescend = event =>{
    console.log(event.target.value)
    if(selectCounter === 0){
      setSelectCounter(1);
    }
    else if(selectCounter === 1){
      setSelectCounter(0);
      return sortHandler(event);
    }
  }
  
  return(
    <>
    <label htmlFor='sort'>Sort By</label>
    <select id="sort" name="categories" onClick={ascendDescend}>
  <option disabled selected>Sort by: </option>
  <option value="title" >title</option>
  <option value="author" >author</option>
  <option value="num_comments">comments</option>
  <option value="points">points</option>
    </select>
    </>
  );
}

export default App;
