import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelimMainScreen from '../../screens/TelimMainScreen';
import TelimInnerPage from '../../components/TelimInnerPage';

const TelimStack = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator screenOptions={{
          headerShown:false
        }
        }>
      <Stack.Screen name="Telim" component={TelimMainScreen} />
      <Stack.Screen name="TelimInner" component={TelimInnerPage} />
      </Stack.Navigator>
    );
}

export default TelimStack

const styles = StyleSheet.create({})