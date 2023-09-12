import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CvScreen from '../../screens/CvScreen';
import CvInner from '../../components/CvInner';

const CvStack = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator screenOptions={{
          headerShown:false
        }
        }>
      <Stack.Screen name="CV" component={CvScreen} />
      <Stack.Screen name="CvInner" component={CvInner} />
      </Stack.Navigator>
    );
}


export default CvStack

const styles = StyleSheet.create({})