import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import AboutCompanyMain from '../../components/AboutCompanyMain';
import AboutCompany from '../../components/AboutCompany';
import CompanyList from '../../screens/CompanyList';


const CompanyStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{
        headerShown:false
      }
      }>
  
      <Stack.Screen name="Companies" component={CompanyList}/>
      <Stack.Screen name="aboutCompany" component={AboutCompany} />
      <Stack.Screen name="aboutCompanyMain" component={AboutCompanyMain} />

    </Stack.Navigator>
  );
};

export default CompanyStack;

const styles = StyleSheet.create({});
