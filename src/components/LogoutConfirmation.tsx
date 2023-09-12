import {Alert, Modal, Pressable, StyleSheet, Text, View, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {colors} from '../assets/themes';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutConfirmation = ({visible, onCancel, onConfirm}: any) => {
  const {t} = useTranslation();
  const isDarkMode = useColorScheme();
  const navigation = useNavigation(); // Initialize the navigation

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'https://movieappi.onrender.com/logout',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );
      onConfirm();
      console.log(response.data);
      if (!response.data) {
        throw new Error('Logout failed');
      }
      await AsyncStorage.setItem('isLoggedIn', 'false');
      await AsyncStorage.setItem('swipeCompleted', 'false');
      // Navigate to the login screen after successful logout
      navigation.navigate('login'); // Replace 'Login' with the actual screen name

      return response.data;
    } catch (error) {
      throw new Error('Logout failed');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modal, {backgroundColor : isDarkMode === 'dark' ? colors.black : colors.white}]}>
          <Text style={[styles.modalText, {color: isDarkMode === 'dark' ? colors.primary : colors.black}]}>{t('logout')}</Text>
          <View style={styles.buttonContainer}>
            {/* Outline button for "No" */}
            <Pressable
              style={[styles.modalButton, styles.backgroundColorButton]}
              onPress={onCancel}>
              <Text style={styles.modalButtonText}>{t('cancel')}</Text>
            </Pressable>
            {/* Background color button for "Yes" */}
            <Pressable
              style={[styles.modalButton, styles.outlineButton]}
              onPress={handleLogout}>
              <Text style={{color: colors.primary}}>{t('out')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutConfirmation;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  backgroundColorButton: {
    backgroundColor: '#8843E1',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 370,
    height: 170,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

    width: '100%',
  },
  modalButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});