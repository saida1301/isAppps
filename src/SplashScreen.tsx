import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated, useColorScheme } from 'react-native';
import { colors } from './assets/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDarkMode = useColorScheme() === 'dark'; // Detect dark mode

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('login');
    });
  }, [fadeAnim, navigation]);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        navigation.navigate('login');
      }
    };
    checkLoggedInStatus();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.black : colors.white }]}>
      <Animated.Image
        source={require('AwesomeProject/src/assets/images/1İŞ.az.png')}
        style={[styles.image, { opacity: fadeAnim }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
