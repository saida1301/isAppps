import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchInput from '../../components/Input/SearchInput';
import CompanySearchScreen from '../../components/CompanySearchScreen';

const SearchStack = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator screenOptions={{
          headerShown:false
        }
        }>
             <Stack.Screen  name="CompanySearch" component={CompanySearchScreen} />
             <Stack.Screen  name="Search" component={SearchInput} />
  </Stack.Navigator>
  )
}

export default SearchStack

const styles = StyleSheet.create({})