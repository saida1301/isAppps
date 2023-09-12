import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  TextInput,
  Button,
  Text,
  Pressable,
  useColorScheme,
  Modal,
  StyleSheet,
} from 'react-native';
import SuccessAnimation from '../animations/success.json';
import LottieView from 'lottie-react-native';
import { borderRadius, colors, spacing } from '../assets/themes';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = () => {
    const requestBody = {
      name: name,
      surname: surname,
      email: email,
      phone: phone,
      message: message,
    };

    fetch('https://movieappi.onrender.com/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        console.log(data);
        // Reset the form
        setName('');
        setSurname('');
        setEmail('');
        setPhone('');
        setMessage('');
        setIsSuccessModalVisible(true);
        setTimeout(() => {
          setIsSuccessModalVisible(false);
        }, 1000);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  return (
    <View style={{ marginHorizontal: 20 }}>
      <Text style={{ marginTop: 12,  color: isDarkMode ? 'white' : 'black' }}>
        {t('name')}
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#E8E8E8' : '#2E2C2C',
          color: isDarkMode ? 'white' : 'black',
        }}
      />
      <Text style={{ marginTop: 12, color: isDarkMode ? 'white' : 'black' }}>
        {t('surname')}
      </Text>
      <TextInput
        value={surname}
        onChangeText={setSurname}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#E8E8E8' : '#2E2C2C',
          color: isDarkMode ? 'white' : 'black',
        }}
      />
      <Text style={{ marginTop: 12,  color: isDarkMode ? 'white' : 'black' }}>
        {t('email')}
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#E8E8E8' : '#2E2C2C',
          color: isDarkMode ? 'white' : 'black',
        }}
        keyboardType='email-address'
      />
      <Text style={{ marginTop: 12,  color: isDarkMode ? 'white' : 'black' }}>
        {t('number')}
      </Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#E8E8E8' : '#2E2C2C',
          color: isDarkMode ? 'white' : 'black',
        }}
        keyboardType='phone-pad'
      />
      <Text style={{ marginTop: 12, color: isDarkMode ? 'white' : 'black' }}>
        {t('mesaj')}
      </Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#E8E8E8' : '#2E2C2C',
          color: isDarkMode ? 'white' : 'black',
        }}
        placeholder={t('write_mesaj')}
        placeholderTextColor={isDarkMode ? '#E8E8E8' : '#2E2C2C'}
      />
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 15,
          gap: 10,
          width: 160,
          height: 54,
          backgroundColor: '#8843E1',
          borderRadius: 5,
          alignContent: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 20,
          elevation: 5,
          marginBottom: 5,
        }}
        onPress={handleSubmit}
        android_ripple={{ color: '#fff', borderless: false }}
      >
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            color: '#FDFDFD',
            fontSize: 16,
            fontWeight: '500',
            marginRight: 20,
          }}
        >
          {t('send')}
        </Text>
      </Pressable>
      <Modal visible={isSuccessModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <LottieView
              source={SuccessAnimation}
              style={styles.animation}
              autoPlay={true}
              loop={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.small,
    padding: spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 150,
    height: 150,
  },
});

export default ContactForm;
