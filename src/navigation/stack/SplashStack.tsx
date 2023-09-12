import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../../SplashScreen';
import LoginScreen from '../../screens/Auth/LoginScreen';
import Register from '../../screens/Auth/Register';
import HomeScreen from '../../screens/HomeScreen';
import SwipeContent from '../../components/SwipeContent';
import VacanCIesInner from '../../components/VacanciesInner';
import FavoritesScreen from '../../FavoritesScreen';
import ForgotPasswordScreen from '../../components/ForgotPasswordScreen';
import ResetPasswordScreen from '../../components/ResetPasswordScreen';


const SplashStack = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }} initialRouteName='splash'>
     
  
 
        <Stack.Screen name="splash" component={SplashScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={Register} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="swipe" component={SwipeContent}/>
      <Stack.Screen name="forgot" component={ForgotPasswordScreen} />
                <Stack.Screen name="reset-password" component={ResetPasswordScreen} />
                <Stack.Screen name="VacancyInner" component={VacanCIesInner}/>
                <Stack.Screen name="Favorites" component={FavoritesScreen}/>
                <Stack.Screen name="reset" component={ResetPasswordScreen} />
      </Stack.Navigator>
    );
}

export default SplashStack

const styles = StyleSheet.create({})