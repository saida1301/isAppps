import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { colors } from '../assets/themes';

const LoadingScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for 2 seconds, then stop the indicator
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
      <ActivityIndicator size="large" color={colors.primary} animating={isLoading} />

      {/* Optionally, you can display a text while loading */}
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Set your desired dark background color here
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: 'white', // Set text color to white or any other contrasting color for better visibility on the dark background
  },
});

export default LoadingScreen;
