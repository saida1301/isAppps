import React, { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import AuthHeader from '../components/AuthHeader';
import CaruselSlider from '../components/CaruselSlider';
import CategoryItem from '../components/CategoryItem';
import Companies from '../components/Companies';
import CustomHeader from '../components/CustomHeader';
import StoryComponent from '../components/StoryComponent';
import Vacancies from '../components/Vacancies';

import { colors, fontSizes, fontWeights } from '../assets/themes';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import VacancyList from '../components/VacancyList';

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [vacancies, setVacancies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const imageSource = isDarkMode 
  ? require('AwesomeProject/src/assets/images/light.png')
  : require('AwesomeProject/src/assets/images/dark.png');

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const [vacanciesResponse, companiesResponse, categoriesResponse] = await Promise.all([
          await axios.get('https://movieappi.onrender.com/vacancies', {
            params: {
              page: 1,
              pageSize: 4,
            },
          }),
         await axios.get('https://movieappi.onrender.com/companies'),
         await axios.get('https://movieappi.onrender.com/categories-with-count'),
        ]);

        setVacancies(vacanciesResponse.data);
        setCompanies(companiesResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // useEffect(() => {
  //   // Simulate loading delay
  //   const timeout = setTimeout(() => {
  //     setLoading(false);
  //   }, 4000); // 10 seconds

  //   return () => clearTimeout(timeout);
  // }, []);

  const handlePresss = () => {
    navigation.navigate('CompanySearchScreen');
  };
  if (loading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView style={{ backgroundColor: isDarkMode ? '#131313' : '#F4F9FD' }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? 'white' : 'black'} />
        </View>
      ) : (
        <>
          <CustomHeader />
          <TouchableOpacity onPress={handlePresss} style={{ marginHorizontal: 20 }}>
          <Image
    source={imageSource}
    style={styles.logoImage}
  />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <StoryComponent />
            </View>
          </View>
          <AuthHeader title={t('popular')} textColor={isDarkMode ? 'white' : 'black'} />
          <View style={{ marginVertical: 20 }}>
            <CategoryItem />
          </View>
          <AuthHeader title={t('sirketler')} textColor={isDarkMode ? 'white' : 'black'} />
          <Companies />
          <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
            {t('new_vacancy')}
          </Text>
          <Vacancies />
        </>
      )}
    </ScrollView>

  );}
};

export default HomeScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: 7,
    paddingTop: 10,
    fontSize: fontSizes.medium,
    alignSelf: 'center',
    fontWeight: fontWeights.bold,
  },
  logoImage: {
    width: '100%',
    height: 70,
 resizeMode:"contain"  

  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});