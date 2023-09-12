import { createSlice } from '@reduxjs/toolkit';

const searchHistorySlice = createSlice({
  name: 'searchHistory',
  initialState: [],
  reducers: {
    addSearchQuery: (state, action) => {
      const query = action.payload;
      if (!state.includes(query)) {
        state.push(query);
      }
    },
    removeSearchQuery: (state, action) => {
      const query = action.payload;
      return state.filter(item => item !== query);
    },
  },
});

export const { addSearchQuery, removeSearchQuery } = searchHistorySlice.actions;

export default searchHistorySlice.reducer;
