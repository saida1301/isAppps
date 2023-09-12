// LikedVacanciesContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Make sure to import axios

const LikedVacanciesContext = createContext();

export const LikedVacancyProvider = ({ children }) => {
  const [likedVacanciesData, setLikedVacanciesData] = useState([]);

  const saveLikedVacancies = async (likedVacancy) => {
    try {
      await AsyncStorage.setItem('likedVacancies', JSON.stringify(likedVacancy));
    } catch (error) {
      console.log('Error saving liked vacancy:', error);
    }
  };

  const loadLikedVacancy = async () => {
    try {
      const likedVacancyString = await AsyncStorage.getItem('likedVacancies');
      if (likedVacancyString) {
        const likedVacancyData = JSON.parse(likedVacancyString);
        setLikedVacanciesData(likedVacancyData);
      }
    } catch (error) {
      console.log('Error loading liked vacancies:', error);
    }
  };

  useEffect(() => {
    loadLikedVacancy();
  }, []);

  const likeVacancy = (vacancy) => {
    console.log('Adding vacancy to context:', vacancy);
    const updatedLikedVacancies = [...likedVacanciesData, vacancy];
    console.log('Updated likedVacanciesData:', updatedLikedVacancies);
    setLikedVacanciesData(updatedLikedVacancies);
    saveLikedVacancies(updatedLikedVacancies);
  };
  

  const unlikeVacancy = (vacancyId) => {
    const updatedLikedVacancies = likedVacanciesData.filter((vacancy) => vacancy.id !== vacancyId);
    setLikedVacanciesData(updatedLikedVacancies);
    saveLikedVacancies(updatedLikedVacancies);
  };

  const fetchLikedVacancyFromApi = async (userId) => {
    try {
      const response = await axios.get(`https://movieappi.onrender.com/favss/${userId}`);
      setLikedVacanciesData(response.data);
    } catch (error) {
      console.log('Error fetching liked vacancies from API:', error);
    }
  };

  const removeLikedVacancy = async (userId, vacancyId) => {
    try {
      await axios.delete(`https://movieappi.onrender.com/favsss/${userId}/${vacancyId}`);
      setLikedVacanciesData(prevLikedVacancyData =>
        prevLikedVacancyData.filter(vacancy => vacancy.id !== vacancyId)
      );
      console.log('Vacancy removed from favorites:', vacancyId);
    } catch (error) {
      console.log('Error removing liked vacancy:', error);
    }
  };

  const value = {
    likedVacanciesData,
    likeVacancy,
    unlikeVacancy,
    fetchLikedVacancyFromApi,
    removeLikedVacancy, // Add the removeLikedVacancy function to the context
  };

  return (
    <LikedVacanciesContext.Provider value={value}>{children}</LikedVacanciesContext.Provider>
  );
};

export const useLikedVacancy = () => {
  const context = useContext(LikedVacanciesContext);
  if (!context) {
    throw new Error('useLikedVacancy must be used within a LikedVacanciesProvider');
  }
  return context;
};