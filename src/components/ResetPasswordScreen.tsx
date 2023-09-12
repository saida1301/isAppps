import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Image, StyleSheet, Pressable, Text, ActivityIndicator, useColorScheme } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '../assets/themes';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isDarkMode = useColorScheme();
  const handleResetPassword = () => {
    setIsLoading(true);
    axios.post('https://movieappi.onrender.com/reset-password', { email, code, password })
      .then((response) => {
        setIsSuccessModalVisible(true);
        setTimeout(() => {
          setIsSuccessModalVisible(false);
          navigation.navigate('login'); // Navigate to the login screen
        }, 1000);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = error.response.data.errors.map((err) => err.msg);
          Alert.alert('Error', errorMessages.join('\n'));
        } else {
          Alert.alert('Error', 'An error occurred.');
        }
      });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('AwesomeProject/src/assets/images/1İŞ.az.png')}
          style={styles.logo}
        />
      </View>
      <TextInput
        placeholder={t('code')} // Translate placeholder
        value={code}
        onChangeText={(text) => setCode(text)}
        style={styles.input}
      />
      <TextInput
        placeholder={t('new_password')} // Translate placeholder
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
      />
      <Pressable onPress={handleResetPassword} style={styles.button}>
        <Text style={styles.buttonText}>{t('yenileyin')}</Text> 
      </Pressable>

      {isLoading &&           <ActivityIndicator color={isDarkMode === 'dark' ? 'white' : 'white'} size={'small'} />}

      {isSuccessModalVisible && (
        <LottieView
          source={require('../animations/success.json')}
          autoPlay
          loop={false}
          style={{ width: 100, height: 100 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.medium,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  logo: {
    position: 'absolute',
    width: 200,
    height: 60,
    bottom:30,
    resizeMode:"contain"
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: borderRadius.small,
    fontSize: fontSizes.medium,
    borderColor: colors.black + '60',
    color: colors.black,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    marginBottom: spacing.medium,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    padding: spacing.medium,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.medium,
  },
});

export default ResetPasswordScreen;
