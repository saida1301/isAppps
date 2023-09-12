// SearchHistoryContext.js
import React, { createContext, useContext, useState } from 'react';

const SearchHistoryContext = createContext();

export const useSearchHistory = () => {
  return useContext(SearchHistoryContext);
};

export const SearchHistoryProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState([]);

  const addToHistory = (query) => {
    setSearchHistory((prevHistory) => {
      if (!prevHistory.includes(query)) {
        return [query, ...prevHistory];
      }
      return prevHistory;
    });
  };

  const deleteFromHistory = (query) => {
    setSearchHistory((prevHistory) => prevHistory.filter((item) => item !== query));
  };

  return (
    <SearchHistoryContext.Provider value={{ searchHistory, addToHistory, deleteFromHistory }}>
      {children}
    </SearchHistoryContext.Provider>
  );
};
