import {StyleSheet} from 'react-native';
import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';


import TabNavigator from './tabs/TabNavigator';
import CompanyStack from './stack/CompanyStack';
import VacancyStack from './stack/VacancyStack';
import SplashScreen from '../SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import Register from '../screens/Auth/Register';


import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import TelimStack from './stack/TelimStack';
import LoginStack from './stack/LoginStack';
import CompanySearchScreen from '../components/CompanySearchScreen';
import CategoryVacancies from '../components/CategoryVacancies';
import ProfileStack from './stack/ProfileStack';
import SearchStack from './stack/SearchStack';
import SplashStack from './stack/SplashStack';
import SwipeContent from '../components/SwipeContent';

const Stack = createNativeStackNavigator();

const index = () => {
  return (
    <Stack.Navigator>
                    <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="LoginStack"
        component={SplashStack}
      />
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
        name="Tabs"
        component={TabNavigator}
      />


      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="CompanyStack"
        component={CompanyStack}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="VacancyStack"
        component={VacancyStack}
      />
          <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="TelimStack"
        component={TelimStack}
      />
           <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ProfileStack"
        component={ProfileStack}
      />
              <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SearchStack"
        component={SearchStack}
      />

      <Stack.Screen name="Home" component={HomeScreen} />




 
    </Stack.Navigator>
  );
};

export default index;

const styles = StyleSheet.create({});