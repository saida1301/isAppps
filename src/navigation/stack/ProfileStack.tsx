import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import ProfileButons from '../../components/ProfileButtons';
import AddCompanyModal from '../../components/AddCompanyModal';
import AddCvForm from '../../components/AddCvForm';
import AddTrainingComponent from '../../components/AddTrainingComponent';
import MyCvs from '../../components/MyCvs';
import MyCompanies from '../../components/MyCompanies';
import AddVacancyComponent from '../../components/AddVacancyComponent';
import CustomHeader from '../../components/CustomHeader';
import TabNavigator from '../tabs/TabNavigator';
import LoginScreen from '../../screens/Auth/LoginScreen';
import CvInner from '../../components/CvInner';
import VacanCIesInner from '../../components/VacanciesInner';
import TelimInnerPage from '../../components/TelimInnerPage';



const ProfileStack = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
  
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ProfileS" component={ProfileButons} />
        <Stack.Screen name="AddCompany" component={AddCompanyModal} />
        <Stack.Screen name="AddCv" component={AddCvForm} />
        <Stack.Screen name="AddCTraining" component={AddTrainingComponent} />
        <Stack.Screen name="AddVacancy" component={AddVacancyComponent} />
        <Stack.Screen name="MyCv" component={MyCvs} />
        <Stack.Screen name="MyCompany" component={MyCompanies} />
        <Stack.Screen name="Header" component={CustomHeader} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="CvInner" component={CvInner} />
        <Stack.Screen name= "VacancyInnerr" component={VacanCIesInner}/>
        <Stack.Screen name="TelimInner" component={TelimInnerPage} />
      </Stack.Navigator>
  )
}

export default ProfileStack

const styles = StyleSheet.create({})