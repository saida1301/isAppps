import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  favorites: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      let obj = {
        id: action.payload.id,
        name: action.payload.name,
        img: action.payload.img,
      };
      state.favorites.push(obj);

      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
      console.log('added');
    },
    removeFavorite: (state, action) => {
      const placeIdToRemove = action.payload;
    
      // Remove the favorite with the matching ID from the state
      state.favorites = state.favorites.filter(item => item.id !== placeIdToRemove);
    
      // Update AsyncStorage with the updated favorites list
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
    
      console.log('removed');
    },
    
    // setFavorites: (state, action) => {
    //   state.favorites = action.payload;
    // },
  },
});

export const {addFavorite, removeFavorite, setFavorites} =
  favoritesSlice.actions;

// export const loadFavorites = () => async dispatch => {
//   const favorites = await AsyncStorage.getItem('favorites');
//   if (favorites) {
//     dispatch(setFavorites(JSON.parse(favorites)));
//   }
// };

export default favoritesSlice.reducer;