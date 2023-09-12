import { Image, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Total = () => {
  const [user_id, setUserId] = useState('');
  const [vacanciesCount, setVacanciesCount] = useState(0);
  const [cvCount, setCvCount] = useState(0);
  const {t} = useTranslation();
  const email = useSelector((state) => state.auth.email);
const isDarkMode = useColorScheme()  === 'dark'
useEffect(() => {
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
        const loggedInUser = data.find(user => user.email === email);

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

  fetchUserId();
}, [email]);

  useEffect(() => {
    const fetchVacanciesCount = async () => {
      try {
        const response = await axios.get(
          `https://movieappi.onrender.com/vacancy/${user_id}`
        );
        const vacanciesData = await response.data;
        setVacanciesCount(vacanciesData.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVacanciesCount();
  }, [user_id]);

  useEffect(() => {
    const fetchCvCount = async () => {
      try {
        const response = await axios.get(
          `https://movieappi.onrender.com/civ/${user_id}`
        );
        const vacanciesData = await response.data;
        setCvCount(vacanciesData.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCvCount();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <View style={[styles.card, {    backgroundColor: isDarkMode  ? "#1B1523" : "white",}]}>
          <View style={styles.centerContent}>
            <Image
              source={require('AwesomeProject/src/assets/images/elam.webp')}
              style={styles.image}
            />
            <Text style={styles.text}>{vacanciesCount} {t('elan')}</Text>
          </View>
        </View>
        <View style={[styles.card, {    backgroundColor: isDarkMode  ? "#1B1523" : "white",}]}>
          <View style={styles.centerContent}>
            <Image
              source={require('AwesomeProject/src/assets/images/note.webp')}
              style={styles.image}
            />
            <Text style={styles.text}>{cvCount} {t('cv')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 90,
 // Center the cards horizontally
  },
  card: {
    maxWidth: 370,
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 50,
    resizeMode: "contain"
  },
  text: {
    color: '#9559E5',
    marginTop: 10,
    textAlign: 'center',
  },
});


export default Total;