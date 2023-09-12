import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BlogInner from '../../components/BlogInner';
import BlogScreen from '../../screens/BlogScreen';

const BlogStack = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator screenOptions={{
          headerShown:false
        }
        }>
     
      <Stack.Screen name= "Blog" component = {BlogScreen}/>
      <Stack.Screen name="blogInner" component = {BlogInner}/>
      </Stack.Navigator>
    );
}

export default BlogStack

const styles = StyleSheet.create({})