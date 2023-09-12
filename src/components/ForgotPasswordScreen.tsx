import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, Alert, StyleSheet, Image, ActivityIndicator, useColorScheme } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '../assets/themes';
import { LoadingButton } from './Button';
import style from './Button/style';
import { useTranslation } from 'react-i18next';
import SuccessAnimation from '../animations/success.json';
import LottieView from 'lottie-react-native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const isDarkMode = useColorScheme();

  const handleForgotPassword = () => {
    setIsLoading(true);

    if (!email) {
      Alert.alert(t('email_add'));
      setIsLoading(false);
      return;
    }

    axios.post('https://movieappi.onrender.com/forgot-password', { email })
      .then((response) => {
        setIsSuccessModalVisible(true);
        setTimeout(() => {
          setIsSuccessModalVisible(false);
        }, 1000);
        navigation.navigate('reset');
        setIsLoading(false);
      })
      .catch((error) => {
        Alert.alert('Error', error.response.data.error);
        setIsLoading(false);
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
        style={styles.input}
        placeholder={t('email')}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <Pressable onPress={handleForgotPassword} style={styles.button}>
        {isLoading ? (
          <ActivityIndicator color={isDarkMode === 'dark' ? 'white' : 'white'} size={'small'} />
        ) : (
          <Text style={styles.buttonText}>{t('unut')}</Text>
        )}
      </Pressable>
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
    justifyContent: 'center',
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

export default ForgotPasswordScreen;
