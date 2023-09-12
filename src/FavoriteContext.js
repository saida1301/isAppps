import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [user_id, setUserId] = useState('');

  // Fetch favorited vacancies from the server
  const fetchFavoritedVacancies = async () => {
    try {
      if (user_id) {
        const response = await axios.get(`https://movieappi.onrender.com/fav/20`);
        setFavorites(response.data);
        console.log(response.data)
      }
    } catch (error) {
      console.log('Error fetching favorited vacancies:', error);
    }
  };

  // Fetch the user ID from AsyncStorage or the API
  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('Stored userId:', storedUserId);

      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        // If userId is not found in AsyncStorage, fetch it from the API
        const response = await axios.get('https://movieappi.onrender.com/user');
        console.log('API response:', response.data);
        const data = response.data;
        const loggedInUser = data.find((user) => user.email === email);

        if (loggedInUser) {
          setUserId(loggedInUser.id);
          // Save the fetched userId in AsyncStorage for future use
          await AsyncStorage.setItem('userId', loggedInUser.id.toString());
        } else {
          console.error('User not found!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call fetchFavoritedVacancies and fetchUserId when the component mounts or when the user_id changes
  useEffect(() => {
    fetchFavoritedVacancies();
    fetchUserId();
  }, [user_id]);

  const addToFavorites = (item) => {
    setFavorites([...favorites, item]);
  };

  const removeFromFavorites = async (itemId) => {
    try {
      // Make an API call to remove the vacancy from the server database
      await axios.delete(`https://movieappi.onrender.com/fav/${itemId}`);

      // Remove the vacancy from the favorites state
      setFavorites(favorites.filter((item) => item.id !== itemId));
      console.log('Vacancy removed from favorites successfully.');
    } catch (error) {
      console.log('Error removing vacancy from favorites:', error);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, user_id }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};