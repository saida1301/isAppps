// LikedCvContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Make sure to import axios

const LikedCvContext = createContext();

export const LikedCvProvider = ({ children }) => {
  const [likedCvData, setLikedCvData] = useState([]);

  const saveLikedCv = async (likedCv) => {
    try {
      await AsyncStorage.setItem('likedCv', JSON.stringify(likedCv));
    } catch (error) {
      console.log('Error saving liked cv:', error);
    }
  };

  const loadLikedCv = async () => {
    try {
      const likedCvString = await AsyncStorage.getItem('likedCv');
      if (likedCvString) {
        const likedCvData = JSON.parse(likedCvString);
        setLikedCvData(likedCvData);
      }
    } catch (error) {
      console.log('Error loading liked cv:', error);
    }
  };

  useEffect(() => {
    loadLikedCv();
  }, []);

  const likeCv = (cv) => {
    const updatedLikedCv = [...likedCvData, cv];
    setLikedCvData(updatedLikedCv);
    saveLikedCv(updatedLikedCv);
  };

  const unlikeCv = (cvId) => {
    const updatedLikedCv = likedCvData.filter((cv) => cv.id !== cvId);
    setLikedCvData(updatedLikedCv);
    saveLikedCv(updatedLikedCv);
  };

  const fetchLikedCvFromApi = async (userId) => {
    try {
      const response = await axios.get(`https://movieappi.onrender.com/fvrts/${userId}`);
      setLikedCvData(response.data);
    } catch (error) {
      console.log('Error fetching liked cv from API:', error);
    }
  };

  const removeLikedCv = async (userId, cvId) => {
    try {
      await axios.delete(`https://movieappi.onrender.com/fa/${userId}/${cvId}`);
      setLikedCvData(prevLikedCvData =>
        prevLikedCvData.filter(cv => cv.id !== cvId)
      );
      console.log('Vacancy removed from favorites:', cvId);
    } catch (error) {
      console.log('Error removing liked vacancy:', error);
    }
  };

  const value = {
    likedCvData,
    likeCv,
    unlikeCv,
    fetchLikedCvFromApi,
    removeLikedCv, // Add the removeLikedVacancy function to the context
  };

  return (
    <LikedCvContext.Provider value={value}>{children}</LikedCvContext.Provider>
  );
};

export const useLikedCv = () => {
  const context = useContext(LikedCvContext);
  if (!context) {
    throw new Error('useLikedCv must be used within a LikedCvProvider');
  }
  return context;
};