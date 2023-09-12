import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import CompanyList from '../../screens/CompanyList';
import VacanciesScreen from '../../screens/VacanciesScreen';
import Vacancies from '../../components/Vacancies';
import VacanCIesInner from '../../components/VacanciesInner';
import AboutCompanyMain from '../../components/AboutCompanyMain';
import AboutCompany from '../../components/AboutCompany';
import CategoryVacancies from '../../components/CategoryVacancies';
import ProfileStack from './ProfileStack';
import SwipeContent from '../../components/SwipeContent';
import CompanySearchScreen from '../../components/CompanySearchScreen';
import FavoritesScreen from '../../FavoritesScreen';

const HomeSctack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="aboutCompanyMain" component={AboutCompanyMain} />
      <Stack.Screen name="aboutCompany" component={AboutCompany} />
      <Stack.Screen name="AllVacancies" component={VacanciesScreen} />
      <Stack.Screen name="VacancyInner" component={VacanCIesInner} />
      <Stack.Screen  options={{
          headerShown: false,
        }} name="CategoryInner" component={CategoryVacancies} />
            <Stack.Screen  options={{
          headerShown: false,
        }} name="ProfileStack" component={ProfileStack} />

  <Stack.Screen name="swipe" component={SwipeContent} />
  <Stack.Screen name="Favorites" component={FavoritesScreen} />
 <Stack.Screen name="CompanySearchScreen" component={CompanySearchScreen} />
    </Stack.Navigator>
  );
};

export default HomeSctack;

const styles = StyleSheet.create({});