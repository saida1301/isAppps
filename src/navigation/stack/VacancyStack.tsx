import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import AboutCompanyMain from '../../components/AboutCompanyMain';
import AboutCompany from '../../components/AboutCompany';
import CompanyList from '../../screens/CompanyList';
import VacanciesScreen from '../../screens/VacanciesScreen';
import Vacancies from '../../components/Vacancies';
import VacanCIesInner from '../../components/VacanciesInner';


const VacancyStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{
        headerShown:false
      }
      }>

<Stack.Screen name="AllVacancies" component={VacanciesScreen} />
      <Stack.Screen name= "VacancyInner" component={VacanCIesInner}/>
  
   
    </Stack.Navigator>
  );
};

export default VacancyStack;

const styles = StyleSheet.create({});
